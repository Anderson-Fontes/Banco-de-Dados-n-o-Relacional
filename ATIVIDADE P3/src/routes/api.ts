// src/routes/api.ts
import { Router, Request, Response } from 'express';
import Leitura from '../models/Leitura';

const router = Router();

// Rota da QUESTÃO 7
router.post('/leituras', async (req: Request, res: Response) => {
  try {
    const { carro, sensor, valor, dataHora } = req.body;

    // 1. Valida se os campos obrigatórios foram enviados
    if (!carro || !sensor || valor === undefined) {
      return res.status(400).json({ msg: 'Campos obrigatórios (carro, sensor, valor) não foram enviados.' });
    }

    // 2. Insere a leitura
    const novaLeitura = new Leitura({
      carro,
      sensor,
      valor,
      dataHora: dataHora ? new Date(dataHora) : new Date() // Data opcional
    });

    await novaLeitura.save();

    // 3. Retorna código HTTP 201
    return res.status(201).json(novaLeitura);

  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send('Erro no servidor');
  }
});

export default router;