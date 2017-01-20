var cardLists = require('./cardlists.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js');
var heroes = require('./heroes.js');
var setup = require('./setup.js');

var game = require('./game.js');

var instancesOf = function(item, array) {
    var num = 0;
    for(var i in array) {
        if(array[i].card == item.card) {
            num++;
        }
    }
    return num;
};

var makeFile = function (id) { 
    printer.overprint("", "/home/ubuntu/workspace/Deck_Database/" + id + ".deck"); 
    console.log("Key: " + id); 
    return "/home/ubuntu/workspace/Deck_Database/" + id + ".deck";
}; //creates a file with the name of the key

var getAllStandard = function() {
    var array = [];
    var sets = cardLists.standardSets();
    for(var i in sets) {
        var a = cardLists.setCards(sets[i]);
        for(var j in a) {
            array.push(a[j]);
        }
    }
    return array;
};

var alphabetize = function(deck) {
    function compare(a,b) {
        if (a.cost < b.cost)
            return -1;
        if (a.cost > b.cost)
            return 1;
        if(a.name < b.name)
            return -1;
        if(a.name > b.name)
            return 1;
        return 0;
    }
    deck.sort(compare);
};
    
var determinePossible = function(array) { // Determines the maximum size of a legal deck using the array
    var allPossible = [];
    for(var i in array) {
        if(typeof array[i] == "function") {
            array[i] = array[i]();
        }
        if(instancesOf(array[i], allPossible) < 2 || (instancesOf(array[i], allPossible) < 1 && array[i].rarity == "Legendary")) {
            allPossible.push(array[i]);
            if(array[i].rarity != "Legendary") {
                allPossible.push(array[i]);
            }
        }
    }
    return allPossible.length;
};

var build = module.exports.build = function(className, templateNum, deckSize) {
    if(!templateNum) {
        templateNum = 0;
    }
    if(!deckSize) {
        deckSize = 30;
    }
    var allCards = cardLists.allCards(true);
    var valid = [];
    
    if(templateNum==4) {
        allCards = getAllStandard();
    }
    if(templateNum==1 || templateNum==3 || templateNum==4) {
        allCards = utilities.filterArray.hasClass(allCards, className);
        var classCards = cardLists.classCards(className, 3);
        for(var i in classCards) {
            allCards.push(classCards[i]);
        }
    }
    
    for(var i in allCards) {
        valid.push(allCards[i]);
    }
    
    // Now it has a valid array, so we add cards
    // First we count all possible cards from valid array, 2 for all but Legendaries
    
    var possibleSize = determinePossible(valid);
    
    if(possibleSize >= deckSize) {
        var deck = [];
        while(deck.length < deckSize) {
            var card = valid[Math.floor(Math.random() * valid.length)];
            if(typeof card == "function") {
            card = card();
        }
            if(templateNum != 0) {
                if((instancesOf(card, deck) < 2 && card.rarity != "Legendary") || (instancesOf(card, deck) < 1 && card.rarity == "Legendary")) {
                    deck.push(card);
                }
            } else {
                deck.push(card);
            }
        }
    }
    return deck;
};

var getId = function(className) {
    return className + "-" + (Math.round(Math.random() * 10000));
}

var printDeck = function(deck, id, toFile) {
    if(toFile) {
        printer.file(toFile);
        printer.print(id);
        printer.print("");
    }
    else {
        console.log(id);
        console.log("");
    }
    for(var i = 0; i < deck.length; i++) {
        var a = deck[i];
        var str = a.cost + ": " + a.name + (a.rarity == "Legendary" ? " [L]" : "");
        if(instancesOf(a,deck)>1) {
            str = str + " x" + instancesOf(a,deck) + "";
            i++;
        }
        if(!toFile) {
            console.log(str);
        } else {
            printer.print(str);
        }
    }
    if(!toFile) {
        for(var i = 0; i < 3; i++) {
            console.log("");
        }
    }
    else {
        for(var i = 0; i < 3; i++) {
            printer.print("");
        }
    }
};

var red = setup.hero('Red');
var blue = setup.hero('Blue');

setup.randomizeHero(red);
// setup.setHero(red, heroes.mage());
setup.randomizeHero(blue);
// setup.setHero(blue, heroes.mage());

// scenario = adventures.setScenario(adventures.KelThuzad());
// red.isPlayer = playerModule.requestControl(red);

var buildDeck = module.exports.buildDeck = function(player, template) {
    if(!template) {
        template=3;
    }
    var deck = build(player.hero.name, template, 30);
    alphabetize(deck);
    var id = getId(player.hero.name);
    // printDeck(deck, id);
    printDeck(deck, id, "results.txt");
    return deck;
};