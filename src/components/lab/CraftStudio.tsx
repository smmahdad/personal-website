"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { craftCopy } from "@/content/lab";
import { LabMark } from "./LabMark";
import "./craft.css";

const BUDGETS = [4000, 3500, 600] as const;

function nyTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function subscribeClock(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function subscribeFinePointer(onStoreChange: () => void) {
  const media = window.matchMedia("(hover: hover) and (pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function formatBudget(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function CraftStudio() {
  const letters = useRef<(HTMLButtonElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const cursorEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const hairEl = useRef<HTMLDivElement>(null);
  const arcEl = useRef<SVGCircleElement>(null);
  const discEl = useRef<HTMLButtonElement>(null);
  const moteBox = useRef<HTMLDivElement>(null);
  const qpsEl = useRef<HTMLSpanElement>(null);
  const budgetRef = useRef<(typeof BUDGETS)[number]>(4000);
  const disc = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const time = useSyncExternalStore(subscribeClock, nyTime, () => "--:--:--");
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );
  const [lit, setLit] = useState<number | null>(null);
  const [signed, setSigned] = useState<string | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]>(4000);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motes = [...(moteBox.current?.querySelectorAll<HTMLElement>("[data-mote]") ?? [])];
    const moteState = motes.map((node, index) => ({
      node,
      x: (index * 47) % 100,
      y: (index * 29) % 100,
      vx: 0.04 + (index % 5) * 0.02,
      ghost: index % 6 === 0,
    }));
    for (const mote of moteState) {
      if (mote.ghost) mote.node.dataset.ghost = "true";
    }

    let start = performance.now();
    let signAt = 0;
    let frame = 0;
    const tick = (now: number) => {
      const windowMs = budgetRef.current;
      const elapsed = now - start;
      const ratio = Math.max(0, 1 - elapsed / windowMs);
      if (arcEl.current) {
        const circ = 2 * Math.PI * 42;
        arcEl.current.style.strokeDasharray = `${circ}`;
        arcEl.current.style.strokeDashoffset = `${circ * (1 - ratio)}`;
      }
      if (ratio <= 0) {
        start = now;
        setFlash(true);
        window.setTimeout(() => setFlash(false), 160);
      }

      if (!reduce && now - signAt > 900) {
        signAt = now;
        setLit((value) => ((value ?? -1) + 1) % 3);
      }

      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (cursorEl.current) {
        cursorEl.current.style.left = `${mouse.current.x}px`;
        cursorEl.current.style.top = `${mouse.current.y}px`;
      }
      if (ringEl.current) {
        ringEl.current.style.left = `${ring.current.x}px`;
        ringEl.current.style.top = `${ring.current.y}px`;
      }
      if (hairEl.current) hairEl.current.style.top = `${mouse.current.y}px`;

      if (disc.current.x === 0 && disc.current.y === 0) {
        disc.current.x = window.innerWidth * 0.82;
        disc.current.y = window.innerHeight * 0.58;
      }
      disc.current.vx *= 0.99;
      disc.current.vy *= 0.99;
      disc.current.x = Math.max(18, Math.min(window.innerWidth - 18, disc.current.x + disc.current.vx));
      disc.current.y = Math.max(18, Math.min(window.innerHeight - 18, disc.current.y + disc.current.vy));
      if (discEl.current) {
        discEl.current.style.left = `${disc.current.x}px`;
        discEl.current.style.top = `${disc.current.y}px`;
      }

      let ghosts = 0;
      for (const mote of moteState) {
        mote.x = (mote.x + mote.vx) % 100;
        mote.node.style.left = `${mote.x}%`;
        mote.node.style.top = `${mote.y}%`;
        if (mote.node.dataset.ghost === "true") ghosts += 1;
      }
      if (qpsEl.current) qpsEl.current.textContent = `${840 + motes.length * 11} · ${ghosts} ghost`;

      if (!reduce) {
        for (const letter of letters.current) {
          if (!letter) continue;
          const box = letter.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const dx = cx - mouse.current.x;
          const dy = cy - mouse.current.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = Math.max(0, 160 - dist) / 160;
          letter.style.transform = `translate(${(dx / dist) * force * 26}px, ${(dy / dist) * force * 22}px)`;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const cycleBudget = () => {
    const index = BUDGETS.indexOf(budgetRef.current);
    const next = BUDGETS[(index + 1) % BUDGETS.length] ?? 4000;
    budgetRef.current = next;
    setBudget(next);
  };

  return (
    <div
      className={`craft-studio${fine ? " craft-fine" : ""}${flash ? " craft-flash" : ""}`}
      onPointerMove={(event) => {
        mouse.current = { x: event.clientX, y: event.clientY };
      }}
      onKeyDown={(event) => {
        if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
          setSigned(event.key.toUpperCase());
        }
      }}
      tabIndex={0}
    >
      <LabMark tone="craft" />
      <button
        type="button"
        className="craft-status"
        onClick={() => {
          setSigned("2");
          setLit(0);
          window.setTimeout(() => setLit(1), 180);
          window.setTimeout(() => setLit(2), 360);
        }}
      >
        <span className="craft-pulse" aria-hidden="true" />
        {craftCopy.live}
      </button>
      <div ref={cursorEl} className="craft-cursor" aria-hidden="true" />
      <div ref={ringEl} className="craft-ring" aria-hidden="true" />
      <div ref={hairEl} className="craft-hair" aria-hidden="true" />

      <div className="craft-motes" ref={moteBox} aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <button
            key={index}
            type="button"
            data-mote=""
            className="craft-mote"
            onClick={(event) => {
              event.currentTarget.dataset.ghost = "false";
            }}
          />
        ))}
      </div>

      <button
        type="button"
        ref={discEl}
        className="craft-disc"
        aria-label="Disc"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          disc.current.vx = 0;
          disc.current.vy = 0;
        }}
        onPointerMove={(event) => {
          if (event.buttons !== 1) return;
          disc.current.x = event.clientX;
          disc.current.y = event.clientY;
          disc.current.vx = event.movementX;
          disc.current.vy = event.movementY;
        }}
      />

      <div className="craft-stage">
        <button type="button" className="craft-budget" onClick={cycleBudget}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" className="craft-budget-track" />
            <circle ref={arcEl} cx="50" cy="50" r="42" className="craft-budget-arc" />
          </svg>
          <span>{formatBudget(budget)}</span>
        </button>
        <h1 className="craft-name" aria-label={craftCopy.name}>
          {craftCopy.name.split("").map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              type="button"
              ref={(node) => {
                letters.current[index] = node;
              }}
              data-lit={lit === index}
              onPointerEnter={() => setLit(index)}
              onClick={() => setSigned(letter.toUpperCase())}
            >
              {letter}
            </button>
          ))}
        </h1>
        <p className="craft-sign" aria-live="polite">
          {signed ?? ""}
        </p>
      </div>

      <footer className="craft-bar">
        <span>
          <time dateTime={time}>{time}</time>
          <span> · {craftCopy.place}</span>
          <span>
            {" "}
            · qps <span ref={qpsEl}>0</span>
          </span>
        </span>
        <nav className="craft-links" aria-label="Other rooms">
          <Link href="/lab/toys/">toys</Link>
          <Link href="/lab/shell/">shell</Link>
        </nav>
      </footer>
    </div>
  );
}
