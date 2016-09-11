var game = require('./game.js');
var cardLists = require('./cardlists.js');
var heroes = require('./heroes.js');
var decks = require('./decks.js');
var printer = require('./printertesting.js');

var lifeforms = [];
var bestLifeform = false;
var worstLifeform = false;
var interval;
var a = 0;

var trial = function(lifeform, hero) {
    lifeform.winRate = 0;
    for(var c = 0; c < heroes.HeroList.length; c++) {
        for(var g = 0; g < 1; g++) {
            var result = game.runGame(hero(), lifeform.deck, heroes.HeroList[c](), heroes.HeroList[c]().deck);
            if(result === "red") {
                lifeform.winRate += 1;
            }
        }
    }
    if(lifeform.winRate > lifeform.bestWinRate) {
        lifeform.bestWinRate = lifeform.winRate;
        lifeform.bestDeck = lifeform.deck;
    }
};

var mutate = function(lifeform, hero) {
    var randomNum = false;
    var isDuplicate = false;
    while(!randomNum || isDuplicate) {
        randomNum = Math.floor((cardLists.neutral.length + hero().cardList.length) * Math.random(0, 1));
        var duplicatesNum = 0;
        isDuplicate = 0;
        var random = Math.floor(30 * Math.random(0, 1));
        if(randomNum < cardLists.neutral.length) {
            for(var i = 0; i < lifeform.deck.length; i++) {
                if(lifeform.deck[i] === cardLists.neutral[randomNum]()) {
                    duplicatesNum += 1;
                }
            }
            if(duplicatesNum < 2) {
                lifeform.deck.splice(lifeform.deck.indexOf(lifeform.deck[random]), 1);
                lifeform.deck.push(cardLists.neutral[randomNum]());
                printer.print("[Evolution] - " + cardLists.neutral[randomNum]().name);
                isDuplicate = false;
            }
            if(duplicatesNum >= 2) {
                isDuplicate = true;
            }
        }
        if(randomNum >= cardLists.neutral.length) {
            for(i = 0; i < lifeform.deck.length; i++) {
                if(lifeform.deck[i] === hero().cardList[randomNum - cardLists.neutral.length]()) {
                    duplicatesNum += 1;
                }
            }
            if(duplicatesNum < 2) {
                lifeform.deck.splice(lifeform.deck.indexOf(lifeform.deck[random]), 1);
                lifeform.deck.push(hero().cardList[randomNum - cardLists.neutral.length]());
                printer.print("[Evolution] - " + hero().cardList[randomNum - cardLists.neutral.length]().name);
                isDuplicate = false;
            }
            if(duplicatesNum >= 2) {
                isDuplicate = true;
            }
        }
        duplicatesNum = 0;
    }
};

var endEvolution = function() {
    printer.print("BEST LIFEFORM DETERMINED. Printing deck.");
    for(var f = 0; f < bestLifeform.deck.length; f++) {
        printer.print(bestLifeform.deck[f].name);
    }
};

var evolve = function(hero) {
    if(a <= 10) {
        for(var b = 0; b < lifeforms.length; b++) {
            trial(lifeforms[b], hero);
        }
        bestLifeform = false;
        worstLifeform = false;
        for(var d = 0; d < lifeforms.length; d++) {
            if(lifeforms[d].winRate < worstLifeform.winRate || !worstLifeform) {
                worstLifeform = lifeforms[d];
            }
            if(lifeforms[d].winRate > bestLifeform.winRate || !bestLifeform) {
                bestLifeform = lifeforms[d];
            }
        }
        worstLifeform = bestLifeform;
        for(var h = 0; h < lifeforms.length; h++) {
            mutate(lifeforms[h], hero);
        }
        printer.print("");
        for(var k = 0; k < lifeforms.length; k++) {
            if(lifeforms[k].bestWinRate < lifeforms[k].winRate) {
                lifeforms[k].winRate = lifeforms[k].bestWinRate;
                lifeforms[k].deck = lifeforms[k].bestDeck;
            }
        }
        bestLifeform = lifeforms[0];
        for(var e = 0; e < lifeforms.length; e++) {
            if(lifeforms[e].winRate >= bestLifeform.winRate) {
                bestLifeform = lifeforms[e];
            }
        }
        a++;
        return;
    }
    clearInterval(interval);
    endEvolution();
};

var evolution = module.exports.evolution = function(num) {
    var lifeform = function() {
        return {
            winRate: 0,
            deck: decks.basicDeck(),
            latestMutation: false,
            bestWinRate: 0,
            bestDeck: decks.basicDeck()
        };
    };
    lifeforms = [];
    for(var i = 0; i <= num; i++) {
        lifeforms.push(lifeform());
    }
    var hero = false;
    for(i = 0; i < heroes.HeroList.length; i++) {
        hero = heroes.HeroList[i];
        evolve(hero);
    }
};

//evolution(heroes.mage, decks.basicMage, 5);

var testDecks = function(num) {
    var results = {
        mage: 0,
        warrior: 0,
        rogue: 0,
        shaman: 0,
        hunter: 0,
        druid: 0,
        warlock: 0,
        paladin: 0,
        priest: 0
    };
    for(var i = 0; i < num; i++) {
        for(var l = 0; l < heroes.HeroList.length; l++) {
            for(var x = 0; x < heroes.HeroList.length; x++) {
                var result = game.runGame(heroes.HeroList[x](), heroes.HeroList[x]().deck, heroes.HeroList[l](), heroes.HeroList[l]().deck);
                if(result === "blue") {
                    if(heroes.HeroList[l]().name === "Mage") {
                        results.mage += 1;
                    }
                    if(heroes.HeroList[l]().name === "Warrior") {
                        results.warrior += 1;
                    }
                    if(heroes.HeroList[l]().name === "Rogue") {
                        results.rogue += 1;
                    }
                    if(heroes.HeroList[l]().name === "Shaman") {
                        results.shaman += 1;
                    }
                    if(heroes.HeroList[l]().name === "Hunter") {
                        results.hunter += 1;
                    }
                    if(heroes.HeroList[l]().name === "Druid") {
                        results.druid += 1;
                    }
                    if(heroes.HeroList[l]().name === "Warlock") {
                        results.warlock += 1;
                    }
                    if(heroes.HeroList[l]().name === "Paladin") {
                        results.paladin += 1;
                    }
                    if(heroes.HeroList[l]().name === "Priest") {
                        results.priest += 1;
                    }
                }
            }
        }
    }
    printer.print("Test complete! Printing results.");
    printer.print("Mage: " + results.mage);
    printer.print("Warrior: " + results.warrior);
    printer.print("Rogue: " + results.rogue);
    printer.print("Shaman: " + results.shaman);
    printer.print("Hunter: " + results.hunter);
    printer.print("Druid: " + results.druid);
    printer.print("Warlock: " + results.warlock);
    printer.print("Paladin: " + results.paladin);
    printer.print("Priest: " + results.priest);
    endEvolution();
};

// testDecks(1);
evolution(3);