// src/index.ts
import express, { Express } from 'express';
import connectDB from './config/db';
import apiRoutes from './routes/api';

// Conectar ao Banco de Dados
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());

// Rotas da API
app.use('/api', apiRoutes); // Prefixo '/api'

app.get('/', (req, res) => {
  res.send('API de Telemetria ThunderRacing está no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});