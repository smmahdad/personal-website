"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { craftCopy } from "@/content/lab";
import { LabMark } from "./LabMark";
import "./craft.css";

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

export function CraftStudio() {
  const letters = useRef<(HTMLButtonElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const cursorEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const hairEl = useRef<HTMLDivElement>(null);
  const time = useSyncExternalStore(subscribeClock, nyTime, () => "--:--:--");
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );
  const [lit, setLit] = useState<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const tick = () => {
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
      if (hairEl.current) {
        hairEl.current.style.top = `${mouse.current.y}px`;
      }
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
          const tx = (dx / dist) * force * 26;
          const ty = (dy / dist) * force * 22;
          letter.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`craft-studio${fine ? " craft-fine" : ""}`}
      onPointerMove={(event) => {
        mouse.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <LabMark tone="craft" />
      <p className="craft-status">
        <span className="craft-pulse" aria-hidden="true" />
        {craftCopy.live}
      </p>
      <div ref={cursorEl} className="craft-cursor" aria-hidden="true" />
      <div ref={ringEl} className="craft-ring" aria-hidden="true" />
      <div ref={hairEl} className="craft-hair" aria-hidden="true" />

      <div className="craft-stage">
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
              onPointerLeave={() => setLit((value) => (value === index ? null : value))}
              onClick={() => setLit(index)}
            >
              {letter}
            </button>
          ))}
        </h1>
      </div>

      <footer className="craft-bar">
        <span>
          <time dateTime={time}>{time}</time>
          <span> · {craftCopy.place}</span>
        </span>
        <nav className="craft-links" aria-label="Other rooms">
          <Link href="/lab/toys/">toys</Link>
          <Link href="/lab/shell/">shell</Link>
        </nav>
      </footer>
    </div>
  );
}
