import p5 from 'p5';
import { renderQuestion } from './modules/question';
import { getSelectedQuestions, saveScore, getScore, getCurrentQuestionIndex, updateQuestionIndex, currentQuestionIndex } from './modules/state';
import type { Question } from './interface';
import { shakeScreen } from './modules/effects';
import { drawGameOver } from './modules/gameover';
import { drawResetButton, getResetSettings } from './modules/resetGame';
import { drawWin } from './modules/win';

const clearQuestion = () => {
  const qContainer = document.querySelector(".question-container");
  if (qContainer) qContainer.remove();
};

export const gameSketch = (chosenImg: string, id: string, scoreRowId?: string) => (p: p5) => {
  let headImg: p5.Image | null = null; // Behållare för master img
  let lashaImg: p5.Image | null = null;
  let playerImg: p5.Image | null = null;
  let posX: number = 0; // Gubbens position i sidled (vänster/höger)
  let posY: number = 0;  // Gubbens position i höjdled (när den hoppar)
  let speed: number = 5; // Hur snabbt gubben rör sig
  let direction: number = -1;  // Åt vilket håll gubben tittar (-1 eller 1)
  let step: number = 0; // Variabel för att animera benen
  let jumpStrength: number = 0; // Hur högt gubben hoppar
  const gravity: number = 0.8; // Dragningskraft som drar ner gubben
  const groundY: number = 10; // Var marken är
  let levelSpeed: number = 5; // Hur snabbt laptopsen rör sig mot gubben
  let laptops: number[] = [600, 1000, 1400]; // Startpositioner för 3 laptops
  let hasJumpedOver: boolean[] = [false, false, false]; // Håller koll på om vi räknat hopp
  let jumpCount: number = 0; // Räknare för hur många laptops man hoppat över
  let gameStopped: boolean = false;  // Blir 'true' när man vinner
  let gameStarted: boolean = false; // Blir 'true' när spelet startas
  let lives: number = 3; // Börjar med 3 liv
  let score: number = 0; // Spelet börjar på 0 poäng
  let brokenLaptops: boolean[] = [false, false, false];
  let laptopsToWin = 2;
  let hasSaved: boolean = false;
  let waitingForAnswer: boolean = false;
  let isHandlingQuestion : boolean = false;
  let isGameOver: boolean = false;
  let isShaking: boolean = false;
  let shakeTimer: number = 0;
  let masterMood: 'neutral' | 'disappointed' = 'neutral';
  let initialScore: number = 0;
  let masterMessage = "Hehe! To continue you need to answer this...";
  let lashaMessage = "Good work champion! You have defeated webmaster Freddan!"

  p.setup = () => {
    const canvas = p.createCanvas(600, 600); // Storlek på spelrutan
    canvas.parent('gameContainer'); // Sätter in spelrutan i gameContainer
    canvas.elt.setAttribute('tabindex', '0'); // Gör att canvasen kan ta emot tangenttryck direkt

    const playerPath = chosenImg.startsWith('/') ? chosenImg : `/${chosenImg}`;
    p.loadImage(playerPath, (img) => {
      playerImg = applyMask(img, p);
    });

    p.loadImage('/master.png', (img) => {
      // bakom img är ansiktet maskat med vit bubbla
      const maskGraphics = p.createGraphics(img.width, img.height);
      maskGraphics.fill(255);
      maskGraphics.noStroke();
      maskGraphics.ellipse(img.width / 2, img.height / 2, img.width, img.height);
      //img.mask(maskGraphics as any);
      headImg = img; 
    }, () => {
      console.error("Error: Could not find img");
    });

    p.loadImage("/public/lasha.png", (img) => {
      lashaImg = img;
    }, () => {
      console.error("Error: Could not find Lars img")
    })
  };
  // när mellanslag trycks ner hoppar gubben
  p.keyPressed = () => {
    if (p.keyCode === 32 && posY === groundY && !gameStopped) {
      jumpStrength = -16; // styr positionen på hoppet
    }
  };

 p.draw = () => {
  // Återställer allt om liven är slut
  if (lives <= 0) {
    p.resetMatrix();
    drawGameOver(p, () => {
       clearQuestion();
      masterMood = 'neutral';
      masterMessage = "Hehe! To continue you need to answer this...";
      lives = 3;
      score = initialScore;
      jumpCount = 0;
      posX = 0;
      laptops = [600, 1000, 1400];
      brokenLaptops = [false, false, false];
      hasJumpedOver = [false, false, false];
      gameStopped = false;
      waitingForAnswer = false;
      isHandlingQuestion = false;
      updateQuestionIndex(0)
    });
    return;

  }

  //Visar Win skärmen när spelaren har svarat på 10 frågor. Återställer variabler.
if (currentQuestionIndex >= 10) {
  p.resetMatrix();

    //sparar scoren när man svarat på alla frågor i highscore om score för spelet om score var högre än lagrade highscore.
    hasSaved = false; 
    if (!hasSaved && scoreRowId) {
      updateHighScore();
    }

  drawWin(p, () => {
      clearQuestion();
      masterMood = 'neutral';
      masterMessage = "Hehe! To continue you need to answer this...";
      lives = 3;
      score = initialScore;
      jumpCount = 0;
      posX = 0;
      laptops = [600, 1000, 1400];
      brokenLaptops = [false, false, false];
      hasJumpedOver = [false, false, false];
      gameStopped = false;
      waitingForAnswer = false;
      isHandlingQuestion = false;
      updateQuestionIndex(0)
    })
    
  //När du har svarat på alla frågor och vunnit kommer Lars fram och gratulerar dig.
  p.push();
  p.translate(p.width / 2 - 200, p.height / 2 + 2); //position
  drawCharacter(0, p.color(225, 41, 182), lashaImg || undefined);
  //Lashas pratbubbla.
  p.rectMode(p.CORNER);
  p.fill(255); p.stroke(0); p.strokeWeight(2);
  p.rect(-35, -150, 180, 60, 10); 
  p.triangle(10, -90, 30, -90, 20, -75);
  p.noStroke(); p.fill(0); p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(lashaMessage, -35, -150, 180, 60); 
  p.pop();


  return;
}
    // skärmen skakar om man svarar fel i effects.ts
  if (isShaking && shakeTimer > 0) {
      shakeScreen(p);
      shakeTimer--;
    } else {
      isShaking = false;
    }
    // färg på "himlen"
    p.background(135, 206, 235); 

    // markfärg
    p.noStroke();
    p.fill(34, 139, 34); // gräsfärg
    p.rect(0, p.height / 2 + 235, p.width, p.height);

    // kanten mellan himlen och gräset
    p.stroke(0);
    p.strokeWeight(1);
    p.line(0, p.height / 2 + 235, p.width, p.height / 2 + 235);

     if (!gameStarted) {
      p.fill(0); // Svart textfärg
      p.textSize(24); // Storlek på texten
      p.textAlign(p.CENTER); // Centreras på skärmen
      p.text("Press right arrow to start", p.width / 2, p.height / 2 + -100); // -100 flyttar texten 100 pixlar upp från mitten
      
      // Ritar gubben stillastående
      p.push();
      p.translate(p.width / 2 + posX, p.height / 2 + posY);
      drawCharacter(0, p.color(30, 100, 200), playerImg || undefined);
      p.pop();

      if (p.keyIsDown(p.RIGHT_ARROW)) {
        initialScore = Number(getScore()) || 0;
        gameStarted = true;
      }
      return;
    }

     if (!gameStopped) {
      for (let i = 0; i < laptops.length; i++) {
        laptops[i] -= levelSpeed;

        let distanceX = p.abs((p.width / 2 + posX) - laptops[i]);

        if (distanceX < 40 && posY > -10 && !brokenLaptops[i] && !hasJumpedOver[i]) {
          lives -= 1;             
          score -= 1;             
          brokenLaptops[i] = true; 
          laptops[i] = -100; // Skickar bort laptopen så den "pajar"
        }

        // Kollar lyckat hopp
        if (laptops[i] < p.width / 2 + posX && !hasJumpedOver[i] && !brokenLaptops[i]) {
          jumpCount++; 
          score += 1;  
          hasJumpedOver[i] = true;
          hasSaved = false;
        }

        // Återställer laptop (När den åkt ut till vänster)
        if (laptops[i] < -50) {
          laptops[i] = p.width + p.random(300, 600);
          hasJumpedOver[i] = false;
          brokenLaptops[i] = false; 
        }

        // Ritar laptop, visas bara om den inte pajat
        if (!brokenLaptops[i]) {
          p.push();
          p.translate(laptops[i], p.height / 2 + 190);
          p.noStroke();
          p.fill(50); p.rect(0, 0, 50, 35, 5);
          p.fill(100, 200, 255); p.rect(5, 5, 40, 25);
          p.fill(80); p.rect(-5, 35, 60, 10, 2);
          p.pop();
        }
      }

      // Spelarrörelse (Höger/Vänster)
      if (p.keyIsDown(p.RIGHT_ARROW)) { posX += speed; direction = -1; step += 0.2; } 
      else if (p.keyIsDown(p.LEFT_ARROW)) { posX -= speed; direction = 1; step += 0.2; } 
      else { step = 0; }
    }

    posY += jumpStrength;
    if (posY < groundY) { jumpStrength += gravity; } 
    else { posY = groundY; jumpStrength = 0; }

    posX = p.constrain(posX, -250, 80);
    
    // jumpcount styr hur många laptops som behöver hoppas innan master dyker upp
      if ((jumpCount >= laptopsToWin || waitingForAnswer) && posY === groundY) {
      if (!gameStopped) {
        gameStopped = true;
        waitingForAnswer = true
        isHandlingQuestion = true
        masterMood = 'neutral';
        masterMessage = "Hehe! To continue you need to answer this...";
        //Tar korrekta frågorna och kallar på hanterings funktionen.
        //(Se nedan kommentar för handleQuestion)
        const questions = getSelectedQuestions()
        if (questions) {
          saveScore(score) //sparar den nuvarande scoren i state.ts
          handleQuestion(questions[getCurrentQuestionIndex()]) 
        }
      }
      


     if (!hasSaved && scoreRowId) {
      updateHighScore()

      if (masterMood === 'disappointed') {
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.arc(0, -15, 20, 10, p.PI, 0); // Ledsen mun
      }
      
  }

      p.push();
      p.translate(p.width / 2 + 150, p.height / 2 + 10);  // sista värdet styr masters position
      
      // Ritar Master-gubben. RGB styr färgen på tröjan
      drawCharacter(0, p.color(50, 150, 50), headImg || undefined);
      
      // Pratbubbla
      p.rectMode(p.CORNER);
      p.fill(255); p.stroke(0); p.strokeWeight(2);
      p.rect(-35, -150, 180, 60, 10); 
      p.triangle(10, -90, 30, -90, 20, -75);
      p.noStroke(); p.fill(0); p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(masterMessage, -35, -150, 180, 60); 
      p.pop();
    }

    p.push();
    p.translate(p.width / 2 + posX, p.height / 2 + posY);
    p.scale(direction, 1);
    drawCharacter(step, p.color(30, 100, 200), playerImg || undefined);;
    p.pop();
    
    // Lives och score i vänstra hörnet
    p.push();
      p.fill(255, 0, 0); // Röd text
      p.textSize(22);
      p.textAlign(p.LEFT);
      p.text(`Lives: ${"❤️".repeat(Math.max(0, lives))}`, 20, 40);
      p.text(`Score: ${score}`, 20, 70);
      p.pop();


      // restart-knapp
      if (gameStarted && !isGameOver) {
      const isHovering = drawResetButton(p);
      if (isHovering && p.mouseIsPressed) {
        clearQuestion(); // Tar bort HTML-elementet
        const s = getResetSettings();
        
        lives = s.lives;
        score = initialScore;
        saveScore(score);
        gameStarted = false; 
        gameStopped = false;
        waitingForAnswer = false;
        isHandlingQuestion = false; // Återställ logiken här med
        jumpCount = 0;
        posX = 0;
        laptopsToWin = 2;
        laptops = [600, 1000, 1400];
        brokenLaptops = [false, false, false];
        hasJumpedOver = [false, false, false];
        masterMood = 'neutral';
        masterMessage = "Hehe! To continue you need to answer this...";
      }
    }
  }

  function applyMask(img: p5.Image, p: p5) {
    const mg = p.createGraphics(img.width, img.height);
    mg.fill(255);
    mg.noStroke();
    mg.ellipse(img.width / 2, img.height / 2, img.width, img.height);
    img.mask(mg as any);
    return img;
  }

  function drawCharacter(s: number, shirtColor: p5.Color, img?: p5.Image): void {
    let legLength = 150;
    let legStart = 70;
    let leftLegY = legLength + p.sin(s) * 20; // styr hur högt benen rör sig 
    let rightLegY = legLength + p.cos(s) * 20;

    // Ben och skor
    p.fill(50);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(-15, legStart, 20, leftLegY);
    p.rect(15, legStart, 20, rightLegY);

    p.fill(30); 
    p.push();
    p.translate(-15, legStart + leftLegY);
    p.ellipse(0, 0, 40, 20);
    p.fill(255, 50); p.rect(-10, -5, 15, 5, 2);
    p.pop();

    p.push();
    p.translate(15, legStart + rightLegY);
    p.ellipse(0, 0, 40, 20);
    p.fill(255, 50); p.rect(-10, -5, 15, 5, 2);
    p.pop();
    
    // Nacke
    p.noStroke();
    p.fill(220, 170, 130);
    p.rectMode(p.CENTER);
    p.rect(0, 5, 25, 30);

    // Armar och kropp
    p.stroke(220, 170, 130); 
    p.strokeWeight(12);
    p.line(-35, 20, -50, 90); 
    p.line(35, 20, 50, 90);  
    
    p.noStroke();
    p.fill(shirtColor);
    p.rectMode(p.CENTER);
    p.rect(0, 50, 70, 90, 10); 

    // Huvudet
    if (img && img.width > 1) {
      p.push();
      p.imageMode(p.CENTER);
      p.image(img, 0, -30, 102, 102); 
      p.pop();
    } else {
      // om img inte hittas ritas ett "vanligt" ansikte
      p.push();
      p.fill(220, 170, 130);
      p.noStroke();
      p.ellipse(0, -30, 90, 102); 
      p.fill(255); p.ellipse(-15, -35, 20, 10); p.ellipse(15, -35, 20, 10); 
      p.fill(0); p.circle(-15, -35, 5); p.circle(15, -35, 5); 
      p.noFill(); p.stroke(150, 50, 50); p.strokeWeight(2);
      p.arc(0, -10, 30, 15, 0, p.PI); 
      p.noStroke(); p.fill(200, 150, 110); p.triangle(-5, -25, 5, -25, 0, -20); 
      p.fill(80, 50, 20); p.arc(0, -45, 95, 80, p.PI, 0); 
      p.pop();
    }

     if (lives <= 0) {
       p.resetMatrix(); // Nollställer position
      drawGameOver(p, () => {
        // Tar bort frågan så den inte ligger kvar
        const qBox = document.querySelector(".question-container");
        if (qBox) qBox.remove();
        // Logik för att nollställa spelet
        lives = 3;
        score = 0; // Poängen man hade när man startade
        jumpCount = 0;
        gameStopped = false;
        posX = 0;
        laptopsToWin = 2;
        laptops = [600, 1000, 1400];
        brokenLaptops = [false, false, false];
        hasJumpedOver = [false, false, false];
      });
      return;
    }
  }

  //Funktion för att updatera highscore genom PUT till databasen.
  function updateHighScore() {
    hasSaved = true;

    fetch(`http://localhost:3000/scoreboard/${scoreRowId}`)
      .then(res => res.json())
      .then(async (currentEntry) => {
        
        // Spara bara om det är nytt rekord
        if (score > currentEntry.highscore) {
          
          await fetch(`http://localhost:3000/scoreboard/${scoreRowId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              avatarId: id,
              highscore: score,
              id: scoreRowId 
            })
          });
        }
      })
      .catch(err => {
        console.error("Could not update points:", err);
        hasSaved = false; // Tillåt nytt försök om det sket sig
      });
      }
//Denna funktion kallar på renderQuestion så det rendreras ut och väntar på return från render funktionen för att sedan uppdatera score variabeln. 
  async function handleQuestion(question: Question) {
  const scoreBefore = score;
  
  await renderQuestion(question);
  const newScore = getScore();
  
  if (newScore > scoreBefore) {
      // RÄTT! Gå vidare till nästa fråga...
      score = newScore;
      hasSaved = false;
      masterMood = 'neutral';
      masterMessage = "Correct! You may pass.";
      gameStopped = false;
      waitingForAnswer = false;
      isHandlingQuestion = false;
      // reset till 0
      jumpCount = 0;
      // random laptops mellan 1-10
       laptopsToWin = Math.floor(Math.random() * 10) + 1;
    } else {
      // FEL! Minska liv och skaka skärmen
      lives -= 1;
      isShaking = true;
      shakeTimer = 30;
      masterMood = 'disappointed';
      masterMessage = "Oh no, I am disappointed. Try again!";

      if (lives > 0) {
        // försök igen på samma fråga
        handleQuestion(question); 
      }
    }
  }

  //"nollar" vairablerna för spellogiken.
  gameStopped = false
  waitingForAnswer = false
  jumpCount = 0
  laptops = [600, 1000, 1400]
  hasJumpedOver = [false, false, false]
  brokenLaptops = [false, false, false]
  isHandlingQuestion = false
}

