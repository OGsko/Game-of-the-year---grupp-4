import type { Question } from "../interface";

let selectedQuestions: Question[] = []

export function saveSelectedQuestions(questions: Question[]){
    selectedQuestions = questions
}

export function getSelectedQuestions() {
    return selectedQuestions
}