import avatarChoise from "./avatar.ts";

export function startPage() {
    const welcome = document.createElement("h1");
    welcome.textContent = ("Welcome");

    const playBtn = document.createElement("button");
    playBtn.textContent = ("Start Game");
    playBtn.className = ("playBtn");

    const gameInfo = document.createElement("div");
    gameInfo.className = ("gameInfo");

    const body = document.querySelector("body");

    body?.append(welcome, playBtn, gameInfo);

    playBtn.addEventListener("click", ()=>{
        avatarChoise();
    });
}