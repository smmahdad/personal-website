"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { playCopy } from "@/content/lab";
import {
  clearPlay,
  createPlay,
  flipGravity,
  popAt,
  popOldest,
  resizePlay,
  setGravityAngle,
  spawnBlob,
  spawnLetter,
  spray,
  stepPlay,
  type PlaySim,
} from "@/lib/play";
import { LabMark } from "./LabMark";
import "./play.css";

const TITLE = ["p", "l", "a", "y"] as const;
const BUTTONS = [
  playCopy.press,
  playCopy.again,
  playCopy.hey,
  playCopy.dont,
  playCopy.fine,
] as const;

function subscribeMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  sim: PlaySim,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);

  const worm = sim.worm;
  if (worm.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = worm.length - 1; i > 0; i -= 1) {
      const a = worm[i];
      const b = worm[i - 1];
      if (!a || !b) continue;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `hsla(${(i * 22 + 300) % 360} 90% 58% / 0.85)`;
      ctx.lineWidth = 18 - i * 0.7;
      ctx.stroke();
    }
  } else if (worm[0]) {
    ctx.beginPath();
    ctx.fillStyle = "hsla(312 90% 56% / 0.85)";
    ctx.arc(worm[0].x, worm[0].y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const body of sim.bodies) {
    const squash = 1 + body.bounce * 0.18;
    ctx.save();
    ctx.translate(body.x, body.y);
    ctx.scale(2 - squash, squash);
    const grad = ctx.createRadialGradient(
      -body.r * 0.28,
      -body.r * 0.32,
      body.r * 0.1,
      0,
      0,
      body.r,
    );
    grad.addColorStop(0, `hsl(${body.hue} 100% 78%)`);
    grad.addColorStop(1, `hsl(${body.hue} 92% 52%)`);
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(0, 0, body.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(26, 18, 8, 0.28)";
    ctx.stroke();

    if (body.kind === "face") {
      ctx.fillStyle = "#1a1208";
      ctx.beginPath();
      ctx.arc(-body.r * 0.28, -body.r * 0.12, body.r * 0.12, 0, Math.PI * 2);
      ctx.arc(body.r * 0.28, -body.r * 0.12, body.r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "#1a1208";
      ctx.lineWidth = Math.max(2, body.r * 0.1);
      ctx.arc(0, body.r * 0.08, body.r * 0.34, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    if (body.letter) {
      ctx.fillStyle = "#1a1208";
      ctx.font = `700 ${Math.round(body.r * 1.15)}px ui-serif, Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(body.letter, 0, 2);
    }
    ctx.restore();
  }
}

type FleetItem = { id: number; x: number; y: number };

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<PlaySim>(createPlay());
  const spraying = useRef(false);
  const lastSpray = useRef(0);
  const reduced = useSyncExternalStore(subscribeMotion, prefersReduced, () => false);
  const [hop, setHop] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);
  const [fleet, setFleet] = useState<FleetItem[]>([{ id: 1, x: 56, y: 8 }]);
  const [angle, setAngle] = useState(0);
  const [eaten, setEaten] = useState(0);
  const eatenRef = useRef(0);
  const dialRef = useRef<HTMLButtonElement>(null);

  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    resizePlay(simRef.current, w, h);
  }, []);

  useEffect(() => {
    syncSize();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const sim = simRef.current;
      stepPlay(sim, { pointer: sim.pointer, reducedMotion: reduced }, dt);
      if (sim.eaten !== eatenRef.current) {
        eatenRef.current = sim.eaten;
        setEaten(sim.eaten);
      }
      drawWorld(ctx, sim, sim.w, sim.h);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("resize", syncSize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncSize);
    };
  }, [reduced, syncSize]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(input|textarea|button)$/i.test(target.tagName)) return;
      if (event.key === " ") {
        event.preventDefault();
        spray(simRef.current, simRef.current.pointer.x, simRef.current.pointer.y, 8);
        return;
      }
      spawnLetter(simRef.current, event.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const poke = (x: number, y: number, forceSpawn = false) => {
    const sim = simRef.current;
    sim.pointer = { x, y };
    if (!forceSpawn && popAt(sim, x, y)) return;
    spawnBlob(sim, x, y);
  };

  const onDial = (clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const next = Math.atan2(
      clientX - (box.left + box.width / 2),
      clientY - (box.top + box.height / 2),
    );
    setGravityAngle(simRef.current, next);
    setAngle(next);
  };

  const pressButton = (item: FleetItem, node: HTMLButtonElement) => {
    if (phase === 0) {
      setPhase(1);
      return;
    }
    if (phase === 1) {
      setPhase(2);
      return;
    }
    if (phase === 2) {
      setPhase(3);
      setFleet((prev) => [
        ...prev,
        { id: Date.now(), x: 18 + Math.random() * 64, y: 36 + Math.random() * 28 },
      ]);
      return;
    }
    if (phase === 3) {
      setPhase(4);
      setFleet((prev) => [
        ...prev,
        ...[0, 1, 2].map((offset) => ({
          id: Date.now() + offset + 1,
          x: 10 + ((item.x + offset * 18) % 80),
          y: 12 + offset * 18,
        })),
      ]);
      return;
    }
    const box = node.getBoundingClientRect();
    const points = fleet.map((_, index) => ({
      x: box.left + 40 + index * 12,
      y: box.top + 24,
    }));
    for (const point of points) spray(simRef.current, point.x, point.y, 7, 420);
    setPhase(0);
    setFleet([{ id: 1, x: 56, y: 8 }]);
  };

  const scoot = (id: number) => {
    if (phase < 2) return;
    setFleet((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              x: clampHud(item.x + (Math.random() * 36 - 18), 8, 86),
              y: clampHud(item.y + (Math.random() * 28 - 10), 0, 62),
            }
          : item,
      ),
    );
  };

  return (
    <div className="play">
      <canvas
        ref={canvasRef}
        className="play-world"
        aria-label="A pit of bouncy blobs. Click to add. Click a blob to pop it. Type to drop letters."
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          spraying.current = true;
          const point = pointFromEvent(event);
          poke(point.x, point.y);
        }}
        onPointerMove={(event) => {
          const point = pointFromEvent(event);
          simRef.current.pointer = point;
          if (!spraying.current) return;
          const now = performance.now();
          if (now - lastSpray.current < 42) return;
          lastSpray.current = now;
          poke(point.x, point.y, true);
        }}
        onPointerUp={() => {
          spraying.current = false;
        }}
        onPointerCancel={() => {
          spraying.current = false;
        }}
      />

      <div className="play-hud">
        <header className="play-head">
          <LabMark tone="play" />
          <h1 className="play-title">
            {TITLE.map((letter) => (
              <button
                key={letter}
                type="button"
                className={hop === letter ? "is-hop" : undefined}
                onClick={() => {
                  spawnLetter(simRef.current, letter);
                  setHop(letter);
                  window.setTimeout(() => setHop(null), 280);
                }}
              >
                {letter}
              </button>
            ))}
          </h1>
          <p className="play-lede">{playCopy.lede}</p>
          <p className="play-hint">{playCopy.hint}</p>
        </header>

        <div className="play-fleet" aria-label="A button that misbehaves">
          {fleet.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`play-boom phase-${phase}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onPointerEnter={() => scoot(item.id)}
              onClick={(event) => pressButton(item, event.currentTarget)}
            >
              {BUTTONS[phase] ?? playCopy.press}
            </button>
          ))}
        </div>

        <div className="play-tray">
          <button
            ref={dialRef}
            type="button"
            className="play-dial"
            aria-label="Tilt gravity"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              onDial(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              onDial(event.clientX, event.clientY);
            }}
          >
            <span
              className="play-dial-hand"
              style={{ transform: `rotate(${angle}rad)` }}
              aria-hidden="true"
            />
            <span>{playCopy.tilt}</span>
          </button>

          <div className="play-chips">
            <button
              type="button"
              onClick={() => {
                const sim = simRef.current;
                spray(sim, sim.w * 0.5, sim.h * 0.28, 10);
              }}
            >
              {playCopy.more}
            </button>
            <button
              type="button"
              onClick={() => {
                popOldest(simRef.current);
              }}
            >
              {playCopy.pop}
            </button>
            <button
              type="button"
              onClick={() => {
                flipGravity(simRef.current);
                setAngle(simRef.current.gravityAngle);
              }}
            >
              {playCopy.flip}
            </button>
            <button
              type="button"
              onClick={() => {
                clearPlay(simRef.current);
              }}
            >
              {playCopy.clean}
            </button>
          </div>

          <p className="play-eaten" aria-live="polite">
            {eaten ? `the worm ate ${eaten}` : playCopy.wink}
          </p>
        </div>
      </div>
    </div>
  );
}

function clampHud(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
