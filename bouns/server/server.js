// server.js - Layered Architecture Entry Point
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./src/presentation/routes/studentRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware พื้นฐาน
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // (เผื่อไว้สำหรับโจทย์ Bonus ในอนาคต)

// Routes
app.use('/api/students', studentRoutes);

// Error Handling Middleware (ต้องวางไว้ท้ายสุดหลัง Routes)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Student Management System running on http://192.168.56.111:${PORT}`);
    console.log(`📂 Architecture: Layered (3-Tier)`);
});