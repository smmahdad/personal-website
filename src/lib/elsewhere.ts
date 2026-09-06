import { elsewhereCopy, radioLines, whispers } from "@/content/elsewhere";

export const WORLD = { w: 4600, h: 2700 } as const;

export type RoomId =
  | "stoop"
  | "hall"
  | "living"
  | "kitchen"
  | "roof"
  | "well"
  | "under"
  | "night";

export type Rect = { x: number; y: number; w: number; h: number };

export type Room = Rect & {
  id: Exclude<RoomId, "night">;
  name: string;
};

export const rooms: readonly Room[] = [
  { id: "stoop", name: "stoop", x: 80, y: 1100, w: 780, h: 780 },
  { id: "hall", name: "hall", x: 860, y: 1100, w: 480, h: 780 },
  { id: "living", name: "living", x: 1340, y: 980, w: 1180, h: 900 },
  { id: "kitchen", name: "kitchen", x: 2520, y: 1100, w: 820, h: 780 },
  { id: "roof", name: "roof", x: 1340, y: 160, w: 1180, h: 820 },
  { id: "well", name: "the well", x: 3340, y: 220, w: 860, h: 1760 },
  { id: "under", name: "under", x: 1340, y: 1940, w: 1180, h: 640 },
];

export type PropId =
  | "radio"
  | "fridge"
  | "disc"
  | "clock"
  | "window"
  | "glass"
  | "bench";

export type Prop = Rect & { id: PropId; room: Exclude<RoomId, "night"> };

export const props: readonly Prop[] = [
  { id: "window", room: "living", x: 1680, y: 1040, w: 420, h: 280 },
  { id: "radio", room: "living", x: 1520, y: 1648, w: 120, h: 72 },
  { id: "clock", room: "living", x: 2288, y: 1088, w: 88, h: 88 },
  { id: "fridge", room: "kitchen", x: 3110, y: 1288, w: 150, h: 360 },
  { id: "glass", room: "kitchen", x: 2688, y: 1544, w: 56, h: 72 },
  { id: "disc", room: "roof", x: 2100, y: 660, w: 88, h: 88 },
  { id: "bench", room: "under", x: 1680, y: 2288, w: 260, h: 64 },
];

export const START = { x: 390, y: 1540 };
export const DISC_HOME = { x: 2144, y: 704 };
export const STREET_LAMP = { x: 220, y: 1320 };
export const TRAIN = { w: 540, h: 150, y: 1640, startX: 1180, endX: 2520 };
export const TRAIN_PERIOD = 20;

export type Vec = { x: number; y: number };

export type Lamp = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type Moth = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  landed: boolean;
};

export type Disc = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  held: boolean;
};

export type TrainState = {
  t: number;
  x: number;
  y: number;
  active: boolean;
  boarded: boolean;
};

export type Sim = {
  lamp: Lamp;
  pointer: Vec;
  camera: Vec;
  moths: Moth[];
  disc: Disc;
  train: TrainState;
  fridgeOpen: boolean;
  radioOn: boolean;
  radioIndex: number;
  stillness: number;
  whisper: string | null;
  whisperAge: number;
  hand: { ch: string; age: number } | null;
  shake: number;
  time: number;
  moved: boolean;
};

export type Input = {
  pointer: Vec | null;
  keys: readonly string[];
  holdDisc: boolean;
  toggleRadio: boolean;
  toggleFridge: boolean;
  tapClock: boolean;
  tapBench: boolean;
  typed: string | null;
  reducedMotion: boolean;
  view: { w: number; h: number };
};

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function viewScale(viewH: number): number {
  return viewH / 920;
}

export function contains(rect: Rect, x: number, y: number, pad = 0): boolean {
  return (
    x >= rect.x - pad &&
    x <= rect.x + rect.w + pad &&
    y >= rect.y - pad &&
    y <= rect.y + rect.h + pad
  );
}

export function roomAt(x: number, y: number): RoomId {
  for (const room of rooms) {
    if (contains(room, x, y)) return room.id;
  }
  return "night";
}

export function roomById(id: Exclude<RoomId, "night">): Room {
  const found = rooms.find((room) => room.id === id);
  if (!found) throw new Error(`missing room ${id}`);
  return found;
}

