// ==========================================
// MAIN SERVER FILE
// ==========================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const paymentRoutes = require('./src/routes/payments');
const subscriptionRoutes = require('./src/routes/subscriptions');
const webhookRoutes = require('./src/webhooks/stripeWebhooks');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================
// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parser - JSON
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: '✅ Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/webhooks', webhookRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ==========================================
// DATABASE CONNECTION & SERVER START
// ==========================================
const startServer = async () => {
  try {
    // Conectar a base de datos
    await connectDB();
    console.log('✅ Database connected');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   STRIPE PAGOS - BACKEND RUNNING       ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                           
║   Environment: ${process.env.NODE_ENV || 'development'}
║   API: http://localhost:${PORT}/api
║   Health: http://localhost:${PORT}/health
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
