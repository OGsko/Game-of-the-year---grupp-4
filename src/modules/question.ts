import { fetchQuestion } from "./fetch";
import type { Question } from "../interface";
import { getScore, saveScore, incrementQuestionIndex } from "./state";

export let scoreCount = 0 // Ska bestämma och ändra hur mycket poäng man får


//Denna funktion tar ut dom frågor från db.json som stämmer överens med användarens val av svårighetsgrad.
//Den shufflar arrayen och tar ut 10 frågor.
export async function questionList (input: string) {
    const questionData = await fetchQuestion()

    const questions = (questionData?.filter(
        (q) => q.difficulty === input
    ) ?? [])
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    //definerar vad score ska vara beroende på svårighetsgrad
    if (input === "easy") {
        scoreCount = 10
    } else if (input === "medium") {
        scoreCount = 20
    } else if (input === "hard") {
        scoreCount = 30
    }

    return questions

}

//Frågerendreringen. Return new Promise är som väntar på att användaren ska svara på frågan. 
export function renderQuestion (questions: Question): Promise<void> {
    return new Promise((resolve) => {
        const gameContainer = document.getElementById("gameContainer") as HTMLElement
        
        // Rensar gamla frågor så de inte staplas
        const oldQuestions = document.querySelectorAll(".question-container")
        oldQuestions.forEach(q => q.remove())

        const qContainer = document.createElement("div")
        qContainer.className = "question-container"

        //Fixar svaret som hämtas från db.json. Den tar bort blank spaces och stor bokstav
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
            qImg.alt = `Question ${questions.id} image` 

            qImg.classList = "q-img"

            textAndImgContainer.appendChild(qImg)

        }

        //Svar
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

        gameContainer.appendChild(qContainer)

        qAnswerBtn.onclick = () => {
            //formaterar användarens svar enligt samma som svars datan ovan.
            const userAnswer = qAnswerInput.value.replace(/\s+/g, "").toLocaleLowerCase()
            checkAnswer(userAnswer, correctAnwser)
            qContainer.remove()
            resolve() // När knappen trycks på, så är promise klar.
        }
    })
}

//Funktion för att jämföra rätta svaret med spelarens svar.
export function checkAnswer(userInput: string, correctInput: string) {

    if (userInput === correctInput) {
        const currentScore = getScore() //Hämtar nuvarande scoret från state.ts
        updateScore (currentScore, scoreCount)
        incrementQuestionIndex()
    } 
}

//Uppdaterar score till det korrekta poängsystemet beroende på svårighetsgrad(10/20/30)
//och skickar in nya scoret till state.ts
export function updateScore(amountScore: number, scoreCounter: number) {
    const newScore = amountScore = amountScore + scoreCounter
    saveScore (newScore)
}