// Constants
let bankStart = 1000;
let betDefault = 100;
let minBet = 10;
let playingDeck = [];
let standCount = 0;
let message = "";

const player = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: false,
  aceType: "soft",
  hasBlackJack: false,
};

const split = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: false,
  aceType: "soft",
  hasBlackJack: false,
};

const dealer = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: false,
  aceType: "soft",
  hasBlackJack: false,
};

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
const dealBtn = document.querySelector(".placeBet");

// Playing buttons
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const doubleDown = document.querySelector(".doubleDown");
const playAgainBtn = document.querySelector(".playAgain");
const cashOutBtn = document.querySelector(".cashOut");

// Split elements
const overlaySplit = document.querySelector(".overlaySplit");
const splitHit1Btn = document.getElementById("splitHit1");
const splitStand1Btn = document.getElementById("splitStand1");
const splitHit2Btn = document.getElementById("splitHit2");
const splitStand2Btn = document.getElementById("splitStand2");

// Reset elements
const overlayMain = document.querySelector(".overlayMain");
const overlayAside = document.querySelector(".overlayAside");
const overlayCenter = document.querySelector(".overlayCenter");
const overlayMessage = document.querySelector(".overlayMessage");

// Hand elements
const pScoreEl = document.getElementById("playerScore");
const dScoreEl = document.getElementById("dealerScore");
const pHandEl = document.querySelector(".playerHand");
const dHandEl = document.querySelector(".dealerHand");
const centerTable = document.querySelector(".centerTable");

// Betting Event Listeners
betUp.addEventListener("click", increaseBet);
betDown.addEventListener("click", decreaseBet);
betReset.addEventListener("click", resetBet);
dealBtn.addEventListener("click", dealHand);
betText.addEventListener("blur", checkBetVal);

// Win Condition Event Listeners
playAgainBtn.addEventListener("click", resetHand);
cashOutBtn.addEventListener("click", cashOut);

// CODE START
init();

// INITIAL FUNCTIONS
function init() {
  bankText.textContent = `$ ${bankStart}`;
  betText.value = `$ ${betDefault}`;
  playingDeck = basicDeck;
  resetHand();
}

function resetHand() {
  overlayMain.style.zIndex = 1;
  overlayAside.style.zIndex = -1;
  overlayCenter.style.zIndex = -1;
  overlaySplit.style.zIndex = -1;
  message = "";
  resetPerson(player);
  resetPerson(split);
  resetPerson(dealer);
  addCard(player, "faceDown");
  addCard(player, "faceDown");
  addCard(dealer, "faceDown");
  addCard(dealer, "faceDown");
  unLockPlayer();
  renderTable();
}

function resetPerson(person) {
  person.hand = [];
  person.hasAce = false;
  person.aceType = "soft";
  person.bust = false;
}

function addCard(person, face) {
  if (face === "faceUp") {
    person.hand.push(rndCard(person));
  } else {
    person.hand.push("back");
  }
}

function rndCard(person) {
  let rndIdx = Math.floor(Math.random() * playingDeck.length);
  return playingDeck[rndIdx];
}

function unLockPlayer() {
  doubleDown.style.opacity = 1;
  doubleDown.addEventListener("click", doubleBet);
  hitBtn.style.opacity = 1;
  hitBtn.addEventListener("click", hitMe);
  standBtn.style.opacity = 1;
  standBtn.addEventListener("click", standOrBust);
}

function renderTable() {
  removeCards(dHandEl);
  removeCards(pHandEl);
  updateScore(player);
  updateScore(dealer);
  renderHand(player, pHandEl, pScoreEl);
  renderHand(dealer, dHandEl, dScoreEl);
}

function removeCards(hand) {
  while (hand.children.length > 1) {
    hand.removeChild(hand.lastChild);
  }
}