export function hitProp(x: number, y: number, pad = 28): Prop | null {
  for (const prop of props) {
    if (contains(prop, x, y, pad)) return prop;
  }
  return null;
}

export function screenToWorld(
  sx: number,
  sy: number,
  cam: Vec,
  scale: number,
): Vec {
  return { x: cam.x + sx / scale, y: cam.y + sy / scale };
}

export function worldToScreen(
  wx: number,
  wy: number,
  cam: Vec,
  scale: number,
): Vec {
  return { x: (wx - cam.x) * scale, y: (wy - cam.y) * scale };
}

export function seedMoths(count = 18): Moth[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 280 + ((i * 197) % 4000),
    y: 280 + ((i * 137) % 2100),
    vx: ((i * 13) % 11) - 5,
    vy: ((i * 7) % 11) - 5,
    phase: i * 0.7,
    landed: false,
  }));
}

export function createSim(): Sim {
  return {
    lamp: { x: START.x, y: START.y, vx: 0, vy: 0 },
    pointer: { x: START.x, y: START.y },
    camera: { x: START.x - 420, y: START.y - 520 },
    moths: seedMoths(),
    disc: { x: DISC_HOME.x, y: DISC_HOME.y, vx: 0, vy: 0, held: false },
    train: {
      t: 7,
      x: TRAIN.startX,
      y: TRAIN.y,
      active: false,
      boarded: false,
    },
    fridgeOpen: false,
    radioOn: false,
    radioIndex: 0,
    stillness: 0,
    whisper: elsewhereCopy.comeIn,
    whisperAge: 0,
    hand: null,
    shake: 0,
    time: 0,
    moved: false,
  };
}

export function lampRadius(sim: Sim, reducedMotion = false): number {
  if (reducedMotion) return 340;
  const room = roomAt(sim.lamp.x, sim.lamp.y);
  let radius = 168;
  if (room === "roof") radius = 220;
  if (room === "well") radius = 128;
  if (room === "night") radius = 148;
  if (room === "under") radius = 156;
  if (sim.fridgeOpen && room === "kitchen") radius = 248;
  if (sim.stillness > 6) radius *= 0.7;
  return radius;
}

export function cameraTilt(sim: Sim): number {
  const room = roomAt(sim.lamp.x, sim.lamp.y);
  if (room !== "well") return 0;
  const well = roomById("well");
  const depth = clamp((sim.lamp.y - well.y) / well.h, 0, 1);
  return depth * 16;
}

export function lampMood(sim: Sim): "sodium" | "cool" | "star" {
  const room = roomAt(sim.lamp.x, sim.lamp.y);
  if (sim.fridgeOpen && (room === "kitchen" || room === "well")) return "cool";
  if (room === "roof" || room === "night") return "star";
  if (room === "under") return "cool";
  return "sodium";
}

function say(sim: Sim, line: string) {
  sim.whisper = line;
  sim.whisperAge = 0;
}

export function emptyInput(view = { w: 1280, h: 800 }): Input {
  return {
    pointer: null,
    keys: [],
    holdDisc: false,
    toggleRadio: false,
    toggleFridge: false,
    tapClock: false,
    tapBench: false,
    typed: null,
    reducedMotion: false,
    view,
  };
}

