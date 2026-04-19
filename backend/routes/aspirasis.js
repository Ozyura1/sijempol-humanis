import express from "express"
import db, { nextId } from "../db.js"
import { authenticate } from "./authMiddleware.js"

const router = express.Router()

router.post("/", async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !message) {
    return res.status(400).json({ message: "Nama dan pesan aspirasi wajib diisi." })
  }

  await db.read()
  const aspirasi = {
    id: nextId("aspirasis"),
    name,
    email: email || null,
    message,
    status: "pending",
    created_at: new Date().toISOString(),
  }
  db.data.aspirasis.push(aspirasi)
  await db.write()
  res.status(201).json(aspirasi)
})

router.get("/", authenticate, async (req, res) => {
  await db.read()
  const aspirasis = [...db.data.aspirasis].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  res.json(aspirasis)
})

router.get("/:id", authenticate, async (req, res) => {
  await db.read()
  const aspirasi = db.data.aspirasis.find((item) => item.id === Number(req.params.id))
  if (!aspirasi) return res.status(404).json({ message: "Aspirasi tidak ditemukan." })
  res.json(aspirasi)
})

router.put("/:id", authenticate, async (req, res) => {
  const { status, message } = req.body
  await db.read()
  const index = db.data.aspirasis.findIndex((item) => item.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Aspirasi tidak ditemukan." })

  db.data.aspirasis[index] = {
    ...db.data.aspirasis[index],
    status: status ?? db.data.aspirasis[index].status,
    message: message ?? db.data.aspirasis[index].message,
  }
  await db.write()
  res.json(db.data.aspirasis[index])
})

router.delete("/:id", authenticate, async (req, res) => {
  await db.read()
  const initialLength = db.data.aspirasis.length
  db.data.aspirasis = db.data.aspirasis.filter((item) => item.id !== Number(req.params.id))
  if (db.data.aspirasis.length === initialLength) return res.status(404).json({ message: "Aspirasi tidak ditemukan." })
  await db.write()
  res.json({ message: "Aspirasi dihapus." })
})

export default router
