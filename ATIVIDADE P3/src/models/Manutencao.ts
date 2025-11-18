// src/models/Manutencao.ts
import mongoose, { Schema, Document, model } from 'mongoose';

export interface IManutencao extends Document {
  carroId: mongoose.Schema.Types.ObjectId; // Referência
  data: Date;
  tipo: string;
  mecanico: string;
  pecasTrocadas: string[];
}

const ManutencaoSchema: Schema = new Schema({
  carroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carro', required: true },
  data: { type: Date, required: true, default: Date.now },
  tipo: { type: String, required: true, trim: true },
  mecanico: { type: String, required: true, trim: true },
  pecasTrocadas: { type: [String], default: [] },
});

export default model<IManutencao>('Manutencao', ManutencaoSchema);