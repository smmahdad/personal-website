"use client";

import { useEffect, useRef, useState } from "react";
import { charges, toysCopy } from "@/content/lab";
import { subscribeToy } from "./toy-bus";

const WINDOWS = [
  { id: "budget", ms: 4000, label: "4.0s" },
  { id: "then", ms: 3500, label: "3.5s" },
  { id: "now", ms: 600, label: "600ms" },
] as const;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CURLS: Record<string, number[]> = {
  A: [0.2, 1, 1, 1, 1],
  B: [0.15, 0, 0, 0, 0],
  C: [0.35, 0.45, 0.45, 0.45, 0.45],
  D: [0.3, 0, 0.95, 0.95, 0.95],
  E: [0.4, 0.85, 0.85, 0.85, 0.85],
  F: [0.15, 0.85, 0, 0, 0],
  G: [0.2, 0.15, 1, 1, 1],
  H: [0.2, 0.1, 0.1, 1, 1],
  I: [0.3, 1, 1, 1, 0.05],
  J: [0.3, 1, 1, 1, 0.05],
  K: [0.15, 0.05, 0.25, 1, 1],
  L: [0.05, 0.05, 1, 1, 1],
  M: [0.7, 0.9, 0.9, 0.9, 1],
  N: [0.7, 0.9, 0.9, 1, 1],
  O: [0.4, 0.55, 0.55, 0.55, 0.55],
  P: [0.2, 0.1, 0.3, 1, 1],
  Q: [0.15, 0.2, 1, 1, 1],
  R: [0.25, 0.1, 0.1, 1, 1],
  S: [0.55, 0.95, 0.95, 0.95, 0.95],
  T: [0.45, 0.9, 1, 1, 1],
  U: [0.25, 0.05, 0.05, 1, 1],
  V: [0.25, 0.05, 0.15, 1, 1],
  W: [0.25, 0.05, 0.05, 0.05, 1],
  X: [0.3, 0.55, 1, 1, 1],
  Y: [0.05, 1, 1, 1, 0.05],
  Z: [0.3, 0.1, 1, 1, 1],
};

function pickCharge() {
  return charges[Math.floor(Math.random() * charges.length)] ?? charges[0];
}

