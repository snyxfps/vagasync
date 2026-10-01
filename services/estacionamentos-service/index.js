const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

const estacionamentos = [
  {
    id: 1,
    nome: 'VagaSync Centro',
    endereco: 'Av. Borges de Medeiros, 1000',
    cidade: 'Porto Alegre'
  },
  {
    id: 2,
    nome: 'VagaSync Moinhos',
    endereco: 'Rua Padre Chagas, 500',
    cidade: 'Porto Alegre'
  }
];

app.get('/estacionamentos', (req, res) => {
  res.json(estacionamentos);
});

app.get('/estacionamentos/:id', (req, res) => {
  const id = Number(req.params.id);

  const estacionamento = estacionamentos.find(
    estacionamento => estacionamento.id === id
  );

if (!estacionamento) {
  return res.status(404).json({
    mensagem: 'Estacionamento não encontrado'
  });
}

  res.json(estacionamento);
});

app.post('/estacionamentos', (req, res) => {
  const novoEstacionamento = {
    id: estacionamentos.length + 1,
    nome: req.body.nome,
    endereco: req.body.endereco,
    cidade: req.body.cidade
  };

  estacionamentos.push(novoEstacionamento);

  res.status(201).json(novoEstacionamento);
});

app.put('/estacionamentos/:id', (req, res) => {
  const id = Number(req.params.id);

  const estacionamento = estacionamentos.find(
    estacionamento => estacionamento.id === id
  );

  if (!estacionamento) {
    return res.status(404).json({
      mensagem: 'Estacionamento não encontrado'
    });
  }

  estacionamento.nome = req.body.nome;
  estacionamento.endereco = req.body.endereco;
  estacionamento.cidade = req.body.cidade;

  res.json(estacionamento);
});

app.delete('/estacionamentos/:id', (req, res) => {
  const id = Number(req.params.id);

  const indice = estacionamentos.findIndex(
    estacionamento => estacionamento.id === id
  );

  if (indice === -1) {
    return res.status(404).json({
      mensagem: 'Estacionamento não encontrado'
    });
  }

  estacionamentos.splice(indice, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Estacionamentos Service rodando na porta ${PORT}`);
});