export function step(sim: Sim, input: Input, dt: number): Sim {
  const d = clamp(dt, 0, 0.05);
  sim.time += d;
  sim.whisperAge += d;
  sim.shake *= Math.exp(-d * 4.2);

  if (input.pointer) {
    sim.pointer.x = input.pointer.x;
    sim.pointer.y = input.pointer.y;
  }

  const keySpeed = 340;
  for (const raw of input.keys) {
    const key = raw.toLowerCase();
    if (key === "arrowup" || key === "w") sim.pointer.y -= keySpeed * d;
    if (key === "arrowdown" || key === "s") sim.pointer.y += keySpeed * d;
    if (key === "arrowleft" || key === "a") sim.pointer.x -= keySpeed * d;
    if (key === "arrowright" || key === "d") sim.pointer.x += keySpeed * d;
  }

  sim.pointer.x = clamp(sim.pointer.x, 16, WORLD.w - 16);
  sim.pointer.y = clamp(sim.pointer.y, 16, WORLD.h - 16);

  if (input.reducedMotion) {
    sim.lamp.x = sim.pointer.x;
    sim.lamp.y = sim.pointer.y;
    sim.lamp.vx = 0;
    sim.lamp.vy = 0;
  } else {
    const stiffness = 22;
    const damping = 7.2;
    const ax = (sim.pointer.x - sim.lamp.x) * stiffness - sim.lamp.vx * damping;
    const ay = (sim.pointer.y - sim.lamp.y) * stiffness - sim.lamp.vy * damping;
    sim.lamp.vx += ax * d;
    sim.lamp.vy += ay * d;
    sim.lamp.x += sim.lamp.vx * d;
    sim.lamp.y += sim.lamp.vy * d;
  }

  sim.lamp.x = clamp(sim.lamp.x, 16, WORLD.w - 16);
  sim.lamp.y = clamp(sim.lamp.y, 16, WORLD.h - 16);

  const speed = Math.hypot(sim.lamp.vx, sim.lamp.vy);
  if (speed > 16 || (input.pointer && sim.moved === false && sim.time > 0.05)) {
    if (Math.hypot(sim.lamp.x - START.x, sim.lamp.y - START.y) > 36) {
      sim.moved = true;
    }
  }
  if (speed > 18) sim.stillness = 0;
  else sim.stillness += d;

  if (input.toggleRadio) {
    sim.radioOn = !sim.radioOn;
    if (sim.radioOn) {
      say(sim, radioLines[sim.radioIndex % radioLines.length] ?? radioLines[0]);
      sim.radioIndex += 1;
    }
  }

  if (input.toggleFridge) sim.fridgeOpen = !sim.fridgeOpen;
  if (input.tapClock) say(sim, elsewhereCopy.clock);
  if (input.tapBench) say(sim, elsewhereCopy.bench);

  if (input.typed && /^[a-z]$/i.test(input.typed)) {
    sim.hand = { ch: input.typed.toLowerCase(), age: 0 };
  }
  if (sim.hand) {
    sim.hand.age += d;
    if (sim.hand.age > 1.35) sim.hand = null;
  }

  if (sim.stillness > 8 && sim.moved) {
    if (!sim.whisper || sim.whisperAge > 4) {
      const index = Math.floor(sim.time) % whispers.length;
      say(sim, whispers[index] ?? elsewhereCopy.still);
    }
  }

  if (sim.whisper && sim.whisperAge > 5.2) sim.whisper = null;

  stepDisc(sim, input, d);
  stepTrain(sim, input, d);
  stepMoths(sim, d, input.reducedMotion);
  stepCamera(sim, input, d);

  return sim;
}

function stepDisc(sim: Sim, input: Input, d: number) {
  const over = contains(
    { x: sim.disc.x - 24, y: sim.disc.y - 24, w: 48, h: 48 },
    sim.lamp.x,
    sim.lamp.y,
    40,
  );

  if (input.holdDisc && (sim.disc.held || over)) {
    sim.disc.held = true;
    sim.disc.vx = sim.lamp.vx * 2.4;
    sim.disc.vy = sim.lamp.vy * 2.4;
    sim.disc.x = sim.lamp.x + 18;
    sim.disc.y = sim.lamp.y + 10;
    return;
  }

  if (sim.disc.held && !input.holdDisc) {
    sim.disc.held = false;
    sim.disc.vx += sim.lamp.vx * 1.8;
    sim.disc.vy += sim.lamp.vy * 1.8 - 80;
  }

  if (input.reducedMotion) {
    sim.disc.x += (DISC_HOME.x - sim.disc.x) * 0.2;
    sim.disc.y += (DISC_HOME.y - sim.disc.y) * 0.2;
    sim.disc.vx = 0;
    sim.disc.vy = 0;
    return;
  }

  sim.disc.vy += 420 * d;
  sim.disc.x += sim.disc.vx * d;
  sim.disc.y += sim.disc.vy * d;
  sim.disc.vx += (DISC_HOME.x - sim.disc.x) * 0.35 * d;
  sim.disc.vy += (DISC_HOME.y - sim.disc.y) * 0.18 * d;
  sim.disc.vx *= Math.exp(-d * 0.55);
  sim.disc.vy *= Math.exp(-d * 0.28);

  if (sim.disc.x < 24 || sim.disc.x > WORLD.w - 24) {
    sim.disc.vx *= -0.46;
    sim.disc.x = clamp(sim.disc.x, 24, WORLD.w - 24);
  }
  if (sim.disc.y < 24 || sim.disc.y > WORLD.h - 24) {
    sim.disc.vy *= -0.4;
    sim.disc.y = clamp(sim.disc.y, 24, WORLD.h - 24);
  }
}

