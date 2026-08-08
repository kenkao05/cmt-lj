// ============================================================
// LiquidEther background component — PLACEHOLDER
// ============================================================
// The PRD instructs that the full Three.js-based LiquidEther
// component source (from React Bits) should be pasted here
// verbatim, with only the default `colors` prop changed to:
//   colors = ['#D4AF37', '#FFFFFF', '#1a1a1a']
//
// That reference source was not included in the uploaded PRD or
// as a separate attachment in this conversation, so it could not
// be inserted automatically. Below is a minimal, working canvas-based
// fallback so the app builds and runs today. Replace this file with
// the real React Bits LiquidEther source (or your preferred fluid
// animation) whenever you have it — the color prop wiring below
// already matches what the rest of the app expects.
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import './LiquidEther.css';

export default function LiquidEther({
  colors = ['#D4AF37', '#FFFFFF', '#1a1a1a'],
  resolution = 0.3,
  iterationsPoisson = 16,
  iterationsViscous = 16,
  mouseForce = 20,
  cursorSize = 100,
  autoDemo = true,
  autoSpeed = 0.4,
  autoIntensity = 2,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    function resize() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      t += 0.01 * autoSpeed;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(
        w * (0.5 + 0.2 * Math.sin(t)),
        h * (0.5 + 0.2 * Math.cos(t * 0.8)),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.7
      );
      grad.addColorStop(0, colors[0] + '22');
      grad.addColorStop(0.5, colors[1] + '11');
      grad.addColorStop(1, colors[2] + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [colors, autoSpeed]);

  return (
    <div className="liquid-ether-container">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
