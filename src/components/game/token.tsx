import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { MOVE_LABEL, type Move } from "@/game/moves";

import iconRock from "@/assets/images/icon-rock.svg";
import iconPaper from "@/assets/images/icon-paper.svg";
import iconScissors from "@/assets/images/icon-scissors.svg";
import iconLizard from "@/assets/images/icon-lizard.svg";
import iconSpock from "@/assets/images/icon-spock.svg";

const ICON: Record<Move, string> = {
  rock: iconRock,
  paper: iconPaper,
  scissors: iconScissors,
  lizard: iconLizard,
  spock: iconSpock,
};

/**
 * The coloured ring. Colours come from the `@theme` tokens in index.css; the
 * 3D lip is a hard (un-blurred) shadow in the `-edge` colour. Every length is
 * in `cqw` (1% of the token's own width), so a token looks identical at any
 * size and the size is decided purely by whoever renders it.
 *
 * Class names are written out in full so Tailwind can detect them.
 */
const ring = cva(
  "absolute inset-0 rounded-full bg-linear-to-b shadow-[0_6cqw_0_0_var(--shadow-edge)]",
  {
    variants: {
      move: {
        rock: "from-rock-light to-rock [--shadow-edge:var(--color-rock-edge)]",
        paper: "from-paper-light to-paper [--shadow-edge:var(--color-paper-edge)]",
        scissors:
          "from-scissors-light to-scissors [--shadow-edge:var(--color-scissors-edge)]",
        lizard: "from-lizard-light to-lizard [--shadow-edge:var(--color-lizard-edge)]",
        spock: "from-spock-light to-spock [--shadow-edge:var(--color-spock-edge)]",
      },
    },
  },
);

interface TokenProps {
  move: Move;
  /** Adds the three expanding rings behind the winning token. */
  winner?: boolean;
  /** Tokens fill their parent's width; size them from outside. */
  className?: string;
}

/** Purely visual: wrap in a `<button>` if it needs to be interactive. */
export function Token({ move, winner = false, className }: TokenProps) {
  return (
    <div
      role="img"
      aria-label={MOVE_LABEL[move]}
      className={cn("@container relative aspect-square w-full", className)}
    >
      {winner && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full shadow-[0_0_0_14cqw_color-mix(in_oklab,var(--foreground)_6%,transparent),0_0_0_34cqw_color-mix(in_oklab,var(--foreground)_4.5%,transparent),0_0_0_56cqw_color-mix(in_oklab,var(--foreground)_3%,transparent)] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-700"
        />
      )}
      <span aria-hidden className={ring({ move })} />
      <span
        aria-hidden
        className="absolute inset-[13%] rounded-full bg-face shadow-[inset_0_5cqw_0_0_var(--color-face-shade)]"
      />
      <img
        src={ICON[move]}
        alt=""
        draggable={false}
        className="absolute inset-0 m-auto size-[36%] object-contain"
      />
    </div>
  );
}

/** Stand-in shown while the house is still choosing. */
export function EmptyToken({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="The house is choosing"
      className={cn("@container relative aspect-square w-full", className)}
    >
      <span
        aria-hidden
        className="absolute inset-[13%] rounded-full bg-black/20 motion-safe:animate-pulse"
      />
    </div>
  );
}
