import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const jwtSecret = process.env.JWT_SECRET || "secret"
const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret"

// Token blacklist for logout (in production, use Redis)
const tokenBlacklist = new Set()

export function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, {
    expiresIn: "1h",
  })
  
  const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, refreshSecret, {
    expiresIn: "7d",
  })

  return { accessToken, refreshToken }
}

export function generateToken(user) {
  return generateTokens(user).accessToken
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Check if token is blacklisted (logged out)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token has been invalidated" })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export function blacklistToken(token) {
  tokenBlacklist.add(token)
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshSecret)
  } catch (error) {
    return null
  }
}
