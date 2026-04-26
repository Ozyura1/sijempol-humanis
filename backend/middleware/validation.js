// Request validation middleware
export function validateBody(requiredFields) {
  return (req, res, next) => {
    const missing = []
    
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        missing.push(field)
      }
    }
    
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Field wajib diisi: ${missing.join(", ")}`,
        missing,
      })
    }
    
    next()
  }
}

// Validate submission data structure
export function validateSubmissionData(req, res, next) {
  const { applicant_name, data } = req.body
  
  if (!applicant_name || typeof applicant_name !== "string") {
    return res.status(400).json({
      message: "applicant_name harus berisi text dan tidak boleh kosong"
    })
  }
  
  if (applicant_name.length < 3) {
    return res.status(400).json({
      message: "applicant_name minimal 3 karakter"
    })
  }
  
  if (data && typeof data !== "object") {
    return res.status(400).json({
      message: "data harus berisi object"
    })
  }
  
  next()
}

// Validate status change
export function validateStatusChange(req, res, next) {
  const { new_status } = req.body
  
  const validStatuses = ["pending", "verifying", "approved", "rejected", "completed", "deleted"]
  
  if (!new_status) {
    return res.status(400).json({
      message: "new_status wajib diisi"
    })
  }
  
  if (!validStatuses.includes(new_status)) {
    return res.status(400).json({
      message: `new_status harus salah satu dari: ${validStatuses.join(", ")}`
    })
  }
  
  next()
}

// Validate password
export function validatePassword(req, res, next) {
  const { password, newPassword } = req.body
  const pwd = password || newPassword
  
  if (!pwd) {
    return res.status(400).json({
      message: "Password wajib diisi"
    })
  }
  
  if (pwd.length < 6) {
    return res.status(400).json({
      message: "Password minimal 6 karakter"
    })
  }
  
  next()
}

// Validate email
export function validateEmail(req, res, next) {
  const { email } = req.body
  
  if (email && typeof email === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format email tidak valid"
      })
    }
  }
  
  next()
}
