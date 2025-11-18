// src/models/Clima.ts
import mongoose, { Schema, Document, model } from 'mongoose';

export interface IClima extends Document {
  temp: number;
  dataRegistro: Date;
}

const ClimaSchema: Schema = new Schema({
  temp: { type: Number, required: true },
  dataRegistro: { type: Date, required: true, default: Date.now },
});

export default model<IClima>('Clima', ClimaSchema);