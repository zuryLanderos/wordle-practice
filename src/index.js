import { Subject, fromEvent } from "rxjs";
import WORDS_LIST from './wordslist.json';

// observable para teclado
const userWinOrLoose$ = new Subject();

// deteccion de document div letter
const letterRows = document.getElementsByClassName("letter-row");

//obtiene el id del cuadro de texto
const textContainer = document.getElementById("message-text");

// filas y columnas en la que vamos
let letterRow = 0;
let letterCol = 0;

//palabra
let userAnswer = [];

const getRandom = () => WORDS_LIST[ Math.floor( Math.random() * WORDS_LIST.length) ].toLowerCase()
const rightWord = getRandom();

// este es el observable el cual se genera con la funcion from event
const onKeyDownObservable$ = fromEvent(document, "keydown");
// el obserbador es la funcion anonima que esta dentro del observable
onKeyDownObservable$.subscribe({
  next: (value) => {
    if (value.code === "Delete" || value.code == "Backspace") {
      deleteLetter();
    } else if (value.code === "Enter") {
      validateWord();
    } else if (value.key?.length == 1 && value.key?.match(/[a-z]/i)) {
      //solo debe aceptar letras
      setLetter(value.key);
    }
  },
});

function generarTeclado(){
  // generacion de teclado
  const teclado = document.getElementById("teclado");
  const filasTeclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  for (const fila of filasTeclado) {
    const tr = document.createElement("tr");
    for (const letra of fila) {
      const td = document.createElement("td");
      td.classList.add("letra");
      const text = document.createTextNode(letra);
      td.appendChild(text);
      tr.appendChild(td);
    }
    teclado.appendChild(tr);
  }
}

generarTeclado();

// este es un subject
userWinOrLoose$.subscribe(() => {
  let winnerRow = Array.from(letterRows)[letterRow -1]
  for (let index = 0; index < 5; index++) {
    winnerRow.children[index].classList.add('letter-green');
  }
  
});

function deleteLetter() {
  letterCol = letterCol == 0 ? 0 : letterCol - 1;
  const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
  acualLetter.textContent = null;
  acualLetter.classList.remove("filled-letter");
}

function setLetter(key) {
  if (letterCol != 5) {
    const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
    acualLetter.textContent = key.toUpperCase();
    acualLetter.classList.add("filled-letter");
    userAnswer = letterCol == 0 ? [] : userAnswer;  
    letterCol++;
    userAnswer.push(key);
  }
  }


function validateWord(){
  console.log({rightWord});
  console.log({userAnswer});

  let addingClass = '';
  if( userAnswer.join('') === rightWord ) {
    userWinOrLoose$.next();
  }
  if (letterCol == 5) {
    letterCol = 0;
    letterRow++;
    textContainer.textContent = '';

    let actualRow = Array.from(letterRows)[letterRow -1];
    for (const [index, letter] of userAnswer.entries()) {
      const foundIndex = rightWord.indexOf(letter);
      if( foundIndex == -1 ){
        addingClass = "letter-grey";
      } else {
        console.log( rightWord[foundIndex], userAnswer[foundIndex]);
        if ( rightWord[foundIndex] == userAnswer[foundIndex] ){
          addingClass = "letter-green";
        } else {
          addingClass = "letter-yellow";
        }
      }

      actualRow.children[index].classList.add(addingClass);
    }
  } else {
    textContainer.textContent = "Te faltan algunas letras!";
  }
  

}