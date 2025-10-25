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
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function RpslsSection({ score, setScore }: RpslsSectionProps) {
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
    <>
      {gameState === "playing" ? (
        <div className="relative w-[300px] md:w-[400px] aspect-square mx-auto">
          <img
            src={bgPentagon}
            alt="Pentagon Background"
            className="shape-bg"
          />

          {/* Paper */}
          <Button
            onClick={() => handleMove("paper")}
            className="absolute bottom-30 md:bottom-40 -right-5 size-25! border-10! md:size-32! md:border-14! option_paper"
          >
            <img src={iconPaper} alt="Paper" className="size-8 md:size-14" />
          </Button>

          {/* Scissors */}
          <Button
            onClick={() => handleMove("scissors")}
            className="absolute top-0 left-25 md:left-35 size-25! border-10! md:size-32! md:border-14! option_scissors"
          >
            <img src={iconScissors} alt="Scissors" className="size-8 md:size-12" />
          </Button>

          {/* Rock */}
          <Button
            onClick={() => handleMove("rock")}
            className="absolute bottom-0 right-10 size-25! border-10! md:size-32! md:border-14! option_rock"
          >
            <img src={iconRock} alt="Rock" className="size-8 md:size-12" />
          </Button>

          {/* Lizard */}
          <Button
            onClick={() => handleMove("lizard")}
            className="absolute bottom-0 left-10 size-25! border-10! md:size-32! md:border-14! option_lizard"
          >
            <img src={iconLizard} alt="Lizard" className="size-8 md:size-12" />
          </Button>

          {/* Spock */}
          <Button
            onClick={() => handleMove("spock")}
            className="absolute bottom-30 md:bottom-40 -left-5 size-25! border-10! md:size-32! md:border-14! option_spock"
          >
            <img src={iconSpock} alt="Spock" className="size-8 md:size-12" />
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-[1000px]">
          <div className="flex gap-8 items-center justify-between">
            {/* Player Choice */}
            <div className="flex flex-col items-center gap-6">
              <span className="text-lg md:text-2xl tracking-[0.15em] font-semibold">
                YOU PICKED
              </span>
              <Button
                className={`${getClassName(playerMove)} ${
                  result === "win" ? "winner-ping" : ""
                }`}
              >
                <img
                  src={playerMove ? moveData[playerMove].icon : ""}
                  alt={playerMove ? moveData[playerMove].title : ""}
                  className="size-16 md:size-24"
                />
              </Button>
            </div>

            {/* Result (desktop) */}
            <div
              className={`md:flex flex-col items-center gap-6 hidden ${
                gameState === "result" ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <span className="text-3xl md:text-5xl font-bold whitespace-nowrap">
                {result === "win" ? "YOU WIN" : result === "lose" ? "YOU LOSE" : "DRAW"}
              </span>
              <Button
                onClick={playAgain}
                className="bg-white text-dark-text text-lg px-10 py-4 
                rounded-lg hover:text-[hsl(349,71%,52%)] 
                font-semibold tracking-widest hover:bg-white"
              >
                PLAY AGAIN
              </Button>
            </div>

            {/* AI Choice */}
            <div className="flex flex-col items-center gap-6 pb-8 md:pb-0">
              <span className="text-lg md:text-2xl tracking-[0.15em] font-semibold text-center">
                THE HOUSE PICKED
              </span>
              {gameState === "waiting" ? (
                <div className="size-38 md:size-60 rounded-full bg-dark-text/60 animate-pulse" />
              ) : (
                <Button
                  className={`${getClassName(aiMove)} ${
                    result === "lose" ? "winner-ping" : ""
                  }`}
                >
                  <img
                    src={aiMove ? moveData[aiMove].icon : ""}
                    alt={aiMove ? moveData[aiMove].title : ""}
                    className="size-16 md:size-24"
                  />
                </Button>
              )}
            </div>
          </div>

          {/* Result (mobile) */}
          <div
            className={`flex flex-col items-center gap-4 md:hidden ${
              gameState === "result" ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <span className="text-3xl font-bold whitespace-nowrap">
              {result === "win" ? "YOU WIN" : result === "lose" ? "YOU LOSE" : "DRAW"}
            </span>
            <Button
              onClick={playAgain}
              className="bg-white hover:bg-white text-dark-text text-lg px-10 py-4 
              rounded-lg hover:text-[hsl(349,71%,52%)] 
              font-semibold tracking-widest"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      )}
    </>
  );
}