require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const PRIMARY_URI = process.env.MONGODB_URI;
const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/visitor_db';

let dbStatus = {
  connected: false,
  type: 'none',
  error: null,
};

// Enable CORS for all origins and methods
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbStatus,
  });
});

// Serve frontend static files in production if dist exists
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Visitor Registration API is running',
      database: dbStatus,
    });
  });
}

// 404 handler for unmatched routes - always returns JSON
app.use((req, res) => {
  res.status(404).json({
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global JSON error handler (e.g. invalid JSON payload, uncaught exceptions)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

// Robust database connection with quick fallback
async function initDatabase() {
  if (PRIMARY_URI) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(PRIMARY_URI, {
        serverSelectionTimeoutMS: 3000, // 3s timeout for Atlas
      });
      dbStatus = { connected: true, type: 'MongoDB Atlas', error: null };
      console.log('Connected to MongoDB Atlas successfully!');
      return;
    } catch (err) {
      console.warn('MongoDB Atlas connection failed:', err.message);
      console.log('Notice: Make sure your current IP address is whitelisted in MongoDB Atlas (0.0.0.0/0).');
      console.log('Switching to local MongoDB fallback:', LOCAL_FALLBACK_URI);
    }
  }

  // Fallback to local MongoDB
  try {
    await mongoose.connect(LOCAL_FALLBACK_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    dbStatus = { connected: true, type: 'Local MongoDB (127.0.0.1:27017)', error: null };
    console.log('Connected to Local MongoDB successfully!');
  } catch (localErr) {
    dbStatus = { connected: false, type: 'failed', error: localErr.message };
    console.error('All database connection attempts failed:', localErr.message);
  }
}

// Start listening on default dual-stack interface so localhost (IPv6 ::1 and IPv4 127.0.0.1) both work
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  initDatabase();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another process.`);
    console.error(`To free port ${PORT}, run:\n   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
  } else {
    console.error('Server error:', err);
  }
});
