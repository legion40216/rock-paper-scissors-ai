function createRPSAI() {
  return {
    history: [],
    patterns: {}
  };
}

function getAIMove(ai: any, playerMove: "rock" | "paper" | "scissors") {
  const moves = ["rock", "paper", "scissors"];
  
  // Store this move for NEXT prediction (learn after the fact)
  const currentMove = playerMove;
  
  // Make AI choice BEFORE learning from this round
  let aiChoice;
  
  // Only use pattern prediction 60% of the time (makes it beatable)
  const usePattern = Math.random() < 0.6 && ai.history.length >= 3;
  
  if (usePattern) {
    // Look for patterns in last few moves
    const recentMoves = ai.history.slice(-3);
    const pattern = ai.patterns[recentMoves.join(",")];
    
    if (pattern) {
      const total = pattern.rock + pattern.paper + pattern.scissors;
      
      // Only trust pattern if we've seen it at least 2 times
      if (total >= 2) {
        // Find most likely next move
        const predicted = Object.keys(pattern).reduce((a, b) => 
          pattern[a] > pattern[b] ? a : b
        );
        
        // Counter it
        if (predicted === "rock") aiChoice = "paper";
        else if (predicted === "paper") aiChoice = "scissors";
        else if (predicted === "scissors") aiChoice = "rock";
      }
    }
  }
  
  // Fallback to random (or simple counter of last move)
  if (!aiChoice) {
    if (ai.history.length > 0 && Math.random() > 0.5) {
      // Sometimes counter the last move
      const lastMove = ai.history[ai.history.length - 1];
      if (lastMove === "rock") aiChoice = "paper";
      else if (lastMove === "paper") aiChoice = "scissors";
      else aiChoice = "rock";
    } else {
      // Pure random
      aiChoice = moves[Math.floor(Math.random() * moves.length)];
    }
  }
  
  // NOW learn from this round for next time
  ai.history.push(currentMove);
  
  if (ai.history.length > 15) {
    ai.history.shift();
  }
  
  // Store pattern: last 3 moves -> what came next
  if (ai.history.length >= 4) {
    const sequence = ai.history.slice(-4, -1).join(",");
    const nextMove = ai.history[ai.history.length - 1];
    
    if (!ai.patterns[sequence]) {
      ai.patterns[sequence] = { rock: 0, paper: 0, scissors: 0 };
    }
    ai.patterns[sequence][nextMove]++;
  }
  
  return aiChoice;
}

export { createRPSAI, getAIMove };