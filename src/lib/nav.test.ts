import { describe, expect, it } from "vitest";
import { isNavActive, normalizePath } from "./nav";

describe("isNavActive", () => {
  it("treats home as exact only", () => {
    expect(isNavActive("/", "/")).toBe(true);
    expect(isNavActive("/about/", "/")).toBe(false);
    expect(isNavActive("/lab/", "/")).toBe(false);
  });

  it("highlights lab for nested rooms", () => {
    expect(isNavActive("/lab/", "/lab/")).toBe(true);
    expect(isNavActive("/lab/toys/", "/lab/")).toBe(true);
    expect(isNavActive("/lab/craft/", "/lab/")).toBe(true);
    expect(isNavActive("/about/", "/lab/")).toBe(false);
  });

  it("normalizes trailing slashes", () => {
    expect(normalizePath("/lab/")).toBe("/lab");
    expect(normalizePath("/")).toBe("/");
    expect(isNavActive("/work", "/work/")).toBe(true);
  });
});
