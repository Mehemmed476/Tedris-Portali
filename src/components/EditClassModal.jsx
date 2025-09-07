// src/components/EditClassModal.jsx
import React, { useState, useEffect } from 'react';
import { ICONS } from './Icon.jsx';

const EditClassModal = ({ isOpen, onClose, onSave, classData }) => {
  const [className, setClassName] = useState('');
  const [classDays, setClassDays] = useState([]);
  const [classTime, setClassTime] = useState('');
  const [loading, setLoading] = useState(false);

  const weekDays = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];

  // Modal açıldıqda və ya `classData` dəyişdikdə formanı doldurur
  useEffect(() => {
    if (classData) {
      setClassName(classData.className || '');
      setClassDays(classData.days || []);
      setClassTime(classData.time || '');
    }
  }, [classData]);

  const handleDayChange = (day) => {
    setClassDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        // Yalnız dəyişdirilə bilən sahələri göndəririk
        className: className.trim(),
        days: classDays,
        time: classTime
      });
      onClose(); // Uğurlu olduqda pəncərəni bağla
    } catch (error) {
      console.error("Yeniləmə zamanı xəta:", error);
      // `onSave` funksiyası xəta mesajını göstərəcək
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const DayChip = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all border ${active ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200"}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Bağla">
          {ICONS.close}
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Sinif Məlumatlarını Redaktə Et</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Sinifin adı</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Məs: Riyaziyyat-9"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Dərs günləri</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((d) => (
                <DayChip key={d} label={d} active={classDays.includes(d)} onClick={() => handleDayChange(d)} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Dərs saatı</label>
            <input
              type="time"
              value={classTime}
              onChange={(e) => setClassTime(e.target.value)}
              className="w-64 px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-700 font-semibold hover:bg-zinc-200"
            >
              Ləğv Et
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 shadow-sm"
            >
              {loading ? ICONS.spinnerSmall : "Yadda Saxla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassModal;