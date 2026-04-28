import { renderAvatarList } from "./displayavatars.ts";
import avatarChoise from "./login.ts";

export function startPage() {
    const body = document.querySelector("body");
    body?.replaceChildren(); 

    renderAvatarList();

    const mainContent = document.createElement("div");
    mainContent.className = "main-start-content"; 

    const welcome = document.createElement("h1");
    welcome.textContent = "Welcome";

    const playBtn = document.createElement("button");
    playBtn.textContent = "Start Game";
    playBtn.className = "playBtn";

    const gameInfo = document.createElement("div");
    gameInfo.className = "gameInfo";

    mainContent.append(welcome, playBtn, gameInfo);

    body?.append(mainContent);

    playBtn.addEventListener("click", () => {
        avatarChoise();
    });
}