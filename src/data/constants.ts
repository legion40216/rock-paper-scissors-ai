export const RPSOptions = ["rock", "paper", "scissors"] as const;
export const RPSResults = ["win", "lose", "draw"] as const;
export const RPSGameStates = ["playing", "waiting", "result"] as const;
export const RPSBonusOptions = ["rock", "paper", "scissors", "lizard", "spock"] as const;

export type RPSOption = typeof RPSOptions[number];
export type RPSResult = typeof RPSResults[number];
export type RPSGameState = typeof RPSGameStates[number];
export type RPSBonusOption = typeof RPSBonusOptions[number];
