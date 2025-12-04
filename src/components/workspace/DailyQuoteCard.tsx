'use client';

import { useState, useEffect } from 'react';

interface QuoteCardProps {
  isDark: boolean;
}

interface Quote {
  text: string;
  translation: string;
  author?: string;
}

export default function DailyQuoteCard({ isDark }: QuoteCardProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  // 英文励志美句库
  const quotes: Quote[] = [
    {
      text: "The only way to do great work is to love what you do.",
      translation: "成就伟大工作的唯一途径就是热爱你所做的事。",
      author: "Steve Jobs"
    },
    {
      text: "Believe you can and you're halfway there.",
      translation: "相信自己能做到，你就已经成功了一半。",
      author: "Theodore Roosevelt"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      translation: "成功不是终点，失败也并非末日，最重要的是继续前进的勇气。",
      author: "Winston Churchill"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      translation: "未来属于那些相信梦想之美的人。",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It does not matter how slowly you go as long as you do not stop.",
      translation: "前进缓慢没关系，只要你不停下脚步。",
      author: "Confucius"
    },
    {
      text: "Everything you've ever wanted is on the other side of fear.",
      translation: "你想要的一切，都在恐惧的另一边。",
      author: "George Addair"
    },
    {
      text: "Dream big and dare to fail.",
      translation: "梦想要大，要敢于失败。",
      author: "Norman Vaughan"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      translation: "种树最好的时间是20年前，其次是现在。",
      author: "Chinese Proverb"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      translation: "不要盯着时钟看，要像它一样，永不停歇。",
      author: "Sam Levenson"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      translation: "唯一不可能的旅程，是你从未开始的那一个。",
      author: "Tony Robbins"
    }
  ];

  useEffect(() => {
    // 初始化随机显示一句
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    }, 300);
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-3 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          每日一言
        </span>
        <button
          onClick={getRandomQuote}
          disabled={loading}
          className={`text-[11px] px-2 py-1 rounded ${
            isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? '...' : '换一句'}
        </button>
      </div>

      {quote && (
        <div className="flex-1 flex flex-col justify-center">
          {/* 英文原文 */}
          <div className={`text-[13px] leading-relaxed mb-3 italic ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            "{quote.text}"
          </div>
          
          {/* 中文翻译 */}
          <div className={`text-[11px] leading-relaxed mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {quote.translation}
          </div>

          {/* 作者 */}
          {quote.author && (
            <div className={`text-[10px] text-right ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              — {quote.author}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
