import express from "express"
import db from "../db.js"
import { authenticate } from "./authMiddleware.js"
import { requireAdmin } from "../middleware/roleGuard.js"

const router = express.Router()

const collectionLabels = {
  users: "Users",
  agendas: "Agendas",
  aspirasis: "Aspirasis",
  addresses: "Addresses",
  id_cards: "ID Cards",
  births: "Births",
  deaths: "Deaths",
  marriages: "Marriages",
  moves: "Moves",
  family_cards: "Family Cards",
}

function summarizeRecord(collection, record) {
  switch (collection) {
    case "users":
      return `${record.username || "-"} | ${record.name || "Tanpa nama"} | ${record.role || "-"}` 
    case "agendas":
      return record.title || record.description || "-"
    case "aspirasis":
      return record.message || record.name || "-"
    case "addresses":
      return record.address || "-"
    default:
      return record.applicant_name || record.title || record.name || record.message || "-"
  }
}

function pickStatus(record) {
  return record.status || "-"
}

function sanitizeRecord(collection, record) {
  const base = {
    ...record,
    collection,
    collectionLabel: collectionLabels[collection] || collection,
    summary: summarizeRecord(collection, record),
    statusLabel: pickStatus(record),
  }

  if (collection === "users") {
    const { password, ...safeUser } = base
    return safeUser
  }

  return base
}

router.use(authenticate, requireAdmin)

router.get("/", async (req, res) => {
  await db.read()

  const rows = []
  for (const [collection, items] of Object.entries(db.data || {})) {
    if (!Array.isArray(items)) continue
    for (const item of items) {
      rows.push(sanitizeRecord(collection, item))
    }
  }

  rows.sort((a, b) => {
    const left = new Date(a.updated_at || a.created_at || 0).getTime()
    const right = new Date(b.updated_at || b.created_at || 0).getTime()
    return right - left
  })

  res.json({
    data: rows,
    total: rows.length,
    collections: Object.keys(collectionLabels).map((key) => ({
      key,
      label: collectionLabels[key],
      total: Array.isArray(db.data?.[key]) ? db.data[key].length : 0,
    })),
  })
})

export default router
