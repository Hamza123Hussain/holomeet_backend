import express from 'express'
import { createServer } from 'http' // Use the createServer function from the 'http' module
import { Server } from 'socket.io' // Import Server from 'socket.io'
import { PORT } from './Config.js'
const app = express()
// Create an HTTP server
const server = createServer(app)
// Create a Socket.IO instance attached to the server
const io = new Server(server)

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // Handle custom signaling events here
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server with Socket.IO is running on port ${PORT}`)
})
