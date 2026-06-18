// src/pages/StudyPage.jsx
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, FileText, ChevronRight, ChevronDown, Search, ExternalLink, Sparkles, Calendar } from 'lucide-react';
import { STUDY_SUBJECTS } from '../utils/studyData';

function PdfCard({ pdf, folderPath, staggerIndex }) {
  const pdfUrl = encodeURI(`${import.meta.env.BASE_URL}resources/${folderPath}/${pdf.file}`);

  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-5 py-4 rounded-xl bg-dark-600/30 border border-white/5
        hover:border-brand-500/30 hover:bg-brand-500/10 hover:shadow-glow-sm transition-all duration-300 group
        animate-slide-up"
      style={{ animationDelay: `${staggerIndex * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/20 flex flex-col items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
        <FileText size={16} className="text-rose-400 drop-shadow-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors truncate drop-shadow-sm">
          {pdf.name}
        </p>
        <p className="text-xs text-brand-200/60 truncate mt-0.5">{pdf.file}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-300 shrink-0">
        <ExternalLink size={14} className="text-gray-400 group-hover:text-brand-400 transition-colors" />
      </div>
    </a>
  );
}

function TopicAccordion({ topic, initialOpen, staggerIndex }) {
  const [open, setOpen] = useState(initialOpen);
  const hasPdfs = topic.pdfs.length > 0;

  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);

  const agendaChunks = useMemo(() => {
    if (!topic.agenda) return [];
    const result = [];
    let currentSingleGroup = [];
    
    // Count items per PDF
    const pdfCounts = {};
    topic.agenda.forEach(item => {
      pdfCounts[item.pdf] = (pdfCounts[item.pdf] || 0) + 1;
    });

    const addedGroupedPdfs = new Set();

    topic.agenda.forEach(item => {
      if (pdfCounts[item.pdf] === 1) {
        currentSingleGroup.push(item);
      } else {
        // It's part of a group (spider layout)
        if (currentSingleGroup.length > 0) {
          result.push({ type: 'single', items: currentSingleGroup });
          currentSingleGroup = [];
        }
        if (!addedGroupedPdfs.has(item.pdf)) {
          addedGroupedPdfs.add(item.pdf);
          const groupItems = topic.agenda.filter(x => x.pdf === item.pdf);
          result.push({ type: 'spider', pdf: item.pdf, items: groupItems });
        }
      }
    });

    if (currentSingleGroup.length > 0) {
      result.push({ type: 'single', items: currentSingleGroup });
    }

    return result;
  }, [topic.agenda]);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden bg-dark-700/20 backdrop-blur-md animate-slide-up hover:border-white/10 transition-all duration-300"
      style={{ animationDelay: `${staggerIndex * 50}ms`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => (hasPdfs || topic.agenda) && setOpen(o => !o)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-300
          ${(hasPdfs || topic.agenda) ? 'cursor-pointer hover:bg-white/5' : 'cursor-default opacity-60'}`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
          ${open ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-white/5 border border-transparent'}`}>
          <BookOpen size={18} className={open ? 'text-brand-400' : 'text-gray-400'} />
        </div>
        <div className="flex-1">
          <p className={`text-base font-bold transition-colors ${open ? 'text-brand-300' : 'text-gray-200'}`}>
            {topic.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 font-medium bg-dark-800/50 px-2 py-0.5 rounded-md">
              {topic.agenda ? '📚 Weekly Agenda Available' : hasPdfs ? `${topic.pdfs.length} Document${topic.pdfs.length !== 1 ? 's' : ''}` : 'No files yet'}
            </span>
          </div>
        </div>
        {(hasPdfs || topic.agenda) && (
          <div className={`p-2 rounded-full transition-colors ${open ? 'bg-brand-500/10' : 'bg-transparent'}`}>
            {open
              ? <ChevronDown size={18} className="text-brand-400" />
              : <ChevronRight size={18} className="text-gray-500" />}
          </div>
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 grid gap-3 animate-fade-in relative">
          <div className="absolute left-[38px] top-0 bottom-8 w-px bg-gradient-to-b from-brand-500/30 to-transparent z-0 hidden sm:block" />
          
          {topic.pdfs.map((pdf, i) => (
            <div key={pdf.file} className="relative z-10 sm:pl-10">
              <PdfCard pdf={pdf} folderPath={topic.folderPath} staggerIndex={i} />
            </div>
          ))}

          {/* Agenda Board */}
          {agendaChunks.length > 0 && (
            <div className="relative z-10 sm:pl-10 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-8 animate-slide-up">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Calendar size={14} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Structured Weekly Agenda</h3>
              </div>
              
              <div className="flex flex-col gap-12">
                {agendaChunks.map((chunk, chunkIdx) => {
                  if (chunk.type === 'single') {
                    return (
                      <div key={`single-${chunkIdx}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        {chunk.items.map((weekData, idx) => {
                          const pdfUrl = encodeURI(`${import.meta.env.BASE_URL}resources/${topic.folderPath}/${weekData.pdf}`);
                          return (
                            <a 
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={weekData.week} 
                              className="relative flex flex-col items-center animate-fade-in group cursor-pointer"
                              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                            >
                              {/* Header Card (The Pin Board) */}
                              <div className="z-20 w-full px-5 py-4 rounded-xl bg-gradient-to-br from-dark-500/80 to-dark-600/80 backdrop-blur-md border border-white/10 text-center shadow-xl relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-brand-500/40">
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity rounded-xl" />
                                <h4 className="text-[11px] font-black text-brand-400 uppercase tracking-[0.2em] mb-1.5 drop-shadow-sm flex justify-center items-center gap-1.5">
                                  Week {weekData.week} <ExternalLink size={10} className="text-brand-500/70" />
                                </h4>
                                <p className="text-[13px] font-bold text-gray-100 leading-tight drop-shadow-md group-hover:text-white transition-colors">{weekData.title}</p>
                              </div>

                              {/* Strings / Wires */}
                              <div className="relative w-full z-10 transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="absolute top-0 left-[20%] w-[2px] h-[30px] bg-gradient-to-b from-brand-400/50 to-brand-600/20 shadow-sm group-hover:from-brand-300 transition-colors duration-300" />
                                <div className="absolute top-0 right-[20%] w-[2px] h-[30px] bg-gradient-to-b from-brand-400/50 to-brand-600/20 shadow-sm group-hover:from-brand-300 transition-colors duration-300" />
                              </div>

                              {/* Hanging Card */}
                              <div className="z-10 w-[92%] mt-[30px] bg-dark-700/60 backdrop-blur-xl rounded-b-2xl rounded-t-lg p-5 border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_15px_35px_rgba(var(--brand-rgb),0.15)] group-hover:bg-dark-600/80 group-hover:border-white/15">
                                {/* Pins */}
                                <div className="absolute top-0 left-[18.2%] w-2.5 h-2.5 -mt-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(var(--brand-rgb),0.8)] border border-brand-300 group-hover:bg-brand-400 transition-colors duration-300" />
                                <div className="absolute top-0 right-[18.2%] w-2.5 h-2.5 -mt-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(var(--brand-rgb),0.8)] border border-brand-300 group-hover:bg-brand-400 transition-colors duration-300" />
                                
                                <ul className="space-y-3 mt-2">
                                  {weekData.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-[12px] text-gray-300 group-hover:text-gray-200 transition-colors relative z-20">
                                      <span className="text-brand-500 font-bold opacity-80 mt-0.5 text-[10px] group-hover:opacity-100 transition-opacity">♦</span>
                                      <span className="leading-snug">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    );
                  } else if (chunk.type === 'spider') {
                    const pdfUrl = encodeURI(`${import.meta.env.BASE_URL}resources/${topic.folderPath}/${chunk.pdf}`);
                    return (
                      <div key={chunk.pdf} className="flex flex-col items-center animate-fade-in w-full bg-dark-800/30 rounded-3xl p-6 md:p-8 border border-white/5 relative">
                        {/* Main PDF Link Node */}
                        <a 
                          href={pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="z-30 w-full max-w-sm px-6 py-5 rounded-2xl bg-gradient-to-br from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-center shadow-[0_0_30px_rgba(var(--brand-rgb),0.15)] hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--brand-rgb),0.3)] transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                          <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-400/30 group-hover:bg-brand-500/30 transition-colors">
                              <FileText size={20} className="text-brand-400" />
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] mb-1.5 opacity-80">Compiled Material</h4>
                              <p className="text-[15px] font-bold text-white leading-tight break-all flex items-center justify-center gap-2">
                                {chunk.pdf} <ExternalLink size={14} className="text-brand-400 opacity-70 group-hover:opacity-100" />
                              </p>
                            </div>
                          </div>
                        </a>

                        {/* Connection Lines & Grid */}
                        <div className="relative w-full mt-8 pt-6 border-t-2 border-dashed border-brand-500/20">
                          {/* Vertical Drop from Main Node to Horizontal Line */}
                          <div className="absolute -top-8 left-1/2 w-[2px] h-8 border-l-2 border-dashed border-brand-500/20" />
                          {/* Central dot */}
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-500/40 border border-brand-400/50" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {chunk.items.map((weekData, idx) => (
                              <div key={weekData.week} className="relative flex flex-col items-center group">
                                {/* Connecting line UP to the horizontal bar */}
                                <div className="absolute -top-6 left-1/2 w-[2px] h-6 border-l-2 border-dashed border-brand-500/20 group-hover:border-brand-400/60 transition-colors duration-300" />
                                
                                {/* The Week Card itself (not clickable) */}
                                <div className="w-full relative flex flex-col items-center">
                                  {/* Header Card */}
                                  <div className="z-20 w-full px-5 py-4 rounded-xl bg-dark-600/80 backdrop-blur-md border border-white/5 text-center shadow-md relative group-hover:border-brand-500/20 transition-colors duration-300">
                                    <h4 className="text-[11px] font-black text-gray-400 group-hover:text-brand-400 uppercase tracking-[0.2em] mb-1.5 drop-shadow-sm transition-colors">Week {weekData.week}</h4>
                                    <p className="text-[13px] font-bold text-gray-200 leading-tight drop-shadow-md">{weekData.title}</p>
                                  </div>

                                  {/* Strings / Wires */}
                                  <div className="relative w-full z-10">
                                    <div className="absolute top-0 left-[20%] w-[2px] h-[30px] bg-gradient-to-b from-gray-600/50 to-gray-700/20 group-hover:from-brand-500/40 group-hover:to-brand-600/10 transition-colors duration-300 shadow-sm" />
                                    <div className="absolute top-0 right-[20%] w-[2px] h-[30px] bg-gradient-to-b from-gray-600/50 to-gray-700/20 group-hover:from-brand-500/40 group-hover:to-brand-600/10 transition-colors duration-300 shadow-sm" />
                                  </div>

                                  {/* Hanging Card */}
                                  <div className="z-10 w-[92%] mt-[30px] bg-dark-700/40 backdrop-blur-xl rounded-b-2xl rounded-t-lg p-5 border border-white/5 shadow-lg group-hover:bg-dark-700/60 transition-colors duration-300">
                                    {/* Pins */}
                                    <div className="absolute top-0 left-[18.2%] w-2.5 h-2.5 -mt-1.5 rounded-full bg-gray-500/50 border border-gray-400/50 group-hover:bg-brand-500/60 group-hover:border-brand-400/60 transition-colors duration-300" />
                                    <div className="absolute top-0 right-[18.2%] w-2.5 h-2.5 -mt-1.5 rounded-full bg-gray-500/50 border border-gray-400/50 group-hover:bg-brand-500/60 group-hover:border-brand-400/60 transition-colors duration-300" />
                                    
                                    <ul className="space-y-3 mt-2">
                                      {weekData.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[12px] text-gray-400 group-hover:text-gray-300 transition-colors relative z-20">
                                          <span className="text-gray-600 font-bold mt-0.5 text-[10px] group-hover:text-brand-500/80 transition-colors">♦</span>
                                          <span className="leading-snug">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StudyPage() {
  const [searchParams] = useSearchParams();
  const linkedTopicId = searchParams.get('topic');

  const [activeSubject, setActiveSubject] = useState(() => {
    // Determine initial subject based on linkedTopicId
    if (linkedTopicId) {
      const parentSub = STUDY_SUBJECTS.find(s => s.topics.some(t => t.id === linkedTopicId));
      if (parentSub) return parentSub.id;
    }
    return STUDY_SUBJECTS[0].id;
  });

  const [search, setSearch] = useState('');

  const subject = useMemo(() => STUDY_SUBJECTS.find(s => s.id === activeSubject), [activeSubject]);

  const filteredTopics = useMemo(() =>
    (subject?.topics || []).filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase())
    ), [subject, search]);

  const totalPdfs = useMemo(() =>
    (subject?.topics || []).reduce((a, t) => a + t.pdfs.length, 0), [subject]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-brand-500/20 flex items-center justify-center border border-brand-500/20">
              <Sparkles className="text-brand-400" size={20} />
            </div>
            Premium Study Notes
          </h1>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Curated collections of PDF notes, handbooks, and interview prep materials. Completely mapped with AlgoGATE's practice paths.
          </p>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-dark-800/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
        {STUDY_SUBJECTS.map(s => (
          <button
            key={s.id}
            onClick={() => { setActiveSubject(s.id); setSearch(''); }}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300
              ${activeSubject === s.id
                ? 'text-white border-transparent shadow-glow-sm bg-gradient-to-r ' + s.color + ' scale-[1.02]'
                : 'bg-dark-700/30 border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/15'}`}
          >
            <span className="text-lg drop-shadow-md">{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* Subject banner */}
      {subject && (
        <div className={`relative overflow-hidden glass border border-white/10 p-6 sm:p-8 mb-8 rounded-3xl`}>
           <div className={`absolute inset-0 bg-gradient-to-r ${subject.color} opacity-10 pointer-events-none`} />
           <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl drop-shadow-md">{subject.icon}</span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{subject.name}</h2>
              </div>
              <p className="text-sm text-brand-200/70 max-w-lg font-medium leading-relaxed">{subject.description}</p>
            </div>
            
            <div className="flex gap-4 shrink-0 bg-dark-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
              <div className="text-center px-4 border-r border-white/10">
                <p className="text-3xl font-extrabold text-white tracking-tighter">{subject.topics.length}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Modules</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-extrabold text-brand-300 drop-shadow-sm tracking-tighter">{totalPdfs}</p>
                <p className="text-[10px] font-bold text-brand-500/80 uppercase tracking-wider mt-1">Documents</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-xl animate-slide-up">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${subject?.name} topics...`}
          className="w-full bg-dark-700/30 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300"
        />
      </div>

      {/* Topics list */}
      {filteredTopics.length === 0 ? (
        <div className="glass p-16 rounded-3xl text-center text-gray-500 text-sm border-dashed border-2 border-white/5 animate-fade-in">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold text-gray-400 mb-1">{search ? `No matches for "${search}"` : 'No modules active'}</p>
          <p className="text-xs">Try searching for something else or explore other subjects.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic, i) => (
            <TopicAccordion key={topic.id} topic={topic} staggerIndex={i} initialOpen={topic.id === linkedTopicId} />
          ))}
        </div>
      )}

      {/* External Resources Divider */}
      <div className="flex items-center gap-4 mt-16 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">External Preparation Links</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="group relative overflow-hidden bg-dark-700/30 border border-blue-500/20 p-6 rounded-3xl hover:bg-blue-500/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-sm">🎓</div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">IITM BS Program</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">Official course materials for the Indian Institute of Technology Madras online degree.</p>
            <a href="https://study.iitm.ac.in/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 text-sm text-blue-300 hover:bg-blue-500 hover:text-white font-bold transition-all duration-300">
              Visit Site <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-dark-700/30 border border-purple-500/20 p-6 rounded-3xl hover:bg-purple-500/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-sm">📐</div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">GATE CS Prep</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">Comprehensive notes for Data Structures, Algorithms, Theory of Computation, and more.</p>
            <a href="https://www.geeksforgeeks.org/gate-cs-notes-gq/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 text-sm text-purple-300 hover:bg-purple-500 hover:text-white font-bold transition-all duration-300">
              Read Notes <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
