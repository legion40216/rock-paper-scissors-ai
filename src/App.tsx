import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesModal from "./components/rules-modal";
import RpsSection from "./components/rps-section";
import RpslsSection from "./components/rps_bounes-section";

function App() {
  const [score, setScore]               = useState(0);
  const [toggleBounce, setToggleBounce] = useState(false);
  const [rulesOpen, setRulesOpen]       = useState(false);
  const [gameKey, setGameKey]           = useState(0);

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
    <div className="min-h-screen grid place-items-center">
      <div
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

              {toggleBounce ? "Play Regular Game" : "Play Bonus Game"}


            <div className="flex gap-4 justify-between">

                onClick={handleReset}

                Reset


              <RulesModal
                isOpen={rulesOpen}
                setOpen={setRulesOpen}
                rps={!toggleBounce}
              >

                  onClick={() => setRulesOpen(true)}
                >
                  RULES

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