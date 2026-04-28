import p5 from "p5";

export function winState() {
    console.log("GRATTIS! DU VANN!")
}


export const drawWin = (p: p5, onRestart: () => void) => {
    p.push();
  p.resetMatrix();
  
  // Transparent gul bakgrund
  p.rectMode(p.CORNER);
  p.fill(255, 255, 0, 200); 
  p.rect(0, 0, p.width, p.height);

  // Röd win-text
  p.fill(255, 50, 50); 
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(50);
  p.text("YOU WIN!", p.width / 2, p.height / 2 - 60);

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

  //kollar om musen är över knappen när man klickar
 const isOverButton = p.mouseX > btnX - btnW/2 && 
                      p.mouseX < btnX + btnW/2 && 
                      p.mouseY > btnY - btnH/2 && 
                      p.mouseY < btnY + btnH/2;

 if (isOverButton && p.mouseIsPressed) {
   onRestart();
 }
}