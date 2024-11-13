const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições
app.use(express.json());

// obter todos os ministros
app.get('/ministros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ministros');
    res.json({
      data: result.rows
    });
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível listar os ministros.",
      error: err.message
    });
  }
});

// obter um ministro específico
app.get('/ministros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ministros WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({
        message: `Ministro com ID ${id} encontrado!`,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: `Ministro com ID ${id} não encontrado.`
      });
    }
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível obter o ministro.",
      error: err.message
    });
  }
});

// criar um novo ministro
app.post('/ministros', async (req, res) => {
  const { nome, instrumento, email, data_admissao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ministros (nome, instrumento, email, data_admissao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, instrumento, email, data_admissao]
    );
    res.status(201).json({
      message: "Ministro criado com sucesso!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro na inserção no banco de dados', err);
    res.status(500).json({
      message: "Erro interno ao criar o ministro.",
      error: err.message
    });
  }
});

// atualizar um ministro
app.put('/ministros/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, instrumento, email, data_admissao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE ministros SET nome = $1, instrumento = $2, email = $3, data_admissao = $4 WHERE id = $5 RETURNING *',
      [nome, instrumento, email, data_admissao, id]
    );
    if (result.rowCount > 0) {
      res.json({
        message: `Ministro com ID ${id} atualizado com sucesso!`,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: `Ministro com ID ${id} não encontrado.`
      });
    }
  } catch (err) {
    console.error('Erro na atualização do banco de dados', err);
    res.status(500).json({
      message: "Erro interno ao atualizar o ministro.",
      error: err.message
    });
  }
});

// deletar um ministro
app.delete('/ministros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM ministros WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.json({
        message: `Ministro com ID ${id} deletado com sucesso!`
      });
    } else {
      res.status(404).json({
        message: `Ministro com ID ${id} não encontrado.`
      });
    }
  } catch (err) {
    console.error('Erro na exclusão do banco de dados', err);
    res.status(500).json({
      message: "Erro interno ao deletar o ministro.",
      error: err.message
    });
  }
});

// obter todos os repertórios de um ministro
app.get('/repertorios', async (req, res) => {
  const ministroId = req.query.ministroId;
  try {
    const result = await pool.query('SELECT * FROM repertorios');
    res.json({
      data: result.rows
    });
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível listar os repertórios.",
      error: err.message
    });
  }
});

// obter todos os repertórios
app.get('/repertorios/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM repertorios');
    res.json({
      message: "Repertórios listados com sucesso!",
      data: result.rows
    });
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível listar os repertórios.",
      error: err.message
    });
  }
});

// criar um repertório
app.post('/repertorios', async (req, res) => {
  const { titulo, data, ministro_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO repertorios (titulo, data, ministro_id) VALUES ($1, $2, $3) RETURNING *',
      [titulo, data, ministro_id]
    );
    res.status(201).json({
      message: "Repertório criado com sucesso!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro na inserção do repertório', err);
    res.status(500).json({
      message: "Erro interno ao criar o repertório.",
      error: err.message
    });
  }
});

// obter todas as músicas
app.get('/musicas', async (req, res) => {
  const repertorioId = req.query.repertorioId;
  try {
    const result = await pool.query('SELECT * FROM musicas');
    res.json({
      data: result.rows
    });
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível listar as músicas.",
      error: err.message
    });
  }
});

// criar uma música
app.post('/musicas', async (req, res) => {
  const { titulo, artista, cifra_link, repertorio_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO musicas (titulo, artista, cifra_link, repertorio_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, artista, cifra_link, repertorio_id]
    );
    res.status(201).json({
      message: "Música criada com sucesso!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro na inserção da música', err);
    res.status(500).json({
      message: "Erro interno ao criar a música.",
      error: err.message
    });
  }
});

// obter todas as escalas
app.get('/escalas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM escalas');
    res.json({
      message: "Escalas listadas com sucesso!",
      data: result.rows
    });
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível listar as escalas.",
      error: err.message
    });
  }
});

// obter uma escala específica
app.get('/escalas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM escalas WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({
        message: `Escala com ID ${id} encontrada!`,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: `Escala com ID ${id} não encontrada.`
      });
    }
  } catch (err) {
    console.error('Erro na consulta ao banco de dados', err);
    res.status(500).json({
      message: "Erro interno do servidor. Não foi possível obter a escala.",
      error: err.message
    });
  }
});

// criar uma nova escala
app.post('/escalas', async (req, res) => {
  const { data, hora_culto, ministro_id } = req.body; // Certifique-se de que os campos estão corretos
  try {
    const result = await pool.query(
      'INSERT INTO escalas (data, hora_culto, ministro_id) VALUES ($1, $2, $3) RETURNING *',
      [data, hora_culto, ministro_id]
    );
    res.status(201).json({
      message: "Escala criada com sucesso!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro na inserção da escala', err);
    res.status(500).json({
      message: "Erro interno ao criar a escala.",
      error: err.message
    });
  }
});

// atualizar uma escala
app.put('/escalas/:id', async (req, res) => {
  const { id } = req.params;
  const { data, hora_culto, ministro_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE escalas SET data = $1, hora_culto = $2, ministro_id = $3 WHERE id = $4 RETURNING *',
      [data, hora_culto, ministro_id, id]
    );
    if (result.rowCount > 0) {
      res.json({
        message: `Escala com ID ${id} atualizada com sucesso!`,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: `Escala com ID ${id} não encontrada.`
      });
    }
  } catch (err) {
    console.error('Erro na atualização da escala', err);
    res.status(500).json({
      message: "Erro interno ao atualizar a escala.",
      error: err.message
    });
  }
});

// deletar uma escala
app.delete('/escalas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM escalas WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.json({
        message: `Escala com ID ${id} deletada com sucesso!`
      });
    } else {
      res.status(404).json({
        message: `Escala com ID ${id} não encontrada.`
      });
    }
  } catch (err) {
    console.error('Erro na exclusão da escala', err);
    res.status(500).json({
      message: "Erro interno ao deletar a escala.",
      error: err.message
    });
  }
});


// Inicia o servidor
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
