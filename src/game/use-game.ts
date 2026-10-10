import { useCallback, useEffect, useReducer, useState } from "react";
import type { Mode, Move } from "./moves";
import { createOpponent } from "./opponents";
import { gameReducer, initialState } from "./reducer";

/** How long the house "thinks" before revealing its move. */
const HOUSE_DELAY_MS = 1000;

/**
 * Owns one game: the round state machine, the score and the opponent.
 * Mount it with `key={mode}` so switching modes starts a fresh game.
 */
export function useGame(mode: Mode) {
  const [{ round, score }, dispatch] = useReducer(gameReducer, initialState);
  const [opponent, setOpponent] = useState(() => createOpponent(mode));

  // The house replies after a short delay. Because the timer lives in an
  // effect, reset / unmount cancel it automatically, so a stale round can
  // never touch the score after a reset.
  useEffect(() => {
    if (round.phase !== "thinking") return;

    const { player } = round;
    const timer = window.setTimeout(() => {
      dispatch({ type: "resolve", house: opponent.pick(player) });
    }, HOUSE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [round, opponent]);

  const play = useCallback((move: Move) => dispatch({ type: "pick", move }), []);
  const playAgain = useCallback(() => dispatch({ type: "playAgain" }), []);
  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    setOpponent(createOpponent(mode)); // a reset also wipes what the house learned
  }, [mode]);

  return { round, score, play, playAgain, reset };
}
