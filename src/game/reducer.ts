import { getOutcome, type Move, type Outcome } from "./moves";

/**
 * A round is a small state machine. Modelling it as a discriminated union
 * means the UI can never read `house` or `outcome` before they exist.
 */
export type Round =
  | { phase: "picking" }
  | { phase: "thinking"; player: Move }
  | { phase: "result"; player: Move; house: Move; outcome: Outcome };

export interface GameState {
  round: Round;
  score: number;
}

export type GameAction =
  | { type: "pick"; move: Move }
  | { type: "resolve"; house: Move }
  | { type: "playAgain" }
  | { type: "reset" };

export const initialState: GameState = {
  round: { phase: "picking" },
  score: 0,
};

/** +1 for a win, -1 for a loss (never below zero), unchanged on a draw. */
export function applyOutcome(score: number, outcome: Outcome): number {
  if (outcome === "win") return score + 1;
  if (outcome === "lose") return Math.max(0, score - 1);
  return score;
}

/**
 * Pure and deterministic: the house's randomness is resolved *outside*
 * (in `useGame`) and arrives as the `resolve` action's payload.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  const { round } = state;

  switch (action.type) {
    case "pick":
      if (round.phase !== "picking") return state;
      return { ...state, round: { phase: "thinking", player: action.move } };

    case "resolve": {
      if (round.phase !== "thinking") return state;
      const outcome = getOutcome(round.player, action.house);
      return {
        score: applyOutcome(state.score, outcome),
        round: { phase: "result", player: round.player, house: action.house, outcome },
      };
    }

    case "playAgain":
      if (round.phase !== "result") return state;
      return { ...state, round: { phase: "picking" } };

    case "reset":
      return initialState;
  }
}
