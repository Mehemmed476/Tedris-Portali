import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ICONS } from '../components/Icon.jsx';
import ClassCalendar from '../components/ClassCalendar.jsx';
import { translateAttendance } from '../utils/translation';
import DayDetailModal from '../components/DayDetailModal.jsx';
import { ModeToggle } from '../components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StudentDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  const formatDateTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const ayAdlari = ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"];
    return `${String(d.getDate()).padStart(2,'0')} ${ayAdlari[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/dashboard/student');
        setDashboardData(data);
      } catch (error) {
        console.error("Panel məlumatlarını yükləmək mümkün olmadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDateSelect = (date) => {
    if (!dashboardData) return;
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const record = dashboardData.dailyRecords.find(r => r.date === dateString);
    const events = dashboardData.events.filter(e => {
        const eventDate = new Date(e.date);
        const eventDateKey = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
        return eventDateKey.toDateString() === date.toDateString();
    });
    if (record || (events && events.length > 0)) {
        setSelectedDayData({ record, events, date });
        setIsModalOpen(true);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-muted/40 flex justify-center items-center">{ICONS.spinner}</div>;
  }
  if (!dashboardData) {
    return <div className="min-h-screen bg-muted/40 flex justify-center items-center"><p>Məlumatların yüklənə bilmədi.</p></div>;
  }

  const { student, classData, teacher, announcements, dailyRecords, events } = dashboardData;

  return (
    <>
      <DayDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayData={selectedDayData}
        userRole="student"
        classId={classData?._id}
      />
      <div className="min-h-screen w-full bg-muted/40">
        <header className="h-16 bg-card border-b sticky top-0 z-30">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-xl font-bold text-foreground">Şagird Paneli</h1>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-sm text-muted-foreground">{user.name}</span>
                    <ModeToggle />
                    <Button variant="ghost" size="icon" onClick={onLogout} title="Çıxış">{ICONS.logout}</Button>
                </div>
            </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription>{classData.className} sinifi / Müəllim: {teacher?.email || '...'}</CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader><CardTitle>Dərs Cədvəli</CardTitle></CardHeader>
                    <CardContent>
                        {classData.days && (<ClassCalendar scheduledDays={classData.days} classTime={classData.time} onDateSelect={handleDateSelect} events={events} />)}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-8">
                <Card className="flex-grow flex flex-col">
                    <CardHeader><CardTitle>Son Nəticələrim</CardTitle></CardHeader>
                    <CardContent className="flex-grow">
                        {dailyRecords.length > 0 ? (
                            <Table>
                                <TableHeader><TableRow><TableHead>Tarix</TableHead><TableHead className="text-center">Ev Tapşırığı</TableHead><TableHead className="text-center">Davamiyyət</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {dailyRecords.slice(0, 5).map(r => (
                                        <TableRow key={r.date}>
                                            <TableCell className="font-mono text-xs">{r.date}</TableCell>
                                            <TableCell className="text-center font-semibold">{r.grades?.homework ?? '-'}</TableCell>
                                            <TableCell className="text-center text-xs">{translateAttendance(r.attendance)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (<p className="text-center text-muted-foreground text-sm py-4">Hələ heç bir nəticə daxil edilməyib.</p>)}
                    </CardContent>
                </Card>
                <Card className="flex-grow flex flex-col">
                    <CardHeader><CardTitle>Son Elanlar</CardTitle></CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        {announcements.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-4">Elan yoxdur.</p>) :
                        (announcements.slice(0, 2).map(ann => (
                            <div key={ann._id} className="p-3 bg-muted/50 rounded-lg text-sm">
                                <p className="whitespace-pre-wrap">{ann.text}</p>
                                <p className="text-xs text-muted-foreground mt-2">{formatDateTime(ann.createdAt)}</p>
                            </div>
                        )))}
                    </CardContent>
                </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;