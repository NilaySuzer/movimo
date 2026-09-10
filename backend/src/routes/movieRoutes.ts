import { Router } from 'express';
import { getMovies, createMovie } from '../controllers/movieController';

const router = Router();

router.route('/')
  .get(getMovies)
  .post(createMovie);

export default router;