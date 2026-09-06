"use client";

import { useState } from "react";
import { toysCopy } from "@/content/lab";
import { LabMark } from "./LabMark";
import { emitToy } from "./toy-bus";
import { ChargeSwipe, DiscField, ForecastToy, HandSpell } from "./toys-kit";
import "./toys.css";

const JOBS = [
  { id: "swipe", label: "approve", run: () => emitToy({ type: "swipe" }) },
  { id: "throw", label: "huck", run: () => emitToy({ type: "throw" }) },
  { id: "sign", label: "sign sam", run: () => emitToy({ type: "sign", word: "sam" }) },
  { id: "count", label: "catch ghosts", run: () => emitToy({ type: "count" }) },
] as const;

export function ToysDesk() {
  const [note, setNote] = useState("idle.");
  const [titleHue, setTitleHue] = useState(0);

  return (
    <div className="toys-desk">
      <header className="toys-head">
        <div>
          <LabMark tone="toys" />
          <h1 className="toys-title">
            <button
              type="button"
              onClick={() => setTitleHue((value) => (value + 50) % 360)}
              style={{ color: titleHue ? `hsl(${titleHue} 90% 46%)` : undefined }}
            >
              {toysCopy.title}
            </button>
          </h1>
          <p className="toys-lede">{toysCopy.lede}</p>
        </div>
      </header>

      <section className="toys-card toys-agent">
        <div>
          <h2>{toysCopy.agent.title}</h2>
          <p>{toysCopy.agent.hint}</p>
        </div>
        <div className="toys-actions">
          {JOBS.map((job) => (
            <button
              key={job.id}
              type="button"
              className="toys-hit"
              onClick={() => {
                setNote("on it.");
                job.run();
                window.setTimeout(() => setNote("done. 2"), 220);
              }}
            >
              {job.label}
            </button>
          ))}
        </div>
        <p className="toys-status" data-tone="ok" aria-live="polite">
          {note}
        </p>
      </section>

      <div className="toys-stage">
        <ChargeSwipe />
        <ForecastToy />
        <DiscField />
        <HandSpell />
      </div>
    </div>
  );
}
