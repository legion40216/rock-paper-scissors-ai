import { Button } from "@/components/ui/button";
import { Credits } from "@/components/layout/credits";
import { Header } from "@/components/layout/header";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { RulesDialog } from "@/components/rules-dialog";
import type { Mode } from "@/game/moves";
import { useGame } from "@/game/use-game";

import { MovePicker } from "./move-picker";
import { RoundResult } from "./round-result";

interface GameProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

/**
 * One game session. The parent renders it with `key={mode}`, so switching
 * mode remounts it and score, round and opponent all start fresh.
 */
export function Game({ mode, onModeChange }: GameProps) {
  const { round, score, play, playAgain, reset } = useGame(mode);
  const otherMode: Mode = mode === "classic" ? "bonus" : "classic";

  return (
    <div className="flex min-h-dvh flex-col gap-10 px-6 pt-8 pb-6 md:px-10 md:pt-12">
      <Header mode={mode} score={score} />

      <main className="grid flex-1 place-items-center">
        {round.phase === "picking" ? (
          <MovePicker mode={mode} onPick={play} />
        ) : (
          <RoundResult round={round} onPlayAgain={playAgain} />
        )}
      </main>

      <footer className="flex flex-col gap-6">
        {/* Mobile: toggle on its own row, Reset + Rules share the next one.
            Desktop: toggle + Reset on the left, Rules pushed to the right. */}
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center">
          <Button
            variant="outline"
            className="col-span-2 md:col-auto"
            onClick={() => onModeChange(otherMode)}
          >
            {mode === "classic" ? "Play bonus game" : "Play classic game"}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <div className="contents md:ml-auto md:block">
            <RulesDialog mode={mode} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ThemeSwitcher />
          <Credits />
        </div>
      </footer>
    </div>
  );
}
