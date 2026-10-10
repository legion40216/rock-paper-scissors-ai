import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOVE_LABEL, type Outcome } from "@/game/moves";
import type { Round } from "@/game/reducer";

import { EmptyToken, Token } from "./token";

const OUTCOME_LABEL: Record<Outcome, string> = {
  win: "You win",
  lose: "You lose",
  draw: "Draw",
};

type RoundInProgress = Exclude<Round, { phase: "picking" }>;

interface RoundResultProps {
  round: RoundInProgress;
  onPlayAgain: () => void;
}

export function RoundResult({ round, onPlayAgain }: RoundResultProps) {
  const result = round.phase === "result" ? round : null;

  return (
    <section
      aria-label="Round"
      className="grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-12 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300 md:grid-cols-[1fr_16rem_1fr] md:gap-x-6 lg:gap-x-12"
    >
      <PickColumn label="You picked">
        <Token move={round.player} winner={result?.outcome === "win"} />
      </PickColumn>

      {/* DOM order is you -> house -> outcome (reading order); the grid places
          the outcome between the two tokens on desktop. */}
      <PickColumn label="The house picked" className="md:col-start-3 md:row-start-1">
        {result ? (
          <Token
            move={result.house}
            winner={result.outcome === "lose"}
            className="motion-safe:animate-in motion-safe:zoom-in-90 motion-safe:duration-300"
          />
        ) : (
          <EmptyToken />
        )}
      </PickColumn>

      <div className="col-span-2 flex min-h-32 flex-col items-center justify-center gap-4 md:col-span-1 md:col-start-2 md:row-start-1 md:min-h-0 md:self-center">
        {/* Always mounted so screen readers announce the text when it appears. */}
        <p
          role="status"
          className="text-center text-5xl font-bold tracking-wide whitespace-nowrap uppercase md:text-6xl"
        >
          {result && (
            <>
              <span className="sr-only">
                {`You picked ${MOVE_LABEL[result.player]}, the house picked ${MOVE_LABEL[result.house]}. `}
              </span>
              <span className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
                {OUTCOME_LABEL[result.outcome]}
              </span>
            </>
          )}
        </p>

        {result && (
          // Focus follows the player to the next action once the turn ends.
          <Button autoFocus onClick={onPlayAgain} className="w-56">
            Play again
          </Button>
        )}
      </div>
    </section>
  );
}

function PickColumn({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    // Token above the label on mobile, label above the token on desktop.
    <div className={cn("flex flex-col-reverse items-center justify-end gap-6 md:flex-col md:justify-start md:gap-10", className)}>
      <h2 className="text-center text-base font-bold tracking-[0.15em] uppercase md:text-2xl">
        {label}
      </h2>
      <div className="w-34 md:w-48 lg:w-72">{children}</div>
    </div>
  );
}
