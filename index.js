import express from 'express'
import { PORT } from './Config.js'
const app = express()

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
