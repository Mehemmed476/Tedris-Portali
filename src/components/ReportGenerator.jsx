// src/components/ReportGenerator.jsx
import React, { useState, useMemo } from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ICONS } from './Icon.jsx';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF.jsx';

const ReportGenerator = ({ students, classId }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthOptions = useMemo(() => {
    const months = [];
    const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const value = `${year}-${String(month + 1).padStart(2, '0')}`;
      const label = `${monthNames[month]} ${year}`;
      months.push({ value, label });
    }
    return months;
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedStudentId || !selectedMonth) {
      setError("Zəhmət olmasa, şagird və ay seçin.");
      return;
    }
    setError('');
    setLoading(true);
    setReportData(null);

    try {
      const [year, month] = selectedMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

      const recordsRef = collection(db, 'classes', classId, 'dailyRecords');
      const q = query(recordsRef, where(documentId(), '>=', startDate), where(documentId(), '<=', endDate));
      const querySnapshot = await getDocs(q);

      let presentDays = 0, absentDays = 0, lateDays = 0;
      const homeworkGrades = [], activityGrades = [], disciplineGrades = [];
      const detailedRecords = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const studentAttendance = data.attendance?.[selectedStudentId];
        const studentGrades = data.grades?.[selectedStudentId];

        if (studentAttendance) {
          if (studentAttendance === 'present') presentDays++;
          else if (studentAttendance === 'absent') absentDays++;
          else if (studentAttendance === 'late') lateDays++;
        }

        if (studentGrades) {
            detailedRecords.push({
                date: doc.id,
                homework: studentGrades.homework,
                activity: studentGrades.activity,
                discipline: studentGrades.discipline,
            });
            if (typeof studentGrades.homework?.score === 'number') homeworkGrades.push(studentGrades.homework.score);
            if (typeof studentGrades.activity === 'number') activityGrades.push(studentGrades.activity);
            if (typeof studentGrades.discipline === 'number') disciplineGrades.push(studentGrades.discipline);
        }
      });
      
      const calculateAverage = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 'N/A';
      const studentName = students.find(s => s.id === selectedStudentId)?.name || '';
      const monthLabel = monthOptions.find(m => m.value === selectedMonth)?.label || '';
      
      setReportData({
        studentName,
        monthLabel,
        attendance: { present: presentDays, absent: absentDays, late: lateDays },
        averages: {
          homework: calculateAverage(homeworkGrades),
          activity: calculateAverage(activityGrades),
          discipline: calculateAverage(disciplineGrades),
        },
        records: detailedRecords.sort((a, b) => a.date.localeCompare(b.date))
      });

    } catch (err) {
      console.error("Hesabat yaradılarkən xəta:", err);
      setError("Məlumatları yükləmək mümkün olmadı. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrint = () => {
      window.print();
  }

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border print:shadow-none print:border-none">
      <div className="print:hidden">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Aylıq Hesabatlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-zinc-50 p-4 rounded-xl border">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Şagird</label>
            <select value={selectedStudentId} onChange={(e) => {setSelectedStudentId(e.target.value); setReportData(null);}} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Şagird seçin...</option>
              {students.map(student => (<option key={student.id} value={student.id}>{student.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Ay</label>
            <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setReportData(null);}} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Ay seçin...</option>
              {monthOptions.map(month => (<option key={month.value} value={month.value}>{month.label}</option>))}
            </select>
          </div>
          <div>
            <button onClick={handleGenerateReport} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 shadow-sm">
              {loading ? ICONS.spinnerSmall : "Hesabat Yarat"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      <div className="mt-6" id="report-content">
        {loading && <p className="text-zinc-500 text-center">Hesabat hazırlanır...</p>}
        {!loading && !reportData && (<div className="text-center text-zinc-500 bg-zinc-50 p-6 rounded-lg border border-dashed border-zinc-200 print:hidden"><p>Hesabatı görmək üçün yuxarıdan şagird və ay seçin.</p></div>)}
        
        {reportData && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-2xl font-bold text-gray-900">Hesabat: {reportData.studentName}</h4>
                    <p className="text-lg font-medium text-emerald-700">{reportData.monthLabel}</p>
                </div>
                <div className="flex items-center gap-3 print:hidden">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 rounded-lg">Çap Et</button>
                    <PDFDownloadLink
                        document={<ReportPDF data={reportData} />}
                        fileName={`hesabat-${reportData.studentName.replace(' ', '_')}-${selectedMonth}.pdf`}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
                    >
                        {({ loading }) => loading ? 'Hazırlanır...' : 'PDF Yüklə' }
                    </PDFDownloadLink>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center"><div className="text-3xl font-bold">{reportData.attendance.present}</div><div className="text-sm font-medium">İştirak</div></div>
                <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center"><div className="text-3xl font-bold">{reportData.attendance.absent}</div><div className="text-sm font-medium">Qayıb</div></div>
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-center"><div className="text-3xl font-bold">{reportData.attendance.late}</div><div className="text-sm font-medium">Gecikmə</div></div>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-center"><div className="text-3xl font-bold">{reportData.averages.activity}</div><div className="text-sm font-medium">Orta Fəallıq</div></div>
            </div>

            <div>
              <h5 className="font-semibold mb-2">Günbəgün Qiymətlər</h5>
              {reportData.records.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zinc-50"><tr>
                            <th className="p-2 text-left font-semibold text-zinc-600">Tarix</th>
                            <th className="p-2 text-center font-semibold text-zinc-600">Ev Tapşırığı</th>
                            <th className="p-2 text-center font-semibold text-zinc-600">Fəallıq</th>
                            <th className="p-2 text-center font-semibold text-zinc-600">Nizam-intizam</th>
                        </tr></thead>
                        <tbody className="divide-y">
                            {reportData.records.map(rec => (
                                <tr key={rec.date}>
                                    <td className="p-2 font-mono">{rec.date}</td>
                                    <td className="p-2 text-center font-medium">{rec.homework?.score ?? '-'}</td>
                                    <td className="p-2 text-center font-medium">{rec.activity ?? '-'}</td>
                                    <td className="p-2 text-center font-medium">{rec.discipline ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              ) : <p className="text-zinc-500">Bu ay üçün heç bir qiymət daxil edilməyib.</p>}
            </div>
          </div>
        )}
      </div>
       <style>{`
            @media print {
                body * { visibility: hidden; }
                #report-content, #report-content * { visibility: visible; }
                #report-content { position: absolute; left: 0; top: 0; width: 100%; }
            }
        `}</style>
    </div>
  );
};

export default ReportGenerator;