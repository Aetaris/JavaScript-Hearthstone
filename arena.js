var printer = require('./arenaprinter.js');
var game = require('./game.js');
var heroes = require('./heroes.js');
var lists = require('./cardlists.js');
var utilities = require('./utilities.js');

printer.kill("drafts.txt");

var getDraft = module.exports.draft = function() {

    var hero = {};
    
    printer.print("CHOOSING ARENA CLASS.");
    printer.print("");
    var heroList = heroes.HeroList;
    var choices = [];
    printer.print("Choices:");
    
    
    
    
    var num1 = Math.floor(Math.random(0, 1) * heroList.length);
    choices.push(heroList[num1]());
    printer.print("- " + heroList[num1]().name);
    var num2 = num1;
    while(num2 === num1) {
        num2 = Math.floor(Math.random(0, 1) * heroList.length);
    }
    choices.push(heroList[num2]());
    printer.print("- " + heroList[num2]().name);
    var num3 = num2;
    while(num3 === num1 || num3 === num2) {
        num3 = Math.floor(Math.random(0, 1) * heroList.length);
    }
    choices.push(heroList[num3]());
    printer.print("- " + heroList[num3]().name);
    
    
    
    // for(var i = 0; i < 3; i++) {
    //     var isCopy = true;
    //     while(isCopy) {
    //         isCopy = false;
    //         var num = Math.floor(Math.random(0, 1) * heroList.length);
    //         for(var z = 0; z < choices.length; z++) {
    //             if(heroList[num]() === choices[z]) {
    //                 isCopy = true;
    //             }
    //         }
    //     }
    //     choices.push(heroList[num]());
    //     printer.print("- " + heroList[num]().name);
    // }
    
    var bestRating = 10;
    for(var z = 0; z < choices.length; z++) {
        if(choices[z].tier && choices[z].tier < bestRating) {
            var choice = choices[z];
            bestRating = choice.tier;
        }
    }
    
    // var choiceNum = Math.floor(Math.random(0, 1) * choices.length);
    // var choice = choices[choiceNum];
    hero["hero"] = choice;
    hero["deck"] = [];
    printer.print("");
    printer.print("Class Chosen: " + choice.name);
    printer.print("");
    
    // Makes a pool of all neutral & class cards.
    
    var pool = [];
    for(var i = 0; i < lists.neutral.length; i++) {
        if(!lists.neutral[i]().cult) {
            pool.push(lists.neutral[i]());
        }
    }
    for(i = 0; i < choice.cardList.length; i++) {
        for(x = 0; x < 3; x++) {
            if(!choice.cardList[x]) {
                console.log(choice.cardList + " | " + x);
            }
            if(!choice.cardList[x]().cult) {
                pool.push(choice.cardList[i]());
            }
        }
    }
    utilities.shuffle(pool);
    
    for(i = 0; i < 30; i++) {
        var rarity = false;
        if(i === 1 || i === 10 || i === 20 || i === 30) {
            var rarityRoll = Math.random(0, 1) * 100;
            if(rarityRoll < 83) {
                rarity = "Rare";
            }
            else if(rarityRoll < 98) {
                rarity = "Epic";
            }
            else if(rarityRoll >= 98) {
                rarity = "Legendary";
            }
        }
        else {
            rarityRoll = Math.random(0, 1) * 100;
            if(rarityRoll < 82.75) {
                rarity = "Common";
            }
            else if(rarityRoll < 97.75) {
                rarity = "Rare";
            }
            else if(rarityRoll < 99.75) {
                rarity = "Epic";
            }
            else if(rarityRoll > 99.75) {
                rarity = "Legendary";
            }
        }
        printer.print("Card choice: " + rarity);
        
        // With a rarity decided, it makes a pool of valid cards.
        
        var validPool = [];
        for(var x = 0; x < pool.length; x++) {
            if(pool[x].rarity === rarity || (pool[x].rarity === "Basic" && rarity === "Common")) {
                validPool.push(pool[x]);
            }
        }
        utilities.shuffle(validPool);
        
        // It has a pool of valid cards! Now it presents them.
        
        var cardChoices = [];
        printer.print("Choices:");
        
        var num1 = Math.floor(Math.random(0, 1) * validPool.length);
        cardChoices.push(validPool[num1]);
        printer.print("- " + validPool[num1].name);
        var num2 = num1;
        while(num2 === num1) {
            num2 = Math.floor(Math.random(0, 1) * validPool.length);
        }
        cardChoices.push(validPool[num2]);
        printer.print("- " + validPool[num2].name);
        var num3 = num2;
        while(num3 === num1 || num3 === num2) {
            num3 = Math.floor(Math.random(0, 1) * validPool.length);
        }
        cardChoices.push(validPool[num3]);
        printer.print("- " + validPool[num3].name);
        
        // for(var y = 0; y < 3; y++) {
        //     var isCopy = true;
        //     while(isCopy) {
        //         isCopy = false;
        //         num = Math.floor(Math.random(0, 1) * validPool.length);
        //         for(z = 0; z < cardChoices.length; z++) {
        //             if(validPool[num] === cardChoices[z]) {
        //                 isCopy = true;
        //             }
        //         }
        //     }
        //     cardChoices.push(validPool[num]);
        //     printer.print("- " + validPool[num].name);
        // }
        
        var bestRating = 0;
        for(z = 0; z < cardChoices.length; z++) {
            if(cardChoices[z].tier && cardChoices[z].tier > bestRating) {
                var tempCardChoice = cardChoices[z];
                bestRating = tempCardChoice.tier;
            }
        }
        
        hero["deck"].push(tempCardChoice);
        printer.print("");
        printer.print("Card Chosen: " + tempCardChoice.name);
        printer.print("");
    }
    
    printer.print("Deck complete (" + hero.deck.length + "/30). Listing cards:");
    printer.print("");
    
    var copies = [];
    
    for(i = 0; i < hero.deck.length; i++) {
        var isDuplicate = false;
        for(x = 0; x < copies.length; x++) {
            if(copies[x].name === hero.deck[i].name) {
                copies[x].num++;
                isDuplicate = true;
            }
        }
        if(!isDuplicate) {
            copies.push({name: hero.deck[i].name, num: 1, cost: hero.deck[i].cost});
        }
    }
    
    // Now that we have a list of duplicates n' such, we list the cards.
    
    for(i = 0; i < copies.length; i++) {
        printer.print("- " + copies[i].num + "x " + copies[i].name);
    }
    printer.print("");
    return hero;
};

