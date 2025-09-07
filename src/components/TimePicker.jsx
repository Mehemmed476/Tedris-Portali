// src/components/TimePicker.jsx
import React from 'react';
import { Button } from "@/components/ui/button";

const TimePicker = ({ onSelectTime, onClose }) => {
    const times = [];
    // Saat 08:00-dan 22:00-a qədər 30 dəqiqə aralıqla vaxtlar yaradırıq
    for (let i = 8; i <= 22; i++) {
        times.push(`${String(i).padStart(2, '0')}:00`);
        if (i < 22) {
            times.push(`${String(i).padStart(2, '0')}:30`);
        }
    }

    const handleSelect = (time) => {
        onSelectTime(time);
        onClose();
    };

    return (
        <div className="grid grid-cols-4 gap-2">
            {times.map(time => (
                <Button 
                    key={time} 
                    variant="outline" 
                    onClick={() => handleSelect(time)}
                >
                    {time}
                </Button>
            ))}
        </div>
    );
};

export default TimePicker;