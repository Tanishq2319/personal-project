// Deterministic stars: seeded so SSR and client render identically (no hydration mismatch).
// ponytail: CSS twinkle only; swap for canvas/three.js if we ever want cursor-reactive particles.
const rand = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const STARS = Array.from({ length: 90 }, (_, i) => ({
  left: rand(i + 1) * 100,
  top: rand(i + 101) * 100,
  size: 1 + rand(i + 201) * 1.6,
  delay: rand(i + 301) * 6,
  opacity: 0.25 + rand(i + 401) * 0.5,
}));

export default function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${6 + s.delay}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.75}}
        @media (prefers-reduced-motion: reduce){span{animation:none!important}}`}</style>
    </div>
  );
}
