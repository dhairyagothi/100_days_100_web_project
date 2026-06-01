import { useRef, useState, useEffect } from 'react';
import { FaCircleCheck, FaRegCircle } from 'react-icons/fa6';
import { IoIosCloseCircle } from 'react-icons/io';
import { TbRepeatOff, TbRepeat } from 'react-icons/tb';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import './TodolistItem.css';

type TodoItem = {
  id: string;
  title: string;
  pinned: boolean;
  checked: boolean;
  recurring: boolean;
  tag: string;
};

const STORAGE_KEYS = {
  ITEMS: 'TodoListItems',
  TAGS: 'userTodoTags',
  DARK_MODE: 'DarkMode',
  LAST_UPDATE: 'todoLastUpdateDate',
} as const;

const DEFAULT_TAGS = ['personal', 'work'];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Todolist() {
  const inputRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<TodoItem[]>(() =>
    loadFromStorage<TodoItem[]>(STORAGE_KEYS.ITEMS, [])
  );
  const [tags, setTags] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.TAGS, DEFAULT_TAGS)
  );
  const [activeTag, setActiveTag] = useState<string>('personal');
  const [filter, setFilter] = useState<string>('all');

  // Save helpers
  const saveItems = (updated: TodoItem[]) => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
    setItems(updated);
  };

  const saveTags = (updated: string[]) => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(updated));
    setTags(updated);
  };

  // Daily reset for recurring tasks
  useEffect(() => {
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    const today = new Date().toLocaleDateString();
    if (lastUpdate !== today) {
      setItems((prev) => {
        const reset = prev.map((todo) =>
          todo.recurring && todo.checked ? { ...todo, checked: false } : todo
        );
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(reset));
        return reset;
      });
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, today);
    }
  }, []);

  const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const toggleField = (
    id: string,
    field: keyof Pick<TodoItem, 'checked' | 'pinned' | 'recurring'>
  ) => {
    const updated = items.map((todo) =>
      todo.id === id ? { ...todo, [field]: !todo[field] } : todo
    );
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    saveItems(items.filter((todo) => todo.id !== id));
  };

  const addItem = () => {
    const title = inputRef.current?.value.trim() ?? '';
    if (!title || !activeTag) return;
    const newItem: TodoItem = {
      id: 'tl' + Date.now(),
      title,
      pinned: false,
      checked: false,
      recurring: false,
      tag: activeTag,
    };
    saveItems([...items, newItem]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const addTag = () => {
    const tag = tagRef.current?.value.trim() ?? '';
    if (!tag || tags.includes(tag)) return;
    saveTags([...tags, tag]);
    if (tagRef.current) tagRef.current.value = '';
  };

  const resetTags = () => saveTags(DEFAULT_TAGS);

  const renderItem = (todo: TodoItem) => (
    <div
      key={todo.id}
      className={`p-2 bg-slate-300 dark:bg-slate-700 max-w-screen-sm w-full rounded-2xl hover:scale-105 max-md:scale-90 max-md:hover:scale-90 transition-all duration-300 ${todo.checked ? 'dark:bg-slate-900 bg-slate-200' : ''}`}
      onClick={() => toggleField(todo.id, 'checked')}
    >
      <div className="flex relative">
        <div
          className={`p-2 pr-14 bg-transparent break-words w-full font-medium ${todo.checked ? 'line-through decoration-2' : ''}`}
        >
          {sanitizeInput(todo.title)}
        </div>
      </div>
      <div className="flex gap-2 p-2 justify-between">
        <div className="flex gap-2 items-center">
          <span>Tags &rarr;</span>
          <label className="px-3 py-0.5 max-w-[110px] text-ellipsis overflow-hidden rounded-full bg-blue-600 dark:bg-red-500 text-slate-50">
            {todo.tag}
          </label>
        </div>
        <div className="TodoIcons flex gap-4 justify-center items-center">
          <div className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer">
            {todo.checked ? <FaCircleCheck /> : <FaRegCircle />}
          </div>
          <div
            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleField(todo.id, 'pinned');
            }}
          >
            {todo.pinned ? <BsPinAngleFill /> : <BsPinAngle />}
          </div>
          <div
            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleField(todo.id, 'recurring');
            }}
          >
            {todo.recurring ? <TbRepeat /> : <TbRepeatOff />}
          </div>
          <div
            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer todoremove"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(todo.id);
            }}
          >
            <IoIosCloseCircle />
          </div>
        </div>
      </div>
    </div>
  );

  const renderByTags = () => (
    <>
      {tags.map((tag) => {
        const tagItems = items.filter((todo) => todo.tag === tag);
        if (tagItems.length === 0) return null;
        return (
          <div key={tag} className="flex flex-col w-full items-center justify-center gap-6">
            <h1 className="text-2xl font-semibold">{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
            {tagItems.map(renderItem)}
          </div>
        );
      })}
    </>
  );

  const renderByStatus = (status: 'pinned' | 'checked' | 'recurring') => {
    const filtered = items.filter((todo) => todo[status]);
    if (filtered.length === 0) return null;
    const label = status === 'checked' ? 'Completed' : status === 'pinned' ? 'Pinned' : 'Dailies';
    return (
      <>
        <h1 className="text-2xl font-semibold">{label}</h1>
        {filtered.map(renderItem)}
      </>
    );
  };

  const renderList = () => {
    switch (filter) {
      case 'tags':
        return renderByTags();
      case 'checked':
        return renderByStatus('checked');
      case 'pinned':
        return renderByStatus('pinned');
      case 'recurring':
        return renderByStatus('recurring');
      default:
        return items.map(renderItem);
    }
  };

  return (
    <div className="Todolist flex flex-col w-full items-center justify-center mt-20 gap-6 pb-8">
      {/* Add Todo Input */}
      <div className="p-2 bg-slate-300 dark:bg-slate-700 max-w-screen-sm w-full rounded-2xl scale-125 origin-bottom hover:scale-[1.35] max-md:scale-90 max-md:hover:scale-90 transition-all duration-300">
        <div className="flex relative">
          <input
            type="text"
            className="p-2 pr-14 bg-transparent w-full outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
            placeholder="Add Item..."
            ref={inputRef}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button
            className="absolute flex items-center justify-center px-3 py-2 leading-4 dark:bg-red-500 bg-blue-600 text-slate-50 right-1.5 top-1 rounded-lg active:scale-75 transition-all duration-300"
            onClick={addItem}
          >
            +
          </button>
        </div>

        {/* Tag Selector */}
        <div className="flex gap-2 p-2 flex-wrap items-center">
          <span>Tags &rarr;</span>
          {tags.map((tag, key) => (
            <label
              key={tag}
              htmlFor={`todotag${key + 1}`}
              className="px-3 py-0.5 max-w-[110px] text-ellipsis overflow-hidden rounded-full cursor-pointer bg-slate-950/20 dark:bg-slate-950/30 has-[:checked]:bg-blue-600 has-[:checked]:dark:bg-red-500 has-[:checked]:text-slate-50"
            >
              {tag}
              <input
                hidden
                type="radio"
                name="todotag"
                id={`todotag${key + 1}`}
                value={tag}
                checked={activeTag === tag}
                onChange={(e) => setActiveTag(e.target.value)}
              />
            </label>
          ))}

          {/* Add Tag Input */}
          <div className="px-3 py-0.5 rounded-full flex gap-1 bg-slate-950/20 dark:bg-slate-950/30">
            <input
              type="text"
              className="bg-transparent text-xs w-full max-w-16 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
              placeholder="Add Tag..."
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              ref={tagRef}
            />
            <button onClick={addTag}>+</button>
          </div>

          {/* Reset Tags */}
          <button onClick={resetTags} title="Reset tags">
            <TbRepeat />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div>
        <label>
          Filter By{' '}
          <select
            className="bg-slate-300 dark:bg-slate-800 p-1 rounded-md ml-2 outline-none"
            onChange={(e) => setFilter(e.target.value)}
            defaultValue="all"
          >
            <option value="all">All</option>
            <option value="tags">Tags</option>
            <option value="checked">Completed</option>
            <option value="pinned">Pinned</option>
            <option value="recurring">Dailies</option>
          </select>
        </label>
      </div>

      {/* Todo List */}
      {renderList()}
    </div>
  );
}

export default Todolist;
