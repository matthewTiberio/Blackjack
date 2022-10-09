# Blackjack

### Background

The object of the game is to win money by creating card totals higher than those of the dealer's hand but not exceeding 21, or by stopping at a total in the hope that dealer will bust. On the players turn, choose to "hit" (take a card), "stand" (end their turn and stop without taking a card), "double" (double their wager, take a single card, and finish) or "split" (if the two cards have the same value, separate them to make two hands).

Number cards count as their number, the jack, queen, and king ("face cards") count as 10, and aces count as either 1 or 11 according to the player's choice. If the total exceeds 21 points, it busts, and all bets on it immediately lose.

After the player has finished playing, the dealer's hand is resolved by drawing cards until the hand achieves a total of 17 or higher (a dealer total of 17 including an ace valued as 11, also known as a "soft 17", must stand). The dealer never doubles, splits, or surrenders. If the dealer busts, the player wins. If the dealer does not bust, the player wins if its hand is higher than the dealer's and loses if it is lower.

A player total of 21 on the first two cards is a "natural" or "blackjack", and the player wins immediately unless dealer also has one, in which case the hand ties. In the case of a tie ("push" or "standoff"), bets are returned without adjustment. A blackjack beats any hand that is not a blackjack, even one with a value of 21.

Wins are paid out at even money, except for player blackjacks, which are paid out at 3 to 2 odds.

### Technologies Used

- HTML
- CSS
- JavaScript

### Getting Started

[Click Here](https://matthewtiberio.github.io/GA-Project1/) to play the game.

#### Betting

![Betting Window](/Images/Betting.png)

> **Bank:** Read-only field displaying the amount of money eligible to bet.
>
> **Current Bet:** Input field, able to type in desired bet. Will automatically round to the nearest multiple of $50.
>
> **Increase Bet:** Increase the Current Bet by $50.
>
> **Default Bet:** Sets the Current Bet to the default bet of $200.
>
> **Decrease Bet:** Decrease the Current Bet by $50.
>
> **Place Bet:** Locks in the bet and deals the hand.

![Playing Window](/Images/Playing.png)

> **Hit:** Take another card.
>
> **Stand:** Take no more cards.
>
> **Double down (X2):** Increase the initial bet by 100% and take exactly one more card. If the player does not have enough banked to double the original bet, the player goes all in.
>
> **Split:** Create two hands from a starting hand where both cards are the same value. Each new hand gets another card so that the player has two starting hands. This requires an additional bet on the second hand. The two hands are played out independently, and the wager on each hand is won or lost independently. In the case of cards worth 10 points, splitting is only allowed when the cards are the same rank. For example, 10-10 could be split, but K-10 could not. Doubling and re-splitting after splitting is not allowed.

### Next Steps

##### Improvements to existing functionality

- Have the split hands use the same Hit & Stand buttons
- Force the player to play split hands in order
- Allow all facecard pairings to be split
- Have the "Same Bet" end of hand option remember the initial bet before doubling down

##### New functionality

- Build a settings window that allows the player to set the following options:
  - Number of decks used
  - Initial Bank value
  - Default Bet
  - Increase/Decrease bet amount
  - Minimum bet amount
- Build in an advice options that highlights the button for the optimal play
