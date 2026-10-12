import { describe, expect, it } from "vitest";
import { BEATS, MOVES, getCounters, getOutcome } from "./moves";

describe("rules table", () => {
  it("makes every move beat exactly two others", () => {
    for (const move of MOVES) expect(BEATS[move]).toHaveLength(2);
  });

  it("is antisymmetric: for any two different moves exactly one wins", () => {
    for (const a of MOVES) {
      for (const b of MOVES) {
        if (a === b) continue;
        expect(BEATS[a].includes(b)).not.toBe(BEATS[b].includes(a));
      }
    }
  });

  it("never lets a move beat itself", () => {
    for (const move of MOVES) expect(BEATS[move]).not.toContain(move);
  });
});

describe("getOutcome", () => {
  it("covers the classic game", () => {
    expect(getOutcome("rock", "scissors")).toBe("win");
    expect(getOutcome("scissors", "paper")).toBe("win");
    expect(getOutcome("paper", "rock")).toBe("win");
    expect(getOutcome("scissors", "rock")).toBe("lose");
    expect(getOutcome("rock", "rock")).toBe("draw");
  });

  it("covers the bonus moves", () => {
    expect(getOutcome("lizard", "spock")).toBe("win");
    expect(getOutcome("spock", "lizard")).toBe("lose");
    expect(getOutcome("rock", "lizard")).toBe("win");
  });
});

describe("getCounters", () => {
  it("returns exactly the moves that beat the given one", () => {
    expect(getCounters("rock").sort()).toEqual(["paper", "spock"]);
    expect(getCounters("lizard").sort()).toEqual(["rock", "scissors"]);
  });

  it("agrees with getOutcome", () => {
    for (const move of MOVES) {
      for (const counter of getCounters(move)) {
        expect(getOutcome(counter, move)).toBe("win");
      }
    }
  });
});
