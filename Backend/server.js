// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import MongoDB config
const connectDB = require('./Config/DbConnect');

// Route imports
const authRoutes = require('./Routes/UserRoutes');
const slotRoutes = require('./Routes/SlotRoute');
const marketplaceRoutes = require('./Routes/MarketPlaceRoute');
const swapRoutes = require('./Routes/SwapRoute');

const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(express.json());

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api', marketplaceRoutes);
app.use('/api', swapRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ========== Connect to MongoDB ==========
connectDB();

//  Server start 
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ========== Graceful shutdown ==========
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
