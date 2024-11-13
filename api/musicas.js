// api/musicas.js
const pool = require('../db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM musicas');
      res.status(200).json({ data: result.rows });
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