function updateScore(person) {
  person.score = person.hand.reduce(function (acc, card, ind) {
    if (card !== "back") {
      if (parseInt(card.substring(1))) {
        return (acc += parseInt(card.substring(1)));
      } else if (card.substring(1) === "A") {
        person.hasAce = true;
        if (person.aceType === "soft") {
          return (acc += 11);
        } else {
          return (acc += 1);
        }
      } else {
        return (acc += 10);
      }
    } else {
      return acc;
    }
  }, 0);
  person.hasBlackJack = person.score === 21;
}

function renderHand(person, hand, score, size) {
  person.hand.forEach(function (card, idx) {
    let newCard = document.createElement("div");
    newCard.classList.add("card", size, card);
    hand.appendChild(newCard);
  });
  if (person.hasBlackJack) {
    score.textContent = person.score;
  } else if (person.hasAce && person.aceType === "soft") {
    score.textContent = `${person.score}/${person.score - 10}`;
  } else {
    score.textContent = person.score;
  }
}

// BETTING FUNCTIONS
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
  hitMe();
  player.bust ? "" : standOrBust();
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

// PLAYING FUNCTIONS
function dealHand() {
  overlayMain.style.zIndex = -1;
  overlayAside.style.zIndex = 1;
  player.hand = ["s08", "h08"];
  dealer.hand = [];
  // addCard(player, "faceUp");
  // addCard(player, "faceUp");
  addCard(dealer, "faceUp");
  addCard(dealer, "faceDown");
  renderTable();
  checkSplit();
}

function hitMe() {
  addCard(player, "faceUp");
  renderTable();
  player.bust = checkBust(player);
  player.bust ? standOrBust() : "";
  doubleDown.style.opacity = 0.5;
  doubleDown.removeEventListener("click", doubleBet);
}

function standOrBust() {
  lockPlayer();
  dealerPlay();
}

function checkBust(person) {
  if (person.hasAce) {
    if (person.aceType === "soft") {
      if (person.score > 21) {
        person.aceType = "hard";
        renderTable();
      } else {
        return false;
      }
    } else {
      return person.score > 21;
    }
  } else {
    return person.score > 21;
  }
}

function lockPlayer() {
  doubleDown.style.opacity = 0.5;
  doubleDown.removeEventListener("click", doubleBet);
  hitBtn.style.opacity = 0.5;
  hitBtn.removeEventListener("click", hitMe);
  standBtn.style.opacity = 0.5;
  standBtn.removeEventListener("click", standOrBust);
}

// DEALER FUNCTIONS
function dealerPlay() {
  dealHoleCard();
  setTimeout(function () {
    while (dealer.score < 17) {
      addCard(dealer, "faceUp");
      renderTable();
    }
    dealer.bust = checkBust(dealer);
    let evt = checkWin(player);
    payOut(evt);
    overlayMessage.textContent = message;
    overlayCenter.style.zIndex = 2;
  }, 1000);
}

function dealHoleCard() {
  dealer.hand.pop();
  addCard(dealer, "faceUp");
  renderTable();
}

