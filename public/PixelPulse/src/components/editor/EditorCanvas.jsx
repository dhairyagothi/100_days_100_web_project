import { useRef, useEffect, useCallback, useState } from "react";
import { buildFilter, FILTER_PRESETS } from "../../hooks/useEditorCanvas";

export default function EditorCanvas({
  activeTool,
  baseCanvas,
  draftAdj,
  activeFilter,
  texts,
  setTexts,
  strokes,
  setStrokes,
  brushColor,
  brushSize,
  drawTool,
  cropBox,
  setCropBox,
  aspectRatio,
  rotation,
  flipH,
  flipV,
  pendingText,
  setPendingText,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // Drawing state (refs — no re-render needed)
  const isDrawing = useRef(false);
  const currentStroke = useRef([]);

  // Crop drag state
  const cropDrag = useRef(null); // {handle, startX, startY, startBox}
  const [cropDragBox, setCropDragBox] = useState(null); // live drag preview

  // Compute image rect inside canvas
  function getImageRect(cw, ch, iw, ih) {
    const scale = Math.min(cw / iw, ch / ih) * 0.92;
    const dw = iw * scale,
      dh = ih * scale;
    return { x: (cw - dw) / 2, y: (ch - dh) / 2, w: dw, h: dh, scale };
  }

  // Main draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const cont = containerRef.current;
    if (!canvas || !cont || !baseCanvas) return;

    const cw = cont.clientWidth,
      ch = cont.clientHeight;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, cw, ch);

    // Image geometry (account for rotation)
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)),
      cos = Math.abs(Math.cos(rad));
    const rw = baseCanvas.width * cos + baseCanvas.height * sin;
    const rh = baseCanvas.width * sin + baseCanvas.height * cos;
    const { x: ix, y: iy, w: iw, h: ih, scale } = getImageRect(cw, ch, rw, rh);

    // Draw image with adjustments + filter
    ctx.save();
    ctx.translate(ix + iw / 2, iy + ih / 2);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);
    ctx.rotate(rad);
    const preset = FILTER_PRESETS[activeFilter];
    const adjF = buildFilter(draftAdj);
    ctx.filter = preset.filter !== "none" ? `${adjF} ${preset.filter}` : adjF;
    ctx.drawImage(baseCanvas, -iw / 2, -ih / 2, iw, ih);
    ctx.filter = "none";
    if (preset.overlay) {
      ctx.fillStyle = preset.overlay.color;
      ctx.fillRect(-iw / 2, -ih / 2, iw, ih);
    }
    ctx.restore();

    // Draw strokes
    for (const stroke of strokes) {
      if (!stroke.points.length) continue;
      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (stroke.tool === "eraser")
        ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        const sx = ix + p.x * iw,
          sy = iy + p.y * ih;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Draw texts
    for (const t of texts) {
      ctx.save();
      ctx.font = `${t.bold ? "bold " : ""}${t.size * scale}px '${t.fontFamily}',sans-serif`;
      ctx.fillStyle = t.color;
      ctx.globalAlpha = t.opacity ?? 1;
      if (t.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 4 * scale;
      }
      ctx.fillText(t.text, ix + t.x * iw, iy + t.y * ih);
      ctx.restore();
    }

    // Live stroke
    if (currentStroke.current.length > 1) {
      ctx.save();
      ctx.strokeStyle =
        drawTool === "eraser" ? "rgba(255,255,255,0.5)" : brushColor;
      ctx.lineWidth = brushSize * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (drawTool === "eraser")
        ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      currentStroke.current.forEach((p, i) => {
        const sx = ix + p.x * iw,
          sy = iy + p.y * ih;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Crop overlay
    if (activeTool === "crop") {
      const box = cropDragBox || cropBox;
      ctx.save();
      // Dark overlay
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(ix, iy, iw, ih);
      if (box) {
        const bx = ix + box.x * iw,
          by = iy + box.y * ih;
        const bw = box.w * iw,
          bh = box.h * ih;
        // Clear crop area
        ctx.clearRect(bx, by, bw, bh);
        ctx.drawImage(
          baseCanvas,
          box.x * baseCanvas.width,
          box.y * baseCanvas.height,
          box.w * baseCanvas.width,
          box.h * baseCanvas.height,
          bx,
          by,
          bw,
          bh,
        );
        // Border
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, bw, bh);
        // Rule-of-thirds grid
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 0.75;
        ctx.setLineDash([3, 3]);
        [1 / 3, 2 / 3].forEach((t) => {
          ctx.beginPath();
          ctx.moveTo(bx + t * bw, by);
          ctx.lineTo(bx + t * bw, by + bh);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(bx, by + t * bh);
          ctx.lineTo(bx + bw, by + t * bh);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        // Corner handles
        const hs = 8;
        [
          [bx, by],
          [bx + bw - hs, by],
          [bx, by + bh - hs],
          [bx + bw - hs, by + bh - hs],
        ].forEach(([hx, hy]) => {
          ctx.fillStyle = "white";
          ctx.fillRect(hx, hy, hs, hs);
        });
      } else {
        // No box yet: show dashed outline
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(ix + 4, iy + 4, iw - 8, ih - 8);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "13px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Drag to select crop area", ix + iw / 2, iy + ih / 2);
        ctx.textAlign = "left";
      }
      ctx.restore();
    }
  }, [
    baseCanvas,
    draftAdj,
    activeFilter,
    strokes,
    texts,
    brushColor,
    brushSize,
    drawTool,
    cropBox,
    cropDragBox,
    rotation,
    flipH,
    flipV,
    activeTool,
  ]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [draw]);

  // Canvas coords → image-normalised coords
  function toImageCoords(clientX, clientY) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !baseCanvas) return null;
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)),
      cos = Math.abs(Math.cos(rad));
    const rw = baseCanvas.width * cos + baseCanvas.height * sin;
    const rh = baseCanvas.width * sin + baseCanvas.height * cos;
    const cw = rect.width,
      ch = rect.height;
    const { x: ix, y: iy, w: iw, h: ih } = getImageRect(cw, ch, rw, rh);
    const cx = clientX - rect.left,
      cy = clientY - rect.top;
    return {
      x: (cx - ix) / iw,
      y: (cy - iy) / ih,
      inImage: cx >= ix && cx <= ix + iw && cy >= iy && cy <= iy + ih,
    };
  }

  // Pointer handlers
  const onPointerDown = (e) => {
    const pos = toImageCoords(e.clientX, e.clientY);
    if (!pos || !pos.inImage) return;

    if (activeTool === "draw") {
      isDrawing.current = true;
      currentStroke.current = [{ x: pos.x, y: pos.y }];
      canvasRef.current.setPointerCapture(e.pointerId);
      return;
    }

    if (activeTool === "text" && pendingText) {
      setTexts((prev) => [
        ...prev,
        { ...pendingText, x: pos.x, y: pos.y, id: Date.now() },
      ]);
      setPendingText(null);
      return;
    }

    if (activeTool === "crop") {
      cropDrag.current = {
        startX: pos.x,
        startY: pos.y,
        startBox: cropBox ? { ...cropBox } : null,
      };
      canvasRef.current.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e) => {
    const pos = toImageCoords(e.clientX, e.clientY);
    if (!pos) return;

    if (activeTool === "draw" && isDrawing.current) {
      currentStroke.current.push({ x: pos.x, y: pos.y });
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    if (activeTool === "crop" && cropDrag.current) {
      const { startX, startY } = cropDrag.current;
      let x = Math.min(startX, pos.x),
        y = Math.min(startY, pos.y);
      let w = Math.abs(pos.x - startX),
        h = Math.abs(pos.y - startY);
      // Enforce aspect ratio
      if (aspectRatio) {
        h = w / aspectRatio;
        if (y + h > 1) {
          h = 1 - y;
          w = h * aspectRatio;
        }
      }
      x = Math.max(0, Math.min(x, 1 - w));
      y = Math.max(0, Math.min(y, 1 - h));
      w = Math.max(0.05, Math.min(w, 1 - x));
      h = Math.max(0.05, Math.min(h, 1 - y));
      setCropDragBox({ x, y, w, h });
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }
  };

  const onPointerUp = () => {
    if (activeTool === "draw" && isDrawing.current) {
      isDrawing.current = false;
      if (currentStroke.current.length > 1) {
        setStrokes((prev) => [
          ...prev,
          {
            points: currentStroke.current,
            color: brushColor,
            size: brushSize,
            tool: drawTool,
          },
        ]);
      }
      currentStroke.current = [];
      return;
    }

    if (activeTool === "crop" && cropDragBox) {
      setCropBox(cropDragBox);
      setCropDragBox(null);
      cropDrag.current = null;
    }
  };

  // Cursor
  const cursor =
    activeTool === "draw"
      ? "crosshair"
      : activeTool === "crop"
        ? "crosshair"
        : activeTool === "text" && pendingText
          ? "text"
          : "default";

  return (
    <div ref={containerRef} className="w-full h-full" style={{ cursor }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}
