const root = document.documentElement;
let numberOfFrets = 12;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const flatSharpSelector = document.querySelectorAll("input[name='flat-sharp']");

const fretNumbersDiv = document.querySelector("#fret-numbers");
fretNumbersDiv.innerText = numberOfFrets;
const fretDecrease = document.querySelector("#fret-decrease");
const fretIncrease = document.querySelector("#fret-increase");

const showAllCheckbox = document.querySelector("#show-all");
const showMultipleCheckbox = document.querySelector("#show-multiple");
const showMultipleBar = document.querySelector("#show-multiple-bar");
const tuningSelectorsDiv = document.querySelector("#tuning-selectors");

const resetTuningBt = document.querySelector("#reset-tuning");
const startGameBt = document.querySelector("#start-game-button");
const noteBoxDiv = document.querySelector(".note-box");
const pointsP = document.querySelector("#points");
const timeP = document.querySelector("#time");

const settingsLockDiv = document.querySelector("#settings-lock");
const levelRadio = document.querySelectorAll(".level");


flatSharpSelector[0].checked = true
levelRadio[0].checked = true
showAllCheckbox.checked = false
showMultipleCheckbox.checked = false



let accidentals = "flats";

const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];

const notesFlat = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const notesSharp = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

const instrumentTuningPresetsDefault = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 strings)': [7, 2, 9, 4],
    'Bass (5 strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
};



const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 strings)': [7, 2, 9, 4],
    'Bass (5 strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
};


let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;

let noteHoverBlocked = false;
let showMultiple = false;
let gameStarted = false;
let points = 0;

let interval;
let timeout1;
let timeout2;

let startTime = 15;

let actualTime = 15;
let randomNote = "";



