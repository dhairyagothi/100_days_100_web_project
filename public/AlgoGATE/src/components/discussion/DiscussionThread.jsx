// src/components/discussion/DiscussionThread.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Loader2, MessageSquare, Copy, Check } from 'lucide-react';
import { subscribeDiscussions, postComment, deleteComment } from '../../services/discussionService';
import { useAuth } from '../../context/AuthContext';
import hljs from 'highlight.js/lib/core';

// ── Register only the languages we care about (keeps bundle small) ─────────
import javascript from 'highlight.js/lib/languages/javascript';
import python     from 'highlight.js/lib/languages/python';
import cpp        from 'highlight.js/lib/languages/cpp';
import java       from 'highlight.js/lib/languages/java';
import kotlin     from 'highlight.js/lib/languages/kotlin';
import c          from 'highlight.js/lib/languages/c';
import rust       from 'highlight.js/lib/languages/rust';
import go         from 'highlight.js/lib/languages/go';
import typescript from 'highlight.js/lib/languages/typescript';
import bash       from 'highlight.js/lib/languages/bash';
import sql        from 'highlight.js/lib/languages/sql';
import xml        from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python',     python);
hljs.registerLanguage('cpp',        cpp);
hljs.registerLanguage('java',       java);
hljs.registerLanguage('kotlin',     kotlin);
hljs.registerLanguage('c',          c);
hljs.registerLanguage('rust',       rust);
hljs.registerLanguage('go',         go);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash',       bash);
hljs.registerLanguage('sql',        sql);
hljs.registerLanguage('xml',        xml);

// ── VSCode Dark+ theme injected as a <style> tag once ─────────────────────
const HLJS_THEME = `
.hljs { background: transparent; color: #d4d4d4; }
.hljs-keyword, .hljs-selector-tag, .hljs-literal     { color: #569cd6; font-weight: 600; }
.hljs-built_in, .hljs-type                           { color: #4ec9b0; }
.hljs-string, .hljs-attr                             { color: #ce9178; }
.hljs-number, .hljs-selector-id                      { color: #b5cea8; }
.hljs-comment                                        { color: #6a9955; font-style: italic; }
.hljs-function, .hljs-title, .hljs-title.function_   { color: #dcdcaa; }
.hljs-class .hljs-title, .hljs-title.class_          { color: #4ec9b0; }
.hljs-params                                         { color: #9cdcfe; }
.hljs-variable, .hljs-name                           { color: #9cdcfe; }
.hljs-operator, .hljs-punctuation                    { color: #d4d4d4; }
.hljs-meta                                           { color: #569cd6; }
.hljs-doctag                                         { color: #608b4e; }
.hljs-regexp                                         { color: #d16969; }
.hljs-symbol                                         { color: #f44747; }
.hljs-template-variable                              { color: #9cdcfe; }
.hljs-addition                                       { background: #144212; color: #6a9955; }
.hljs-deletion                                       { background: #600; color: #f44747; }
`;

// Inject theme once
if (!document.getElementById('hljs-vscode-theme')) {
  const style = document.createElement('style');
  style.id = 'hljs-vscode-theme';
  style.textContent = HLJS_THEME;
  document.head.appendChild(style);
}

// ── Language display names ─────────────────────────────────────────────────
const LANG_LABELS = {
  javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python',
  cpp: 'C++', java: 'Java', kotlin: 'Kotlin', c: 'C', rust: 'Rust',
  go: 'Go', bash: 'Bash / Shell', sql: 'SQL', xml: 'HTML / XML',
};

// ── CodeBlock component ────────────────────────────────────────────────────
function CodeBlock({ raw, hintLang }) {
  const [copied, setCopied] = useState(false);

  // Highlight: use hintLang if valid, else auto-detect
  let highlighted;
  let detectedLang;

  if (hintLang && hljs.getLanguage(hintLang)) {
    highlighted = hljs.highlight(raw, { language: hintLang });
    detectedLang = hintLang;
  } else {
    highlighted = hljs.highlightAuto(raw, [
      'cpp','java','python','javascript','typescript',
      'kotlin','c','rust','go','bash','sql','xml',
    ]);
    detectedLang = highlighted.language;
  }

  const label = LANG_LABELS[detectedLang] || detectedLang || 'Code';

  function handleCopy() {
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/8">
        <span className="text-[10px] font-semibold text-[#858585] uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-[#858585] hover:text-white transition-colors"
        >
          {copied
            ? <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
            : <><Copy size={11} /><span>Copy</span></>}
        </button>
      </div>

      {/* Code area */}
      <pre className="m-0 overflow-x-auto">
        <code
          className="block px-4 py-3 text-[12px] leading-[1.7] font-mono"
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      </pre>
    </div>
  );
}

