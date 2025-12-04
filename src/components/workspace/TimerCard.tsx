'use client';

import { useState, useEffect, useRef } from 'react';

interface TimerCardProps {
  isDark: boolean;
}

export default function TimerCard({ isDark }: TimerCardProps) {
  const [minutes, setMinutes] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    if (audioRef.current) audioRef.current.play();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('倒计时结束！');
    }
  };

  const startTimer = () => {
    const total = minutes * 60;
    if (total > 0) {
      setTimeLeft(total);
      setIsRunning(true);
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 flex flex-col h-full`}>
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt55" />
      
      <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        番茄时钟
      </div>

      {/* 显示区域 */}
      {isRunning || timeLeft > 0 ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* 圆形表盘 */}
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* 背景圆 */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  strokeWidth="8"
                />
                {/* 进度圆 */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (timeLeft / (minutes * 60))}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              {/* 中心时间显示 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 px-2 py-1 text-[11px] rounded text-white ${
                isRunning ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            >
              {isRunning ? '暂停' : '继续'}
            </button>
            <button
              onClick={() => { setIsRunning(false); setTimeLeft(0); }}
              className="flex-1 px-2 py-1 text-[11px] bg-red-500 text-white rounded"
            >
              停止
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1"></div>
      )}

      {/* 固定在底部的输入区域 */}
      <div className={`border-t pt-2 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setMinutes(Math.max(5, minutes - 5))}
            className={`px-2 py-1 text-[11px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            ▼
          </button>
          <input
            type="number"
            min="5"
            max="300"
            step="5"
            placeholder="分钟"
            value={minutes || ''}
            onChange={(e) => setMinutes(Math.max(5, Math.min(300, parseInt(e.target.value) || 45)))}
            className={`flex-1 px-2 py-1 text-[11px] text-center rounded border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'}`}
          />
          <button
            onClick={() => setMinutes(Math.min(300, minutes + 5))}
            className={`px-2 py-1 text-[11px] rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            ▲
          </button>
          <button
            onClick={startTimer}
            className="px-3 py-1 text-[11px] bg-green-500 text-white rounded hover:bg-green-600"
          >
            开始
          </button>
        </div>
      </div>
    </div>
  );
}
