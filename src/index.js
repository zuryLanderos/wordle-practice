import { Subject, fromEvent } from "rxjs";
import WORDS_LIST from './wordslist.json';

// observable para teclado
const onWin$ = new Subject();

// deteccion de document div letter
const letterRows = document.getElementsByClassName("letter-row");

//obtiene el id del cuadro de texto
const textContainer = document.getElementById("message-text");

// boton de reiniciar
const restartButton = document.getElementById('restar-button');

// teclado virtual
const virtualKeyboard = document.getElementsByClassName("letra");
const onLetterClick$ = fromEvent(virtualKeyboard, "click");

// filas y columnas en la que vamos
let letterRow = 0;
let letterCol = 0;

//palabra
let userAnswer = [];

const getRandom = () => WORDS_LIST[ Math.floor( Math.random() * WORDS_LIST.length) ].toLowerCase()
let rightWord = getRandom();

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
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "borrar"],
    ["Z", "X", "C", "V", "B", "N", "M", "ENVIAR"],
  ];
  for (const fila of filasTeclado) {
    const row = document.createElement("div");
    row.classList.add('teclado-row')
    for (const letra of fila) {
      const cell = document.createElement("div");
      cell.classList.add("letra");
      if (letra == 'borrar'){
        cell.innerHTML = 
        `<span class="material-symbols-outlined">
          backspace
        </span>`;
      } else {
        const text = document.createTextNode(letra);
        cell.appendChild(text);
      }
      
      row.appendChild(cell);
    }
    teclado.appendChild(row);
  }
}

generarTeclado();

// este es un subject
onWin$.subscribe(() => {
  let winnerRow = Array.from(letterRows)[letterRow]
  for (let index = 0; index < 5; index++) {
    winnerRow.children[index].classList.add('letter-green');
  }

  restartButton.disabled = false;
});

function deleteLetter() {
  letterCol = letterCol == 0 ? 0 : letterCol - 1;
  if(Array.from(letterRows)[letterRow]){
    const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
    acualLetter.textContent = null;
    acualLetter.classList.remove("filled-letter");
    userAnswer.pop();
  }
}

function setLetter(key) {
  console.log(key);
    if (letterCol < 5) {
      const acualLetter = Array.from(letterRows)[letterRow].children[letterCol];
      acualLetter.textContent = key.toUpperCase();
      acualLetter.classList.add("filled-letter");
      userAnswer = letterCol == 0 ? [] : userAnswer;  
      letterCol++;
      userAnswer.push(key);
    }
  }


function validateWord(){
  console.log(rightWord);
  // verificamos que sea una palabra de 5 letras
  if (letterCol < 5) {
    // si no es avisamos que faltan letras y salimos
    textContainer.textContent = "Te faltan algunas letras!";
    return
  }

  let addingClass = '';
  // uniendo el array en una sola palabra para verificar si gano
  console.log(userAnswer.join(''), rightWord);
  if( userAnswer.join('') === rightWord ) {
    // si la palabra es correcta gana directamente y salimoms de la funcion
    onWin$.next();
    return
  }

  letterCol = 0;
  letterRow++;
  textContainer.textContent = '';
  // usamos un arreglo de las letras que el usuario metio
  let actualRow = Array.from(letterRows)[letterRow -1];
  // recorremos el arreglo de letras metidas por el usuario
  for (const [index, letter] of userAnswer.entries()) {

    // primero verificamos si la letra existe en la palabra correcta
    const foundIndex = rightWord.indexOf(letter);
    if( foundIndex == -1 ){
      // si no existe ponemos la letra griss
      addingClass = "letter-grey";
    } else {
      // si existe vemos si esta en la posicion correcta
      // para ello ponemos la letra del usuario es la misma que la letra de la palabra correcta en esa posiscion
      if ( rightWord[index] == letter ){
        // si lo es la letra es verde
        addingClass = "letter-green";
      } else {
        // si no es la letra es amarilla
        addingClass = "letter-yellow";
      }
    }
    actualRow.children[index].classList.add(addingClass);
  }

  if ( letterRow == 6 ){
    letterRow = 5;
    restartButton.disabled = false;
  }
}

// restar game listener
const onRestartObservable$ = fromEvent(restartButton,  "click");
onRestartObservable$.subscribe({
  next:() =>{
    console.log({letterRow});
    for (let x = 0; x <= letterRow; x++) {
      for (let col = 0; col < 5; col++) {
        const acualLetter = Array.from(letterRows)[x].children[col];
        acualLetter.textContent = null;
        acualLetter.classList.remove("filled-letter");
        acualLetter.classList.remove("letter-grey");
        acualLetter.classList.remove("letter-green");
        acualLetter.classList.remove("letter-yellow");
      }
    }
    
    const restarText = document.getElementById('restart-icon');
    restarText.classList.add('rotate-icon');
    letterRow = 0;
    letterCol = 0;
    userAnswer = [];
    rightWord = getRandom();

    setTimeout(() => {
      restarText.classList.remove('rotate-icon');
      restartButton.disabled = true;
    }, 1000);
  }
});


//teclado virtual
onLetterClick$.subscribe({
  next: (event)=>{
    const clickedContent =  event.target.innerHTML;
    if ( clickedContent.includes('backspace') ){
      deleteLetter();
    } else if (  clickedContent == ('ENVIAR') ){
      validateWord();
    } else {
      setLetter(clickedContent.toLowerCase());
    }
  }
})
