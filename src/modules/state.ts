import type { Question } from "../interface";


//variabel och funktion för att spara och hämta frågor ---
let selectedQuestions: Question[] = []

export function saveSelectedQuestions(questions: Question[]){
    selectedQuestions = questions
}

export function getSelectedQuestions() {
    return selectedQuestions
}
//----------------------------------------------------------

//variabel och funktioner för att spara och hämta score ----
let savedScore: number

export function saveScore (score: number) {
    savedScore = score 
}

export function getScore () {
    return savedScore
}
//------------------------------------------------------------
