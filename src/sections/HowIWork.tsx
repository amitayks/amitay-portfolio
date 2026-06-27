import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { LanguageTransition } from "@/components/LanguageTransition";

/* ── Serpentine geometry ─────────────────────────────────────────────
   A single continuous vertical sine wave (no corners) that flows
   top→bottom while swaying left/right around a center axis.
   x(y) = cx − amplitude · cos(2π·(y − y0)/wavelength)
   The −cos phase puts node 1 at the LEFT extreme at y = y0, then
   extremes alternate right/left every half-period.
*/
const CX = 300; // center axis (viewBox is 600 wide)
const AMPLITUDE = 210; // x ∈ [90, 510]
const WAVELENGTH = 640; // λ; half-period H = 320
const Y0 = 120; // first node / top padding
const HALF_PERIODS = 4; // 5 nodes ⇒ 4 gaps
const SAMPLES_PER_HALF = 24; // polyline density per half-period

const VIEWBOX = "0 0 600 1520"; // tall + narrow

interface NodeDef {
  key: string;
  fallback: string;
  x: number;
  y: number;
}

/* Builds the sine path as a dense polyline; smooth at this density and
   exact for getPointAtLength node snapping (same fn drives buildNodes). */
function buildSinePath(
  cx: number,
  amplitude: number,
  wavelength: number,
  halfPeriods: number,
  y0: number,
  samplesPerHalf: number,
): string {
  const yEnd = y0 + halfPeriods * (wavelength / 2);
  const total = halfPeriods * samplesPerHalf;
  const cmds: string[] = [];
  for (let i = 0; i <= total; i++) {
    const y = y0 + (i / total) * (yEnd - y0);
    const x = cx - amplitude * Math.cos((2 * Math.PI * (y - y0)) / wavelength);
    cmds.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return cmds.join(" ");
}

// 5-step journey — merged from the prior 13. Labels are translatable.
const NODE_LABELS: Pick<NodeDef, "key" | "fallback">[] = [
  { key: "journey.node1.label", fallback: "First Contact" },
  { key: "journey.node2.label", fallback: "Scope & Proposal" },
  { key: "journey.node3.label", fallback: "Build" },
  { key: "journey.node4.label", fallback: "Iterate" },
  { key: "journey.node5.label", fallback: "Your Product, Live" },
];

/* Places each node at an alternating wave extreme using the SAME sine
   math as the path, so coordinates always sit exactly on the curve. */
function buildNodes(
  cx: number,
  amplitude: number,
  wavelength: number,
  y0: number,
): NodeDef[] {
  const H = wavelength / 2;
  return NODE_LABELS.map((label, i) => {
    const y = y0 + i * H;
    const x = cx - amplitude * Math.cos((2 * Math.PI * (y - y0)) / wavelength);
    return { ...label, x, y };
  });
}

const NODES: NodeDef[] = buildNodes(CX, AMPLITUDE, WAVELENGTH, Y0);
const SERPENTINE_PATH = buildSinePath(
  CX,
  AMPLITUDE,
  WAVELENGTH,
  HALF_PERIODS,
  Y0,
  SAMPLES_PER_HALF,
);

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

      {/* Serpentine container — narrow ribbon, gutters hold the side labels */}
      <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md">
        {/* SVG — single path, identical on all screen sizes */}
        <svg
          viewBox={VIEWBOX}
          className="relative z-10 w-full h-auto"
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
            d={SERPENTINE_PATH}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />

          {/* Foreground — draws with scroll, colored gradient */}
          <motion.path
            ref={pathRef}
            d={SERPENTINE_PATH}
            stroke="url(#slalom-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={pathLength || undefined}
            style={{ strokeDashoffset: dashOffset, willChange: "stroke-dashoffset" }}
          />
        </svg>

        {/* Nodes overlay — bulb + label grouped just outside the curve.
            Sits behind the line (svg has z-10) so bulbs pop out from
            behind it, sliding outward as the scroll-line reaches them. */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {NODES.map((node, i) => {
            const state = nodeStates[i];
            const isLit = state !== "unlit";
            const isFinal = i === NODES.length - 1;
            const label = t(node.key, node.fallback);
            const leftPct = (node.x / 600) * 100;
            const topPct = (node.y / 1520) * 100;
            // Outer side of each bump: left-extreme groups flow left, right-extreme right
            const onLeft = node.x < CX;
            const dir = onLeft ? -1 : 1; // outward direction

            return (
              <div
                key={node.key}
                className="absolute"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {/* Group anchored to the curve point, laid out toward the outer side.
                    flex-row-reverse keeps the bulb nearest the line for left bumps. */}
                <div
                  className={`absolute top-1/2 flex items-center gap-2 ${onLeft ? "flex-row-reverse" : "flex-row"}`}
                  style={{
                    transform: onLeft
                      ? "translate(calc(-100% - 10px), -50%)"
                      : "translate(10px, -50%)",
                  }}
                >
                  {/* Bulb — pops into existence from behind the line, sliding outward */}
                  <motion.div
                    initial={false}
                    animate={
                      isLit
                        ? { scale: 1, opacity: 1, x: 0 }
                        : { scale: 0, opacity: 0, x: -dir * 12 }
                    }
                    transition={{ type: "spring", stiffness: 480, damping: 16, mass: 0.6 }}
                  >
                    <BulbIcon state={state} isFinal={isFinal} />
                  </motion.div>

                  {/* Label — beside the bulb, on the outer side */}
                  <LanguageTransition inline>
                    <span
                      className={`
                        font-body font-light text-[8px] md:text-xs whitespace-nowrap
                        transition-all duration-500
                        ${onLeft ? "text-right" : "text-left"}
                        ${isLit
                          ? state === "active"
                            ? "opacity-100 text-white"
                            : "opacity-60 text-white/60"
                          : "opacity-0 text-white/30"
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
