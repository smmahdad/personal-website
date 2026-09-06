import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { about } from "./about";
import { contact } from "./contact";
import { home } from "./home";
import { grokBotLaunch, site } from "./site";
import { latency, work } from "./work";
import { writing, writingIntro } from "./writing";
import {
  craftCopy,
  experiments,
  fortunes,
  labIntro,
  shellMotd,
  shellRoot,
  toysCopy,
} from "./lab";

const allText = JSON.stringify({
  site,
  grokBotLaunch,
  home,
  about,
  work,
  writing,
  writingIntro,
  contact,
  labIntro,
  experiments,
  toysCopy,
  craftCopy,
  shellMotd,
  shellRoot,
  fortunes,
});

const memoirTells = [
  /shapes how i work/i,
  /leaving teams better/i,
  /through-line/i,
  /texture i want/i,
  /soft-focus/i,
  /running preference/i,
  /occasional afternoon/i,
  /outcome, not the ticket/i,
  /raising the bar/i,
  /allowed to be human/i,
  /professional working proficiency/i,
  /if you want more, talk to me/i,
  /the plot/i,
];

const metaTells = [
  /lorem ipsum/i,
  /todo: write/i,
  /your name here/i,
  /src\/content/i,
  /placeholder/i,
  /invented scope/i,
  /no product internals/i,
  /edit this file/i,
  /until email on this domain/i,
  /inbox is live/i,
];

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walkFiles(path, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(path);
  }
  return acc;
}

describe("site content", () => {
  it("has no placeholder, meta, or memoir-voice copy", () => {
    for (const pattern of [...metaTells, ...memoirTells]) {
      expect(allText).not.toMatch(pattern);
    }
  });

  it("keeps rendered pages free of author-note copy", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const roots = [join(here, "../app"), join(here, "../components")];
    const files = roots.flatMap((root) => walkFiles(root));
    const rendered = files
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(rendered).not.toMatch(/src\/content\//);
    expect(rendered).not.toMatch(/Room for more/i);
    expect(rendered).not.toMatch(/Placeholder —/i);
    expect(rendered).not.toMatch(/invented scope/i);
  });

  it("exposes the lab from the main nav", () => {
    expect(site.nav.map((item) => item.href)).toContain("/lab/");
    expect(experiments.map((item) => item.slug)).toEqual([
      "toys",
      "craft",
      "shell",
    ]);
  });

  it("identifies Sam and the public domain", () => {
    expect(site.name).toBe("Sam Mahdad");
    expect(site.domain).toBe("sammah.dad");
    expect(site.url).toBe("https://sammah.dad");
    expect(site.currentRole.company).toBe("Cursor");
  });

  it("keeps current role date-free and title soft", () => {
    expect(site.currentRole.title).toBe("Engineering");
    expect(home.now[0]?.title).toBe("Cursor");
    expect(JSON.stringify(site.currentRole)).not.toMatch(/20\d{2}/);
  });

  it("covers the public work chapters", () => {
    expect(work.map((story) => story.id)).toEqual([
      "cursor",
      "rippling",
      "amazon",
    ]);
    expect(work[1]?.links?.[0]?.href).toContain("rippling.com/blog");
    expect(latency.afterMs).toBe(600);
    expect(latency.beforeMs).toBe(3500);
  });

  it("features the public Grok Bot Product Hunt launch", () => {
    expect(grokBotLaunch.product).toBe("Grok Bot");
    expect(grokBotLaunch.tagline).toBe(
      "AI teammates that you can give real work to",
    );
    expect(grokBotLaunch.href).toBe(
      "https://www.producthunt.com/products/grok/launches/grok-bot",
    );
    expect(grokBotLaunch.date).toBe("August 12, 2026");
    expect(grokBotLaunch.role).toBe("Maker");
    expect(grokBotLaunch.dayRank).toBe(2);
    expect(grokBotLaunch.weekRank).toBe(2);
    expect(home.now[0]?.badge?.href).toBe(grokBotLaunch.href);
    expect(work[0]?.badge?.href).toBe(grokBotLaunch.href);
    expect(work[0]?.links?.some((link) => link.href === grokBotLaunch.href)).toBe(
      true,
    );
    expect(allText).toMatch(/Maker on/);
    expect(allText).not.toMatch(/497/);
    expect(allText).not.toMatch(/Ben Lang/);
  });

  it("links public profiles and leaves email unset", () => {
    expect(site.links.github.href).toBe("https://github.com/smmahdad");
    expect(site.links.linkedin.href).toContain("smmahdad");
    expect(site.links.email).toBeNull();
    expect(contact.channels.map((channel) => channel.label)).toEqual([
      "GitHub",
      "LinkedIn",
    ]);
  });

  it("includes the public engineering write-up", () => {
    expect(writing).toHaveLength(1);
    expect(writing[0]?.href).toContain(
      "building-spend-management-slashing-latencies",
    );
  });
});
