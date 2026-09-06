import {
  charges,
  fortunes,
  type FsDir,
  type FsNode,
  shellRoot,
} from "@/content/lab";

export type ShellAction = "clear" | "exit" | "vim";

export type ShellResult = {
  lines: string[];
  cwd?: string;
  action?: ShellAction;
};

export const shellCommands = [
  "help",
  "whoami",
  "pwd",
  "ls",
  "cd",
  "cat",
  "open",
  "tree",
  "now",
  "date",
  "echo",
  "fortune",
  "authorize",
  "frisbee",
  "forecast",
  "sign",
  "agent",
  "clear",
  "exit",
] as const;

export function displayPwd(cwd: string): string {
  return cwd ? `~/${cwd}` : "~";
}

export function resolvePath(cwd: string, input: string): string {
  const raw = input.trim();
  if (!raw || raw === ".") return cwd;
  if (raw === "~" || raw === "/" || raw === "~/.") return "";

  let parts: string[];
  if (raw.startsWith("~/")) {
    parts = raw.slice(2).split("/").filter(Boolean);
  } else if (raw.startsWith("/")) {
    parts = raw.split("/").filter(Boolean);
    if (parts[0] === "home" && parts[1] === "sam") {
      parts = parts.slice(2);
    }
  } else {
    parts = [...(cwd ? cwd.split("/") : []), ...raw.split("/")];
  }

  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.join("/");
}

