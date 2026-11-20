import { useEffect, useRef } from 'react';

// One bounded-resolution canvas; no per-frame React state or DOM updates.
export default function Hyperspace({ active, onFinish }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) { onFinish(); return; }
    let frame, w, h, radius;
    const duration = 1450;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25, 1000 / Math.max(innerWidth, innerHeight));
      w = canvas.width = Math.max(1, Math.round(innerWidth * ratio));
      h = canvas.height = Math.max(1, Math.round(innerHeight * ratio));
      radius = Math.hypot(w, h) * .54;
    };
    resize();
    window.addEventListener('resize', resize);
    const count = innerWidth < 650 ? 75 : 130;
    const stars = Array.from({ length: count }, (_, i) => ({ a: i * 2.399963, z: (i * .6180339) % 1, tint: i % 3 }));
    const start = performance.now();
    function draw(now) {
      const t = Math.min(1, (now - start) / duration);
      const travel = .28 * t + 1.5 * t * t;
      const cx = w / 2, cy = h / 2;
      ctx.fillStyle = '#030610'; ctx.fillRect(0, 0, w, h);
      // Rotating logarithmic spiral arms, sampled once per frame.
      for (let arm = 0; arm < 4; arm++) {
        ctx.beginPath();
        for (let j = 0; j <= 76; j++) {
          const u = j / 76;
          const r = radius * (.024 + Math.pow(u, 2.1) * 1.5);
          const theta = arm * Math.PI / 2 + u * 12 - t * 5.2;
          const x = cx + Math.cos(theta) * r, y = cy + Math.sin(theta) * r;
          if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = arm % 2 ? '#7967de65' : '#59e5e86a'; ctx.lineWidth = Math.max(1, w / 600); ctx.stroke();
      }
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const z = (s.z + travel) % 1;
        const prev = Math.max(0, z - (.025 + .17 * t * t));
        const r = radius * Math.pow(z, 2.4) * 1.35;
        const oldR = radius * Math.pow(prev, 2.4) * 1.35;
        const a = s.a + 2.5 * z - t * 4.8;
        const oldA = s.a + 2.5 * prev - t * 4.8 + .09;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(oldA) * oldR, cy + Math.sin(oldA) * oldR);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.lineWidth = .5 + z * 2; ctx.strokeStyle = ['#affff5','#7da9ff','#c0a2ff'][s.tint]; ctx.globalAlpha = Math.min(1, z * 1.6); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (t > .78) { ctx.fillStyle = `rgba(6,10,22,${(t-.78)/.22})`; ctx.fillRect(0,0,w,h); }
      if (t < 1) frame = requestAnimationFrame(draw); else onFinish();
    }
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, [active, onFinish]);
  return <canvas ref={ref} className="hyperspace-canvas" aria-hidden="true" />;
}
