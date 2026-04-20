export interface question {
    id: number,
    subject: string,
    difficulty: string,
    question: string,
    answer: string,
    questionImgUrl?: string
}

export interface avatar {
    id: number,
    userName: string,
    imageUrl: string
}

export interface scoreboard {
    highscore: number,
    avatarId: number
}