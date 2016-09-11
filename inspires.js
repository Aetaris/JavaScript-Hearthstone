var utilities = require('./utilities.js');
var printer = require('./printer.js')
var cardLists = require('./cardlists.js');
var effects = require('./effects.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');

var Kodorider = function(source, context) {
    printer.print(source.color + " " + source.name + " is Inspired, and summons a 3/5 War Kodo.");
    if(context.player.minions.length < 7) {
        utilities.summon(WarKodo(source.color), context.player, context);
    }
};

var NexusChampionSaraad = function(source, context) {
    var spellList = [];
    for(var b = 0; b < cardLists.neutral.length; b++) {
        if(cardLists.neutral[b]().type === "spell") {
            spellList.push(cardLists.neutral[b]);
        }
    }
    for(var b = 0; b < cardLists.mage.length; b++) {
        if(cardLists.mage[b]().type === "spell") {
            spellList.push(cardLists.mage[b]);
        }
    }
    for(var b = 0; b < cardLists.shaman.length; b++) {
        if(cardLists.shaman[b]().type === "spell") {
            spellList.push(cardLists.shaman[b]);
        }
    }
    for(var b = 0; b < cardLists.warrior.length; b++) {
        if(cardLists.warrior[b]().type === "spell") {
            spellList.push(cardLists.warrior[b]);
        }
    }
    for(var b = 0; b < cardLists.rogue.length; b++) {
        if(cardLists.rogue[b]().type === "spell") {
            spellList.push(cardLists.rogue[b]);
        }
    }
    for(var b = 0; b < cardLists.hunter.length; b++) {
        if(cardLists.hunter[b]().type === "spell") {
            spellList.push(cardLists.hunter[b]);
        }
    }
    for(var b = 0; b < cardLists.druid.length; b++) {
        if(cardLists.druid[b]().type === "spell") {
            spellList.push(cardLists.druid[b]);
        }
    }
    for(var b = 0; b < cardLists.warlock.length; b++) {
        if(cardLists.warlock[b]().type === "spell") {
            spellList.push(cardLists.warlock[b]);
        }
    }
    for(var b = 0; b < cardLists.paladin.length; b++) {
        if(cardLists.paladin[b]().type === "spell") {
            spellList.push(cardLists.paladin[b]);
        }
    }
    for(var b = 0; b < cardLists.priest.length; b++) {
        if(cardLists.priest[b]().type === "spell") {
            spellList.push(cardLists.priest[b]);
        }
    }
    var randomNum = spellList.length;
    var spell = Math.floor(randomNum * Math.random(0, 1));
    printer.print(source.color + " " + source.name + " is Inspired, giving the " + context.player.color + " " + context.player.name + " a random spell.");
    if(context.player.hand.length < 10) {
        context.player.hand.push(spellList[spell]());
        printer.print("Spell received: " + spellList[spell]().name);
    }
    else {
        printer.print("Hand too full! Could not receive new card.");
    }
};

var MurlocKnight = function(source, context) {
    var murlocList = [];
    for(var b = 0; b < cardLists.neutral.length; b++) {
        if(cardLists.neutral[b]().type === "minion") {
            if(cardLists.neutral[b]().race === "Murloc") {
                murlocList.push(cardLists.neutral[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.warrior.length; b++) {
        if(cardLists.warrior[b]().type === "minion") {
            if(cardLists.warrior[b]().race === "Murloc") {
                murlocList.push(cardLists.warrior[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.rogue.length; b++) {
        if(cardLists.rogue[b]().type === "minion") {
            if(cardLists.rogue[b]().race === "Murloc") {
                murlocList.push(cardLists.rogue[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.hunter.length; b++) {
        if(cardLists.hunter[b]().type === "minion") {
            if(cardLists.hunter[b]().race === "Murloc") {
                murlocList.push(cardLists.hunter[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.shaman.length; b++) {
        if(cardLists.shaman[b]().type === "minion") {
            if(cardLists.shaman[b]().race === "Murloc") {
                murlocList.push(cardLists.shaman[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.druid.length; b++) {
        if(cardLists.druid[b]().type === "minion") {
            if(cardLists.druid[b]().race === "Murloc") {
                murlocList.push(cardLists.druid[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.warlock.length; b++) {
        if(cardLists.warlock[b]().type === "minion") {
            if(cardLists.warlock[b]().race === "Murloc") {
                murlocList.push(cardLists.warlock[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.paladin.length; b++) {
        if(cardLists.paladin[b]().type === "minion") {
            if(cardLists.paladin[b]().race === "Murloc") {
                murlocList.push(cardLists.paladin[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.priest.length; b++) {
        if(cardLists.priest[b]().type === "minion") {
            if(cardLists.priest[b]().race === "Murloc") {
                murlocList.push(cardLists.priest[b]);
            }
        }
    }
    var randomNum = murlocList.length;
    var murloc = Math.floor(randomNum * Math.random(0, 1));
    printer.print(source.color + " " + source.name + " is Inspired, giving the " + context.player.color + " " + context.player.name + " a random Murloc.");
    if(context.player.hand.length < 10) {
        utilities.summon(murlocList[murloc](), context.player, context);
        printer.print("Murloc summoned: " + murlocList[murloc]().name);
    }
    else {
        printer.print("Board too full! Could not summon minion.");
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
    return utilities.makeMinion("Beast", "Epic", "The Grand Tournament", color, "War Kodo", 3, 0, 5, 3, false, false, [effects.sickness], ais.WarKodo, WarKodo);
};