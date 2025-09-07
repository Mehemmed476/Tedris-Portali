// src/components/ReportPDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'DejaVu Sans',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  subtitle: {
    fontSize: 16,
    color: '#10B981',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    padding: 5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statBox: {
    width: '24%',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: 'grey',
    fontSize: 9,
  },
});

const ReportPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Aylıq Hesabat</Text>
        <Text style={styles.subtitle}>{data.studentName} - {data.monthLabel}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Davamiyyət</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
             <Text style={[styles.statValue, { color: '#065F46' }]}>{data.attendance.present}</Text>
             <Text style={[styles.statLabel, { color: '#065F46' }]}>İştirak</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statValue, { color: '#991B1B' }]}>{data.attendance.absent}</Text>
            <Text style={[styles.statLabel, { color: '#991B1B' }]}>Qayıb</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.statValue, { color: '#92400E' }]}>{data.attendance.late}</Text>
            <Text style={[styles.statLabel, { color: '#92400E' }]}>Gecikmə</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orta Ballar</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statValue, { color: '#1E40AF' }]}>{data.averages.homework}</Text>
            <Text style={[styles.statLabel, { color: '#1E40AF' }]}>Ev Tapşırığı</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statValue, { color: '#1E40AF' }]}>{data.averages.activity}</Text>
            <Text style={[styles.statLabel, { color: '#1E40AF' }]}>Fəallıq</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statValue, { color: '#1E40AF' }]}>{data.averages.discipline}</Text>
            <Text style={[styles.statLabel, { color: '#1E40AF' }]}>Nizam-intizam</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günbəgün Qiymətlər</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { width: '25%' }]}>Tarix</Text>
            <Text style={[styles.tableColHeader, { width: '25%', textAlign: 'center' }]}>Ev Tapşırığı</Text>
            <Text style={[styles.tableColHeader, { width: '25%', textAlign: 'center' }]}>Fəallıq</Text>
            <Text style={[styles.tableColHeader, { width: '25%', textAlign: 'center' }]}>Nizam-intizam</Text>
          </View>
          {data.records.map((rec, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, { width: '25%' }]}>{rec.date}</Text>
              <Text style={[styles.tableCol, { width: '25%', textAlign: 'center' }]}>{rec.homework?.score ?? '-'}</Text>
              <Text style={[styles.tableCol, { width: '25%', textAlign: 'center' }]}>{rec.activity ?? '-'}</Text>
              <Text style={[styles.tableCol, { width: '25%', textAlign: 'center' }]}>{rec.discipline ?? '-'}</Text>
            </View>
          ))}
           {data.records.length === 0 && (
             <View style={styles.tableRow}>
               <Text style={[styles.tableCol, {width: '100%', textAlign: 'center'}]}>Bu ay üçün qiymət daxil edilməyib.</Text>
             </View>
           )}
        </View>
      </View>
      
      <Text style={styles.footer} fixed>
          Tədris Portalı tərəfindən {new Date().toLocaleDateString('az-AZ')} tarixində yaradıldı.
      </Text>
    </Page>
  </Document>
);

export default ReportPDF;