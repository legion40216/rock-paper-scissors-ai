import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// You'll need to import these - adjust paths as needed
import iconRock from "../assets/images/icon-rock.svg";
import iconPaper from "../assets/images/icon-paper.svg";
import iconScissors from "../assets/images/icon-scissors.svg";

import bgTriangle from "../assets/images/bg-triangle.svg";
import { createRPSAI, getAIMove } from "@/utils/rpsAI";

interface RpsSectionProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function RpsSection({ setScore }: RpsSectionProps) {
  const [ai, setAI] = useState<any | null>(null);
  const [playerMove, setPlayerMove] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [aiMove, setAIMove] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [gameState, setGameState] = useState<"playing" | "waiting" | "result">("playing");
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);

  useEffect(() => {
    setAI(createRPSAI());
  }, []);

  const moveData = {
    rock: { title: "rock", icon: iconRock, color: "hsl(349, 71%, 52%)" },
    paper: { title: "paper", icon: iconPaper, color: "hsl(230, 89%, 62%)" },
    scissors: { title: "scissors", icon: iconScissors, color: "hsl(39, 89%, 49%)" },
  };

  const handleMove = (move: "rock" | "paper" | "scissors") => {
    if (!ai || gameState !== "playing") return;

    setPlayerMove(move);
    setGameState("waiting");

    setTimeout(() => {
      const aiChoice = getAIMove(ai, move);
      setAIMove(aiChoice as "rock" | "paper" | "scissors");

      let gameResult;
      if (
        (move === "rock" && aiChoice === "scissors") ||
        (move === "paper" && aiChoice === "rock") ||
        (move === "scissors" && aiChoice === "paper")
      ) {
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

  return (
    <>
      {gameState === "playing" ? (
        <div className="relative w-[300px] md:w-[400px] aspect-square mx-auto">
        <img src={bgTriangle} alt="Triangle Background" className="shape-bg" />

        <Button
            onClick={() => handleMove("paper")}
            className="absolute top-0 left-0 option_paper"
        >
            <img src={iconPaper} alt="Paper" className="size-14" />
        </Button>

        <Button
            onClick={() => handleMove("scissors")}
            className="absolute top-0 right-0 option_scissors"
        >
            <img src={iconScissors} alt="Scissors" className="size-14" />
        </Button>

        <Button
            onClick={() => handleMove("rock")}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 option_rock"
        >
            <img src={iconRock} alt="Rock" className="size-14" />
        </Button>
        </div>
      ) : (
        <div className="w-full max-w-[1000px]">
          <div className="flex gap-8 items-center justify-between"
          >
            {/* Player Choice */}
            <div className="flex flex-col items-center gap-6">
              <span className="text-lg md:text-2xl tracking-[0.15em] font-semibold">
                YOU PICKED
              </span>
              <Button
                className={`${
                  playerMove === "rock"
                    ? "result-rock"
                    : playerMove === "paper"
                    ? "result-paper"
                    : "result-scissors"
                } ${result === "win" ? "winner-ping" : ""}`}
              >
                <img
                  src={playerMove ? moveData[playerMove].icon : ""}
                  alt={playerMove ? moveData[playerMove].title : ""}
                  className="size-16 md:size-24"
                />
              </Button>
            </div>

            {/* Result (desktop) */}
            <div className={`md:flex flex-col items-center gap-6 hidden ${
                gameState === "result" ? "opacity-100 scale-100" : 
                "opacity-0 scale-75"
              }`}
            >
              <span className="text-3xl md:text-5xl font-bold whitespace-nowrap">
                {result === "win" ? "YOU WIN" : result === "lose" ? "YOU LOSE" : 
                "DRAW"
                }
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
              <span className="text-lg md:text-2xl tracking-[0.15em] 
              font-semibold text-center"
              >
                THE HOUSE PICKED
              </span>
              {gameState === "waiting" ? (
                <div className="size-38 md:size-60 rounded-full 
                bg-dark-text/60 animate-pulse" 
                />
              ) : (
                <Button
                  className={`${
                    aiMove === "rock"
                      ? "result-rock"
                      : aiMove === "paper"
                      ? "result-paper"
                      : "result-scissors"
                  } ${result === "lose" ? "winner-ping" : ""}`}
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
              className="bg-white hover:bg-white text-dark-text text-lg px-10 py-4 rounded-lg hover:text-[hsl(349,71%,52%)] font-semibold tracking-widest"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      )}
    </>
  );
}