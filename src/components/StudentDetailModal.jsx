import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ICONS } from './Icon.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const StudentDetailModal = ({ student, isOpen, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!student?._id) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/students/${student._id}`);
                setDetails(data);
            } catch (error) {
                console.error("Şagird detallarını yükləmək mümkün olmadı", error);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            fetchDetails();
        }
    }, [student, isOpen]);

    if (!isOpen || !student) return null;
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{student.name} - Məlumatlar</DialogTitle>
                    <DialogDescription>Şagirdin valideyn və özü üçün olan dəvət kodları və ya bağlı hesablar.</DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div className="p-3 bg-muted rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground flex items-center mb-1">Valideyn Hesabı</label>
                            {details?.parentUid ? (
                                <p className="font-semibold text-foreground p-2">{details.parentUid.email}</p>
                            ) : (
                                <p className="font-mono tracking-widest text-primary p-2">{details?.parentInviteCode || "Yoxdur"}</p>
                            )}
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground flex items-center mb-1">Şagird Hesabı</label>
                            <p className="font-mono tracking-widest text-primary p-2">{details?.studentInviteCode || "Yoxdur"}</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
export default StudentDetailModal;