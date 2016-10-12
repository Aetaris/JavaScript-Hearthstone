var heroes = require('./heroes.js');
var cards = require('./cards.js');
var effects = require('./effects.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js')
var decks = require('./decks.js');

module.exports.test = function () {
    return printer.print('success');
};

var player = module.exports.player = function (color) {
    return utilities.withEffects({
        type: "hero",
        color: color,
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
        isPlayer: false,
        minions: [],
        hand: [],
        deck: decks.basicDeck(),
        graveyard: [],
        taunts: {
            start: false,
            heropower: false,
            custom1: false,
            custom2: false,
            custom3: false,
            victory: false,
            defeat: false
        },
        getMaxHp: function() { return utilities.genMaxHp(this); },
        getHp: function() { return utilities.genHp(this); },
        getMaxDamage: function() { return utilities.genMaxDamage(this); },
        getDamage: function() { return utilities.genDamage(this); },
        Attack: utilities.Attack
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
    if(color) {
        return module.exports.player(color);
    } else {
        throw new Error("Error: Hero without color");
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
    for(i = 0; i < first.deck.length; i++) {
        total += first.deck[i].cost;
    }
    
    var average = Math.floor((total / first.deck.length) + 1);
    
    var drawnCards = [];
    
    for(i = 0; i < 3; i++) {
        drawnCards[i] = utilities.drawCard(first, { player: first, foe: second, cause: false });
    }
    var mulliganNum = 0;
    for(i = 0; i < 3; i++) {
        if(first.isPlayer == false || drawnCards[i].cost >= average + 1) {
            if(first.isPlayer == true || second.isPlayer == false) {
                printer.print(first.color + " " + first.name + " mulligans " + drawnCards[i].name + ".");
            } else {
                mulliganNum++;
            }
            var randomNum = Math.floor(first.deck.length * Math.random(0, 1));
            first.deck.splice(randomNum, 0, drawnCards[i]);
            first.hand.splice(first.hand.indexOf(drawnCards[i]), 1);
            utilities.drawCard(first, { player: first, foe: second, cause: false });
        }
    }
    if(first.isPlayer == false && second.isPlayer == true) {
        printer.print(first.color + " " + first.name + " mulligans " + mulliganNum + " card " + mulliganNum > 1 ? "s" : "" + ".");
    }
    
    printer.print("");
    printer.print("");
    printer.print("");
    
    total = 0;
    for(i = 0; i < second.deck.length; i++) {
        total += second.deck[i].cost;
    }
    
    average = Math.floor((total / second.deck.length) + 1);
    
    drawnCards = [];
    
    for(i = 0; i < 4; i++) {
        drawnCards[i] = utilities.drawCard(second, { player: second, foe: first, cause: false });
    }
    mulliganNum = 0;
    for(i = 0; i < 4; i++) {
        if(drawnCards[i].cost >= average + 1 ) {
            if(first.isPlayer == true || second.isPlayer == false) {
                printer.print(second.color + " " + second.name + " mulligans " + drawnCards[i].name + ".");
            } else {
                mulliganNum++;
            }
            randomNum = Math.floor(second.deck.length * Math.random(0, 1));
            second.deck.splice(randomNum, 0, drawnCards[i]);
            second.hand.splice(second.hand.indexOf(drawnCards[i]), 1);
            utilities.drawCard(second, { player: second, foe: first, cause: false });
        }
    }
    
    if(second.isPlayer == false && first.isPlayer == true) {
        printer.print(second.color + " " + second.name + " mulligans " + mulliganNum + " card " + mulliganNum > 1 ? "s" : "" + ".");
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