'use strict';

import Modal from '/js/modal/modal.js';

var oddTrivia = [];
oddTrivia[0] = "The world’s oldest wooden wheel has been around for more than 5,000 years";
oddTrivia[1] = "Dead skin cells are a main ingredient in household dust";
oddTrivia[2] = "Sudan has more pyramids than any country in the world";
oddTrivia[3] = "The bumblebee bat is the world’s smallest mammal";
oddTrivia[4] = "The circulatory system is more than 60,000 miles long";
oddTrivia[5] = "There are parts of Africa in all four hemispheres";
oddTrivia[6] = "The cornea is one of only two parts of the human body without blood vessels";
oddTrivia[7] = "The world’s first animated feature film was made in Argentina";
oddTrivia[8] = "German chocolate cake was invented in Texas";
oddTrivia[9] = "The Philippines consists of 7,641 islands";

function myTrivia() {
  console.log('function called');
  var randomTrivia = Math.floor(Math.random()*(oddTrivia.length));
  console.log(randomTrivia);
  document.getElementById('triviaText').innerHTML = oddTrivia[randomTrivia];
}

const triviaText = document.createElement("p");
triviaText.style.backgroundColor = "var(--nord0)";
triviaText.style.padding = "20px";
triviaText.style.color = "var(--nord6)";
triviaText.style.borderRadius = "8px";
triviaText.id = "triviaText";

const eggModal = new Modal('easterEgg', triviaText);

document.getElementById("easterEggModalTint").style.backdropFilter = "blur(5px)";

var egg = new Egg("up,up,down,down,left,right,left,right,b,a", function() {
  myTrivia();
  eggModal.show();
}).listen();