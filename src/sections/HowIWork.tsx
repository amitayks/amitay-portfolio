import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { LanguageTransition } from "@/components/LanguageTransition";

/* ── Node definitions ───────────────────────────────────────────────── */

interface NodeDef {
  key: string;
  fallback: string;
  x: number;
  y: number;
}

// Coordinates match the SVG viewBox (0 0 1000 780)
// Positioned ON the horizontal path segments
const NODES: NodeDef[] = [
  // Row 1 — left→right (y=120)
  { key: "journey.node1.label", fallback: "First Contact",     x: 80,  y: 120 },
  { key: "journey.node2.label", fallback: "Scoping Call",      x: 360, y: 120 },
  { key: "journey.node3.label", fallback: "Proposal & Cost",   x: 640, y: 120 },
  { key: "journey.node4.label", fallback: "Architecture Plan", x: 920, y: 120 },
  // Row 2 — right→left (y=340)
  { key: "journey.node5.label", fallback: "Kickoff",           x: 920, y: 340 },
  { key: "journey.node6.label", fallback: "First Build",       x: 640, y: 340 },
  { key: "journey.node7.label", fallback: "Weekly Check-ins",  x: 360, y: 340 },
  { key: "journey.node8.label", fallback: "Iterations",        x: 80,  y: 340 },
  // Row 3 — left→right (y=560)
  { key: "journey.node9.label",  fallback: "Final Review",     x: 80,  y: 560 },
  { key: "journey.node10.label", fallback: "Deployment",       x: 360, y: 560 },
  { key: "journey.node11.label", fallback: "Handoff",          x: 700, y: 560 },
  // Row 4 — right→left (y=720)
  { key: "journey.node12.label", fallback: "Post-Launch",         x: 700, y: 720 },
  { key: "journey.node13.label", fallback: "Your Product, Live",  x: 300, y: 720 },
];

/* ── SVG slalom path ─────────────────────────────────────────────────
   4 rows connected by smooth arcs.
   Row 1 L→R, arc down, Row 2 R→L, arc down, Row 3 L→R, arc down, Row 4 R→L
*/
const SLALOM_PATH = [
  "M 80 120",
  "L 920 120",
  "Q 975 120 975 230",
  "Q 975 340 920 340",
  "L 80 340",
  "Q 25 340 25 450",
  "Q 25 560 80 560",
  "L 700 560",
  "Q 755 560 755 640",
  "Q 755 720 700 720",
  "L 300 720",
].join(" ");

const VIEWBOX = "0 0 1000 780";

/* ── Lightbulb SVG ──────────────────────────────────────────────────── */

type NodeState = "unlit" | "active" | "passed";

