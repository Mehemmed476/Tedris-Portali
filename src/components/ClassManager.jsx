// src/components/ClassManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ICONS } from './Icon.jsx';
import Swal from 'sweetalert2';
import TimePicker from './TimePicker';

// shadcn/ui komponentləri
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const ClassManager = ({ user, onSelectClass, showToast }) => {
  const [newClassName, setNewClassName] = useState('');
  const [newClassDays, setNewClassDays] = useState([]);
  const [newClassTime, setNewClassTime] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classLoading, setClassLoading] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState(null);
  
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const weekDays = ["Bazar ertəsi","Çərşənbə axşamı","Çərşənbə","Cümə axşamı","Cümə","Şənbə","Bazar"];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/classes');
        setClasses(data);
      } catch (err) {
        setError("Sinifləri gətirmək mümkün olmadı.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleDayChange = (day) => {
    setNewClassDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (newClassName.trim() === "" || newClassDays.length === 0 || newClassTime === "") {
      showToast("Zəhmət olmasa, bütün məlumatları daxil edin.", "error");
      return;
    }
    setClassLoading(true);
    try {
      const newClassData = { className: newClassName.trim(), days: newClassDays, time: newClassTime };
      const { data: newClass } = await api.post('/classes', newClassData);
      setClasses(prevClasses => [newClass, ...prevClasses]);
      setNewClassName('');
      setNewClassDays([]);
      setNewClassTime('');
      showToast("Sinif uğurla yaradıldı!");
    } catch (err) {
      showToast("Sinif yaratmaq mümkün olmadı.", "error");
    } finally {
      setClassLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    Swal.fire({
        title: 'Əminsiniz?', text: "Bu sinifi silmək bütün şagirdləri və elanları da siləcək! Bu əməliyyat geri qaytarıla bilməz!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Bəli, sil!', cancelButtonText: 'Ləğv et'
    }).then(async (result) => {
        if (result.isConfirmed) {
            setDeletingClassId(classId);
            try {
                await api.delete(`/classes/${classId}`);
                setClasses(prev => prev.filter(c => c._id !== classId));
                Swal.fire('Silindi!', 'Sinif və ona aid bütün məlumatlar silindi.', 'success');
            } catch (err) {
                Swal.fire('Xəta!', 'Sinifi silmək mümkün olmadı.', 'error');
            } finally {
                setDeletingClassId(null);
            }
        }
    });
  };
  
  const handleTimeSelect = (time) => {
    setNewClassTime(time);
  };

  const DayChip = ({ label, active, onClick }) => ( <button type="button" onClick={onClick} className={ "px-3 py-1.5 rounded-full text-sm transition-all border " + (active ? "bg-primary text-primary-foreground" : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200") } aria-pressed={active} > {label} </button> );

  return (
    <>
      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Saat Seçin</DialogTitle>
            </DialogHeader>
            <TimePicker onSelectTime={handleTimeSelect} onClose={() => setIsTimePickerOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <Card>
          <form onSubmit={handleCreateClass}>
            <CardHeader>
              <CardTitle className="text-2xl">Yeni Sinif Yarat</CardTitle>
              <CardDescription>Yeni bir sinif yaratmaq üçün aşağıdakı xanaları doldurun.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Sinifin adı</Label>
                  <Input id="className" type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="Məs: Riyaziyyat-9" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classTime">Dərs saatı</Label>
                  <Input 
                    id="classTime"
                    type="text"
                    value={newClassTime}
                    placeholder="Saat seçin..."
                    readOnly
                    onClick={() => setIsTimePickerOpen(true)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                 <Label>Dərs günləri</Label>
                 <div className="flex flex-wrap gap-2 pt-2">
                   {weekDays.map((d) => ( <DayChip key={d} label={d} active={newClassDays.includes(d)} onClick={() => handleDayChange(d)} /> ))}
                 </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={classLoading}>
                {classLoading ? ICONS.spinnerSmall : <span className="inline-flex items-center gap-2">{ICONS.plus} Sinif Yarat</span>}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold tracking-tight">Siniflərim</h3>
          {error && <p className="text-destructive">{error}</p>}
          {loading ? ( <p>Yüklənir...</p> ) : classes.length === 0 ? (
            <Card className="text-center p-8 text-muted-foreground border-2 border-dashed">
              Heç bir sinif yaradılmayıb.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card key={cls._id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{cls.className}</CardTitle>
                    <CardDescription>{cls.days.join(', ')} — {cls.time}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">ID: {cls._id}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                      <Button onClick={() => onSelectClass(cls)}>Daxil ol</Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(cls._id)} disabled={deletingClassId === cls._id}>
                          {deletingClassId === cls._id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" /> : ICONS.trash}
                      </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassManager;