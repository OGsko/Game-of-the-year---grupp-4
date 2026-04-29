import { renderAvatarList } from "./displayavatars.ts";
import avatarChoise from "./login.ts";
import type { Scoreboard } from "../interface.ts";
import { showleaderboard } from "./leaderboard";



//rendrerar startskärmen
export function startPage() {
    const body = document.querySelector("body");
    body?.replaceChildren(); 

    const leaderboardContainer = document.createElement("div");
    leaderboardContainer.id = "leaderboard-container"; 

    const header = document.createElement("h2");
    header.textContent = "High Score";

    const scoreList = document.createElement("ul");
    scoreList.id = "score-list"; 

     leaderboardContainer.append(header, scoreList);
    body?.append(leaderboardContainer); 

    const mainContent = document.createElement("div"); // HÄR SKAPAS VARIABELN
    mainContent.className = "main-start-content"; 
    mainContent.id = "app-content";

    const welcome = document.createElement("h1");
    welcome.textContent = "Welcome";

    const playBtn = document.createElement("button");
    playBtn.textContent = "Start Game";
    playBtn.className = "playBtn";

    const avatarBox = document.createElement("div");
    avatarBox.id = "avatar-display-area";

    const gameInfo = document.createElement("div");
    gameInfo.className = "gameInfo";

    mainContent.append(welcome, playBtn, gameInfo, avatarBox);

    body?.append(mainContent);

    showleaderboard();
    renderAvatarList();

    playBtn.addEventListener("click", () => {
        avatarChoise();
    });
}
