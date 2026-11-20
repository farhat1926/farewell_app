import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Hyperspace from './Hyperspace';

export default function EnvelopeIntro({ onComplete }) {
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);
  const reduced = useReducedMotion();
  const started = phase !== 'idle';
  const opening = started;
  const portal = phase === 'portal' || phase === 'dive';
  const dive = phase === 'dive';

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const finish = useCallback(() => onComplete(), [onComplete]);

  function begin() {
    if (started) return;
    if (reduced) {
      onComplete();
      return;
    }

    setPhase('opening');
    timers.current.push(setTimeout(() => setPhase('portal'), 1380));
    timers.current.push(setTimeout(() => {
      setPhase('dive');
    }, 2280));

  }

  return (
    <motion.section
      className={`envelope-stage screen-overlay phase-${phase}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.28 } }}
    >
      <div className="stage-grid" aria-hidden="true" />

      <motion.div
        className="intro-topline"
        animate={{ opacity: started ? 0 : 1, y: started ? -28 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="eyebrow"><span className="signal-dot" /> PRIVATE DIMENSIONAL INVITATION</span>
        <h2>ENTER THE <span>FAREWELL NIGHT.</span></h2>
        <p>Open the folds, reveal the portal, and step into the evening.</p>
      </motion.div>

      <button
        type="button"
        className={`envelope-hitarea ${dive ? 'is-diving' : ''}`}
        onClick={begin}
        disabled={started}
        aria-label="Buka undangan futuristik"
      >
        <div className={`portal-envelope ${opening ? 'is-opening' : ''} ${portal ? 'is-portal' : ''}`}>
          <div className="envelope-aura" />
          <div className="portal-core-glow" />

          <div className="fold-base">
            <span className="fold-grid" />
            <span className="fold-center-mark" />
          </div>

          <div className="fold-panel fold-top">
            <span className="panel-inner" />
          </div>
          <div className="fold-panel fold-right">
            <span className="panel-inner" />
          </div>
          <div className="fold-panel fold-bottom">
            <span className="panel-inner" />
          </div>
          <div className="fold-panel fold-left">
            <span className="panel-inner" />
          </div>

          <div className="portal-frame">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />

            <div className="portal-hole">
              <div className="portal-rings" />
              <div className="portal-spiral" />
              <div className="portal-vortex" />
            </div>
          </div>
        </div>

      </button>

      {dive && <Hyperspace active onFinish={finish} />}

      <motion.div
        className="intro-bottom"
        animate={{ opacity: started ? 0 : 1, y: started ? 28 : 0 }}
        transition={{ duration: 0.32 }}
      >
        <button className="enter-button" type="button" onClick={begin} disabled={started}>
          <Sparkles size={17} /> OPEN THE PORTAL <ArrowUpRight size={17} />
        </button>
        <p>CLICK THE FOLDED ENVELOPE TO BEGIN <span className="blink">_</span></p>
      </motion.div>

      <div className="stage-corner stage-corner-l">EST. 2026 / FUTURISTIC EXPERIENCE</div>
      <div className="stage-corner stage-corner-r">002 — 004</div>
    </motion.section>
  );
}
