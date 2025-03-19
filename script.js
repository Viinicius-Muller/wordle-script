const form = document.getElementById("myForm");
const letterBlocks = document.querySelectorAll(".letter");
const wordInput = document.querySelector(".input");
let blocks;

let tries = 0;
let maxTries = 3;
let won = false;

let rightWord = "sapao";

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputWord = wordInput.value.toLowerCase();

  //Check if ended
  if (tries >= maxTries) return;
  if (won) return;

  //Word has 5 letters?
  if (inputWord.length !== 5) return;

  //Is inside compatible words?

  //Start
  blocks = document.querySelectorAll(`.block-${tries}`);
  tries++;

  //Format blocks classList
  blocks.forEach((block, k) => {
    const letterBlock = block.querySelector(".letter");

    block.classList.remove("inPlace");
    block.classList.remove("contains");

    //Do stuff for the letter
    let curLetter = inputWord[k];
    letterBlock.textContent = curLetter;

    //Check if word is contained
    if (rightWord.includes(curLetter)) {
      //Check if word is in place
      if (rightWord[k] == curLetter) {
        block.classList.add("inPlace");
      } else block.classList.add("contains");
    }
  });

  if (inputWord === rightWord) {
    console.log("you win");
    won = true;
  }
});
