const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VagaSync - Estacionamentos API',
      version: '1.0.0',
      description: 'API responsável pelo gerenciamento dos estacionamentos do VagaSync'
    }
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

/**
 * @swagger
 * /estacionamentos:
 *   get:
 *     summary: Lista todos os estacionamentos
 *     tags:
 *       - Estacionamentos
 *     responses:
 *       200:
 *         description: Lista de estacionamentos retornada com sucesso
 */
app.get('/estacionamentos', (req, res) => {
  res.json(estacionamentos);
});

/**
 * @swagger
 * /estacionamentos/{id}:
 *   get:
 *     summary: Busca um estacionamento pelo ID
 *     tags:
 *       - Estacionamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do estacionamento
 *     responses:
 *       200:
 *         description: Estacionamento encontrado
 *       404:
 *         description: Estacionamento não encontrado
 */
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

/**
 * @swagger
 * /estacionamentos:
 *   post:
 *     summary: Cadastra um novo estacionamento
 *     tags:
 *       - Estacionamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - endereco
 *               - cidade
 *             properties:
 *               nome:
 *                 type: string
 *                 example: VagaSync Zona Sul
 *               endereco:
 *                 type: string
 *                 example: Av. Wenceslau Escobar, 1000
 *               cidade:
 *                 type: string
 *                 example: Porto Alegre
 *     responses:
 *       201:
 *         description: Estacionamento cadastrado com sucesso
 */
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

/**
 * @swagger
 * /estacionamentos/{id}:
 *   put:
 *     summary: Atualiza um estacionamento
 *     tags:
 *       - Estacionamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cidade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estacionamento atualizado com sucesso
 *       404:
 *         description: Estacionamento não encontrado
 */
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

/**
 * @swagger
 * /estacionamentos/{id}:
 *   delete:
 *     summary: Remove um estacionamento
 *     tags:
 *       - Estacionamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Estacionamento removido com sucesso
 *       404:
 *         description: Estacionamento não encontrado
 */
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

/**
 * @swagger
 * /estacionamentos/{id}/disponibilidade:
 *   get:
 *     summary: Consulta a disponibilidade de vagas de um estacionamento
 *     description: Consulta o serviço de vagas e combina os dados dos dois microsserviços.
 *     tags:
 *       - Estacionamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disponibilidade retornada com sucesso
 *       404:
 *         description: Estacionamento não encontrado
 *       503:
 *         description: Serviço de vagas temporariamente indisponível
 */
app.get('/estacionamentos/:id/disponibilidade', async (req, res) => {
  const id = Number(req.params.id);

  const estacionamento = estacionamentos.find(
    estacionamento => estacionamento.id === id
  );

  if (!estacionamento) {
    return res.status(404).json({
      mensagem: 'Estacionamento não encontrado'
    });
  }

  try {
    const resposta = await fetch(
      `http://vagas:3002/vagas/estacionamento/${id}/resumo-setores`
    );

    const disponibilidade = await resposta.json();

    res.json({
      estacionamento,
      disponibilidade
    });
  } catch (erro) {
    res.status(503).json({
      mensagem: 'Serviço de vagas temporariamente indisponível'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Estacionamentos Service rodando na porta ${PORT}`);
});