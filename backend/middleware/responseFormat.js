// Standardized response formats for API

export const successResponse = (data, message = "Success", statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode,
})

export const errorResponse = (message, statusCode = 400, details = null) => ({
  success: false,
  message,
  statusCode,
  ...(details && { details }),
})

export const paginatedResponse = (data, pagination, message = "Success") => ({
  success: true,
  message,
  data,
  pagination,
})

// Middleware for standardized responses
export function errorHandler(err, req, res, next) {
  console.error("Error:", err)

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json(errorResponse(message, statusCode))
}

export function notFoundHandler(req, res) {
  res.status(404).json(errorResponse("Endpoint tidak ditemukan", 404))
}
