import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 *  "Silk" — the hero's flowing background. One full-screen triangle and a
 *  domain-warped simplex-noise fragment shader (≈5 KB, no three.js).
 *  - Rendered at half resolution (the silk is soft, so nobody can tell).
 *  - Follows the cursor with a gentle swirl.
 *  - Palette eases toward a new industry's colours when they change.
 *  - Pauses when scrolled away or when the tab is hidden.
 * ────────────────────────────────────────────────────────────────────────── */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
out vec4 outColor;

// 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float a = 0.55;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    f += a * snoise(p);
    p = r * p * 1.9;
    a *= 0.45;
  }
  return f;
}

// Height of the silk "fabric" at p. q is the slow warp shared by neighbours.
float silk(vec2 p, vec2 q, float t) {
  return fbm(p * 0.62 + 1.35 * q + vec2(t * 0.35, -t * 0.2));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0) * 1.6;
  float t = uTime * 0.05;

  // Cursor: the fabric gently swirls and lifts around it.
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0) * 1.6;
  vec2 d = p - m;
  float infl = exp(-dot(d, d) * 1.6) * uMouseAmt;
  p += vec2(-d.y, d.x) * infl * 0.45;

  vec2 q = vec2(fbm(p * 0.45 + vec2(0.0, t)), fbm(p * 0.45 + vec2(5.2, -t * 0.8)));

  // Height + finite-difference normal → satin lighting.
  float e = 0.045;
  float h = silk(p, q, t);
  float hx = silk(p + vec2(e, 0.0), q, t);
  float hy = silk(p + vec2(0.0, e), q, t);
  vec3 n = normalize(vec3((h - hx) / e * 0.55, (h - hy) / e * 0.55, 1.0));
  vec3 L = normalize(vec3(-0.45, 0.55, 0.75));
  float diff = clamp(dot(n, L), 0.0, 1.0);
  float spec = pow(clamp(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 26.0);

  float k = h + 0.25 * q.x;
  vec3 col = mix(uC0, uC1, smoothstep(-0.55, 0.35, k));
  col = mix(col, uC2, smoothstep(0.05, 0.75, k + 0.15 * q.y) * 0.85);
  col = mix(col, uC3, smoothstep(0.45, 1.05, k + 0.2 * q.y) * 0.55);
  col *= 0.86 + 0.2 * diff;
  col += spec * 0.2 * vec3(1.0, 0.97, 0.93);
  col += infl * 0.04;

  // Calmer and lighter on the left, where the headline sits.
  float calm = smoothstep(0.66, 0.02, uv.x);
  col = mix(col, uC0, calm * 0.55);

  outColor = vec4(col, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log ?? "shader compile failed");
  }
  return s;
}

export default function SilkCanvas({
  palette,
  className,
  onFail,
  onReady,
}: {
  palette: [string, string, string, string];
  className?: string;
  onFail?: () => void;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(palette.map(hexToRgb));
  const callbacks = useRef({ onFail, onReady });

  useEffect(() => {
    target.current = palette.map(hexToRgb);
  }, [palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      callbacks.current.onFail?.();
      return;
    }

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
    } catch (err) {
      console.warn("[silk] falling back to CSS gradient:", err);
      callbacks.current.onFail?.();
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      amt: gl.getUniformLocation(program, "uMouseAmt"),
      c: [0, 1, 2, 3].map((i) => gl.getUniformLocation(program, `uC${i}`)),
    };

    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const current = target.current.map((c) => [...c] as [number, number, number]);
    const mouse = { x: 0.7, y: 0.45, tx: 0.7, ty: 0.45, amt: 0, tamt: 0 };
    let inside = false;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (inside) {
        mouse.tx = x;
        mouse.ty = y;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    let readyFired = false;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = (now - t0) / 1000;

      // Idle drift when the cursor is away, so the silk always breathes.
      if (!inside) {
        mouse.tx = 0.68 + Math.sin(t * 0.21) * 0.14;
        mouse.ty = 0.48 + Math.cos(t * 0.17) * 0.16;
      }
      mouse.tamt = inside ? 1 : 0.45;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      mouse.amt += (mouse.tamt - mouse.amt) * 0.03;

      for (let i = 0; i < 4; i++) {
        for (let k = 0; k < 3; k++) current[i][k] += (target.current[i][k] - current[i][k]) * 0.03;
        gl.uniform3fv(u.c[i], current[i]);
      }
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, t + 12.0);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.amt, mouse.amt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!readyFired) {
        readyFired = true;
        callbacks.current.onReady?.();
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);

    const onLost = (e: Event) => {
      e.preventDefault();
      callbacks.current.onFail?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
