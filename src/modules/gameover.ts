import p5 from 'p5';
import type { Scoreboard } from '../interface';
import { showLeaderboard } from './leaderboard';

let hasSaved = false;

export const drawGameOver = (p: p5, onRestart: () => void, finalScore: number) => {

 if (!hasSaved && finalScore !== undefined) {
    const playerName = localStorage.getItem("playerName") || "Spelare";
    const rawData = localStorage.getItem("Highscores");
    const allScores: Scoreboard[] = JSON.parse(rawData || "[]");
    
    allScores.push({ 
      id: playerName,
      highscore: finalScore,
      avatarId: ""
    });

    localStorage.setItem("Highscores", JSON.stringify(allScores));
    hasSaved = true;
    showLeaderboard(); // Uppdatera leaderboarden direkt
  }

  p.push();
  p.resetMatrix();
  
  // Transparent mörk bakgrund
  p.rectMode(p.CORNER);
  p.fill(0, 0, 0, 200); 
  p.rect(0, 0, p.width, p.height);

  // Röd gameover-text
  p.fill(255, 50, 50); 
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(50);
  p.text("GAME OVER", p.width / 2, p.height / 2 - 60);

  const btnW = 200;
  const btnH = 60;
  const btnX = p.width / 2;
  const btnY = p.height / 2 + 40;

  // Ritar knappen
  p.rectMode(p.CENTER);
  p.stroke(0);        // Svart ram
  p.strokeWeight(2);
  p.fill(255);        // Vit knappfärg
  p.rect(btnX, btnY, btnW, btnH, 10);

  // Text på knappen
  p.noStroke();
  p.fill(0);
  p.textSize(22);
  p.text("Restart", btnX, btnY);
  p.pop();

  // kollar om musen är över knappen när man klickar
  const isOverButton = p.mouseX > btnX - btnW/2 && 
                       p.mouseX < btnX + btnW/2 && 
                       p.mouseY > btnY - btnH/2 && 
                       p.mouseY < btnY + btnH/2;

  if (isOverButton && p.mouseIsPressed) {
    onRestart();
  }
};