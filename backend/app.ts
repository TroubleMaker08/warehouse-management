import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pickListRoutes from './routes/pickListRoutes';
import packingListRoutes from './routes/packingListRoutes';

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// Routes
const API_PREFIX = process.env.API_PREFIX || '/api';
app.use(API_PREFIX + '/pick-list', pickListRoutes);
app.use(API_PREFIX + '/packing-list', packingListRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

export default app; // For testing
