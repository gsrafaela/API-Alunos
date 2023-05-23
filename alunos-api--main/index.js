const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const alunos = require('./db.json');

const app = express();

app.use(bodyParser.json());

// Rota GET para listar todos os alunos
app.get('/alunos', (req, res) => {
  let filteredAlunos = alunos;

  if (req.query.nome) {
    filteredAlunos = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(req.query.nome.toLowerCase())
    );
  }

  if (req.query.media) {
    filteredAlunos = filteredAlunos.filter(
      (aluno) => aluno.media >= parseFloat(req.query.media)
    );
  }

  res.json(filteredAlunos);
});

// Rota POST para adicionar um novo aluno
app.post('/alunos/novo', (req, res) => {
  const { nome, matricula, media } = req.body;

  if (!nome || !matricula || !media) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  alunos.push({ nome, matricula, media });

  fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
    if (err) {
      console.log('Erro ao gravar no arquivo db.json', err);
      return res.status(500).json({ erro: 'Erro ao gravar no arquivo.' });
    }

    return res.status(201).json({ sucesso: 'Aluno adicionado com sucesso.' });
  });
});

// Rota PUT para atualizar um aluno existente
app.put('/alunos/:index', (req, res) => {
  const { nome, media } = req.body;
  const { index } = req.params;

  if (!nome || !media) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  if (!alunos[index]) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }

  alunos[index].nome = nome;
  alunos[index].media = media;

  fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
    if (err) {
      console.log('Erro ao gravar no arquivo db.json', err);
      return res.status(500).json({ erro: 'Erro ao gravar no arquivo.' });
    }

    return res.json({ sucesso: 'Aluno atualizado com sucesso.' });
  });
});

// Rota DELETE para deletar um aluno existente
app.delete('/alunos/:index', (req, res) => {
  const { index } = req.params;

  if (!alunos[index]) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }

  alunos.splice(index, 1);

  fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
    if (err) {
      console.log('Erro ao gravar no arquivo db.json', err);
      return res.status(500).json({ erro: 'Erro ao gravar no arquivo.' });
    }

    return res.json({ sucesso: 'Aluno deletado com sucesso.' });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000.');
});
