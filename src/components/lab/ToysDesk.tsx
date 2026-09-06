"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toysCopy } from "@/content/lab";
import { LabMark } from "./LabMark";
import "./toys.css";

const FLOATS = ["sam", "ny", "dad", "ok", "beep", "nope", "600ms"];

const CHARGES = [
  { name: "coffee", amount: "$4.80" },
  { name: "the 6 train", amount: "$2.90" },
  { name: "a very small lamp", amount: "$18.00" },
  { name: "tacos", amount: "$14.00" },
  { name: "one gummy", amount: "$0.25" },
];

const PADS = [
  { id: "beep", freq: 880, type: "sine" as const, dur: 0.16, vol: 0.16 },
  { id: "thunk", freq: 78, type: "triangle" as const, dur: 0.22, vol: 0.22 },
  { id: "nope", freq: 196, type: "sawtooth" as const, dur: 0.28, vol: 0.1 },
  { id: "ping", freq: 1320, type: "sine" as const, dur: 0.1, vol: 0.12 },
  { id: "buzz", freq: 140, type: "square" as const, dur: 0.14, vol: 0.05 },
  { id: "hey", freq: 523, type: "triangle" as const, dur: 0.2, vol: 0.14 },
];

type Mode = "then" | "now";

function windowMs(mode: Mode) {
  return mode === "then" ? 3500 : 600;
}

function playPad(
  ctx: AudioContext,
  pad: (typeof PADS)[number],
  extra = 0,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = pad.type;
  osc.frequency.setValueAtTime(pad.freq + extra, ctx.currentTime);
  if (pad.id === "nope") {
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + pad.dur);
  }
  if (pad.id === "hey") {
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.09);
  }
  gain.gain.setValueAtTime(pad.vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + pad.dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + pad.dur + 0.02);
}

export function ToysDesk() {
  const [paperHue, setPaperHue] = useState(48);
  const [chaos, setChaos] = useState(0.12);
  const [titleHue, setTitleHue] = useState(0);

  return (
    <div
      className="toys-desk"
      style={{ ["--toys-paper" as string]: `hsl(${paperHue} 92% 78%)` }}
    >
      {FLOATS.map((word, index) => (
        <span
          key={word}
          className="toys-float"
          style={{
            left: `${(index * 15 + 6) % 88}%`,
            top: `${(index * 19 + 18) % 72}%`,
            animationDuration: `${Math.max(2.4, 13 - chaos * 10)}s`,
            animationDelay: `${index * -0.6}s`,
          }}
        >
          {word}
        </span>
      ))}

      <header className="toys-head">
        <div>
          <LabMark tone="toys" />
          <h1 className="toys-title">
            <button
              type="button"
              onClick={() => setTitleHue((value) => (value + 40) % 360)}
              style={{ color: titleHue ? `hsl(${titleHue} 90% 48%)` : undefined }}
            >
              {toysCopy.title}
            </button>
          </h1>
          <p className="toys-lede">{toysCopy.lede}</p>
        </div>
      </header>

      <div className="toys-stage">
        <ChargeWindow />
        <ChaosDial
          onChange={(next) => {
            setChaos(next);
            setPaperHue(42 + next * 70);
          }}
        />
        <SoundPads />
      </div>
    </div>
  );
}

