import { wordList as words , guessList as guess } from './data.js';
let guessList = guess;
let wordList = words;

var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0; //current guess (attempt #)
var col = 0; //current letter for that attempt
var gameOver = false;

guessList = guessList.concat(wordList);

var word = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
/* console.log(word); */

//Onload Function
window.onload = function(){
    intialize();
}

//Intialization Function
function intialize(){

    //Create Game Board
    const gameBoard = document.getElementById("board");
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.id = r.toString() + "-" + c.toString();
            square.innerText = "";
            gameBoard.appendChild(square);
        }
    }

    //Create Keyboard
    const keyboardContainer = document.getElementById("keyboard-container");

    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        [" ","A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let key = currRow[j];
            let keyTile = document.createElement("div");
            if(key == " "){
                keyTile = document.createElement("div");
                keyTile.classList.add("spacer-half");
            }
            else if(key == "Enter"){
                keyTile.classList.add("wide-button");
                keyTile.classList.add("button");
                keyTile.id = "Enter";
                keyTile.innerText = key;
            }
            else if(key == "⌫"){
                keyTile.classList.add("wide-button");
                keyTile.classList.add("button");
                keyTile.id = "Backspace";
                keyTile.innerText = key;
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.classList.add("button");
                keyTile.id = "Key" + key;
                keyTile.innerText = key;
            } 

            keyTile.addEventListener("click", processKey);
            keyboardRow.appendChild(keyTile);
        }
        keyboardContainer.appendChild(keyboardRow);
    }

    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

//Process key
function processKey() {
    let e = { "code" : this.id };
    processInput(e);
}

//Process The Input
function processInput(e){
    //Pressed Alphabet
    if ("KeyA" <= e.code && e.code <= "KeyZ"){
        if (col < width){
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    //Pressed Backspace
    else if (e.code == "Backspace"){
        if (0 < col && col <= width) {
            col -=1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    }
    //Pressed Enter
    else if (e.code == "Enter") {
        update();
    }
    //Game Over Last Attempt
    if (!gameOver && row == height) {
        var alertElem = document.getElementsByClassName("alerts");
        console.log(alertElem);
        alertElem[0].id="true-alerts";
        alertElem[0].innerText = "Correct Word :  " + word;
    }
}
//Update Function
function update(){
    var alertElem = document.getElementsByClassName("alerts");
    if(alertElem[0].id == "true-alerts"){
        alertElem[0].removeAttribute('id');
    }
    let guess = "";
    
    //string up the guesses into the word
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase(); //case sensitive
    /* console.log(guess); */
    if (!guessList.includes(guess)) {
        alertElem[0].id="true-alerts";
        alertElem[0].innerText = "Invalid Word";
        return;
    }

    //Start Processing Guess
    let correct = 0;
    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    //first iteration, check all the correct ones first
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;  
        
        if (word[c] == letter) {
            currTile.classList.add("correct-pos");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.add("correct-pos");

            correct += 1;
            letterCount[letter] -= 1; //deduct the letter count
        }
        if (correct == width) {
            gameOver = true;
        }
    }
    //go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // skip the letter if it has been marked correct
        if (!currTile.classList.contains("correct-pos")){
            //Is it in the word?         //make sure we don't double count
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct-pos")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } // Not in the word or (was in word but letters all used up to avoid overcount)
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent")
            }
        }
    }
    row += 1; //start new row
    col = 0; //start at 0 for new row
}