import express from "express"
import db, { nextId } from "../db.js"
import { authenticate } from "./authMiddleware.js"

const router = express.Router()

router.get("/", authenticate, async (req, res) => {
  await db.read()
  const addresses = [...db.data.addresses].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  res.json(addresses)
})

router.post("/", authenticate, async (req, res) => {
  const { user_id, address, city, postal_code } = req.body
  if (!user_id || !address) {
    return res.status(400).json({ message: "User ID dan alamat wajib diisi." })
  }

  await db.read()
  const record = {
    id: nextId("addresses"),
    user_id,
    address,
    city: city || null,
    postal_code: postal_code || null,
    created_at: new Date().toISOString(),
  }
  db.data.addresses.push(record)
  await db.write()
  res.status(201).json(record)
})

router.get("/:id", authenticate, async (req, res) => {
  await db.read()
  const address = db.data.addresses.find((item) => item.id === Number(req.params.id))
  if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan." })
  res.json(address)
})

router.put("/:id", authenticate, async (req, res) => {
  const { address, city, postal_code } = req.body
  await db.read()
  const index = db.data.addresses.findIndex((item) => item.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Alamat tidak ditemukan." })

  const existing = db.data.addresses[index]
  db.data.addresses[index] = {
    ...existing,
    address: address ?? existing.address,
    city: city ?? existing.city,
    postal_code: postal_code ?? existing.postal_code,
  }
  await db.write()
  res.json(db.data.addresses[index])
})

router.delete("/:id", authenticate, async (req, res) => {
  await db.read()
  const initialLength = db.data.addresses.length
  db.data.addresses = db.data.addresses.filter((item) => item.id !== Number(req.params.id))
  if (db.data.addresses.length === initialLength) return res.status(404).json({ message: "Alamat tidak ditemukan." })
  await db.write()
  res.json({ message: "Alamat dihapus." })
})

export default router