function stepTrain(sim: Sim, input: Input, d: number) {
  if (input.reducedMotion) {
    sim.train.active = true;
    sim.train.x = 1680;
    sim.train.y = TRAIN.y;
    sim.train.boarded = false;
    return;
  }

  sim.train.t += d;
  if (!sim.train.active && sim.train.t >= TRAIN_PERIOD) {
    sim.train.active = true;
    sim.train.x = TRAIN.startX;
    sim.train.y = TRAIN.y;
    sim.train.boarded = false;
    sim.train.t = 0;
    sim.shake = 3.2;
  }

  if (!sim.train.active) return;

  sim.train.x += 390 * d;
  const cx = sim.train.x + TRAIN.w * 0.45;
  const cy = sim.train.y + TRAIN.h * 0.45;
  const near = Math.hypot(sim.lamp.x - cx, sim.lamp.y - cy) < 150;
  if (near) sim.train.boarded = true;

  if (sim.train.boarded) {
    sim.lamp.x = cx;
    sim.lamp.y = cy;
    sim.lamp.vx = 390;
    sim.lamp.vy = 0;
    sim.pointer.x = cx;
    sim.pointer.y = cy;
    sim.shake = Math.max(sim.shake, 4.4);
  } else {
    sim.shake = Math.max(sim.shake, 2.1);
  }

  if (sim.train.x > TRAIN.endX) {
    if (sim.train.boarded) {
      sim.lamp.x = 1880;
      sim.lamp.y = 2220;
      sim.lamp.vx = 0;
      sim.lamp.vy = 0;
      sim.pointer.x = sim.lamp.x;
      sim.pointer.y = sim.lamp.y;
      say(sim, "the next one is late.");
    }
    sim.train.active = false;
    sim.train.boarded = false;
    sim.train.x = TRAIN.startX;
  }
}

function stepMoths(sim: Sim, d: number, reduced: boolean) {
  for (const moth of sim.moths) {
    if (reduced) {
      moth.landed = false;
      continue;
    }
    const dx = sim.lamp.x - moth.x;
    const dy = sim.lamp.y - moth.y;
    const dist = Math.hypot(dx, dy) || 1;
    const lampSpeed = Math.hypot(sim.lamp.vx, sim.lamp.vy);
    if (dist < 42 && lampSpeed < 22) {
      moth.landed = true;
      moth.vx *= 0.82;
      moth.vy *= 0.82;
    } else {
      moth.landed = false;
      moth.vx += (dx / dist) * 30 * d + Math.sin(sim.time * 2 + moth.phase) * 16 * d;
      moth.vy += (dy / dist) * 30 * d + Math.cos(sim.time * 1.6 + moth.phase) * 14 * d;
    }
    const max = moth.landed ? 18 : 96;
    const speed = Math.hypot(moth.vx, moth.vy) || 1;
    if (speed > max) {
      moth.vx = (moth.vx / speed) * max;
      moth.vy = (moth.vy / speed) * max;
    }
    moth.x = clamp(moth.x + moth.vx * d, 8, WORLD.w - 8);
    moth.y = clamp(moth.y + moth.vy * d, 8, WORLD.h - 8);
    moth.phase += d;
  }
}

function stepCamera(sim: Sim, input: Input, d: number) {
  const scale = viewScale(input.view.h);
  const viewW = input.view.w / scale;
  const viewH = input.view.h / scale;
  const targetX = sim.lamp.x - viewW * 0.5;
  const targetY = sim.lamp.y - viewH * 0.56;
  const maxX = Math.max(0, WORLD.w - viewW);
  const maxY = Math.max(0, WORLD.h - viewH);
  const tx = clamp(targetX, 0, maxX);
  const ty = clamp(targetY, 0, maxY);
  if (input.reducedMotion) {
    sim.camera.x = tx;
    sim.camera.y = ty;
    return;
  }
  const k = 1 - Math.exp(-d * 3.4);
  sim.camera.x += (tx - sim.camera.x) * k;
  sim.camera.y += (ty - sim.camera.y) * k;
}
