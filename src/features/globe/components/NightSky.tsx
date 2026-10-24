import { useMemo } from 'react';

/** Deep dusk sky behind the globe: indigo fading to maroon, a warm glow and softly twinkling stars. */
export function NightSky() {
  const stars = useMemo(() => {
    // Small deterministic generator so the sky looks the same on every visit.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    return Array.from({ length: 140 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: rand() < 0.85 ? 1 : 2,
      opacity: 0.25 + rand() * 0.6,
      delay: rand() * 6,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b16] via-[#1b1220] to-[#3a160c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_67%_52%,rgba(232,137,43,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_110%,rgba(207,69,32,0.35),transparent_70%)]" />
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute animate-twinkle rounded-pill bg-cream"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2a1009]/80 to-transparent" />
    </div>
  );
}
