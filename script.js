const form = document.getElementById("myForm");
const letterBlocks = document.querySelectorAll(".letter");
const wordInput = document.querySelector(".input");
const wordsBackground = document.querySelector(".words-bg");

let blocks;
let curTry = 0;
let maxTries = 3;
let won = false;
let compatibleLetters = "abcdefghijklmnopqrstuvwxyz";

let curTypingLetter = 0;

let inputWord = "";
let rightWord = "sapao";

//Add letter typed
window.addEventListener("keydown", function (e) {
  const key = e.key;

  //Check if ended
  if (won) return;
  if (curTry >= maxTries) return;

  //Submit
  if (key === "Enter") submitTry();

  //Remove
  if (key === "Backspace") removeLetter();

  //Check typed letters
  if (curTypingLetter >= 5) return;

  //Check if letter is typable
  if (!compatibleLetters.includes(key)) return;

  //Add letter to inputWord
  inputWord += key;

  //Add blocks
  let blockLetter = blocks[curTypingLetter].querySelector(".letter");

  blockLetter.textContent = key;

  //Add index
  curTypingLetter++;

  console.log(inputWord);
});

function removeLetter() {
  if (curTypingLetter <= 0) return;
  inputWord = inputWord.slice(1);
  curTypingLetter--;

  blocks = document.querySelectorAll(`.block-${curTry}`);
  let blockLetter = blocks[curTypingLetter].querySelector(".letter");
  blockLetter.textContent = "";
  console.log(inputWord);
  return;
}

function submitTry() {
  if (inputWord.length != 5) return;
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

//Start game + configs
function addRowBlocks(number) {
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

function startGame(num_of_tries) {
  curTry = 0;
  inputWord = "";
  curTypingLetter = 0;
  won = false;
  //random word
  rightWord = "sapao";

  //Add row-blocks
  maxTries = num_of_tries;
  addRowBlocks(num_of_tries);
  blocks = document.querySelectorAll(`.block-${curTry}`);
}

startGame(maxTries);
