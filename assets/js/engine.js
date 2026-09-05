/**
 * Higieniza uma string individual com base nas opções ativas.
 */
function sanitizeToken(token, options = {}) {
  let val = token;
  if (options.trim) val = val.trim();
  if (options.lowercase) val = val.toLowerCase();
  return val;
}

/**
 * Constrói o Dicionário Global de Frequência e Rastreabilidade.
 * Aceita um array de até N listas (ex: 5 listas).
 * 
 * @param {Array<{ name: string, content: string }>} lists - Estrutura com nome e conteúdo de cada lista
 * @param {Object} options - Configurações de sanitização { trim: boolean, lowercase: boolean }
 */
export function buildGlobalDictionary(lists, options) {
  const globalDict = {};
  let totalRawCount = 0;

  lists.forEach((list) => {
    if (!list.content) return;

    const tokens = list.content
      .split('\n')
      .map((token) => sanitizeToken(token, options))
      .filter((token) => token.length > 0);

    totalRawCount += tokens.length;

    tokens.forEach((item) => {
      if (!globalDict[item]) {
        globalDict[item] = new Set();
      }
      globalDict[item].add(list.name);
    });
  });

  return { globalDict, totalRawCount };
}

/**
 * Aplica as regras de Álgebra de Conjuntos sobre o dicionário global.
 */
export function applySetAlgebra(globalDict, activeListNames, rule) {
  const allItems = Object.keys(globalDict);

  switch (rule) {
    case 'unionAll':
      return allItems;

    case 'intersectAll':
      if (activeListNames.length < 2) {
        throw new Error('Preencha ao menos 2 listas para obter a interseção estrita.');
      }
      return allItems.filter((item) =>
        activeListNames.every((name) => globalDict[item].has(name))
      );

    case 'exclusiveList1': {
      const primaryListName = activeListNames[0];
      return allItems.filter((item) => 
        globalDict[item].has(primaryListName) && globalDict[item].size === 1
      );
    }

    case 'atLeastTwo':
      return allItems.filter((item) => globalDict[item].size >= 2);

    default:
      return allItems;
  }
}

/**
 * Filtra a memória por busca simples ou Expressão Regular de forma segura.
 */
export function filterDataset(memoryDatabase, query, isRegexMode) {
  if (!query) return memoryDatabase;

  if (isRegexMode) {
    try {
      const regex = new RegExp(query, 'i');
      return memoryDatabase.filter((record) => regex.test(record.value));
    } catch {
      return null; // Erro de sintaxe regex capturado
    }
  }

  const lowerQuery = query.toLowerCase();
  return memoryDatabase.filter((record) =>
    record.value.toLowerCase().includes(lowerQuery)
  );
}