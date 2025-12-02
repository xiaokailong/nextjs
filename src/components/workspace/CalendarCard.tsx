'use client';

import { useState, useEffect } from 'react';

interface CalendarCardProps {
  isDark: boolean;
}

export default function CalendarCard({ isDark }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 2025年中国节假日数据
  const holidays = [
    { date: '2025-01-01', name: '元旦', days: 1 },
    { date: '2025-01-28', name: '春节', days: 8 },
    { date: '2025-04-04', name: '清明节', days: 3 },
    { date: '2025-05-01', name: '劳动节', days: 5 },
    { date: '2025-05-31', name: '端午节', days: 3 },
    { date: '2025-10-01', name: '国庆节', days: 8 },
    { date: '2025-10-06', name: '中秋节', days: 1 },
    { date: '2025-12-25', name: '圣诞节', days: 1 },
  ];

  const getNextHoliday = () => {
    const now = new Date();
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    
    // 只显示当前查看月份的节假日
    const monthHolidays = holidays.filter(h => {
      const hDate = new Date(h.date);
      return hDate.getMonth() === currentMonth && hDate.getFullYear() === currentYear;
    });

    if (monthHolidays.length === 0) return null;

    // 找到最近的节假日
    const upcoming = monthHolidays
      .map(h => ({
        ...h,
        dateObj: new Date(h.date),
        daysUntil: Math.ceil((new Date(h.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }))
      .filter(h => h.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)[0];

    return upcoming || monthHolidays[monthHolidays.length - 1];
  };

  const nextHoliday = getNextHoliday();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { 
      daysInMonth: lastDay.getDate(), 
      startDay: firstDay.getDay(),
      year,
      month: month + 1
    };
  };

  const { daysInMonth, startDay, year, month } = getDaysInMonth(viewDate);
  const today = currentDate.getDate();
  const isCurrentMonth = currentDate.getMonth() === viewDate.getMonth() && currentDate.getFullYear() === viewDate.getFullYear();

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 h-full flex flex-col`}>
      {/* 头部控制栏 */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-1">
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1))}
            className={`px-1 py-0.5 text-[10px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ‹‹
          </button>
          <button
            onClick={prevMonth}
            className={`px-1.5 py-0.5 text-[11px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ‹
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {year}年{month}月
          </span>
          <button
            onClick={goToToday}
            className={`px-1.5 py-0.5 text-[9px] rounded ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            今
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={nextMonth}
            className={`px-1.5 py-0.5 text-[11px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ›
          </button>
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1))}
            className={`px-1 py-0.5 text-[10px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ››
          </button>
        </div>
      </div>
      
      {/* 日历网格 */}
      <div className="flex-1 grid grid-cols-7 gap-[2px] text-center text-[10px] content-start">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className={`font-medium py-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {day}
          </div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today && isCurrentMonth;
          return (
            <div
              key={day}
              className={`flex items-center justify-center py-1 rounded-sm cursor-pointer ${
                isToday
                  ? isDark
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-blue-500 text-white font-bold'
                  : isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 节假日提示 */}
      {nextHoliday && (
        <div className={`text-[12px] mt-2 pt-2 border-t text-center flex item-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className="text-xl">🎉</span>
            <div className="text-left" style={{lineHeight: '28px'}}>
              <span className={`font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {nextHoliday.name}
              </span>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {nextHoliday.dateObj ? (
                  <>
                    {nextHoliday.dateObj.getMonth() + 1}月{nextHoliday.dateObj.getDate()}日
                    {nextHoliday.daysUntil !== undefined && nextHoliday.daysUntil > 0 && (
                      <span className={isDark ? 'text-orange-400' : 'text-orange-600'}> · 还有{nextHoliday.daysUntil}天</span>
                    )}
                    {nextHoliday.daysUntil === 0 && (
                      <span className={isDark ? 'text-green-400' : 'text-green-600'}> · 今天</span>
                    )}
                  </>
                ) : null}
              </span>
            </div>
        </div>
      )}
    </div>
  );
}
