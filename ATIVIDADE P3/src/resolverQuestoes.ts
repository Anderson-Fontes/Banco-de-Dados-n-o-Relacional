// src/resolverQuestoes.ts
import mongoose from 'mongoose';
import axios from 'axios';
import cron from 'node-cron';
import { exec } from 'child_process'; // Para o backup real

// Importar Modelos
import Leitura from './models/Leitura';
import Clima from './models/Clima';
// Importar Conexão
import connectDB from './config/db';

/*
  COMO USAR:
  1. Abra o terminal
  2. Rode: npm run resolver
  
  Descomente a função da questão que você quer executar.
*/

// --- QUESTÃO 2: Inserção de Dados (CRUD) ---
async function questao2() {
  console.log('--- Executando Questão 2 ---');
  try {
    const leituras = [
      { carro: 'GT-R', sensor: 'temperatura_motor', valor: 85, dataHora: new Date() },
      { carro: 'Maverick', sensor: 'pressao_oleo', valor: 55, dataHora: new Date() },
      { carro: 'GT-R', sensor: 'temperatura_motor', valor: 92, dataHora: new Date() },
      { carro: 'Maverick', sensor: 'velocidade', valor: 280, dataHora: new Date() },
      { carro: 'GT-R', sensor: 'velocidade', valor: 300, dataHora: new Date() },
    ];
    await Leitura.insertMany(leituras);
    console.log('Q2: Registros de telemetria inseridos.');
  } catch (e) {
    console.error('Erro Q2:', e);
  }
}

// --- QUESTÃO 3: Consultas com Operadores Lógicos ---
async function questao3() {
  console.log('--- Executando Questão 3 ---');
  try {
    const resultados = await Leitura.find({
      $or: [ // sensor seja "temperatura_motor" OU "pressao_oleo"
        { sensor: 'temperatura_motor' },
        { sensor: 'pressao_oleo' }
      ],
      valor: { $gt: 90 } // E o valor seja maior que 90
    });
    console.log('Q3: Leituras encontradas:', JSON.stringify(resultados, null, 2));
  } catch (e) {
    console.error('Erro Q3:', e);
  }
}

// --- QUESTÃO 4: Atualização Avançada ---
async function questao4() {
  console.log('--- Executando Questão 4 ---');
  try {
    const resultado = await Leitura.updateMany(
      { carro: 'GT-R' }, // Filtro
      [ // Usamos pipeline de agregação para $set e $unset
        {
          $set: {
            status_sensor: 'verificar' // Adicionando campo
          }
        },
        {
          $unset: 'codigo_defeito' // Removendo campo
        }
      ]
    );
    console.log(`Q4: Documentos atualizados: ${resultado.modifiedCount}`);
  } catch (e) {
    console.error('Erro Q4:', e);
  }
}

// --- QUESTÃO 5: Paginação ---
async function questao5() {
  console.log('--- Executando Questão 5 ---');
  try {
    // Vamos inserir mais 15 dados de velocidade para a paginação funcionar
    const dadosPaginacao = [];
    for (let i = 0; i < 15; i++) {
        dadosPaginacao.push({
            carro: 'GT-R',
            sensor: 'velocidade',
            valor: 200 + i,
            dataHora: new Date(Date.now() - 1000 * i) // Datas diferentes
        });
    }
    await Leitura.insertMany(dadosPaginacao);
    console.log('Q5: Dados extras inseridos para teste de paginação.');

    const resultados = await Leitura.find({
      sensor: 'velocidade'
    })
    .sort({ dataHora: -1 }) // 5 leituras mais recentes
    .skip(10) // ignorando as primeiras 10
    .limit(5); //
    
    console.log('Q5: Leituras paginadas:', JSON.stringify(resultados, null, 2));
  } catch (e) {
    console.error('Erro Q5:', e);
  }
}

// --- QUESTÃO 6: Agregação ---
async function questao6() {
  console.log('--- Executando Questão 6 ---');
  try {
    const resultados = await Leitura.aggregate([
      // 1. Filtrar apenas temperatura do motor
      { $match: { sensor: 'temperatura_motor' } },
      
      // 2. Agrupar por carro e calcular a média do valor
      {
        $group: {
          _id: '$carro', // Agrupar por carro
          mediaTemperatura: { $avg: '$valor' } // Calcule a média
        }
      },
      
      // 3. Ordenar os maiores valores primeiro
      { $sort: { mediaTemperatura: -1 } }
    ]);
    console.log('Q6: Média de temperatura por carro:', resultados);
  } catch (e) {
    console.error('Erro Q6:', e);
  }
}

// --- QUESTÃO 8: Consumo de API Externa ---
async function questao8() {
  console.log('--- Executando Questão 8 ---');
  try {
    // 1. Consome a API externa
    // (API pública para Jacareí, Brasil)
    const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=-23.30&longitude=-45.96&current=temperature_2m');
    
    // 2. Extrai temp
    const temp = response.data.current.temperature_2m;
    console.log(`Q8: Temperatura externa atual: ${temp}°C`);

    // 3. Salva na coleção clima
    const registroClima = new Clima({ temp: temp });
    await registroClima.save();
    
    console.log('Q8: Clima salvo no banco de dados.', registroClima);
  } catch (e) {
    console.error('Erro Q8:', e);
  }
}

// --- QUESTÃO 10: Automação de Backup (node-cron) ---
function questao10_cron() {
  console.log('--- Executando Questão 10 (node-cron) ---');
  
  // Agendando tarefa para todo dia à meia-noite ('0 0 * * *')
  // Para testar, vamos agendar para "a cada minuto"
  cron.schedule('* * * * *', () => {
    console.log('CRON: Executando backup agendado (a cada minuto)...');
    
    // Comando de backup (Questão 10)
    const backupCommand = 'mongodump --db telemetria_race --out ./backup_diario';

    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`CRON: Erro ao executar backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`CRON: Stderr do backup: ${stderr}`);
      }
      console.log(`CRON: Backup realizado com sucesso! ${stdout}`);
    });
  });

  console.log('Q10: Agendador de backup (node-cron) iniciado.');
}

// --- FUNÇÃO PRINCIPAL PARA RODAR AS QUESTÕES ---
const runAll = async () => {
  // Conecta ao DB
  await connectDB();

  // --- DESCOMENTE A(S) QUESTÃO(ÕES) QUE DESEJA EXECUTAR ---
  
   //await questao2();
  //await questao3();
  // await questao4();
  // await questao5();
  // await questao6();
   await questao8();
  
  // questao10_cron(); // Deixa o script rodando para o cron funcionar

  // Fecha a conexão automaticamente se o cron não estiver rodando
  if (!cron.getTasks().size) { 
    await mongoose.connection.close();
    console.log('Conexão fechada.');
  }
};

// Executa a função principal
runAll();