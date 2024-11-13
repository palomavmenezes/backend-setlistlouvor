// api/ministros.js
const { Pool } = require('pg');

// Cria uma instância do Pool com variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ministros');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
  }
};
