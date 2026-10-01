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

    for (const estacionamento of estacionamentos) {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3>${estacionamento.nome}</h3>
        <p>${estacionamento.endereco}</p>
        <p>${estacionamento.cidade}</p>

        <div class="disponibilidade">
          <p>Carregando disponibilidade...</p>
        </div>
      `;

      lista.appendChild(card);

      carregarDisponibilidade(estacionamento.id, card);
    }
  } catch (erro) {
    lista.innerHTML = `
      <p>Não foi possível carregar os estacionamentos.</p>
    `;

    console.error(erro);
  }
}

async function carregarDisponibilidade(estacionamentoId, card) {
  const areaDisponibilidade = card.querySelector('.disponibilidade');

  try {
    const resposta = await fetch(
      `${API_ESTACIONAMENTOS}/estacionamentos/${estacionamentoId}/disponibilidade`
    );

    if (!resposta.ok) {
      throw new Error('Erro ao buscar disponibilidade');
    }

    const dados = await resposta.json();

    const setores = dados.disponibilidade.setores;

    areaDisponibilidade.innerHTML = '';

    setores.forEach((setor) => {
      const setorDiv = document.createElement('div');
      setorDiv.classList.add('setor');

      setorDiv.innerHTML = `
        <h4>${setor.setor}</h4>

        <div class="resumo-vagas">
          <span>Total: ${setor.total}</span>
          <span class="status-livre">Livres: ${setor.livres}</span>
          <span class="status-ocupada">Ocupadas: ${setor.ocupadas}</span>
        </div>
      `;

      areaDisponibilidade.appendChild(setorDiv);
    });
  } catch (erro) {
    areaDisponibilidade.innerHTML = `
      <p>Disponibilidade indisponível no momento.</p>
    `;

    console.error(erro);
  }
}

carregarEstacionamentos();