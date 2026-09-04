/**
 * Application: Comparador de Listas Web
 * DevSecOps Focus: Strict CSP, Safe DOM Manipulation & Zero External Data Leakage.
 */

'use strict';

// Frame Busting (Proteção contra Clickjacking)
if (self !== top) {
    top.location = self.location;
}

let finalOutputList = [];

/**
 * Lê arquivos locais via FileReader de forma segura
 * @param {Event} event 
 */
function handleFileUpload(event) {
    const input = event.target;
    const targetId = input.getAttribute('data-target');
    const file = input.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const targetTextArea = document.getElementById(targetId);
        if (targetTextArea) {
            targetTextArea.value = e.target.result;
        }
    };
    reader.readAsText(file);
}

/**
 * Higieniza a entrada de texto e converte para array
 * @param {string} id 
 * @returns {Array<string>}
 */
function getCleanArray(id) {
    const element = document.getElementById(id);
    if (!element) {
        return [];
    }
    return element.value
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

/**
 * Renderiza os resultados em tela manipulando o DOM com segurança contra XSS
 */
function renderResults() {
    const box = document.getElementById('resultsBox');
    const tbody = document.getElementById('resultsTableBody');
    const countLabel = document.getElementById('resultsCount');
    const btnExportTxt = document.getElementById('btnExportTxt');
    const btnExportCsv = document.getElementById('btnExportCsv');

    tbody.innerHTML = '';
    countLabel.textContent = `✔ Processamento concluído: ${finalOutputList.length} itens únicos localizados.`;

    finalOutputList.forEach((item, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.style.color = 'var(--text-muted)';
        tdIndex.textContent = index + 1;

        const tdVal = document.createElement('td');
        tdVal.textContent = item; // Proteção XSS nativa (.textContent)

        tr.appendChild(tdIndex);
        tr.appendChild(tdVal);
        tbody.appendChild(tr);
    });

    box.style.display = 'block';
    btnExportTxt.style.display = 'inline-block';
    btnExportCsv.style.display = 'inline-block';
}

/**
 * Processa a álgebra de conjuntos baseada nas regras selecionadas
 */
function processLists() {
    const arrA = getCleanArray('txtA');
    const arrB = getCleanArray('txtB');
    const arrC = getCleanArray('txtC');

    const selectedRule = document.querySelector('input[name="logicRule"]:checked');
    if (!selectedRule) {
        return;
    }

    const rule = selectedRule.value;
    let result = [];

    const setB = new Set(arrB);
    const setC = new Set(arrC);

    switch (rule) {
        case 'union':
            result = Array.from(new Set([...arrA, ...arrB, ...arrC]));
            break;
        case 'intersectAB':
            result = arrA.filter((x) => setB.has(x));
            break;
        case 'diffAB':
            result = arrA.filter((x) => !setB.has(x));
            break;
        case 'complexRule':
            result = arrA.filter((x) => setB.has(x) && !setC.has(x));
            break;
        default:
            break;
    }

    finalOutputList = Array.from(new Set(result));
    renderResults();
}

/**
 * Reseta todos os campos, listas e resultados da interface
 */
function clearAll() {
    ['txtA', 'txtB', 'txtC'].forEach((id) => {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.value = '';
        }
    });

    ['fileA', 'fileB', 'fileC'].forEach((id) => {
        const fileInput = document.getElementById(id);
        if (fileInput) {
            fileInput.value = '';
        }
    });

    finalOutputList = [];

    const box = document.getElementById('resultsBox');
    const tbody = document.getElementById('resultsTableBody');
    const btnExportTxt = document.getElementById('btnExportTxt');
    const btnExportCsv = document.getElementById('btnExportCsv');

    if (tbody) {
        tbody.innerHTML = '';
    }
    if (box) {
        box.style.display = 'none';
    }
    if (btnExportTxt) {
        btnExportTxt.style.display = 'none';
    }
    if (btnExportCsv) {
        btnExportCsv.style.display = 'none';
    }
}

/**
 * Exporta os dados sanitizados localmente
 * @param {'txt' | 'csv'} format 
 */
function exportData(format) {
    if (finalOutputList.length === 0) {
        return;
    }

    let outputContent = '';
    let mimeType = '';
    let fileExtension = '';

    const headerName = 'Resultado_Processado';

    if (format === 'txt') {
        outputContent = finalOutputList.join('\n');
        mimeType = 'text/plain;charset=utf-8';
        fileExtension = 'txt';
    } else if (format === 'csv') {
        outputContent = `"${headerName}"\n` + finalOutputList.map((item) => `"${item.replace(/"/g, '""')}"`).join('\n');
        mimeType = 'text/csv;charset=utf-8';
        fileExtension = 'csv';
    }

    const blob = new Blob([outputContent], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data_output_${Date.now()}.${fileExtension}`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Inicialização segura dos manipuladores de eventos após a carga do DOM
document.addEventListener('DOMContentLoaded', () => {
    const btnProcess = document.getElementById('btnProcess');
    const btnClear = document.getElementById('btnClear');
    const btnExportTxt = document.getElementById('btnExportTxt');
    const btnExportCsv = document.getElementById('btnExportCsv');

    if (btnProcess) {
        btnProcess.addEventListener('click', processLists);
    }
    if (btnClear) {
        btnClear.addEventListener('click', clearAll);
    }
    if (btnExportTxt) {
        btnExportTxt.addEventListener('click', () => exportData('txt'));
    }
    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => exportData('csv'));
    }

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
        input.addEventListener('change', handleFileUpload);
    });
});