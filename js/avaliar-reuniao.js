// js/preencher-reuniao.js

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', function () {
  const idReuniao = getQueryParam('idReuniao');
  if (!idReuniao) return;

  fetch(`https://89a6fcc8-586b-46a4-bee5-cdef6d20e574.mock.pstmn.io/api/v1/reunioes/detalhes/${idReuniao}`)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar detalhes');
      return response.json();
    })
    .then(data => {
      // Preenche os campos
      document.getElementById('nomeReuniao').textContent = data.nome;
      // Converte data para formato brasileiro
      document.getElementById('dataReuniao').textContent = new Date(data.data).toLocaleDateString('pt-BR');
      document.getElementById('horaReuniao').textContent = data.hora;
    })
    .catch(() => {
      document.getElementById('nomeReuniao').textContent = 'Erro ao carregar';
      document.getElementById('dataReuniao').textContent = '-';
      document.getElementById('horaReuniao').textContent = '-';
    });
});