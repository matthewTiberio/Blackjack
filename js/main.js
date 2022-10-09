let bankStart = 1000;
let betDefault = 200;
let minBet = 50;
let playingDeck = [];
let standCount = 0;
let message = "";
let removeSplitBtn = false;
let size = "";
let splitBtn;
let deckCount = 4;

const player = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: [],
  aceType: [],
  hasBlackJack: false,
};

const split = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: [],
  aceType: [],
  hasBlackJack: false,
};

const dealer = {
  hand: [],
  bust: false,
  score: 0,
  hasAce: [],
  aceType: [],
  hasBlackJack: false,
};

const basicDeck = [
  "dA",
  "dK",
  "dQ",
  "dJ",
  "d10",
  "d09",
  "d08",
  "d07",
  "d06",
  "d05",
  "d04",
  "d03",
  "d02",
  "hA",
  "hK",
  "hQ",
  "hJ",
  "h10",
  "h09",
  "h08",
  "h07",
  "h06",
  "h05",
  "h04",
  "h03",
  "h02",
  "cA",
  "cK",
  "cQ",
  "cJ",
  "c10",
  "c09",
  "c08",
  "c07",
  "c06",
  "c05",
  "c04",
  "c03",
  "c02",
  "sA",
  "sK",
  "sQ",
  "sJ",
  "s10",
  "s09",
  "s08",
  "s07",
  "s06",
  "s05",
  "s04",
  "s03",
  "s02",
];

const bankText = document.querySelector(".bankValue");
const betText = document.querySelector(".currentBet");

const betUp = document.querySelector(".increaseBet");
const betDown = document.querySelector(".decreaseBet");
const betReset = document.querySelector(".defaultBet");
const dealBtn = document.querySelector(".placeBet");

const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const doubleDownBtn = document.querySelector(".doubleDown");
const newBetBtn = document.querySelector(".newBet");
const sameBetBtn = document.querySelector(".sameBet");
const cashOutBtn = document.querySelector(".cashOut");

const overlaySplit = document.querySelector(".overlaySplit");
const splitHit1Btn = document.getElementById("splitHit1");
const splitStand1Btn = document.getElementById("splitStand1");
const splitHit2Btn = document.getElementById("splitHit2");
const splitStand2Btn = document.getElementById("splitStand2");

const overlayMain = document.querySelector(".overlayMain");
const overlayAside = document.querySelector(".overlayAside");
const overlayCenter = document.querySelector(".overlayCenter");
const overlayMessage = document.querySelector(".overlayMessage");
const overlayShuffle = document.querySelector(".overlayShuffle");
const overlayBankrupt = document.querySelector(".overlayBankrupt");

const pScoreEl = document.getElementById("playerScore");
const dScoreEl = document.getElementById("dealerScore");
const pHandEl = document.querySelector(".playerHand");
const dHandEl = document.querySelector(".dealerHand");
const centerTable = document.querySelector(".centerTable");

betUp.addEventListener("click", increaseBet);
betDown.addEventListener("click", decreaseBet);
betReset.addEventListener("click", resetBet);
dealBtn.addEventListener("click", dealHand);
betText.addEventListener("blur", checkBetVal);

newBetBtn.addEventListener("click", newBet);
sameBetBtn.addEventListener("click", sameBet);
cashOutBtn.addEventListener("click", cashOut);

init();

function init() {
  bankText.textContent = `$ ${bankStart}`;
  betText.value = `$ ${betDefault}`;
  createDeck();
  resetHand();
  goToBetting();
}

function createDeck() {
  for (let i = 0; i < deckCount; i++) {
    basicDeck.forEach(function (card, idx) {
      playingDeck.push(card);
    });
  }
}

function goToBetting() {
  overlayMain.style.zIndex = 1;
  overlayAside.style.zIndex = -1;
  resetBet();
  addCard(player, "back");
  addCard(player, "back");
  addCard(dealer, "back");
  addCard(dealer, "back");
  renderTable();
}

function resetHand() {
  overlayCenter.style.zIndex = -1;
  overlaySplit.style.zIndex = -1;
  message = "";
  standCount = 0;
  resetPerson(player);
  resetPerson(dealer);
  resetPerson(split);
  unLockPlayer();
}

function shuffleDeck(callback) {
  overlayShuffle.style.zIndex = 2;
  overlayShuffle.textContent = "Reshuffle";
  setTimeout(function () {
    overlayShuffle.style.zIndex = -1;
    playingDeck = [];
    createDeck();
    callback;
  }, 1500);
}

function resetPerson(person) {
  person.hand = [];
  person.hasAce = [];
  person.aceType = [];
  person.bust = false;
  person.hasBlackJack = false;
}

function addCard(person, face) {
  if (face === "faceUp") {
    rndIdx = rndCard();
    person.hand.push(playingDeck[rndIdx]);
    playingDeck.splice(rndIdx, 1);
    if (person.hand[person.hand.length - 1].substring(1) === "A") {
      person.hasAce.push(true);
      person.aceType.push("soft");
    } else {
      person.hasAce.push(false);
      person.aceType.push("");
    }
  } else {
    person.hand.push("back");
  }
}

