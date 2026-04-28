import type { Avatar, Scoreboard } from "../interface";

export function deleteAccount(avatar: Avatar, allScores: Scoreboard[]) {
  const deletebtn = document.createElement("button");
  deletebtn.className = "delete-account-btn";
  deletebtn.innerText = "Delete User & Highscore";

  const sidebar = document.querySelector(".avatar-sidebar-div");
  
  if (sidebar) {
    sidebar.append(deletebtn);
  } else {
    document.body.append(deletebtn);
  }

   deletebtn.addEventListener("click", async () => {
    const confirmDelete = confirm(`Are you sure you want to delete ${avatar.userName} and the highscore?`);
    if (!confirmDelete) return;

    try {
      const scoreToDelete = allScores.find(s => s.avatarId === avatar.id);
      
      // Radera Avatar
      const avatarRes = await fetch(`http://localhost:3000/avatars/${avatar.id}`, {
        method: "DELETE"
      });

      //  Radera highscore
      if (scoreToDelete) {
        await fetch(`http://localhost:3000/scoreboard/${scoreToDelete.id}`, {
          method: "DELETE"
        });
      }

      if (avatarRes.ok) {
        alert("User and highscore deleted!");
        // skickar tillbaka till startsidan när det är raderat
        location.reload(); 
      } else {
        alert("Could not delete user!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}