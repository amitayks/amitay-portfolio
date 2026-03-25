import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  if (reducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        {text}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isVisible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 0.35,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
