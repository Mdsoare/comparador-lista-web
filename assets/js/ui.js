/**
 * Renderiza a tabela de resultados e atualiza os contadores.
 * Utiliza APIs nativas do DOM (createElement / textContent) prevenindo DOM-XSS.
 */
export function renderResultsTable(dataset, totalInMemory, containerElements) {
  const { tbody, resultsCountEl } = containerElements;
  
  tbody.replaceChildren(); // Limpa a tabela de forma performática
  resultsCountEl.textContent = `${dataset.length} de ${totalInMemory} registros.`;

  dataset.forEach((record, index) => {
    const tr = document.createElement('tr');

    // Coluna 1: Linha
    const tdIndex = document.createElement('td');
    tdIndex.style.color = 'var(--text-muted, #9ca3af)';
    tdIndex.textContent = String(index + 1);

    // Coluna 2: Diff Mapping (Badges de Origem)
    const tdOrigins = document.createElement('td');
    record.origins.forEach((origName) => {
      const badge = document.createElement('span');
      badge.className = 'badge-source';
      badge.textContent = origName;
      tdOrigins.appendChild(badge);
    });

    // Coluna 3: Dado Sanitizado
    const tdValue = document.createElement('td');
    tdValue.textContent = record.value;

    tr.appendChild(tdIndex);
    tr.appendChild(tdOrigins);
    tr.appendChild(tdValue);

    tbody.appendChild(tr);
  });
}

/**
 * Atualiza os cartões de volumetria e métricas analíticas.
 */
export function updateMetrics(totalRaw, totalClean, elements) {
  elements.metTotalRaw.textContent = totalRaw;
  elements.metTotalClean.textContent = totalClean;
  elements.metDuplicates.textContent = totalRaw - totalClean;
  elements.metricsBar.style.display = 'grid';
}