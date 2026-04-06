const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io initialization (to be moved to specific service)
io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);
  
  socket.on('join_contract', (contractId) => {
    socket.join(`contract_${contractId}`);
    console.log(`User ${socket.id} joined contract: ${contractId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Attach io to request object for easy access in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'GigSphere API is running' });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/gigs', require('./routes/gig.routes'));
app.use('/api/proposals', require('./routes/proposal.routes'));
app.use('/api/contracts', require('./routes/contract.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err);
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = httpServer;
