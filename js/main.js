// Constants
let bankStart = "$ 1000";
let betDefault = "$ 100";

// Dom Elements
// Money displays
const bankText = document.querySelector(".bankValue");
const betText = document.querySelector(".currentBet");

// Betting buttons
const betUp = document.querySelector(".increaseBet");
const betDown = document.querySelector(".decreaseBet");
const betReset = document.querySelector(".defaultBet");

// Playing buttons
const hitBtn = document.querySelector(".hit");
const standBtn = document.querySelector(".stand");
const doubleDown = document.querySelector(".doubleDown");

// Reset elements
const dealBtn = document.querySelector(".placeBet");
const overlayMain = document.querySelector(".overlayMain");
const overlayAside = document.querySelector(".overlayAside");

// Event Listeners
betUp.addEventListener("click", increaseBet);
betDown.addEventListener("click", decreaseBet);
betReset.addEventListener("click", resetBet);
hitBtn.addEventListener("click", hitMe);
standBtn.addEventListener("click", standByMe);
doubleDown.addEventListener("click", doubleBet);
dealBtn.addEventListener("click", dealHand);
betText.addEventListener("blur", checkBetVal);

// CODE START
init();

// FUNCTIONS
function init() {
  bankText.textContent = bankStart;
  betText.value = betDefault;
  resetHand();
}

function dealHand() {
  overlayMain.style.zIndex = -1;
  overlayAside.style.zIndex = 1;
}

function increaseBet() {
  parseInts();
  if (betValue < bankValue) {
    betValue += 10;
    betText.value = `$ ${betValue}`;
  }
}

function decreaseBet() {
  parseInts();
  if (betValue > 10) {
    betValue -= 10;
    betText.value = `$ ${betValue}`;
  }
}

function resetBet() {
  betText.value = betDefault;
}

function doubleBet() {
  parseInts();
  if (betValue * 2 > bankValue) {
    betValue = bankValue;
  } else {
    betValue *= 2;
  }
  betText.value = `$ ${betValue}`;
  doubleDown.style.opacity = 0.5;
  doubleDown.removeEventListener("click", doubleBet);
}

function parseInts() {
  bankValue = parseInt(bankText.textContent.replace("$", ""));
  betValue = parseInt(betText.value.replace("$", ""));
}

function checkBetVal() {
  parseInts();
  if (isNaN(betValue)) {
    betText.value = betDefault;
    return;
  } else if (betValue > bankValue) {
    betValue = bankValue;
  } else {
    betValue = Math.round(betValue / 10) * 10;
  }
  betText.value = `$ ${betValue}`;
}

function checkWin(evt) {
  parseInts();
  if (evt === "Win") {
    bankValue += betValue;
  } else if (evt === "Lose") {
    bankValue -= betValue;
  }
  bankText.textContent = `$ ${bankValue}`;
  resetHand();
}

function resetHand() {
  dealBtn.style.zIndex = 2;
  overlayMain.style.zIndex = 1;
  overlayAside.style.zIndex = -1;
}

function hitMe() {
  checkWin("Win");
}

function standByMe() {
  checkWin("Lose");
}
