// Role-based access control middleware
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    
    // Check if user has any of the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: insufficient permissions. Required: ${roles.join(" or ")}, Got: ${req.user.role}` 
      })
    }

    next()
  }
}

// Middleware to check if user is admin
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin access required" })
  }

  next()
}

// Middleware to check if user is owner of the resource or admin
export function requireOwnerOrAdmin(userIdField = "user_id") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const isAdmin = req.user.role === "admin"
    const isOwner = req.body && req.body[userIdField] === req.user.id

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: only owner or admin can perform this action" })
    }

    next()
  }
}
