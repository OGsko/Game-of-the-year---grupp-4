
import p5 from 'p5';
import { gameSketch } from './game';
import { fetchAvatar } from './modules/fetch';
import type { Avatar } from './interface';
import { questionList } from './modules/question';

export default function avatarChoise() {
    const body = document.querySelector("body");

    body?.replaceChildren();
    
    const avatarContainer = document.createElement("div");
    avatarContainer.id = "avatarContainer";

    const logInText = document.createElement("h2");
    logInText.textContent = "Login with your username:";

    const userNameInput = document.createElement("input");
    userNameInput.placeholder = "Username";
    const logInBtn = document.createElement("button");
    logInBtn.textContent = "Login"

    const or = document.createElement("p");
    or.textContent = "Or";

    const createUserText = document.createElement("h2");
    createUserText.textContent = "Create username:";
    const createBtn = document.createElement("button");
    createBtn.textContent = "Create user";

    body?.append(avatarContainer);
    avatarContainer.append(logInText, userNameInput, logInBtn, or, createUserText, createBtn);
    
    createBtn.addEventListener("click", async () => {
    avatarContainer.replaceChildren();

    const createUserHeader = document.createElement("h2");
    createUserHeader.textContent = "Create a username";
    const createUserInput = document.createElement("input");
    createUserInput.placeholder = "Username";
    
    const avatarChoiseText = document.createElement("h2");
    avatarChoiseText.textContent = "Pick an Avatar";
    
    const avatarChoise = document.createElement("div");
    avatarChoise.id = "avatarChoise";



    let selectedAvatarUrl = "";

    try {
        const avatarData = await fetchAvatar();
        // Loopar igenom och skapa img-element
        avatarData?.forEach((avatar: Avatar) => {
            const img = document.createElement("img");
            
            img.src = avatar.imageUrl; 
            img.alt = avatar.userName || "avatar";
            img.className = "avatarOption";

            img.addEventListener("click", () => {
                document.querySelectorAll(".avatarOption").forEach(i => i.classList.remove("selected"));
                img.classList.add("selected");
                
                selectedAvatarUrl = avatar.imageUrl;
            });

            avatarChoise.append(img);
        });
    } catch (err) {
        console.error("Could not get avatars:", err);
    }

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save & Play";
    
    saveBtn.addEventListener("click", () => {
        if (!selectedAvatarUrl) return alert("Pick an avatar first!");
        


        body?.replaceChildren();
        const gameContainer = document.createElement("div");
        gameContainer.id = "gameContainer";
        body?.append(gameContainer);

         const sketchWithAvatar = gameSketch(selectedAvatarUrl);

        new p5(sketchWithAvatar);
    });

    avatarContainer.append(createUserHeader, createUserInput, avatarChoiseText, avatarChoise, saveBtn);
});

}