export function getNode(root: FsDir, path: string): FsNode | null {
  if (!path) return root;
  let node: FsNode = root;
  for (const part of path.split("/")) {
    if (node.kind !== "dir") return null;
    const next: FsNode | undefined = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

export type TreeEntry = {
  path: string;
  name: string;
  kind: "file" | "dir";
  depth: number;
  hidden: boolean;
};

export function listTree(
  root: FsDir,
  cwd = "",
  { hidden = false }: { hidden?: boolean } = {},
): TreeEntry[] {
  const start = getNode(root, cwd);
  if (!start || start.kind !== "dir") return [];

  const out: TreeEntry[] = [];
  const walk = (dir: FsDir, prefix: string, depth: number) => {
    const names = Object.keys(dir.children).sort();
    for (const name of names) {
      const isHidden = name.startsWith(".");
      if (isHidden && !hidden) continue;
      const node = dir.children[name];
      const path = prefix ? `${prefix}/${name}` : name;
      out.push({
        path,
        name,
        kind: node.kind,
        depth,
        hidden: isHidden,
      });
      if (node.kind === "dir") walk(node, path, depth + 1);
    }
  };
  walk(start, cwd, 0);
  return out;
}

function listNames(dir: FsDir, all: boolean, long: boolean): string[] {
  const names = Object.keys(dir.children).sort();
  const visible = all ? names : names.filter((name) => !name.startsWith("."));
  if (visible.length === 0) return [all ? "(empty)" : "(nothing visible. try ls -a)"];
  return visible.map((name) => {
    const node = dir.children[name];
    const mark = node.kind === "dir" ? `${name}/` : name;
    return long ? `${node.kind === "dir" ? "d" : "-"}  ${mark}` : mark;
  });
}

function printTree(dir: FsDir, all: boolean): string[] {
  const names = Object.keys(dir.children)
    .sort()
    .filter((name) => all || !name.startsWith("."));
  return names.flatMap((name, index) => {
    const node = dir.children[name];
    const last = index === names.length - 1;
    const branch = last ? "└─ " : "├─ ";
    const label = node.kind === "dir" ? `${name}/` : name;
    return [`${branch}${label}`, ...printTreeLines(node, "", last, all)];
  });
}

function printTreeLines(
  node: FsNode,
  prefix: string,
  last: boolean,
  all: boolean,
): string[] {
  if (node.kind !== "dir") return [];
  const childPrefix = prefix + (last ? "   " : "│  ");
  const names = Object.keys(node.children)
    .sort()
    .filter((name) => all || !name.startsWith("."));
  return names.flatMap((name, index) => {
    const child = node.children[name];
    const isLast = index === names.length - 1;
    const branch = isLast ? "└─ " : "├─ ";
    const label = child.kind === "dir" ? `${name}/` : name;
    return [`${childPrefix}${branch}${label}`, ...printTreeLines(child, childPrefix, isLast, all)];
  });
}

export type ShellContext = {
  cwd: string;
  root?: FsDir;
  now?: Date;
  rng?: () => number;
};

export function runShellCommand(input: string, ctx: ShellContext): ShellResult {
  const root = ctx.root ?? shellRoot;
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const lower = trimmed.toLowerCase();

  if (lower === "sudo make me a sandwich") {
    return { lines: ["okay."] };
  }
  if (lower === "make me a sandwich") {
    return { lines: ["what? make it yourself."] };
  }
  if (lower === "sudo rm -rf /" || lower === "sudo rm -rf ~") {
    return { lines: ["no. this disk is sentimental."] };
  }
  if (lower.startsWith("sudo ")) {
    return { lines: ["password: ****", "denied."] };
  }

  const [rawCmd, ...args] = trimmed.split(/\s+/);
  const cmd = rawCmd.toLowerCase();

  switch (cmd) {
    case "help":
    case "man":
      if (cmd === "man" && args[0] && args[0] !== "help" && args[0] !== "man") {
        return { lines: [`no manual for ${args[0]}. try cat.`] };
      }
      return {
        lines: [
          "whoami  ls  cd  cat  pwd  tree  now  date  fortune",
          "authorize  frisbee  forecast  sign  agent",
          "open  echo  clear  exit",
          "ls -a if you're nosy. arrows for history.",
        ],
      };
    case "whoami":
      return { lines: ["sam"] };
    case "pwd":
      return { lines: [displayPwd(ctx.cwd)] };
    case "ls": {
      const flags = args.filter((arg) => arg.startsWith("-")).join("");
      const target = args.find((arg) => !arg.startsWith("-")) ?? ".";
      const path = resolvePath(ctx.cwd, target);
      const node = getNode(root, path);
      if (!node) return { lines: [`ls: ${target}: no such file`] };
      if (node.kind === "file") return { lines: [target.split("/").pop() ?? target] };
      return {
        lines: listNames(node, flags.includes("a"), flags.includes("l")),
      };
    }
    case "cd": {
      const target = args[0] ?? "~";
      const path = resolvePath(ctx.cwd, target);
      const node = getNode(root, path);
      if (!node) return { lines: [`cd: ${target}: no such file`] };
      if (node.kind !== "dir") return { lines: [`cd: ${target}: not a directory`] };
      return { lines: [], cwd: path };
    }
    case "cat":
    case "less":
    case "more": {
      if (!args[0]) return { lines: [`${cmd}: need a file`] };
      const path = resolvePath(ctx.cwd, args[0]);
      const node = getNode(root, path);
      if (!node) return { lines: [`${cmd}: ${args[0]}: no such file`] };
      if (node.kind === "dir") return { lines: [`${cmd}: ${args[0]}: is a directory`] };
      const extra = node.href ? ["", node.href] : [];
      return { lines: [node.text, ...extra] };
    }
    case "open": {
      if (!args[0]) return { lines: ["open: need a file"] };
      const path = resolvePath(ctx.cwd, args[0]);
      const node = getNode(root, path);
      if (!node) return { lines: [`open: ${args[0]}: no such file`] };
      if (node.kind === "dir") return { lines: ["that's a folder. cd into it."] };
      return { lines: node.href ? [node.href] : [node.text] };
    }
    case "tree": {
      const all = args.includes("-a");
      const node = getNode(root, ctx.cwd);
      if (!node || node.kind !== "dir") return { lines: ["tree: lost"] };
      return { lines: [displayPwd(ctx.cwd), ...printTree(node, all)] };
    }
    case "now": {
      const node = getNode(root, resolvePath(ctx.cwd, "now")) ?? getNode(root, "now");
      if (!node || node.kind !== "file") return { lines: ["now is not here. try cd ~"] };
      return { lines: [node.text] };
    }
    case "date": {
      const stamp = (ctx.now ?? new Date()).toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
      });
      return { lines: [`${stamp} · new york`] };
    }
    case "echo":
      return { lines: [args.join(" ")] };
    case "fortune": {
      const pick = Math.floor((ctx.rng ?? Math.random)() * fortunes.length);
      return { lines: [fortunes[pick] ?? fortunes[0]] };
    }
    case "authorize":
    case "auth":
    case "swipe": {
      const flag = (args[0] ?? "now").toLowerCase();
      const windowMs =
        flag === "then" || flag === "3.5" ? 3500 : flag === "4" || flag === "budget" ? 4000 : 600;
      const charge = charges[Math.floor((ctx.rng ?? Math.random)() * charges.length)] ?? charges[0];
      const lives = windowMs <= 3500 || (ctx.rng ?? Math.random)() > 0.4;
      return {
        lines: [
          `${charge.name} ${charge.amount}`,
          `window ${windowMs === 600 ? "600ms" : `${(windowMs / 1000).toFixed(1)}s`}`,
          lives ? "approved." : "declined. the network got there first.",
        ],
      };
    }
    case "frisbee":
    case "huck":
    case "disc": {
      const yards = 28 + Math.floor((ctx.rng ?? Math.random)() * 30);
      if (cmd === "huck") {
        return { lines: [`${yards} yards.`, "too pretty. out the back. still worth it."] };
      }
      return { lines: ["backhand.", `${yards} yards.`, "someone else is already running."] };
    }
    case "forecast":
    case "qps":
    case "ads":
      return {
        lines: [
          "qps          18420",
          "forecast     0.81",
          "actual       0.77",
          "ghosts       4% unrecognized",
        ],
      };
    case "sign":
    case "asl": {
      const word = (args.join("") || "sam").toLowerCase().replace(/[^a-z]/g, "");
      if (!word) return { lines: ["need a word. try sign dad"] };
      return { lines: [word.toUpperCase().split("").join(" · ")] };
    }
    case "agent": {
      const job = (args[0] ?? "").toLowerCase();
      if (job === "approve" || job === "authorize") {
        return { lines: ["600ms.", "the card lives."] };
      }
      if (job === "throw" || job === "huck") {
        return { lines: ["already in the air."] };
      }
      if (job === "sign") {
        return { lines: ["S · A · M"] };
      }
      if (job === "count" || job === "ghosts") {
        return { lines: ["marked the 4%."] };
      }
      return { lines: ["watching the page.", "maker."] };
    }
    case "clear":
    case "cls":
      return { lines: [], action: "clear" };
    case "exit":
    case "logout":
    case "quit":
      return { lines: ["bye."], action: "exit" };
    case "vim":
    case "vi":
    case "nvim":
    case "emacs":
      return { lines: [], action: "vim" };
    case "rm":
      return { lines: ["i like these files."] };
    case "hello":
    case "hi":
    case "hey":
      return { lines: ["hey."] };
    case "neofetch":
    case "about":
      return {
        lines: [
          "sam@ny",
          "os     the web",
          "host   sammah.dad",
          "now    cursor",
          "here   new york",
          "up     since community college",
        ],
      };
    case "matrix":
      return {
        lines: [
          "01001000 01101001",
          "that's enough rain.",
        ],
      };
    case "xyzzy":
      return { lines: ['a hollow voice says "nothing happens."'] };
    case "curl":
      if (!args[0] || /sammah\.dad/i.test(args[0])) {
        return { lines: ["declined cards. bad measurements. tools people actually use."] };
      }
      return { lines: [`curl: could not reach ${args[0]}`] };
    case "ping":
      return { lines: ["pong"] };
    case "ssh":
      return { lines: ["you are already here."] };
    case "grok":
    case "grok-bot":
      return { lines: ["maker. #2 that day. the rest is the product."] };
    case "cursor":
      return { lines: ["that's the day job. this is the night one."] };
    case "find":
      return {
        lines: listTree(root, "", { hidden: args.includes("-a") }).map((entry) =>
          entry.kind === "dir" ? `${entry.path}/` : entry.path,
        ),
      };
    case "history":
      return { lines: ["up arrow. or your thumb."] };
    default:
      return { lines: [`${rawCmd}: command not found. try help.`] };
  }
}

export function completeShell(input: string, cwd: string, root: FsDir = shellRoot): string {
  const parts = input.split(/\s+/);
  const completing = parts[parts.length - 1] ?? "";
  const first = (parts[0] ?? "").toLowerCase();

  const names =
    parts.length <= 1
      ? [...shellCommands]
      : (() => {
          const slash = completing.lastIndexOf("/");
          const dirPart = slash >= 0 ? completing.slice(0, slash) : "";
          const prefix = slash >= 0 ? completing.slice(slash + 1) : completing;
          const dirPath = resolvePath(cwd, dirPart || ".");
          const node = getNode(root, dirPath);
          if (!node || node.kind !== "dir") return [];
          return Object.keys(node.children)
            .filter((name) => name.startsWith(prefix))
            .map((name) => {
              const child = node.children[name];
              const full = dirPart ? `${dirPart}/${name}` : name;
              return child.kind === "dir" ? `${full}/` : full;
            });
        })();

  const prefix = parts.length <= 1 ? first : completing;
  const hits = names.filter((name) => name.startsWith(prefix));
  if (hits.length !== 1 || !hits[0]) return input;
  const next = hits[0];
  if (parts.length <= 1) return next;
  return `${parts.slice(0, -1).join(" ")} ${next}`;
}
