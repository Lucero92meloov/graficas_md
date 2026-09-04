/**
 * Parser de datos Markdown a JSON para Recharts.
 * Interpreta tablas con columnas de Fecha, Visualizaciones (Azul) y Likes (Rosa).
 */

export function parseMarkdownChart(mdContent) {
  if (!mdContent || typeof mdContent !== 'string') {
    return {
      data: [],
      maxPrimary: 0,
      maxSecondary: 0,
      primaryKey: 'Visualizaciones',
      secondaryKey: 'Likes',
      hasData: false,
      error: 'Pega tu tabla de Markdown en el cuadro de la izquierda para generar la gráfica.'
    };
  }

  const lines = mdContent.split('\n').map(l => l.trim()).filter(Boolean);
  const tableLines = lines.filter(line => line.startsWith('|') && line.endsWith('|'));

  if (tableLines.length < 2) {
    return {
      data: [],
      maxPrimary: 0,
      maxSecondary: 0,
      primaryKey: 'Visualizaciones',
      secondaryKey: 'Likes',
      hasData: false,
      error: 'Pega una tabla Markdown en formato | Fecha | Visualizaciones | Likes |'
    };
  }

  // Parsear encabezados
  const headerLine = tableLines[0];
  const rawHeaders = headerLine
    .split('|')
    .slice(1, -1)
    .map(h => h.trim());

  if (rawHeaders.length < 2) {
    return {
      data: [],
      maxPrimary: 0,
      maxSecondary: 0,
      primaryKey: 'Visualizaciones',
      secondaryKey: 'Likes',
      hasData: false,
      error: 'La tabla requiere al menos 2 columnas de datos.'
    };
  }

  const mapHeaderName = (name, isSecondary = false) => {
    if (!name) return isSecondary ? 'Likes' : 'Visualizaciones';
    const lower = name.toLowerCase();
    if (lower.includes('ojo') || lower.includes('vista') || lower.includes('visualiza')) return 'Visualizaciones';
    if (lower.includes('coraz') || lower.includes('like') || lower.includes('comentar') || lower.includes('interac') || isSecondary) return 'Likes';
    return name;
  };

  const primaryKey = mapHeaderName(rawHeaders[1], false);
  const secondaryKey = mapHeaderName(rawHeaders[2], true);

  // Descartar línea separadora (|---|---|)
  const dataRows = tableLines.filter(line => {
    const isDivider = line.replace(/\|/g, '').replace(/-/g, '').replace(/:/g, '').trim() === '';
    return !isDivider && line !== headerLine;
  });

  let rawData = [];
  let maxPrimary = 0;
  let maxSecondary = 0;

  dataRows.forEach((row, index) => {
    const cells = row.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length >= 2) {
      const cell1Str = cells[1] || '';
      const cell2Str = cells[2] || '';

      // Si ambas celdas de datos están vacías/blancas, es una fila no registrada o plantilla; omitir
      if (cell1Str === '' && cell2Str === '') {
        return;
      }

      const fecha = cells[0] || `Punto ${index + 1}`;
      
      const cleanNum = (str) => {
        if (!str || str.trim() === '') return 0;
        const val = parseFloat(str.replace(/[^0-9.-]/g, ''));
        return isNaN(val) ? 0 : val;
      };

      const primaryVal = cleanNum(cell1Str);
      const secondaryVal = cell2Str !== '' ? cleanNum(cell2Str) : 0;

      if (primaryVal > maxPrimary) maxPrimary = primaryVal;
      if (secondaryVal > maxSecondary) maxSecondary = secondaryVal;

      rawData.push({
        id: index,
        fecha,
        primaryVal,
        secondaryVal
      });
    }
  });

  if (rawData.length === 0) {
    return {
      data: [],
      maxPrimary: 0,
      maxSecondary: 0,
      primaryKey,
      secondaryKey,
      hasData: false,
      error: 'No se encontraron datos numéricos válidos en la tabla.'
    };
  }

  // Calcular porcentajes relativos respecto al máximo
  const processedData = rawData.map(item => {
    const primaryPct = maxPrimary > 0 ? Number(((item.primaryVal / maxPrimary) * 100).toFixed(1)) : 0;
    const secondaryPct = maxSecondary > 0 ? Number(((item.secondaryVal / maxSecondary) * 100).toFixed(1)) : 0;

    return {
      fecha: item.fecha,
      primaryVal: item.primaryVal,
      secondaryVal: item.secondaryVal,
      primaryPct,
      secondaryPct
    };
  });

  return {
    data: processedData,
    maxPrimary,
    maxSecondary,
    primaryKey,
    secondaryKey,
    hasData: true,
    error: null
  };
}