var duel = function(hero1, hero2) {
    return game.runGame(hero1.hero, hero1.deck, hero2.hero, hero2.deck);
};

duel(getDraft(), getDraft());

// Creates a ton of decks
// Stores them in "Arena Pool" array
// Gives then "wins" and "losses" variables
// Use "duel" within the arena simulation
// Goes through every deck. Duels. Repeats until they reach 12 wins or 3 losses, at which point they leave the array.

var simulate = module.exports.simulate = function(deckNum) {
    var arenaPool = [];
    
    for(var i = 0; i < deckNum; i++) {
        var draft = getDraft();
        var deck = {deck: draft.deck, hero: draft.hero, wins: 0, losses: 0};
        arenaPool.push(deck);
    }
    
    for(i = 0; i < arenaPool.length; i++) {
        if(arenaPool[i]) {
            // We get a list of valid opponents
            var validOpponent;
            var foundMatch = false;
            for(var x = 0; x < arenaPool.length; x++) {
                if(arenaPool[x].wins === arenaPool[i].wins && arenaPool[x].losses === arenaPool[i].losses && !foundMatch) {
                    validOpponent = arenaPool[x];
                    foundMatch = true;
                }
            }
            if(validOpponent) {
                var results = duel(arenaPool[i], validOpponent);
                if(results === "red") {
                    arenaPool[i].wins++;
                    validOpponent.losses++;
                }
                else if(results === "blue") {
                    validOpponent.wins++;
                    arenaPool[i].losses++;
                }
                
                if(arenaPool[i].wins >= 12) {
                    printer.print("12 wins reached! Final score: " + arenaPool[i].wins + "-" + arenaPool[i].losses);
                    arenaPool.splice(i, 1);
                }
                if(arenaPool[i].losses >= 3) {
                    printer.print("3 losses reached! Final score: " + arenaPool[i].wins + "-" + arenaPool[i].losses);
                    arenaPool.splice(i, 1);
                }
                if(validOpponent.wins >= 12) {
                    printer.print("Opponent reached 12 wins.");
                    arenaPool.splice(x, 1);
                }
                if(validOpponent.losses >= 3) {
                    printer.print("Opponent reached 3 losses.");
                    arenaPool.splice(x, 1);
                }
            }
        }
    }
};

// simulate(15);