/**
 * Application: Comparador de Listas Web
 * DevSecOps Focus: Strict CSP, Safe DOM Manipulation & Zero External Data Leakage.
 */

import { buildGlobalDictionary, applySetAlgebra, filterDataset } from './engine.js';
import { renderResultsTable, updateMetrics } from './ui.js';
import { exportProcessedData } from './export.js';

'use strict';

// Frame Busting (Proteção contra Clickjacking)
if (self !== top) {
    top.location = self.location;
}

// Banco de dados volátil em memória: Array<{ value: string, origins: Array<string> }>
let memoryDatabase = [];

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
 * Executa o motor de comparação e álgebra de conjuntos
 */
function processLists() {
    // 1. Coleta e mapeamento das 5 listas
    const rawLists = [1, 2, 3, 4, 5].map((i) => ({
        name: document.getElementById(`head${i}`)?.value.trim() || `Lista_${i}`,
        content: document.getElementById(`txt${i}`)?.value || ''
    }));

    const options = {
        lowercase: document.getElementById('chkLowercase')?.checked ?? true,
        trim: document.getElementById('chkTrim')?.checked ?? true
    };

    // 2. Construção do Dicionário Global de Frequência e Origens (engine.js)
    const { globalDict, totalRawCount } = buildGlobalDictionary(rawLists, options);

    // 3. Identificação de listas ativas e regra selecionada
    const activeListNames = rawLists
        .filter((l) => l.content.trim().length > 0)
        .map((l) => l.name);

    const selectedRule = document.querySelector('input[name="logicRule"]:checked');
    const rule = selectedRule ? selectedRule.value : 'unionAll';

    try {
        // 4. Aplicação da álgebra de conjuntos (engine.js)
        const filteredItems = applySetAlgebra(globalDict, activeListNames, rule);

        // 5. Atualização da base volátil em memória
        memoryDatabase = filteredItems.map((item) => ({
            value: item,
            origins: Array.from(globalDict[item])
        }));

        // 6. Atualização de métricas de volumetria (ui.js)
        updateMetrics(totalRawCount, memoryDatabase.length, {
            metTotalRaw: document.getElementById('metTotalRaw'),
            metTotalClean: document.getElementById('metTotalClean'),
            metDuplicates: document.getElementById('metDuplicates'),
            metricsBar: document.getElementById('metricsBar')
        });

        // 7. Renderização inicial dos dados na tabela (ui.js)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        renderResultsTable(memoryDatabase, memoryDatabase.length, {
            tbody: document.getElementById('resultsTableBody'),
            resultsCountEl: document.getElementById('resultsCount')
        });

        // Exibe elementos visuais de saída
        const box = document.getElementById('resultsBox');
        const btnExportTxt = document.getElementById('btnExportTxt');
        const btnExportCsv = document.getElementById('btnExportCsv');

        if (box) box.style.display = 'block';
        if (btnExportTxt) btnExportTxt.style.display = 'inline-block';
        if (btnExportCsv) btnExportCsv.style.display = 'inline-block';

    } catch (error) {
        alert(error.message);
    }
}

/**
 * Filtra a tabela em tempo real com suporte a Texto Simples e Regex
 */
function handleFilter() {
    const searchInput = document.getElementById('searchInput');
    const chkRegex = document.getElementById('chkRegexSearch');

    if (!searchInput) return;

    const query = searchInput.value.trim();
    const isRegexMode = chkRegex ? chkRegex.checked : false;

    const filtered = filterDataset(memoryDatabase, query, isRegexMode);

    if (filtered === null) {
        const countLabel = document.getElementById('resultsCount');
        if (countLabel) countLabel.textContent = '⚠️ Sintaxe Regex inválida...';
        return;
    }

    renderResultsTable(filtered, memoryDatabase.length, {
        tbody: document.getElementById('resultsTableBody'),
        resultsCountEl: document.getElementById('resultsCount')
    });
}

/**
 * Reseta todos os campos, métricas e memória da interface
 */
function clearAll() {
    [1, 2, 3, 4, 5].forEach((i) => {
        const txt = document.getElementById(`txt${i}`);
        const file = document.getElementById(`file${i}`);
        if (txt) txt.value = '';
        if (file) file.value = '';
    });

    memoryDatabase = [];

    const box = document.getElementById('resultsBox');
    const metricsBar = document.getElementById('metricsBar');
    const tbody = document.getElementById('resultsTableBody');
    const btnExportTxt = document.getElementById('btnExportTxt');
    const btnExportCsv = document.getElementById('btnExportCsv');
    const searchInput = document.getElementById('searchInput');

    if (tbody) tbody.replaceChildren();
    if (box) box.style.display = 'none';
    if (metricsBar) metricsBar.style.display = 'none';
    if (btnExportTxt) btnExportTxt.style.display = 'none';
    if (btnExportCsv) btnExportCsv.style.display = 'none';
    if (searchInput) searchInput.value = '';
}

// Inicialização segura dos manipuladores de eventos pós DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    const btnProcess = document.getElementById('btnProcess');
    const btnClear = document.getElementById('btnClear');
    const btnExportTxt = document.getElementById('btnExportTxt');
    const btnExportCsv = document.getElementById('btnExportCsv');
    const searchInput = document.getElementById('searchInput');

    if (btnProcess) btnProcess.addEventListener('click', processLists);
    if (btnClear) btnClear.addEventListener('click', clearAll);
    
    // Delegação para o módulo de exportação isolado (export.js)
    if (btnExportTxt) btnExportTxt.addEventListener('click', () => exportProcessedData(memoryDatabase, 'txt'));
    if (btnExportCsv) btnExportCsv.addEventListener('click', () => exportProcessedData(memoryDatabase, 'csv'));

    // Filtro dinâmico na tabela
    if (searchInput) searchInput.addEventListener('input', handleFilter);

    // Upload seguro de arquivos
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
        input.addEventListener('change', handleFileUpload);
    });
});