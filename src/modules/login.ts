import p5 from 'p5';
import { gameSketch } from '../game';
import { fetchAvatar, fetchScoreBoard } from './fetch';
import type { Avatar } from '../interface';
import { questionList } from './question';
import { saveSelectedQuestions } from './state';
import { renderAvatarList } from './displayavatars';
import { deleteAccount } from './delete';

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
    logInBtn.textContent = "Login";

    const or = document.createElement("p");
    or.textContent = "Or";

    const createUserText = document.createElement("h2");
    createUserText.textContent = "Create username:";
    const createBtn = document.createElement("button");
    createBtn.textContent = "Create user";

    //Välja svårighetsgrad!------------------------------
    const difficultyText = document.createElement("h2")
    difficultyText.textContent = "select difficulty"

    const difficultyInput = document.createElement("select");
    const easyOpt = document.createElement("option");
    easyOpt.value = "easy";
    easyOpt.text = "Easy";
    const mediumOpt = document.createElement("option");
    mediumOpt.value = "medium";
    mediumOpt.text = "Medium";
    const hardOpt = document.createElement("option");
    hardOpt.value = "hard";
    hardOpt.text = "Hard"; 

    difficultyInput.add(easyOpt)
    difficultyInput.add(mediumOpt)
    difficultyInput.add(hardOpt)
    //--------------------------------------------------

    body?.append(avatarContainer);
    avatarContainer.append(logInText, userNameInput, logInBtn, or, createUserText, createBtn, difficultyText, difficultyInput);

    // Loggar in om användare finns
    logInBtn.addEventListener("click", async () => {
        const username = userNameInput.value.trim();
        if (!username) return alert("Enter your username!");

    //sparar frågorna och skickar in i state.ts
    const questions = await questionList(difficultyInput.value)
        if (questions) {
        saveSelectedQuestions(questions)
        }

        try {
            const allUsers = await fetchAvatar();
            const allScores = await fetchScoreBoard();

            const foundUser = allUsers?.find((user: Avatar) =>
                user.userName?.toLowerCase() === username.toLowerCase()
            );

            if (foundUser) {
    let userHighscore = allScores?.find((score: any) => score.avatarId === foundUser.id);

    // Om användaren finns men inte har ett highscore skapas ett på 0
    if (!userHighscore) {
        const newScoreResponse = await fetch("http://localhost:3000/scoreboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                avatarId: foundUser.id,
                highscore: 0
            })
        });
        userHighscore = await newScoreResponse.json();
    }

                body?.replaceChildren();
                const gameContainer = document.createElement("div");
                gameContainer.id = "gameContainer";
                body?.append(gameContainer);
                
                await renderAvatarList();
                deleteAccount(foundUser, allScores || []); 

                // Starta spelet
                const sketchWithAvatar = gameSketch(foundUser.imageUrl, foundUser.id, userHighscore?.id);
                new p5(sketchWithAvatar);
            } else {
                alert("Could not find username");
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }
    });

    // Skapar ny användare
    createBtn.addEventListener("click", async () => {

    //Sparar frågorna i state.ts
    const questions = await questionList(difficultyInput.value)
        if (questions) {
            saveSelectedQuestions(questions);
        }

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

            if (avatarData && avatarData.length > 0) {
        // Slice för att bara visa de 4 första img när man väljer avatar
                avatarData.slice(0, 4).forEach((avatar: Avatar) => {
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
            } else {
        avatarChoise.textContent = "No avatars available";
            }
    
        } catch (err) {
            console.error("Could not get avatars:", err);
    avatarChoise.textContent = "Images could not load.";
        }

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save & Play";

    avatarContainer.append(createUserHeader, createUserInput, avatarChoiseText, avatarChoise, saveBtn);

         saveBtn.addEventListener("click", async () => {
            const username = createUserInput.value.trim();
        
            if (!username) return alert("Please enter a username!");
            if (!selectedAvatarUrl) return alert("Pick an avatar first!");

            const newUser = {
                userName: username,
                imageUrl: selectedAvatarUrl
            };

            try {
                // Skapar den nya användaren
                const response = await fetch("http://localhost:3000/avatars", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    const createdUser = await response.json();

                    // Skapar scoreboard-posten och sparar i scoreResponse
                    const scoreResponse = await fetch("http://localhost:3000/scoreboard", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            avatarId: createdUser.id,
                            highscore: 0
                        })
                    });

                    // Hämtar datan och det nya idt från scoreboard
                    const newScoreData = await scoreResponse.json();
                    const allScores = await fetchScoreBoard();
                    
                    body?.replaceChildren();
                    const gameContainer = document.createElement("div");
                    gameContainer.id = "gameContainer";
                    body?.append(gameContainer);

                    await renderAvatarList();
                    // Använder den skapade användaren för delete-funktionen
                    deleteAccount(createdUser, allScores || []); 
                    

                    // Skickar med både avatarId och  score-idt till spelet
                    const sketchWithAvatar = gameSketch(createdUser.imageUrl, createdUser.id, newScoreData.id);
                    new p5(sketchWithAvatar);
                }
            } catch (err) {
                console.error("Network error:", err);
            }
        });
    })
}