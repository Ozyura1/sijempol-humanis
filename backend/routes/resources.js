import express from "express"
import db, { nextId } from "../db.js"
import { authenticate } from "./authMiddleware.js"
import { requireRole } from "../middleware/roleGuard.js"
import { validateSubmissionData, validateStatusChange } from "../middleware/validation.js"

const allowedResources = [
  "id_cards",
  "births",
  "deaths",
  "marriages",
  "moves",
  "family_cards",
]

// Valid status progression
const STATUS_WORKFLOW = {
  pending: ["verifying", "deleted"],
  verifying: ["approved", "rejected"],
  approved: ["completed"],
  rejected: ["pending"],
  completed: [],
  deleted: [],
}

function createResourceRouter(collectionName) {
  if (!allowedResources.includes(collectionName)) {
    throw new Error(`Resource '${collectionName}' tidak didukung.`)
  }

  const router = express.Router()
  router.use(authenticate)

  // GET list - Users see only own, Admins see all
  router.get("/", async (req, res) => {
    await db.read()
    let list = db.data[collectionName] || []
    
    // Filter by user if role is 'user'
    if (req.user.role === "user") {
      list = list.filter((item) => item.user_id === req.user.id)
    }
    
    // Filter by status if query param provided
    if (req.query.status) {
      list = list.filter((item) => item.status === req.query.status)
    }
    
    // Sort by created_at descending
    list = list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    
    // Pagination
    const page = Math.max(1, parseInt(req.query.page || "1", 10))
    const limit = Math.min(100, parseInt(req.query.limit || "10", 10))
    const offset = (page - 1) * limit
    const total = list.length
    const paginatedList = list.slice(offset, offset + limit)
    
    res.json({
      data: paginatedList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  })

  // POST create - Only users can submit
  router.post("/", requireRole("user"), validateSubmissionData, async (req, res) => {
    const { applicant_name, data, documents } = req.body

    await db.read()
    const item = {
      id: nextId(collectionName),
      user_id: req.user.id,
      applicant_name,
      status: "pending",
      data: data || {},
      documents: documents || {},
      reviewed_by: null,
      rejection_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.data[collectionName].push(item)
    await db.write()
    res.status(201).json(item)
  })

  // GET single - Users can see own, Admins can see all
  router.get("/:id", async (req, res) => {
    await db.read()
    const item = db.data[collectionName].find((record) => record.id === Number(req.params.id))
    if (!item) return res.status(404).json({ message: "Data tidak ditemukan." })
    
    // Check authorization
    if (req.user.role === "user" && item.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: tidak bisa mengakses submission orang lain" })
    }
    
    res.json(item)
  })

  // PUT update own submission - Only users, only pending status
  router.put("/:id", requireRole("user"), async (req, res) => {
    const { applicant_name, data, documents } = req.body
    await db.read()
    const index = db.data[collectionName].findIndex((record) => record.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan." })

    const existing = db.data[collectionName][index]
    
    // Check authorization
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: tidak bisa mengubah submission orang lain" })
    }
    
    // Only allow update if status is pending
    if (existing.status !== "pending") {
      return res.status(400).json({ message: "Hanya submission dengan status pending yang bisa diubah" })
    }

    db.data[collectionName][index] = {
      ...existing,
      applicant_name: applicant_name ?? existing.applicant_name,
      data: data ?? existing.data,
      documents: documents ?? existing.documents,
      updated_at: new Date().toISOString(),
    }
    await db.write()
    res.json(db.data[collectionName][index])
  })

  // DELETE soft delete - Users can delete own if pending
  router.delete("/:id", requireRole("user"), async (req, res) => {
    await db.read()
    const index = db.data[collectionName].findIndex((record) => record.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan." })

    const existing = db.data[collectionName][index]
    
    // Check authorization
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: tidak bisa menghapus submission orang lain" })
    }
    
    // Only allow delete if status is pending
    if (existing.status !== "pending") {
      return res.status(400).json({ message: "Hanya submission dengan status pending yang bisa dihapus" })
    }

    db.data[collectionName][index].status = "deleted"
    db.data[collectionName][index].updated_at = new Date().toISOString()
    await db.write()
    res.json({ message: "Submission dihapus." })
  })

  // PUT status transition - Only admins
  router.put("/:id/status", requireRole("admin"), validateStatusChange, async (req, res) => {
    const { new_status } = req.body

    await db.read()
    const index = db.data[collectionName].findIndex((record) => record.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan." })

    const existing = db.data[collectionName][index]
    const currentStatus = existing.status

    // Validate status transition
    const allowedTransitions = STATUS_WORKFLOW[currentStatus] || []
    if (!allowedTransitions.includes(new_status)) {
      return res.status(400).json({
        message: `Transition dari '${currentStatus}' ke '${new_status}' tidak diizinkan. Allowed: ${allowedTransitions.join(", ")}`,
      })
    }

    db.data[collectionName][index] = {
      ...existing,
      status: new_status,
      reviewed_by: req.user.id,
      updated_at: new Date().toISOString(),
    }
    await db.write()
    res.json(db.data[collectionName][index])
  })

  // PUT reject submission - Only admins
  router.put("/:id/reject", requireRole("admin"), async (req, res) => {
    const { rejection_reason } = req.body
    if (!rejection_reason) {
      return res.status(400).json({ message: "rejection_reason wajib diisi" })
    }

    await db.read()
    const index = db.data[collectionName].findIndex((record) => record.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan." })

    const existing = db.data[collectionName][index]
    
    // Can only reject from verifying status
    if (existing.status !== "verifying") {
      return res.status(400).json({ message: "Hanya submission dengan status 'verifying' yang bisa di-reject" })
    }

    db.data[collectionName][index] = {
      ...existing,
      status: "rejected",
      rejection_reason,
      reviewed_by: req.user.id,
      updated_at: new Date().toISOString(),
    }
    await db.write()
    res.json(db.data[collectionName][index])
  })

  return router
}

export default createResourceRouter
