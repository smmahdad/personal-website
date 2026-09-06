import { describe, expect, it } from "vitest";
import {
  GRAVITY,
  MAX_BODIES,
  clearPlay,
  createPlay,
  flipGravity,
  hitBody,
  popAt,
  popBody,
  resizePlay,
  setGravityAngle,
  spawnBlob,
  spawnLetter,
  spray,
  stepPlay,
} from "./play";

function play(seconds: number, sim = createPlay(), reduced = false) {
  const frames = Math.round(seconds * 60);
  for (let i = 0; i < frames; i += 1) {
    stepPlay(sim, { pointer: sim.pointer, reducedMotion: reduced }, 1 / 60);
  }
  return sim;
}

describe("play pit", () => {
  it("starts with a handful of bouncing blobs", () => {
    const sim = createPlay(800, 560);
    expect(sim.bodies.length).toBeGreaterThanOrEqual(6);
    expect(sim.gravity.y).toBe(GRAVITY);
    expect(sim.gravity.x).toBe(0);
  });

  it("lets gravity pull a blob down", () => {
    const sim = createPlay(800, 560);
    clearPlay(sim);
    const blob = spawnBlob(sim, 400, 80, { r: 16, vx: 0, vy: 0, kind: "blob" });
    play(0.6, sim);
    expect(blob.y).toBeGreaterThan(80);
  });

  it("flips gravity so blobs fall up", () => {
    const sim = createPlay(800, 560);
    clearPlay(sim);
    const blob = spawnBlob(sim, 400, 400, { r: 16, vx: 0, vy: 0, kind: "blob" });
    flipGravity(sim);
    expect(sim.gravity.y).toBeCloseTo(-GRAVITY, 5);
    play(0.6, sim);
    expect(blob.y).toBeLessThan(400);
  });

  it("tilts gravity to the side", () => {
    const sim = createPlay(800, 560);
    setGravityAngle(sim, Math.PI / 2);
    expect(sim.gravity.x).toBeCloseTo(GRAVITY, 5);
    expect(sim.gravity.y).toBeCloseTo(0, 5);
  });

  it("keeps blobs inside the walls", () => {
    const sim = createPlay(400, 300);
    clearPlay(sim);
    spawnBlob(sim, 20, 20, { r: 18, vx: -800, vy: -800, kind: "blob" });
    play(1.2, sim);
    for (const body of sim.bodies) {
      expect(body.x).toBeGreaterThanOrEqual(body.r - 0.5);
      expect(body.x).toBeLessThanOrEqual(sim.w - body.r + 0.5);
      expect(body.y).toBeGreaterThanOrEqual(body.r - 0.5);
      expect(body.y).toBeLessThanOrEqual(sim.h - body.r + 0.5);
    }
  });

  it("drops letters from the top", () => {
    const sim = createPlay();
    expect(spawnLetter(sim, "P")).toMatchObject({ letter: "p", kind: "letter" });
    expect(spawnLetter(sim, "!!")).toBeNull();
  });

  it("pops a fat blob into smaller ones", () => {
    const sim = createPlay();
    clearPlay(sim);
    const blob = spawnBlob(sim, 200, 200, { r: 28, kind: "blob" });
    expect(popBody(sim, blob.id)).toBe(true);
    expect(sim.bodies.length).toBe(3);
    expect(sim.bodies.every((body) => body.r < 28)).toBe(true);
  });

  it("pops the body under a point", () => {
    const sim = createPlay();
    clearPlay(sim);
    spawnBlob(sim, 120, 140, { r: 20, kind: "blob" });
    expect(hitBody(sim, 120, 140)?.r).toBe(20);
    expect(popAt(sim, 120, 140)).toBe(true);
  });

  it("caps how many bodies can pile up", () => {
    const sim = createPlay(600, 400);
    spray(sim, 300, 200, MAX_BODIES + 20);
    expect(sim.bodies.length).toBeLessThanOrEqual(MAX_BODIES);
  });

  it("lets the worm eat a small nearby blob", () => {
    const sim = createPlay();
    clearPlay(sim);
    spawnBlob(sim, 200, 200, { r: 10, vx: 0, vy: 0, kind: "blob" });
    sim.worm = [{ x: 200, y: 200 }];
    sim.pointer = { x: 200, y: 200 };
    stepPlay(sim, { pointer: { x: 200, y: 200 }, reducedMotion: true }, 1 / 60);
    expect(sim.eaten).toBeGreaterThanOrEqual(1);
    expect(sim.bodies).toHaveLength(0);
  });

  it("does not slide bodies when motion is reduced", () => {
    const sim = createPlay();
    clearPlay(sim);
    const blob = spawnBlob(sim, 220, 180, { r: 16, vx: 0, vy: 0, kind: "blob" });
    const y = blob.y;
    play(0.8, sim, true);
    expect(blob.y).toBe(y);
  });

  it("resizes without losing bodies", () => {
    const sim = createPlay(800, 600);
    const count = sim.bodies.length;
    resizePlay(sim, 320, 240);
    expect(sim.w).toBe(320);
    expect(sim.h).toBe(240);
    expect(sim.bodies).toHaveLength(count);
  });
});
