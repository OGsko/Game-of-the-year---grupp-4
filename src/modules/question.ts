import { fetchQuestion } from "./fetch";


export async function questionList (input: string) {
    const questionData = await fetchQuestion()

    const questions = questionData?.filter (
        (q) => q.difficulty === input
    )

    return questions
}

export function difficultySelect() {
        const difficultyDiv = document.createElement("div")
    
    const difficultyText = document.createElement("h2")
    difficultyText.textContent = "select difficulty"

    const difficultyInput = document.createElement("select");
    const easyOpt = document.createElement("option");
    easyOpt.value = "easy";
    easyOpt.text = "Easy";
    const mediumOpt = document.createElement("option");
    mediumOpt.value = "medium";
    mediumOpt.text = "Medium";
    const hardOpt = document.createElement("option");
    hardOpt.value = "hard";
    hardOpt.text = "Hard"; 

    difficultyInput.add(easyOpt)
    difficultyInput.add(mediumOpt)
    difficultyInput.add(hardOpt)

    difficultyDiv.appendChild(difficultyText)
    difficultyDiv.appendChild(difficultyInput)

    return difficultyDiv
}



    //const questions = questionList(difficultyInput.value)
