export const MAX_BODIES = 88;
export const WORM_LEN = 20;
export const GRAVITY = 1680;
export const HUES = [8, 28, 48, 162, 196, 312, 338] as const;

export type BodyKind = "blob" | "letter" | "face";

export type Body = {
  id: number;
  kind: BodyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  letter: string | null;
  bounce: number;
};

export type Vec = { x: number; y: number };

export type PlaySim = {
  w: number;
  h: number;
  bodies: Body[];
  gravity: Vec;
  gravityAngle: number;
  nextId: number;
  pointer: Vec;
  worm: Vec[];
  eaten: number;
  reducedMotion: boolean;
};

export type PlayInput = {
  pointer: Vec | null;
  reducedMotion: boolean;
};

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function hueAt(index: number): number {
  return HUES[((index % HUES.length) + HUES.length) % HUES.length] ?? HUES[0];
}

export function setGravityAngle(sim: PlaySim, angle: number): void {
  sim.gravityAngle = angle;
  sim.gravity.x = Math.sin(angle) * GRAVITY;
  sim.gravity.y = Math.cos(angle) * GRAVITY;
}

export function flipGravity(sim: PlaySim): void {
  setGravityAngle(sim, sim.gravityAngle + Math.PI);
}

function makeBody(
  sim: PlaySim,
  partial: Omit<Body, "id" | "bounce"> & { bounce?: number },
): Body {
  const body: Body = {
    id: sim.nextId,
    bounce: 0,
    ...partial,
  };
  sim.nextId += 1;
  return body;
}

function pushBody(sim: PlaySim, body: Body) {
  sim.bodies.push(body);
  while (sim.bodies.length > MAX_BODIES) sim.bodies.shift();
}

export function spawnBlob(
  sim: PlaySim,
  x: number,
  y: number,
  extras: Partial<Pick<Body, "r" | "vx" | "vy" | "hue" | "kind">> = {},
): Body {
  const kind = extras.kind ?? (sim.nextId % 7 === 0 ? "face" : "blob");
  const r =
    extras.r ??
    (kind === "face" ? 22 + (sim.nextId % 8) : 14 + (sim.nextId % 16));
  const body = makeBody(sim, {
    kind,
    x: clamp(x, r, Math.max(r, sim.w - r)),
    y: clamp(y, r, Math.max(r, sim.h - r)),
    vx: extras.vx ?? (sim.nextId % 11) - 5,
    vy: extras.vy ?? -40 - (sim.nextId % 80),
    r,
    hue: extras.hue ?? hueAt(sim.nextId),
    letter: null,
  });
  pushBody(sim, body);
  return body;
}

export function spawnLetter(sim: PlaySim, raw: string, x?: number): Body | null {
  const letter = raw.toLowerCase();
  if (!/^[a-z0-9]$/.test(letter)) return null;
  const r = 26;
  const body = makeBody(sim, {
    kind: "letter",
    x: clamp(x ?? sim.pointer.x, r, Math.max(r, sim.w - r)),
    y: r + 8,
    vx: (sim.nextId % 9) - 4,
    vy: 20,
    r,
    hue: hueAt(letter.charCodeAt(0)),
    letter,
  });
  pushBody(sim, body);
  return body;
}

export function spray(
  sim: PlaySim,
  x: number,
  y: number,
  count: number,
  power = 320,
): void {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2 + sim.nextId * 0.15;
    spawnBlob(sim, x, y, {
      r: 10 + (i % 7),
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      kind: "blob",
    });
  }
}

export function hitBody(sim: PlaySim, x: number, y: number): Body | null {
  for (let i = sim.bodies.length - 1; i >= 0; i -= 1) {
    const body = sim.bodies[i];
    if (!body) continue;
    if (Math.hypot(body.x - x, body.y - y) <= body.r + 4) return body;
  }
  return null;
}

export function popBody(sim: PlaySim, id: number): boolean {
  const index = sim.bodies.findIndex((body) => body.id === id);
  if (index < 0) return false;
  const body = sim.bodies[index];
  if (!body) return false;
  sim.bodies.splice(index, 1);
  if (body.r > 16 && body.kind !== "letter") {
    for (let i = 0; i < 3; i += 1) {
      const angle = (-Math.PI / 2) + (i - 1) * 0.8;
      spawnBlob(sim, body.x, body.y, {
        r: Math.max(8, body.r * 0.48),
        vx: Math.cos(angle) * 260,
        vy: Math.sin(angle) * 260,
        hue: body.hue,
        kind: "blob",
      });
    }
  }
  return true;
}

export function popAt(sim: PlaySim, x: number, y: number): boolean {
  const hit = hitBody(sim, x, y);
  if (!hit) return false;
  return popBody(sim, hit.id);
}

export function popOldest(sim: PlaySim): boolean {
  const first = sim.bodies[0];
  if (!first) return false;
  return popBody(sim, first.id);
}

export function clearPlay(sim: PlaySim): void {
  sim.bodies = [];
}

