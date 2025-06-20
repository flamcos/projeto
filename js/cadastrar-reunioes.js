document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-cadastro-reuniao');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById('nome-reuniao').value;
    const data = document.getElementById('data-reuniao').value;
    const hora = document.getElementById('hora-reuniao').value;
    const participantes = document.getElementById('participantes-emails').value;

    // Monta o payload
    const payload = {
      nome,
      data,
      hora,
      participantes
    };

    // Substitua pela URL real do seu backend
    const url = 'https://46e5d069-029a-480f-b7aa-bffbe9e7bdbc.mock.pstmn.io/api/v1/reunioes';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao cadastrar');
      return response.json();
    })
    .then(data => {
      // Supondo que o backend retorna { codigo: "003" }
      window.location.href = `detalhes-reuniao.html?reuniao=${encodeURIComponent(data.id)}`;
    })
    .catch(() => {
      alert('Não foi possível cadastrar a reunião.');
    });
  });
});