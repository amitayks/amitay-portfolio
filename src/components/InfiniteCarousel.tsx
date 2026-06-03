import { useRef, useEffect, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";

interface InfiniteCarouselProps<T> {
  items: T[];
  direction?: "left" | "right";
  speed?: number;
  renderCard: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function InfiniteCarousel<T>({
  items,
  direction = "right",
  speed = 35,
  renderCard,
  className,
}: InfiniteCarouselProps<T>) {
  const x = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const velocity = useRef(0);
  const reducedMotion = useReducedMotion();

  const tripled = [...items, ...items, ...items];

  // Measure the visual repeat period. We anchor on the offsetLeft delta
  // between the first card of copy 1 and the first card of copy 2 — that
  // is exactly the distance the wrap needs to snap by, and includes any
  // subpixel rounding the browser applies to the gap. Summing
  // `offsetWidth + 12` is unsafe: it drifts whenever the actual gap
  // differs from 12px (root-font scale, breakpoint changes, subpixel
  // rendering), and the drift accumulates into a visible jump every loop.
  useEffect(() => {
    if (!innerRef.current || items.length === 0) return;

    const measure = () => {
      const inner = innerRef.current;
      if (!inner) return;
      const cards = inner.children;
      if (cards.length <= items.length) return;
      const first = cards[0] as HTMLElement;
      const startOfCopy2 = cards[items.length] as HTMLElement;
      const width = startOfCopy2.offsetLeft - first.offsetLeft;
      if (width > 0) setSingleSetWidth(width);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  // Wrap x into [-singleSetWidth, 0] range using modulo
  const wrap = useCallback(
    (val: number): number => {
      if (singleSetWidth === 0) return val;
      const mod = ((val % singleSetWidth) + singleSetWidth) % singleSetWidth;
      return mod - singleSetWidth;
    },
    [singleSetWidth]
  );

  // Single animation loop handles everything: auto-scroll, momentum, and wrapping
  useAnimationFrame((_, delta) => {
    if (singleSetWidth === 0 || reducedMotion) return;

    const dt = delta / 1000;
    let dx = 0;

    if (isDragging.current) {
      // During drag: framer-motion moves x directly, we just wrap
      x.jump(wrap(x.get()));
      return;
    }

    // Apply user momentum (decays with friction)
    if (Math.abs(velocity.current) > 0.5) {
      dx += velocity.current * dt;
      velocity.current *= 0.94; // Friction — 6% decay per frame
    } else {
      velocity.current = 0;
      // Auto-scroll only when momentum has settled
      const currentSpeed = isHovered.current ? speed * 0.5 : speed;
      const dirMultiplier = direction === "right" ? -1 : 1;
      dx += currentSpeed * dt * dirMultiplier;
    }

    x.jump(wrap(x.get() + dx));
  });

  // Initialize position
  useEffect(() => {
    if (direction === "left" && singleSetWidth > 0) {
      x.jump(-singleSetWidth);
    }
  }, [direction, singleSetWidth, x]);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    velocity.current = 0;
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    isDragging.current = false;
    velocity.current = info.velocity.x;
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "w-full overflow-hidden py-16",
        // Fixed min-height matching card sizes (1:1 aspect) to prevent layout shift on image load
        "min-h-[212px] sm:min-h-[252px] lg:min-h-[332px]",
        className
      )}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      <motion.div
        ref={innerRef}
        className="flex gap-3 cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -99999, right: 99999 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {tripled.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {renderCard(item, index % items.length)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
