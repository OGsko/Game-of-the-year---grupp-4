import { fetchQuestion } from "./fetch";
import type { Question } from "../interface";

export async function questionList (input: string) {
    const questionData = await fetchQuestion()

    const questions = questionData?.filter (
        (q) => q.difficulty === input
    )

    return questions
}

export function renderQuestion (questions: Question) {
    const qContainer = document.createElement("div")

    //Fixes the correct awnser. Removes spaces and uppercase
    const correctAnwser = questions.answer.replace(/\s+/g, "").toLocaleLowerCase()

    //Question/img
    const textAndImgContainer = document.createElement("div")

    const qHeading = document.createElement("h1")
    qHeading.textContent = `${questions.difficulty} ${questions.subject} question`
    textAndImgContainer.appendChild(qHeading)

    const qText = document.createElement("h2")
    qText.textContent = questions.question
    textAndImgContainer.appendChild(qText)
    if(questions.questionImgUrl) {
        const qImg = document.createElement("img")
        qImg.src = questions.questionImgUrl
        qImg.alt = `Question ${questions.id} image` //Hur skriver vi ut alt om inte img laddas in?

        textAndImgContainer.appendChild(qImg)
    }

    //Answer 
    const inputAndBtnContainer = document.createElement("div")

    const qAnswerInput = document.createElement("input")
    qAnswerInput.placeholder = "Answer here!"
    const qAnswerBtn = document.createElement("button")
    qAnswerBtn.innerText = "Submit"

    inputAndBtnContainer.appendChild(qAnswerInput)
    inputAndBtnContainer.appendChild(qAnswerBtn)

    //appending containers
    qContainer.appendChild(textAndImgContainer)
    qContainer.appendChild(inputAndBtnContainer)

    qAnswerBtn.addEventListener("click", () => {
        //formats the user answer like correctAnwser above
        const userAnswer = qAnswerInput.value.replace(/\s+/g, "").toLocaleLowerCase()
        checkAnswer(userAnswer, correctAnwser)
    })

}

function checkAnswer(userInput: string, correctInput: string) {
    if (userInput === correctInput) {
        //function for correct
    } else {
        //function for wrong
    }
}