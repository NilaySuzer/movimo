import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI ortam değişkeni .env dosyasında bulunamadı!');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Bağlantı Hatası:', error);
    process.exit(1);
  }
};