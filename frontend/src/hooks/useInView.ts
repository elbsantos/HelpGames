import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  margin?: string;
  triggerOnce?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.1,
    margin = "0px",
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasBeenInView(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else {
          if (!triggerOnce) {
            setIsInView(false);
          }
        }
      },
      {
        threshold,
        rootMargin: margin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, margin, triggerOnce]);

  return {
    ref,
    isInView: triggerOnce ? hasBeenInView : isInView,
  };
}
