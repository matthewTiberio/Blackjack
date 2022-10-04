// Constants
let bankStart = 1000;
let betDefault = 100;
let minBet = 10;
let playingDeck = [];
let pHand = [];
let dHand = [];
let playerCheck = [];
let dealerCheck = [];
let pScore = 0;
let dScore = 0;

// prettier-ignore
const basicDeck = [
  "dA", "dK", "dQ", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02",
  "hA", "hK", "hQ", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02",
  "cA", "cK", "cQ", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02",
  "sA", "sK", "sQ", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02",
];

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
const playAgainBtn = document.querySelector(".playAgain");
const cashOutBtn = document.querySelector(".cashOut");

// Reset elements
const dealBtn = document.querySelector(".placeBet");
const overlayMain = document.querySelector(".overlayMain");
const overlayAside = document.querySelector(".overlayAside");
const overlayCenter = document.querySelector(".overlayCenter");
const overlayMessage = document.querySelector(".overlayMessage");

// Hand elements
const pScoreEl = document.getElementById("playerScore");
const dScoreEl = document.getElementById("dealerScore");
const pHandEl = document.querySelector(".playerHand");
const dHandEl = document.querySelector(".dealerHand");

// Event Listeners
betUp.addEventListener("click", increaseBet);
betDown.addEventListener("click", decreaseBet);
betReset.addEventListener("click", resetBet);
hitBtn.addEventListener("click", hitMe);
standBtn.addEventListener("click", standMe);
doubleDown.addEventListener("click", doubleBet);
dealBtn.addEventListener("click", dealHand);
betText.addEventListener("blur", checkBetVal);
playAgainBtn.addEventListener("click", resetHand);
cashOutBtn.addEventListener("click", cashOut);

// CODE START
init();

// FUNCTIONS
function init() {
  bankText.textContent = `$ ${bankStart}`;
  betText.value = `$ ${betDefault}`;
  playingDeck = basicDeck;
  resetHand();
}

function dealHand() {
  overlayMain.style.zIndex = -1;
  overlayAside.style.zIndex = 1;
  removeCards(pHandEl);
  removeCards(dHandEl);
  dealCardUp(pHandEl);
  dealCardUp(pHandEl);
  dealCardUp(dHandEl);
  dealCardDown(dHandEl);
  sumScore();
}

function dealCardUp(hand) {
  let newCard = document.createElement("div");
  newCard.classList.add("card", rndCard(hand));
  hand.appendChild(newCard);
}

function dealCardDown(hand) {
  let newCard = document.createElement("div");
  newCard.classList.add("card", "back");
  hand.appendChild(newCard);
}

function dealHoleCard() {
  dHandEl.removeChild(dHandEl.lastChild);
  let newCard = document.createElement("div");
  newCard.classList.add("card", rndCard(dHandEl));
  dHandEl.appendChild(newCard);
}

function rndCard(hand) {
  let rndIdx = Math.floor(Math.random() * playingDeck.length);
  hand === pHandEl
    ? pHand.push(playingDeck[rndIdx].substring(1))
    : dHand.push(playingDeck[rndIdx].substring(1));
  return playingDeck[rndIdx];
}

function removeCards(hand) {
  while (hand.children.length > 1) {
    hand.removeChild(hand.lastChild);
  }
}

function increaseBet() {
  parseInts();
  if (betValue < bankValue) {
    betValue += minBet;
    betText.value = `$ ${betValue}`;
  }
}

function decreaseBet() {
  parseInts();
  if (betValue > minBet) {
    betValue -= minBet;
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
    betValue = betDefault;
  } else if (betValue > bankValue) {
    betValue = bankValue;
  } else if (betValue < minBet) {
    betValue = minBet;
  } else {
    betValue = Math.round(betValue / minBet) * minBet;
  }
  betText.value = `$ ${betValue}`;
}

function dealerPlay() {
  dealHoleCard();
  sumScore();
  while (dScore < 17) {
    dealCardUp(dHandEl);
    sumScore();
  }
  dealerCheck = checkBust(dScore);
  let evt = checkWin();
  payOut(evt);
}

function checkWin() {
  if (dealerCheck === "Bust") {
    if (playerCheck === "Bust") {
      return "Draw";
    } else {
      return "Win";
    }
  } else {
    if (playerCheck === "Bust") {
      return "Lose";
    } else {
      if (pScore > dScore) {
        return "Win";
      } else if (pScore < dScore) {
        return "Lose";
      } else {
        return "Draw";
      }
    }
  }
}

function payOut(evt) {
  parseInts();
  if (evt === "Win") {
    bankValue += betValue;
    overlayMessage.textContent = "You Win :)";
  } else if (evt === "Lose") {
    bankValue -= betValue;
    overlayMessage.textContent = "You lose :(";
  } else {
    overlayMessage.textContent = "Push";
  }
  bankText.textContent = `$ ${bankValue}`;
  overlayCenter.style.zIndex = 2;
}

function resetHand() {
  overlayMain.style.zIndex = 1;
  overlayAside.style.zIndex = -1;
  overlayCenter.style.zIndex = -1;
  pHand = [];
  dHand = [];
  removeCards(dHandEl);
  removeCards(pHandEl);
  dealCardDown(pHandEl);
  dealCardDown(pHandEl);
  dealCardDown(dHandEl);
  dealCardDown(dHandEl);
  unLockPlayer();
}

function hitMe() {
  dealCardUp(pHandEl);
  sumScore();
  playerCheck = checkBust(pScore);
  playerCheck === "Bust" ? playerBust() : "";
}

function standMe() {
  lockPlayer();
  dealerPlay();
}

function lockPlayer() {
  doubleDown.style.opacity = 0.5;
  doubleDown.removeEventListener("click", doubleBet);
  hitBtn.style.opacity = 0.5;
  hitBtn.removeEventListener("click", hitMe);
  standBtn.style.opacity = 0.5;
  standBtn.removeEventListener("click", standMe);
}

function unLockPlayer() {
  doubleDown.style.opacity = 1;
  doubleDown.addEventListener("click", doubleBet);
  hitBtn.style.opacity = 1;
  hitBtn.addEventListener("click", hitMe);
  standBtn.style.opacity = 1;
  standBtn.addEventListener("click", standMe);
}

function sumScore() {
  pScore = pHand.reduce(function (acc, card, ind) {
    if (parseInt(card)) {
      return (acc += parseInt(card));
    } else if (card === "A") {
      return (acc += 11);
    } else {
      return (acc += 10);
    }
  }, 0);
  dScore = dHand.reduce(function (acc, card, ind) {
    if (parseInt(card)) {
      return (acc += parseInt(card));
    } else if (card === "A") {
      return (acc += 11);
    } else {
      return (acc += 10);
    }
  }, 0);
  pScoreEl.textContent = pScore;
  dScoreEl.textContent = dScore;
}

function checkBust(score) {
  if (score > 21) {
    return "Bust";
  } else {
    return "Safe";
  }
}

function playerBust() {
  lockPlayer();
  dealerPlay();
}

function cashOut() {
  parseInts();
  let netGain = bankValue - bankStart;
  overlayMessage.textContent =
    netGain > 0 ? `You won $ ${netGain}!` : `You lost $ ${netGain}`;
  while (overlayCenter.children.length > 1) {
    overlayCenter.removeChild(overlayCenter.lastChild);
  }
}
