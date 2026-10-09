import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import iconRock from "../assets/images/icon-rock.svg";
import iconPaper from "../assets/images/icon-paper.svg";
import iconScissors from "../assets/images/icon-scissors.svg";
import iconLizard from "../assets/images/icon-lizard.svg";
import iconSpock from "../assets/images/icon-spock.svg";
import bgPentagon from "../assets/images/bg-pentagon.svg";

// Simple AI for RPSLS
function createRPSLSAI() {
  return {
    history: [],
    patterns: {}
  };
}

function getAIMove(ai: any, playerMove: string) {
  const moves = ["rock", "paper", "scissors", "lizard", "spock"];
  
  ai.history.push(playerMove);
  
  if (ai.history.length > 15) {
    ai.history.shift();
  }
  
  // Simple strategy: random 70% of time, counter last move 30%
  let aiChoice;
  if (ai.history.length > 0 && Math.random() > 0.7) {
    const lastMove = ai.history[ai.history.length - 1];
    // Counter the last move with one of two winning options
    const counters: { [key: string]: string[] } = {
      rock: ["paper", "spock"],
      paper: ["scissors", "lizard"],
      scissors: ["rock", "spock"],
      lizard: ["rock", "scissors"],
      spock: ["paper", "lizard"]
    };
    const options = counters[lastMove];
    aiChoice = options[Math.floor(Math.random() * options.length)];
  } else {
    aiChoice = moves[Math.floor(Math.random() * moves.length)];
  }
  
  return aiChoice;
}

type Move = "rock" | "paper" | "scissors" | "lizard" | "spock";

interface RpslsSectionProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function RpslsSection({ setScore }: RpslsSectionProps) {
  const [ai, setAI] = useState<any | null>(null);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAIMove] = useState<Move | null>(null);
  const [gameState, setGameState] = useState<"playing" | "waiting" | "result">("playing");
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);

  useEffect(() => {
    setAI(createRPSLSAI());
  }, []);

  const moveData = {
    rock: { title: "rock", icon: iconRock, color: "hsl(349, 71%, 52%)" },
    paper: { title: "paper", icon: iconPaper, color: "hsl(230, 89%, 62%)" },
    scissors: { title: "scissors", icon: iconScissors, color: "hsl(39, 89%, 49%)" },
    lizard: { title: "lizard", icon: iconLizard, color: "hsl(261, 73%, 60%)" },
    spock: { title: "spock", icon: iconSpock, color: "hsl(189, 59%, 53%)" },
  };

  // RPSLS winning rules
  const wins: { [key: string]: string[] } = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["paper", "spock"],
    spock: ["scissors", "rock"]
  };

  const handleMove = (move: Move) => {
    if (!ai || gameState !== "playing") return;

    setPlayerMove(move);
    setGameState("waiting");

    setTimeout(() => {
      const aiChoice = getAIMove(ai, move) as Move;
      setAIMove(aiChoice);

      let gameResult;
      if (wins[move].includes(aiChoice)) {
        gameResult = "win";
        setScore((s) => s + 1);
      } else if (move === aiChoice) {
        gameResult = "draw";
      } else {
        gameResult = "lose";
        setScore((s) => Math.max(0, s - 1));
      }

      setResult(gameResult as "win" | "lose" | "draw");
      setGameState("result");
    }, 1000);
  };

  const playAgain = () => {
    setGameState("playing");
    setPlayerMove(null);
    setAIMove(null);
    setResult(null);
  };

  const getClassName = (move: Move | null) => {
    if (!move) return "";
    return `result-${move}`;
  };

  return (

  );
}