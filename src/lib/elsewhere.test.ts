import { describe, expect, it } from "vitest";
import { elsewhereCopy, radioLines, whispers } from "@/content/elsewhere";
import {
  TRAIN,
  TRAIN_PERIOD,
  contains,
  createSim,
  emptyInput,
  hitProp,
  lampMood,
  lampRadius,
  roomAt,
  rooms,
  screenToWorld,
  step,
  worldToScreen,
} from "./elsewhere";

const careerTells =
  /authorize|swipe to|rippling|amazon ads|frisbee|american sign|resume|linkedin|product hunt|grok bot|spend management|frequency capping/i;

function play(seconds: number, input = emptyInput(), sim = createSim()) {
  const frames = Math.round(seconds * 60);
  for (let i = 0; i < frames; i += 1) step(sim, input, 1 / 60);
  return sim;
}

describe("elsewhere world", () => {
  it("starts on the stoop, not in a labeled job room", () => {
    expect(roomAt(390, 1540)).toBe("stoop");
    expect(rooms.map((room) => room.id)).toEqual([
      "stoop",
      "hall",
      "living",
      "kitchen",
      "roof",
      "well",
      "under",
    ]);
  });

  it("keeps copy free of career-toy language", () => {
    const blob = JSON.stringify({ elsewhereCopy, radioLines, whispers });
    expect(blob).not.toMatch(careerTells);
    expect(blob).not.toMatch(/placeholder/i);
  });

  it("pulls the lamp toward the pointer", () => {
    const sim = createSim();
    const input = emptyInput();
    input.pointer = { x: sim.lamp.x + 240, y: sim.lamp.y };
    play(0.8, input, sim);
    expect(sim.lamp.x).toBeGreaterThan(sim.pointer.x - 240);
    expect(sim.lamp.x).toBeGreaterThan(390);
  });

  it("moves the pointer from keys", () => {
    const sim = createSim();
    const input = emptyInput();
    input.keys = ["ArrowRight", "ArrowDown"];
    play(0.5, input, sim);
    expect(sim.pointer.x).toBeGreaterThan(390);
    expect(sim.pointer.y).toBeGreaterThan(1540);
  });

  it("snaps the lamp when motion is reduced", () => {
    const sim = createSim();
    const input = emptyInput();
    input.reducedMotion = true;
    input.pointer = { x: 2000, y: 1400 };
    step(sim, input, 1 / 60);
    expect(sim.lamp.x).toBe(2000);
    expect(sim.lamp.y).toBe(1400);
    expect(lampRadius(sim, true)).toBeGreaterThan(300);
  });

  it("finds props and rooms by position", () => {
    const radio = hitProp(1560, 1680);
    expect(radio?.id).toBe("radio");
    expect(roomAt(1900, 1400)).toBe("living");
    expect(roomAt(10, 10)).toBe("night");
    expect(contains({ x: 0, y: 0, w: 10, h: 10 }, 5, 5)).toBe(true);
  });

  it("toggles radio and fridge, and answers the clock", () => {
    const sim = createSim();
    const radio = emptyInput();
    radio.toggleRadio = true;
    step(sim, radio, 1 / 60);
    expect(sim.radioOn).toBe(true);
    expect(radioLines).toContain(sim.whisper);

    const fridge = emptyInput();
    fridge.toggleFridge = true;
    step(sim, fridge, 1 / 60);
    expect(sim.fridgeOpen).toBe(true);
    expect(lampMood(sim)).toBe("sodium");

    const clock = emptyInput();
    clock.tapClock = true;
    step(sim, clock, 1 / 60);
    expect(sim.whisper).toBe("four seconds");
  });

  it("forms a brief hand from a typed letter", () => {
    const sim = createSim();
    const input = emptyInput();
    input.typed = "S";
    step(sim, input, 1 / 60);
    expect(sim.hand?.ch).toBe("s");
    play(1.6, emptyInput(), sim);
    expect(sim.hand).toBeNull();
  });

  it("lets the ring be carried then thrown", () => {
    const sim = createSim();
    sim.lamp.x = sim.disc.x;
    sim.lamp.y = sim.disc.y;
    sim.pointer.x = sim.disc.x;
    sim.pointer.y = sim.disc.y;
    const hold = emptyInput();
    hold.holdDisc = true;
    hold.pointer = { x: sim.disc.x + 80, y: sim.disc.y - 40 };
    play(0.3, hold, sim);
    expect(sim.disc.held).toBe(true);
    const release = emptyInput();
    play(0.4, release, sim);
    expect(sim.disc.held).toBe(false);
  });

  it("boards the train and drops you under the house", () => {
    const sim = createSim();
    sim.train.t = TRAIN_PERIOD;
    sim.lamp.x = TRAIN.startX + 200;
    sim.lamp.y = TRAIN.y + 40;
    sim.pointer.x = sim.lamp.x;
    sim.pointer.y = sim.lamp.y;
    play(0.2, emptyInput(), sim);
    expect(sim.train.active).toBe(true);
    expect(sim.train.boarded).toBe(true);
    play(4, emptyInput(), sim);
    expect(roomAt(sim.lamp.x, sim.lamp.y)).toBe("under");
    expect(sim.train.active).toBe(false);
  });

  it("whispers if you stand still after moving", () => {
    const sim = createSim();
    sim.moved = true;
    sim.lamp.vx = 0;
    sim.lamp.vy = 0;
    play(8.4, emptyInput(), sim);
    expect(sim.whisper).toBeTruthy();
    expect(whispers).toContain(sim.whisper);
  });

  it("converts screen and world space", () => {
    const cam = { x: 100, y: 50 };
    const world = screenToWorld(40, 20, cam, 2);
    expect(world).toEqual({ x: 120, y: 60 });
    expect(worldToScreen(120, 60, cam, 2)).toEqual({ x: 40, y: 20 });
  });
});
