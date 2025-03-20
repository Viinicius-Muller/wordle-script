const form = document.getElementById("myForm");
const letterBlocks = document.querySelectorAll(".letter");
const wordInput = document.querySelector(".input");
const wordsBackground = document.querySelector(".words-bg");
const restartButton = document.querySelector(".restart-button");
const popupEl = document.querySelector(".popup");
const popupMessage = document.querySelector(".popup-message");

//Sounds

//Generate new word
let word;
let allWords;

let a = "";

//Words API
function getJSON(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`API failed to load: (${res.status}) `);
    return res.json();
  });
}

function getWords() {
  const wordAPI = getJSON(
    "https://cheaderthecoder.github.io/5-Letter-words/words.json"
  )
    .then((res) => {
      allWords = res.words;
      rightWord = allWords[Math.floor(Math.random() * 5757)];
    })
    .catch((err) => popUpAnim(err.message));
}

let blocks;
let curTry = 0;
let maxTries = 6;
let won = false;
let compatibleLetters = "abcdefghijklmnopqrstuvwxyz";

let curTypingLetter = 0;

let inputWord = "";
let rightWord = "";

//POPUP Events
let animTimeOut;

function removepopup() {
  clearTimeout(animTimeOut);
  popupEl.classList.remove("won");
  popupEl.classList.add("inactive");
  popupEl.classList.remove("error");
  popupEl.classList.remove("popanim");
}

function popUpAnim(err = "") {
  //Format classList
  removepopup();
  popupEl.classList.remove("inactive");

  if (err) {
    popupMessage.textContent = err;
    popupEl.classList.add("error");
    popupEl.classList.add("popanim");

    animTimeOut = setTimeout(() => {
      removepopup();
    }, 2000);
  } else {
    popupMessage.textContent = "You Win!";
    popupEl.classList.add("won");
    popupEl.classList.add("popanim");
  }
}

class App {
  #cooldown;
  constructor() {
    this.#cooldown = false;
    restartButton.addEventListener("click", this.restartGame.bind(this));
    window.addEventListener("keydown", this.inputsHandler.bind(this));
  }

  inputsHandler(e) {
    const key = e.key.toLowerCase();

    //Check if ended
    if (won) return;
    if (curTry >= maxTries) return;

    if (this.#cooldown) return;

    //Submit
    if (key === "enter") this.submitTry();
    //Remove
    if (key === "backspace") this.removeLetter();

    //Check if letter is typable and isnt max
    if (curTypingLetter >= 5) return;
    if (!compatibleLetters.includes(key)) return;

    //Add letter to inputWord
    inputWord += key;

    //Add blocks
    let blockLetter = blocks[curTypingLetter].querySelector(".letter");
    blockLetter.textContent = key;

    //Add index
    curTypingLetter++;
    console.log(inputWord);
  }

  removeLetter() {
    if (curTypingLetter <= 0) return;
    inputWord = inputWord.slice(0, -1);
    curTypingLetter--;

    blocks = document.querySelectorAll(`.block-${curTry}`);
    let blockLetter = blocks[curTypingLetter].querySelector(".letter");
    blockLetter.textContent = "";
    console.log(inputWord);
    return;
  }

  playAnimation(block, index) {
    setTimeout(() => {
      const letterBlock = block.querySelector(".letter");

      block.classList.remove("inPlace");
      block.classList.remove("contains");

      if (rightWord.includes(letterBlock.textContent)) {
        if (rightWord[index] === letterBlock.textContent) {
          block.classList.add("inPlace");
        } else block.classList.add("contains");
      } else block.classList.add("incorrect");
    }, index * 350);
  }

  submitTry() {
    if (inputWord.length != 5) return;

    if (!allWords.includes(inputWord)) {
      popUpAnim("Incorrect word");
      return;
    }

    blocks.forEach((block, index) => {
      this.playAnimation(block, index);
    });

    this.#cooldown = true;
    setTimeout(() => (this.#cooldown = false), 1500);

    //Correct guess
    if (inputWord === rightWord) {
      won = true;
      popUpAnim();
    }

    //Add try and reset stuff
    curTry++;
    blocks = document.querySelectorAll(`.block-${curTry}`);

    inputWord = "";
    curTypingLetter = 0;

    return;
  }

  startGame(num_of_tries) {
    curTry = 0;
    inputWord = "";
    curTypingLetter = 0;
    won = false;

    //random word
    getWords();

    //Add row-blocks
    maxTries = num_of_tries;
    this.addRowBlocks(num_of_tries);
    blocks = document.querySelectorAll(`.block-${curTry}`);
  }

  addRowBlocks(number) {
    for (let i = 0; i < number; i++) {
      const newBlock = `<div class="flex words-row">
              <div class="block block-${i}"><p class="letter"></p></div>
              <div class="block block-${i}"><p class="letter"></p></div>
              <div class="block block-${i}"><p class="letter"></p></div>
              <div class="block block-${i}"><p class="letter"></p></div>
              <div class="block block-${i}"><p class="letter"></p></div>
            </div>`;
      wordsBackground.insertAdjacentHTML("beforeend", newBlock);
    }
  }

  restartGame() {
    wordsBackground.innerHTML = "";
    removepopup();
    this.startGame(maxTries);
  }
}

//Start game + configs
const app = new App();
app.startGame(maxTries);