// WIN CONDITION FUNCTIONS
function checkWin(person) {
  if (dealer.bust) {
    if (person.bust) {
      return "Draw";
    } else {
      return "Win";
    }
  } else {
    if (person.bust) {
      return "Lose";
    } else {
      if (person.score > dealer.score) {
        return "Win";
      } else if (person.score < dealer.score) {
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
    message = message + "You Win :) ";
  } else if (evt === "Lose") {
    bankValue -= betValue;
    message = message + "You lose :( ";
  } else {
    message = message + "Push ";
  }
  bankText.textContent = `$ ${bankValue}`;
}

function cashOut() {
  parseInts();
  let netGain = bankValue - bankStart;
  overlayMessage.innerHTML =
    netGain > 0
      ? `You won $${netGain}! </br> Thanks for playing`
      : `You lost $${netGain} </br> Thanks for playing`;
  overlayMessage.style.lineheight = "17vh";
  while (overlayCenter.children.length > 1) {
    overlayCenter.removeChild(overlayCenter.lastChild);
  }
}

// SPLIT FUNCTIONS
function checkSplit() {
  if (player.hand[0].substring(1) === player.hand[1].substring(1)) {
    let splitBtn = document.createElement("button");
    splitBtn.classList.add("button", "split");
    splitBtn.style.marginLeft = "75px";
    splitBtn.textContent = "Split";
    splitBtn.addEventListener("click", splitCards);
    centerTable.appendChild(splitBtn);
  }
}

function splitCards() {
  split.hand[0] = player.hand[1];
  player.hand.pop();
  player.hand.push(rndCard(player));
  split.hand.push(rndCard(player));
  updateScore(player);
  updateScore(split);
  centerTable.removeChild(centerTable.lastChild);
  unlockSplit();
  renderSplit();
}

function renderSplit() {
  removeCards(pHandEl);
  removeCards(dHandEl);
  renderHand(dealer, dHandEl, dScoreEl);
  renderHand(player, pHandEl, pScoreEl, "large");

  let spacer = document.createElement("div");
  spacer.style.width = "50px";
  pHandEl.appendChild(spacer);

  let sScoreEl = document.createElement("div");
  sScoreEl.classList.add("score");
  sScoreEl.style.marginRight = "";
  sScoreEl.style.marginLeft = "25px";

  renderHand(split, pHandEl, sScoreEl, "large");
  pHandEl.appendChild(sScoreEl);
  overlaySplit.style.zIndex = 1;
}

// SPLIT PLAYING FUNCTIONS
function unlockSplit() {
  splitHit1Btn.style.opacity = 1;
  splitHit1Btn.addEventListener("click", function () {
    hitSplit(player);
  });
  splitStand1Btn.opacity = 1;
  splitStand1Btn.addEventListener("click", function () {
    standOrBustSplit(player);
  });
  splitHit2Btn.style.opacity = 1;
  splitHit2Btn.addEventListener("click", function () {
    hitSplit(split);
  });
  splitStand2Btn.style.opacity = 1;
  splitStand2Btn.addEventListener("click", function () {
    standOrBustSplit(split);
  });
  standCount = 0;
}

function hitSplit(person) {
  addCard(person, "faceUp");
  updateScore(person);
  renderSplit();
  person.bust = checkBust(person);
  person.bust ? standOrBustSplit(person) : "";
}

function standOrBustSplit(person) {
  lockSplit(person);
  standCount = standCount + 1;
  standCheck();
}

function standCheck() {
  standCount === 2 ? dealerPlaySplit() : "";
}

function lockSplit(person) {
  if (person === player) {
    splitHit1Btn.style.opacity = 0.5;
    splitHit1Btn.removeEventListener("click", function () {
      hitSplit(player);
    });
    splitStand1Btn.style.opacity = 0.5;
    splitStand1Btn.removeEventListener("click", function () {
      standOrBustSplit(player);
    });
  } else {
    splitHit2Btn.style.opacity = 0.5;
    splitHit2Btn.removeEventListener("click", function () {
      hitSplit(split);
    });
    splitStand2Btn.style.opacity = 0.5;
    splitStand2Btn.removeEventListener("click", function () {
      standOrBustSplit(split);
    });
  }
}

// SPLIT DEALER FUNCTIONS
function dealerPlaySplit() {
  dealHoleCardSplit();
  setTimeout(function () {
    while (dealer.score < 17) {
      addCard(dealer, "faceUp");
      updateScore(dealer);
      renderSplit();
    }
    dealer.bust = checkBust(dealer);
    let evt1 = checkWin(player);
    let evt2 = checkWin(split);
    payOut(evt1);
    payOut(evt2);
    overlaySplit.style.zIndex = -1;
    overlayMessage.textContent = message;
    overlayCenter.style.zIndex = 2;
  }, 1000);
}

function dealHoleCardSplit() {
  dealer.hand.pop();
  addCard(dealer, "faceUp");
  updateScore(dealer);
  renderSplit();
}
