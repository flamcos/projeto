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
        hora: hora.slice(0, 5)
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
            carregarAvaliacoes(idReuniao);
        })
        .catch(err => {
            console.error('Erro ao carregar detalhes da reunião:', err);
            document.getElementById('nomeReuniao').textContent = 'Erro ao carregar';
            document.getElementById('dataReuniao').textContent = '-';
            document.getElementById('horaReuniao').textContent = '-';
            document.getElementById('participantesList').innerHTML = '<span class="participante-chip">-</span>';
        });
});

function openModal() {
    const idReuniao = getQueryParam('reuniao');
    if (!idReuniao) return;

    fetch(`https://c1a2f51a-d8bc-4b33-8563-0ab4727d576b.mock.pstmn.io/api/v1/reunioes/${idReuniao}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar detalhes');
            return response.json();
        })
        .then(data => {
            // Preenche os campos da modal
            document.getElementById('editNome').value = data.nome;

            // Converte data para yyyy-mm-dd (input type="date")
            const [dataStr] = data.data_hora.split(' ');
            const [ano, mes, dia] = dataStr.split('-');
            document.getElementById('editData').value = `${ano}-${mes}-${dia}`;

            // Hora no formato HH:MM
            const [, hora] = data.data_hora.split(' ');
            document.getElementById('editHora').value = hora.slice(0, 5);

            // Participantes separados por ";"
            let participantes = data.participantes;
            if (Array.isArray(participantes)) {
                participantes = participantes.join('; ');
            }
            document.getElementById('editParticipantes').value = participantes;

            document.getElementById('modalEdit').classList.add('active');
        })
        .catch(err => {
            alert('Erro ao carregar dados da reunião para edição.');
            console.error(err);
        });
}

function closeModal() {
    document.getElementById('modalEdit').classList.remove('active');
}

// Ao salvar, separe os participantes usando ";"
function saveEdit(event) {
    event.preventDefault();
    const idReuniao = getQueryParam('reuniao');
    if (!idReuniao) return;

    // Coleta os dados do formulário/modal
    const nome = document.getElementById('editNome').value;
    const data = document.getElementById('editData').value; // yyyy-mm-dd
    const hora = document.getElementById('editHora').value; // HH:MM
    const participantesStr = document.getElementById('editParticipantes').value;
    const participantesArr = participantesStr.split(';').map(p => p.trim()).filter(p => p.length > 0);

    // Monta o payload conforme esperado pela API
    const payload = {
        nome: nome,
        data_hora: `${data} ${hora}:00`,
        participantes: participantesArr
    };

    fetch(`https://84cf54eb-939c-4f39-83c4-1599b1d6daa6.mock.pstmn.io/api/v1/reunioes/${idReuniao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao salvar edição');
            // Não usa o response, apenas fecha o modal e atualiza a tela
            // return response.json();
        })
        .then(() => {
            // Atualiza os detalhes da reunião na tela com os dados dos campos
            document.getElementById('nomeReuniao').textContent = nome;

            // Formata a data para dd/mm/yyyy
            const [ano, mes, dia] = data.split('-');
            document.getElementById('dataReuniao').textContent = `${dia}/${mes}/${ano}`;
            document.getElementById('horaReuniao').textContent = hora;

            // Atualiza os participantes
            const participantesList = document.getElementById('participantesList');
            participantesList.innerHTML = '';
            participantesArr.forEach(email => {
                const span = document.createElement('span');
                span.className = 'participante-chip';
                span.textContent = email;
                participantesList.appendChild(span);
            });

            closeModal();
        })
        .catch(err => {
            alert('Erro ao salvar edição da reunião.');
            console.error(err);
        });
}
function carregarAvaliacoes(idReuniao) {
    fetch(`https://c394c115-a986-4a2a-a911-479f938acf01.mock.pstmn.io/api/v1/reunioes/${idReuniao}/avaliacoes`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar avaliações');
            return response.json();
        })
        .then(data => {
            // Preenche a tabela de avaliações
            const tbody = document.querySelector('.avaliacoes table tbody');
            tbody.innerHTML = '';
            data.avaliacoes.forEach(avaliacao => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${avaliacao.participante}</td>
                    <td>${Number(avaliacao.nota).toFixed(2).replace('.', ',')}</td>
                    <td>${avaliacao.observacao}</td>
                `;
                tbody.appendChild(tr);
            });
            // Atualiza a média
            document.querySelector('.avaliacoes .media').textContent =
                `Média das avaliações: ${Number(data.media).toFixed(2).replace('.', ',')}`;
        })
        .catch(err => {
            console.error('Erro ao carregar avaliações:', err);
            const tbody = document.querySelector('.avaliacoes table tbody');
            tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar avaliações</td></tr>';
            document.querySelector('.avaliacoes .media').textContent = 'Média das avaliações: -';
        });
}