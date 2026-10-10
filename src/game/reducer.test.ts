import { describe, expect, it } from "vitest";
import type { Move } from "./moves";
import { applyOutcome, gameReducer, initialState, type GameAction, type GameState } from "./reducer";

const run = (actions: GameAction[], from: GameState = initialState) =>
  actions.reduce(gameReducer, from);

const playRound = (player: Move, house: Move): GameAction[] => [
  { type: "pick", move: player },
  { type: "resolve", house },
];

describe("applyOutcome", () => {
  it("adds on a win, subtracts on a loss, ignores a draw", () => {
    expect(applyOutcome(3, "win")).toBe(4);
    expect(applyOutcome(3, "lose")).toBe(2);
    expect(applyOutcome(3, "draw")).toBe(3);
  });

  it("never drops below zero", () => {
    expect(applyOutcome(0, "lose")).toBe(0);
  });
});

describe("gameReducer", () => {
  it("starts picking with a score of zero", () => {
    expect(initialState).toEqual({ round: { phase: "picking" }, score: 0 });
  });

  it("walks picking -> thinking -> result", () => {
    const thinking = run([{ type: "pick", move: "rock" }]);
    expect(thinking.round).toEqual({ phase: "thinking", player: "rock" });

    const done = gameReducer(thinking, { type: "resolve", house: "scissors" });
    expect(done.round).toEqual({
      phase: "result",
      player: "rock",
      house: "scissors",
      outcome: "win",
    });
    expect(done.score).toBe(1);
  });

  it("scores several rounds", () => {
    const state = run([
      ...playRound("rock", "scissors"), // win  -> 1
      { type: "playAgain" },
      ...playRound("rock", "paper"), //    lose -> 0
      { type: "playAgain" },
      ...playRound("rock", "paper"), //    lose -> still 0
      { type: "playAgain" },
      ...playRound("rock", "rock"), //     draw -> 0
    ]);
    expect(state.score).toBe(0);
  });

  it("ignores a second pick while the house is thinking", () => {
    const thinking = run([{ type: "pick", move: "rock" }]);
    expect(gameReducer(thinking, { type: "pick", move: "paper" })).toBe(thinking);
  });

  it("ignores resolve when no round is in progress", () => {
    expect(gameReducer(initialState, { type: "resolve", house: "rock" })).toBe(initialState);
  });

  it("ignores playAgain before the round has finished", () => {
    const thinking = run([{ type: "pick", move: "rock" }]);
    expect(gameReducer(thinking, { type: "playAgain" })).toBe(thinking);
  });

  it("keeps the score across rounds but reset clears everything", () => {
    const won = run([...playRound("paper", "rock"), { type: "playAgain" }]);
    expect(won).toEqual({ round: { phase: "picking" }, score: 1 });
    expect(gameReducer(won, { type: "reset" })).toEqual(initialState);
  });

  it("reset mid-round drops the pending round", () => {
    const thinking = run([{ type: "pick", move: "rock" }]);
    expect(gameReducer(thinking, { type: "reset" })).toEqual(initialState);
  });
});
