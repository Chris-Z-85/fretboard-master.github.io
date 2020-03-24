const root = document.documentElement;
let numberOfFrets = 12;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const flatSharpSelector = document.querySelectorAll("input[name='flat-sharp']")

const fretNumbersDiv = document.querySelector("#fret-numbers");
fretNumbersDiv.innerText = numberOfFrets;
const fretDecrease = document.querySelector("#fret-decrease");
const fretIncrease = document.querySelector("#fret-increase");

const showAllCheckbox = document.querySelector("#show-all")
const showMultipleCheckbox = document.querySelector("#show-multiple")



let accidentals = "flats"

const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];

const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 strings)': [7, 2, 9, 4],
    'Bass (5 strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
}


let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;

let noteHoverBlocked = false
let showMultiple = false


const app = {

    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupEventListerners();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfStrings);
        // Add strings to fretboard
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);

            // Create frets
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);

                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute('data-note', noteName);

                // Add single fret marks
                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }
                // Add double fret marks
                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);
                }
            }
        }
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
        }
    },
    showMultiple(note) {
        const noteFrets = document.querySelectorAll(".note-fret")

        noteFrets.forEach(noteFret => {
            if (noteFret.dataset.note == note) {
                noteFret.style.setProperty('--noteDotOpacity', 1);
            }
        })
    },
    hideAll() {
        const noteFrets = document.querySelectorAll(".note-fret")

        noteFrets.forEach(noteFret => {
            noteFret.style.setProperty('--noteDotOpacity', 0);
        })
    },
    setupEventListerners() {
        fretboard.addEventListener('mouseover', (event) => {
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

            if (showMultiple) {
                this.hideAll()
            } else {
                event.target.style.setProperty('--noteDotOpacity', 0);
            }
        });

        fretboard.addEventListener('click', (event) => {
            console.log(event.target)
        })

        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });

        flatSharpSelector.forEach(selector => {
            selector.addEventListener("change", (event) => {
                accidentals = event.target.value

                this.setupFretboard()
            })
        })

        fretIncrease.addEventListener("click", () => {
            if (numberOfFrets < 24) {
                numberOfFrets += 1
                fretNumbersDiv.innerText = numberOfFrets
                this.setupFretboard()
            }
        })

        fretDecrease.addEventListener("click", () => {
            if (numberOfFrets > 3) {
                numberOfFrets -= 1
                fretNumbersDiv.innerText = numberOfFrets
                this.setupFretboard()
            }
        })

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
        })

        showMultipleCheckbox.addEventListener("input", (event) => {
            showMultiple = event.target.checked
        })


    }
}



const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}


app.init();