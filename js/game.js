/**
 * Blackjack game
 *
 */

// constants
var SUITS = ['c', 'd', 'h', 's'];
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var VALUES = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 10,
  Q: 10,
  K: 10
};


/**
 * Card object - stores the the suit and value of the card.
 */
function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
};

Card.prototype.getCard = function() {
  return this;
}

Card.prototype.getRank = function() {
  return this.rank;
}

Card.prototype.getSuit = function() {
  return this.suit;
}

/**
 * Hand ojbect - stores the cards and the value of the hand.
 */
function Hand() {
  this.hand = [];
};

/*
* Add cards to a hand. Takes two arguments: cards (array) and numberOfcards (int).
*/
Hand.prototype.addCards = function (cards, numberOfCards) {
  while (numberOfCards > 0) {
    this.hand.push(cards[numberOfCards - 1]);
    numberOfCards -= 1;
  }
}

/*
* Pop cards from a hand. Takes one arguments: number (int). Return poped cards (array);
*/
Hand.prototype.popCard = function (number) {
  var cardArr = [];
  while (number > 0) {
    cardArr.push(this.hand.pop());
    number -= 1;
  }
  return cardArr;
};

/*
*  Get value of a hand. Count aces as 11 if the value is below 21 and as
* 1 it the total value is higher.
*/
Hand.prototype.getValue = function() {
  var handValue = 0;

  // Sum the cards
  for (var i = 0; i < this.hand.length; i++) {
    var rank = this.hand[i].getRank();
    handValue += VALUES[rank];
  }

  // If hand without an A, return, else add 10 or keep the 1 value
  if (!this.isHandWithAce(this.hand)) {
    return handValue;
  } else {
    if (handValue + 10 <= 21) {
      return handValue + 10;
    } else {
      return handValue;
    }
  }
}

Hand.prototype.isHandWithAce = function (hand) {
  var handWithA = false;
  for (var i = 0; i < hand.length; i++) {
    var rank = hand[i].getRank();
    if (rank === 'A') {
      handWithA = true;
    }
  }
  return handWithA;
};

Hand.prototype.printHand = function() {
  var hand_printout = "";
  if (this.hand.length > 3) {
    for (var i = 0; i < this.hand.length; i++) {
      hand_printout = hand_printout + "<img style=\"margin-left:-55px;" + i + "\" src=\"img/" + this.hand[i].rank + this.hand[i].suit + ".jpg\">";
    }
  } else {
    for (var i = 0; i < this.hand.length; i++) {
      hand_printout = hand_printout + "<img src=\"img/" + this.hand[i].rank + this.hand[i].suit + ".jpg\">";
    }
  }
  return hand_printout;
}

Hand.prototype.printDealerHand = function() {
  var hand_printout = "";
  if (this.hand.length > 4) {
    for (var i = 0; i < this.hand.length - 1; i++) {
      hand_printout = hand_printout + "<img style=\"margin-left:-55px;" + i + "\" src=\"img/XX.jpg\">";
    }
    hand_printout = hand_printout + "<img style=\"margin-left:-55px;" + i + "\" src=\"img/" + this.hand[this.hand.length - 1].rank + this.hand[this.hand.length - 1].suit + ".jpg\">";
  } else {
    for (var i = 0; i < this.hand.length - 1; i++) {
      hand_printout = hand_printout + "<img src=\"img/XX.jpg\">";
    }
    hand_printout = hand_printout + "<img src=\"img/" + this.hand[this.hand.length - 1].rank + this.hand[this.hand.length - 1].suit + ".jpg\">";
  }
  return hand_printout;
}
/**
  * Check if the hand is a pair (return boolean).
  */
Hand.prototype.pairCheck = function () {
  return this.hand[0].getRank() === this.hand[1].getRank();
};

/**
 * Deck object - generates and shuffles the deck, deals the cards.
 */
