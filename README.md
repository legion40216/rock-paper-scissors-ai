# Rock Paper Scissors: can you beat the AI?

A solution to the [Frontend Mentor Rock, Paper, Scissors challenge](https://www.frontendmentor.io/challenges/rock-paper-scissors-game-pTgwgvgH5),
including the **Lizard Spock** bonus game. The house is an opponent that learns your habits.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · Vitest

```bash
npm install
npm run dev      # start the dev server
npm test         # unit tests (rules, reducer, opponents)
npm run lint
npm run build
```

## Structure

```
src/
  game/                  Domain logic. Pure TypeScript, no React, fully unit tested.
    moves.ts             Moves, modes, the BEATS table, getOutcome()
    reducer.ts           Round state machine + scoring (pure)
    use-game.ts          The one hook that wires reducer + opponent + timer
    opponents/           rps.ts (pattern learner), rpsls.ts (bonus), factory
  components/
    ui/                  shadcn primitives (button, dialog), restyled to the brand
    game/                token, move-picker, round-result, game (composition root)
    layout/              header, credits
    rules-dialog.tsx
  index.css              Design tokens + base styles (the only CSS file)
```

## Design decisions

- **One rules table, two modes.** RPSLS is a superset of the classic game, so a single `BEATS`
  table serves both. A mode only decides which moves are on the board.
- **Logic is separate from UI.** The round is a discriminated-union state machine
  (`picking → thinking → result`) in a pure reducer. The house's randomness and delay live in
  one `useEffect` whose cleanup cancels the timer, so resetting mid-round can't leak a stale result.
- **shadcn for actions, bespoke for tokens.** `Button` and `Dialog` (focus trap, Esc, scroll lock,
  focus return) come from shadcn. The game tokens are their own component because they are the
  product's visual identity, not a generic button.
- **Tokens, not magic values.** Colours live in `@theme` in `index.css`. Components use semantic
  utilities (`from-rock-light to-rock`), never raw hex. The token's 3D look uses container-relative
  units (`cqw`), so it's identical at any size.
- **Fluid board.** Token positions are percentages of the board, so the layout only needs a width
  cap per breakpoint.
- **Accessibility.** Real `<button>`s with names, a live-region result announcement, focus moves to
  "Play again" after a round, `prefers-reduced-motion` respected.
