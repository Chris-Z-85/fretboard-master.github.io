const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const numberOfFrets = 24;

const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];

const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let accidentals = 'flats';

const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 strings)': [7, 2, 9, 4],
    'Bass (5 strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
}


let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;


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
    setupEventListerners() {
        fretboard.addEventListener('mouseover', (event) => {
            if (event.target.classList.contains('note-fret')) {
                event.target.style.setProperty('--noteDotOpacity', 1);
            }
        });
        fretboard.addEventListener('mouseout', (event) => {
            event.target.style.setProperty('--noteDotOpacity', 0);
        });
        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });
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