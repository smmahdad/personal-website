import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { experiments, labIntro, shellRoot } from "./lab";

describe("lab", () => {
  it("lists three distinct rooms", () => {
    expect(experiments).toHaveLength(3);
    expect(new Set(experiments.map((item) => item.slug)).size).toBe(3);
    expect(new Set(experiments.map((item) => item.vibe)).size).toBe(3);
    expect(labIntro.lede).toMatch(/homepage/i);
  });

  it("publishes lab routes in the sitemap", () => {
    const urls = sitemap().map((row) => row.url);
    expect(urls).toContain("https://sammah.dad/lab/");
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
