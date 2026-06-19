let isLoading = false
let time = 0
let currentIdx = 0
let quizzes = []
let timerFlag = true
const loading = document.getElementById("loading")
const quizzesSection = document.getElementById("quizzes")

const startButton = document.getElementById("startButton")

const timer = document.getElementById("timer")

const nextButton = document.getElementById("nextButton")

nextButton.addEventListener("click", next)

startButton.addEventListener("click", startQuizz)

function next() {
    const selected = document.querySelector("input[type='radio']:checked")
    if (!selected) {
        alert("Select an option")
        return
    }
    quizzes[currentIdx].selected = selected.value
    console.log(selected.value)
    console.log(quizzes[currentIdx])
    if (currentIdx === quizzes.length - 1) {
        timerFlag = false
        startTimer()
        let correctCount = 0
        quizzes.forEach((quiz) => {
            if (quiz.correct_answer == quiz.selected) correctCount++
        })
        alert(`Score: ${correctCount}`)

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
        timer.innerHTML = time
    }, 1000)
}

function startQuizz() {
    startButton.disabled = true
    fetchQuizzes()
}
async function fetchQuizzes() {
    isLoading = true
    displayConditionalLoading()
    const response = await fetch("https://opentdb.com/api.php?amount=5")
    const data = await response.json()
    isLoading = false
    console.log(data)
    quizzes = data["results"]
    console.log(quizzes)
    displayConditionalLoading()
    timer.innerHTML = time
    startTimer()
    displayQuizz()
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
    options.forEach((option) => {
        const radio = document.createElement("input")

        radio.name = quizz.question
        radio.type = "radio"
        radio.value = option.title
        radio.id = option.title
        const label = document.createElement("label")
        label.htmlFor = radio.id
        label.innerHTML = option.title
        quizzesSection.appendChild(radio)
        quizzesSection.appendChild(label)
        quizzesSection.appendChild(document.createElement("br"))
    })
}
//fetchQuizzes()
displayConditionalLoading()