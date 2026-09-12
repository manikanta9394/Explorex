export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(error, req, res, _next) {
  const status = error.statusCode || (error.name === 'ValidationError' ? 400 : 500)
  const message = status === 500 ? 'An unexpected server error occurred' : error.message
  if (status === 500) console.error(error)
  res.status(status).json({ error: message })
}
