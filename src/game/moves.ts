/**
 * Game domain: moves, modes and the rules table.
 *
 * Rock-Paper-Scissors-Lizard-Spock is a strict superset of the classic game,
 * so a single `BEATS` table drives both modes. A mode only decides which
 * moves are *in play* (see `components/game/move-picker.tsx`).
 */

export const MOVES = ["rock", "paper", "scissors", "lizard", "spock"] as const;
export type Move = (typeof MOVES)[number];

export const MODES = {
  classic: { title: "Rock Paper Scissors" },
  bonus: { title: "Rock Paper Scissors Lizard Spock" },
} as const;
export type Mode = keyof typeof MODES;

export type Outcome = "win" | "lose" | "draw";

export const MOVE_LABEL: Record<Move, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
  lizard: "Lizard",
  spock: "Spock",
};

/** What each move defeats. */
export const BEATS: Readonly<Record<Move, readonly Move[]>> = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"],
};

export function getOutcome(player: Move, house: Move): Outcome {
  if (player === house) return "draw";
  return BEATS[player].includes(house) ? "win" : "lose";
}

/** Every move that defeats `move` (the "counters" an opponent can pick). */
export function getCounters(move: Move): Move[] {
  return MOVES.filter((candidate) => BEATS[candidate].includes(move));
}
