import express from 'express'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default router
