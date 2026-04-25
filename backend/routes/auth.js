import express from "express"
import bcrypt from "bcryptjs"
import db, { nextId } from "../db.js"
import { generateToken, authenticate } from "./authMiddleware.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { username, password, name, email } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." })
  }

  await db.read()
  const exists = db.data.users.find((user) => user.username === username)
  if (exists) {
    return res.status(409).json({ message: "Username sudah terdaftar." })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const user = {
    id: nextId("users"),
    username,
    password: hashedPassword,
    name: name || null,
    email: email || null,
    role: "user",
    created_at: new Date().toISOString(),
  }

  db.data.users.push(user)
  await db.write()

  const responseUser = { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role, created_at: user.created_at }
  return res.status(201).json({ message: "Akun berhasil dibuat.", user: responseUser })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.username === username)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Username atau password salah." })
  }

  const token = generateToken(user)
  return res.json({
    access_token: token,
    user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
  })
})

router.post("/logout", authenticate, (req, res) => {
  return res.json({ message: "Logout sukses." })
})

router.get("/profile", authenticate, async (req, res) => {
  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }
  return res.json({ id: user.id, username: user.username, name: user.name, email: user.email, role: user.role, created_at: user.created_at })
})

router.put("/profile", authenticate, async (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: "Nama dan email wajib diisi." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }

  user.name = name
  user.email = email
  await db.write()

  return res.json({
    message: "Profil berhasil diperbarui.",
    user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
  })
})

router.put("/change-password", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Password lama dan password baru wajib diisi." })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password baru minimal 6 karakter." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).json({ message: "Password lama salah." })
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10)
  user.password = hashedPassword
  await db.write()

  return res.json({ message: "Password berhasil diubah." })
})

export default router
