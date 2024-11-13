// api/escalas.js
const pool = require('../db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const escalas = await pool.query('SELECT * FROM escalas');
      res.status(200).json({ data: escalas.rows });
    } catch (err) {
      console.error('Erro na consulta ao banco de dados', err);
      res.status(500).json({
        message: "Erro interno do servidor. Não foi possível listar as músicas.",
        error: err.message,
      });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
};