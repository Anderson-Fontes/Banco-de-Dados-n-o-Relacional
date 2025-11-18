// src/models/Carro.ts
import mongoose, { Schema, Document, model } from 'mongoose';

export interface ICarro extends Document {
  modelo: string;
  equipe: string;
}

const CarroSchema: Schema = new Schema({
  modelo: { type: String, required: true, trim: true },
  equipe: { type: String, required: true, default: 'ThunderRacing' },
});

export default model<ICarro>('Carro', CarroSchema);