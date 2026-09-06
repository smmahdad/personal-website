import { grokBotLaunch, site } from "./site";
import { writing } from "./writing";

export const labIntro = {
  title: "Lab",
  kicker: "Play",
  lede: "The fun one is on top. Drafts downstairs.",
} as const;

export const playCopy = {
  title: "play",
  lede: "poke it.",
  hint: "click · type · tilt",
  press: "press me",
  again: "again",
  hey: "hey—",
  dont: "don't",
  fine: "ok fine",
  more: "more",
  pop: "pop",
  flip: "flip",
  clean: "clean",
  tilt: "tilt",
  wink: "no homework.",
} as const;

export const experiments = [
  {
    slug: "play",
    href: "/lab/play/",
    title: "Play",
    vibe: "poke it",
    blurb: "Blobs, a button that runs, gravity you can tilt.",
    tier: "hero",
  },
  {
    slug: "toys",
    href: "/lab/toys/",
    title: "Toys",
    vibe: "v1 draft",
    blurb: "Swipe the card. Huck it. Spell something.",
    tier: "draft",
  },
  {
    slug: "craft",
    href: "/lab/craft/",
    title: "Craft",
    vibe: "v1 draft",
    blurb: "The window. The motes. Almost no words.",
    tier: "draft",
  },
  {
    slug: "shell",
    href: "/lab/shell/",
    title: "Shell",
    vibe: "v1 draft",
    blurb: "Type a world. Or tap one.",
    tier: "draft",
  },
] as const;

export type Experiment = (typeof experiments)[number];

export const toysCopy = {
  title: "toys",
  lede: "Poke a life. Not a resume.",
  swipe: {
    title: "The Window",
    hint: "Swipe right before the network kills it.",
  },
  forecast: {
    title: "Ghosts",
    hint: "Unrecognized traffic. Click a hollow one.",
  },
  disc: {
    title: "Huck",
    hint: "Pull back. Let go.",
  },
  hands: {
    title: "Hands",
    hint: "Type. Or tap a letter.",
  },
  agent: {
    title: "Bot",
    hint: "Give it a job. It touches the other toys.",
  },
} as const;

export const craftCopy = {
  name: "sam",
  place: "new york",
  live: "bot",
} as const;

export type FsFile = {
  kind: "file";
  text: string;
  href?: string;
};

export type FsDir = {
  kind: "dir";
  children: Record<string, FsNode>;
};

export type FsNode = FsFile | FsDir;

export const shellRoot: FsDir = {
  kind: "dir",
  children: {
    readme: {
      kind: "file",
      text: "i make tools. sometimes they beep. sometimes a card goes through.",
    },
    now: {
      kind: "file",
      text: `cursor. ${site.location.toLowerCase()}. still thinking in timeouts.`,
    },
    about: {
      kind: "dir",
      children: {
        school: {
          kind: "file",
          text: "orange coast. then berkeley. community college first.",
        },
        people: {
          kind: "file",
          text: "malte. daniel. albert. governors island after a storm.",
        },
        languages: {
          kind: "file",
          text: "english. asl. the rest is motion.",
        },
      },
    },
    work: {
      kind: "dir",
      children: {
        cursor: {
          kind: "file",
          text: `engineering. maker on ${grokBotLaunch.product.toLowerCase()}. #${grokBotLaunch.dayRank} that day.`,
        },
        rippling: {
          kind: "file",
          text: "spend. 3.5s to 600ms. four seconds is the whole joke.",
        },
        amazon: {
          kind: "file",
          text: "ads. measurement. frequency capping. ghosts in the traffic.",
        },
      },
    },
    play: {
      kind: "dir",
      children: {
        disc: {
          kind: "file",
          text: "huck it. don't watch the line.",
        },
        hands: {
          kind: "file",
          text: "not a bit. a language.",
        },
        ads: {
          kind: "file",
          text: "if you can't measure it, it didn't happen. also the 4% you can't see.",
        },
      },
    },
    writing: {
      kind: "dir",
      children: {
        "spend-latency": {
          kind: "file",
          text: "the write-up. auth p99. indexes. the planner lying 1% of the time.",
          href: writing[0].href,
        },
      },
    },
    ".secrets": {
      kind: "dir",
      children: {
        notes: {
          kind: "file",
          text: "the password is not hunter2.",
        },
      },
    },
  },
};

export const shellMotd = [
  "sammah.dad",
  "try: authorize   frisbee   forecast   sign   agent",
  "or tap a file. up arrow has history.",
];

export const fortunes = [
  "four seconds is a long time to a card network.",
  "measure it or it didn't happen.",
  "huck it. run it down.",
  "asl. not a bit.",
  "unrecognized traffic is still traffic.",
];

export const charges = [
  { name: "coffee", amount: "$4.80" },
  { name: "the 6 train", amount: "$2.90" },
  { name: "a very small lamp", amount: "$18.00" },
  { name: "tacos", amount: "$14.00" },
  { name: "one gummy", amount: "$0.25" },
] as const;
