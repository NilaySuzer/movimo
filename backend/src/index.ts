import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'CineNest API sorunsuz çalışıyor 🚀' });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde hazır!`);
});