import { describe, expect, it } from "vitest";
import { about } from "./about";
import { home } from "./home";
import { site } from "./site";
import { latency, work } from "./work";
import { writing } from "./writing";

const allText = JSON.stringify({
  site,
  home,
  about,
  work,
  writing,
});

describe("site content", () => {
  it("has no placeholder copy", () => {
    expect(allText).not.toMatch(/lorem ipsum/i);
    expect(allText).not.toMatch(/todo: write/i);
    expect(allText).not.toMatch(/your name here/i);
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

  it("links public profiles and leaves email unset", () => {
    expect(site.links.github.href).toBe("https://github.com/smmahdad");
    expect(site.links.linkedin.href).toContain("smmahdad");
    expect(site.links.email).toBeNull();
  });

  it("includes the public engineering write-up", () => {
    expect(writing).toHaveLength(1);
    expect(writing[0]?.href).toContain(
      "building-spend-management-slashing-latencies",
    );
  });
});
