const form = document.getElementById("myForm");
const letterBlocks = document.querySelectorAll(".letter");
const wordInput = document.querySelector(".input");
const wordsBackground = document.querySelector(".words-bg");
const restartButton = document.querySelector(".restart-button");
const popupEl = document.querySelector(".popup");
const popupMessage = document.querySelector(".popup-message");

//Settings
let isMuted = false;

const settingsButton = document.querySelector(".settings-button");
const settingsModal = document.querySelector(".settings-modal");
const maxAttempsInput = document.getElementById("maxAttemps");
const applyAttemptsBtn = document.querySelector(".apply-attempts");
const muteSoundsBtn = document.getElementById("muteCheckbox");

muteSoundsBtn.addEventListener("input", function () {
  isMuted = !isMuted;
});

//Keyboard
const keyboard = document.querySelector(".keyboard-bg");
const keyboardRows = document.querySelectorAll(".keyboard-row");
const keys = document.querySelectorAll(".key");
const firstKey = document.querySelector(".key");
const deafultKeyBG = firstKey.style.background;

//Sounds
const cardflipSFX = new Audio("./sounds/cardflip.mp3");
const winSFX = new Audio("./sounds/win.mp3");

//Generate new word
let word;
let allWords;

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

//Inputs Variables
let compatibleLetters = "abcdefghijklmnopqrstuvwxyz";
let curTypingLetter = 0;
let inputWord = "";
let rightWord = "";

//Timer/Delay function
function delay(seconds) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, seconds * 1000);
  });
}

//Popup Events
let animTimeOut;

function removepopup() {
  clearTimeout(animTimeOut);
  popupEl.classList.remove("won");
  popupEl.classList.add("inactive");
  popupEl.classList.remove("error");
  popupEl.classList.remove("popanim");
}

function popUpAnim(err = "", lost = false) {
  //Format classList
  removepopup();
  popupEl.classList.remove("inactive");

  if (err) {
    popupMessage.textContent = err;
    popupEl.classList.add("error");
    popupEl.classList.add("popanim");

    if (!lost) {
      animTimeOut = setTimeout(() => {
        removepopup();
      }, 2000);
    }
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
    keyboardRows.forEach((keyboard) => {
      keyboard.addEventListener("click", this.inputByKeyboard.bind(this));
    });
    window.addEventListener("keydown", this.inputsHandler.bind(this));
    settingsButton.addEventListener("click", this.openCloseModal);
    applyAttemptsBtn.addEventListener("click", this.applyAttempts.bind(this));
  }

  applyAttempts() {
    const attemps = Number(maxAttempsInput.value);
    if (attemps > 8 || attemps < 1) return;
    maxTries = attemps;
    this.restartGame();
  }

  openCloseModal() {
    settingsModal.classList.toggle("hidden");
  }

  inputByKeyboard(e) {
    //If isn't key return
    if (e.target.tagName === "IMG") {
      this.inputsHandler(e.target.parentElement.dataset.key);
      return;
    }
    if (!e.target.parentElement.querySelector(".key")) return;
    this.inputsHandler(e.target.dataset.key);
  }

  inputsHandler(e) {
    let key;
    if (e.key) key = e.key.toLowerCase();
    else key = e;

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
    if (!isMuted) {
      const typeSFX = new Audio("./sounds/type.mp3");
      typeSFX.play();
      typeSFX.volume = 0.15;
    }

    //Add blocks
    let blockLetter = blocks[curTypingLetter].querySelector(".letter");
    blockLetter.textContent = key;

    //Add index
    curTypingLetter++;
  }

  removeLetter() {
    if (curTypingLetter <= 0) return;

    if (!isMuted) {
      const removeSFX = new Audio("./sounds/backspace.mp3");
      removeSFX.volume = 0.1;
      removeSFX.play();
    }

    inputWord = inputWord.slice(0, -1);
    curTypingLetter--;

    blocks = document.querySelectorAll(`.block-${curTry}`);
    let blockLetter = blocks[curTypingLetter].querySelector(".letter");
    blockLetter.textContent = "";
    console.log(inputWord);
    return;
  }

  playAnimation(block, index) {
    delay(index * 0.35).then(() => {
      const letterBlock = block.querySelector(".letter");
      const letterInKeyboard = keyboard.querySelector(
        `[data-key='${letterBlock.textContent}']`
      );

      block.classList.remove("inPlace");
      block.classList.remove("contains");

      if (rightWord.includes(letterBlock.textContent)) {
        if (rightWord[index] === letterBlock.textContent) {
          block.classList.add("inPlace");
          letterInKeyboard.style.background = "#6aaa64";
        } else {
          block.classList.add("contains");
          letterInKeyboard.style.background = "#ceb02c";
        }
      } else {
        block.classList.add("incorrect");
        letterInKeyboard.style.background = "#222222";
      }
    });
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
    delay(1.5).then(() => (this.#cooldown = false));

    curTry++;
    //Correct guess
    if (inputWord === rightWord) {
      won = true;
      if (!isMuted) winSFX.play();
      popUpAnim();
    } else if (curTry === maxTries) {
      popUpAnim(`You lose: ${rightWord.toUpperCase()}`, true);
    }

    //Add try and reset stuff
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
    keys.forEach((key) => (key.style.background = deafultKeyBG));
    removepopup();
    this.startGame(maxTries);
  }
}

//Start game + configs
const app = new App();
app.startGame(maxTries);
