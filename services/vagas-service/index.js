const express = require('express');

const app = express();
const PORT = 3002;

app.use(express.json());

const vagas = [
  {
    id: 1,
    estacionamentoId: 1,
    setor: 'Térreo',
    numero: 'A01',
    status: 'LIVRE'
  },
  {
    id: 2,
    estacionamentoId: 1,
    setor: 'Térreo',
    numero: 'A02',
    status: 'OCUPADA'
  },
  {
    id: 3,
    estacionamentoId: 1,
    setor: 'Subsolo',
    numero: 'B01',
    status: 'LIVRE'
  },
  {
  id: 4,
  estacionamentoId: 2,
  setor: 'Térreo',
  numero: 'A01',
  status: 'OCUPADA'
  },
  {
  id: 5,
  estacionamentoId: 2,
  setor: '1º Andar',
  numero: 'C01',
  status: 'LIVRE'
  }
];

app.get('/vagas', (req, res) => {
  res.json(vagas);
});

app.get('/vagas/estacionamento/:estacionamentoId', (req, res) => {
  const estacionamentoId = Number(req.params.estacionamentoId);

  const vagasDoEstacionamento = vagas.filter(
    vaga => vaga.estacionamentoId === estacionamentoId
  );

  res.json(vagasDoEstacionamento);
});

app.put('/vagas/:id/status', (req, res) => {
  const id = Number(req.params.id);

  const vaga = vagas.find(
    vaga => vaga.id === id
  );

  if (!vaga) {
    return res.status(404).json({
      mensagem: 'Vaga não encontrada'
    });
  }

  const novoStatus = req.body.status;

  if (novoStatus !== 'LIVRE' && novoStatus !== 'OCUPADA') {
    return res.status(400).json({
      mensagem: 'Status deve ser LIVRE ou OCUPADA'
    });
  }

  vaga.status = novoStatus;

  res.json(vaga);
});

app.get('/vagas/estacionamento/:estacionamentoId/resumo', (req, res) => {
  const estacionamentoId = Number(req.params.estacionamentoId);

  const vagasDoEstacionamento = vagas.filter(
    vaga => vaga.estacionamentoId === estacionamentoId
  );

  const total = vagasDoEstacionamento.length;

  const livres = vagasDoEstacionamento.filter(
    vaga => vaga.status === 'LIVRE'
  ).length;

  const ocupadas = vagasDoEstacionamento.filter(
    vaga => vaga.status === 'OCUPADA'
  ).length;

  res.json({
    estacionamentoId,
    total,
    livres,
    ocupadas
  });
});

app.get('/vagas/estacionamento/:estacionamentoId/resumo-setores', (req, res) => {
  const estacionamentoId = Number(req.params.estacionamentoId);

  const vagasDoEstacionamento = vagas.filter(
    vaga => vaga.estacionamentoId === estacionamentoId
  );

  const setores = {};

  vagasDoEstacionamento.forEach(vaga => {
    if (!setores[vaga.setor]) {
      setores[vaga.setor] = {
        setor: vaga.setor,
        total: 0,
        livres: 0,
        ocupadas: 0
      };
    }

    setores[vaga.setor].total++;

    if (vaga.status === 'LIVRE') {
      setores[vaga.setor].livres++;
    }

    if (vaga.status === 'OCUPADA') {
      setores[vaga.setor].ocupadas++;
    }
  });

  res.json({
    estacionamentoId,
    setores: Object.values(setores)
  });
});

app.listen(PORT, () => {
  console.log(`Vagas Service rodando na porta ${PORT}`);
});