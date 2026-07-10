import { useRef, useState, useCallback } from "react";

// Canvas filter helpers (all GPU via ctx.filter)
export function buildFilter(adj) {
  const b = 1 + adj.brightness / 100;
  const c = 1 + adj.contrast / 100;
  const s = 1 + adj.saturation / 100;
  const sh =
    adj.sharpness > 0
      ? ` contrast(${(1 + adj.sharpness * 0.004).toFixed(3)})`
      : "";
  // Temperature: warm = sepia-ish tint, cool = hue-rotate
  const temp =
    adj.temperature !== 0
      ? ` hue-rotate(${(adj.temperature * -0.2).toFixed(1)}deg) saturate(${(1 + adj.temperature * 0.003).toFixed(3)})`
      : "";
  const exp =
    adj.exposure !== 0
      ? ` brightness(${(1 + adj.exposure / 200).toFixed(3)})`
      : "";
  const hue = adj.hue !== 0 ? ` hue-rotate(${adj.hue}deg)` : "";
  return `brightness(${b.toFixed(3)}) contrast(${c.toFixed(3)}) saturate(${s.toFixed(3)})${sh}${temp}${exp}${hue}`.trim();
}

export const FILTER_PRESETS = [
  { name: "Original", filter: "none", overlay: null },
  {
    name: "Vivid",
    filter: "saturate(1.6) contrast(1.1) brightness(1.05)",
    overlay: null,
  },
  {
    name: "Matte",
    filter: "contrast(0.85) brightness(1.08) saturate(0.9)",
    overlay: { color: "rgba(255,245,235,0.08)" },
  },
  { name: "B&W", filter: "grayscale(1) contrast(1.1)", overlay: null },
  {
    name: "Fade",
    filter: "contrast(0.8) brightness(1.15) saturate(0.75)",
    overlay: { color: "rgba(255,255,255,0.12)" },
  },
  {
    name: "Chrome",
    filter: "contrast(1.2) saturate(1.3) hue-rotate(5deg)",
    overlay: null,
  },
  {
    name: "Warm",
    filter: "sepia(0.3) saturate(1.2) brightness(1.05)",
    overlay: null,
  },
  {
    name: "Cool",
    filter: "hue-rotate(200deg) saturate(0.8) brightness(1.05)",
    overlay: null,
  },
  {
    name: "Drama",
    filter: "contrast(1.4) saturate(0.7) brightness(0.9)",
    overlay: null,
  },
  {
    name: "Glow",
    filter: "brightness(1.2) saturate(1.1) blur(0px)",
    overlay: { color: "rgba(255,200,100,0.06)" },
  },
];

export const DEFAULT_ADJ = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  temperature: 0,
  exposure: 0,
  sharpness: 0,
};

