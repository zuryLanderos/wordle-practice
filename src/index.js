import { fromEvent } from "rxjs";

// observable para teclado
const onKeyDownObservable$ = fromEvent(document, "keydown");

// deteccion de document div letter
const letterRows = document.getElementsByClassName("letter-row");

// filas y columnas en la que vamos
let letterRow = 0;
let letterCol = 0;

//palabra
let userAnswer = [];


onKeyDownObservable$.subscribe({
  next: (value) => {
    console.log(value);
    if (value.code === "Delete" || value.code == "Backspace") {
      deleteLetter();
    } else if (value.code === "Enter") {
      deleteLetter();
    } else if (value.key?.length == 1 && value.key?.match(/[a-z]/i)) {
      //solo debe aceptar letras
      setLetter(value.key);
    } else {
      console.log("solo letras");
    }
  },
});

function deleteLetter() {
  letterCol = letterCol == 0 ? 0 : letterCol - 1;
  const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
  acualLetter.textContent = null;
  acualLetter.classList.remove("filled-letter");
}

function setLetter(key) {
  const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
  acualLetter.textContent = key.toUpperCase();
  acualLetter.classList.add("filled-letter");
  letterCol++;
  if (letterCol === 5) {
    letterCol = 0;
    letterRow++;
  }
}
