# VagaSync

Plataforma distribuída para centralização e monitoramento da disponibilidade de vagas em múltiplos estacionamentos.

## Objetivo

O VagaSync tem como objetivo integrar diferentes estacionamentos em uma única plataforma, permitindo consultar a disponibilidade de vagas por estacionamento e setor.

As vagas têm seu estado atualizado por meio de sensores simulados, indicando se cada vaga está `LIVRE` ou `OCUPADA`.

## Arquitetura

O projeto utiliza uma arquitetura baseada em microsserviços.

Atualmente, o sistema possui dois serviços independentes:

### Estacionamentos Service

Responsável pelo gerenciamento das informações dos estacionamentos.

Principais responsabilidades:

- listar estacionamentos;
- buscar estacionamento por ID;
- cadastrar estacionamentos;
- atualizar estacionamentos;
- remover estacionamentos;
- consultar a disponibilidade de vagas através do serviço de vagas.

Porta local:

```text
3001
```

### Vagas Service

Responsável pelo gerenciamento e monitoramento das vagas.

Principais responsabilidades:

- listar vagas;
- consultar vagas de um estacionamento;
- atualizar o status de uma vaga;
- gerar resumo de disponibilidade;
- gerar resumo de disponibilidade por setor.

Porta local:

```text
3002
```

## Comunicação entre microsserviços

O `estacionamentos-service` se comunica com o `vagas-service` através de requisições HTTP.

Fluxo simplificado:

```text
Cliente
   |
   v
Estacionamentos Service
   |
   | HTTP
   v
Vagas Service
```

Ao acessar:

```http
GET /estacionamentos/1/disponibilidade
```

o serviço de estacionamentos consulta o serviço de vagas e retorna uma resposta combinada com os dados do estacionamento e a disponibilidade das vagas.

Caso o serviço de vagas esteja indisponível, a API retorna:

```text
503 Service Unavailable
```

## Tecnologias utilizadas

- Node.js
- Express
- Docker
- Docker Compose
- Swagger
- OpenAPI
- Git
- GitHub
- Render

## Executando localmente

Com Docker e Docker Compose instalados, execute na raiz do projeto:

```bash
docker compose up --build
```

Os serviços estarão disponíveis em:

```text
Estacionamentos:
http://localhost:3001

Vagas:
http://localhost:3002
```

Para encerrar os serviços:

```bash
docker compose down
```

## Documentação da API

Cada microsserviço possui documentação interativa utilizando Swagger.

### Estacionamentos API

Local:

```text
http://localhost:3001/api-docs
```

Cloud:

```text
https://vagasync-estacionamentos.onrender.com/api-docs
```

### Vagas API

Local:

```text
http://localhost:3002/api-docs
```

Cloud:

```text
https://vagasync-vagas.onrender.com/api-docs
```

## Principais endpoints

### Estacionamentos

```http
GET    /estacionamentos
GET    /estacionamentos/{id}
POST   /estacionamentos
PUT    /estacionamentos/{id}
DELETE /estacionamentos/{id}

GET    /estacionamentos/{id}/disponibilidade
```

### Vagas

```http
GET /vagas

GET /vagas/estacionamento/{estacionamentoId}

PUT /vagas/{id}/status

GET /vagas/estacionamento/{estacionamentoId}/resumo

GET /vagas/estacionamento/{estacionamentoId}/resumo-setores
```

## Simulação dos sensores

A atualização do estado de uma vaga representa a informação enviada por um sensor de ocupação.

Exemplo:

```http
PUT /vagas/1/status
```

Body:

```json
{
  "status": "OCUPADA"
}
```

Os valores aceitos são:

```text
LIVRE
OCUPADA
```

## Deploy em nuvem

Os dois microsserviços estão publicados separadamente no Render.

### Estacionamentos Service

```text
https://vagasync-estacionamentos.onrender.com
```

### Vagas Service

```text
https://vagasync-vagas.onrender.com
```

A comunicação entre os serviços na nuvem utiliza a variável de ambiente:

```text
VAGAS_SERVICE_URL
```

Dessa forma, o mesmo projeto pode funcionar tanto localmente com Docker Compose quanto no ambiente de cloud.

## Persistência

Neste estágio do projeto, os dados são mantidos em memória.

Quando os serviços são reiniciados, os dados retornam ao estado inicial definido na aplicação.

## Estrutura do projeto

```text
vagasync/
├── docker-compose.yml
├── README.md
└── services/
    ├── estacionamentos-service/
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── package.json
    │   └── package-lock.json
    │
    └── vagas-service/
        ├── Dockerfile
        ├── index.js
        ├── package.json
        └── package-lock.json
```

## Projeto acadêmico

Projeto desenvolvido para a disciplina de Sistemas Distribuídos e Mobile.

O projeto aplica conceitos de:

- APIs REST;
- microsserviços;
- comunicação distribuída;
- tratamento de falhas;
- containerização;
- documentação de APIs;
- deploy em nuvem.