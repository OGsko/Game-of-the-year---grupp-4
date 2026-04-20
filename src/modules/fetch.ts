import type { Question, Avatar, Scoreboard } from "../interface";
const questionUrl = "http://localhost:3000/questions"
const avatarUrl = "http://localhost:3000/avatars"
const scoreBoardUrl = "http://localhost:3000/scoreboard"

//Fetch functions that is ready to import into the other modules. With try/ error server respond and catch.
//The throw/catch messages may need to get updated, if we want a graphic message for the different errors.
export async function fetchQuestion(): Promise<Question[] | null> {
    try {
        const response = await fetch(questionUrl)

        if(!response.ok) {
            throw new Error (`Error when fetching Question! Status: ${response.status}`)
            return null
        }

        const data: Question[] = await response.json()

        return data
    } catch (error) {
        console.log("Failed to fetch question", error)
        return null
    }
}

export async function fetchAvatar(): Promise<Avatar[] | null> {
    try {
        const response = await fetch(avatarUrl)

        if (!response.ok) {
            throw new Error (`Error when fetching avatar! Status ${response.status}`)
            return null
        }

        const data: Avatar[] = await response.json()

        return data
    } catch (error) {
        console.log("Failed to fetch avatar", error)
        return null
    }
}

export async function fetchScoreBoard(): Promise<Scoreboard[] | null> {
    try {
        const response = await fetch(scoreBoardUrl)

        if (!response.ok) {
            throw new Error (`Error when fetching scoreboard! Status ${response.status}`)
            return null
        }

        const data: Scoreboard[] = await response.json()

        return data
    } catch (error) {
        console.log("Failed to fetch scoreboard", error)
        return null
    }
}