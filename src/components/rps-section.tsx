import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

// You'll need to import these - adjust paths as needed
import iconRock from "../assets/images/icon-rock.svg";
import iconPaper from "../assets/images/icon-paper.svg";
import iconScissors from "../assets/images/icon-scissors.svg";

import bgTriangle from "../assets/images/bg-triangle.svg";

import { createRPSAI, getAIMove } from "@/utils/rpsAI";
import type { RPSGameState, RPSOption, RPSResult } from "@/data/constants";

interface RpsSectionProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

// ─── Move Config ──────────────────────────────────────────────────────────────
// NO CHANGE: movesData stays the same, just moved outside the component
// so it's not recreated on every render (it never changes)
const movesData: Record<RPSOption, { title: string; icon: string }> = {
  rock:     { title: "rock",     icon: iconRock },
  paper:    { title: "paper",    icon: iconPaper },
  scissors: { title: "scissors", icon: iconScissors },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
// CHANGE: Replaced the repeated ternary chains for class names with a lookup.
// Before: playerMove === "rock" ? "result-rock" : playerMove === "paper" ? "result-paper" : "result-scissors"
// After:  getResultClass(playerMove)  — one line, works for both player and AI
const resultClassMap: Record<RPSOption, string> = {
  rock:     "result-rock",
  paper:    "result-paper",
  scissors: "result-scissors",
};
const getResultClass = (move: RPSOption | null) => (move ? resultClassMap[move] : "");

// CHANGE: Extracted result label into a lookup instead of inline ternary
// Before: result === "win" ? "YOU WIN" : result === "lose" ? "YOU LOSE" : "DRAW"
// After:  resultLabel[result]  — cleaner and only defined once
const resultLabel: Record<RPSResult, string> = {
  win:  "YOU WIN",
  lose: "YOU LOSE",
  draw: "DRAW",
};

export default function RpsSection({ setScore }: RpsSectionProps) {
  const [ai, setAI] = useState<any | null>(null);
  const [playerMove, setPlayerMove] = useState<RPSOption | null>(null);
  const [aiMove, setAIMove] = useState<RPSOption | null>(null);
  const [gameState, setGameState] = useState<RPSGameState>("playing");
  const [result, setResult] = useState<RPSResult | null>(null);

  useEffect(() => {
    setAI(createRPSAI());
  }, []);

  const handleMove = (move: RPSOption) => {
    if (!ai || gameState !== "playing") return;

    setPlayerMove(move);
    setGameState("waiting");

    setTimeout(() => {
      const aiChoice = getAIMove(ai, move) as RPSOption;
      setAIMove(aiChoice);

      // CHANGE: Replaced if/else chain with wins Set for cleaner win detection
      // Before: (move === "rock" && aiChoice === "scissors") || (move === "paper" && ...)
      // After:  wins.has(`${move}-${aiChoice}`)
      const wins = new Set(["rock-scissors", "paper-rock", "scissors-paper"]);
      const gameResult: RPSResult =
        wins.has(`${move}-${aiChoice}`) ? "win" :
        move === aiChoice               ? "draw" : "lose";

      setResult(gameResult);
      setGameState("result");
      setScore((s) =>
        gameResult === "win" ? s + 1 :
        gameResult === "lose" ? Math.max(0, s - 1) : s
      );
      // CHANGE: Collapsed the separate setScore calls into one expression above
    }, 1000);
  };

  const playAgain = () => {
    setGameState("playing");
    setPlayerMove(null);
    setAIMove(null);
    setResult(null);
  };

  // CHANGE: Extracted the result circle into a subcomponent to eliminate
  // the duplication between the player and AI result circles.
  // Before: two near-identical <button> blocks with the same class/img logic
  // After:  <ResultCircle> used twice with different props
  const ResultCircle = ({ move, isWinner }: { move: RPSOption | null; isWinner: boolean }) => (
    <div className={isWinner ? "winner-ping" : ""}>
      
        {move && (
          <img
            src={movesData[move].icon}
            alt={movesData[move].title}
            className="size-16 md:size-24"
          />
        )}
  
      {/* CHANGE: Moved winner-ping-outer here as a sibling div instead of a class
          on the button. This avoids z-index conflicts caused by transform on the button. */}
      {isWinner &&}
    </div>
  );

  // CHANGE: Extracted the result text + play again button into a variable
  // to avoid repeating it for mobile and desktop versions.
  // Before: two identical blocks — one with `md:flex hidden`, one with `md:hidden flex`
  // After:  <ResultContent> rendered once inside each layout slot
  const ResultContent = () =>
    result ? (
      <>
        <span className="text-3xl md:text-5xl font-bold whitespace-nowrap">
          {resultLabel[result]}
        </span>

          PLAY AGAIN

      </>
    ) : null;

  return (

  );
}