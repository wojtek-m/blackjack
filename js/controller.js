
/*
  Blackjack game - controller.
*/


// create a game instance
var blackjack = new Game();
// create a controller instance
var ctrl = new Controller();

// select view elements
var currentBetLabel = document.getElementById('currentBet');
var playerHandLabel = document.getElementById('playerHand');
var dealerHandLabel = document.getElementById('dealerHand');
var outcomeLabel = document.getElementById('outcome');
var scoreLabel = document.getElementById('score');
var splitHandOneLabel = document.getElementById('splitHandOne');
var splitHandTwoLabel = document.getElementById('splitHandTwo');
var playerHandValueLabel = document.getElementById('playerHandValue');
var dealerHandValueLabel = document.getElementById('dealerHandValue');

// load sounds
var ambience = new Audio("./sounds/118855__joedeshon__casino-ambiance-03.mp3");
var win = new Audio("./sounds/162192__monotraum__coins.mp3");
var lose = new Audio("./sounds/113988__kastenfrosch__verloren.mp3");

var mute = false;
Mute();


// jQuery
$('#deal').on('click', function() {
  blackjack.deal()
});
$('#double').on('click', function() {
  blackjack.doubleBet();
  blackjack.hit('playerHand');
  blackjack.stand();
});
$('#hit').on('click', function() {
  blackjack.hit('playerHand')
});
$('#hitSplitOne').on('click', function() {
  blackjack.hit('splitHandOne')
});
$('#hitSplitTwo').on('click', function() {
  blackjack.hit('splitHandTwo')
});
$('#stand').on('click', function() {
  blackjack.stand()
});
$('#splitHand').on('click', function() {
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

/*
* Controller Object
*/
function Controller() {

/*
* Update the view
*/
Controller.prototype.updateView = function() {
  // display player hand/hands
  playerHandLabel.innerHTML = blackjack.playerHand.printHand();
  splitHandOneLabel.innerHTML = blackjack.splitHandOne.printHand();
  splitHandTwoLabel.innerHTML = blackjack.splitHandTwo.printHand();
  // hide one dealer card if hand still in play
  if (blackjack.inPlay) {
    dealerHandLabel.innerHTML = blackjack.dealerHand.printDealerHand();
  } else {
    dealerHandLabel.innerHTML = blackjack.dealerHand.printHand();
  }
  outcomeLabel.innerHTML = blackjack.outcome.feedback;
  $('#outcome').css('background-color', blackjack.outcome.colour);
  scoreLabel.innerHTML = blackjack.score;
  currentBetLabel.innerHTML = blackjack.bet;
  // display hand values
  if (blackjack.handIsSplit) {
    playerHandValueLabel.innerHTML = 'First: ' + blackjack.splitHandOne.getValue() + ', Second: ' + blackjack.splitHandTwo.getValue();
  } else {
    playerHandValueLabel.innerHTML = blackjack.playerHand.getValue();
  }
  // reset dealer hand value and only display it when hand not in play
  dealerHandValueLabel.innerHTML = '';
  if (!blackjack.inPlay) {
    dealerHandValueLabel.innerHTML = blackjack.dealerHand.getValue();
  }
}

/*
* Show and hide UI elements with jQuery. Takes two arguments:
* show - array of elements (ID's) to show,
* hide - array of elements to hide.
*/
Controller.prototype.toggleUI = function (show, hide) {
  show.forEach(function(currentValue, index) {
    $(currentValue).removeClass('hide');
  });
  hide.forEach(function(currentValue, index) {
    $(currentValue).addClass('hide');
  });
};

}

var loseColour = 'rgb(214, 46, 46)';
var winColour = 'rgb(57, 156, 37)';
var neutralColour = 'rgb(96, 62, 27)';

var textFeedback = {
  busted1 : {
    feedback : "You have BUSTED your hand, dealer wins. New Deal?",
    class: 'lose',
    colour: loseColour
  },
  doubleLoose1 : {
    feedback : "You loose with both your hands... New Deal?",
    class: 'lose',
    colour: loseColour
  },
  doubleWin1 : {
    feedback : "You win with both hands!. New Deal?",
    class: 'win',
    colour: winColour
  },
  hitOrStand1 : {
    feedback : "Do you Hit or Stand?",
    class: 'neutral',
    colour: neutralColour
  },
  newCard1 : {
    feedback : "New card dealt. Do you Hit or Stand?",
    class: 'neutral',
    colour: neutralColour
  },
  win1 : {
    feedback : "You win with dealer's hand! New Deal?",
    class : 'win',
    colour: winColour
  },
  win2 : {
    feedback : "Dealer have busted, you win! New Deal?",
    class : 'win',
    colour: winColour
  },
  lose1 : {
    feedback : "You loose. New Deal?",
    class : 'lose',
    colour: loseColour
  },
  loseBlackjack1 : {
    feedback : "The dealer hits BlackJack, dealer wins. New Deal?",
    class : 'lose',
    colour: loseColour
  },
  loseForfeit1 : {
    feedback : "You have forfeited your hand.",
    class : 'lose',
    colour: loseColour
  },
  split1 : {
    feedback : "Do you Hit, Split or Stand?",
    class : 'neutral',
    colour: neutralColour
  },
  tie1 : {
    feedback : "Dealer looses with one of your hands. New Deal?",
    class : 'neutral',
    colour: neutralColour
  }
};
