import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ClassCalendar = ({ scheduledDays = [], classTime = "", onDateSelect = () => {}, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthNames = ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"];
  const weekDayNames = ["B.e.","Ç.a.","Ç.","C.a.","C.","Ş.","B."];

  const dayNameToJsIndex = {
    'Bazar ertəsi': 1, 'Çərşənbə axşamı': 2, 'Çərşənbə': 3,
    'Cümə axşamı': 4, 'Cümə': 5, 'Şənbə': 6, 'Bazar': 0
  };
  const scheduledDayIndexes = useMemo(
    () => scheduledDays.map(d => dayNameToJsIndex[d]).filter(v => v !== undefined),
    [scheduledDays]
  );
  
  const eventsByDate = useMemo(() => {
    const map = new Map();
    if (events) {
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const eventDateKey = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate()).toDateString();
            if (!map.has(eventDateKey)) {
                map.set(eventDateKey, []);
            }
            map.get(eventDateKey).push(event);
        });
    }
    return map;
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const jsFirstDay = firstDay.getDay();
  const monStartOffset = (jsFirstDay + 6) % 7;

  const cells = useMemo(() => {
    const arr = [];
    const prevMonthDays = monStartOffset;
    const prevMonth = new Date(year, month, 0);
    const prevMonthTotal = prevMonth.getDate();
    for (let i = 0; i < 42; i++) {
      const cellDayNum = i - prevMonthDays + 1;
      let dateObj;
      let inCurrentMonth = true;
      if (cellDayNum < 1) {
        const d = prevMonthTotal + cellDayNum;
        dateObj = new Date(year, month - 1, d); inCurrentMonth = false;
      } else if (cellDayNum > daysInMonth) {
        const d = cellDayNum - daysInMonth;
        dateObj = new Date(year, month + 1, d); inCurrentMonth = false;
      } else {
        dateObj = new Date(year, month, cellDayNum); inCurrentMonth = true;
      }
      arr.push({ date: dateObj, inCurrentMonth });
    }
    return arr;
  }, [year, month, daysInMonth, monStartOffset]);

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const isToday = (d) => isSameDay(d, today);
  const isLessonDay = (d) => scheduledDayIndexes.includes(d.getDay());

  const goPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const DayCell = ({ item }) => {
    const { date, inCurrentMonth } = item;
    const lesson = isLessonDay(date) && inCurrentMonth;
    const _isToday = isToday(date);
    const dayEvents = eventsByDate.get(date.toDateString()) || [];
    const isClickable = (lesson || dayEvents.length > 0) && inCurrentMonth;

    return (
      <div 
        onClick={isClickable ? () => onDateSelect(date) : undefined}
        className={cn(
          "relative h-28 flex flex-col p-2 rounded-lg border transition-all duration-200",
          !inCurrentMonth && "bg-muted/40 text-muted-foreground pointer-events-none",
          isClickable && "cursor-pointer hover:border-primary hover:shadow-md",
          !isClickable && inCurrentMonth && "bg-background",
          lesson && "bg-primary/5",
          _isToday && "border-2 border-primary"
        )}
      >
        <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm",
            _isToday && "bg-primary text-primary-foreground",
            !_isToday && lesson && "text-primary font-bold",
            !_isToday && !lesson && "text-foreground"
        )}>
            {date.getDate()}
        </div>
        
        <div className="flex-grow flex flex-col justify-end mt-1 space-y-1 overflow-hidden">
          {dayEvents.map(evt => (
            <div key={evt._id} className="w-full text-center text-[10px] font-bold bg-secondary text-secondary-foreground py-1 rounded-md shadow-sm truncate" title={evt.title}>
              {evt.title}
            </div>
          ))}
          {lesson && (
            <div className="w-full text-center text-[11px] font-bold bg-primary/90 text-primary-foreground py-1 rounded-md shadow-sm">
              {classTime}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{monthNames[month]} {year}</h2>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goPrevMonth} aria-label="Öncəki ay"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.14182C9.04327 3.34327 9.04327 3.65673 8.84182 3.85818L5.20001 7.5L8.84182 11.1418C9.04327 11.3433 9.04327 11.6567 8.84182 11.8582C8.64036 12.0596 8.3269 12.0596 8.12545 11.8582L4.12545 7.85818C3.924 7.65673 3.924 7.34327 4.12545 7.14182L8.12545 3.14182C8.3269 2.94036 8.64036 2.94036 8.84182 3.14182Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
                <Button variant="outline" onClick={goToday} className="hidden sm:inline-flex">Bugün</Button>
                <Button variant="outline" size="icon" onClick={goNextMonth} aria-label="Sonrakı ay"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.15818 3.14182C6.35964 2.94036 6.6731 2.94036 6.87455 3.14182L10.8746 7.14182C11.076 7.34327 11.076 7.65673 10.8746 7.85818L6.87455 11.8582C6.6731 12.0596 6.35964 12.0596 6.15818 11.8582C5.95673 11.6567 5.95673 11.3433 6.15818 11.1418L9.79999 7.5L6.15818 3.85818C5.95673 3.65673 5.95673 3.34327 6.15818 3.14182Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
            </div>
        </div>
        <div className="grid grid-cols-7">
            {weekDayNames.map((d) => ( <div key={d} className="text-center py-2 text-xs font-semibold text-muted-foreground">{d}</div> ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
            {cells.map((item, idx) => ( <DayCell key={idx} item={item} /> ))}
        </div>
    </div>
  );
};

export default ClassCalendar;