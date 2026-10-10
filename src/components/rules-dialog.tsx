import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Mode } from "@/game/moves";

import rulesClassic from "@/assets/images/image-rules.svg";
import rulesBonus from "@/assets/images/image-rules-bonus.svg";

const RULES: Record<Mode, { image: string; summary: string }> = {
  classic: {
    image: rulesClassic,
    summary: "Paper beats rock, rock beats scissors, scissors beats paper.",
  },
  bonus: {
    image: rulesBonus,
    summary:
      "Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and rock crushes scissors.",
  },
};

/**
 * Radix (via shadcn's Dialog) provides the hard parts: focus trap, Esc to
 * close, scroll lock, `aria-modal` and returning focus to the trigger. This
 * file is only the content plus the layout:
 *
 *   mobile : full screen, title / image / close stacked top to bottom
 *   desktop: centred card, title left and close button right on one row
 */
export function RulesDialog({ mode }: { mode: Mode }) {
  const { image, summary } = RULES[mode];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rules</Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={[
          // surface
          "border-0 bg-card text-card-foreground",
          // mobile: full screen, three rows (title / image / close)
          "inset-0 h-dvh max-w-none translate-0 grid-rows-[auto_1fr_auto] justify-items-center rounded-none p-8 sm:max-w-none",
          // desktop: centred card, two columns (title | close), image below
          "md:inset-auto md:top-1/2 md:left-1/2 md:h-auto md:max-w-sm md:-translate-1/2 md:grid-cols-[1fr_auto] md:grid-rows-none md:justify-items-stretch md:gap-8 md:rounded-lg",
        ].join(" ")}
      >
        <DialogTitle className="text-3xl font-bold tracking-wide uppercase md:col-start-1 md:row-start-1">
          Rules
        </DialogTitle>

        <DialogDescription className="sr-only">{summary}</DialogDescription>

        <img src={image} alt={summary} className="w-full max-w-xs self-center md:col-span-2 md:max-w-none" />

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close rules"
            className="focus-visible:ring-dark-text/40 md:col-start-2 md:row-start-1"
          >
            <X className="size-6" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
