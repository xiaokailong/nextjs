'use client';

import { useState } from 'react';

interface TranslatorCardProps {
  isDark: boolean;
}

export default function TranslatorCard({ isDark }: TranslatorCardProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      // 使用免费翻译API
      const isEnglish = /^[a-zA-Z\s]+$/.test(input.trim());
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${isEnglish ? 'en|zh' : 'zh|en'}`;
      
      const response = await fetch(url);
      const data = await response.json() as { responseData?: { translatedText: string } };
      
      if (data.responseData && data.responseData.translatedText) {
        setResult(data.responseData.translatedText);
      } else {
        setResult('翻译失败，请重试');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setResult('翻译出错');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 h-full flex flex-col`}>
      <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        翻译
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          placeholder="输入中文或英文..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 px-2 py-1.5 text-[11px] rounded border resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'}`}
        />
        
        <button
          onClick={translate}
          disabled={isLoading || !input.trim()}
          className="px-3 py-1 text-[11px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '翻译中...' : '翻译'}
        </button>
        
        {result && (
          <div className={`flex-1 px-2 py-1.5 text-[11px] rounded border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
