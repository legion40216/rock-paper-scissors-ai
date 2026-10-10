import { useState } from "react";

import { Game } from "@/components/game/game";
import type { Mode } from "@/game/moves";

export default function App() {
  const [mode, setMode] = useState<Mode>("classic");

  // `key` remounts <Game> on mode change, which resets its whole state.
  return <Game key={mode} mode={mode} onModeChange={setMode} />;
}
