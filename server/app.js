import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passwordRoutes from './routes/passwordRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/passwords', passwordRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('🟢 Connected to MongoDB');
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch(err => console.error('MongoDB error:', err));

// Debug log
console.log('CLERK KEY:', process.env.CLERK_API_KEY);
console.log('ENCRYPTION KEY:', process.env.ENCRYPTION_KEY);
console.log('DATABASE URL:', process.env.DATABASE_URL);
