import fs from "fs"
import path from "path"
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import dotenv from "dotenv"

dotenv.config()

const databasePath = process.env.DATABASE_PATH || "./data/database.json"
const absolutePath = path.resolve(process.cwd(), databasePath)
const dataDir = path.dirname(absolutePath)

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const adapter = new JSONFile(absolutePath)
const db = new Low(adapter)

const defaultData = {
  users: [],
  agendas: [],
  aspirasis: [],
  addresses: [],
  id_cards: [],
  births: [],
  deaths: [],
  marriages: [],
  moves: [],
  family_cards: [],
  otp_requests: [],
}

await db.read()
if (!db.data) {
  db.data = {}
}

let changed = false
for (const [collectionName, defaultValue] of Object.entries(defaultData)) {
  if (!Array.isArray(db.data[collectionName])) {
    db.data[collectionName] = defaultValue
    changed = true
  }
}

if (changed) {
  await db.write()
}

function nextId(collectionName) {
  if (!Array.isArray(db.data[collectionName])) {
    db.data[collectionName] = []
  }

  const collection = db.data[collectionName]
  if (!collection || collection.length === 0) return 1
  return Math.max(...collection.map((item) => item.id)) + 1
}

export default db
export { nextId }
