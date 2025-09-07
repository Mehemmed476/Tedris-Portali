import React from 'react';
import { translateAttendance } from '../utils/translation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

const InfoRow = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-semibold text-foreground">{value}</span>
        </div>
    );
};

const DayDetailModal = ({ isOpen, onClose, dayData, userRole, classId }) => {
  if (!isOpen || !dayData) return null;

  const { record, events, date } = dayData;
  const dateString = new Date(date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{dateString}</DialogTitle>
                <DialogDescription>Bu gün üçün olan qeydlər.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
                {events && events.length > 0 && (
                    <Card className="bg-muted/50">
                        <CardHeader className="p-4"><CardTitle className="text-base">Günün Hadisələri</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                            <ul className="list-disc list-inside">
                                {events.map(evt => <li key={evt._id}>{evt.title}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {record ? (
                    <>
                        {record.dailyHomeworkText && (
                           <Card className="bg-muted/50">
                               <CardHeader className="p-4"><CardTitle className="text-base">Ev Tapşırığı</CardTitle></CardHeader>
                               <CardContent className="p-4 pt-0 text-sm whitespace-pre-wrap">{record.dailyHomeworkText}</CardContent>
                           </Card>
                        )}
                        {record.attachments && record.attachments.length > 0 && (
                            <Card className="bg-muted/50">
                               <CardHeader className="p-4"><CardTitle className="text-base">Əlavə Edilmiş Fayllar</CardTitle></CardHeader>
                               <CardContent className="p-4 pt-0 text-sm space-y-2">
                                   {record.attachments.map(att => (
                                       <a href={att.url} target="_blank" rel="noopener noreferrer" key={att.public_id} className="flex items-center gap-2 text-primary hover:underline">
                                           <span>{att.original_filename}</span>
                                       </a>
                                   ))}
                               </CardContent>
                           </Card>
                        )}
                        <Card className="bg-muted/50">
                           <CardHeader className="p-4"><CardTitle className="text-base">Sizin Nəticələriniz</CardTitle></CardHeader>
                           <CardContent className="p-4 pt-0">
                               <InfoRow label="Davamiyyət" value={translateAttendance(record.attendance)} />
                               <Separator className="my-1"/>
                               <InfoRow label="Ev Tapşırığı (Bal)" value={record.grades?.homework} />
                               <Separator className="my-1"/>
                               <InfoRow label="Fəallıq (Bal)" value={record.grades?.activity} />
                               <Separator className="my-1"/>
                               <InfoRow label="Nizam-intizam (Bal)" value={record.grades?.discipline} />
                               <Separator className="my-1"/>
                               <InfoRow label="Sınaq Nəticəsi (Bal)" value={record.testResults} />
                           </CardContent>
                        </Card>
                    </>
                ) : (
                    (!events || events.length === 0) && <p className="text-center text-muted-foreground p-4">Bu gün üçün heç bir qeyd tapılmadı.</p>
                )}
            </div>
        </DialogContent>
    </Dialog>
  );
};
export default DayDetailModal;