export function useEditorCanvas() {
  // Source stack
  // baseCanvas: the current "committed" image (after crop/rotate etc.)
  // We re-render the display canvas from baseCanvas + live adjustments on every draw
  const baseCanvasRef = useRef(null); // HTMLCanvasElement — post-crop source
  const originalFileRef = useRef(null); // HTMLCanvasElement — never mutated (for reset)

  const [hasImage, setHasImage] = useState(false);
  const [fileName, setFileName] = useState("untitled");
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Adjustments
  const [draftAdj, setDraftAdj] = useState(DEFAULT_ADJ);
  const committedAdj = useRef(DEFAULT_ADJ);

  // Filter preset
  const [activeFilter, setActiveFilter] = useState(0); // index into FILTER_PRESETS

  // Text overlays
  const [texts, setTexts] = useState([]); // [{id,text,x,y,size,color,fontFamily}]

  // Draw strokes
  const [strokes, setStrokes] = useState([]); // [{points:[{x,y}],color,size,tool}]

  // Crop state
  const [rotation, setRotation] = useState(0); // degrees
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  // crop box: null = no crop, else {x,y,w,h} as fraction of canvas (0..1)
  const [cropBox, setCropBox] = useState(null);

  // Undo / redo stack
  // Each entry is a serialisable snapshot of editor state
  const historyRef = useRef([]);
  const historyIdx = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const snapshot = useCallback(
    () => ({
      adj: { ...committedAdj.current },
      filter: activeFilter,
      texts: JSON.parse(JSON.stringify(texts)),
      strokes: JSON.parse(JSON.stringify(strokes)),
      rotation,
      flipH,
      flipV,
      cropBox,
      // store base canvas as dataURL for restoration
      base: baseCanvasRef.current?.toDataURL("image/png"),
    }),
    [activeFilter, texts, strokes, rotation, flipH, flipV, cropBox],
  );

  const pushHistory = useCallback((snap) => {
    const h = historyRef.current;
    const idx = historyIdx.current;
    // Trim forward history
    h.splice(idx + 1);
    h.push(snap);
    // Keep max 20 steps
    if (h.length > 20) h.shift();
    historyIdx.current = h.length - 1;
    setCanUndo(historyIdx.current > 0);
    setCanRedo(false);
  }, []);

  function restoreSnapshot(snap) {
    if (!snap) return;
    committedAdj.current = snap.adj;
    setDraftAdj(snap.adj);
    setActiveFilter(snap.filter);
    setTexts(snap.texts);
    setStrokes(snap.strokes);
    setRotation(snap.rotation);
    setFlipH(snap.flipH);
    setFlipV(snap.flipV);
    setCropBox(snap.cropBox);
    if (snap.base) {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        c.getContext("2d").drawImage(img, 0, 0);
        baseCanvasRef.current = c;
      };
      img.src = snap.base;
    }
  }

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (historyIdx.current <= 0) return;
    historyIdx.current--;
    restoreSnapshot(h[historyIdx.current]);
    setCanUndo(historyIdx.current > 0);
    setCanRedo(true);
  }, []);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (historyIdx.current >= h.length - 1) return;
    historyIdx.current++;
    restoreSnapshot(h[historyIdx.current]);
    setCanUndo(true);
    setCanRedo(historyIdx.current < h.length - 1);
  }, []);

  // Load image
  const loadImage = useCallback((file) => {
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      originalFileRef.current = c;
      baseCanvasRef.current = c;
      setDimensions({ w: c.width, h: c.height });
      setHasImage(true);
      committedAdj.current = DEFAULT_ADJ;
      setDraftAdj(DEFAULT_ADJ);
      setActiveFilter(0);
      setTexts([]);
      setStrokes([]);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCropBox(null);
      historyRef.current = [];
      historyIdx.current = -1;
      setCanUndo(false);
      setCanRedo(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  // Compose final canvas (call to get export-ready canvas)
  const compose = useCallback(() => {
    const base = baseCanvasRef.current;
    if (!base) return null;

    const adj = committedAdj.current;
    const preset = FILTER_PRESETS[activeFilter];

    // 1. Rotation + flip
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)),
      cos = Math.abs(Math.cos(rad));
    const rw = Math.round(base.width * cos + base.height * sin);
    const rh = Math.round(base.width * sin + base.height * cos);
    const rc = document.createElement("canvas");
    rc.width = rw;
    rc.height = rh;
    const rx = rc.getContext("2d");
    rx.translate(rw / 2, rh / 2);
    if (flipH) rx.scale(-1, 1);
    if (flipV) rx.scale(1, -1);
    rx.rotate(rad);
    rx.drawImage(base, -base.width / 2, -base.height / 2);

    // 2. Crop
    let cropped = rc;
    if (cropBox) {
      const cc = document.createElement("canvas");
      cc.width = Math.round(cropBox.w * rc.width);
      cc.height = Math.round(cropBox.h * rc.height);
      cc.getContext("2d").drawImage(
        rc,
        cropBox.x * rc.width,
        cropBox.y * rc.height,
        cc.width,
        cc.height,
        0,
        0,
        cc.width,
        cc.height,
      );
      cropped = cc;
    }

    // 3. Adjustments + preset filter
    const out = document.createElement("canvas");
    out.width = cropped.width;
    out.height = cropped.height;
    const oc = out.getContext("2d");
    const adjFilter = buildFilter(adj);
    oc.filter =
      preset.filter !== "none"
        ? `${adjFilter} ${preset.filter}`.trim()
        : adjFilter;
    oc.drawImage(cropped, 0, 0);
    oc.filter = "none";
    if (preset.overlay) {
      oc.fillStyle = preset.overlay.color;
      oc.fillRect(0, 0, out.width, out.height);
    }

    // 4. Draw strokes
    for (const stroke of strokes) {
      if (!stroke.points.length) continue;
      oc.save();
      oc.strokeStyle = stroke.color;
      oc.lineWidth = stroke.size;
      oc.lineCap = "round";
      oc.lineJoin = "round";
      if (stroke.tool === "eraser") {
        oc.globalCompositeOperation = "destination-out";
      }
      oc.beginPath();
      stroke.points.forEach((p, i) =>
        i === 0 ? oc.moveTo(p.x, p.y) : oc.lineTo(p.x, p.y),
      );
      oc.stroke();
      oc.restore();
    }

    // 5. Text overlays
    for (const t of texts) {
      oc.save();
      oc.font = `${t.bold ? "bold " : ""}${t.size}px '${t.fontFamily}', sans-serif`;
      oc.fillStyle = t.color;
      oc.globalAlpha = t.opacity ?? 1;
      if (t.shadow) {
        oc.shadowColor = "rgba(0,0,0,0.6)";
        oc.shadowBlur = 4;
      }
      oc.fillText(t.text, t.x, t.y);
      oc.restore();
    }

    return out;
  }, [activeFilter, strokes, texts, rotation, flipH, flipV, cropBox]);

  return {
    // state
    hasImage,
    fileName,
    dimensions,
    draftAdj,
    setDraftAdj,
    committedAdj,
    activeFilter,
    setActiveFilter,
    texts,
    setTexts,
    strokes,
    setStrokes,
    rotation,
    setRotation,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    cropBox,
    setCropBox,
    canUndo,
    canRedo,
    // refs
    baseCanvasRef,
    originalFileRef,
    // actions
    loadImage,
    compose,
    snapshot,
    pushHistory,
    undo,
    redo,
    DEFAULT_ADJ,
  };
}
