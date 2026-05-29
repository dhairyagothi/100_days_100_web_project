import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
// NOTE (difficulty): Some OGL CDN builds don't export `Triangle` — use `Geometry`.
// Also shader outputs vary widely across GPUs; we keep a CSS fallback for visibility.
import {
  Renderer,
  Program,
  Mesh,
  Color,
  Geometry,
} from "https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.mjs";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p)
{
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
}

mat2 rotate(float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
    
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }
    
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    
    p = fract(p);
    p *= uDigitSize;
    
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    
    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

float onOff(float a, float b, float c)
{
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look)
{
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p){
    
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    
    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float middle = digit(p);
    
    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
    
    vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
    return baseColor;
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;

    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    
    vec2 p = uv * uScale;
    vec3 col = getColor(p);

    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }

    col *= uTint;
    col *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }

    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(h, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  // set a slight default > 1 so the glitch displacement is active
  glitchAmount = 1.25,
  flickerAmount = 1,
  noiseAmp = 0,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0.2,
  tint = "#a7ef9e",
  // mouse reactions can be expensive on touch devices; we'll auto-disable below
  mouseReact = true,
  mouseStrength = 0.2,
  // On mobile/touch, clamp DPR to 1 to reduce GPU load and memory usage
  dpr = (() => {
    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches)
    ) {
      return 1;
    }
    return Math.min(window.devicePixelRatio || 1, 2);
  })(),
  pageLoadAnimation = true,
  brightness = 1,
  className,
  style,
  ...rest
}) {
  const containerRef = useRef(null);
  const programRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const loadAnimationStartRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);

  const tintVec = useMemo(() => hexToRgb(tint), [tint]);
  const ditherValue = useMemo(
    () => (typeof dither === "boolean" ? (dither ? 1 : 0) : dither),
    [dither],
  );

  // basic touch/mobile detection
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches);
  // Cap max canvas size to avoid mobile GPU memory issues (e.g., 2048x2048)
  const MAX_CANVAS_SIZE = 8192;

  const handleMouseMove = useCallback((event) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // On small screens / mobile, reduce DPR and throttle frames to improve performance
    const smallScreen =
      typeof window !== "undefined" && window.innerWidth <= 720;
    const useDpr = dpr;
    let renderer;
    let gl;
    let fallbackCleanup = null;

    // Tech-themed animated canvas fallback — used when WebGL is unavailable
    const create2DFallback = (parent, tintColor = "#38bdf8") => {
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";
      const d = window.devicePixelRatio || 1;
      canvas.width = (parent.offsetWidth || 400) * d;
      canvas.height = (parent.offsetHeight || 300) * d;
      const ctx = canvas.getContext("2d");

      const TECH_TERMS = [
        "React",
        "JavaScript",
        "TypeScript",
        "CSS",
        "HTML",
        "Node.js",
        "REST API",
        "WebGL",
        "Canvas",
        "SVG",
        "Git",
        "npm",
        "ES6+",
        "DOM",
        "JSON",
        "Tailwind",
        "PWA",
        "UI/UX",
        "open source",
        "frontend",
      ];

      let tr = 56,
        tg = 189,
        tb = 248;
      const rgb = hexToRgb(tintColor);
      if (rgb) {
        tr = Math.round(rgb[0] * 255);
        tg = Math.round(rgb[1] * 255);
        tb = Math.round(rgb[2] * 255);
      }

      const particles = TECH_TERMS.map((term, i) => ({
        term,
        x: 0.05 + Math.random() * 0.9,
        y: Math.random(),
        opacity: 0.1 + Math.random() * 0.5,
        speed: 0.00008 + Math.random() * 0.00012,
        fontSize: (11 + Math.random() * 7) * d,
        phase: (i / TECH_TERMS.length) * Math.PI * 2,
      }));

      let rafId = 0;
      let last = 0;
      const fpsInterval = 1000 / 30;

      function draw(now) {
        rafId = requestAnimationFrame(draw);
        if (now - last < fpsInterval) return;
        last = now;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "rgba(4,8,18,0.3)");
        grad.addColorStop(1, "rgba(2,6,23,0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = `rgba(${tr},${tg},${tb},0.04)`;
        ctx.lineWidth = 1;
        const gs = Math.floor(h / 12);
        for (let gy = 0; gy < h; gy += gs) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
        const gsx = Math.floor(w / 16);
        for (let gx = 0; gx < w; gx += gsx) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }

        ctx.textBaseline = "middle";
        for (const p of particles) {
          p.y -= p.speed;
          if (p.y < -0.05) p.y = 1.05;
          const alpha =
            p.opacity * (0.55 + 0.45 * Math.sin(now * 0.001 + p.phase));
          ctx.font = `500 ${p.fontSize}px 'JetBrains Mono', 'Courier New', monospace`;
          ctx.fillStyle = `rgba(${tr},${tg},${tb},${alpha.toFixed(3)})`;
          ctx.fillText(p.term, p.x * w, p.y * h);
        }

        ctx.fillStyle = "rgba(255,255,255,0.015)";
        const sl = Math.max(3, Math.floor(h / 200)) * d;
        for (let sy = 0; sy < h; sy += sl * 2) {
          ctx.fillRect(0, sy, w, 1);
        }

        const glow = ctx.createRadialGradient(
          w * 0.5,
          h * 0.45,
          0,
          w * 0.5,
          h * 0.45,
          w * 0.45,
        );
        glow.addColorStop(0, `rgba(${tr},${tg},${tb},0.07)`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      parent.appendChild(canvas);
      rafId = requestAnimationFrame(draw);

      const resize = () => {
        const rd = window.devicePixelRatio || 1;
        canvas.width = (parent.offsetWidth || 400) * rd;
        canvas.height = (parent.offsetHeight || 300) * rd;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(parent);

      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        if (canvas.parentElement === parent) parent.removeChild(canvas);
      };
    };

    try {
      renderer = new Renderer({ dpr: useDpr, alpha: false }); // alpha: false for better mobile compositing
      rendererRef.current = renderer;
      gl = renderer.gl;
      if (!gl) throw new Error("No GL context");
      // Clamp renderer size via setSize() with clamped CSS dimensions to keep canvas, viewport, and renderer state in sync
      // This avoids direct gl.canvas width/height manipulation which can cause viewport/uniform desync
      const cssWidth = Math.max(
        1,
        container.clientWidth || container.offsetWidth || 1,
      );
      const cssHeight = Math.max(
        1,
        container.clientHeight || container.offsetHeight || 1,
      );
      renderer.setSize(cssWidth, cssHeight);
      const maxCssWidth = Math.max(1, Math.floor(MAX_CANVAS_SIZE / useDpr));
      const maxCssHeight = Math.max(1, Math.floor(MAX_CANVAS_SIZE / useDpr));
      const clampedCssWidth = Math.min(cssWidth, maxCssWidth);
      const clampedCssHeight = Math.min(cssHeight, maxCssHeight);
      renderer.setSize(clampedCssWidth, clampedCssHeight);
      gl.clearColor(0, 0, 0, 1);
      // iOS/Safari: force context loss handler for quirks
      gl.getExtension("WEBGL_lose_context");
      console.log("[hero-terminal] WebGL renderer initialized", {
        dpr: useDpr,
        width: gl.canvas.width,
        height: gl.canvas.height,
      });
    } catch (err) {
      console.warn(
        "[hero-terminal] WebGL init failed, falling back to tech animation canvas",
        err,
      );

      fallbackCleanup = create2DFallback(container, tint);
      return () => {
        if (typeof fallbackCleanup === "function") fallbackCleanup();
      };
    }

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    let program;
    try {
      // On mobile, force mediump precision for fragment shader for compatibility
      let fragShader = fragmentShader;
      if (isTouchDevice && !/precision highp float/.test(fragmentShader)) {
        fragShader = fragmentShader.replace(
          "precision mediump float;",
          "precision mediump float;",
        );
      }
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Color(
              gl.canvas.width,
              gl.canvas.height,
              gl.canvas.width / gl.canvas.height,
            ),
          },
          uScale: { value: scale },
          // Lower grid/digit density and noise on mobile for perf
          uGridMul: {
            value: new Float32Array(isTouchDevice ? [1.2, 0.8] : gridMul),
          },
          uDigitSize: {
            value: isTouchDevice ? Math.max(1, digitSize * 0.9) : digitSize,
          },
          uScanlineIntensity: { value: scanlineIntensity },
          uGlitchAmount: { value: glitchAmount },
          uFlickerAmount: { value: flickerAmount },
          uNoiseAmp: {
            value: isTouchDevice ? Math.max(0.2, noiseAmp * 0.7) : noiseAmp,
          },
          uChromaticAberration: { value: chromaticAberration },
          uDither: { value: ditherValue },
          uCurvature: { value: curvature },
          uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
          uMouse: {
            value: new Float32Array([
              smoothMouseRef.current.x,
              smoothMouseRef.current.y,
            ]),
          },
          uMouseStrength: { value: mouseStrength },
          uUseMouse: { value: mouseReact ? 1 : 0 },
          uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
          uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
          uBrightness: { value: brightness },
        },
      });
      programRef.current = program;
    } catch (err) {
      console.error(
        "[hero-terminal] Shader/program compile failed, falling back to 2D canvas",
        err,
      );
      fallbackCleanup = create2DFallback(container, tint);
      // if program creation failed, stop initialization early
      return () => {
        if (typeof fallbackCleanup === "function") fallbackCleanup();
      };
    }

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    gl.canvas.style.pointerEvents = "none";

    // Debounce resize to avoid resize observer loops on mobile Safari
    let resizeTimeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (renderer && renderer.setSize) {
          // Clamp CSS dimensions passed to setSize() to respect mobile GPU memory limits
          // This keeps canvas size, viewport, and renderer state in sync
          const cssWidth = Math.max(
            1,
            container.clientWidth || container.offsetWidth || 1,
          );
          const cssHeight = Math.max(
            1,
            container.clientHeight || container.offsetHeight || 1,
          );
          renderer.setSize(cssWidth, cssHeight);
          const maxCssWidth = Math.max(1, Math.floor(MAX_CANVAS_SIZE / useDpr));
          const maxCssHeight = Math.max(
            1,
            Math.floor(MAX_CANVAS_SIZE / useDpr),
          );
          const clampedCssWidth = Math.min(cssWidth, maxCssWidth);
          const clampedCssHeight = Math.min(cssHeight, maxCssHeight);
          renderer.setSize(clampedCssWidth, clampedCssHeight);
          program.uniforms.iResolution.value = new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          );
        }
      }, 100); // 100ms debounce
    };
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    // FPS throttling: full RAF on desktop, 30fps on mobile, pause if tab is hidden
    const minFrameInterval = smallScreen ? 1000 / 30 : 1000 / 60;
    let lastRenderTime = 0;
    let isTabVisible = true;
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const update = (now) => {
      rafRef.current = requestAnimationFrame(update);
      if (!isTabVisible) return; // Pause rendering if tab is hidden
      // throttle rendering to target FPS
      if (now - lastRenderTime < minFrameInterval) return;
      lastRenderTime = now;

      if (pageLoadAnimation && loadAnimationStartRef.current === 0) {
        loadAnimationStartRef.current = now;
      }

      if (!pause) {
        const elapsed = (now * 0.001 + timeOffsetRef.current) * timeScale;
        program.uniforms.iTime.value = elapsed;
        frozenTimeRef.current = elapsed;
      } else {
        program.uniforms.iTime.value = frozenTimeRef.current;
      }

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const animationDuration = 2000;
        const animationElapsed = now - loadAnimationStartRef.current;
        const progress = Math.min(animationElapsed / animationDuration, 1);
        program.uniforms.uPageLoadProgress.value = progress;
      }

      // update mouse uniform only if mouse interactions are enabled and device is not touch
      if (mouseReact && !isTouchDevice) {
        const dampingFactor = 0.08;
        const smoothMouse = smoothMouseRef.current;
        const mouse = mouseRef.current;
        smoothMouse.x += (mouse.x - smoothMouse.x) * dampingFactor;
        smoothMouse.y += (mouse.y - smoothMouse.y) * dampingFactor;

        const mouseUniform = program.uniforms.uMouse.value;
        mouseUniform[0] = smoothMouse.x;
        mouseUniform[1] = smoothMouse.y;
      }

      renderer.render({ scene: mesh });
    };

    rafRef.current = requestAnimationFrame(update);

    if (mouseReact && !isTouchDevice && fallbackCleanup === null)
      container.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (mouseReact && !isTouchDevice && fallbackCleanup === null)
        container.removeEventListener("mousemove", handleMouseMove);
      if (gl && gl.canvas && gl.canvas.parentElement === container)
        container.removeChild(gl.canvas);
      if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (typeof fallbackCleanup === "function") fallbackCleanup();
      loadAnimationStartRef.current = 0;
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [
    dpr,
    pause,
    timeScale,
    scale,
    gridMul,
    digitSize,
    scanlineIntensity,
    glitchAmount,
    flickerAmount,
    noiseAmp,
    chromaticAberration,
    ditherValue,
    curvature,
    tintVec,
    mouseReact,
    mouseStrength,
    pageLoadAnimation,
    brightness,
    handleMouseMove,
  ]);

  return React.createElement("div", {
    ref: containerRef,
    className: `faulty-terminal-container ${className || ""}`.trim(),
    style,
    ...rest,
  });
}

