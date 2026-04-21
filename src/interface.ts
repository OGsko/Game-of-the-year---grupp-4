export interface Question {
    id: number,
    subject: string,
    difficulty: string,
    question: string,
    answer: string,
    questionImgUrl?: string
}

export interface Avatar {
    id: number,
    userName: string,
    imageUrl: string
}

export interface Scoreboard {
    highscore: number,
    avatarId: number
}