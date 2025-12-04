'use client';

import { useState } from 'react';
import ClockCard from '@/components/workspace/ClockCard';
import TodoCard from '@/components/workspace/TodoCard';
import MusicCard from '@/components/workspace/MusicCard';
import NotesCard from '@/components/workspace/NotesCard';
import QuickLinksCard from '@/components/workspace/QuickLinksCard';
import TimerCard from '@/components/workspace/TimerCard';
import CalendarCard from '@/components/workspace/CalendarCard';
import DailyQuoteCard from '@/components/workspace/DailyQuoteCard';
import SearchCard from '@/components/workspace/SearchCard';

export default function WorkspacePage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div 
      className={`h-screen w-screen overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-200`}
    >
      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed bottom-2 right-2 z-50 w-6 h-6 rounded text-xs ${
          isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700 shadow'
        }`}
      >
        {isDark ? '☀' : '☾'}
      </button>

      {/* 1:2:1 列布局 - 紧凑无间距 */}
      <div className="h-full w-full grid grid-rows-3 gap-[1px]" style={{ gridTemplateColumns: '1fr 2fr 1fr', backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
        <ClockCard isDark={isDark} />
        <TodoCard isDark={isDark} />
        <TimerCard isDark={isDark} />
        <QuickLinksCard isDark={isDark} />
        <SearchCard isDark={isDark} />
        <DailyQuoteCard isDark={isDark} />
        <CalendarCard isDark={isDark} />
        <NotesCard isDark={isDark} />
        <MusicCard isDark={isDark} />
      </div>
    </div>
  );
}
