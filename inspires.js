var utilities = require('./utilities.js');
var printer = require('./printer.js')
var cardLists = require('./cardlists.js');
var effects = require('./effects.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');

var Kodorider = function(source, context) {
    printer.print(source.color + " " + source.name + " is Inspired, and summons a 3/5 War Kodo.");
    if(context.player.minions.length < 7) {
        utilities.summon(WarKodo(source.color), context.player, context);
    }
};

var NexusChampionSaraad = function(source, context) {
    var spellList = [];
    var cardList = cardLists.allCards();
    for(var i in cardList) {
        var card = cardList[i]();
        if(card.type == "spell") {
            spellList.push(card);
        }
    }
    
    var spell = spellList[Math.floor(Math.random() * spellList.length)];
    printer.print(source.color + " " + source.name + " is Inspired, giving the " + context.player.color + " " + context.player.name + " a random spell.");
    if(context.player.hand.length < 10 && spell) {
        context.player.hand.push(spell);
        printer.print("Spell received: " + spell.name);
    }
    else if (spell) {
        printer.print("Hand too full! Could not receive new card.");
    } else {
        printer.print("There are no spells in this gamemode!");
    }
};

var MurlocKnight = function(source, context) {
    var murlocList = [];
    var cardList = cardLists.allCards();
    for(var i in cardList) {
        var card = cardList[i]();
        if(card.type == "minion" && card.race == "Murloc") {
            murlocList.push(card);
        }
    }
    
    var murloc = murlocList[Math.floor(Math.random()*murlocList.length)];
    printer.print(source.color + " " + source.name + " is Inspired, giving the " + context.player.color + " " + context.player.name + " a random Murloc.");
    if(context.player.hand.length < 10 && murloc) {
        utilities.summon(murloc, context.player, context);
        printer.print("Murloc summoned: " + murloc.name);
    }
    else if (murloc) {
        printer.print("Board too full! Could not summon minion.");
    } else {
        printer.print("No murlocs exist in this game mode!");
    }
};

module.exports.Kodorider_Inspire = {
    name: "Kodorider",
    type: "inspire",
    action: Kodorider
};

module.exports.NexusChampionSaraad_Inspire = {
    name: "Nexus-Champion Saraad",
    type: "inspire",
    action: NexusChampionSaraad
};

module.exports.MurlocKnight_Inspire = {
    name: "Murloc Knight",
    type: "inspire",
    action: MurlocKnight
};

var WarKodo = function(color) {
    return utilities.makeMinion("Beast", "Epic", "The Grand Tournament", color, "War Kodo", 3, 0, 5, 3, false, false, false, [effects.sickness], ais.WarKodo, WarKodo);
};

var Arthas_ElvenPriest = function(source, context) {
    var targets = filters.damagedFriendly_noFinalize(context);
    var target = targets[Math.floor(Math.random() * targets.length)];
    if(target) {
        printer.print(source.color + " " + source.name + " casts a quick healing spell on " + target.color + " " + target.name + ".");
        utilities.healDamage(target, 2, context);
    } else if(context.player.damageTaken > 0) {
        printer.print(source.color + " " + source.name + " casts a quick healing spell on " + context.player.color + " " + context.player.name);
        utilities.healDamage(context.player, 2, context);
    }
};

var Arthas_Sorceress = function(source, context) {
    var targets = filters.enemyMinion(context);
    var target = targets[Math.floor(Math.random() * targets.length)];
    if(target) {
        printer.print(source.color + " " + source.name + " casts a slowing spell on " + target.color + " " + target.name + ", delaying their attacks temporarily.");
        target.effects.push(effects.sickness);
    }
};

module.exports.Arthas_ElvenPriest_Inspire = {
    name: "Heal",
    type: "inspire",
    action: Arthas_ElvenPriest
};

module.exports.Arthas_Sorceress_Inspire = {
    name: "Slow",
    type: "inspire",
    action: Arthas_Sorceress
};