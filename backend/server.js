import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import authRoutes from "./routes/auth.js"
import agendaRoutes from "./routes/agendas.js"
import aspirasiRoutes from "./routes/aspirasis.js"
import resourceRoutes from "./routes/resources.js"
import addressRoutes from "./routes/addresses.js"
import adminDatabaseRoutes from "./routes/adminDatabase.js"
import db, { nextId } from "./db.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Configure CORS
const explicitOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://sijempolhumanis.web.id",
  "https://www.sijempolhumanis.web.id",
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
].filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true

  if (explicitOrigins.includes(origin)) {
    return true
  }

  try {
    const parsed = new URL(origin)
    const hostname = parsed.hostname

    if (hostname === "sijempolhumanis.web.id" || hostname.endsWith(".sijempolhumanis.web.id")) {
      return true
    }

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".local")
    ) {
      return true
    }
  } catch {
    return false
  }

  return false
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS not allowed for origin: ${origin || "unknown"}`))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "SiJempol Humanis backend is running." })
})

app.use("/api/auth", authRoutes)
app.use("/api/agendas", agendaRoutes)
app.use("/api/aspirasis", aspirasiRoutes)
app.use("/api/addresses", addressRoutes)
app.use("/api/admin/database", adminDatabaseRoutes)
app.use("/api/id-cards", resourceRoutes("id_cards"))
app.use("/api/births", resourceRoutes("births"))
app.use("/api/deaths", resourceRoutes("deaths"))
app.use("/api/marriages", resourceRoutes("marriages"))
app.use("/api/moves", resourceRoutes("moves"))
app.use("/api/family-cards", resourceRoutes("family_cards"))

app.use((err, req, res, next) => {
  if (err?.type === "entity.too.large" || err?.status === 413) {
    return res.status(413).json({
      message:
        "Ukuran file terlalu besar untuk diproses. Silakan kecilkan file atau gunakan file dengan resolusi lebih rendah.",
    })
  }

  return next(err)
})

// Seed admin user on startup
async function seedAdminUser() {
  await db.read()

  // Ensure db.data is initialized
  if (!db.data) {
    db.data = {
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
    }
  }

  const adminEmail = "admin@disdukcapil.go.id"
  const adminUsername = "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  const existingAdmin = db.data.users.find((user) => user.username === adminUsername || user.email === adminEmail)

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10)
    const admin = {
      id: nextId("users"),
      username: adminUsername,
      password: hashedPassword,
      name: "Admin Disdukcapil",
      email: adminEmail,
      role: "admin",
      created_at: new Date().toISOString(),
    }
    db.data.users.push(admin)
    await db.write()
    console.log(`✓ Admin user created: ${adminEmail}`)
  } else if (existingAdmin.role !== "admin") {
    // Ensure existing user has admin role
    existingAdmin.role = "admin"
    await db.write()
    console.log(`✓ Admin role assigned to: ${adminEmail}`)
  } else {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
  }
}

app.listen(port, async () => {
  await seedAdminUser()
  console.log(`Backend listening at http://localhost:${port}`)
})
