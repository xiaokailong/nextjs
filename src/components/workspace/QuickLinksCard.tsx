'use client';

import { useState, useEffect } from 'react';

interface Link {
  id: number;
  name: string;
  url: string;
  icon?: string;
}

interface QuickLinksCardProps {
  isDark: boolean;
}

export default function QuickLinksCard({ isDark }: QuickLinksCardProps) {
  const [links, setLinks] = useState<Link[]>([
    { id: 1, name: 'Google', url: 'https://www.google.com', icon: 'G' },
    { id: 2, name: 'GitHub', url: 'https://github.com', icon: 'H' },
    { id: 3, name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'C' },
    { id: 4, name: 'MDN', url: 'https://developer.mozilla.org', icon: 'M' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLink, setEditLink] = useState({ name: '', url: '' });

  useEffect(() => {
    const saved = localStorage.getItem('workspace-links');
    if (saved) setLinks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('workspace-links', JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (newLink.name.trim() && newLink.url.trim()) {
      setLinks([...links, { id: Date.now(), ...newLink }]);
      setNewLink({ name: '', url: '', icon: '' });
      setIsAdding(false);
    }
  };

  const startEdit = (link: Link) => {
    setEditingId(link.id);
    setEditLink({ name: link.name, url: link.url });
  };

  const saveEdit = () => {
    if (editingId) {
      if (editLink.name.trim() && editLink.url.trim()) {
        setLinks(links.map(l => l.id === editingId ? { ...l, name: editLink.name, url: editLink.url } : l));
      } else {
        // 清空内容即为删除
        setLinks(links.filter(l => l.id !== editingId));
      }
      setEditingId(null);
      setEditLink({ name: '', url: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLink({ name: '', url: '' });
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          链接
        </span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2 py-0.5 text-[11px] bg-blue-500 text-white rounded"
          title={isAdding ? '取消' : '添加链接'}
        >
          {isAdding ? '×' : '添加'}
        </button>
      </div>

      {isAdding && (
        <div className={`p-2 rounded mb-2 space-y-1 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <input
            placeholder="名称"
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            className={`w-full px-2 py-1 text-[11px] rounded border ${
              isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
            }`}
          />
          <input
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className={`w-full px-2 py-1 text-[11px] rounded border ${
              isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
            }`}
          />
          <button onClick={addLink} className="w-full px-2 py-1 text-[11px] bg-green-500 text-white rounded">
            添加
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1">
        {links.map(link => (
          <div
            key={link.id}
            className={`group flex items-center gap-1 rounded p-1 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {editingId === link.id ? (
              <div className="flex-1 flex flex-col gap-1">
                <input
                  value={editLink.name}
                  onChange={(e) => setEditLink({ ...editLink, name: e.target.value })}
                  placeholder="名称"
                  className={`px-1.5 py-0.5 text-[11px] rounded border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300'}`}
                />
                <input
                  value={editLink.url}
                  onChange={(e) => setEditLink({ ...editLink, url: e.target.value })}
                  placeholder="URL"
                  className={`px-1.5 py-0.5 text-[11px] rounded border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300'}`}
                />
                <div className="flex gap-1">
                  <button onClick={saveEdit} className="text-green-500 text-xs px-1">✓</button>
                  <button onClick={cancelEdit} className="text-red-500 text-xs px-1">×</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => window.open(link.url, '_blank')}
                    className={`text-[12px] cursor-pointer ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline truncate`}
                  >
                    {link.url}
                    <span className={`text-[12px] truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`} style={{float: 'right'}}>
                        {link.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(link)}
                  className="text-blue-500 text-xs opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  ✎
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
