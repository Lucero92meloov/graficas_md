import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
    height: 250,
    objectFit: 'contain'
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
  currentDateStr = ''
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

        {/* Gráfica Principal de Tendencia */}
        <View style={styles.sectionCard}>
          {chartImageUri ? (
            <Image src={chartImageUri} style={styles.chartImage} />
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
