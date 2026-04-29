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


//variabel och funktioner för att spara och hämta frågeindex---
export let currentQuestionIndex: number = 0

export function incrementQuestionIndex() {
    currentQuestionIndex++
}

export function getCurrentQuestionIndex() {
    return currentQuestionIndex
}

export function updateQuestionIndex(index: number) {
    currentQuestionIndex = index
}

//-------------------------------------------------------------