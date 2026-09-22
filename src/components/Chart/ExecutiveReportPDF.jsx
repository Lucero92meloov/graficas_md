import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PACKAGES } from '../PackageFilter/PackageSelector';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#F5EFEB',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#2F4156'
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  titleGroup: {
    flexDirection: 'column'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  badge: {
    backgroundColor: '#C8D9E6',
    color: '#2F4156',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10
  },
  subtitle: {
    fontSize: 9,
    color: '#576B80',
    marginTop: 2
  },
  dateGroup: {
    alignItems: 'flex-end'
  },
  dateLabel: {
    fontSize: 8,
    color: '#576B80'
  },
  dateValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2F4156',
    marginTop: 1
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  kpiLabel: {
    fontSize: 8,
    color: '#576B80',
    fontWeight: 'bold',
    marginBottom: 4
  },
  kpiValuePrimary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A75A4'
  },
  kpiValueSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E07A93'
  },
  kpiValueDark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  kpiSubtext: {
    fontSize: 8,
    color: '#576B80',
    marginTop: 2
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  packageHeader: {
    marginBottom: 6
  },
  packageTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  packageRow: {
    flexDirection: 'row',
    gap: 8
  },
  packageBox: {
    flex: 1,
    backgroundColor: '#F5EFEB',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1
  },
  packageBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  packageBoxLabel: {
    fontSize: 9,
    fontWeight: 'bold'
  },
  packageBoxRatio: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  packageBoxFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  packageBoxPct: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  pillSuccessBlue: {
    backgroundColor: '#C8D9E6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  pillSuccessBlueText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  pillSuccessPink: {
    backgroundColor: '#F7C9D4',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  pillSuccessPinkText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  pillDanger: {
    backgroundColor: '#FFE1E6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  pillDangerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#E07A93'
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2F4156',
    borderBottomWidth: 1,
    borderBottomColor: '#E2D9D2',
    paddingBottom: 6,
    marginBottom: 8
  },
  chartImage: {
    width: '100%',
    height: 220,
    objectFit: 'fill'
  },
  splitRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  splitColLeft: {
    width: '38%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  splitColRight: {
    width: '62%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  summaryItem: {
    backgroundColor: '#F5EFEB',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2D9D2'
  },
  summaryLabel: {
    fontSize: 9,
    color: '#2F4156',
    fontWeight: 'bold'
  },
  summaryValPrimary: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#3A75A4'
  },
  summaryValSecondary: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E07A93'
  },
  summaryValDark: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2F4156'
  },
  footerText: {
    fontSize: 8,
    color: '#576B80',
    textAlign: 'center',
    marginTop: 8
  }
});