const host = document.getElementById("heroTerminal");

if (!host)
  console.error("[hero-terminal] mount target #heroTerminal not found");

if (host) {
  const root = createRoot(host);

  const getBreakpoint = () => {
    const screenWidth = window.innerWidth;
    return screenWidth <= 600
      ? "small"
      : screenWidth <= 1024
        ? "medium"
        : "large";
  };

  const getScreenSettings = () => {
    const breakpoint = getBreakpoint();
    const isSmallScreen = breakpoint === "small";
    const isMediumScreen = breakpoint === "medium";
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    return {
      scale: isSmallScreen ? 1.05 : isMediumScreen ? 1.3 : 1.5,
      gridMul: [isSmallScreen ? 1.6 : 2, 1],
      digitSize: isSmallScreen ? 1 : isMediumScreen ? 1.1 : 1.2,
      timeScale: 1,
      scanlineIntensity: isSmallScreen ? 0.8 : 1,
      flickerAmount: 1,
      noiseAmp: isSmallScreen ? 0.6 : 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0,
      tint: "#0066ff",
      mouseReact: !isCoarsePointer,
      mouseStrength: isSmallScreen ? 0.35 : 0.5,
      pageLoadAnimation: false,
      brightness: isSmallScreen ? 0.25 : 0.3,
      glitchAmount: 1,
      style: { width: "100%", height: "100%" },
    };
  };

  const getSizeKey = () => {
    const size = getBreakpoint();
    const pointer = window.matchMedia("(pointer: coarse)").matches
      ? "coarse"
      : "fine";
    return `${size}-${pointer}`;
  };

  const renderTerminal = () => {
    const terminalSettings = getScreenSettings();
    root.render(
      React.createElement(FaultyTerminal, {
        ...terminalSettings,
        pause: false,
      }),
    );
  };

  let sizeKey = getSizeKey();
  renderTerminal();

  const handleResize = () => {
    const nextKey = getSizeKey();
    if (nextKey === sizeKey) return;
    sizeKey = nextKey;
    renderTerminal();
  };

  window.addEventListener("resize", handleResize);
}
