'use client';

import { useState, useEffect } from 'react';

interface ClockCardProps {
  isDark: boolean;
}

interface LunarInfo {
  lunar: string;
  suitable: string[];
  avoid: string[];
}

export default function ClockCard({ isDark }: ClockCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getLunarInfo = () => {
      const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
      const lunarDays = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      const month = currentTime.getMonth();
      const day = currentTime.getDate();
      
      const suitables = ['祭祀', '祈福', '出行', '嫁娶', '安葬', '动土', '开业', '交易', '纳采', '安床', '修造', '裁衣', '会亲友', '立券', '入学'];
      const avoids = ['词讼', '安门', '移徙', '入宅', '开市', '破土', '动土', '安床', '作灶', '纳畜', '枠伐', '出火', '婚娶', '造庙', '行丧'];
      
      const getSuitableItems = () => {
        const items = [];
        for (let i = 0; i < 5; i++) {
          items.push(suitables[(day + i) % suitables.length]);
        }
        return items;
      };
      
      const getAvoidItems = () => {
        const items = [];
        for (let i = 0; i < 5; i++) {
          items.push(avoids[(day + i + 3) % avoids.length]);
        }
        return items;
      };
      
      // 转换农历日期为大写
      const getLunarDay = (d: number) => {
        if (d <= 10) return `初${lunarDays[d]}`;
        if (d < 20) return `十${lunarDays[d - 10]}`;
        if (d === 20) return '二十';
        if (d < 30) return `廿${lunarDays[d - 20]}`;
        return '三十';
      };
      
      setLunarInfo({
        lunar: `${lunarMonths[month]}${getLunarDay(day)}`,
        suitable: getSuitableItems(),
        avoid: getAvoidItems()
      });
    };
    
    getLunarInfo();
  }, [currentTime]);

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

  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1;
  const day = currentTime.getDate();
  const time = currentTime.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][currentTime.getDay()];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 h-full flex flex-col justify-center`}>
      {/* 时间显示 */}
      <div className="flex flex-col items-center mb-6">
        <div className={`text-5xl font-bold tracking-wider mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {time}
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {year}年{month}月{day}日 星期{weekDay}
        </div>
        {lunarInfo && (
          <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            农历 {lunarInfo.lunar}
          </div>
        )}
      </div>

      {/* 黄历信息 */}
      {/* {lunarInfo && (
        <div className={`text-center space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="text-[11px] leading-relaxed">
            <span className="inline-block text-[10px] bg-green-500 text-white rounded px-2 py-0.5 mr-2">宜</span>
            <span>{lunarInfo.suitable.join(' · ')}</span>
          </div>
          <div className="text-[11px] leading-relaxed">
            <span className="inline-block text-[10px] bg-red-500 text-white rounded px-2 py-0.5 mr-2">忌</span>
            <span>{lunarInfo.avoid.join(' · ')}</span>
          </div>
        </div>
      )} */}
    </div>
  );
}
