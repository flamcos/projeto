// js/detalhes-reuniao.js

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function formatarDataHora(dataHoraStr) {
    // Espera formato: "2025-05-15 10:00:00"
    const [data, hora] = dataHoraStr.split(' ');
    const [ano, mes, dia] = data.split('-');
    return {
        data: `${dia}/${mes}/${ano}`,
        hora: hora.slice(0,5)
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const idReuniao = getQueryParam('reuniao');
    if (!idReuniao) return;

    fetch(`https://c1a2f51a-d8bc-4b33-8563-0ab4727d576b.mock.pstmn.io/api/v1/reunioes/${idReuniao}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar detalhes');
            return response.json();
        })
        .then(data => {
            document.getElementById('nomeReuniao').textContent = data.nome;
            const { data: dataFormatada, hora } = formatarDataHora(data.data_hora);
            document.getElementById('dataReuniao').textContent = dataFormatada;
            document.getElementById('horaReuniao').textContent = hora;

            const participantesList = document.getElementById('participantesList');
            participantesList.innerHTML = '';
            let participantes = data.participantes;
            if (typeof participantes === 'string') {
                participantes = participantes.split(';').map(p => p.trim()).filter(Boolean);
            }
            if (Array.isArray(participantes)) {
                participantes.forEach(email => {
                    const span = document.createElement('span');
                    span.className = 'participante-chip';
                    span.textContent = email;
                    participantesList.appendChild(span);
                });
            }
        })
        .catch(err => {
            console.error('Erro ao carregar detalhes da reunião:', err);
            document.getElementById('nomeReuniao').textContent = 'Erro ao carregar';
            document.getElementById('dataReuniao').textContent = '-';
            document.getElementById('horaReuniao').textContent = '-';
            document.getElementById('participantesList').innerHTML = '<span class="participante-chip">-</span>';
        });
});