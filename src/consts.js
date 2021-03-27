export const baseConst = {
  startLevel: 3,
  cellsCount: 25,
  timeToShowPrompt: 2000,
  timeToNewLevel: 2000,
  timeToGameOver: 2000,

  levelCoeficient: 1,
  levelScore: 5,
  levelCoeficientStep: 0.1,
  levelCompleteScore: 10,
};

export const gameStatusConst = {
  stop: 0,
  showPrompt: 1,
  play: 2,
  levelComplete: 3,
  gameOver: 4,
};

export const cellStatusConst = {
  empty: 0,
  set: 1,
  success: 2,
  fail: 3,
};
