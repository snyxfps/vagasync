const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VagaSync - Vagas API',
      version: '1.0.0',
      description: 'API responsável pelo gerenciamento e monitoramento das vagas do VagaSync'
    }
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3002;

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

/**
 * @swagger
 * /vagas:
 *   get:
 *     summary: Lista todas as vagas
 *     tags:
 *       - Vagas
 *     responses:
 *       200:
 *         description: Lista de vagas retornada com sucesso
 */
app.get('/vagas', (req, res) => {
  res.json(vagas);
});

/**
 * @swagger
 * /vagas/estacionamento/{estacionamentoId}:
 *   get:
 *     summary: Lista as vagas de um estacionamento
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: estacionamentoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do estacionamento
 *     responses:
 *       200:
 *         description: Vagas retornadas com sucesso
 */
app.get('/vagas/estacionamento/:estacionamentoId', (req, res) => {
  const estacionamentoId = Number(req.params.estacionamentoId);

  const vagasDoEstacionamento = vagas.filter(
    vaga => vaga.estacionamentoId === estacionamentoId
  );

  res.json(vagasDoEstacionamento);
});

/**
 * @swagger
 * /vagas/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma vaga
 *     description: Simula a atualização enviada por um sensor de ocupação.
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da vaga
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - LIVRE
 *                   - OCUPADA
 *                 example: OCUPADA
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Vaga não encontrada
 */
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

/**
 * @swagger
 * /vagas/estacionamento/{estacionamentoId}/resumo:
 *   get:
 *     summary: Retorna o resumo de vagas de um estacionamento
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: estacionamentoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resumo retornado com sucesso
 */
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

/**
 * @swagger
 * /vagas/estacionamento/{estacionamentoId}/resumo-setores:
 *   get:
 *     summary: Retorna a disponibilidade agrupada por setor
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: estacionamentoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resumo por setores retornado com sucesso
 */
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