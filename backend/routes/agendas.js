import express from "express"
import db, { nextId } from "../db.js"
import { authenticate } from "./authMiddleware.js"

const router = express.Router()

router.get("/", async (req, res) => {
  await db.read()
  const items = [...db.data.agendas].sort((a, b) => (a.date < b.date ? 1 : -1))
  res.json(items)
})

router.post("/", authenticate, async (req, res) => {
  const { title, description, date, jam } = req.body
  if (!title) {
    return res.status(400).json({ message: "Title wajib diisi." })
  }

  await db.read()
  const agenda = {
    id: nextId("agendas"),
    title,
    description: description || null,
    date: date || null,
    jam: jam || null,
    created_at: new Date().toISOString(),
  }
  db.data.agendas.push(agenda)
  await db.write()
  res.status(201).json(agenda)
})

router.get("/:id", authenticate, async (req, res) => {
  await db.read()
  const agenda = db.data.agendas.find((item) => item.id === Number(req.params.id))
  if (!agenda) return res.status(404).json({ message: "Agenda tidak ditemukan." })
  res.json(agenda)
})

router.put("/:id", authenticate, async (req, res) => {
  const { title, description, date, jam } = req.body
  await db.read()
  const index = db.data.agendas.findIndex((item) => item.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Agenda tidak ditemukan." })

  const existing = db.data.agendas[index]
  db.data.agendas[index] = {
    ...existing,
    title: title ?? existing.title,
    description: description ?? existing.description,
    date: date ?? existing.date,
    jam: jam ?? existing.jam,
  }
  await db.write()
  res.json(db.data.agendas[index])
})

router.delete("/:id", authenticate, async (req, res) => {
  await db.read()
  const initialLength = db.data.agendas.length
  db.data.agendas = db.data.agendas.filter((item) => item.id !== Number(req.params.id))
  if (db.data.agendas.length === initialLength) return res.status(404).json({ message: "Agenda tidak ditemukan." })
  await db.write()
  res.json({ message: "Agenda dihapus." })
})

export default router
