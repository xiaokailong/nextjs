'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoCardProps {
  isDark: boolean;
}

export default function TodoCard({ isDark }: TodoCardProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('workspace-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workspace-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, text: editText } : t));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const todayTodos = todos.filter(todo => {
    const today = new Date().toDateString();
    const todoDate = new Date(todo.createdAt).toDateString();
    return today === todoDate && !todo.completed;
  });

  const historyTodos = todos.filter(todo => {
    const today = new Date().toDateString();
    const todoDate = new Date(todo.createdAt).toDateString();
    return today !== todoDate || todo.completed;
  });

  const displayTodos = showHistory ? historyTodos : todayTodos;

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-2 flex flex-col h-full`}>
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          待办
        </span>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`text-[10px] px-2 py-0.5 rounded ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {showHistory ? '今日' : '历史'}
        </button>
      </div>

      {/* 待办列表 */}
      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {displayTodos.length === 0 ? (
          <p className={`text-[10px] text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {showHistory ? '暂无历史' : '暂无待办'}
          </p>
        ) : (
          displayTodos.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-center gap-1 p-1 rounded text-[11px] ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-3 h-3 flex-shrink-0"
              />
              {editingId === todo.id ? (
                <div className="flex-1 flex gap-1">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className={`flex-1 px-1 py-0.5 text-[11px] rounded border ${
                      isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300'
                    }`}
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-green-500">✓</button>
                  <button onClick={cancelEdit} className="text-red-500">×</button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? isDark ? 'line-through text-gray-500' : 'line-through text-gray-400'
                        : isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* 固定在底部的添加输入 */}
      <div className={`border-t pt-2 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="添加新待办..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            className={`flex-1 px-2 py-1 text-[11px] rounded border ${
              isDark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'
            }`}
          />
          <button
            onClick={addTodo}
            className="px-3 py-1 text-[11px] bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