function rndCard() {
  return (rndIdx = Math.floor(Math.random() * playingDeck.length));
}

function unLockPlayer() {
  doubleDownBtn.style.opacity = 1;
  doubleDownBtn.addEventListener("click", doubleDown);
  hitBtn.style.opacity = 1;
  hitBtn.addEventListener("click", hitMe);
  standBtn.style.opacity = 1;
  standBtn.addEventListener("click", standOrBust);
}

function renderTable() {
  renderHand(player, pHandEl, pScoreEl);
  renderHand(dealer, dHandEl, dScoreEl);
  if (player.hand[0] !== "back" && dealer.hand[1] === "back") {
    checkSplit();
  }
}

function renderHand(person, hand, score) {
  removeCards(hand);
  updateScore(person);
  removeSplit(removeSplitBtn);
  if (split.hand[0] && person === player) {
    renderSplit();
    return;
  }

  if (person.hand.length > 4) {
    renderCards(person, hand, score, "small");
  } else {
    renderCards(person, hand, score);
  }
}

function removeCards(hand) {
  while (hand.children.length > 1) {
    hand.removeChild(hand.lastChild);
  }
}

function updateScore(person) {
  person.score = person.hand.reduce(function (acc, card, idx) {
    if (card !== "back") {
      if (parseInt(card.substring(1))) {
        return (acc += parseInt(card.substring(1)));
      } else if (person.hasAce[idx]) {
        if (person.aceType[idx] === "soft") {
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
  if (person.score === 21 && person.hand.length === 2) {
    person.hasBlackJack = true;
  }
  person.bust = checkBust(person);
}

function renderCards(person, hand, score, size) {
  person.hand.forEach(function (card, idx) {
    let newCard = document.createElement("div");
    newCard.classList.add("card", size, card);
    hand.appendChild(newCard);
  });
  if (person.hasBlackJack) {
    score.textContent = person.score;
    score.style.width = "70px";
  } else if (person.aceType.includes("soft")) {
    score.textContent = `${person.score}/${person.score - 10}`;
    score.style.width = "110px";
  } else {
    score.textContent = person.score;
    score.style.width = "70px";
  }
}

function increaseBet() {
  parseInts();
  if (betValue < bankValue - minBet) {
    betValue += minBet;
  } else {
    betValue = bankValue;
  }
  betText.value = `$ ${betValue}`;
}

function decreaseBet() {
  parseInts();
  if (betValue > minBet) {
    betValue -= minBet;
  } else if (betValue > bankValue) {
    betValue = bankValue;
  }
  betText.value = `$ ${betValue}`;
}

function resetBet() {
  betText.value = `$ ${betDefault}`;
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

function dealHand() {
  overlayMain.style.zIndex = -1;
  overlayAside.style.zIndex = 1;
  resetPerson(player);
  resetPerson(dealer);
  resetPerson(split);
  addCard(player, "faceUp");
  addCard(player, "faceUp");
  addCard(dealer, "faceUp");
  addCard(dealer, "faceDown");
  renderTable();
}

function hitMe() {
  addCard(player, "faceUp");
  renderHand(player, pHandEl, pScoreEl);
  player.bust ? standOrBust() : "";
  doubleDownBtn.style.opacity = 0.5;
  doubleDownBtn.removeEventListener("click", doubleDown);
}

function standOrBust() {
  lockPlayer();
  dealerPlay();
}

function doubleDown() {
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

function checkBust(person) {
  if (person.score > 21) {
    if (person.aceType.includes("soft")) {
      let aceIdx = person.aceType.findIndex(function (card) {
        return card === "soft";
      });
      person.aceType[aceIdx] = "hard";
      updateScore(person);
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function lockPlayer() {
  doubleDownBtn.style.opacity = 0.5;
  doubleDownBtn.removeEventListener("click", doubleDown);
  hitBtn.style.opacity = 0.5;
  hitBtn.removeEventListener("click", hitMe);
  standBtn.style.opacity = 0.5;
  standBtn.removeEventListener("click", standOrBust);
}

function dealerPlay() {
  dealHoleCard();
  if (dealer.score < 17) {
    dealerHit();
  } else {
    endHand();
  }
}

function dealHoleCard() {
  dealer.hand.pop();
  addCard(dealer, "faceUp");
  renderHand(dealer, dHandEl, dScoreEl);
}

function dealerHit() {
  setTimeout(function () {
    addCard(dealer, "faceUp");
    renderHand(dealer, dHandEl, dScoreEl);
    if (dealer.score < 17) {
      dealerHit();
    } else {
      endHand();
    }
  }, 1000);
}

function checkWin(person) {
  if (person.hasBlackJack) {
    if (dealer.hasBlackJack) {
      return "Draw";
    } else {
      return "Blackjack";
    }
  } else if (person.bust) {
    return "Lose";
  } else if (dealer.bust) {
    return "Win";
  } else {
    if (person.score > dealer.score) {
      return "Win";
    } else if (person.score < dealer.score) {
      return "Lose";
    } else if (dealer.hasBlackJack) {
      return "Lose";
    } else {
      return "Draw";
    }
  }
}

function endHand() {
  let evts = [];
  evts[0] = checkWin(player);
  if (standCount === 2) {
    evts[1] = checkWin(split);
  }
  payOut(evts);
  if (bankValue === 0) {
    overlayBankrupt.style.zIndex = 3;
  } else {
    overlayMessage.textContent = message;
    overlayCenter.style.zIndex = 2;
  }
}

function payOut(evts) {
  parseInts();
  evts.forEach(function (evt, idx) {
    if (idx === 1) {
      message = message + " & ";
      overlaySplit.style.zIndex = -1;
    }
    if (evt === "Blackjack") {
      bankValue += betValue * 1.5;
      message = message + "Blackjack ";
    } else if (evt === "Win") {
      bankValue += betValue;
      message = message + "You Win ";
    } else if (evt === "Lose") {
      bankValue -= betValue;
      message = message + "You lose ";
    } else {
      message = message + "Push ";
    }
    bankText.textContent = `$ ${bankValue}`;
  });
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

function newBet() {
  if (playingDeck.length < (basicDeck.length * deckCount) / 2) {
    resetHand();
    shuffleDeck(goToBetting());
  } else {
    resetHand();
    goToBetting();
  }
}

function sameBet() {
  parseInts();
  if (betValue > bankValue) {
    betValue = bankValue;
    betText.value = `$ ${betValue}`;
  }
  if (playingDeck.length < (basicDeck.length * deckCount) / 2) {
    resetHand();
    shuffleDeck(dealHand());
  } else {
    resetHand();
    dealHand();
  }
}

function checkSplit() {
  parseInts();
  if (
    player.hand[0].substring(1) === player.hand[1].substring(1) &&
    player.hand.length === 2 &&
    betValue * 2 < bankValue
  ) {
    splitBtn = document.createElement("button");
    splitBtn.classList.add("button", "split");
    splitBtn.style.marginLeft = "75px";
    splitBtn.textContent = "Split";
    splitBtn.addEventListener("click", splitCards);
    centerTable.appendChild(splitBtn);
    removeSplitBtn = true;
  }
}

function removeSplit(remove) {
  if (remove) {
    splitBtn.removeEventListener("click", splitCards);
    centerTable.removeChild(centerTable.lastChild);
    splitBtn.remove();
    removeSplitBtn = false;
  }
}

function splitCards() {
  split.hand[0] = player.hand[1];
  player.hand.pop();
  split.hasAce[0] = player.hasAce[1];
  player.hasAce.pop();
  split.aceType[0] = player.aceType[1];
  player.aceType.pop();
  addCard(player, "faceUp");
  addCard(split, "faceUp");
  updateScore(player);
  updateScore(split);
  unlockSplit();
  renderSplit();
}

function renderSplit() {
  updateScore(player);
  updateScore(split);
  removeCards(pHandEl);
  if (player.hand.length + split.hand.length > 5) {
    size = "xsmall";
  } else {
    size = "small";
  }
  renderCards(player, pHandEl, pScoreEl, size);

  let spacer = document.createElement("div");
  spacer.style.width = "50px";
  pHandEl.appendChild(spacer);

  let sScoreEl = document.createElement("div");
  sScoreEl.classList.add("score");
  sScoreEl.style.marginRight = "";
  sScoreEl.style.marginLeft = "25px";

  renderCards(split, pHandEl, sScoreEl, size);
  pHandEl.appendChild(sScoreEl);
  overlaySplit.style.zIndex = 1;
}

function unlockSplit() {
  splitHit1Btn.style.opacity = 1;
  splitHit1Btn.addEventListener("click", hitSplit1);
  splitStand1Btn.style.opacity = 1;
  splitStand1Btn.addEventListener("click", standOrBustSplit1);
  splitHit2Btn.style.opacity = 1;
  splitHit2Btn.addEventListener("click", hitSplit2);
  splitStand2Btn.style.opacity = 1;
  splitStand2Btn.addEventListener("click", standOrBustSplit2);
}

function hitSplit1() {
  addCard(player, "faceUp");
  renderSplit();
  person.bust ? standOrBustSplit(player) : "";
}

function standOrBustSplit1() {
  lockSplit(player);
  standCount = standCount + 1;
  standCheck();
}

function hitSplit2() {
  addCard(split, "faceUp");
  renderSplit();
  person.bust ? standOrBustSplit(split) : "";
}

function standOrBustSplit2() {
  lockSplit(split);
  standCount = standCount + 1;
  standCheck();
}

function standCheck() {
  standCount === 2 ? dealerPlay() : "";
}

function lockSplit(person) {
  if (person === player) {
    splitHit1Btn.style.opacity = 0.5;
    splitHit1Btn.removeEventListener("click", hitSplit1);
    splitStand1Btn.style.opacity = 0.5;
    splitStand1Btn.removeEventListener("click", standOrBustSplit1);
  } else {
    splitHit2Btn.style.opacity = 0.5;
    splitHit2Btn.removeEventListener("click", hitSplit2);
    splitStand2Btn.style.opacity = 0.5;
    splitStand2Btn.removeEventListener("click", standOrBustSplit2);
  }
}
