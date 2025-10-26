import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesModal from "./components/rules-modal";
import RpsSection from "./components/rps-section";
import RpslsSection from "./components/rpsls-section"; // Import the new component

function App() {
  const [score, setScore] = useState<number>(0);
  const [toggleBounce, setToggleBounce] = useState(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);

  const handleToggleGame = () => {
    setToggleBounce((prev) => !prev);
    setScore(0);
    setGameKey((prev) => prev + 1);
  }

  const handleReset = () => {
    setScore(0);
    setGameKey((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen background-gradient grid place-items-center">
      <div className="h-full grid grid-rows-[min-content_1fr_min-content] 
          text-white container mx-auto p-4 space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-dark-text 
             border-4 rounded-2xl p-4 w-full"
        >
          <div className="flex flex-col">
            <span className="text-2xl">ROCK</span>
            <span className="text-2xl">PAPER</span>
            <span className="text-2xl">SCISSORS</span>
            {toggleBounce && (
              <>
                <span className="text-2xl">LIZARD</span>
                <span className="text-2xl">SPOCK</span>
              </>
            )}
          </div>

          <h1 className="text-white text-center text-lg md:text-3xl">
            Can you beat the AI?
          </h1>

          <div className="h-full w-32 flex items-center justify-center 
             bg-white rounded-lg p-2"
          >
            <div className="flex flex-col items-center">
              <span className="text-base text-score-text">SCORE</span>
              <span className="text-6xl text-dark-text font-bold">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Game area */}
        <div className="grid place-items-center">
          {toggleBounce ? (
            <RpslsSection key={gameKey} setScore={setScore} />
          ) : (
            <RpsSection key={gameKey} setScore={setScore} />
          )}
        </div>

        {/* Rules button */}
        <div className="flex flex-col gap-2">
          <p className="text-white text-center order-1 md:order-0 md:text-left">
            powered by
            <span className="text-white font-bold  ml-2">SYNAPTIC.js</span>
          </p>

          <div className="flex flex-col md:flex-row justify-between gap-4 ">
            <Button
              className="border-dark-text bg-transparent border-2 px-8 py-3 
            hover:bg-transparent text-white hover:border-dark-text/50 
            text-base"
              onClick={handleToggleGame}
            >
              {toggleBounce ? "Play Regular Game" : "Play Bonus Game"}
            </Button>

            <div className="flex gap-4 justify-between">
              <Button
                className="border-dark-text bg-transparent border-2 px-8 py-3 
              hover:bg-transparent text-white hover:border-dark-text/50 
              text-base"
                onClick={handleReset}
              >
                Reset
              </Button>

              <RulesModal
                isOpen={rulesOpen}
                setOpen={setRulesOpen}
                rps={!toggleBounce}
              >
                <Button
                  className="border-dark-text bg-transparent border-2 px-8 py-3 
                hover:bg-transparent text-white hover:border-dark-text/50 
                text-base"
                  onClick={() => setRulesOpen(true)}
                >
                  RULES
                </Button>
              </RulesModal>
            </div>
          </div>
        </div>
      </div>

      <div className="attribution text-white">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor
        </a>
        . Coded by <a href="#">Suleman Lohar</a>.
      </div>
    </div>
  );
}

export default App;