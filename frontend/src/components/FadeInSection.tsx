import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import "@/styles/fade-in.css";

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export function FadeInSection({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  className = "",
}: FadeInSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    margin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`fade-in-section ${className}`}
      style={{
        "--fade-in-duration": `${duration}ms`,
        "--fade-in-delay": `${delay}ms`,
        "--fade-in-direction": direction,
        opacity: isInView ? 1 : 0,
        animation: isInView
          ? `fadeIn${direction.charAt(0).toUpperCase() + direction.slice(1)} var(--fade-in-duration) ease-out var(--fade-in-delay) forwards`
          : "none",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