// ── MessageContent: parses fenced & inline code ────────────────────────────
function MessageContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="break-words">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const inner = part.slice(3, -3);
          const newlineIdx = inner.indexOf('\n');
          const hintLang = newlineIdx !== -1 ? inner.slice(0, newlineIdx).trim().toLowerCase() : '';
          const code = newlineIdx !== -1 ? inner.slice(newlineIdx + 1) : inner;
          return <CodeBlock key={i} raw={code} hintLang={hintLang} />;
        }

        // Inline `code`
        const inlineParts = part.split(/(`[^`\n]+`)/g);
        return (
          <span key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
            {inlineParts.map((ip, j) => {
              if (ip.startsWith('`') && ip.endsWith('`') && ip.length > 2) {
                return (
                  <code
                    key={j}
                    className="px-1.5 py-0.5 rounded bg-white/8 text-amber-300 font-mono text-[11px] border border-white/10 mx-0.5"
                  >
                    {ip.slice(1, -1)}
                  </code>
                );
              }
              return ip;
            })}
          </span>
        );
      })}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── CommentCard ────────────────────────────────────────────────────────────
function CommentCard({ comment, currentUserId, questionId, onDelete }) {
  const isOwn = comment.userId === currentUserId;
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteComment(questionId, comment.id);
      onDelete(comment.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={`flex gap-3 animate-fade-in ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {comment.userName?.[0]?.toUpperCase() || '?'}
      </div>

      <div className={`flex-1 max-w-[90%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-300">{comment.userName}</span>
          <span className="text-[10px] text-gray-600">{formatTime(comment.createdAt)}</span>
        </div>
        <div className={`relative group w-full px-4 py-3 rounded-2xl text-sm text-gray-200
          ${isOwn ? 'bg-brand-600/30 border border-brand-500/30 rounded-tr-sm' : 'bg-dark-600/80 border border-white/5 rounded-tl-sm'}`}
        >
          <MessageContent content={comment.content} />

          {isOwn && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all duration-200"
            >
              {deleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DiscussionThread (main export) ─────────────────────────────────────────
export default function DiscussionThread({ questionId }) {
  const { user, profile } = useAuth();
  const [comments, setComments]   = useState([]);
  const [text, setText]           = useState('');
  const [posting, setPosting]     = useState(false);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!questionId) return;
    const unsub = subscribeDiscussions(questionId, setComments);
    return unsub;
  }, [questionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  async function handlePost(e) {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setPosting(true);
    try {
      await postComment(questionId, user.uid, profile?.name || user.email, text.trim());
      setText('');
      textareaRef.current?.focus();
    } finally {
      setPosting(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost(e);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
        <MessageSquare size={15} className="text-brand-400" />
        Discussion
        {comments.length > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-4 max-h-[28rem] overflow-y-auto scroll-container pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
            No comments yet. Be the first to discuss!
          </div>
        ) : (
          comments.map(c => (
            <CommentCard
              key={c.id}
              comment={c}
              currentUserId={user?.uid}
              questionId={questionId}
              onDelete={id => setComments(prev => prev.filter(c => c.id !== id))}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handlePost} className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Write your solution or ask a doubt...\n\nTip: Use \`\`\`cpp\\n...code...\n\`\`\` for a syntax-highlighted code block (Ctrl+Enter to post)`}
            rows={4}
            className="input-field resize-none font-mono text-xs leading-relaxed"
          />
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-gray-600">
              <span className="text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px]">```cpp</span>
              {' '}for C++ · {' '}
              <span className="text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px]">```py</span>
              {' '}for Python · auto-detected if blank
            </p>
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="btn-primary text-xs px-4 py-2"
            >
              {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">Sign in to join the discussion</p>
      )}
    </div>
  );
}
