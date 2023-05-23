const fs = require('fs');

let alunos = [];

fs.readFile('./db.json', (err, data) => {
  if (!err) {
    alunos = JSON.parse(data);
  }
});

function filterByNome(nome) {
  return alunos.filter((aluno) => aluno.nome.toLowerCase().includes(nome.toLowerCase()));
}

function filterByMedia(media) {
return alunos.filter((aluno) => aluno.media >= media);
}

function adicionarAluno(nome, matricula, media) {
if (!nome || !matricula || !media) {
throw new Error('Dados incompletos');
}

const novoAluno = {
nome,
matricula,
media
};

alunos.push(novoAluno);
fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
if (err) {
throw new Error('Erro ao salvar no arquivo');
}
});
}

function atualizarAluno(index, nome, media) {
const aluno = alunos[index];
if (!aluno) {
throw new Error('Aluno não encontrado');
}

if (nome) {
aluno.nome = nome;
}

if (media) {
aluno.media = media;
}

fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
if (err) {
throw new Error('Erro ao salvar no arquivo');
}
});
}

function removerAluno(index) {
const aluno = alunos[index];
if (!aluno) {
throw new Error('Aluno não encontrado');
}

alunos.splice(index, 1);
fs.writeFile('./db.json', JSON.stringify(alunos), (err) => {
if (err) {
throw new Error('Erro ao salvar no arquivo');
}
});
}

module.exports = {
alunos,
filterByNome,
filterByMedia,
adicionarAluno,
atualizarAluno,
removerAluno
};
