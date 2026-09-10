import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import movieRoutes from './routes/movieRoutes';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'CineNest API sorunsuz çalışıyor 🚀' });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde hazır!`);
  });
};

startServer();