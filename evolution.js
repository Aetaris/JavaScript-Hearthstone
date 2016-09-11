var cardLists = require('./cardlists.js');
var heroes = require('./heroes.js');
var printer = require('./printer.js'); //for outputing file with key, deck, and match history
var game = require('./game.js');

// 'Databases' array includes "links" to the text files, but not the actual information.

var database = [];

var getKey = function(deck, deckClass) {
    var keyString = "";
    // var cards = deckClass.cardList;
    
    // for(i = 0; i < cardLists.neutral.length; i++) {
        // cards.push(cardLists.neutral[i]);
    // }
    
    var classLetter = deckClass.name[0];
    if(deckClass.name === "Warlock") {
        classLetter = "K";
    }
    
    if(deckClass.name === "Paladin") {
        classLetter = "L";
    }
    
    for(var i = 0; i < deck.length; i++) {
        // It finds every card in the deck, in order. Then it finds them in the cards array.
        var index = false;
        for(var x = 0; x < cardLists.neutral.length; x++) {
            if(cardLists.neutral[x]().name === deck[i].name) {
                keyString = keyString + "N" + x + "-";
                index = x;
            }
        }
        if(!index) {
            var isClass = false;
            for(var y = 0; y < deckClass.cardList.length; y++) {
                if(deckClass.cardList[y]().name === deck[i].name) {
                    keyString = keyString + classLetter + y + "-";
                    isClass = false;
                }
            }
            // if(index >= deckClass.cardList.length) {
            //     keyString = keyString + "N";
            // }
            // if(index < deckClass.cardList.length) {
            //     keyString = keyString + classLetter;
            // }
            
        keyString = keyString;
        }
        // if(!index && !isClass) {
        //     console.log("!!!");
        // }
    }
    
    keyString = keyString.slice(0, -1); //the slice is for the last tilda
    return keyString;
};

var makeRandomDeck = function(deckClass) {
    // deckClass will be an object from heroes.js
    
    var deckList = [];
    var c = deckClass.cardList;
    
    for(var i = 0; i < deckClass.cardList; i++) {
        c.push(deckClass.cardList[i]);
        c.push(deckClass.cardList[i]);
        c.push(deckClass.cardList[i]);
    }
    
    for(i = 0; i < cardLists.neutral.length; i++) {
        c.push(cardLists.neutral[i]);
    }
    
    for(i = 0; i < 30; i++) {
        var randomNum = Math.floor(Math.random(0, 1) * c.length);
        var randomCard = c[randomNum]();
        deckList.push(randomCard);
    }
    
    for(i = 0; i < deckList.length; i++) {
        console.log(deckList[i].name);
    }
    console.log("---");
    
    return {
        list: deckList,
        deckClass: deckClass
        
    };
};

var makeFile = function (key) { 
    printer.overprint("", "/home/ubuntu/workspace/Deck_Database/" + key + ".deck"); 
    console.log("Key: " + key); 
    return "/home/ubuntu/workspace/Deck_Database/" + key + ".deck";
}; //creates a file with the name of the key

var populateFile = function(deck) {
    var key = getKey(deck.list, deck.deckClass);
    var fileName = makeFile(key);
    for(var i = 0; i < deck.list.length; i++) {
        printer.print(deck.list[i].name, fileName);
    }
    return key;
}; //fill the file with the card names

var makeDeckFromKey = function(key) {
    var cards = key.split("-");
    var deck = [];
    for(var i = 0; i < cards.length; i++) {
        // console.log(deckCards);
        var classLetter = cards[i][0];
        var deckClass;
        var cardClass;
        if(classLetter === "N") { //find the class of the card
            cardClass = "Neutral";
        }
        else if(classLetter === "M") {
            cardClass = heroes.mage;
        }
        else if(classLetter === "D") {
            cardClass = heroes.druid;
        }
        else if(classLetter === "H") {
            cardClass = heroes.hunter;
        }
        else if(classLetter === "L") {
            cardClass = heroes.paladin;
        }
        else if(classLetter === "P") {
            cardClass = heroes.priest;
        }
        else if(classLetter === "R") {
            cardClass = heroes.rogue;
        }
        else if(classLetter === "W") {
            cardClass = heroes.warrior;
        }
        else if(classLetter === "S") {
            cardClass = heroes.shaman;
        }
        else if(classLetter === "K") {
            cardClass = heroes.warlock;
        }
        else {
            throw new Error("Error! Key includes nonexistant class.")
        }
        
        if(cardClass !== "Neutral") {
            deckClass = cardClass;
            var cardList = cardClass().cardList;
        }
        else {
            cardList = cardLists.neutral;
        }
        
        var num = cards[i].slice(1); //gets just the number of the card
        var card = cardList[num]();
        deck.push(card);
    }
    return {list: deck, deckClass: deckClass()};
};

var mutate = function (deck, num) {
    var c = deck.deckClass.cardList;
    
    for(var i = 0; i < deck.deckClass.cardList; i++) {
        c.push(deck.deckClass.cardList[i]);
        c.push(deck.deckClass.cardList[i]);
        c.push(deck.deckClass.cardList[i]);
    }
    
    for(i = 0; i < cardLists.neutral.length; i++) {
        c.push(cardLists.neutral[i]);
    }
    
    for(var i = 0; i < num; i++) {
        var randomNum = Math.floor(Math.random(0, 1) * deck.list.length);
        var randCardNum = Math.floor(Math.random(0, 1) * c.length);
        var randCard = c[randCardNum]();
        console.log("Mutation: Removed " + deck.list[randomNum].name + ", added " + randCard.name);
        deck.list.splice(randomNum, 1, randCard);
    }
    return populateFile(deck);
};

var simulate = function(deckNum, gameNum) {
    var gamesRun = 0;
    for(var i = 0; i < deckNum; i++) {
        database.push(makeRandomDeck(heroes.warlock()));
    }
    while(gamesRun < gameNum) {
        for(i = 0; i < database.length; i++) {
            for(var x = 0; x < database.length; x++) {
                if(database[i] !== database[x]) {
                    var result = game.runGame(database[0].deckClass, database[0].list, database[1].deckClass, database[1].list);
                    if(result === "red") {
                        printer.shred(getKey(database[0]));
                        
                    }
                    if(result === "blue") {
                        printer.shred(getKey(database[1]));
                    }
                }
            }
        }
    }
};

// var deck = makeRandomDeck(heroes.druid());
// var key = populateFile(deck);
// deck = makeDeckFromKey(key);
// mutate(deck, 2);

simulate(2, 1);