export function nibble(sim: PlaySim): number {
  const head = sim.worm[0];
  if (!head) return 0;
  let eaten = 0;
  sim.bodies = sim.bodies.filter((body) => {
    if (body.kind === "letter") return true;
    if (body.r > 20) return true;
    if (Math.hypot(body.x - head.x, body.y - head.y) < body.r + 12) {
      eaten += 1;
      return false;
    }
    return true;
  });
  sim.eaten += eaten;
  return eaten;
}

function bounceWalls(sim: PlaySim, body: Body) {
  const rest = 0.68;
  if (body.x < body.r) {
    body.x = body.r;
    body.vx = Math.abs(body.vx) * rest;
    body.bounce = 1;
  } else if (body.x > sim.w - body.r) {
    body.x = sim.w - body.r;
    body.vx = -Math.abs(body.vx) * rest;
    body.bounce = 1;
  }
  if (body.y < body.r) {
    body.y = body.r;
    body.vy = Math.abs(body.vy) * rest;
    body.bounce = 1;
  } else if (body.y > sim.h - body.r) {
    body.y = sim.h - body.r;
    body.vy = -Math.abs(body.vy) * rest;
    body.bounce = 1;
  }
}

function collide(a: Body, b: Body) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const min = a.r + b.r;
  if (dist >= min) return;
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = min - dist;
  const ma = a.r * a.r;
  const mb = b.r * b.r;
  const total = ma + mb;
  a.x -= nx * overlap * (mb / total);
  a.y -= ny * overlap * (mb / total);
  b.x += nx * overlap * (ma / total);
  b.y += ny * overlap * (ma / total);
  const velAlong = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (velAlong > 0) return;
  const impulse = (-1.72 * velAlong) / (1 / ma + 1 / mb);
  a.vx -= (impulse / ma) * nx;
  a.vy -= (impulse / ma) * ny;
  b.vx += (impulse / mb) * nx;
  b.vy += (impulse / mb) * ny;
  a.bounce = Math.max(a.bounce, 0.7);
  b.bounce = Math.max(b.bounce, 0.7);
}

function stepWorm(sim: PlaySim, input: PlayInput) {
  const target = input.pointer ?? sim.pointer;
  if (input.pointer) {
    sim.pointer.x = input.pointer.x;
    sim.pointer.y = input.pointer.y;
  }
  if (sim.worm.length === 0) {
    sim.worm.push({ x: target.x, y: target.y });
  }
  if (input.reducedMotion) {
    sim.worm = [{ x: target.x, y: target.y }];
    return;
  }
  const head = sim.worm[0];
  if (!head) return;
  head.x += (target.x - head.x) * 0.38;
  head.y += (target.y - head.y) * 0.38;
  for (let i = 1; i < sim.worm.length; i += 1) {
    const prev = sim.worm[i - 1];
    const node = sim.worm[i];
    if (!prev || !node) continue;
    node.x += (prev.x - node.x) * 0.42;
    node.y += (prev.y - node.y) * 0.42;
  }
  if (sim.worm.length < WORM_LEN) {
    const last = sim.worm[sim.worm.length - 1];
    if (last) sim.worm.push({ x: last.x, y: last.y });
  }
}

export function stepPlay(sim: PlaySim, input: PlayInput, dt: number): PlaySim {
  const d = clamp(dt, 0, 0.04);
  sim.reducedMotion = input.reducedMotion;
  stepWorm(sim, input);
  if (input.reducedMotion) {
    nibble(sim);
    return sim;
  }

  for (const body of sim.bodies) {
    body.vx += sim.gravity.x * d;
    body.vy += sim.gravity.y * d;
    body.vx *= Math.exp(-d * 0.18);
    body.vy *= Math.exp(-d * 0.18);
    body.x += body.vx * d;
    body.y += body.vy * d;
    body.bounce *= Math.exp(-d * 8);
    bounceWalls(sim, body);
  }

  for (let i = 0; i < sim.bodies.length; i += 1) {
    const a = sim.bodies[i];
    if (!a) continue;
    for (let j = i + 1; j < sim.bodies.length; j += 1) {
      const b = sim.bodies[j];
      if (!b) continue;
      collide(a, b);
    }
  }

  nibble(sim);
  return sim;
}

export function resizePlay(sim: PlaySim, w: number, h: number): void {
  sim.w = Math.max(200, w);
  sim.h = Math.max(200, h);
  for (const body of sim.bodies) {
    body.x = clamp(body.x, body.r, sim.w - body.r);
    body.y = clamp(body.y, body.r, sim.h - body.r);
  }
}

export function createPlay(w = 800, h = 560): PlaySim {
  const sim: PlaySim = {
    w,
    h,
    bodies: [],
    gravity: { x: 0, y: GRAVITY },
    gravityAngle: 0,
    nextId: 1,
    pointer: { x: w * 0.5, y: h * 0.4 },
    worm: [{ x: w * 0.5, y: h * 0.4 }],
    eaten: 0,
    reducedMotion: false,
  };
  const seeds = [
    [0.22, 0.28],
    [0.48, 0.2],
    [0.72, 0.3],
    [0.36, 0.42],
    [0.62, 0.38],
    [0.18, 0.55],
    [0.8, 0.52],
    [0.5, 0.62],
  ] as const;
  for (const [nx, ny] of seeds) {
    spawnBlob(sim, w * nx, h * ny);
  }
  return sim;
}
