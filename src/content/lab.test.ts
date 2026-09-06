import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { experiments, labIntro, playCopy, shellRoot } from "./lab";

describe("lab", () => {
  it("stars play and parks the old rooms as drafts", () => {
    expect(experiments.map((item) => item.slug)).toEqual([
      "play",
      "toys",
      "craft",
      "shell",
    ]);
    expect(experiments[0]?.tier).toBe("hero");
    expect(experiments.slice(1).every((item) => item.tier === "draft")).toBe(
      true,
    );
    expect(labIntro.lede).toMatch(/fun one|drafts/i);
    expect(experiments.some((item) => item.slug === "elsewhere")).toBe(false);
    expect(JSON.stringify({ playCopy, labIntro })).not.toMatch(
      /house|lamp|train|sodium/i,
    );
  });

  it("publishes lab routes in the sitemap", () => {
    const urls = sitemap().map((row) => row.url);
    expect(urls).toContain("https://sammah.dad/lab/");
    expect(urls).toContain("https://sammah.dad/lab/play/");
    expect(urls).not.toContain("https://sammah.dad/lab/elsewhere/");
    expect(urls).toContain("https://sammah.dad/lab/toys/");
    expect(urls).toContain("https://sammah.dad/lab/craft/");
    expect(urls).toContain("https://sammah.dad/lab/shell/");
    expect(urls).toContain("https://sammah.dad/about/");
  });

  it("keeps a filesystem with short spoken files", () => {
    const now = shellRoot.children.now;
    const school =
      shellRoot.children.about?.kind === "dir"
        ? shellRoot.children.about.children.school
        : null;
    expect(now?.kind).toBe("file");
    if (now?.kind === "file") expect(now.text).toMatch(/cursor/);
    expect(school?.kind).toBe("file");
    if (school?.kind === "file") expect(school.text).toMatch(/berkeley/);
  });
});