function Deck() {
  this.deck = new Array();
  for (var i = 0; i < SUITS.length; i++) {
    for (var j = 0; j < RANKS.length; j++) {
      var card_to_add = new Card(SUITS[i], RANKS[j]);
      this.deck.push(card_to_add.getCard());
    }
  }
};
// Return the whole deck in one string
Deck.prototype.printDeck = function() {
  var deck_str = "Deck contains: ";
  for (var i = 0; i < this.deck.length; i++) {
    deck_str = deck_str + this.deck[i].rank + this.deck[i].suit + ' ';
  }
  return deck_str;
};

// Shuffle the deck
Deck.prototype.shuffleDeck = function() {
  return shuffleArray(this.deck);
}

/*
* Deal a given number of cards from the deck. Takes number of cards to deal
* as an argument (int) and returns number * cards (array).
*/
Deck.prototype.dealCard = function(number) {
  var dealArr = [];
  while (number > 0) {
    dealArr.push(this.deck.pop());
    number -= 1;
  }
  return dealArr;
}

/**
 * The game object. Player wins if not busted and have a hand better than dealer.
 * Dealer wins if not busted and have a hand equal or better than player. Text feedback
 * and score are updated accordingly.
 */

function Game() {
  this.outcome = "";
  this.inPlay = false;
  this.score = 2000;
  this.playingDeck = [];
  this.playerHand = [];
  this.dealerHand = [];
  this.bet = 100;
  this.RAKE = 0.05;
};

Game.prototype.deal = function() {
  ctrl.toggleUI(['#double', '#hit', '#playerHandWrap', '#stand'], ['#splitHand', '#splitWrapOne', '#splitWrapTwo']);
  if (this.inPlay) {
    this.outcome = "You have forfeited your hand.";
    this.score -= 100;
    this.inPlay = false;
    lose.play();
  } else {
    this.outcome = " ";
  }

  this.generateNewBoard();

  // deal the first 2 cards for player and dealer
  this.playerHand.addCards(this.playingDeck.dealCard(2), 2);
  this.dealerHand.addCards(this.playingDeck.dealCard(2), 2);

  if (this.dealerHand.getValue() === 21) {
    this.outcome = "The dealer hits BlackJack, dealer wins. New Deal?";
    this.inPlay = false;
    ctrl.toggleUI([], ['#double', '#hit', '#splitHand', '#stand']);
    lose.play();
  } else {
    this.outcome = "Do you Hit or Stand?";
    // check if the hand is a pair and allow split
    if (this.playerHand.pairCheck()) {
      $('#splitHand').removeClass('hide');
      this.outcome = "Do you Hit, Split or Stand?";
    }
  }
  ctrl.updateView();
}

Game.prototype.doubleBet = function () {
  this.bet *= 2;
  ctrl.toggleUI([], ['#double', '#hit', '#splitHand', '#stand']);
  ctrl.updateView();
};

Game.prototype.hit = function(hand) {
  var handMap = { playerHand:this.playerHand,
                splitHandOne:this.splitHandOne,
                splitHandTwo:this.splitHandTwo };
  if (this.inPlay && !(handMap[hand].getValue() > 21)) {
    // deal another card
    handMap[hand].addCards(this.playingDeck.dealCard(1), 1);
      // If players hand value is over 21, player busts
    if (handMap[hand].getValue() > 21 && !this.handIsSplit) {
      this.outcome = "You have busted (" + handMap[hand].getValue() + "), dealer wins. New Deal?";
      this.inPlay = false;
      this.score -= this.bet;
      ctrl.toggleUI([], ['#hit', '#stand']);
      lose.play();
    } else {
      this.outcome = "New card dealt. Do you Hit or Stand?";
    }
  }
  ctrl.toggleUI([], ['#double']);
  ctrl.updateView();
}

