import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ICONS } from './Icon.jsx';
import StudentDetailModal from './StudentDetailModal.jsx';
import Swal from 'sweetalert2';
import ClassCalendar from './ClassCalendar.jsx';
import DayDetailPage from './DayDetailPage.jsx';
import TestResultPage from './TestResultPage';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClassDetail = ({ selectedClass, user, onBack, showToast }) => {
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({ students: true, announcements: true, events: true });
  
  const [newStudentName, setNewStudentName] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementLoading, setAnnouncementLoading] = useState(false);

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentName, setEditingStudentName] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);
  
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [panelType, setPanelType] = useState('daily');
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'test' });
  const [eventLoading, setEventLoading] = useState(false);
  
  const handleDateSelect = (date) => {
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.date);
        const eventDateKey = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
        return eventDateKey.toDateString() === date.toDateString();
    });
    const isTestDay = dayEvents.some(e => e.type === 'test');
    setPanelType(isTestDay ? 'test' : 'daily');
    setSelectedDate(date);
    setIsDayDetailOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const ayAdlari = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    return `${date.getDate()} ${ayAdlari[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!selectedClass?._id) return;
    const fetchData = async () => {
      try {
        setLoading({ students: true, announcements: true, events: true });
        const [studentsRes, announcementsRes, eventsRes] = await Promise.all([
          api.get(`/students/class/${selectedClass._id}`),
          api.get(`/announcements/class/${selectedClass._id}`),
          api.get(`/events/class/${selectedClass._id}`)
        ]);
        setStudents(studentsRes.data);
        setAnnouncements(announcementsRes.data);
        setEvents(eventsRes.data);
      } catch (err) { console.error(err); } 
      finally { setLoading({ students: false, announcements: false, events: false }); }
    };
    fetchData();
  }, [selectedClass]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (newStudentName.trim() === "") return;
    setStudentLoading(true);
    try {
      const { data: newStudent } = await api.post('/students', { name: newStudentName, classId: selectedClass._id });
      setStudents(prevStudents => [...prevStudents, newStudent]);
      setNewStudentName('');
      showToast(`${newStudentName} adlı şagird uğurla əlavə edildi!`);
    } catch (err) { showToast("Şagird əlavə edilə bilmədi.", "error"); console.error(err); } 
    finally { setStudentLoading(false); }
  };

  const handleDeleteStudent = async (studentId) => {
    Swal.fire({ title: 'Əminsiniz?', text: "Bu şagirdi sinifdən silmək istədiyinizə əminsiniz?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Bəli, sil!', cancelButtonText: 'Ləğv et'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/students/${studentId}`);
          setStudents(prev => prev.filter(s => s._id !== studentId));
          Swal.fire('Silindi!', 'Şagird müvəffəqiyyətlə silindi.', 'success');
        } catch (err) { Swal.fire('Xəta!', 'Şagirdi silmək mümkün olmadı.', 'error'); }
      }
    });
  };

  const handleUpdateStudentName = async () => {
    if (editingStudentName.trim() === '') { cancelEdit(); return; };
    try {
      const { data: updatedStudent } = await api.put(`/students/${editingStudentId}`, { name: editingStudentName });
      setStudents(prev => prev.map(s => s._id === editingStudentId ? updatedStudent : s));
      showToast("Şagird adı uğurla yeniləndi.");
    } catch (error) { showToast("Ad yenilənərkən xəta baş verdi.", "error"); } 
    finally { setEditingStudentId(null); setEditingStudentName(''); }
  };

  const startEdit = (student) => {
    setEditingStudentId(student._id);
    setEditingStudentName(student.name);
  };

  const cancelEdit = () => {
    setEditingStudentId(null);
    setEditingStudentName('');
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (newAnnouncement.trim() === "") return;
    setAnnouncementLoading(true);
    try {
      const { data: createdAnnouncement } = await api.post('/announcements', { text: newAnnouncement, classId: selectedClass._id });
      setAnnouncements(prev => [createdAnnouncement, ...prev]);
      setNewAnnouncement('');
      showToast("Elan uğurla göndərildi!");
    } catch (error) { showToast("Elan göndərilə bilmədi.", "error"); } 
    finally { setAnnouncementLoading(false); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    try {
        const { data: createdEvent } = await api.post('/events', { ...newEvent, classId: selectedClass._id });
        setEvents(prev => [...prev, createdEvent]);
        setIsEventModalOpen(false);
        setNewEvent({ title: '', date: '', type: 'test' });
        Swal.fire('Əla!', 'Hadisə təqvimə əlavə olundu.', 'success');
    } catch (error) { Swal.fire('Xəta!', 'Hadisəni əlavə etmək mümkün olmadı.', 'error'); } 
    finally { setEventLoading(false); }
  };

  return (
    <>
      <Sheet open={isDayDetailOpen} onOpenChange={setIsDayDetailOpen}>
        <SheetContent className="w-full sm:max-w-3xl flex flex-col p-0">
            <SheetHeader className="p-6">
                <SheetTitle>{selectedDate ? `${selectedDate.toLocaleDateString('az-AZ')} - Detallar` : 'Detallar'}</SheetTitle>
                <SheetDescription>
                    {panelType === 'test' ? "Bu gün üçün təyin edilmiş sınağın nəticələrini daxil edin." : "Bu dərs günü üçün davamiyyət və qiymətləri qeyd edin."}
                </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-grow px-6">
                {selectedDate && (
                    panelType === 'test' ? (
                        <TestResultPage classId={selectedClass._id} students={students} selectedDate={selectedDate} showToast={showToast} onClose={() => setIsDayDetailOpen(false)} />
                    ) : (
                        <DayDetailPage classId={selectedClass._id} students={students} selectedDate={selectedDate} showToast={showToast} onClose={() => setIsDayDetailOpen(false)} />
                    )
                )}
            </ScrollArea>
        </SheetContent>
      </Sheet>

      <StudentDetailModal student={viewingStudent} isOpen={!!viewingStudent} onClose={() => setViewingStudent(null)} />
      
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Təqvimə Yeni Hadisə Əlavə Et</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4 pt-4">
                <div className="space-y-2"><Label htmlFor="event-title">Hadisənin adı</Label><Input id="event-title" type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="event-date">Tarix</Label><Input id="event-date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required /></div><div className="space-y-2"><Label htmlFor="event-type">Növü</Label><Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}><SelectTrigger id="event-type"><SelectValue placeholder="Növ seçin..." /></SelectTrigger><SelectContent><SelectItem value="test">Sınaq</SelectItem><SelectItem value="meeting">İclas</SelectItem><SelectItem value="holiday">Bayram</SelectItem><SelectItem value="other">Digər</SelectItem></SelectContent></Select></div></div>
                <DialogFooter><Button type="submit" disabled={eventLoading}>{eventLoading ? ICONS.spinnerSmall : "Əlavə Et"}</Button></DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Button variant="outline" size="icon" onClick={onBack}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></Button><h1 className="text-3xl font-bold tracking-tight">{selectedClass.className}</h1></div>
            <div className="flex items-center gap-2">{selectedClass.days.map((d) => (<span key={d} className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">{d}</span>))}<span className="px-3 py-1 text-xs rounded-full bg-muted">{selectedClass.time}</span></div>
        </div>
        <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Təqvim</CardTitle><Button variant="outline" onClick={() => setIsEventModalOpen(true)}>+ Hadisə Əlavə Et</Button></CardHeader><CardContent><ClassCalendar scheduledDays={selectedClass.days} classTime={selectedClass.time} onDateSelect={handleDateSelect} events={events} /></CardContent></Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="flex flex-col"><CardHeader><CardTitle>Elanlar</CardTitle></CardHeader><CardContent className="flex-grow space-y-4"><form onSubmit={handlePostAnnouncement} className="space-y-2"><Textarea value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} placeholder="Sinif üçün yeni elan..." /><div className="flex justify-end"><Button type="submit" disabled={announcementLoading}>{announcementLoading ? ICONS.spinnerSmall : "Göndər"}</Button></div></form><Separator/><div className="space-y-3">{loading.announcements ? <p>Yüklənir...</p> : announcements.length === 0 ? <p className="text-muted-foreground text-sm text-center py-4">Hələ elan yoxdur.</p> : announcements.map(ann => ( <div key={ann._id} className="p-3 bg-muted/50 rounded-lg"><p className="text-sm whitespace-pre-wrap">{ann.text}</p><p className="text-xs text-muted-foreground mt-2">{formatDate(ann.createdAt)}</p></div> ))}</div></CardContent></Card>
            <Card className="flex flex-col"><CardHeader><CardTitle>Şagirdlər</CardTitle></CardHeader><CardContent className="flex-grow"><form onSubmit={handleAddStudent} className="flex gap-2 mb-4"><Input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="Yeni şagirdin adı..."/><Button type="submit" disabled={studentLoading}>{studentLoading ? ICONS.spinnerSmall : "Əlavə et"}</Button></form><Separator/>{loading.students ? <p>Yüklənir...</p> : ( <Table><TableHeader><TableRow><TableHead>Ad, Soyad</TableHead><TableHead className="text-right">Əməliyyatlar</TableHead></TableRow></TableHeader><TableBody>{students.length === 0 ? <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground h-24">Bu sinifdə şagird yoxdur.</TableCell></TableRow> : students.map(student => ( <TableRow key={student._id}><TableCell className="font-medium">{editingStudentId === student._id ? ( <Input type="text" value={editingStudentName} onChange={(e) => setEditingStudentName(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateStudentName(); if (e.key === 'Escape') cancelEdit(); }} /> ) : ( <button onClick={() => setViewingStudent(student)} className="hover:underline">{student.name}</button> )}</TableCell><TableCell className="text-right">{editingStudentId === student._id ? ( <div className="flex justify-end gap-2"><Button size="icon" onClick={handleUpdateStudentName} title="Yadda Saxla">{ICONS.check}</Button><Button size="icon" variant="ghost" onClick={cancelEdit} title="Ləğv Et">{ICONS.close}</Button></div> ) : ( <div className="flex justify-end gap-2"><Button size="icon" variant="outline" onClick={() => startEdit(student)}>{ICONS.edit}</Button><Button size="icon" variant="destructive" onClick={() => handleDeleteStudent(student._id)}>{ICONS.trash}</Button></div> )}
                    </TableCell></TableRow> ))}
              </TableBody>
            </Table>
            )}</CardContent>
            </Card>
        </div>
      </div>
    </>
  );
};
export default ClassDetail;