import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

// @desc    Tüm filmleri getir
// @route   GET /api/movies
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Filmler getirilemedi.', error });
  }
};

// @desc    Yeni film ekle
// @route   POST /api/movies
export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Film eklenemedi.' });
  }
};