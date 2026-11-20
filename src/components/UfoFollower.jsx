import { useEffect, useRef } from 'react';

// A single fixed-position UFO. Scroll updates its transform directly with rAF
// to avoid rerendering the full dashboard for every scroll event.
export default function UfoFollower() {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previousScroll = window.scrollY;
    let drift = 0;

    function render() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scrollY = window.scrollY || 0;
      const mobile = vw < 680;
      const margin = mobile ? 75 : 110;
      const viewportRangeX = Math.max(0, vw - margin * 2);
      const viewportRangeY = Math.max(80, vh - (mobile ? 170 : 220));
      const travel = Math.max(1, vh * 0.95);

      // Scroll causes genuine travel down screen, then starts a new pass.
      // The craft also traverses horizontally in a smooth S-shaped orbit.
      const progress = ((scrollY / travel) % 1 + 1) % 1;
      const wave = (Math.sin(scrollY / (mobile ? 170 : 250) + 0.8) + 1) / 2;
      const x = margin + viewportRangeX * wave;
      const y = (mobile ? 85 : 110) + progress * viewportRangeY;

      // Give additional visual feedback while scrolling; no idle scroll listener work.
      const difference = scrollY - previousScroll;
      drift = drift * 0.65 + Math.max(-20, Math.min(20, difference)) * 0.35;
      previousScroll = scrollY;
      const tilt = reducedMotion.matches ? 0 : Math.max(-16, Math.min(16, drift * 0.7));
      node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${tilt.toFixed(1)}deg)`;
      frame = 0;
    }

    const update = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="ufo-follower" ref={nodeRef} aria-hidden="true">
      <div className="ufo-orbit-ring ring-one" />
      <div className="ufo-orbit-ring ring-two" />
      <div className="ufo-craft-wrap">
        <div className="ufo-beam" />
        <div className="ufo-craft">
          <span className="ufo-dome" />
          <span className="ufo-body" />
          <span className="ufo-lights" />
        </div>
      </div>
      <span className="ufo-spark ufo-spark-a" />
      <span className="ufo-spark ufo-spark-b" />
      <span className="ufo-spark ufo-spark-c" />
    </div>
  );
}
