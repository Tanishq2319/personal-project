"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;       // ms delay before the reveal animation starts
  direction?: "up" | "left" | "right" | "none";
  className?: string;
  threshold?: number;   // 0-1, how much of the element must be visible
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const initial: Record<string, string | number> = { opacity: 0 };
  if (direction === "up")    { initial.transform = "translateY(28px)"; }
  if (direction === "left")  { initial.transform = "translateX(-28px)"; }
  if (direction === "right") { initial.transform = "translateX(28px)"; }

  const style: React.CSSProperties = {
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translate(0,0)"
      : direction === "up"
        ? "translateY(28px)"
        : direction === "left"
          ? "translateX(-28px)"
          : direction === "right"
            ? "translateX(28px)"
            : "none",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
