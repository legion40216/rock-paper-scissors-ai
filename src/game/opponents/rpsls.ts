import { MOVES, getCounters, type Move } from "../moves";
import type { Opponent, Random } from "./types";

const HISTORY_LIMIT = 15;
/** Chance the house counters the player's *previous* move; otherwise random. */
const COUNTER_LAST_MOVE_CHANCE = 0.3;

/**
 * Bonus opponent: mostly random, sometimes counters the player's previous move
 * with one of the two moves that beat it.
 */
export function createRPSLSOpponent(random: Random = Math.random): Opponent {
  const history: Move[] = [];

  const sample = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)];

  return {
    pick(playerMove) {
      // Decide from *previous* moves only, then record this one. (Recording
      // first would let the house counter the move it is replying to.)
      const lastMove = history.at(-1);
      const choice =
        lastMove && random() < COUNTER_LAST_MOVE_CHANCE
          ? sample(getCounters(lastMove))
          : sample(MOVES);

      history.push(playerMove);
      if (history.length > HISTORY_LIMIT) history.shift();

      return choice;
    },
  };
}
