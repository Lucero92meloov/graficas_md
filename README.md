# 📊 MD Chart Studio

**MD Chart Studio** es una aplicación web interactiva desarrollada con **React, Vite y Tailwind CSS** diseñada para copiar y pegar tablas de datos en formato **Markdown** (o transcribir fotos de apuntes manuscritos con IA) y generar instantáneamente **gráficas de líneas dinámicas y reportes infográficos** exportables en alta calidad PNG.

![MD Chart Studio](public/favicon.svg)

---

## 🌟 Características Principales

- 📈 **Gráfica Lineal de Doble Serie**: Visualizaciones (Línea Azul `#3A75A4`) vs Likes (Línea Rosa `#E07A93`).
- 🤖 **Prompt para IA de Fotografías a Mano**: Copia con 1 solo clic el prompt preparado para adjuntar fotos de libretas o notas en papel en ChatGPT/Claude/Gemini y transcribirlas en tablas Markdown.
- 📋 **Pegado Automático desde el Portapapeles**: Botón *"Pegar Tabla Markdown"* que inserta la tabla directamente y actualiza la gráfica sin necesidad de editar manualmente.
- 📦 **Filtro por Paquete Adquirido & Sobrecumplimiento**: Evalúa metas contratadas (2K, 5K, 10K, 20K, 50K, 100K, 500K, 1M) y calcula métricas en tiempo real:
  - Porcentaje alcanzado (% de la meta).
  - Vistas y likes faltantes exactos.
  - Porcentaje extra de sobrecumplimiento (`+28.0% extra 🎉`).
- 🖼️ **Exportación de Infografía PNG en Alta Resolución**: Descarga el reporte completo (Métricas + Gráfica con números sobre cada punto + Evaluación de paquetes) en formato `.png` en 1 clic.
- 📱 **Diseño 100% Responsivo Móvil**: Adaptado para navegar cómodamente desde celulares con Grid 2x2 y desplazamiento fluido.
- 🎨 **Paleta de Colores Pinterest Warm Light**: Tema claro confortable a la vista (Beige `#F5EFEB`, Navy `#2F4156`, Azul Cielo `#C8D9E6`, Rosa Azalea `#F7C9D4`).

---

## 🚀 Instalación y Uso Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/graficas_md.git

# 2. Entrar a la carpeta del proyecto
cd graficas_md

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

---

## 🛠️ Tecnologías Utilizadas

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Recharts** (Gráficas interactivas)
- **html-to-image** (Exportación de infografías en PNG)
- **Lucide React** (Iconografía animada y responsiva)
- **Canvas Confetti** (Efectos de celebración)
