import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import BackButton from "../components/BackButton";
import Dropzone from "../components/Dropzone";
import Toolbar from "../components/editor/Toolbar";
import AdjustPanel from "../components/editor/AdjustPanel";
import FiltersPanel from "../components/editor/FiltersPanel";
import CropPanel from "../components/editor/CropPanel";
import TextPanel from "../components/editor/TextPanel";
import DrawPanel from "../components/editor/DrawPanel";
import EditorCanvas from "../components/editor/EditorCanvas";
import { useEditorCanvas, DEFAULT_ADJ } from "../hooks/useEditorCanvas";
import { useNavigate } from "react-router";

export default function Editor() {
  const editor = useEditorCanvas();

  const [activeTool, setActiveTool] = useState("adjust");
  const [drawTool, setDrawTool] = useState("brush");
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(8);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [pendingText, setPendingText] = useState(null);

  // Mobile: panel slides up from bottom; track open state
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [exportFmt, setExportFmt] = useState("png");
  const [exportQ, setExportQ] = useState(92);

  // Adjustment handlers
  const handleAdjChange = useCallback(
    (key, val) => {
      editor.setDraftAdj((prev) => ({ ...prev, [key]: val }));
    },
    [editor],
  );

  const handleAdjCommit = useCallback(
    (key, val) => {
      const next = { ...editor.draftAdj, [key]: val };
      editor.committedAdj.current = next;
      editor.setDraftAdj(next);
    },
    [editor],
  );

  const handleAdjReset = useCallback(() => {
    editor.committedAdj.current = DEFAULT_ADJ;
    editor.setDraftAdj(DEFAULT_ADJ);
    toast.info("Adjustments reset.");
  }, [editor]);

  // Filter handler
  const handleFilterSelect = useCallback(
    (idx) => {
      editor.setActiveFilter(idx);
    },
    [editor],
  );

  // Crop handlers
  const handleRotate = useCallback(
    (deg, absolute = false) => {
      editor.setRotation((prev) => (absolute ? deg : (prev + deg + 360) % 360));
    },
    [editor],
  );

  const handleApplyCrop = useCallback(() => {
    if (!editor.cropBox || !editor.baseCanvasRef.current) {
      toast.info("Draw a crop region first.");
      return;
    }
    const src = editor.baseCanvasRef.current;
    const { x, y, w, h } = editor.cropBox;
    const rad = (editor.rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)),
      cos = Math.abs(Math.cos(rad));
    const rw = Math.round(src.width * cos + src.height * sin);
    const rh = Math.round(src.width * sin + src.height * cos);
    const rc = document.createElement("canvas");
    rc.width = rw;
    rc.height = rh;
    const rx = rc.getContext("2d");
    rx.translate(rw / 2, rh / 2);
    if (editor.flipH) rx.scale(-1, 1);
    if (editor.flipV) rx.scale(1, -1);
    rx.rotate(rad);
    rx.drawImage(src, -src.width / 2, -src.height / 2);
    const cc = document.createElement("canvas");
    cc.width = Math.round(w * rw);
    cc.height = Math.round(h * rh);
    cc.getContext("2d").drawImage(
      rc,
      x * rw,
      y * rh,
      cc.width,
      cc.height,
      0,
      0,
      cc.width,
      cc.height,
    );
    editor.baseCanvasRef.current = cc;
    editor.setRotation(0);
    editor.setFlipH(false);
    editor.setFlipV(false);
    editor.setCropBox(null);
    toast.success("Crop applied.");
  }, [editor]);

  const handleResetCrop = useCallback(() => {
    editor.setCropBox(null);
    editor.setRotation(0);
    editor.setFlipH(false);
    editor.setFlipV(false);
    editor.baseCanvasRef.current = editor.originalFileRef.current;
    toast.info("Crop reset.");
  }, [editor]);

  // Text placement
  const handleAddText = useCallback((textObj) => {
    setPendingText(textObj);
    setMobilePanelOpen(false);
    toast.info("Tap the image to place your text.");
  }, []);

  // Export
  const handleExport = useCallback(() => {
    setExporting(true);
    requestAnimationFrame(() => {
      try {
        const out = editor.compose();
        if (!out) {
          toast.error("Nothing to export.");
          setExporting(false);
          return;
        }
        out.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${editor.fileName || "edited"}.${exportFmt === "jpeg" ? "jpg" : "png"}`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            toast.success("Downloaded!");
            setExporting(false);
          },
          exportFmt === "jpeg" ? "image/jpeg" : "image/png",
          exportQ / 100,
        );
      } catch (e) {
        toast.error("Export failed: " + e.message);
        setExporting(false);
      }
    });
  }, [editor, exportFmt, exportQ]);

  // Tool switch
  const handleToolSelect = useCallback(
    (tool) => {
      setPendingText(null);
      if (activeTool === tool) {
        // Toggle panel on mobile
        setMobilePanelOpen((v) => !v);
      } else {
        setActiveTool(tool);
        setMobilePanelOpen(true);
      }
    },
    [activeTool],
  );

  // Panel content
  const renderPanel = () => {
    switch (activeTool) {
      case "adjust":
        return (
          <AdjustPanel
            draftAdj={editor.draftAdj}
            onChange={handleAdjChange}
            onCommit={handleAdjCommit}
            onReset={handleAdjReset}
          />
        );
      case "filters":
        return (
          <FiltersPanel
            activeFilter={editor.activeFilter}
            onSelect={handleFilterSelect}
            sourceCanvas={editor.baseCanvasRef.current}
          />
        );
      case "crop":
        return (
          <CropPanel
            rotation={editor.rotation}
            onRotate={handleRotate}
            flipH={editor.flipH}
            onFlipH={() => editor.setFlipH((v) => !v)}
            flipV={editor.flipV}
            onFlipV={() => editor.setFlipV((v) => !v)}
            aspectRatio={aspectRatio}
            onAspectRatio={setAspectRatio}
            onApplyCrop={handleApplyCrop}
            onResetCrop={handleResetCrop}
          />
        );
      case "text":
        return <TextPanel onAddText={handleAddText} />;
      case "draw":
        return (
          <DrawPanel
            tool={drawTool}
            setTool={setDrawTool}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onClearStrokes={() => {
              editor.setStrokes([]);
              toast.info("Cleared.");
            }}
          />
        );
      default:
        return null;
    }
  };

  // Drop screen
  if (!editor.hasImage) {
    return (
      <div className="h-screen bg-[#0A0A0F] flex flex-col">
        <Header
          editor={editor}
          exporting={exporting}
          exportFmt={exportFmt}
          setExportFmt={setExportFmt}
          exportQ={exportQ}
          setExportQ={setExportQ}
          onExport={handleExport}
          showExport={false}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <Dropzone onDrop={editor.loadImage} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-[#0A0A0F] text-[#E2E8F0] flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter',sans-serif" }}
    >
      <Header
        editor={editor}
        exporting={exporting}
        exportFmt={exportFmt}
        setExportFmt={setExportFmt}
        exportQ={exportQ}
        setExportQ={setExportQ}
        onExport={handleExport}
        showExport
      />

      {/* BODY */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop left toolbar */}
        <div className="hidden sm:flex shrink-0">
          <Toolbar
            activeTool={activeTool}
            onSelect={(t) => {
              setPendingText(null);
              setActiveTool(t);
            }}
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            onUndo={editor.undo}
            onRedo={editor.redo}
            isMobile={false}
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-[#070710] min-w-0 min-h-0 overflow-hidden">
          {pendingText && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-violet-600/90 text-white text-xs font-medium backdrop-blur-sm pointer-events-none whitespace-nowrap">
              Tap the image to place text
            </div>
          )}
          <EditorCanvas
            activeTool={activeTool}
            baseCanvas={editor.baseCanvasRef.current}
            draftAdj={editor.draftAdj}
            activeFilter={editor.activeFilter}
            texts={editor.texts}
            setTexts={editor.setTexts}
            strokes={editor.strokes}
            setStrokes={editor.setStrokes}
            brushColor={brushColor}
            brushSize={brushSize}
            drawTool={drawTool}
            cropBox={editor.cropBox}
            setCropBox={editor.setCropBox}
            aspectRatio={aspectRatio}
            rotation={editor.rotation}
            flipH={editor.flipH}
            flipV={editor.flipV}
            pendingText={pendingText}
            setPendingText={setPendingText}
            onCommitCrop={handleApplyCrop}
          />
        </div>

        {/* Desktop right panel */}
        <aside className="hidden sm:flex w-64 shrink-0 flex-col border-l border-white/5 bg-[#0D0D16] overflow-hidden">
          {renderPanel()}
        </aside>
      </div>

      {/* MOBILE BOTTOM UI */}
      <div className="sm:hidden shrink-0 flex flex-col">
        {/* Slide-up panel */}
        <div
          className={`bg-[#0D0D16] border-t border-white/5 overflow-hidden transition-all duration-300 ease-in-out ${
            mobilePanelOpen ? "max-h-[55vh]" : "max-h-0"
          }`}
        >
          {/* Panel header with tool name + close */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="text-xs font-semibold text-white capitalize tracking-wide">
              {
                {
                  adjust: "Adjustments",
                  filters: "Filters",
                  crop: "Crop & Rotate",
                  text: "Text Overlay",
                  draw: "Draw & Annotate",
                }[activeTool]
              }
            </span>
            <button
              onClick={() => setMobilePanelOpen(false)}
              className="p-1.5 rounded-lg text-[#475569] hover:text-white hover:bg-white/5 transition-all"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>
          {/* Scrollable panel content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(55vh - 40px)" }}
          >
            {renderPanel()}
          </div>
        </div>

        {/* Bottom toolbar */}
        <Toolbar
          activeTool={activeTool}
          onSelect={handleToolSelect}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          isMobile={true}
          panelOpen={mobilePanelOpen}
        />
      </div>
    </div>
  );
}

// Extracted header so it's shared between drop + editor states
function Header({
  editor,
  exporting,
  exportFmt,
  setExportFmt,
  exportQ,
  setExportQ,
  onExport,
  showExport,
}) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-[#0D0D16] shrink-0">
      <BackButton to="/" label="Home" />

      <div className="w-px h-5 bg-white/10 shrink-0" />

      {/* Logo */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          onClick={() => navigate("/")}
          className="font-bold text-sm tracking-tight text-white hidden sm:block cursor-pointer"
          style={{ fontFamily: "'Syne',sans-serif" }}
        >
          Pixel<span className="text-violet-400">Pulse</span>
        </span>
      </div>

      {/* Filename + dims */}
      {editor.hasImage && (
        <span className="text-xs text-[#334155] font-mono truncate hidden md:block">
          {editor.fileName} · {editor.dimensions.w}×{editor.dimensions.h}
        </span>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {/* Open new file */}
        <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[#64748B] hover:text-white text-xs transition-all whitespace-nowrap">
          Open
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) =>
              e.target.files[0] && editor.loadImage(e.target.files[0])
            }
          />
        </label>

        {showExport && (
          <>
            {/* Format picker */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#0A0A0F] border border-white/5">
              {["png", "jpeg"].map((f) => (
                <button
                  key={f}
                  onClick={() => setExportFmt(f)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                    exportFmt === f
                      ? "bg-violet-600 text-white"
                      : "text-[#475569] hover:text-white"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quality — desktop only */}
            {exportFmt === "jpeg" && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] text-[#475569]">Q</span>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={2}
                  value={exportQ}
                  onChange={(e) => setExportQ(+e.target.value)}
                  className="w-16 accent-violet-500 h-1"
                />
                <span className="text-[10px] font-mono text-[#475569] w-6">
                  {exportQ}
                </span>
              </div>
            )}

            {/* Export button */}
            <button
              onClick={onExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-600 text-white text-xs font-semibold transition-all disabled:opacity-40 shadow-lg shadow-violet-900/30 whitespace-nowrap"
            >
              {exporting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
                    <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
                  </svg>
                  Export
                </>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
