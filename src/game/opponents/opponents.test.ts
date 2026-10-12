import { describe, expect, it } from "vitest";
import { MOVES, type Move } from "../moves";
import { createOpponent } from ".";
import { createRPSOpponent } from "./rps";
import { createRPSLSOpponent } from "./rpsls";
import type { Random } from "./types";

/** An RNG that replays a fixed sequence, then repeats the last value. */
const sequence = (...values: number[]): Random => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};

/** A seeded PRNG (mulberry32) for statistical checks. */
const seeded = (seed: number): Random => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe("createOpponent", () => {
  it("only ever returns classic moves in classic mode", () => {
    const opponent = createOpponent("classic");
    for (let i = 0; i < 200; i++) {
      expect(["rock", "paper", "scissors"]).toContain(opponent.pick("rock"));
    }
  });

  it("can return every move in bonus mode", () => {
    const opponent = createRPSLSOpponent(seeded(1));
    const seen = new Set<Move>();
    for (let i = 0; i < 500; i++) seen.add(opponent.pick("rock"));
    expect([...seen].sort()).toEqual([...MOVES].sort());
  });
});

describe("the bonus opponent does not cheat", () => {
  it("replies independently of the move it is replying to", () => {
    // Same RNG + same history, different *current* player move. If the house
    // could see the move it is replying to, the replies would differ.
    const replyTo = (current: Move) => {
      // random() < 0.3 -> "counter last move"; second value picks a counter.
      const house = createRPSLSOpponent(sequence(0.9, 0.0, 0.1, 0.5));
      house.pick("rock"); // seeds history with "rock"
      return house.pick(current);
    };

    const replies = MOVES.map(replyTo);
    expect(new Set(replies).size).toBe(1);
  });

  it("counters the *previous* move when the dice say so", () => {
    const house = createRPSLSOpponent(sequence(0.9, 0.0, 0.1, 0.0));
    house.pick("rock");
    // Dice 0.1 < 0.3 -> counter last move (rock): paper or spock, never random.
    expect(["paper", "spock"]).toContain(house.pick("lizard"));
  });
});

describe("the classic opponent", () => {
  it("does not see the move it is replying to", () => {
    const replyTo = (current: "rock" | "paper" | "scissors") => {
      const house = createRPSOpponent(sequence(0.9, 0.9, 0.0));
      house.pick("rock");
      return house.pick(current);
    };
    expect(new Set([replyTo("rock"), replyTo("paper"), replyTo("scissors")]).size).toBe(1);
  });

  it("learns a repeating pattern and counters it", () => {
    // Player cycles rock -> paper -> scissors. With RNG pinned to "use the
    // pattern", the house should end up beating (nearly) every move.
    const cycle = ["rock", "paper", "scissors"] as const;
    const house = createRPSOpponent(() => 0); // 0 < 0.6 -> always try the pattern
    const counters = { rock: "paper", paper: "scissors", scissors: "rock" } as const;

    let correct = 0;
    let rounds = 0;
    for (let i = 0; i < 60; i++) {
      const move = cycle[i % 3];
      const reply = house.pick(move);
      if (i >= 30) {
        rounds++;
        if (reply === counters[move]) correct++;
      }
    }
    expect(correct / rounds).toBeGreaterThan(0.9);
  });

  it("is not a perfect predictor against random play", () => {
    const rng = seeded(42);
    const house = createRPSOpponent(seeded(7));
    let houseWins = 0;
    const rounds = 3000;
    const wins = { rock: "scissors", paper: "rock", scissors: "paper" } as const;
    for (let i = 0; i < rounds; i++) {
      const move = (["rock", "paper", "scissors"] as const)[Math.floor(rng() * 3)];
      const reply = house.pick(move);
      if (wins[reply] === move) houseWins++;
    }
    // Against uniformly random play nobody has an edge: ~1/3 each.
    expect(houseWins / rounds).toBeGreaterThan(0.28);
    expect(houseWins / rounds).toBeLessThan(0.39);
  });
});
