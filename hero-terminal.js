import React, { useCallback, useEffect, useMemo, useRef } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
// NOTE (difficulty): Some OGL CDN builds don't export `Triangle` — use `Geometry`.
// Also shader outputs vary widely across GPUs; we keep a CSS fallback for visibility.
import { Renderer, Program, Mesh, Color, Geometry } from 'https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.mjs';

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
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }

  const num = parseInt(h, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
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
  tint = '#a7ef9e',
  // mouse reactions can be expensive on touch devices; we'll auto-disable below
  mouseReact = true,
  mouseStrength = 0.2,
  dpr = Math.min(window.devicePixelRatio || 1, 2),
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
  const ditherValue = useMemo(() => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither), [dither]);

  // basic touch/mobile detection
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

  const handleMouseMove = useCallback(event => {
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
    const smallScreen = typeof window !== 'undefined' && window.innerWidth <= 720;
    const useDpr = smallScreen ? Math.min(dpr, 1) : dpr;
    let renderer;
    let gl;
    let fallbackCleanup = null;

    try {
      renderer = new Renderer({ dpr: useDpr });
      rendererRef.current = renderer;
      gl = renderer.gl;
      if (!gl) throw new Error('No GL context');
      gl.clearColor(0, 0, 0, 1);
      console.log('[hero-terminal] WebGL renderer initialized', { dpr: useDpr, width: gl.canvas.width, height: gl.canvas.height });
    } catch (err) {
      console.warn('[hero-terminal] WebGL init failed, falling back to 2D canvas', err);
      // WebGL failed — create a lightweight 2D fallback canvas to keep the hero visible
      const create2DFallback = (parent, tintColor = '#38bdf8') => {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        canvas.width = parent.offsetWidth * (window.devicePixelRatio || 1);
        canvas.height = parent.offsetHeight * (window.devicePixelRatio || 1);
        const ctx = canvas.getContext('2d');

        let rafId = 0;
        let last = 0;
        const fpsInterval = 1000 / 30; // throttle to 30fps

        function draw(now) {
          rafId = requestAnimationFrame(draw);
          if (now - last < fpsInterval) return;
          last = now;
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // background gradient
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, 'rgba(4,8,18,0.25)');
          grad.addColorStop(1, 'rgba(2,6,23,0.8)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // subtle tint overlay
          ctx.fillStyle = tintColor;
          ctx.globalAlpha = 0.06 + 0.02 * Math.sin(now * 0.002);
          ctx.fillRect(0, 0, w, h);
          ctx.globalAlpha = 1;

          // scanlines
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          const step = Math.max(3, Math.floor(h / 200));
          for (let y = 0; y < h; y += step * (window.devicePixelRatio || 1)) {
            ctx.fillRect(0, y, w, 1);
          }
        }

        parent.appendChild(canvas);

        // visible label so users can see fallback is active
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.right = '8px';
        label.style.top = '8px';
        label.style.padding = '4px 8px';
        label.style.background = 'rgba(0,0,0,0.45)';
        label.style.color = '#cfefff';
        label.style.fontFamily = 'JetBrains Mono, monospace';
        label.style.fontSize = '11px';
        label.style.borderRadius = '6px';
        label.style.zIndex = '2';
        label.style.pointerEvents = 'none';
        label.textContent = 'Terminal: fallback';
        parent.appendChild(label);
        rafId = requestAnimationFrame(draw);

        const resize = () => {
          canvas.width = parent.offsetWidth * (window.devicePixelRatio || 1);
          canvas.height = parent.offsetHeight * (window.devicePixelRatio || 1);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);

        return () => {
          cancelAnimationFrame(rafId);
          ro.disconnect();
          if (canvas.parentElement === parent) parent.removeChild(canvas);
          if (label.parentElement === parent) parent.removeChild(label);
        };
      };

      fallbackCleanup = create2DFallback(container, tint);
      return () => {
        if (typeof fallbackCleanup === 'function') fallbackCleanup();
      };
    }

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });

    let program;
    try {
      program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uMouse: { value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y]) },
        uMouseStrength: { value: mouseStrength },
        uUseMouse: { value: mouseReact ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness }
      }
      });
      programRef.current = program;
    } catch (err) {
      console.error('[hero-terminal] Shader/program compile failed, falling back to 2D canvas', err);
      fallbackCleanup = create2DFallback(container, tint);
      // if program creation failed, stop initialization early
      return () => {
        if (typeof fallbackCleanup === 'function') fallbackCleanup();
      };
    }

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    gl.canvas.style.pointerEvents = 'none';

    const resize = () => {
      if (renderer && renderer.setSize) {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        program.uniforms.iResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    // FPS throttling: full RAF on desktop, limited on mobile
    const minFrameInterval = smallScreen ? (1000 / 30) : (1000 / 60);
    let lastRenderTime = 0;

    const update = now => {
      rafRef.current = requestAnimationFrame(update);

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

    if (mouseReact && !isTouchDevice && fallbackCleanup === null) container.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      if (mouseReact && !isTouchDevice && fallbackCleanup === null) container.removeEventListener('mousemove', handleMouseMove);
      if (gl && gl.canvas && gl.canvas.parentElement === container) container.removeChild(gl.canvas);
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (typeof fallbackCleanup === 'function') fallbackCleanup();
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
    handleMouseMove
  ]);

  return React.createElement('div', {
    ref: containerRef,
    className: `faulty-terminal-container ${className || ''}`.trim(),
    style,
    ...rest
  });
}

const host = document.getElementById('heroTerminal');

if (!host) console.error('[hero-terminal] mount target #heroTerminal not found');

if (host) {
  const root = createRoot(host);
  root.render(
    React.createElement(FaultyTerminal, {
      scale: 1.5,
      gridMul: [2, 1],
      digitSize: 1.2,
      timeScale: 1,
      pause: false,
      scanlineIntensity: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0,
      tint: '#0066ff',
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: false,
      brightness: 0.3,
      glitchAmount: 1,
      style: { width: '100%', height: '100%' }
    })
  );
}
