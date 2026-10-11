/// <reference types="node" />
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { DEFAULT_THEME, THEMES, isThemeId } from "./registry";

/**
 * These tests protect what makes themes plug and play: a component can never
 * read a variable that has no stock default, and a theme file can never set
 * a variable that does not exist (a typo would silently do nothing).
 *
 * Files are read with `fs`: Vitest replaces CSS imported through Vite
 * (even with `?raw`) with an empty string.
 */
const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), "utf8");

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const declaredVars = (css: string) =>
  new Set([...stripComments(css).matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

const defaults = declaredVars(read("./default.css"));
/** Declared outside default.css on purpose: the runtime font hook in index.css. */
const allowedExtra = new Set(["--font-sans"]);

describe("theme registry", () => {
  it("has unique ids and a valid default", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(isThemeId(DEFAULT_THEME)).toBe(true);
  });

  it("rejects unknown ids", () => {
    expect(isThemeId("nope")).toBe(false);
    expect(isThemeId(null)).toBe(false);
  });
});

describe("default.css", () => {
  it("is readable and declares the stock tokens (guards the checks below from passing vacuously)", () => {
    expect(defaults.has("--primary")).toBe(true);
    expect(defaults.has("--btn-radius")).toBe(true);
  });
});

describe("theme files", () => {
  const themed = THEMES.filter((t) => t.id !== "default");

  it("has a file for every registered theme and no unregistered ones", () => {
    const files = readdirSync(new URL(".", import.meta.url))
      .filter((f) => f.endsWith(".css"))
      .map((f) => f.replace(/\.css$/, ""))
      .sort();
    expect(files).toEqual(THEMES.map((t) => t.id).sort());
  });

  it.each(themed)("$id is scoped to its own attribute", ({ id }) => {
    expect(read(`./${id}.css`)).toContain(`:root[data-theme="${id}"]`);
  });

  it.each(themed)("$id is imported by index.css", ({ id }) => {
    expect(read("../index.css")).toContain(`./themes/${id}.css`);
  });

  it.each(themed)("$id only sets variables that default.css declares", ({ id }) => {
    const unknown = [...declaredVars(read(`./${id}.css`))].filter(
      (name) => !defaults.has(name) && !allowedExtra.has(name),
    );
    expect(unknown).toEqual([]);
  });
});

describe("component knobs", () => {
  it("every --btn-* / --pill-* variable the Button reads has a stock default", () => {
    const used = new Set(read("../components/ui/button.tsx").match(/--(?:btn|pill)-[a-z]+(?:-[a-z]+)*/g));
    expect(used.size).toBeGreaterThan(0);
    const missing = [...used].filter((name) => !defaults.has(name));
    expect(missing).toEqual([]);
  });
});
