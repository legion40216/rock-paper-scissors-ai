import type { Mode, Move } from "../moves";
import { createRPSOpponent } from "./rps";
import { createRPSLSOpponent } from "./rpsls";
import type { Opponent } from "./types";

export type { Opponent } from "./types";

export function createOpponent(mode: Mode): Opponent {
  // The classic opponent only understands the three classic moves. That is
  // safe because the classic board only ever offers those three, so widening
  // the type here is sound in practice.
  return mode === "classic" ? (createRPSOpponent() as Opponent<Move>) : createRPSLSOpponent();
}
