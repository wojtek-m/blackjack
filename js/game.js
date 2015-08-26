/**
 * Blackjack game
 *
 */


// jQuery
$('#deal').on('click', function() {
  blackjack.deal()
});
$('#hit').on('click', function() {
  blackjack.hit()
});
$('#stand').on('click', function() {
  blackjack.stand()
});
$('#split').on('click', function() {
  blackjack.splitHand()
});
$('#rules').on('click', function() {
  $('#rulesList').toggle()
});
$('#rulesList').on('click', function() {
  $('#rulesList').toggle()
});
$('#mute').on('click', function() {
  if (mute) {
    mute = false;
    $('#mute').html("<button type=\"button\" class=\"mute btn btn-default btn-sm\">Mute Sounds</button>");
  } else {
    mute = true;
    $('#mute').html("<button type=\"button\" class=\"mute btn btn-default btn-sm\">Play Sounds</button>");
  }
  Mute();
});

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

// create a game instance
var blackjack = new Game();

// select view elements
var playerHandLabel = document.getElementById('playerHand');
var dealerHandLabel = document.getElementById('dealerHand');
var outcomeLabel = document.getElementById('outcome');
var scoreLabel = document.getElementById('score');

// load sounds
var ambience = new Audio("./sounds/118855__joedeshon__casino-ambiance-03.mp3");
var win = new Audio("./sounds/162192__monotraum__coins.mp3");
var lose = new Audio("./sounds/113988__kastenfrosch__verloren.mp3");

var mute = true;
Mute();



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

Hand.prototype.addCard = function(card) {
  this.hand.push(card);
}

Hand.prototype.getValue = function() {
  // Count aces as 1, if the hand has and ace,
  // then add 10 to value if it doesn't bust the hand
  var hand_value = 0;
  var hand_with_A = false;

  // Sum the cards and set the A flag to true
  for (var i = 0; i < this.hand.length; i++) {
    var rank = this.hand[i].getRank();
    hand_value += VALUES[rank];
    if (rank === 'A') {
      hand_with_A = true;
    }
  }

  // If hand without an A, return, else add 10 or keep the 1 value
  if (!hand_with_A) {
    return hand_value;
  } else {
    if (hand_value + 10 <= 21) {
      return hand_value + 10;
    } else {
      return hand_value;
    }
  }
}

Hand.prototype.printHand = function() {
  var hand_printout = "";
  if (this.hand.length > 4) {
    for (var i = 0; i < this.hand.length; i++) {
      hand_printout = hand_printout + "<img style=\"margin-left:-100px; z-index=500" + i + "\" src=\"img/" + this.hand[i].rank + this.hand[i].suit + ".jpg\">";
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
      hand_printout = hand_printout + "<img style=\"margin-left:-100px; z-index=500" + i + "\" src=\"img/XX.jpg\">";
    }
    hand_printout = hand_printout + "<img style=\"margin-left:-100px; z-index=500" + i + "\" src=\"img/" + this.hand[this.hand.length - 1].rank + this.hand[this.hand.length - 1].suit + ".jpg\">";
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

// Deal a card from the deck
Deck.prototype.dealCard = function() {
  var card_to_deal = this.deck.pop();
  return card_to_deal;
}

/**
 * The game object. Player wins if not busted and have a hand better than dealer.
 * Dealer wins if not busted and have a hand equal or better than player. Text feedback
 * and score are updated accordingly.
 */

function Game() {
  this.outcome = "";
  this.in_play = false;
  this.score = 2000;
  this.playing_deck = [];
  this.player_hand = [];
  this.dealer_hand = [];
};

Game.prototype.deal = function() {
  // player is not allowed to deal new cards in hand
  if (this.in_play) {
    this.outcome = "You have forfeited your hand.";
    this.score -= 100;
    this.in_play = false;
    lose.play();
  } else {
    this.outcome = " ";
  }

  // create instance of hands and deck, shuffle deck
  this.in_play = true;
  this.playing_deck = new Deck();
  this.player_hand = new Hand();
  this.dealer_hand = new Hand();
  this.playing_deck.shuffleDeck();

  // deal the first 2 cards for player and dealer
  var rounds_dealt = 0;
  while (rounds_dealt < 2) {
    this.player_hand.addCard(this.playing_deck.dealCard())
    this.dealer_hand.addCard(this.playing_deck.dealCard())
    rounds_dealt += 1;
  }

  if (this.dealer_hand.getValue() === 21) {
    this.outcome = "The dealer hits BlackJack, dealer wins. New Deal?";
    this.in_play = false;
    lose.play();
  } else {
    this.outcome = "Do you Hit or Stand?";
    // check if the hand is a pair and allow split
    if (this.player_hand.pairCheck()) {
      $('#split').css('visibility', 'visible');
      this.outcome = "Do you Hit, Split or Stand?";
    };
  }
  this.updateView();
}

Game.prototype.hit = function() {
  if (this.in_play) {
    // deal another card
    this.player_hand.addCard(this.playing_deck.dealCard())
      // If players hand value is over 21, player busts
    if (this.player_hand.getValue() > 21) {
      this.outcome = "You have busted (" + this.player_hand.getValue() + "), dealer wins. New Deal?";
      this.in_play = false;
      this.score -= 100;
      lose.play();
    } else {
      this.outcome = "New card dealt. Do you Hit or Stand?";
    }
  }
  this.updateView();
}

Game.prototype.stand = function() {
  if (this.in_play) {
    // dealer only draws when below 17 points
    while (this.dealer_hand.getValue() < 17) {
      this.dealer_hand.addCard(this.playing_deck.dealCard());
    }

    // if dealers hand value is over 21, dealer busts
    if (this.dealer_hand.getValue() > 21) {
      this.outcome = "Dealer have busted (" + this.dealer_hand.getValue() + "), you win (" + this.player_hand.getValue() + ")! New Deal?";
      this.score += 95;
      win.play();
      Mute();
      // else if dealer did not bust
    } else {
      // if dealers hand is equal or higher to players hand, dealer wins
      if (this.dealer_hand.getValue() >= this.player_hand.getValue()) {
        this.outcome = "Dealer (" + this.dealer_hand.getValue() + ") wins with your hand (" + this.player_hand.getValue() + "). New Deal?";
        this.score -= 100;
        lose.play();
        // else the player wins
      } else {
        this.outcome = "You (" + this.player_hand.getValue() + ") win with dealer's hand (" + this.dealer_hand.getValue() + ")! New Deal?";
        this.score += 95;
        win.play();
      }
    }
    this.in_play = false;
    this.updateView();

  }
}

Game.prototype.splitHand = function () {
  $('#split').css('visibility', 'hidden');
  console.log('dupa');

  // TODO Implement the hand split
};

Game.prototype.updateView = function() {
  playerHandLabel.innerHTML = this.player_hand.printHand();
  if (this.in_play) {
    dealerHandLabel.innerHTML = this.dealer_hand.printDealerHand();
  } else {
    dealerHandLabel.innerHTML = this.dealer_hand.printHand();
  }
  outcomeLabel.innerHTML = this.outcome;
  scoreLabel.innerHTML = this.score;
}

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
