import type { Move } from "../moves";

/**
 * The house. Stateful (it learns from the player's history), so one instance
 * lives for the length of a game and is replaced on reset.
 */
export interface Opponent<M extends Move = Move> {
  /** Choose a reply to the move the player has just made, then learn from it. */
  pick(playerMove: M): M;
}

/** Injectable RNG (returns [0, 1)) so opponents are deterministic in tests. */
export type Random = () => number;
