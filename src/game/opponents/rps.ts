import type { Move } from "../moves";
import type { Opponent, Random } from "./types";

const CLASSIC_MOVES = ["rock", "paper", "scissors"] as const satisfies readonly Move[];
type ClassicMove = (typeof CLASSIC_MOVES)[number];
type Counts = Record<ClassicMove, number>;

const COUNTER: Record<ClassicMove, ClassicMove> = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

const HISTORY_LIMIT = 15;
const PATTERN_LENGTH = 3;
/** Only trust a pattern once it has been seen this many times. */
const MIN_PATTERN_SAMPLES = 2;
/** Only try pattern prediction this often, which keeps the AI beatable. */
const PATTERN_USE_CHANCE = 0.6;
const COUNTER_LAST_MOVE_CHANCE = 0.5;

/**
 * Classic opponent. Learns "last 3 moves -> what came next" and counters the
 * most likely next move; otherwise counters the last move or plays randomly.
 */
export function createRPSOpponent(random: Random = Math.random): Opponent<ClassicMove> {
  const history: ClassicMove[] = [];
  const patterns = new Map<string, Counts>();

  const randomMove = () => CLASSIC_MOVES[Math.floor(random() * CLASSIC_MOVES.length)];

  function counterToPredictedMove(): ClassicMove | undefined {
    if (history.length < PATTERN_LENGTH) return undefined;

    const counts = patterns.get(history.slice(-PATTERN_LENGTH).join(","));
    if (!counts) return undefined;

    const total = counts.rock + counts.paper + counts.scissors;
    if (total < MIN_PATTERN_SAMPLES) return undefined;

    const predicted = CLASSIC_MOVES.reduce((a, b) => (counts[a] > counts[b] ? a : b));
    return COUNTER[predicted];
  }

  function learn(playerMove: ClassicMove) {
    history.push(playerMove);
    if (history.length > HISTORY_LIMIT) history.shift();

    // Store pattern: the 3 moves before this one -> this move.
    if (history.length > PATTERN_LENGTH) {
      const sequence = history.slice(-(PATTERN_LENGTH + 1), -1).join(",");
      const counts = patterns.get(sequence) ?? { rock: 0, paper: 0, scissors: 0 };
      counts[playerMove]++;
      patterns.set(sequence, counts);
    }
  }

  return {
    pick(playerMove) {
      // The choice is made *before* learning from this round: the house never
      // gets to see the move it is replying to.
      let choice: ClassicMove | undefined;

      if (random() < PATTERN_USE_CHANCE) {
        choice = counterToPredictedMove();
      }

      if (!choice) {
        const lastMove = history.at(-1);
        choice =
          lastMove && random() > COUNTER_LAST_MOVE_CHANCE
            ? COUNTER[lastMove]
            : randomMove();
      }

      learn(playerMove);
      return choice;
    },
  };
}
