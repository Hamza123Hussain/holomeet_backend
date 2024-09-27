import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PORT } from './Config.js'
import { FileShare } from './DB/Controllers/FileShare.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

app.use(cors())
app.use(express.json())

// Sample route to test if the server is running
app.get('/', (req, res) => {
  res.send('HoloMeet API is running')
})

// File upload handling via Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('file-upload', async (file) => {
    try {
      const fileurl = await FileShare(file) // Call the FileShare function directly
      io.emit('file-shared', { fileurl }) // Emit the file URL to all clients
    } catch (error) {
      console.error('File upload error:', error)
      socket.emit('file-upload-error', { error: error.message }) // Send error message back to the client
    }
  })

  // WebRTC signaling logic using Socket.IO
  socket.on('offer', (data) => {
    console.log('Offer received:', data)
    socket.to(data.target).emit('offer', {
      sdp: data.sdp,
      sender: socket.id,
    })
  })

  socket.on('answer', (data) => {
    console.log('Answer received:', data)
    socket.to(data.target).emit('answer', {
      sdp: data.sdp,
      sender: socket.id,
    })
  })

  socket.on('ice-candidate', (data) => {
    console.log('ICE candidate received:', data)
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id,
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Start the server and listen on the specified PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
