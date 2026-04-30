import type { Avatar } from "../interface";

export async function renderAvatarList() {
    try {
        document.querySelector(".avatar-sidebar-div")?.remove();

        const response = await fetch("http://localhost:3000/avatars");
        if (!response.ok) throw new Error("Kunde inte hämta avatarer");
        
        const avatars: Avatar[] = await response.json();

        const sidebarDiv = document.createElement("div");
        sidebarDiv.className = "avatar-sidebar-div";

        const listContainer = document.createElement("ul");
        listContainer.className = "avatar-list";

        const title = document.createElement("h3");
        title.innerText = "Users:";
        title.style.textAlign = "center";
        title.className = "list-title";

        sidebarDiv.append(title, listContainer)

        document.body.prepend(sidebarDiv);


        avatars.forEach(avatar => {
        const listItem = document.createElement("li");

        const img = document.createElement("img");
        img.src = avatar.imageUrl;
        img.className = "avatar-icon";

        const name = document.createElement("span");
        name.innerText = avatar.userName;

        listItem.append(img, name);
        listContainer.append(listItem);
});
    } catch (error) {
        console.error("Error:", error);
    }
}