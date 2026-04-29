import type { Question, Avatar, Scoreboard } from "../interface";
const questionUrl = "http://localhost:3000/questions"
const avatarUrl = "http://localhost:3000/avatars"
const scoreBoardUrl = "http://localhost:3000/scoreboard"

// Fetch funktioner som är redo att importeras till andra moduler, med try/catch för serversvar och felhantering.
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
        console.error("Failed to fetch question", error)
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
        console.error("Failed to fetch avatar", error)
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
        console.error("Failed to fetch scoreboard", error)
        return null
    }
}