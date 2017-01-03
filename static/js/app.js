var fs = require('fs')
var path = require('path')

var startDate
var timer
var isTimerRunning = false
var btnTimerControl
var fldTaskDescription
var lblTimer
var tasks = []

function dd(value) {
    value = (value+'') || '0'

    while (value.length < 2) {
        value = '0' + value
    }

    return value
}

function updateTimer() {
    var now = new Date()
    var currentTimer = Math.floor((now - startDate) / 1000)
    var minutes = Math.floor(currentTimer / 60)
    var seconds = currentTimer % 60
    var formattedTimer =  dd(minutes) + ':' + dd(seconds)
    lblTimer.textContent = formattedTimer
}

function startTimer() {
    startDate = new Date()
    isTimerRunning = true
    updateTimer()
    timer = setInterval(updateTimer, 1000)
}

function stopTimer() {
    clearInterval(timer)
    isTimerRunning = false

    tasks = [... tasks, {
        description: fldTaskDescription.value,
        time: lblTimer.textContent,
        date: new Date()
    }]

    saveTasks()
}

function getCurrentFilename() {
    var date = new Date()
    return date.getFullYear()+'-'+dd(date.getMonth()+1)+'-'+dd(date.getDate())+'.json'
}

function getCurrentFilenameWithPath() {
    return path.join(__dirname, 'data', getCurrentFilename())
}

function loadCurrentTasks() {
    var filename = getCurrentFilenameWithPath()

    if (fs.existsSync(filename)) {
        var currentData = fs.readFileSync(filename)
        if (currentData) {
            try {
                currentData = JSON.parse(currentData)
                tasks = [... currentData, ... tasks]
            } catch(e) {
                console.log(e)
            }
        }
    }
}

function saveTasks() {
    fs.writeFileSync(getCurrentFilenameWithPath(), JSON.stringify(tasks), { flag: 'w+' })
}

loadCurrentTasks()

function onClickTimerControl(e) {
    e.preventDefault()

    btnTimerControl.textContent = !isTimerRunning ? 'Stop' : 'Start'

    return !isTimerRunning ? startTimer() : stopTimer()
}

function onDomReady() {
    lblTimer = document.querySelector('.timer')
    fldTaskDescription = document.querySelector('.task-description')
    btnTimerControl = document.querySelector('.timer-control')
    btnTimerControl.addEventListener('click', onClickTimerControl)
}

document.addEventListener('DOMContentLoaded', onDomReady)
