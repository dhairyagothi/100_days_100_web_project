const TOOLS = [
  {
    id: "adjust",
    label: "Adjust",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10 3.75a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM17.25 4.5a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM5 3.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM4.25 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM17.25 17.75a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM9 17a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 9 17ZM2.75 9.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM18 10a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM11.75 9.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z" />
      </svg>
    ),
  },
  {
    id: "filters",
    label: "Filters",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.823 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: "crop",
    label: "Crop",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.25 1a.75.75 0 0 1 .75.75V3h6.25A2.75 2.75 0 0 1 16 5.75V12h1.25a.75.75 0 0 1 0 1.5H16v1.25a.75.75 0 0 1-1.5 0V13.5H8.25A2.75 2.75 0 0 1 5.5 10.75V4H4.25a.75.75 0 0 1 0-1.5H5.5V1.75A.75.75 0 0 1 6.25 1Z" />
      </svg>
    ),
  },
  {
    id: "text",
    label: "Text",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 3.75C2 2.784 2.784 2 3.75 2h12.5c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5h-5.25v11h1.75a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1 0-1.5h1.75v-11H3.75v1.5a.75.75 0 0 1-1.5 0v-1.5Z" />
      </svg>
    ),
  },
  {
    id: "draw",
    label: "Draw",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.342Z" />
      </svg>
    ),
  },
];

const UndoIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      d="M1.22 4.22a.75.75 0 0 1 1.06 0L5.5 7.44V4.75a5.75 5.75 0 1 1 0 11.5h-1a.75.75 0 0 1 0-1.5h1a4.25 4.25 0 1 0 0-8.5H5.5v2.69l-3.22-3.22a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      d="M14.78 4.22a.75.75 0 0 0-1.06 0L10.5 7.44V4.75a5.75 5.75 0 1 0 0 11.5h1a.75.75 0 0 0 0-1.5h-1a4.25 4.25 0 1 1 0-8.5h.5v2.69l3.22-3.22a.75.75 0 0 0 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Toolbar({
  activeTool,
  onSelect,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isMobile,
  panelOpen,
}) {
  if (isMobile) {
    return (
      <div
        className="flex items-center bg-[#0D0D16] border-t border-white/5 safe-area-pb"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Tool buttons */}
        {TOOLS.map((t) => {
          const isActive = activeTool === t.id;
          const isOpen = isActive && panelOpen;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all ${
                isActive
                  ? "text-violet-400"
                  : "text-[#475569] hover:text-[#94A3B8]"
              }`}
            >
              {/* Active indicator bar */}
              {isOpen && (
                <span className="absolute top-0 left-2 right-2 h-0.5 rounded-full bg-violet-500" />
              )}
              {t.icon}
              <span className="text-[10px] font-medium leading-none">
                {t.label}
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-px h-8 bg-white/5 shrink-0" />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-none flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 text-[#475569] hover:text-white disabled:opacity-25 transition-all"
        >
          <UndoIcon />
          <span className="text-[10px] font-medium leading-none">Undo</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-none flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 text-[#475569] hover:text-white disabled:opacity-25 transition-all"
        >
          <RedoIcon />
          <span className="text-[10px] font-medium leading-none">Redo</span>
        </button>
      </div>
    );
  }

  // Desktop vertical sidebar 
  return (
    <div className="flex flex-col items-center gap-1 py-4 px-2 bg-[#0D0D16] border-r border-white/5 w-16 h-full">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          title={t.label}
          className={`flex flex-col items-center gap-1 w-full py-2.5 rounded-lg transition-all text-center border ${
            activeTool === t.id
              ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
              : "text-[#475569] hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          {t.icon}
          <span className="text-[9px] font-medium leading-none">{t.label}</span>
        </button>
      ))}

      {/* Undo/Redo pushed to bottom */}
      <div className="mt-auto pt-3 border-t border-white/5 w-full flex flex-col gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="flex justify-center py-2 rounded-lg text-[#475569] hover:text-white disabled:opacity-25 hover:bg-white/5 transition-all"
        >
          <UndoIcon />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="flex justify-center py-2 rounded-lg text-[#475569] hover:text-white disabled:opacity-25 hover:bg-white/5 transition-all"
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
}
