// resetar spelet när man klickar på knappen som startar om spelet

import p5 from 'p5';

// Funktionen som ritar knappen på skärmen
export const drawResetButton = (p: p5) => {
  const x = 540;
  const y = 30;
  const w = 80;
  const h = 30;

  p.push();
  p.resetMatrix();
  p.rectMode(p.CENTER);
   p.fill(255);
  p.rect(x, y, w, h, 5);

  p.noStroke();
  p.fill(0);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("Restart", x, y);
  p.pop();

   return p.mouseX > x - w/2 && p.mouseX < x + w/2 &&
         p.mouseY > y - h/2 && p.mouseY < y + h/2;
};

export const getResetSettings = () => {
  return {
    lives: 3,
    posX: 0,
    posY: 0,
    jumpCount: 0,
    gameStopped: false,
    gameStarted: false,
    laptops: [600, 1000, 1400],
    brokenLaptops: [false, false, false],
    hasJumpedOver: [false, false, false],
    masterMood: 'neutral' as const,
    masterMessage: "Hehe! To continue you need to answer this...",
    isGameOver: false,
    waitingForAnswer: false,
    isShaking: false
  };
};