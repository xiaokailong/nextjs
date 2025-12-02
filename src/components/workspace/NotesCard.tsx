'use client';

import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  sentence: string;
  createdAt: string;
}

interface NotesCardProps {
  isDark: boolean;
}

function NoteItem({ note, index, isDark, onUpdate, onDelete }: {
  note: Note;
  index: number;
  isDark: boolean;
  onUpdate: (id: number, sentence: string) => void;
  onDelete: (id: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.sentence);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(note.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(note.sentence);
    setIsEditing(false);
  };

  return (
    <div className={`group flex items-start gap-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
      <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {index + 1}.
      </span>
      
      {isEditing ? (
        <div className="flex-1 flex gap-1">
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className={`flex-1 px-1.5 py-0.5 text-[11px] rounded border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300'}`}
          />
          <button onClick={handleSave} className="text-green-500 text-xs px-1">✓</button>
          <button onClick={handleCancel} className="text-red-500 text-xs px-1">×</button>
        </div>
      ) : (
        <>
          <p className={`text-[11px] flex-1 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {note.sentence}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 text-blue-500 text-xs px-1"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="opacity-0 group-hover:opacity-100 text-red-500 text-xs px-1"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}

export default function NotesCard({ isDark }: NotesCardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newSentence, setNewSentence] = useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('workspace-notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('workspace-notes', JSON.stringify(notes));
    // 滚动到底部
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [notes]);

  const addNote = () => {
    if (newSentence.trim()) {
      setNotes([...notes, { id: Date.now(), sentence: newSentence, createdAt: new Date().toISOString() }]);
      setNewSentence('');
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          例句
        </span>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto space-y-1 mb-2">
        {notes.length === 0 ? (
          <p className={`text-[10px] text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            暂无例句
          </p>
        ) : (
          notes.map((note, index) => (
            <NoteItem
              key={note.id}
              note={note}
              index={index}
              isDark={isDark}
              onUpdate={(id, newSentence) => {
                setNotes(notes.map(n => n.id === id ? { ...n, sentence: newSentence } : n));
              }}
              onDelete={(id) => setNotes(notes.filter(n => n.id !== id))}
            />
          ))
        )}
      </div>

      {/* 固定在底部的添加表单 */}
      <div className={`border-t pt-2 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex gap-1">
          <input
            placeholder="输入例句..."
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
            className={`flex-1 px-2 py-1 text-[11px] rounded border ${
              isDark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'
            }`}
          />
          <button 
            onClick={addNote} 
            className="px-3 py-1 text-[11px] bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  );
}