export function ExecutiveReportPDF({
  data = [],
  maxPrimary = 0,
  maxSecondary = 0,
  primaryKey = 'Visualizaciones',
  secondaryKey = 'Likes',
  chartImageUri = '',
  chartAspectRatio = null,
  currentDateStr = '',
  selectedPackage = null
}) {
  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);
  const engagementRatio = maxPrimary > 0 ? ((maxSecondary / maxPrimary) * 100).toFixed(1) : '0';

  const totalPrimary = data.reduce((acc, item) => acc + (item.primaryVal || 0), 0);
  const totalSecondary = data.reduce((acc, item) => acc + (item.secondaryVal || 0), 0);
  const totalPoints = data.length;

  const avgPrimary = Math.round(totalPrimary / Math.max(totalPoints, 1));
  const avgSecondary = Math.round(totalSecondary / Math.max(totalPoints, 1));

  // Métricas del paquete seleccionado
  const activePkg = PACKAGES.find((p) => p.id === selectedPackage);
  let viewsPct = '0';
  let likesPct = '0';
  let viewsMissing = 0;
  let likesMissing = 0;
  let viewsExtra = 0;
  let likesExtra = 0;
  let isViewsComplete = false;
  let isLikesComplete = false;

  if (activePkg) {
    viewsPct = ((maxPrimary / activePkg.views) * 100).toFixed(1);
    likesPct = ((maxSecondary / activePkg.likes) * 100).toFixed(1);
    isViewsComplete = maxPrimary >= activePkg.views;
    isLikesComplete = maxSecondary >= activePkg.likes;
    viewsMissing = activePkg.views - maxPrimary;
    likesMissing = activePkg.likes - maxSecondary;
    viewsExtra = maxPrimary - activePkg.views;
    likesExtra = maxSecondary - activePkg.likes;
  }

  // Ancho utilizable de la hoja A4 (595.28 - 48 = 547.28 pt)
  const pdfCardWidth = 547;
  const calculatedHeight = chartAspectRatio ? Math.min(Math.max(Math.round(pdfCardWidth / chartAspectRatio), 140), 250) : 200;

  return (
    <Document title="Reporte Ejecutivo de Rendimiento">
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerCard}>
          <View style={styles.titleGroup}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Reporte Ejecutivo de Rendimiento</Text>
              <Text style={styles.badge}>CONSOLIDADO</Text>
            </View>
            <Text style={styles.subtitle}>
              Análisis completo de {displayPrimaryKey} e Interacciones ({displaySecondaryKey})
            </Text>
          </View>
          <View style={styles.dateGroup}>
            <Text style={styles.dateLabel}>Fecha de emisión</Text>
            <Text style={styles.dateValue}>{currentDateStr || '04 de septiembre de 2026'}</Text>
          </View>
        </View>

        {/* Tarjetas KPI de Resumen */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{displayPrimaryKey.toUpperCase()} MÁX.</Text>
            <Text style={styles.kpiValuePrimary}>{formatNumber(maxPrimary)}</Text>
            <Text style={styles.kpiSubtext}>Promedio: {formatNumber(avgPrimary)} / toma</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{displaySecondaryKey.toUpperCase()} MÁX.</Text>
            <Text style={styles.kpiValueSecondary}>{formatNumber(maxSecondary)}</Text>
            <Text style={styles.kpiSubtext}>Promedio: {formatNumber(avgSecondary)} / toma</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>RATIO REACCIÓN</Text>
            <Text style={styles.kpiValueDark}>{engagementRatio}%</Text>
            <Text style={styles.kpiSubtext}>Likes vs Visualizaciones</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>MUESTRAS / TOMAS</Text>
            <Text style={styles.kpiValueDark}>{totalPoints}</Text>
            <Text style={styles.kpiSubtext}>Registros procesados</Text>
          </View>
        </View>

        {/* Evaluación de Paquete (si hay un paquete activo) */}
        {activePkg && (
          <View style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <Text style={styles.packageTitle}>
                Evaluación de Paquete: <Text style={{ color: '#3A75A4' }}>{activePkg.label}</Text>
              </Text>
            </View>

            <View style={styles.packageRow}>
              {/* Tarjeta Visualizaciones */}
              <View style={[styles.packageBox, { borderColor: '#9FBCD2' }]}>
                <View style={styles.packageBoxHeader}>
                  <Text style={[styles.packageBoxLabel, { color: '#3A75A4' }]}>Visualizaciones</Text>
                  <Text style={styles.packageBoxRatio}>
                    {formatNumber(maxPrimary)} / {formatNumber(activePkg.views)}
                  </Text>
                </View>

                <View style={styles.packageBoxFooter}>
                  <Text style={[styles.packageBoxPct, { color: '#3A75A4' }]}>
                    {viewsPct}%
                  </Text>
                  <View style={isViewsComplete ? styles.pillSuccessBlue : styles.pillDanger}>
                    <Text style={isViewsComplete ? styles.pillSuccessBlueText : styles.pillDangerText}>
                      {isViewsComplete
                        ? `+${formatNumber(viewsExtra)} extra (+${(viewsPct - 100).toFixed(1)}% 🎉)`
                        : `Faltan ${formatNumber(viewsMissing)} vistas (${(100 - viewsPct).toFixed(1)}%)`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tarjeta Likes */}
              <View style={[styles.packageBox, { borderColor: '#E8A3B4' }]}>
                <View style={styles.packageBoxHeader}>
                  <Text style={[styles.packageBoxLabel, { color: '#E07A93' }]}>Likes</Text>
                  <Text style={styles.packageBoxRatio}>
                    {formatNumber(maxSecondary)} / {formatNumber(activePkg.likes)}
                  </Text>
                </View>

                <View style={styles.packageBoxFooter}>
                  <Text style={[styles.packageBoxPct, { color: '#E07A93' }]}>
                    {likesPct}%
                  </Text>
                  <View style={isLikesComplete ? styles.pillSuccessPink : styles.pillDanger}>
                    <Text style={isLikesComplete ? styles.pillSuccessPinkText : styles.pillDangerText}>
                      {isLikesComplete
                        ? `+${formatNumber(likesExtra)} extra (+${(likesPct - 100).toFixed(1)}% 🎉)`
                        : `Faltan ${formatNumber(likesMissing)} likes (${(100 - likesPct).toFixed(1)}%)`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Gráfica Principal de Tendencia */}
        <View style={styles.sectionCard}>
          {chartImageUri ? (
            <Image src={chartImageUri} style={[styles.chartImage, { height: calculatedHeight }]} />
          ) : null}
        </View>

        {/* Bloque Secundario */}
        <View style={styles.splitRow}>
          {/* Distribución */}
          <View style={styles.splitColLeft}>
            <Text style={styles.sectionHeader}>Distribución de Alcance</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{displayPrimaryKey}</Text>
              <Text style={styles.summaryValPrimary}>{formatNumber(maxPrimary)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{displaySecondaryKey}</Text>
              <Text style={styles.summaryValSecondary}>{formatNumber(maxSecondary)}</Text>
            </View>
          </View>

          {/* Conclusiones */}
          <View style={styles.splitColRight}>
            <Text style={styles.sectionHeader}>Estado del Objetivo y Conclusiones del Reporte</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pico de Visualizaciones</Text>
              <Text style={styles.summaryValPrimary}>{formatNumber(maxPrimary)} Vistas</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pico de Interacciones (Likes)</Text>
              <Text style={styles.summaryValSecondary}>{formatNumber(maxSecondary)} Likes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Efectividad de Conversión (Engagement)</Text>
              <Text style={styles.summaryValDark}>{engagementRatio}% Ratio</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>Documento PDF generado por MD Chart Studio • Documento Oficial de Rendimiento</Text>
      </Page>
    </Document>
  );
}