Game.prototype.stand = function() {
  if (this.inPlay) {
    // dealer only draws when below 17 points
    while (this.dealerHand.getValue() < 17) {
      this.dealerHand.addCards(this.playingDeck.dealCard(1), 1);
    }

    // if dealers hand value is over 21, dealer busts
    if (this.dealerHand.getValue() > 21) {
      this.outcome = "Dealer have busted (" + this.dealerHand.getValue() + "), you win! New Deal?";
      this.score += this.rakeBet(this.bet);
      win.play();
      Mute();
    // else if dealer did not bust and hand is split
  } else if (this.handIsSplit) {
      var won = 0;
      // determine if player hands are winning
      if (this.dealerHand.getValue() < this.splitHandOne.getValue() && !(this.splitHandOne.getValue() > 21)) {
        won += 1;
      }
      if (this.dealerHand.getValue() < this.splitHandTwo.getValue() && !(this.splitHandTwo.getValue() > 21)) {
        won += 1;
      }
      // Set the user feedback accordingly to results
      if (won === 2) {
        this.outcome = "Dealer (" + this.dealerHand.getValue() + ") looses with both your hands (" + this.splitHandOne.getValue() + ", " + this.splitHandTwo.getValue() + "). New Deal?";
        this.score += this.rakeBet(this.bet);
        win.play();
      } else if (won === 1) {
        this.outcome = "Dealer (" + this.dealerHand.getValue() + ") looses with one of your hands (" + this.splitHandOne.getValue() + ", " + this.splitHandTwo.getValue() + "). New Deal?";
        this.score += (this.rakeBet(this.bet))/2;
        win.play();
      } else {
        this.outcome = "Dealer (" + this.dealerHand.getValue() + ") wins with both your hands (" + this.splitHandOne.getValue() + ", " + this.splitHandTwo.getValue() + "). New Deal?";
        this.score -= this.bet;
        lose.play();
      }
    // else if dealer did not bust and hand is NOT split
    } else {
      // if dealers hand is equal or higher to players hand, dealer wins
      if (this.dealerHand.getValue() >= this.playerHand.getValue()) {
        this.outcome = "Dealer (" + this.dealerHand.getValue() + ") wins with your hand (" + this.playerHand.getValue() + "). New Deal?";
        this.score -= this.bet;
        lose.play();
        // else the player wins
      } else {
        this.outcome = "You (" + this.playerHand.getValue() + ") win with dealer's hand (" + this.dealerHand.getValue() + ")! New Deal?";
        this.score += this.rakeBet(this.bet);
        win.play();
      }
    }
    this.inPlay = false;
    ctrl.toggleUI([], ['#double', '#hit', '#stand']);
    ctrl.updateView();
  }
}

/*
  * Rake the bets, return value of the bet after deducting rake.
*/
Game.prototype.rakeBet = function (bet) {
  return bet - (this.RAKE * bet);
};

/*
  * Split user hand
*/
Game.prototype.splitHand = function () {
  this.handIsSplit = true;
  this.bet *= 2;
  // Create Hand no 1
  this.splitHandOne.addCards(this.playerHand.popCard(1), 1);
  this.splitHandOne.addCards(this.playingDeck.dealCard(1), 1);
  // Create Hand no 2
  this.splitHandTwo.addCards(this.playerHand.popCard(1), 1);
  this.splitHandTwo.addCards(this.playingDeck.dealCard(1), 1);
  // Hide the main hand, show the split hands, hide inactive buttons
  ctrl.toggleUI(['#splitWrapOne', '#splitWrapTwo'], ['#playerHandWrap', '#hit', '#double', '#splitHand']);
  ctrl.updateView();
};

/*
* Generate new instance of hands and deck, shuffle deck
*/
Game.prototype.generateNewBoard = function () {
  this.inPlay = true;
  this.playingDeck = new Deck();
  this.playerHand = new Hand();
  this.dealerHand = new Hand();
  this.handIsSplit = false;
  this.splitHandOne = new Hand();
  this.splitHandTwo = new Hand();
  this.playingDeck.shuffleDeck();
  this.bet = 100;
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/** Turn on/off the game sounds */
function Mute() {
  if (mute) {
    ambience.volume = .0;
    win.volume = .0;
    lose.volume = .0;
  } else {
    ambience.volume = .5;
    win.volume = .8;
    lose.volume = .3;

    // loop the ambience casino sound
    ambience.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    ambience.play();
  }
}
