import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ICONS } from './Icon.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const TestResultPage = ({ classId, students, selectedDate, showToast, onClose }) => {
  const [results, setResults] = useState({});
  const [existingRecord, setExistingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dateId = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null;
  
  useEffect(() => {
    const fetchRecord = async () => {
      if (!dateId || !classId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/records/class/${classId}/date/${dateId}`);
        if (data) {
          setResults(data.testResults || {});
          setExistingRecord(data);
        }
      } catch (err) {
        showToast("Məlumatları yükləmək mümkün olmadı", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [dateId, classId, showToast]);
  
  const handleResultChange = (studentId, value) => {
    const score = value === '' ? null : Math.min(100, Math.max(0, Number(value)));
    setResults(prev => ({ ...prev, [studentId]: score }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...existingRecord,
        classId,
        date: dateId,
        testResults: results,
      };
      await api.post('/records', payload);
      showToast('Sınaq nəticələri yadda saxlandı!');
      onClose();
    } catch (err) {
      showToast('Nəticələri yadda saxlamaq mümkün olmadı.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-1 flex flex-col h-full">
      {loading ? (
        <div className="flex-grow flex items-center justify-center">{ICONS.spinner}</div>
      ) : (
        <div className="flex-grow space-y-4 overflow-y-auto py-4">
          {students.map(student => (
            <div key={student._id} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={student._id} className="col-span-2">{student.name}</Label>
              <Input
                id={student._id} type="number" min="0" max="100"
                value={results[student._id] ?? ''}
                onChange={(e) => handleResultChange(student._id, e.target.value)}
                placeholder="Bal"
              />
            </div>
          ))}
        </div>
      )}
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? ICONS.spinnerSmall : 'Nəticələri Yadda Saxla'}
        </Button>
      </div>
    </div>
  );
};
export default TestResultPage;