const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupEventListerners();
        this.initShowMultipleBar()
        this.createTuningSelects()
    },
    createTuningSelects() {
        tuningSelectorsDiv.innerHTML = ""

        const numberOfStrings = instrumentTuningPresets[selectedInstrument].length

        let notes;
        if (accidentals == "flats") {
            notes = notesFlat
        } else {
            notes = notesSharp
        }


        for (let i = numberOfStrings - 1; i >= 0; i--) {
            let select = document.createElement("select")
            select.classList.add('tuning-selector')

            notes.forEach((note, index) => {
                let option = document.createElement("option")
                option.value = note
                option.innerText = note

                select.appendChild(option)

                if (index == instrumentTuningPresets[selectedInstrument][i]) {
                    select.value = note
                }
            })

            tuningSelectorsDiv.appendChild(select)

            select.addEventListener("change", (e) => {
                let newNote = e.target.value
                let indexOfNote = notes.indexOf(newNote)
                this.updateInstrumentTuning(i, indexOfNote)
            })

        }

    },
    startGame() {
        gameStarted = true

        this.setSettingsLocked()


        actualTime = startTime
        noteBoxDiv.innerText = "Let's go!"
        timeout1 = setTimeout(() => {
            noteBoxDiv.innerText = "Find:"

            timeout2 = setTimeout(() => {
                interval = setInterval(() => { this.updateTime() }, 1000)
                this.setRandomNote()

                timeP.innerText = "Time left: " + actualTime + " seconds"
                pointsP.innerText = "Your score: 0 points"
            }, 1000)
        }, 1000)

    },
    endGame() {
        gameStarted = false
        clearInterval(interval)

        clearTimeout(timeout1)
        clearTimeout(timeout2)

        popup.setPopupText("Game Over !")
        popup.setPoints(points)
        popup.showPopup()

        this.setSettingsUnlocked()

        pointsP.innerText = ""
        timeP.innerText = ""
        noteBoxDiv.innerText = ""

        actualTime = startTime
        points = 0
    },
    nextRound() {
        this.showMultiple(randomNote)

        setTimeout(() => {
            clearInterval(interval)
            this.hideAll()

            actualTime = startTime
            timeP.innerText = "Time left: " + actualTime + ' seconds'
            interval = setInterval(() => { this.updateTime() }, 1000)
            this.setRandomNote()

        }, 1000)


    },
    updateTime() {

        actualTime -= 1
        timeP.innerText = "Time left: " + actualTime + ' seconds'



        if (actualTime == 0) {
            gameStarted = false

            this.setSettingsUnlocked()

            pointsP.innerText = ""
            timeP.innerText = ""
            noteBoxDiv.innerText = ""
            startGameBt.innerText = "START GAME"

            actualTime = startTime
            points

            popup.setPopupText("Time's up !")
            popup.setPoints(points)
            popup.showPopup()
            clearInterval(interval)
        };


    },
    updateInstrumentTuning(index, indexOfNote) {
        let tuningArray = instrumentTuningPresets[selectedInstrument]
        tuningArray[index] = indexOfNote
        instrumentTuningPresets[selectedInstrument] = tuningArray

        this.setupFretboard()
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfStrings);

        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);

            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);

                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute('data-note', noteName);

                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }
                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);
                };
            };
        };
    },
    generateNoteNames(noteIndex, accidentals) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupSelectedInstrumentSelector() {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        };
    },
    setSettingsLocked() {
        settingsLockDiv.style.display = "block"
    },
    setSettingsUnlocked() {
        settingsLockDiv.style.display = "none"
    },
    showMultiple(note) {
        const noteFrets = document.querySelectorAll(".note-fret")

        noteFrets.forEach(noteFret => {
            if (noteFret.dataset.note == note) {
                noteFret.style.setProperty('--noteDotOpacity', 1);
            }
        });
    },
    hideAll() {
        const noteFrets = document.querySelectorAll(".note-fret")

        noteFrets.forEach(noteFret => {
            noteFret.style.setProperty('--noteDotOpacity', 0);
        });
    },
    initShowMultipleBar() {
        showMultipleBar.innerHTML = ""

        let notes;
        if (accidentals == "flats") {
            notes = notesFlat
        } else {
            notes = notesSharp
        }

        notes.forEach(note => {
            let div = document.createElement("div")
            div.classList.add("single-note")
            div.innerText = note

            div.addEventListener("mouseover", (event) => {
                if (gameStarted) return

                if (noteHoverBlocked) return

                event.target.style.color = "#3498db"
                event.target.style.cursor = "pointer"

                this.showMultiple(note)
            })

            div.addEventListener("mouseout", (event) => {
                if (gameStarted) return

                if (noteHoverBlocked) return

                event.target.style.color = "silver"
                event.target.style.cursor = ""

                this.hideAll()
            })

            showMultipleBar.appendChild(div)
        });


    },
    setRandomNote() {
        let notes;
        if (accidentals == "flats") {
            notes = notesFlat
        } else {
            notes = notesSharp
        }

        let i = Math.floor(Math.random() * notes.length)
        randomNote = notes[i]
        noteBoxDiv.innerText = randomNote
    },
    updatePoints(value) {
        points += value
        pointsP.innerText = "Your score: " + points + " points"

    },
    setupEventListerners() {
        fretboard.addEventListener('click', (event) => {
            if (!gameStarted) return

            if (event.target.classList.contains('note-fret')) {
                event.target.style.setProperty('--noteDotOpacity', 1);

                if (event.target.dataset.note == randomNote) {
                    this.updatePoints(1)
                    this.nextRound()

                } else {
                    setTimeout(() => {
                        event.target.style.setProperty('--noteDotOpacity', 0);
                    }, 1000)
                }
            }
        });

        fretboard.addEventListener('mouseover', (event) => {
            if (gameStarted) return

            if (event.target.classList.contains('note-fret')) {
                if (showMultiple) {
                    let note = event.target.dataset.note
                    this.showMultiple(note)
                } else {
                    event.target.style.setProperty('--noteDotOpacity', 1);
                }
            }
        });

        fretboard.addEventListener('mouseout', (event) => {
            if (noteHoverBlocked) return

            if (gameStarted) return

            if (showMultiple) {
                this.hideAll()
            } else {
                event.target.style.setProperty('--noteDotOpacity', 0);
            }
        });

        fretboard.addEventListener('click', (event) => {
        });

        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.createTuningSelects()
            this.setupFretboard();
        });

        flatSharpSelector.forEach(selector => {
            selector.addEventListener("change", (event) => {
                accidentals = event.target.value
                showMultipleBar.innerHTML = ""

                let notes;
                if (accidentals == "flats") {
                    notes = notesFlat
                } else {
                    notes = notesSharp
                }

                notes.forEach(note => {
                    let div = document.createElement("div")
                    div.classList.add("single-note")
                    div.innerText = note

                    div.addEventListener("mouseover", () => {
                        this.showMultiple(note)
                    })

                    div.addEventListener("mouseout", () => {
                        this.hideAll()
                    })

                    showMultipleBar.appendChild(div)
                })

                this.createTuningSelects()

                this.setupFretboard()
            })
        });

        fretIncrease.addEventListener("click", () => {
            if (numberOfFrets < 24) {
                numberOfFrets += 1
                fretNumbersDiv.innerText = numberOfFrets
                this.setupFretboard()
            }
        });

        fretDecrease.addEventListener("click", () => {
            if (numberOfFrets > 3) {
                numberOfFrets -= 1
                fretNumbersDiv.innerText = numberOfFrets
                this.setupFretboard()
            }
        });

        showAllCheckbox.addEventListener("input", (event) => {
            const noteFrets = document.querySelectorAll(".note-fret")
            if (event.target.checked) {
                noteFrets.forEach(noteFret => {
                    noteFret.style.setProperty('--noteDotOpacity', 1);
                })
                noteHoverBlocked = true
            } else {
                noteFrets.forEach(noteFret => {
                    noteFret.style.setProperty('--noteDotOpacity', 0);
                })
                noteHoverBlocked = false
            }
        });

        showMultipleCheckbox.addEventListener("input", (event) => {
            showMultiple = event.target.checked
        });

        resetTuningBt.addEventListener("click", () => {
            let defaultTuning = instrumentTuningPresetsDefault[selectedInstrument].slice()
            instrumentTuningPresets[selectedInstrument] = defaultTuning

            this.createTuningSelects()

            this.setupFretboard()
        });

        startGameBt.addEventListener("click", (event) => {

            if (gameStarted) {
                this.endGame()
                event.target.innerText = "PLAY GAME"
            } else {
                this.startGame()
                event.target.innerText = "END GAME"
            }
        });

        console.log(levelRadio)
        levelRadio.forEach(radio => {
            radio.addEventListener("input", (event) => {
                if (event.target.value == "easy") {
                    startTime = 15
                } else if (event.target.value == "medium") {
                    startTime = 10
                } else {
                    startTime = 5
                }
            })
        })

    }
};


const popup = {
    popupDiv: document.querySelector("#game-popup-overlay"),
    popupPointsH1: document.querySelector("#popup-points"),
    popupTextH1: document.querySelector("#popup-text"),
    closeBt: document.querySelector("#close-button"),
    init() {
        this.closeBt.addEventListener("click", () => {
            this.hidePopup()
        })
    },
    setPopupText(text) {
        this.popupTextH1.innerText = text
    },
    showPopup() {
        this.popupDiv.style.display = "block"
    },
    hidePopup() {
        this.popupDiv.style.display = "none"
    },
    setPoints(points) {
        this.popupPointsH1.innerText = "Points: " + points
    }
};

popup.init()



const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
};


app.init();