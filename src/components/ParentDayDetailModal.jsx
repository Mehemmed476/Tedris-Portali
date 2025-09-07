import React from 'react';
import Modal from './Modal';
import { translateAttendance } from '../utils/translation'; // YENİ İMPORT

const InfoRow = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-gray-600">{label}:</span>
            <span className="font-bold text-gray-800">{value}</span>
        </div>
    );
};

const ParentDayDetailModal = ({ isOpen, onClose, dayData }) => {
    if (!isOpen || !dayData) return null;

    const { record, events, date } = dayData;
    const dateString = new Date(date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={dateString}>
            <div className="space-y-4">
                {events && events.length > 0 && (
                    <div className="bg-sky-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sky-800">Günün Hadisələri</h4>
                        <ul className="list-disc list-inside mt-1 text-sky-700">
                            {events.map(evt => <li key={evt._id}>{evt.title}</li>)}
                        </ul>
                    </div>
                )}

                {record ? (
                    <>
                        {record.dailyHomeworkText && (
                            <div className="bg-zinc-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-zinc-800">Ümumi Ev Tapşırığı</h4>
                                <p className="mt-1 whitespace-pre-wrap text-zinc-600">{record.dailyHomeworkText}</p>
                            </div>
                        )}
                        <div className="bg-emerald-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-emerald-800">Övladınızın Nəticələri</h4>
                            <div className="mt-2">
                                {/* --- DƏYİŞİKLİK BURADADIR --- */}
                                <InfoRow label="Davamiyyət" value={translateAttendance(record.attendance)} />
                                <InfoRow label="Ev Tapşırığı (Bal)" value={record.grades?.homework} />
                                <InfoRow label="Fəallıq (Bal)" value={record.grades?.activity} />
                                <InfoRow label="Nizam-intizam (Bal)" value={record.grades?.discipline} />
                                <InfoRow label="Sınaq Nəticəsi (Bal)" value={record.testResults} />
                            </div>
                        </div>
                    </>
                ) : (
                    (!events || events.length === 0) && 
                    <p className="text-center text-gray-500 p-4">Bu gün üçün heç bir qeyd tapılmadı.</p>
                )}
            </div>
        </Modal>
    );
};

export default ParentDayDetailModal;