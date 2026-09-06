export type ToyAction =
  | { type: "swipe" }
  | { type: "throw" }
  | { type: "sign"; word: string }
  | { type: "count" };

type Listener = (action: ToyAction) => void;

const listeners = new Set<Listener>();

export function emitToy(action: ToyAction) {
  for (const listener of listeners) listener(action);
}

export function subscribeToy(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
