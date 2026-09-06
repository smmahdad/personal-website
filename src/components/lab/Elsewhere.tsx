"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { elsewhereCopy } from "@/content/elsewhere";
import {
  STREET_LAMP,
  TRAIN,
  createSim,
  emptyInput,
  hitProp,
  cameraTilt,
  lampMood,
  lampRadius,
  roomAt,
  screenToWorld,
  step,
  viewScale,
  worldToScreen,
  type Input,
  type Sim,
} from "@/lib/elsewhere";
import { LabMark } from "./LabMark";
import { ElsewhereHouse } from "./elsewhere-house";
import "./elsewhere.css";

function subscribeReduced(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Dust = { x: number; y: number; z: number; v: number };

function seedDust(count: number): Dust[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (i * 97) % 100,
    y: (i * 53) % 100,
    z: 0.4 + (i % 5) * 0.12,
    v: 4 + (i % 7),
  }));
}

export function Elsewhere() {
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const trainRef = useRef<HTMLElement | null>(null);
  const discRef = useRef<HTMLElement | null>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<Sim>(createSim());
  const inputRef = useRef<Input>(emptyInput());
  const keysRef = useRef(new Set<string>());
  const dustRef = useRef(seedDust(42));
  const reduced = useSyncExternalStore(subscribeReduced, reducedMotion, () => false);

  const [hud, setHud] = useState({
    room: "stoop",
    whisper: elsewhereCopy.comeIn as string | null,
    radio: false,
    fridge: false,
    hint: true,
  });

  useEffect(() => {
    const root = rootRef.current;
    const cam = camRef.current;
    const dark = darkRef.current;
    const glow = glowRef.current;
    const fx = fxRef.current;
    if (!root || !cam || !dark || !glow || !fx) return;

    trainRef.current = root.querySelector("[data-train]");
    discRef.current = root.querySelector("[data-prop='disc']");

    const sim = simRef.current;
    const input = inputRef.current;
    input.reducedMotion = reduced;
    input.view = { w: root.clientWidth, h: root.clientHeight };

    const ctx = fx.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      fx.width = Math.floor(root.clientWidth * dpr);
      fx.height = Math.floor(root.clientHeight * dpr);
      fx.style.width = `${root.clientWidth}px`;
      fx.style.height = `${root.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      input.view = { w: root.clientWidth, h: root.clientHeight };
    };
    resize();

    const pointFromEvent = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const scale = viewScale(input.view.w, input.view.h);
      return screenToWorld(
        event.clientX - rect.left,
        event.clientY - rect.top,
        sim.camera,
        scale,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      input.pointer = pointFromEvent(event);
    };

    const onPointerDown = (event: PointerEvent) => {
      const world = pointFromEvent(event);
      input.pointer = world;
      const prop = hitProp(world.x, world.y, 36);
      if (prop?.id === "disc") input.holdDisc = true;
      if (prop?.id === "radio") input.toggleRadio = true;
      if (prop?.id === "fridge") input.toggleFridge = true;
      if (prop?.id === "clock") input.tapClock = true;
      if (prop?.id === "bench") input.tapBench = true;
      root.setPointerCapture(event.pointerId);
    };

    const onPointerUp = () => {
      input.holdDisc = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      keysRef.current.add(event.key);
      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        input.typed = event.key;
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key);
    };

    const onResize = () => resize();

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    let frame = 0;
    let last = performance.now();
    let hudAt = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      input.keys = [...keysRef.current];
      input.reducedMotion = reduced;
      step(sim, input, dt);
      input.toggleRadio = false;
      input.toggleFridge = false;
      input.tapClock = false;
      input.tapBench = false;
      input.typed = null;
      input.pointer = null;

      const scale = viewScale(input.view.w, input.view.h);
      const tilt = reduced ? 0 : cameraTilt(sim);
      const shakeX = reduced ? 0 : (Math.random() - 0.5) * sim.shake;
      const shakeY = reduced ? 0 : (Math.random() - 0.5) * sim.shake;
      cam.style.transform = `translate3d(${-sim.camera.x * scale + shakeX}px, ${-sim.camera.y * scale + shakeY}px, 0) scale(${scale})`;
      cam.style.setProperty("--tilt", `${tilt}deg`);

      const lamp = worldToScreen(sim.lamp.x, sim.lamp.y, sim.camera, scale);
      const radius = lampRadius(sim, reduced) * scale;
      const mood = lampMood(sim);
      root.dataset.mood = mood;
      root.dataset.room = roomAt(sim.lamp.x, sim.lamp.y);
      root.dataset.radio = sim.radioOn ? "on" : "off";
      root.dataset.fridge = sim.fridgeOpen ? "open" : "shut";
      const street = worldToScreen(STREET_LAMP.x, STREET_LAMP.y, sim.camera, scale);
      root.style.setProperty("--lx", `${lamp.x}px`);
      root.style.setProperty("--ly", `${lamp.y}px`);
      root.style.setProperty("--lr", `${radius}px`);
      root.style.setProperty("--sx", `${street.x}px`);
      root.style.setProperty("--sy", `${street.y}px`);

      glow.style.transform = `translate3d(${lamp.x}px, ${lamp.y}px, 0)`;

      if (trainRef.current) {
        trainRef.current.style.opacity = sim.train.active ? "1" : "0";
        trainRef.current.style.transform = `translate3d(${sim.train.x}px, ${TRAIN.y}px, 0)`;
      }
      if (discRef.current) {
        discRef.current.style.transform = `translate3d(${sim.disc.x - 44}px, ${sim.disc.y - 44}px, 0) rotate(${sim.time * (sim.disc.held ? 420 : 40)}deg)`;
      }
      if (handRef.current) {
        if (sim.hand) {
          handRef.current.dataset.ch = sim.hand.ch;
          handRef.current.textContent = sim.hand.ch;
          handRef.current.style.opacity = String(
            Math.max(0, 1 - sim.hand.age / 1.35),
          );
          handRef.current.style.transform = `translate3d(${lamp.x + 28}px, ${lamp.y - 36}px, 0)`;
        } else {
          handRef.current.style.opacity = "0";
        }
      }

      drawFx(ctx, sim, input.view, scale, reduced, dustRef.current, now);

      if (now - hudAt > 120) {
        hudAt = now;
        const room = roomAt(sim.lamp.x, sim.lamp.y);
        setHud((prev) => {
          if (
            prev.room === room &&
            prev.whisper === sim.whisper &&
            prev.radio === sim.radioOn &&
            prev.fridge === sim.fridgeOpen &&
            prev.hint === !sim.moved
          ) {
            return prev;
          }
          return {
            room,
            whisper: sim.whisper,
            radio: sim.radioOn,
            fridge: sim.fridgeOpen,
            hint: !sim.moved,
          };
        });
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="elsewhere"
      data-mood="sodium"
      data-room="stoop"
      tabIndex={0}
      role="application"
      aria-label="A dark house you walk with a light. Move. Click things. Type a letter."
    >
      <div className="elsewhere-stage">
        <div ref={camRef} className="elsewhere-cam">
          <ElsewhereHouse />
        </div>
        <div ref={darkRef} className="elsewhere-dark" />
        <canvas ref={fxRef} className="elsewhere-fx" />
        <div ref={glowRef} className="elsewhere-glow" />
        <div ref={handRef} className="elsewhere-hand" aria-hidden="true" />
      </div>

      <div className="elsewhere-hud">
        <LabMark tone="elsewhere" />
        <p className="elsewhere-room" aria-live="off">
          {hud.room === "night" ? "outside" : hud.room}
        </p>
        {hud.hint ? (
          <p className="elsewhere-hint">{elsewhereCopy.hint}</p>
        ) : null}
        {hud.whisper ? (
          <p className="elsewhere-whisper" aria-live="polite">
            {hud.whisper}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function drawFx(
  ctx: CanvasRenderingContext2D,
  sim: Sim,
  view: { w: number; h: number },
  scale: number,
  reduced: boolean,
  dust: Dust[],
  now: number,
) {
  ctx.clearRect(0, 0, view.w, view.h);
  const lamp = worldToScreen(sim.lamp.x, sim.lamp.y, sim.camera, scale);
  const mood = lampMood(sim);
  const warm = mood === "cool" ? "180, 220, 255" : mood === "star" ? "210, 230, 255" : "255, 168, 74";

  if (!reduced) {
    for (const mote of dust) {
      const x = ((mote.x + (now / 1000) * mote.v * 0.15) % 100) * 0.01 * view.w;
      const y = ((mote.y + (now / 1800) * mote.v * 0.08) % 100) * 0.01 * view.h;
      ctx.fillStyle = `rgba(${warm}, ${0.08 * mote.z})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }
  }

  for (const moth of sim.moths) {
    const pos = worldToScreen(moth.x, moth.y, sim.camera, scale);
    if (pos.x < -20 || pos.y < -20 || pos.x > view.w + 20 || pos.y > view.h + 20) {
      continue;
    }
    const flap = moth.landed ? 0.2 : 0.55 + Math.sin(sim.time * 18 + moth.phase) * 0.35;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.fillStyle = `rgba(236, 220, 176, ${moth.landed ? 0.85 : 0.55})`;
    ctx.beginPath();
    ctx.ellipse(-4 * flap, 0, 5 * flap, 2.2, -0.5, 0, Math.PI * 2);
    ctx.ellipse(4 * flap, 0, 5 * flap, 2.2, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (sim.train.active) {
    for (let i = 0; i < 5; i += 1) {
      const wx = sim.train.x + 70 + i * 88;
      const wy = TRAIN.y + 48;
      const pos = worldToScreen(wx, wy, sim.camera, scale);
      const g = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, 36);
      g.addColorStop(0, "rgba(255, 236, 170, 0.85)");
      g.addColorStop(1, "rgba(255, 236, 170, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 36, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const halo = ctx.createRadialGradient(lamp.x, lamp.y, 4, lamp.x, lamp.y, 70);
  halo.addColorStop(0, `rgba(${warm}, 0.55)`);
  halo.addColorStop(1, `rgba(${warm}, 0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(lamp.x, lamp.y, 70, 0, Math.PI * 2);
  ctx.fill();
}
