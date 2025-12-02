'use client';

import { useState, useEffect } from 'react';

interface WeatherCardProps {
  isDark: boolean;
}

interface WeatherData {
  temp: number;
  weather: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

export default function WeatherCard({ isDark }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://restapi.amap.com/v3/weather/weatherInfo?city=210200&key=5e511e3e52aa2de8c2e99d61bc7cc89e'
        );
        const data = await response.json() as { 
          status?: string; 
          lives?: Array<{ 
            temperature: string; 
            weather: string; 
            humidity: string; 
            windpower: string; 
          }>; 
        };
        
        if (data.status === '1' && data.lives && data.lives[0]) {
          const live = data.lives[0];
          setWeather({
            temp: parseInt(live.temperature),
            weather: live.weather,
            humidity: parseInt(live.humidity),
            windSpeed: parseInt(live.windpower) || 0,
            city: '大连'
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // 30分钟
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (weather: string) => {
    if (weather.includes('晴')) return '☀';
    if (weather.includes('云')) return '☁';
    if (weather.includes('阴')) return '☁';
    if (weather.includes('雨')) return '🌧';
    if (weather.includes('雪')) return '❄';
    return '🌤';
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 flex flex-col h-full`}>
      <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        大连天气
      </div>
      
      {loading ? (
        <div className={`flex-1 flex items-center justify-center text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          加载中...
        </div>
      ) : weather ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-4xl mb-1">{getWeatherIcon(weather.weather)}</div>
          <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {weather.temp}°
          </div>
          <div className={`text-[11px] mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {weather.weather}
          </div>
          <div className={`grid grid-cols-2 gap-4 text-[10px] w-full ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-center">
              <div>湿度</div>
              <div className="font-medium">{weather.humidity}%</div>
            </div>
            <div className="text-center">
              <div>风力</div>
              <div className="font-medium">{weather.windSpeed}级</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          暂无数据
        </div>
      )}
    </div>
  );
}
