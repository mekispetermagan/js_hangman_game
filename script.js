const doc = document;

const buttons = doc.getElementsByClassName("button");
const newButton = buttons[0];
newButton.onclick = function() {newRiddle()};
for (let i=1; i<buttons.length; i++) {
  buttons[i].onclick = function() {selectTopic(i)}
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const topics = ["movies", "countries", "cities"]
const maxErrors = 7;
var options = null;
var solution = null;
var maskedSolution = null;
var errors = 0;
var gameResult = null;

const riddleContainer = doc.getElementsByClassName("riddle")[0];
const errorsContainer = doc.getElementsByClassName("errors")[0];
const alphContainer = doc.getElementsByClassName("alphabet")[0];

generateAlphabet();
selectTopic(1)

// Pure function. Replaces every letter with underscore.
function mask(text) {
  var maskedText = "";
  for (var letter of solution) {
    if (alphabet.includes(letter)) {
      maskedText += "_";
    } else {
      maskedText += letter;
    }
  }
  return maskedText;
}

// Pure function. 
// - Checks the occurrences of letter in solution
// - Replaces them with the letter in maskedSolution
// - if there are no ucccurrences, sets errors to false
// - returns the modified maskedSolution and errors variables 
function checkLetter(letter, solution, maskedSolution) {
  letter = letter.toUpperCase();
  var newMasked = "";
  var error = true;
  for (let i=0; i<solution.length; i++) {
    if (letter == solution[i]) {
      newMasked += letter;
      error = false;
    } else {
      newMasked += maskedSolution[i];
    }
  }
  return [newMasked, error];
}

// Pure function.
// Chooses a random element from a list
function choose(options) {
  var i = Math.floor(Math.random() * options.length);
  return options[i];
}

// Impure function.
// Gets called when a lettercard is clicked.
// - Hides the lettercard
// - Calls the checkLetter function
// - Displays the game state
function letterChoice(card) {
  card.style.visibility = "hidden";
  guess = card.innerHTML;
  checkResult = 
  checkResult = checkLetter(guess, solution, maskedSolution);
  maskedSolution = checkResult[0];
  errors += checkResult[1];   
  checkGameEnd();
  displayGameState();
}

// Impure function.
// Checks if the game has ended either with a win or with a lose.
// Hides all lettercards.
function checkGameEnd() {
  if (maskedSolution == solution) {
    gameResult = "win";
  } else if (errors == maxErrors) {
    gameResult = "lose";
  }
  if (gameResult != null) {
    for (var card of alphContainer.children) {
      card.style.visibility = "hidden";
    }
  }
}

// Impure function. 
// Creates lettercards for each letter in the alphabet
// Puts them in their container
function generateAlphabet() {
  for (var letter of alphabet) {
    const newCard = doc.createElement("div");
    newCard.className = "lettercard";
    newCard.innerHTML = letter;
    newCard.onclick = function() {letterChoice(newCard)};
    alphContainer.appendChild(newCard);
  }
}

// Impure function.
// Displayes the masked solution and the errors in their containers.
function displayGameState() {
  if (gameResult == "win") {
    riddleContainer.innerHTML = maskedSolution + " :)";
  } else if (gameResult == "lose") {
    riddleContainer.innerHTML = solution + " :(";
  } else {
    riddleContainer.innerHTML = maskedSolution;
  }
  errorsContainer.innerHTML = "Errors: " + errors;
  var red = 60 + errors *15;
  errorsContainer.style.backgroundColor = "rgb(" + red + ", 30, 30)";
}

// Impure function.
// - Chooses a solution randomly from the list of options
// - Masks it
// - Displays the game state
// - Sets errors to 0
// - Unhides all lettercards
function newRiddle () {
  solution = choose(options).toUpperCase();
  maskedSolution = mask(solution);
  errors = 0;
  gameResult = null;
  displayGameState();
  for (var card of alphContainer.children) {
    card.style.visibility = "visible";
  }
}

// Impure function.
// Splits the topic file's content into the list of options
// Calls newRiddle to choose from the list
function reqListener () {
  options = this.responseText.split("\n");
  newRiddle();
}

// Impure function.
// Called when a topic button is clicked (and when the game initiates).
// - Loads the topic's options from the server
// - Forwards it to reqListener
// - Highlights the buttton of the new topic, unhighlights the rest
function selectTopic(buttonIndex) {
  topic = topics[buttonIndex-1];
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", topic+".txt");
  oReq.send();
  for (let i=1;i<buttons.length; i++) {
    if (i == buttonIndex) {
      buttons[i].style.backgroundColor = "rgb(30, 180, 30";
    } else {
      buttons[i].style.backgroundColor = "rgb(30, 120, 30)" ;
    }
  }
}