export function ChargeSwipe() {
  const [windowId, setWindowId] = useState<(typeof WINDOWS)[number]["id"]>("budget");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(1);
  const [charge, setCharge] = useState<(typeof charges)[number]>(charges[0]);
  const [result, setResult] = useState<"ok" | "no" | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [dx, setDx] = useState(0);
  const started = useRef(0);
  const frame = useRef(0);
  const drag = useRef(false);
  const origin = useRef(0);
  const dxRef = useRef(0);
  const live = useRef({ running: false, left: 1 });

  const ms = WINDOWS.find((row) => row.id === windowId)?.ms ?? 4000;

  useEffect(() => {
    live.current.running = running;
  }, [running]);

  useEffect(() => {
    return subscribeToy((action) => {
      if (action.type !== "swipe") return;
      setCharge(pickCharge());
      setResult(null);
      setLeft(1);
      setDx(0);
      setRunning(true);
      window.setTimeout(() => {
        if (!live.current.running) return;
        cancelAnimationFrame(frame.current);
        setRunning(false);
        setResult("ok");
        setStreak((value) => {
          const next = value + 1;
          setBest((top) => Math.max(top, next));
          return next;
        });
        setDx(140);
        window.setTimeout(() => setDx(0), 280);
      }, 90);
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    started.current = performance.now();
    const tick = (now: number) => {
      const ratio = 1 - (now - started.current) / ms;
      if (ratio <= 0) {
        setLeft(0);
        setRunning(false);
        setResult("no");
        setStreak(0);
        setDx(-130);
        return;
      }
      setLeft(ratio);
      live.current.left = ratio;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [running, ms]);

  const arm = () => {
    setCharge(pickCharge());
    setResult(null);
    setLeft(1);
    setDx(0);
    setRunning(true);
  };

  const approve = () => {
    if (!running) return;
    cancelAnimationFrame(frame.current);
    setRunning(false);
    setResult("ok");
    const next = streak + 1;
    setStreak(next);
    if (next > best) setBest(next);
    setDx(140);
    window.setTimeout(() => setDx(0), 280);
  };

  return (
    <section className="toys-card toys-window">
      <h2>{toysCopy.swipe.title}</h2>
      <p>{toysCopy.swipe.hint}</p>
      <div className="toys-modes" role="group" aria-label="Window">
        {WINDOWS.map((row) => (
          <button
            key={row.id}
            type="button"
            aria-pressed={windowId === row.id}
            onClick={() => {
              setWindowId(row.id);
              setRunning(false);
              setResult(null);
              setDx(0);
            }}
          >
            {row.label}
          </button>
        ))}
      </div>
      <div className="toys-charge" aria-live="polite">
        <button
          type="button"
          className="toys-swipe-card"
          disabled={!running}
          style={{ transform: `translateX(${dx}px) rotate(${dx / 14}deg)` }}
          onPointerDown={(event) => {
            if (!running) return;
            drag.current = true;
            origin.current = event.clientX;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const next = event.clientX - origin.current;
            dxRef.current = next;
            setDx(next);
          }}
          onPointerUp={() => {
            if (!drag.current) return;
            drag.current = false;
            if (dxRef.current > 70) approve();
            else {
              dxRef.current = 0;
              setDx(0);
            }
          }}
        >
          <span>{charge.name}</span>
          <strong>{charge.amount}</strong>
        </button>
        <div className="toys-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(0, left) * 100}%` }} />
        </div>
        <div className="toys-actions">
          <button type="button" className="toys-arm" onClick={arm} disabled={running}>
            Deal
          </button>
          <button
            type="button"
            className="toys-hit"
            onClick={approve}
            disabled={!running}
          >
            Approve
          </button>
        </div>
        {result ? (
          <p className="toys-status" data-tone={result}>
            {result === "ok" ? "approved" : "declined"}
          </p>
        ) : null}
        <p className="toys-score">
          streak {streak} · best {best}
        </p>
      </div>
    </section>
  );
}

export function ForecastToy() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const qpsEl = useRef<HTMLSpanElement>(null);
  const ghostEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    type Dot = { x: number; y: number; vx: number; ghost: boolean; marked: boolean };
    const dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let qps = 0;
    let marked = 0;
    let frame = 0;
    let spawn = 0;

    const resize = () => {
      const box = node.getBoundingClientRect();
      width = Math.max(1, Math.floor(box.width * window.devicePixelRatio));
      height = Math.max(1, Math.floor(box.height * window.devicePixelRatio));
      node.width = width;
      node.height = height;
    };
    resize();

    const spawnDot = () => {
      dots.push({
        x: -8,
        y: 8 + Math.random() * (height - 16),
        vx: 2.4 + Math.random() * 3.6,
        ghost: Math.random() < 0.18,
        marked: false,
      });
    };

    const tick = () => {
      spawn += 1;
      if (spawn % 3 === 0) spawnDot();
      ctx.clearRect(0, 0, width, height);
      qps = Math.round(dots.length * 37);
      for (let i = dots.length - 1; i >= 0; i -= 1) {
        const dot = dots[i];
        if (!dot) continue;
        dot.x += dot.vx * (window.devicePixelRatio || 1);
        if (dot.x > width + 12) {
          dots.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.marked ? 5 : 3.2, 0, Math.PI * 2);
        if (dot.ghost && !dot.marked) {
          ctx.strokeStyle = "#1a1208";
          ctx.stroke();
        } else {
          ctx.fillStyle = dot.ghost ? "#ff3d6e" : "#2f6dff";
          ctx.fill();
        }
      }
      if (qpsEl.current) qpsEl.current.textContent = String(qps);
      if (ghostEl.current) ghostEl.current.textContent = String(marked);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onClick = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) * (width / box.width);
      const y = (event.clientY - box.top) * (height / box.height);
      for (const dot of dots) {
        if (dot.ghost && !dot.marked && Math.hypot(dot.x - x, dot.y - y) < 16) {
          dot.marked = true;
          marked += 1;
          break;
        }
      }
    };
    node.addEventListener("pointerdown", onClick);

    const stop = subscribeToy((action) => {
      if (action.type !== "count") return;
      for (const dot of dots) {
        if (dot.ghost && !dot.marked) {
          dot.marked = true;
          marked += 1;
        }
      }
    });

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointerdown", onClick);
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return (
    <section className="toys-card toys-forecast">
      <h2>{toysCopy.forecast.title}</h2>
      <p>{toysCopy.forecast.hint}</p>
      <canvas ref={canvas} className="toys-canvas" aria-label="Traffic" />
      <p className="toys-score">
        qps <span ref={qpsEl}>0</span> · caught <span ref={ghostEl}>0</span>
      </p>
    </section>
  );
}

export function DiscField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const yardsEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let best = 0;
    const disc = { x: 40, y: 0, vx: 0, vy: 0, spin: 0, flying: false };
    const aim = { active: false, x: 0, y: 0 };

    const resize = () => {
      const box = node.getBoundingClientRect();
      width = Math.max(1, Math.floor(box.width * window.devicePixelRatio));
      height = Math.max(1, Math.floor(box.height * window.devicePixelRatio));
      node.width = width;
      node.height = height;
      if (!disc.flying) {
        disc.x = 36 * (window.devicePixelRatio || 1);
        disc.y = height * 0.72;
      }
    };
    resize();

    const launch = (vx: number, vy: number) => {
      disc.vx = vx;
      disc.vy = vy;
      disc.spin = vx * 0.08;
      disc.flying = true;
    };

    const tick = () => {
      if (disc.flying) {
        disc.vy += 0.18;
        disc.vx += disc.spin * 0.002;
        disc.x += disc.vx;
        disc.y += disc.vy;
        disc.spin *= 0.995;
        if (disc.y > height * 0.86) {
          disc.y = height * 0.86;
          disc.vy *= -0.28;
          disc.vx *= 0.72;
          if (Math.abs(disc.vx) < 0.4) {
            disc.flying = false;
            const yards = Math.round((disc.x / width) * 70);
            best = Math.max(best, yards);
            if (yardsEl.current) yardsEl.current.textContent = String(best);
            disc.x = 36 * (window.devicePixelRatio || 1);
            disc.y = height * 0.72;
            disc.vx = 0;
            disc.vy = 0;
          }
        }
        if (disc.x > width - 10) disc.vx *= -0.4;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(26,18,8,0.2)";
      ctx.beginPath();
      ctx.moveTo(0, height * 0.86);
      ctx.lineTo(width, height * 0.86);
      ctx.stroke();
      if (aim.active) {
        ctx.strokeStyle = "#ff3d6e";
        ctx.beginPath();
        ctx.moveTo(disc.x, disc.y);
        ctx.lineTo(aim.x, aim.y);
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(disc.x, disc.y);
      ctx.rotate(disc.spin);
      ctx.fillStyle = "#2f6dff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const pos = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      return {
        x: (event.clientX - box.left) * (width / box.width),
        y: (event.clientY - box.top) * (height / box.height),
      };
    };

    const down = (event: PointerEvent) => {
      if (disc.flying) return;
      const point = pos(event);
      if (Math.hypot(point.x - disc.x, point.y - disc.y) > 36) return;
      aim.active = true;
      aim.x = point.x;
      aim.y = point.y;
      node.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!aim.active) return;
      const point = pos(event);
      aim.x = point.x;
      aim.y = point.y;
    };
    const up = () => {
      if (!aim.active) return;
      launch((disc.x - aim.x) * 0.16, (disc.y - aim.y) * 0.16);
      aim.active = false;
    };

    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
    const stop = subscribeToy((action) => {
      if (action.type !== "throw") return;
      launch(8 + Math.random() * 4, -7);
    });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      window.removeEventListener("resize", resize);
      stop();
    };
  }, []);

  return (
    <section className="toys-card toys-disc">
      <h2>{toysCopy.disc.title}</h2>
      <p>{toysCopy.disc.hint}</p>
      <canvas ref={canvas} className="toys-canvas" aria-label="Disc" />
      <p className="toys-score">
        best <span ref={yardsEl}>0</span> yd
      </p>
    </section>
  );
}

