document.addEventListener('DOMContentLoaded', function () {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';

  fetch('https://d014bcd8-b2b3-4a03-907e-07095913b3ad.mock.pstmn.io/api/v1/reunioes') // Substitua pela URL real da sua API
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta');
      return response.json();
    })
    .then(reunioes => {
      if (!Array.isArray(reunioes) || reunioes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhuma reunião encontrada.</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      reunioes.forEach(reuniao => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${reuniao.codigo}</td>
          <td>${reuniao.nome}</td>
          <td>${reuniao.data}</td>
          <td>${reuniao.hora}</td>
          <td>${reuniao.mediaAvaliacao ?? '-'}</td>
          <td>
            <a href="detalhes-reuniao.html?reuniao=${encodeURIComponent(reuniao.codigo)}" title="Detalhar Reunião" class="detalhar-btn">
              <i class="fa-solid fa-magnifying-glass"></i>
            </a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="6">Não foi possível carregar as reuniões.</td></tr>';
    });
});