
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

// load sounds
var ambience = new Audio("./sounds/118855__joedeshon__casino-ambiance-03.mp3");
var win = new Audio("./sounds/162192__monotraum__coins.mp3");
var lose = new Audio("./sounds/113988__kastenfrosch__verloren.mp3");

var mute = true;
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
  playerHandLabel.innerHTML = blackjack.playerHand.printHand();
  splitHandOneLabel.innerHTML = blackjack.splitHandOne.printHand();
  splitHandTwoLabel.innerHTML = blackjack.splitHandTwo.printHand();
  if (blackjack.inPlay) {
    dealerHandLabel.innerHTML = blackjack.dealerHand.printDealerHand();
  } else {
    dealerHandLabel.innerHTML = blackjack.dealerHand.printHand();
  }
  outcomeLabel.innerHTML = blackjack.outcome;
  scoreLabel.innerHTML = blackjack.score;
  currentBetLabel.innerHTML = blackjack.bet;
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
