import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const jwtSecret = process.env.JWT_SECRET || "secret"

export function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, {
    expiresIn: "7d",
  })
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
