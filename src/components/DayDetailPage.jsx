import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/api';
import { ICONS } from './Icon.jsx';
import Swal from 'sweetalert2';

// shadcn/ui komponentləri
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const DayDetailPage = ({ classId, students, selectedDate, showToast, onClose }) => {
  const [recordData, setRecordData] = useState(null);
  const [homework, setHomework] = useState('');
  const [grades, setGrades] = useState({});
  const [attendance, setAttendance] = useState({});
  const [event, setEvent] = useState({ title: '', type: 'other' });
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const dateId = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const ayAdlari = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    return `${date.getDate()} ${ayAdlari[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchDailyRecord = async () => {
      if (!dateId || !classId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/records/class/${classId}/date/${dateId}`);
        if (data) {
          setRecordData(data); setHomework(data.homework || ''); setGrades(data.grades || {});
          setAttendance(data.attendance || {}); setEvent(data.event || { title: '', type: 'other' });
          setAttachments(data.attachments || []); setQuestions(data.questions || []);
        } else {
          setRecordData(null); const initAttendance = {}; students.forEach(s => { initAttendance[s._id] = 'present'; });
          setHomework(''); setGrades({}); setAttendance(initAttendance); setEvent({ title: '', type: 'other' });
          setAttachments([]); setQuestions([]);
        }
      } catch (err) { showToast("Günün məlumatlarını yükləmək mümkün olmadı", "error"); } 
      finally { setLoading(false); }
    };
    fetchDailyRecord();
  }, [dateId, classId, students, showToast]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile); formData.append('classId', classId); formData.append('date', dateId);
    try {
      const { data: newAttachment } = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAttachments(prev => [...prev, newAttachment]);
      document.getElementById('file-input').value = ""; setSelectedFile(null);
      showToast("Fayl uğurla yükləndi!", "success");
    } catch (error) { showToast("Fayl yüklənə bilmədi.", "error"); } 
    finally { setUploading(false); }
  };

  const handleHomeworkGradeChange = (studentId, field, value) => {
    const numValue = value === '' ? null : Number(value);
    setGrades(prev => {
      const studentGrades = { ...prev[studentId] }; const homeworkGrades = { ...studentGrades.homework, [field]: numValue };
      const { questions, correct } = homeworkGrades; let score = null;
      if (questions != null && correct != null && questions > 0 && correct <= questions) { score = Math.round((correct / questions) * 100); }
      homeworkGrades.score = score;
      return { ...prev, [studentId]: { ...studentGrades, homework: homeworkGrades } };
    });
  };

  const handleOtherGradeChange = (studentId, key, value) => {
    const numValue = value === '' ? null : Math.min(100, Math.max(0, Number(value)));
    setGrades(prev => ({ ...prev, [studentId]: { ...prev[studentId], [key]: numValue } }));
  };

  const handleAttendanceChange = (studentId, value) => {
    setAttendance(prev => ({ ...prev, [studentId]: value }));
  };

  const handleEventChange = (e) => setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { classId, date: dateId, homework, attendance, grades, event };
      await api.post('/records', payload);
      showToast('Məlumatlar uğurla yadda saxlandı!');
      onClose();
    } catch (err) { showToast('Məlumatları yadda saxlamaq mümkün olmadı.', 'error'); } 
    finally { setSaving(false); }
  };
  
  const handleOpenAnswerModal = (question) => {
    setCurrentQuestion(question);
    setAnswerText(question.answerText || '');
    setIsAnswerModalOpen(true);
  };
  
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: updatedRecord } = await api.post('/records/answer-question', { recordId: recordData._id, questionId: currentQuestion._id, answerText: answerText });
      setQuestions(updatedRecord.questions);
      setIsAnswerModalOpen(false);
      Swal.fire('Göndərildi', 'Cavabınız şagirdə göndərildi.', 'success');
    } catch (error) {
      Swal.fire('Xəta!', 'Cavabı göndərmək mümkün olmadı.', 'error');
    }
  };

  return (
    <>
      <Dialog open={isAnswerModalOpen} onOpenChange={setIsAnswerModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>"{currentQuestion?.studentId?.name}" adlı şagirdin sualı</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
                <div className="bg-muted p-3 rounded-lg">
                    <p className="font-bold">{currentQuestion?.questionTitle}</p>
                    <p className="text-sm mt-1">{currentQuestion?.questionDescription}</p>
                </div>
                <form onSubmit={handleAnswerSubmit}>
                    <Label className="mb-2 block">Cavabınız</Label>
                    <Textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows="4" placeholder="Cavabınızı bura yazın..."/>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Cavabı Göndər</Button>
                    </DialogFooter>
                </form>
            </div>
        </DialogContent>
      </Dialog>

      <div className="p-1 pr-2 space-y-6">
        {loading ? ( <div className="flex h-96 items-center justify-center">{ICONS.spinner}</div> ) : (
          <>
            <div className="space-y-2"><Label htmlFor="homework">Günün ev tapşırığı</Label><Textarea id="homework" value={homework} onChange={(e) => setHomework(e.target.value)} placeholder="Tapşırığı bura daxil edin..."/></div>
            <div className="space-y-2"><Label>Fayl Əlavə Et</Label><div className="flex items-center gap-3"><Input type="file" id="file-input" onChange={handleFileChange} /><Button onClick={handleUploadFile} disabled={!selectedFile || uploading}>{uploading ? ICONS.spinnerSmall : 'Yüklə'}</Button></div>{attachments.length > 0 && ( <div className="mt-4 space-y-2 text-sm">{attachments.map(att => ( <a href={att.url} target="_blank" rel="noopener noreferrer" key={att.public_id} className="flex items-center gap-2 text-primary hover:underline"><span>{att.original_filename}</span></a> ))}</div> )}</div>
            <div className="space-y-2"><Label>Günün Hadisəsi (Sınaq, Bayram v.s.)</Label><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-2"><Input type="text" name="title" value={event.title} onChange={handleEventChange} placeholder="Məs: Riyaziyyat üzrə yoxlama" /></div><div><Select value={event.type} onValueChange={(val) => setEvent({...event, type: val})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="other">Digər</SelectItem><SelectItem value="test">Sınaq</SelectItem><SelectItem value="holiday">Bayram</SelectItem><SelectItem value="meeting">İclas</SelectItem></SelectContent></Select></div></div></div>
            <Separator />
            <div className="space-y-2"><Label>Qiymətlər və Davamiyyət</Label><div className="rounded-md border mt-2"><Table><TableHeader><TableRow><TableHead>Şagird</TableHead><TableHead className="w-[140px]">Davamiyyət</TableHead><TableHead className="w-[220px]">Ev Tapşırığı</TableHead><TableHead className="w-[110px]">Fəallıq</TableHead><TableHead className="w-[110px]">Nizam-intizam</TableHead></TableRow></TableHeader><TableBody>{students.map((s) => ( <TableRow key={s._id}><TableCell className="font-medium">{s.name}</TableCell><TableCell><Select value={attendance[s._id] || 'present'} onValueChange={(val) => handleAttendanceChange(s._id, val)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="present">İştirak etdi</SelectItem><SelectItem value="absent">Qayıb</SelectItem><SelectItem value="late">Gecikdi</SelectItem></SelectContent></Select></TableCell><TableCell><div className="flex items-center gap-1"><Input type="number" min="0" placeholder="Sual" value={grades[s._id]?.homework?.questions ?? ''} onChange={(e) => handleHomeworkGradeChange(s._id, 'questions', e.target.value)} /><Input type="number" min="0" placeholder="Düz" value={grades[s._id]?.homework?.correct ?? ''} onChange={(e) => handleHomeworkGradeChange(s._id, 'correct', e.target.value)} /><div className="w-12 text-center p-1 font-bold text-lg text-primary">{grades[s._id]?.homework?.score ?? '-'}</div></div></TableCell><TableCell><Input type="number" min="0" max="100" value={grades[s._id]?.activity ?? ''} onChange={(e) => handleOtherGradeChange(s._id, 'activity', e.target.value)} /></TableCell><TableCell><Input type="number" min="0" max="100" value={grades[s._id]?.discipline ?? ''} onChange={(e) => handleOtherGradeChange(s._id, 'discipline', e.target.value)} /></TableCell></TableRow> ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {questions && questions.length > 0 && (
            <div className="space-y-2 pt-4"><Separator/><h3 className="text-lg font-semibold pt-4">Şagird Sualları</h3><div className="space-y-4">{questions.map(q => ( <Card key={q._id}><CardHeader className="p-4 flex flex-row justify-between items-center"><div className="space-y-1"><CardTitle className="text-base">{q.studentId ? q.studentId.name : "Silinmiş Şagird"}</CardTitle><CardDescription>{formatDate(q.askedAt)}</CardDescription></div>{!q.answerText && (<Button variant="outline" onClick={() => handleOpenAnswerModal(q)}>Cavab Yaz</Button>)}</CardHeader><CardContent className="p-4 pt-0"><p className="font-semibold">{q.questionTitle}</p><p className="text-muted-foreground mt-1">{q.questionDescription}</p>{q.answerText && (<div className="mt-4 pt-4 border-t"><p className="text-sm font-medium text-primary">Sizin cavabınız:</p><p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{q.answerText}</p></div> )}</CardContent></Card> ))}</div></div>
          )}
          <div className="pt-6 flex justify-end">
            <Button onClick={handleSave} disabled={saving || loading}>{saving ? ICONS.spinnerSmall : 'Yadda Saxla'}</Button>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default DayDetailPage;