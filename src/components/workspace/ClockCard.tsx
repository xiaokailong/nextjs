'use client';

import { useState, useEffect } from 'react';

interface ClockCardProps {
  isDark: boolean;
}

interface Weather {
  temp: number;
  weather: string;
  icon: string;
  humidity?: number;
}

interface LunarInfo {
  lunar: string;
  suitable: string[];
  avoid: string[];
}

export default function ClockCard({ isDark }: ClockCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<Weather | null>(null);
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 大连市天气 - 和风天气API (城市代码: 101070201)
        const DALIAN_CITY_CODE = '101070201';
        const API_KEY = '0b8f97c34c104513a13b41b06dc9be58';
        const url = `https://devapi.qweather.com/v7/weather/now?location=${DALIAN_CITY_CODE}&key=${API_KEY}`;
        
        console.log('Fetching Dalian weather from:', url);
        const response = await fetch(url, { cache: 'no-store' });
        
        if (!response.ok) {
          console.error('Weather API HTTP error:', response.status);
          setWeather({ temp: 5, weather: '大连天气', icon: '☁️', humidity: 60 });
          return;
        }
        
        const data = await response.json() as { 
          code?: string;
          now?: { temp: string; text: string; humidity: string; };
        };
        
        console.log('Weather API response:', data);
        
        if (data.code === '200' && data.now) {
          const { temp, text, humidity } = data.now;
          const weatherIcon = text.includes('晴') ? '☀️' : 
                             text.includes('云') ? '☁️' :
                             text.includes('雨') ? '🌧️' :
                             text.includes('雪') ? '❄️' : '🌤️';
          setWeather({
            temp: parseInt(temp),
            weather: `${text} · 大连`,
            icon: weatherIcon,
            humidity: parseInt(humidity)
          });
        } else {
          console.error('Weather API code error:', data.code);
          setWeather({ temp: 5, weather: '大连天气', icon: '☁️', humidity: 60 });
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather({ temp: 5, weather: '大连天气', icon: '☁️', humidity: 60 });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getLunarInfo = () => {
      const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
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
      
      setLunarInfo({
        lunar: `${lunarMonths[month]}${day > 15 ? '廿' : '初'}${day > 20 ? (day - 20) : day > 15 ? (day - 10) : day}`,
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
  const time = currentTime.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][currentTime.getDay()];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-3 h-full flex flex-col justify-between`}>
      {/* 时间显示 */}
      <div className="flex flex-col items-center">
        <div className={`text-4xl font-bold tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {time}
        </div>
        <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {year}年{month}月{day}日 星期{weekDay}
        </div>
        {lunarInfo && (
          <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            农历 {lunarInfo.lunar}
          </div>
        )}
      </div>

      {/* 天气信息 */}
      <div className="flex flex-col items-center">
        {weather ? (
          <>
            <div className="text-3xl mb-1">{weather.icon}</div>
            <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {weather.temp}°C
            </div>
            <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {weather.weather} {weather.humidity && `· 湿度${weather.humidity}%`}
            </div>
          </>
        ) : (
          <div className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>天气加载中...</div>
        )}
      </div>

      {/* 黄历信息 */}
      {lunarInfo && (
        <div className={`text-center space-y-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="text-[10px] leading-relaxed">
            <span className="text-green-500">宜</span> {lunarInfo.suitable.join(' · ')}
          </div>
          <div className="text-[10px] leading-relaxed">
            <span className="text-red-500">忌</span> {lunarInfo.avoid.join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}