function ChargeWindow() {
  const [mode, setMode] = useState<Mode>("then");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(1);
  const [charge, setCharge] = useState(CHARGES[0]);
  const [result, setResult] = useState<"ok" | "no" | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [receipts, setReceipts] = useState<string[]>([]);
  const started = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    if (!running) return;
    const duration = windowMs(mode);
    started.current = performance.now();
    const tick = (now: number) => {
      const ratio = 1 - (now - started.current) / duration;
      if (ratio <= 0) {
        setLeft(0);
        setRunning(false);
        setResult("no");
        setStreak(0);
        return;
      }
      setLeft(ratio);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [running, mode]);

  const arm = () => {
    setCharge(CHARGES[Math.floor(Math.random() * CHARGES.length)] ?? CHARGES[0]);
    setResult(null);
    setLeft(1);
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
    setReceipts((rows) =>
      [`${charge.name} ${charge.amount}`, ...rows].slice(0, 5),
    );
  };

  return (
    <section className="toys-card toys-window">
      <h2>{toysCopy.window.title}</h2>
      <p>{toysCopy.window.hint}</p>
      <div className="toys-modes" role="group" aria-label="Window">
        <button
          type="button"
          aria-pressed={mode === "then"}
          onClick={() => {
            setMode("then");
            setRunning(false);
            setResult(null);
          }}
        >
          {toysCopy.window.thenLabel}
        </button>
        <button
          type="button"
          aria-pressed={mode === "now"}
          onClick={() => {
            setMode("now");
            setRunning(false);
            setResult(null);
          }}
        >
          {toysCopy.window.nowLabel}
        </button>
      </div>
      <div className="toys-charge" aria-live="polite">
        <div className="toys-merchant">
          <span>{charge.name}</span>
          <span>{charge.amount}</span>
        </div>
        <div className="toys-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(0, left) * 100}%` }} />
        </div>
        <div className="toys-actions">
          <button type="button" className="toys-arm" onClick={arm} disabled={running}>
            {toysCopy.window.arm}
          </button>
          <button
            type="button"
            className="toys-hit"
            onClick={approve}
            disabled={!running}
          >
            {toysCopy.window.approve}
          </button>
        </div>
        {result ? (
          <p className="toys-status" data-tone={result}>
            {result === "ok" ? toysCopy.window.approved : toysCopy.window.declined}
          </p>
        ) : null}
        <p className="toys-score">
          streak {streak} · best {best}
        </p>
      </div>
      {receipts.length ? (
        <div className="toys-receipts" aria-label="Receipts">
          {receipts.map((row, index) => (
            <span
              key={`${row}-${index}`}
              className="toys-receipt"
              style={{ ["--tilt" as string]: `${(index % 2 === 0 ? -1 : 1) * (2 + index)}deg` }}
            >
              {row}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ChaosDial({ onChange }: { onChange: (value: number) => void }) {
  const [angle, setAngle] = useState(28);
  const area = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  const apply = (next: number) => {
    const wrapped = ((next % 360) + 360) % 360;
    setAngle(wrapped);
    onChange(wrapped / 360);
  };

  const fromPointer = (clientX: number, clientY: number) => {
    const el = area.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const dx = clientX - (box.left + box.width / 2);
    const dy = clientY - (box.top + box.height / 2);
    apply((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  };

  const mood =
    angle < 90
      ? toysCopy.dial.calm
      : angle < 220
        ? toysCopy.dial.mid
        : toysCopy.dial.hot;

  return (
    <section className="toys-card toys-dial">
      <h2>{toysCopy.dial.title}</h2>
      <p id={labelId}>{toysCopy.dial.hint}</p>
      <div className="toys-dial-wrap">
        <div
          ref={area}
          className="toys-knob"
          role="slider"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(angle)}
          tabIndex={0}
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            fromPointer(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return;
            fromPointer(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              apply(angle + 12);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              apply(angle - 12);
            }
          }}
        >
          <span
            className="toys-knob-notch"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
        </div>
        <p className="toys-mood">{mood}</p>
      </div>
    </section>
  );
}

function SoundPads() {
  const audio = useRef<AudioContext | null>(null);
  const [hot, setHot] = useState<string | null>(null);

  const ensure = () => {
    if (!audio.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      audio.current = new Ctor();
    }
    void audio.current.resume();
    return audio.current;
  };

  const hit = (pad: (typeof PADS)[number]) => {
    playPad(ensure(), pad);
    setHot(pad.id);
    window.setTimeout(() => setHot((id) => (id === pad.id ? null : id)), 140);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      if (event.target instanceof HTMLInputElement) return;
      const pad = PADS[index];
      if (!pad) return;
      if (!audio.current) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        audio.current = new Ctor();
      }
      void audio.current.resume();
      playPad(audio.current, pad);
      setHot(pad.id);
      window.setTimeout(() => setHot((id) => (id === pad.id ? null : id)), 140);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="toys-card toys-sampler">
      <h2>{toysCopy.pads.title}</h2>
      <p>{toysCopy.pads.hint}</p>
      <div className="toys-pads">
        {PADS.map((pad, index) => (
          <button
            key={pad.id}
            type="button"
            className="toys-pad"
            data-hot={hot === pad.id}
            onClick={() => hit(pad)}
          >
            {index + 1} {pad.id}
          </button>
        ))}
      </div>
    </section>
  );
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
