import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import apiKeyRoutes from './routes/apiKeys.js';
import { createTables } from './db/setup.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true
}));

// Create database tables if they don't exist
createTables();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/keys', apiKeyRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API Vault Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