function BulbIcon({ state, isFinal }: { state: NodeState; isFinal?: boolean }) {
  const isLit = state !== "unlit";
  const isActive = state === "active";

  return (
    <div className={`relative ${isFinal ? "w-7 h-9 md:w-9 md:h-12" : "w-5 h-7 md:w-7 md:h-9"}`}>
      {/* Glow behind bulb when lit */}
      {isLit && (
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-700 ${
            isActive
              ? isFinal
                ? "opacity-100"
                : "opacity-80"
              : "opacity-40"
          }`}
          style={{
            background: isFinal && isActive
              ? "radial-gradient(circle, rgba(255,210,120,0.6) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
            transform: "scale(3)",
            filter: isActive ? "blur(8px)" : "blur(4px)",
          }}
        />
      )}
      <svg viewBox="0 0 24 34" fill="none" className="w-full h-full relative z-10">
        {/* Glass bulb */}
        <path
          d="M12 2C7 2 3 6.5 3 11.5c0 3.5 2 6 4 8V23h10v-3.5c2-2 4-4.5 4-8C21 6.5 17 2 12 2z"
          fill={isLit ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.03)"}
          stroke={isLit ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"}
          strokeWidth="1"
          className="transition-all duration-500"
        />
        {/* Screw base */}
        <rect x="7" y="23" width="10" height="2" rx="0.5"
          fill={isLit ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)"}
          className="transition-all duration-500" />
        <rect x="7.5" y="25" width="9" height="1.5" rx="0.5"
          fill={isLit ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.03)"}
          className="transition-all duration-500" />
        <rect x="8.5" y="26.5" width="7" height="1.5" rx="0.75"
          fill={isLit ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.02)"}
          className="transition-all duration-500" />
        {/* Filament — only when lit */}
        {isLit && (
          <path
            d="M9.5 11 Q11 7.5 12 11 Q13 14.5 14.5 11"
            stroke={isActive ? "rgba(255,230,170,0.9)" : "rgba(255,230,170,0.4)"}
            strokeWidth="0.8"
            fill="none"
            className="transition-all duration-500"
          />
        )}
      </svg>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export function HowIWork() {
  const { t } = useSiteText();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [pathLength, setPathLength] = useState(0);
  const [nodeFractions, setNodeFractions] = useState<number[]>([]);
  const [nodeStates, setNodeStates] = useState<NodeState[]>(() => NODES.map(() => "unlit"));

  /* Measure SVG path and compute each node's fraction along it */
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLen = path.getTotalLength();
    setPathLength(totalLen);

    // For each node, find the closest point on the path by sampling
    const fracs = NODES.map((node) => {
      let bestLen = 0;
      let bestDist = Infinity;
      const samples = 500;
      for (let i = 0; i <= samples; i++) {
        const len = (i / samples) * totalLen;
        const pt = path.getPointAtLength(len);
        const dist = Math.hypot(pt.x - node.x, pt.y - node.y);
        if (dist < bestDist) {
          bestDist = dist;
          bestLen = len;
        }
      }
      return bestLen / totalLen;
    });

    setNodeFractions(fracs);
  }, []);

  /* Scroll tracking — starts when section top reaches viewport center */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  /* Map scroll → line draw progress (0-1) */
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* Dash offset: line draws from 0% to 100% as progress goes 0→1 */
  const dashOffset = useTransform(progress, (p) => {
    if (pathLength === 0) return 99999; // hide until measured
    return pathLength * (1 - Math.max(0, Math.min(1, p)));
  });

  /* Update node states — perfectly synced with line progress */
  useMotionValueEvent(progress, "change", (p) => {
    if (nodeFractions.length === 0) return;

    setNodeStates(
      nodeFractions.map((frac, i) => {
        if (p < frac) return "unlit";
        // Check if this is the frontier node (last lit one)
        const nextFrac = nodeFractions[i + 1];
        if (nextFrac === undefined || p < nextFrac) return "active";
        return "passed";
      })
    );
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 px-4 md:px-16 lg:px-24"
    >
      <div className="text-center mb-16">
        <SectionBadge>
          <LanguageTransition inline>
            {t("journey.badge", "How I Work")}
          </LanguageTransition>
        </SectionBadge>
        <SectionHeading>
          <LanguageTransition inline>
            {t("journey.heading", "Straightforward process. No surprises.")}
          </LanguageTransition>
        </SectionHeading>
      </div>

      {/* Slalom container */}
      <div className="relative max-w-5xl mx-auto">
        {/* SVG — single path, identical on all screen sizes */}
        <svg
          viewBox={VIEWBOX}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          <defs>
            <linearGradient id="slalom-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(180,210,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,200,120,0.7)" />
            </linearGradient>
          </defs>

          {/* Background track — always fully visible (comics outline) */}
          <path
            d={SLALOM_PATH}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />

          {/* Foreground — draws with scroll, colored gradient */}
          <motion.path
            ref={pathRef}
            d={SLALOM_PATH}
            stroke="url(#slalom-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={pathLength || undefined}
            style={{ strokeDashoffset: dashOffset, willChange: "stroke-dashoffset" }}
          />
        </svg>

        {/* Nodes overlay — bulb above line, label below line */}
        <div className="absolute inset-0 pointer-events-none">
          {NODES.map((node, i) => {
            const state = nodeStates[i];
            const isFinal = i === NODES.length - 1;
            const label = t(node.key, node.fallback);
            const leftPct = (node.x / 1000) * 100;
            const topPct = (node.y / 780) * 100;

            return (
              <div
                key={node.key}
                className="absolute"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {/* Bulb — floating above the line */}
                <div
                  className="absolute left-1/2"
                  style={{ transform: "translate(-50%, -105%)" }}
                >
                  <BulbIcon state={state} isFinal={isFinal} />
                </div>

                {/* Label — below the line */}
                <div
                  className="absolute left-1/2"
                  style={{ transform: "translate(-50%, 6px)" }}
                >
                  <LanguageTransition inline>
                    <span
                      className={`
                        font-body font-light text-[8px] md:text-xs whitespace-nowrap
                        transition-all duration-500
                        ${state === "unlit"
                          ? "opacity-20 text-white/30"
                          : state === "active"
                            ? "opacity-100 text-white"
                            : "opacity-60 text-white/60"
                        }
                      `}
                    >
                      {label}
                    </span>
                  </LanguageTransition>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
