import { MODES, type Mode } from "@/game/moves";

import logoClassic from "@/assets/images/logo.svg";
import logoBonus from "@/assets/images/logo-bonus.svg";

const LOGO: Record<Mode, { src: string; className: string }> = {
  classic: { src: logoClassic, className: "h-12 md:h-24" },
  bonus: { src: logoBonus, className: "h-14 md:h-28" },
};

interface HeaderProps {
  mode: Mode;
  score: number;
}

export function Header({ mode, score }: HeaderProps) {
  const logo = LOGO[mode];

  return (
    <header className="mx-auto flex w-full max-w-175 items-center justify-between rounded-xl border-[3px] border-border py-3 pr-3 pl-5 md:rounded-2xl md:py-5 md:pr-5 md:pl-7">
      <h1>
        <img
          src={logo.src}
          alt={MODES[mode].title}
          className={`${logo.className} [filter:var(--logo-filter)]`}
        />
      </h1>

      <div className="flex w-20 flex-col items-center rounded-lg bg-card py-2 md:w-36 md:rounded-xl md:py-4">
        <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase md:text-lg">
          Score
        </span>
        <span
          aria-label={`Score: ${score}`}
          className="text-5xl leading-none font-bold text-card-foreground tabular-nums md:text-7xl"
        >
          {score}
        </span>
      </div>
    </header>
  );
}
