// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // O nome do banco 'telemetria_race' é da Questão 9
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/telemetria_race';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB Conectado com sucesso.');
  } catch (err: any) {
    console.error(`Erro ao conectar com o MongoDB: ${err.message}`);
    process.exit(1); // Encerra o processo com falha
  }
};

export default connectDB;