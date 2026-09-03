/**
 * Datos de ejemplo iniciales enfocados en Visualizaciones y Likes.
 */

export const INITIAL_FILESYSTEM = [
  {
    id: 'folder-reportes',
    name: 'Mis Gráficas',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'file-vistas-principales',
        name: 'grafica-rendimiento.md',
        type: 'file',
        content: `# Reporte de Rendimiento

Pega tu tabla Markdown aquí abajo para actualizar la gráfica instantáneamente.

| Fecha | Visualizaciones | Likes |
| --- | --- | --- |
| 26/08 19:41 | 102 | 13 |
| 27/08 04:15 | 179 | 15 |
| 27/08 18:57 | 205 | 19 |
| 28/08 02:30 | 230 | 22 |
| 28/08 15:07 | 307 | 26 |
| 28/08 22:40 | 315 | 32 |
| 29/08 08:40 | 358 | 40 |
| 29/08 19:20 | 486 | 56 |
| 30/08 06:06 | 563 | 62 |
| 30/08 14:10 | 691 | 71 |
| 31/08 00:03 | 845 | 71 |
| 31/08 11:30 | 973 | 71 |
| 31/08 21:40 | 1049 | 75 |
| 01/09 09:15 | 1382 | 80 |
| 01/09 20:00 | 1792 | 85 |
| 02/09 10:57 | 1997 | 97 |
| 02/09 18:30 | 2074 | 101 |
| 03/09 08:00 | 2330 | 117 |
| 03/09 11:00 | 2560 | 118 |
`
      }
    ]
  }
];
