let isLoading = false
let time = 0
let currentIdx = 0
let quizzes = []
let timerFlag = true
let selectedFlag = false
const loading = document.getElementById("loading")
const quizzesSection = document.getElementById("quizzes")

const startButton = document.getElementById("startButton")
startButton.addEventListener("click", startQuizz)

const restartButton = document.getElementById("restartButton")
restartButton.addEventListener("click", startQuizz)

const timer = document.getElementById("timer")

const nextButton = document.getElementById("nextButton")
nextButton.addEventListener("click", next)

const resultSection = document.getElementById("resultSection")


function startQuizz() {
    startButton.disabled = true
    const buttonDiv = document.getElementById("startButtonDiv")
    const filteringSection = document.getElementById("filteringSection")
    buttonDiv.style.display = 'none'
    filteringSection.style.display = 'none'
    nextButton.style.display = 'block'
    resultSection.style.display = 'none'
    fetchQuizzes()
}

async function fetchQuizzes() {
    isLoading = true
    displayConditionalLoading()
    const difficulty = document.getElementById("difficulty").value
    const amount = document.getElementById("amount").value
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}`)
        const data = await response.json()

        console.log(data)
        quizzes = data["results"]
        console.log(quizzes)
        timer.innerHTML = `Time: 0`
        startTimer()
        displayQuizz()
    }
    catch (error) {
        console.log(error)
    }
    finally {
        isLoading = false
        displayConditionalLoading()
    }
}

function finishQuiz() {
    let correctCount = 0
    quizzes.forEach((quiz) => {
        if (quiz.correct_answer == quiz.selected) correctCount++
    })
    quizzesSection.style.display = 'none'
    nextButton.style.display = 'none'
    resultSection.style.display = 'flex'
    document.getElementById('score').innerHTML = correctCount
    document.getElementById('totalQuestion').innerHTML = quizzes.length
    startButton.disabled = false
    timerFlag = true
    currentIdx = 0
    timer.style.display = 'none'
    document.getElementById('timeTaken').innerHTML = time
    time = 0
}
function next() {
    const selected = document.querySelector("input[type='radio']:checked")

    nextButton.disabled = true
    quizzes[currentIdx].selected = selected.value
    console.log(selected.value)
    console.log(quizzes[currentIdx])
    if (currentIdx === quizzes.length - 1) {
        timerFlag = false
        startTimer()

        finishQuiz()
    }
    else {
        currentIdx += 1
        displayQuizz()
    }
}

let timerId;
function startTimer() {
    if (timerFlag == false) {
        clearInterval(timerId)
        return
    }
    timerId = setInterval(() => {
        time += 1
        timer.innerHTML = `Time: ${time}`
    }, 1000)
}



function displayConditionalLoading() {
    if (isLoading) {
        loading.style.display = "block"
        quizzesSection.style.display = "none"
    }
    else {
        loading.style.display = "none"
        quizzesSection.style.display = "block"
    }
}

function displayQuizz() {
    quizz = quizzes[currentIdx]
    const p = document.createElement("p")
    const ul = document.createElement("ul")
    p.innerHTML = `${currentIdx + 1}. ${quizz.question}`
    const options = quizz.incorrect_answers.map((option) => {
        return {
            title: option,
            correct: false
        }
    })
    options.push({
        title: quizz.correct_answer,
        correct: true
    })
    console.log(options)
    quizzesSection.replaceChildren()
    quizzesSection.appendChild(p)
    options.sort((a, b) => a.title.localeCompare(b.title));
    options.forEach((option) => {
        const radio = document.createElement("input")

        radio.name = quizz.question
        radio.type = "radio"
        radio.value = option.title
        radio.id = option.title
        const label = document.createElement("label")
        label.htmlFor = radio.id
        label.innerHTML = option.title

        radio.addEventListener('change', () => nextButton.disabled = false)
        quizzesSection.appendChild(radio)
        quizzesSection.appendChild(label)
        quizzesSection.appendChild(document.createElement("br"))
    })
}
//fetchQuizzes()
displayConditionalLoading()