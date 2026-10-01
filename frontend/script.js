const API_ESTACIONAMENTOS =
  'https://vagasync-estacionamentos.onrender.com';

async function carregarEstacionamentos() {
  const lista = document.getElementById('lista-estacionamentos');

  try {
    const resposta = await fetch(`${API_ESTACIONAMENTOS}/estacionamentos`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar estacionamentos');
    }

    const estacionamentos = await resposta.json();

    lista.innerHTML = '';

    estacionamentos.forEach((estacionamento) => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3>${estacionamento.nome}</h3>
        <p>${estacionamento.endereco}</p>
        <p>${estacionamento.cidade}</p>
      `;

      lista.appendChild(card);
    });
  } catch (erro) {
    lista.innerHTML = `
      <p>Não foi possível carregar os estacionamentos.</p>
    `;

    console.error(erro);
  }
}

carregarEstacionamentos();