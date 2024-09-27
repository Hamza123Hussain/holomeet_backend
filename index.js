import express from 'express' // Import express for creating the server
import http from 'http' // Import http for creating the server
import { Server } from 'socket.io' // Import Socket.IO for real-time communication
import cors from 'cors' // Import CORS for cross-origin request handling
import { PORT } from './Config.js' // Import PORT from your configuration

const app = express() // Create an instance of express (the main application)
const server = http.createServer(app) // Create an HTTP server using express

// Initialize Socket.IO with the server and configure CORS (cross-origin resource sharing)
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (can restrict to specific domains in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only GET and POST methods
  },
})

app.use(cors()) // Enable CORS for all routes in the app
app.use(express.json()) // Enable the app to parse incoming JSON requests

// Sample route to test if the server is running
app.get('/', (req, res) => {
  res.send('HoloMeet API is running') // Respond with a simple message
})

// WebRTC signaling logic using Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id) // Log when a user connects to the server

  /**
   * Handling the WebRTC offer event
   * The 'offer' is sent by the initiating peer in the WebRTC connection
   * This event is triggered when a peer sends an offer to start a WebRTC connection
   */
  socket.on('offer', (data) => {
    console.log('Offer received:', data) // Log the offer data received from the client

    // Forward the offer to the target peer specified in the data
    socket.to(data.target).emit('offer', {
      sdp: data.sdp, // SDP (Session Description Protocol) data is required to initiate a WebRTC connection
      sender: socket.id, // Include the sender's socket ID for response tracking
    })
  })

  /**
   * Handling the WebRTC answer event
   * The 'answer' is sent by the receiving peer in response to an offer
   * This event is triggered when the target peer sends an answer to the offer
   */
  socket.on('answer', (data) => {
    console.log('Answer received:', data) // Log the answer data received from the client

    // Forward the answer to the original offer sender
    socket.to(data.target).emit('answer', {
      sdp: data.sdp, // SDP answer to complete the WebRTC handshake
      sender: socket.id, // Include the sender's socket ID for response tracking
    })
  })

  /**
   * Handling the ICE candidate event
   * ICE (Interactive Connectivity Establishment) candidates are sent during WebRTC negotiation
   * This event is triggered when a peer finds an ICE candidate to help establish a connection
   */
  socket.on('ice-candidate', (data) => {
    console.log('ICE candidate received:', data) // Log the ICE candidate data

    // Forward the ICE candidate to the other peer
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate, // The ICE candidate needed for establishing the peer connection
      sender: socket.id, // Include the sender's socket ID for response tracking
    })
  })

  /**
   * Handle user disconnection
   * This event is triggered when a user disconnects from the WebSocket (e.g., closes the tab)
   */
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id) // Log the user's disconnection
  })
})

// Start the server and listen on the specified PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) // Log that the server is up and running
})
