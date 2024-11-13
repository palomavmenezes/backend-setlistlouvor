// api/ministros.js
const { Pool } = require('pg');

// Cria uma instância do Pool com variáveis de ambiente
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM ministros');
      res.status(200).json({ data: result.rows });
    } catch (err) {
      console.error('Erro na consulta ao banco de dados', err);
      res.status(500).json({
        message: "Erro interno do servidor. Não foi possível listar os ministros.",
        error: err.message
      });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
};
