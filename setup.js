var heroes = require('./heroes.js');
var cards = require('./cards.js');
var effects = require('./effects.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js')
var decks = require('./decks.js');

module.exports.test = function () {
    return printer.print('success');
};

var blue = module.exports.blue = function () {
    return utilities.withEffects({
        type: "hero",
        color: "Blue",
        hero: {},
        name: "error",
        baseHp: 30,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        ability: false,
        cost: 0,
        ai: false,
        heroPowerUsed: false,
        turn: false,
        weapon: false,
        effects: [],
        minions: [],
        hand: [],
        deck: decks.basicDeck(),
        taunts: {
            start: false,
            heropower: false,
            custom1: false,
            custom1used: false,
            custom2: false,
            custom2used: false,
            custom3: false,
            custom3used: false,
            victory: false,
            defeat: false
        },
        getMaxHp: function() { return utilities.genMaxHp(this); },
        getHp: function() { return utilities.genHp(this); },
        getMaxDamage: function() { return utilities.genMaxDamage(this); },
        getDamage: function() { return utilities.genDamage(this); }
    });
};

var red = module.exports.red = function () {
    return utilities.withEffects({
        type: "hero",
        color: "Red",
        hero: {},
        name: "error",
        baseHp: 30,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        ability: false,
        cost: 0,
        ai: false,
        heroPowerUsed: false,
        turn: false,
        weapon: false,
        effects: [],
        minions: [],
        hand: [],
        deck: decks.basicDeck(),
        taunts: {
            start: false,
            heropower: false,
            custom1: false,
            custom1used: false,
            custom2: false,
            custom2used: false,
            custom3: false,
            custom3used: false,
            victory: false,
            defeat: false
        },
        getMaxHp: function() { return utilities.genMaxHp(this); },
        getHp: function() { return utilities.genHp(this); },
        getMaxDamage: function() { return utilities.genMaxDamage(this); },
        getDamage: function() { return utilities.genDamage(this); }
    });
};

var randomizeHero = module.exports.randomizeHero = function(player) {
    var HeroNum = Math.floor(heroes.HeroList.length * Math.random());
    var Hero = heroes.HeroList[HeroNum]();
    setHero(player, Hero);
};

var setHero = module.exports.setHero = function(player, hero) {
    player.hero = hero;
    player.name = hero.name;
    if(hero.ability.type) {
        if(hero.ability.type === "passive") {
            hero.ability.action(player);
        }
        player.ability = false;
    }
    else {
        player.ability = hero.ability;
    }
    player.cost = hero.cost;
    player.ai = hero.ai;
    player.deck = hero.deck;
    player.baseHp = hero.hp;
    player.armor = hero.armor;
    utilities.shuffle(player.deck);
};

var hero = module.exports.hero = function (color) {
    if(color == 'red') {
        return module.exports.red();
    } else if(color == 'blue') {
        return module.exports.blue();
    } else {
        printer.print('Error: hero(), setup.js:82, no value blue or red');
    }
};

module.exports.drawStartCards = function(first, second) {
    for(var i = 0; i < first.deck.length; i++) {
        if(first.deck[i].type === "minion") {
            first.deck[i].owner = first;
        }
    }
    for(i = 0; i < second.deck.length; i++) {
        if(second.deck[i].type === "minion") {
            second.deck[i].owner = second;
        }
    }
    
    var total = 0;
    for(var i = 0; i < first.deck.length; i++) {
        total += first.deck[i].cost;
    }
    
    var average = Math.round(total / first.deck.length);
    
    for(i = 0; i < 3; i++) {
        var card = utilities.drawCard(first, { player: first, foe: second, cause: false });
        if(card.cost >= average + 1 ) {
            printer.print(first.color + " " + first.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
            var randomNum = Math.floor(first.deck.length * Math.random(0, 1));
            first.deck.splice(randomNum, 0, card);
            first.hand.splice(first.hand.indexOf(card), 1);
            utilities.drawCard(first, { player: first, foe: second, cause: false });
        }
    }
    
    // var card = utilities.drawCard(first, { player: first, foe: second, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(first.color + " " + first.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(first.deck.length * Math.random(0, 1));
    //     first.deck.splice(randomNum, 0, card);
    //     first.hand.splice(first.hand.indexOf(card), 1);
    //     utilities.drawCard(first, { player: first, foe: second, cause: false });
    // }
    // var card = utilities.drawCard(first, { player: first, foe: second, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(first.color + " " + first.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(first.deck.length * Math.random(0, 1));
    //     first.deck.splice(randomNum, 0, card);
    //     first.hand.splice(first.hand.indexOf(card), 1);
    //     utilities.drawCard(first, { player: first, foe: second, cause: false });
    // }
    // var card = utilities.drawCard(first, { player: first, foe: second, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(first.color + " " + first.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(first.deck.length * Math.random(0, 1));
    //     first.deck.splice(randomNum, 0, card);
    //     first.hand.splice(first.hand.indexOf(card), 1);
    //     utilities.drawCard(first, { player: first, foe: second, cause: false });
    // }
    printer.print("");
    printer.print("");
    printer.print("");
    
    var total = 0;
    for(var i = 0; i < second.deck.length; i++) {
        total += second.deck[i].cost;
    }
    
    var average = Math.round(total / second.deck.length);
    
    for(i = 0; i < 3; i++) {
        var card = utilities.drawCard(second, { player: second, foe: first, cause: false });
        if(card.cost >= average + 1 ) {
            printer.print(second.color + " " + second.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
            var randomNum = Math.floor(second.deck.length * Math.random(0, 1));
            second.deck.splice(randomNum, 0, card);
            second.hand.splice(second.hand.indexOf(card), 1);
            utilities.drawCard(second, { player: second, foe: first, cause: false });
        }
    }
    
    second.hand.push(cards.TheCoin());
    
    
    // var card = utilities.drawCard(second, { player: second, foe: first, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(second.color + " " + second.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(second.deck.length * Math.random(0, 1));
    //     second.deck.splice(randomNum, 0, card);
    //     second.hand.splice(second.hand.indexOf(card), 1);
    //     utilities.drawCard(second, { player: second, foe: first, cause: false });
    // }
    // var card = utilities.drawCard(second, { player: second, foe: first, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(second.color + " " + second.name + " decides  to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(second.deck.length * Math.random(0, 1));
    //     second.deck.splice(randomNum, 0, card);
    //     second.hand.splice(second.hand.indexOf(card), 1);
    //     utilities.drawCard(second, { player: second, foe: first, cause: false });
    // }
    // var card = utilities.drawCard(second, { player: second, foe: first, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(second.color + " " + second.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(second.deck.length * Math.random(0, 1));
    //     second.deck.splice(randomNum, 0, card);
    //     second.hand.splice(second.hand.indexOf(card), 1);
    //     utilities.drawCard(second, { player: second, foe: first, cause: false });
    // }
    // var card = utilities.drawCard(second, { player: second, foe: first, cause: false });
    // if(card.cost >= 5 ) {
    //     printer.print(second.color + " " + second.name + " decides to shuffle " + card.name + " back into the deck and draw another card.");
    //     var randomNum = Math.floor(second.deck.length * Math.random(0, 1));
    //     second.deck.splice(randomNum, 0, card);
    //     second.hand.splice(second.hand.indexOf(card), 1);
    //     utilities.drawCard(second, { player: second, foe: first, cause: false });
    // }
    printer.print(second.color +  " " + second.name + " is given The Coin.");
};