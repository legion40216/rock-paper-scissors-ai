import { cn } from "@/lib/utils";
import { MOVE_LABEL, type Mode, type Move } from "@/game/moves";

import bgTriangle from "@/assets/images/bg-triangle.svg";
import bgPentagon from "@/assets/images/bg-pentagon.svg";

import { Token } from "./token";

/**
 * Board geometry. Everything is a percentage of the board's width/height, so
 * the board scales fluidly: only its max width changes between breakpoints.
 *
 * Token centres sit on the corners of the background outline. The `bg`
 * offsets are derived from the SVG's own vertex coordinates so the lines
 * meet the token centres exactly.
 */
interface Layout {
  /** Caps the board's width at each breakpoint. */
  widthClass: string;
  /** CSS `aspect-ratio` of the board. */
  aspect: string;
  /** Token diameter, as % of board width. */
  tokenSize: number;
  background: { src: string; left: number; top: number; width: number };
  /** Token centres, as % of board width (x) and height (y). */
  slots: readonly { move: Move; x: number; y: number }[];
}

const LAYOUTS: Record<Mode, Layout> = {
  classic: {
    widthClass: "max-w-78 md:max-w-120",
    aspect: "100 / 93.34",
    tokenSize: 42,
    background: { src: bgTriangle, left: 20.08, top: 20.87, width: 61.65 },
    slots: [
      { move: "paper", x: 21, y: 22.5 },
      { move: "scissors", x: 79, y: 22.5 },
      { move: "rock", x: 50, y: 77.5 },
    ],
  },
  bonus: {
    widthClass: "max-w-80 md:max-w-120",
    aspect: "100 / 96.62",
    tokenSize: 31,
    background: { src: bgPentagon, left: 13.44, top: 13.91, width: 73.12 },
    slots: [
      { move: "scissors", x: 50, y: 16.04 },
      { move: "paper", x: 84.5, y: 41.98 },
      { move: "rock", x: 71.32, y: 83.96 },
      { move: "lizard", x: 28.68, y: 83.96 },
      { move: "spock", x: 15.5, y: 41.98 },
    ],
  },
};

interface MovePickerProps {
  mode: Mode;
  onPick: (move: Move) => void;
}

export function MovePicker({ mode, onPick }: MovePickerProps) {
  const { widthClass, aspect, tokenSize, background, slots } = LAYOUTS[mode];

  return (
    <div
      role="group"
      aria-label="Choose your move"
      className={cn(
        "relative w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300",
        widthClass,
      )}
      style={{ aspectRatio: aspect }}
    >
      <img
        src={background.src}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute max-w-none"
        style={{
          left: `${background.left}%`,
          top: `${background.top}%`,
          width: `${background.width}%`,
        }}
      />

      {slots.map(({ move, x, y }) => (
        <button
          key={move}
          type="button"
          onClick={() => onPick(move)}
          aria-label={`Play ${MOVE_LABEL[move]}`}
          className="absolute -translate-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring motion-safe:transition-transform motion-safe:hover:scale-105 motion-safe:active:scale-95"
          style={{ left: `${x}%`, top: `${y}%`, width: `${tokenSize}%` }}
        >
          <Token move={move} />
        </button>
      ))}
    </div>
  );
}
