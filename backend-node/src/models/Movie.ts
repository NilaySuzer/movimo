import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  director: string;
  releaseYear: number;
  genre: string[];
  posterUrl: string;
  summary: string;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Film başlığı zorunludur.'],
      trim: true,
    },
    director: {
      type: String,
      required: [true, 'Yönetmen adı zorunludur.'],
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: [true, 'Yayın yılı zorunludur.'],
    },
    genre: {
      type: [String],
      required: true,
      default: [],
    },
    posterUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x450?text=No+Poster',
    },
    summary: {
      type: String,
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);