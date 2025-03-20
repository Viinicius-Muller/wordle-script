const form = document.getElementById("myForm");
const letterBlocks = document.querySelectorAll(".letter");
const wordInput = document.querySelector(".input");
const wordsBackground = document.querySelector(".words-bg");

//Generate new word
let word;
let allWords;

//Words API
function getWords() {
  const wordAPI = getJSON(
    "https://cheaderthecoder.github.io/5-Letter-words/words.json"
  ).then((res) => {
    allWords = res.words;
    rightWord = allWords[Math.floor(Math.random() * 5757)];
  });
}

let blocks;
let curTry = 0;
let maxTries = 6;
let won = false;
let compatibleLetters = "abcdefghijklmnopqrstuvwxyz";

let curTypingLetter = 0;

let inputWord = "";
let rightWord = "";

class App {
  constructor() {
    window.addEventListener("keydown", this.inputsHandler.bind(this));
  }

  inputsHandler(e) {
    const key = e.key.toLowerCase();

    //Check if ended
    if (won) return;
    if (curTry >= maxTries) return;

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

  submitTry() {
    if (inputWord.length != 5) return;

    if (!allWords.includes(inputWord)) {
      console.log("Word does not exist in DataBase");
      return;
    }

    blocks.forEach((block, k) => {
      const letterBlock = block.querySelector(".letter");

      block.classList.remove("inPlace");
      block.classList.remove("contains");

      if (rightWord.includes(letterBlock.textContent)) {
        if (rightWord[k] === letterBlock.textContent) {
          block.classList.add("inPlace");
        } else block.classList.add("contains");
      }
    });

    //Check if right
    if (inputWord === rightWord) won = true;

    //Add try and reset stuff
    curTry++;
    blocks = document.querySelectorAll(`.block-${curTry}`);

    inputWord = "";
    curTypingLetter = 0;

    return;
  }

  async startGame(num_of_tries) {
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
}

//Start game + configs
const app = new App();
app.startGame(maxTries);

function getJSON(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error("API failed to load");
    return res.json();
  });
}
