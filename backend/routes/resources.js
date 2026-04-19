import express from "express"
import db, { nextId } from "../db.js"
import { authenticate } from "./authMiddleware.js"

const allowedResources = [
  "id_cards",
  "births",
  "deaths",
  "marriages",
  "moves",
  "family_cards",
]

function createResourceRouter(collectionName) {
  if (!allowedResources.includes(collectionName)) {
    throw new Error(`Resource '${collectionName}' tidak didukung.`)
  }

  const router = express.Router()
  router.use(authenticate)

  router.get("/", async (req, res) => {
    await db.read()
    const list = [...db.data[collectionName]].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    res.json(list)
  })

  router.post("/", async (req, res) => {
    const { applicant_name, status, data } = req.body
    if (!applicant_name) {
      return res.status(400).json({ message: "applicant_name wajib diisi." })
    }

    await db.read()
    const item = {
      id: nextId(collectionName),
      applicant_name,
      status: status || "pending",
      data: data || {},
      created_at: new Date().toISOString(),
    }
    db.data[collectionName].push(item)
    await db.write()
    res.status(201).json(item)
  })

  router.get("/:id", async (req, res) => {
    await db.read()
    const item = db.data[collectionName].find((record) => record.id === Number(req.params.id))
    if (!item) return res.status(404).json({ message: "Data tidak ditemukan." })
    res.json(item)
  })

  router.put("/:id", async (req, res) => {
    const { applicant_name, status, data } = req.body
    await db.read()
    const index = db.data[collectionName].findIndex((record) => record.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan." })

    const existing = db.data[collectionName][index]
    db.data[collectionName][index] = {
      ...existing,
      applicant_name: applicant_name ?? existing.applicant_name,
      status: status ?? existing.status,
      data: data ?? existing.data,
    }
    await db.write()
    res.json(db.data[collectionName][index])
  })

  router.delete("/:id", async (req, res) => {
    await db.read()
    const initialLength = db.data[collectionName].length
    db.data[collectionName] = db.data[collectionName].filter((record) => record.id !== Number(req.params.id))
    if (db.data[collectionName].length === initialLength) return res.status(404).json({ message: "Data tidak ditemukan." })
    await db.write()
    res.json({ message: "Item dihapus." })
  })

  return router
}

export default createResourceRouter
