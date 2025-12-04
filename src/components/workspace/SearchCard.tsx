'use client';

import { useState } from 'react';

interface SearchCardProps {
  isDark: boolean;
}

export default function SearchCard({ isDark }: SearchCardProps) {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<'baidu' | 'google'>('google');

  const handleSearch = () => {
    if (!query.trim()) return;

    const encodedQuery = encodeURIComponent(query);
    const urls = {
      baidu: `https://www.baidu.com/s?wd=${encodedQuery}`,
      google: `https://www.google.com/search?q=${encodedQuery}`
    };

    window.open(urls[engine], '_blank');
    setQuery(''); // 清空搜索框
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-3 flex flex-col h-full justify-center`}>
      <div className={`text-xs font-medium mb-3 text-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        快捷搜索
      </div>

      {/* 搜索引擎切换 */}
      <div className="flex gap-2 mb-3 justify-center">
        <button
          onClick={() => setEngine('google')}
          className={`px-3 py-1 text-[11px] rounded ${
            engine === 'google'
              ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Google
        </button>
        <button
          onClick={() => setEngine('baidu')}
          className={`px-3 py-1 text-[11px] rounded ${
            engine === 'baidu'
              ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          百度
        </button>
      </div>

      {/* 搜索输入框 */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="输入搜索内容..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-3 py-2 text-[12px] rounded border ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' 
              : 'bg-white border-gray-300 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 text-[12px] rounded ${
            isDark ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          搜索
        </button>
      </div>
    </div>
  );
}