function Hand({ letter }: { letter: string }) {
  const curls = CURLS[letter] ?? [0.3, 0.3, 0.3, 0.3, 0.3];
  return (
    <svg className="toys-hand" viewBox="0 0 80 110" aria-hidden="true">
      <rect x="24" y="58" width="34" height="30" rx="10" fill="#1a1208" />
      {curls.map((curl, index) => {
        const x = 26 + index * 8;
        const h = 10 + (1 - curl) * 34;
        return (
          <rect
            key={index}
            x={x}
            y={58 - h}
            width="7"
            height={h}
            rx="3.5"
            fill="#1a1208"
          />
        );
      })}
      <rect
        x="12"
        y="64"
        width="12"
        height={18 + (1 - (curls[0] ?? 0.3)) * 10}
        rx="6"
        fill="#1a1208"
      />
    </svg>
  );
}

export function HandSpell() {
  const [letter, setLetter] = useState("S");
  const [word, setWord] = useState("S");
  const timer = useRef(0);

  const show = (next: string) => {
    const up = next.toUpperCase();
    if (!/[A-Z]/.test(up)) return;
    setLetter(up);
    setWord((value) => (value + up).slice(-8));
  };

  const spell = (text: string) => {
    window.clearInterval(timer.current);
    const chars = text.toUpperCase().replace(/[^A-Z]/g, "").split("");
    setWord("");
    let i = 0;
    timer.current = window.setInterval(() => {
      const ch = chars[i];
      if (!ch) {
        window.clearInterval(timer.current);
        return;
      }
      setLetter(ch);
      setWord((value) => value + ch);
      i += 1;
    }, 280);
  };

  useEffect(() => {
    const stop = subscribeToy((action) => {
      if (action.type === "sign") spell(action.word);
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key.length === 1) show(event.key);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      stop();
      window.removeEventListener("keydown", onKey);
      window.clearInterval(timer.current);
    };
  }, []);

  return (
    <section className="toys-card toys-hands">
      <h2>{toysCopy.hands.title}</h2>
      <p>{toysCopy.hands.hint}</p>
      <div className="toys-sign">
        <Hand letter={letter} />
        <strong aria-live="polite">{letter}</strong>
      </div>
      <p className="toys-word">{word}</p>
      <div className="toys-letters">
        {LETTERS.map((item) => (
          <button key={item} type="button" onClick={() => show(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="toys-actions">
        <button type="button" className="toys-arm" onClick={() => spell("sam")}>
          sam
        </button>
        <button type="button" className="toys-arm" onClick={() => spell("dad")}>
          dad
        </button>
      </div>
    </section>
  );
}
