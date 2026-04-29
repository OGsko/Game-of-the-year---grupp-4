import type { Avatar } from "../interface";


export async function showleaderboard() {
    const listContainer = document.querySelector("#score-list");
    if (!listContainer) return;

     try { // hämtar både poäng och avatar
      const scoreRes = await fetch("http://localhost:3000/scoreboard");
      const allScores = await scoreRes.json();

      const avatarRes = await fetch("http://localhost:3000/avatars");
      const allAvatars: Avatar[] = await avatarRes.json();


        allScores.sort((a: any, b: any) => b.highscore - a.highscore);
        const topFiveScores = allScores.slice(0, 5);

        listContainer.replaceChildren();

        
        topFiveScores.forEach((entry: any, index: number) => {
            const matchingAvatar =allAvatars.find((a: any) => a.id === entry.id || a.id === entry.avatarId);
            const displayName = matchingAvatar ? matchingAvatar.userName : "Okänd";
            const li = document.createElement("li");

            const rankDisplay = document.createElement("span");
            rankDisplay.className = ("player-rank");
            rankDisplay.textContent = `${index + 1}. `;
            
            const userIdent = document.createElement("span");
            userIdent.className = "player-name";
  
            userIdent.textContent = `${displayName} `; 

            const scoreSpan = document.createElement("span");
            scoreSpan.className = "player-score";
            scoreSpan.textContent = entry.highscore.toString();

            li.append(rankDisplay, userIdent, scoreSpan);
            listContainer.appendChild(li);
        });
    } catch (err) {
        console.error("Felsökning:", err);
    }
}
