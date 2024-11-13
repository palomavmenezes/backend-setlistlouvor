const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições
app.use(express.json());

// Rota para obter todos os repertórios de um ministro
app.get('/repertorios', async (req, res) => {
  const ministroId = req.query.ministroId;
  
  try {
    const result = await pool.query('SELECT * FROM repertorios WHERE ministro_id = $1', [ministroId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para obter todos os ministros
app.get('/ministros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ministros');
    res.json(result.rows); // Envia os ministros para o client
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).send('Erro interno do servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

const connect = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão bem-sucedida:', res.rows[0]);
  } catch (err) {
    console.error('Erro na conexão com o banco de dados:', err);
  }
};

connect();
