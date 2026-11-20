import { useMemo } from 'react';

export default function Decorations({ variant = 'dashboard' }) {
  const isDashboard = variant === 'dashboard';
  const dotCount = isDashboard ? 18 : 10;
  const dots = useMemo(
    () => Array.from({ length: dotCount }, (_, i) => ({
      id: i,
      x: ((i * 37 + 13) % 97) + 1,
      y: ((i * 59 + 17) % 92) + 2,
      delay: (i % 8) * -0.72,
      duration: (isDashboard ? 6 : 8) + (i % 6) * 1.1,
      size: 2 + (i % 4) * 2,
    })),
    [dotCount, isDashboard]
  );

  return (
    <div className={`cosmic-ambient ambient-${variant}`} aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="floating-dot"
          style={{
            '--x': `${dot.x}%`,
            '--y': `${dot.y}%`,
            '--delay': `${dot.delay}s`,
            '--duration': `${dot.duration}s`,
            '--size': `${dot.size}px`,
          }}
        />
      ))}
      <span className="float-symbol fs1">✧</span>
      <span className="float-symbol fs2">✦</span>
      <span className="float-symbol fs3">✳</span>
    </div>
  );
}
