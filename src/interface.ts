//interface för varje datatyp

export interface Question {
    id: number,
    subject: string,
    difficulty: string,
    question: string,
    answer: string,
    questionImgUrl?: string
}

export interface Avatar {
    id: string,
    userName: string,
    imageUrl: string
}

export interface Scoreboard {
    highscore: number,
    avatarId: string,
    id: string
}