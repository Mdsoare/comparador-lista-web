/**
 * Exporta os dados consolidados em formato TXT ou CSV.
 */
export function exportProcessedData(memoryDatabase, format = 'csv') {
  if (!memoryDatabase || memoryDatabase.length === 0) return;

  let content = '';
  let mimeType = '';
  let extension = '';

  if (format === 'txt') {
    content = memoryDatabase.map((item) => item.value).join('\n');
    mimeType = 'text/plain;charset=utf-8';
    extension = 'txt';
  } else if (format === 'csv') {
    // Escape de aspas duplas de acordo com o padrão RFC-4180
    const header = '"Item_Sanitizado","Origens_Mapeadas"\n';
    const rows = memoryDatabase.map(
      (x) => `"${x.value.replace(/"/g, '""')}","${x.origins.join(' | ')}"`
    );
    content = header + rows.join('\n');
    mimeType = 'text/csv;charset=utf-8';
    extension = 'csv';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  
  anchor.href = url;
  anchor.download = `relatorio_comparacao_${Date.now()}.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  
  URL.revokeObjectURL(url);
}