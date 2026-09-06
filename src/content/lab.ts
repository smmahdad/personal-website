import { grokBotLaunch, site } from "./site";
import { writing } from "./writing";

export const labIntro = {
  title: "Lab",
  kicker: "Play",
  lede: "Three rooms. None of them are a homepage.",
} as const;

export const experiments = [
  {
    slug: "toys",
    href: "/lab/toys/",
    title: "Toys",
    vibe: "clicky, loud, a little sticky",
    blurb: "Poke things. That's the whole page.",
  },
  {
    slug: "craft",
    href: "/lab/craft/",
    title: "Craft",
    vibe: "type, air, gold",
    blurb: "Almost no words. On purpose.",
  },
  {
    slug: "shell",
    href: "/lab/shell/",
    title: "Shell",
    vibe: "a home directory",
    blurb: "Type help. Or tap a file.",
  },
] as const;

export type Experiment = (typeof experiments)[number];

export const toysCopy = {
  title: "toys",
  lede: "Click stuff. That's the site.",
  window: {
    title: "The Window",
    hint: "Hit approve before the network does.",
    thenLabel: "then · 3.5s",
    nowLabel: "now · 600ms",
    arm: "Arm a charge",
    approve: "Approve",
    approved: "approved",
    declined: "declined",
  },
  dial: {
    title: "The Dial",
    hint: "Twist it.",
    calm: "still polite",
    mid: "getting weird",
    hot: "okay that's a lot",
  },
  pads: {
    title: "Pads",
    hint: "Keys 1–6 if you've got them.",
  },
} as const;

export const craftCopy = {
  name: "sam",
  place: "new york",
  live: "live",
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
          text: "english. asl.",
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
          text: "spend. 3.5s to 600ms. that's the one i still tell.",
        },
        amazon: {
          kind: "file",
          text: "ads. measurement. frequency capping. a lot of qps.",
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
  "a home directory, not a homepage.",
  "type help. tap a file. up arrow has history.",
];

export const fortunes = [
  "four seconds is a long time to a card network.",
  "measure it or it didn't happen.",
  "community college. then berkeley. then the jobs.",
  "asl. not a bit.",
  "i still think in timeouts.",
];
