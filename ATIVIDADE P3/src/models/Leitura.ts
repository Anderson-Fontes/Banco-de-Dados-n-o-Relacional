// src/models/Leitura.ts
import mongoose, { Schema, Document, model } from 'mongoose';

export interface ILeitura extends Document {
  carro: string;
  sensor: string;
  valor: number;
  dataHora: Date;
  status_sensor?: string; // Para Questão 4
  codigo_defeito?: string; // Para Questão 4
}

const LeituraSchema: Schema = new Schema({
  carro: { type: String, required: true, trim: true },
  sensor: { type: String, required: true, trim: true },
  valor: { type: Number, required: true },
  dataHora: { type: Date, required: true, default: Date.now },
  status_sensor: { type: String, required: false },
  codigo_defeito: { type: String, required: false },
});

// Índice para otimizar a Questão 5
LeituraSchema.index({ sensor: 1, dataHora: -1 });

export default model<ILeitura>('Leitura', LeituraSchema);