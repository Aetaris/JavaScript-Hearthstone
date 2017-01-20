var utilities = require('./utilities.js');
var printer = require('./printer.js')
// var cards = require('./cards.js');
var deathrattles = require('./deathrattles.js');
var abilities = require('./abilities.js');
var weapons = require('./weapons.js');
var effects = require('./effects.js');
var heroes = require('./heroes.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');
var cardLists = require('./cardlists.js');

module.exports.ElvenArcher = function(target, source, context) {
    printer.print(context.player.color + " Elven Archer's battlecry fires an arrow at " + target.color + " " + target.name + ".");
    utilities.dealDamage(target, 1, context);
};

module.exports.Nightblade = function(target, source, context) {
    printer.print(context.player.color + " Nightblade's battlecry hurls a knife at " + context.foe.color + " " + context.foe.name + ".");
    utilities.dealDamage(context.foe, 3, context);
};

module.exports.NoviceEngineer = function(target, source, context) {
    printer.print(source.color + " Novice Engineer's battlecry creates a slightly convenient invention, allowing the " + source.color + " " + context.player.name + " to draw a card.");
};

module.exports.AbusiveSergeant = function(target, source, context) {
    printer.print(source.color + " Abusive Sergeant's battlecry 'inspires' " + target.color + " " + target.name + ", giving them +2 Attack this turn.");
    target.effects.push(AbusiveSergeantBuff);
};

var AbusiveSergeantBuff = {
    name: "Temporary Damage",
    type: "buff damage",
    num: 2
};

module.exports.AldorPeacekeeper = function(target, source, context) {
    printer.print(context.player.color + " Aldor Peacekeeper's battlecry imposes order on " + target.color + " " + target.name + ", reducing their damage to 1.");
    target.damage = 1;
    target.maxDamage = 1;
};

module.exports.AzureDrake = function(target, source, context) {
    printer.print(source.color + " Azure Drake's battlecry draws a card for " + source.color + " " + context.player.name + ".");
    utilities.drawCard(context.player, context);
};

module.exports.SilverHandKnight = function(target, source, context) {
    printer.print(source.color + " Silver Hand Knight's battlecry calls for his 2/2 Squire.");
    utilities.summon(Squire(), context.player, context);
};

var Squire = function() {
    return utilities.makeMinion(false, "Common", "Classic", false, "Squire", 1, 0, 2, 2, false, false, false, [effects.sickness], ais.MurlocRaider, Squire, 50);
};

module.exports.Spellbreaker = function(target, source, context) {
    if(target) {
        printer.print(context.player.color + " Spellbreaker's battlecry nullifies all magic surrounding " + target.color + " " + target.name + ", silencing them.");
        utilities.dispel(target, context);
    }
};

module.exports.BigGameHunter = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + "'s battlecry shoots " + target.name + " with a very large gun.");
        utilities.kill(target, {
            player: context.foe,
            foe: context.player,
            cause: source
        });
    }
};

module.exports.FacelessManipulator = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry manipulates reality and transforms it into a copy of the " + target.color + " " + target.name + ".");
    source.name = target.name;
    source.baseHp = target.baseHp;
    source.baseDamage = target.baseDamage;
    source.damageTaken = target.damageTaken;
    source.effects = target.effects;
    source.battlecry = target.battlecry;
    source.card = target.card;
    source.rarity = target.rarity;
    source.cost = target.cost;
};

module.exports.CrazedAlchemist = function(target, source, context) {
    printer.print(source.color + " Crazed Alchemist throws an experimental concoction at " + target.color + " " + target.name + ", reversing their Attack and Health.", "results.txt", false);
    printer.print(" (" + target.getDamage() + "/" + target.getHp() + ") -> ", "results.txt", false);
    utilities.reverseStats(target);
    printer.print("(" + target.getDamage() + "/" + target.getHp() + ")");
};

module.exports.Alexstrasza = function(target, source, context) {
    printer.print(context.player.color + " Alextrasza's battlecry manipulates the life energy of the " + target.color + " " + target.name + ", setting their Health to 15.");
    if (target.baseHp < 15) {
        target.baseHp = 15;
    }
    target.damageTaken = target.baseHp - 15;
};

module.exports.Deathwing = function(target, source, context) {
    printer.print(source.color + " Deathwing's battlecry induces a Cataclysm, destroying all other minions and discarding the " + context.player.color + " " + context.player.name + "'s hand. The hour of Twilight is nigh.");
    var minions = [];
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if (minion !== source) {
            minions.push(minion);
        }
    }
    for (var i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        if (minion !== source) {
            minions.push(minion);
        }
    }
    for (i = 0; i < minions.length; i++) {
        minion = minions[i];
        if (minion.color === context.player.color) {
            utilities.kill(minion, context);
        }
        else if (minion.color === context.foe.color) {
            utilities.kill(minion, {
                player: context.foe,
                foe: context.player,
                cause: source
            });
        }
    }
    context.player.hand = [];
};

module.exports.Loatheb = function(target, source, context) {
    printer.print(source.color + " Loatheb's battlecry spews forth toxic spores, increasing the cost of all enemy spells by (5) next turn.");
    for (var i = 0; i < context.foe.hand.length; i++) {
        if (context.foe.hand[i].type === "spell") {
            context.foe.hand[i].addEffect(effects.Loatheb);
            context.foe.hand[i].addEffect(effects.removeTempBuff);
        }
    }
};

module.exports.TinkertownTechnician = function(target, source, context) {
    var HasMech = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].race === "Mech") {
            HasMech = true;
        }
    }
    if (HasMech) {
        printer.print(context.player.color + " Tinkertown Technician's battlecry empowers him and gives " + context.player.color + " " + context.player.name + " a Spare Part.");
        source.addEffect(effects.TinkertownTechnicianHp);
        source.addEffect(effects.TinkertownTechnicianDamage);
        var sparePart = SpareParts[Math.floor(Math.random()*SpareParts.length)]();
        utilities.addCard(sparePart, context.player, context);
        printer.print(context.player.color + " " + context.player.name + " receives : " + sparePart.name + ".");
    }
};

module.exports.GoblinBlastmage = function(target, source, context) {
    var HasMech = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].race === "Mech") {
            HasMech = true;
        }
    }
    if (HasMech) {
        for (var i = 0; i < 4; i++) {
            var target = context.foe;
            var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
            if (targetRoll < context.foe.minions.length) {
                target = context.foe.minions[targetRoll];
            }
            else {
                target = context.foe;
            }
            if (target.hp > 0) {
                printer.print("A concentrated blast of fire from " + context.player.color + " Goblin Blastmage's battlecry hits " + target.color + " " + target.name + ".");
                utilities.dealDamage(target, 1, context);
            }
        }
    }
};

module.exports.Toshley = function(target, source, context) {
    printer.print(context.player.color + " Toshley warps into the battlefield and provides " + context.player.color + " " + context.player.name + " with a Spare Part card.");
    var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    var part = SpareParts[sparePartNum]();
    utilities.addCard(part, context.player, context);
    printer.print(context.player.color + " " + context.player.name + " receives: " + part.name + ".");
};

module.exports.DrBoom = function(target, source, context) {
    printer.print(context.player.color + " Dr. Boom releases two terrifying Boom Bots!");
    for(var i = 0; i < 2; i++) {
        utilities.summon(BoomBot(), context.player, context);
    }
};

module.exports.BlackwingTechnician = function(target, source, context) {
    var hasDragon = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if (hasDragon) {
        printer.print(source.color + " Blackwing Technician's battlecry triggers and gives it +1 Attack and +1 Health!");
        source.addEffect(BlackwingTechnicianHp);
        source.addEffect(BlackwingTechnicianDamage);
    }
    else {
        printer.print(source.color + " Blackwing Technician's battlecry does NOT trigger. There are no dragons in " + context.player.color + " " + context.player.name + "'s hand.");
    }
};

var BlackwingTechnicianHp = {
    name: "Blackwing Technician",
    type: "buff health",
    num: 1
};

var BlackwingTechnicianDamage = {
    name: "Blackwing Technician",
    type: "buff damage",
    num: 1
};

module.exports.BlackwingCorruptor = function(target, source, context) {
    var hasDragon = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if (hasDragon) {
        printer.print(source.color + " Blackwing Corruptor's battlecry triggers, and it hurls an orb of dark power at " + target.color + " " + target.name + "!");
        if (target.color === source.color) {
            utilities.dealDamage(target, 3, {
                player: context.player,
                foe: context.foe,
                cause: source
            });
        }
        else {
            utilities.dealDamage(target, 3, {
                player: context.foe,
                foe: context.player,
                cause: source
            });
        }
    }
    else {
        printer.print(source.color + " Blackwing Corruptor's battlecry does NOT trigger. There are no dragons in " + context.player.color + " " + context.player.name + "'s hand.");
    }
};

module.exports.Nefarian = function(target, source, context) {
    printer.print(source.color + " Nefarian's battlecry turns the " + context.foe.color + " " + context.foe.name + "'s strength against them, giving the " +
        context.player.color + " " + context.player.name + " two spells from their class!");
    if (context.foe.hero.cardList) {
        var cards = context.foe.hero.cardList;
    } else {
        cards = [TailSwipe];
    }
    var spellList = [];
    for(var i in cards) {
        var card = cards[i];
        if(typeof cards[i] == "function") {
            var card = card();
        }
        if(!card) {
            throw new Error("No card");
        }
        if(card.type == "spell") {
            spellList.push(card);
        }
    }
    for (i = 0; i < 2; i++) {
        var spell = spellList[Math.floor(Math.random()*spellList.length)];
        printer.print("Spell received: " + spell.name);
        utilities.addCard(spell, context.player, context);
    }
};

var TailSwipe = function() {
    return utilities.makeSpell("Uncollectible", "Blackrock Mountain", ["Neutral"], "Tail Swipe", 4, 0, TailSwipeAbil, targetais.Fireball, filters.any, ais.Fireball, TailSwipe);
};

var TailSwipeAbil = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Tail Swipe, dealing 4 damage to " + target.color + " " + target.name + ".");
    utilities.dealSpellDamage(target, 4, context);
};

module.exports.MasterJouster = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry calls for a Joust!");
    var results = utilities.Joust(context.player, context.foe);
    if (results.winner) {
        printer.print(source.color + " " + source.name + " is victorious, gaining Taunt and Divine Shield!");
        source.addEffect(effects.taunt);
        source.addEffect(effects.divineshield);
    }
};

module.exports.TwilightGuardian = function(target, source, context) {
    var hasDragon = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if (hasDragon) {
        printer.print(source.color + " Twilight Guardian's battlecry triggers and gives it +1 Attack and Taunt!");
        source.addEffect(TwilightGuardianBuff);
        source.addEffect(effects.taunt);
    }
    else {
        printer.print(source.color + " Twilight Guardian's battlecry does NOT trigger. There are no dragons in " + context.player.color + " " + context.player.name + "'s hand.");
    }
};

var TwilightGuardianBuff = {
    name: "Twilight Guardian",
    type: "buff damage",
    num: 1
};

module.exports.NorthSeaKraken = function(target, source, context) {
    printer.print("The " + context.player.color + " North Sea Kraken spits a jet of water at " + target.name + ".");
    utilities.dealDamage(target, 4, {
        player: context.player,
        foe: context.foe,
        cause: source
    });
};

module.exports.ArchThiefRafaam = function(target, source, context) {
    printer.print(source.color + " Arch-Thief Rafaam's battlecry steals one of three magnificent artifacts.");
    var artif = Artifacts();
    var options = utilities.Discover(artif[0], artif[1], artif[2]);
    var result = utilities.discoverChoose(options, context.player);
    printer.print("Card chosen: " + result.name);
    utilities.addCard(result, context.player, context);
};

var Artifacts = function() {
    return [
        [LanternofPower()],
        [MirrorofDoom()],
        [TimepieceofHorror()]
    ];
};

var LanternofPower = function() {
    return utilities.makeSpell("Uncollectible", "League of Explorers", ["Neutral"], "Lantern of Power", 10, 0, abilities.LanternofPower, targetais.BlessingofKings, filters.minion, ais.BlessingofKings, LanternofPower, 420);
};

var MirrorofDoom = function() {
    return utilities.makeSpell("Uncollectible", "League of Explorers", ["Neutral"], "Mirror of Doom", 10, 0, abilities.MirrorofDoom, false, false, ais.MirrorofDoom, MirrorofDoom, 420);
};

var TimepieceofHorror = function() {
    return utilities.makeSpell("Uncollectible", "League of Explorers", ["Neutral"], "Timepiece of Horror", 10, 0, abilities.TimepieceofHorror, false, false, ais.AvengingWrath, TimepieceofHorror, 420);
};

module.exports.EliseStarseeker = function(target, source, context) {
    printer.print(source.color + " Elise Starseeker's research identifies the location of a 'Map to the Golden Monkey' somewhere inside the " + context.player.color + " " + context.player.name + "'s deck.");
    var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
    context.player.deck.splice(randomNum, 0, MaptotheGoldenMonkey());
};

module.exports.GoldenMonkey = function(target, source, context) {
    printer.print(source.color + " Golden Monkey's battlecry replaces all cards in " + context.player.color + " " + context.player.name + "'s deck with random Legendary minions.");

    var legendList = [];
    var cardList = cardLists.allCards();
    for (var i in cardList) {
        if(typeof cardList[i] == "function") {
            cardList[i] = cardList[i]();
        }
        if (cardList[i].rarity == "Legendary" && cardList[i].type == "minion") {
            legendList.push(cardList[i]);
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        var randomNum = Math.floor(legendList.length * Math.random(0, 1));
        if(!legendList[randomNum]) {
            throw new Error("");
        }
        context.player.hand[i] = legendList[randomNum].card();
    }
    for (i = 0; i < context.player.deck.length; i++) {
        randomNum = Math.floor(legendList.length * Math.random(0, 1));
        if (!legendList[randomNum]) {
            console.log("error");
        }
        var card = legendList[randomNum].card();
        card.color = context.player.color;
        context.player.deck[i] = card;
    }
};

module.exports.RenoJackson = function(target, source, context) {
    if (utilities.checkForDuplicates(context.player, source)) {
        printer.print(source.color + " Reno Jackson is gonna be rich! He restores " + context.player.color + " " + context.player.name + "'s health to its maximum!");
        utilities.healDamage(context.player, context.player.getMaxHp(), context);
    }
    else {
        printer.print(source.color + " Reno Jackson's battlecry does not trigger. There are multiple copies of at least one card in " + context.player.color + " " + context.player.name + "'s deck.");
    }
};

module.exports.BeckonerofEvil = function(target, source, context) {
    printer.print(source.color + " Beckoner of Evil's battlecry empowers their master, giving C'Thun +2/+2!");
    var buffed = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].name === "C'Thun") {
            context.player.minions[i].addEffect(BeckonerHp);
            context.player.minions[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.minions[i].getDamage() + "/" + context.player.minions[i].getHp() + "!");
            buffed = true;
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].name === "C'Thun") {
            context.player.hand[i].addEffect(BeckonerHp);
            context.player.hand[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.hand[i].getDamage() + "/" + context.player.hand[i].getHp() + "!");
            buffed = true;
        }
    }
    for (i = 0; i < context.player.deck.length; i++) {
        if (context.player.deck[i].name === "C'Thun") {
            context.player.deck[i].addEffect(BeckonerHp);
            context.player.deck[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.deck[i].getDamage() + "/" + context.player.deck[i].getHp() + "!");
            buffed = true;
        }
    }
    if (!buffed) {
        printer.print(source.color + " Beckoner of Evil couldn't find C'Thun anywhere...");
    }
};

var BeckonerHp = {
    name: "Beckoner of Evil HP Buff",
    type: "buff health",
    num: 2
};

var BeckonerDmg = {
    name: "Beckoner of Evil DMG Buff",
    type: "buff damage",
    num: 2
};

module.exports.CThunsChosen = function(target, source, context) {
    printer.print(source.color + " C'Thun's Chosen's battlecry empowers their master, giving C'Thun +2/+2!");
    var buffed = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].name === "C'Thun") {
            context.player.minions[i].addEffect(BeckonerHp);
            context.player.minions[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.minions[i].getDamage() + "/" + context.player.minions[i].getHp() + "!");
            buffed = true;
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].name === "C'Thun") {
            context.player.hand[i].addEffect(BeckonerHp);
            context.player.hand[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.hand[i].getDamage() + "/" + context.player.hand[i].getHp() + "!");
            buffed = true;
        }
    }
    for (i = 0; i < context.player.deck.length; i++) {
        if (context.player.deck[i].name === "C'Thun") {
            context.player.deck[i].addEffect(BeckonerHp);
            context.player.deck[i].addEffect(BeckonerDmg);
            printer.print("C'Thun is empowered up to " + context.player.deck[i].getDamage() + "/" + context.player.deck[i].getHp() + "!");
            buffed = true;
        }
    }
    if (!buffed) {
        printer.print(source.color + " C'Thun's Chosen couldn't find C'Thun anywhere...");
    }
};

module.exports.CThun = function(target, source, context) {
    if (source.getDamage() === 6) {
        printer.print(source.color + " C'Thun's battlecry laumches forth a barrage of dark energy, dealing " + source.getDamage() + " damage randomly split among enemies!");
    }
    else if (source.getDamage() <= 14) {
        printer.print(source.color + " C'Thun's battlecry sunders the battlefield, assaulting its enemies with " + source.getDamage() + " damage randomly split among them!");
    }
    else if (source.getDamage() <= 24) {
        printer.print(source.color + " C'Thun's battlecry utterly shatters the bodies and wills of its foes, blasting them apart with " + source.getDamage() + " damage randomly split among them!");
    }
    else {
        printer.print(source.color + " C'Thun's battlecry signals the end of all things. The sun has set upon the pitiful existence of the " + context.foe.color + " " + context.foe.name +
            ". The malevolent gaze of the Old God blasts at the very foundation of Azeroth, dealing " + source.getDamage() + " damage split among its foes.");
    }
    for (var i = 0; i < source.getDamage(); i++) {
        target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if (targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        if (target.getHp() > 0) {
            printer.print(target.color + " " + target.name + " is struck by the malice of C'Thun.");
            utilities.dealDamage(target, 1, {
                player: context.player,
                foe: context.foe,
                cause: source
            });
        }
        if (target.getHp() < 0) {
            i -= 1;
        }
        utilities.checkForLife({
            player: context.player,
            foe: context.foe,
            cause: "Life Check"
        });
    }
};

module.exports.NZoth = function(target, source, context) {
    var deathrattles = [];
    for (var i = 0; i < context.player.graveyard.length; i++) {
        if (context.player.graveyard[i].type == "minion" && context.player.graveyard[i].hasEffectType("deathrattle")) {
            deathrattles.push(context.player.graveyard[i].card());
        }
    }
    utilities.shuffle(deathrattles);
    deathrattles.splice(6);
    printer.print(source.color + " N'Zoth, the Corruptor's battlecry revives the fallen armies of the Old Gods, resummoning " + deathrattles.length + " " + context.player.color + " Deathrattle minions that died this game.");
    for (i = 0; i < deathrattles.length; i++) {
        if (context.player.minions.length >= 7) {
            continue;
        }
        printer.print("Tendrils of darkness form into the shape of: " + deathrattles[i].name);
        utilities.summon(deathrattles[i].card(), context.player, context);
    }
};

module.exports.YoggSaron = function(target, source, context) {
    var spells = 0;
    for (var i = 0; i < context.player.graveyard.length; i++) {
        if (context.player.graveyard[i].type == "spell") {
            spells++;
        }
    }
    printer.print(source.color + " Yogg-Saron, Hope's End induces madness, causing a flurry of " + spells + " randomly targeted spells to be launched in every direction.");
    var spellList = [];
    var allCards = cardLists.allCards();
    for (var j = 0; j < allCards.length; j++) {
        var card = allCards[j]();
        if (card.type == "spell") {
            spellList.push(card);
        }
    }
    for (i = 0; i < spells; i++) {
        var spell = spellList[Math.floor(Math.random() * spellList.length)];
        var target = false;
        if (spell.filter) {
            var filtered = spell.filter(context);
            target = filtered[Math.floor(Math.random() * filtered.length)];
        }
        if ((!spell.filter || target) && source.getHp() > 0 && source.name == "Yogg-Saron, Hope's End" && source.battlecry && context.player.minions.indexOf(source) >= 0) {
            context.player.lockedMana += card.overload;
            spell.ability(target, {
                player: context.player,
                foe: context.foe,
                cause: spell,
                target: target
            });
            printer.print("Spell: " + spell.name);
        }
        else {
            printer.print("Spell fizzled: " + spell.name + "!");
        }
    }
};

module.exports.EaterofSecrets = function(target, source, context) {
    printer.print(source.color + " Eater of Secrets devours all Secrets of " + context.foe.color + " " + context.foe.name + ", empowering itself for each Secret eaten.");
    var secretList = context.foe.getEffectsName("Secret");
    for (var i = 0; i < secretList.length; i++) {
        context.foe.removeEffect(secretList[i]);
        source.addEffect(EaterofSecretsHp);
        source.addEffect(EaterofSecretsDmg);
        printer.print("Secret devoured: " + secretList[i].name + ". " + source.color + " Eater of Secrets is now " + source.getDamage() + "/" + source.getHp() + "!");
    }
    if (secretList.length === 0) {
        printer.print("Eater of Secrets found no secrets to consume.");
    }
};

var EaterofSecretsHp = {
    name: "Eater of Secrets HP",
    type: "buff health",
    num: 1
};

var EaterofSecretsDmg = {
    name: "Eater of Secrets DMG",
    type: "buff damage",
    num: 1
};

module.exports.GrimestreetSmuggler = function(target, source, context) {
    var targets = [];
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type == "minion") {
            targets.push(context.player.hand[i]);
        }
    }
    target = targets[Math.floor(Math.random() * targets.length)];
    if (target) {
        target.addEffect(GrimestreetSmugglerHp);
        target.addEffect(GrimestreetSmugglerDmg);
        printer.print(source.color + " Grimestreet Smuggler's battlecry gives smuggled equipment to " + target.name + " in " + context.player.color + " " + context.player.name + "'s hand, giving them +1/+1 (up to " + target.getDamage() + "/" + target.getHp() + ").");
    }
    else {
        printer.print(source.color + " Grimestreet Smuggler has smuggled goods, but no one for her battlecry to give them to...");
    }
};

var GrimestreetSmugglerHp = {
    name: "Smuggling",
    type: "buff health",
    num: 1
};

var GrimestreetSmugglerDmg = {
    name: "Smuggling",
    type: "buff damage",
    num: 1
};

module.exports.DonHanCho = function(target, source, context) {
    var targets = [];
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type == "minion") {
            targets.push(context.player.hand[i]);
        }
    }
    target = targets[Math.floor(Math.random() * targets.length)];
    if (target) {
        target.addEffect(DonHanChoHp);
        target.addEffect(DonHanChoDmg);
        printer.print(source.color + " Don Han'Cho's battlecry gives smuggled equipment to " + target.name + " in " + context.player.color + " " + context.player.name + "'s hand, giving them +5/+5 (up to " + target.getDamage() + "/" + target.getHp() + ").");
    }
    else {
        printer.print(source.color + " Don Han'Cho has smuggled goods, but no one for his battlecry to give them to...");
    }
};

var DonHanChoHp = {
    name: "Smuggling",
    type: "buff health",
    num: 5
};

var DonHanChoDmg = {
    name: "Smuggling",
    type: "buff damage",
    num: 5
};

module.exports.JadeSpirit = function(target, source, context) {
    var golem = utilities.jadeSetup(JadeGolem(), context.player);
    printer.print(source.color + " " + source.name + "'s battlecry summons a " + golem.baseDamage + "/" + golem.baseHp + " " + golem.name + ".");
    utilities.summon(golem, context.player, context);
};

module.exports.LotusAgents = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry offers the " + context.player.color + " " + context.player.name + " a Druid, Rogue and Shaman card to choose from.");
    var options = utilities.Discover(cardLists.classCards("Druid"), cardLists.classCards("Rogue"), cardLists.classCards("Shaman"));
    var result = utilities.discoverChoose(options, context.player);
    if(context.player.hand.length < 10) {
        utilities.addCard(result, context.player, context);
        printer.print("Card chosen: " + result.name);
    } else {
        printer.print("No room in your hand for that card.");
    }
};

module.exports.KabalChemist = function(target, source, context) {
    var potionList = [];
    var cardList = cardLists.allCards();
    for (var i in cardList) {
        var card = cardList[i]();
        if (card.name.indexOf("Potion") >= 0) {
            potionList.push(card);
        }
    }
    printer.print(source.color + " " + source.name + "'s battlecry gives " + context.player.color + " " + context.player.name + " a random potion.");
    var spell = potionList[Math.floor(Math.random() * potionList.length)];
    if (context.player.hand.length < 10 && spell) {
        utilities.addCard(spell, context.player, context);
        printer.print(context.player.color + " " + context.player.name + " receives spell: " + spell.name);
    } else if(!spell) {
        printer.print("No potions exist in this gamemode!");
    }
};

var DeathspeakerDiscipleHp = {
    name: "Temporary Buff",
    type: "buff health",
    num: 2
};

var DeathspeakerDiscipleDmg = {
    name: "Temporary Buff",
    type: "buff damage",
    num: 3
};

module.exports.DeathspeakerDisciple = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + "'s battlecry infuses " + target.color + " " + target.name + " with dark power, giving them +3/+2 this turn.");
        target.addEffect(DeathspeakerDiscipleHp);
        target.addEffect(DeathspeakerDiscipleDmg);
        target.addEffect(effects.removeTempBuff);
    }
};

module.exports.FrostWyrm = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + "'s battlecry strikes " + target.color + " " + target.name + " with bone-chilling cold, dealing damage and freezing them.");
        utilities.dealDamage(target, 2, context);
        target.addEffect(effects.frozen);
    }
};

module.exports.YmirjarHuntress = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + "'s battlecry hurls a spear at " + target.color + " " + target.name + ", dealing 2 damage.");
        utilities.dealDamage(target, 2, context);
    }
};

module.exports.RavenousGeist = function(target, source, context) {
    var targets = [context.player];
    for(var i in context.player.minions) {
        if(context.player.minions[i] != source) {
            targets.push(context.player.minions[i]);
        }
    }
    target = targets[Math.floor(Math.random()*targets.length)];
    printer.print(source.color + " " + source.name + "'s battlecry mindlessly lashes out at " + target.color + " " + target.name + ".");
    utilities.Attack(source, target, context);
};

module.exports.Historian = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry discovers the location of an Artifact and shuffles it into your deck.");
    var artif = Artifacts();
    var options = utilities.Discover(artif[0], artif[1], artif[2]);
    var result = utilities.discoverChoose(options, context.player);
    printer.print("Card chosen: " + result.name);
    context.player.deck.push(result);
    utilities.shuffle(context.player.deck);
};

module.exports.CryptFiend = function(target, source, context) {
    if (target) {
        printer.print(source.color + " " + source.name + " releases their skitterlings to attack " + target.color + " " + target.name + ".");
        for (var i = 0; i < 2; i++) {
            var skitter = CryptFiendSkitterling();
            utilities.summon(skitter, context.player, context);
            skitter.owner = context.player;
            skitter.color = context.player.color;
            utilities.Attack(skitter, target, context);
        }
    }
};

var CryptFiendSkitterling = function() {
    return utilities.makeMinion(false, "Uncollectible", "Icecrown Citadel", ["Neutral"], "Skitterling", 0, 0, 1, 1, false, false, false, [effects.sickness], ais.true, CryptFiendSkitterling);
};

var DarkfallenKnightAction = function(source, context) {
    printer.print(source.color + " " + source.name + "'s bloodlink deals " + context.damage + " damage to " + source.bloodLink.color + " " + source.bloodLink.name + ".");
    utilities.dealDamage(source.bloodLink, context.damage, context);
};

var DarkfallenKnightEffect = {
    name: "Darkfallen Knight",
    type: "pain",
    action: DarkfallenKnightAction
};

module.exports.DarkfallenKnight = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + " establishes a bloodlink with " + target.color + " " + target.name + ", mirroring damage taken to the target.");
        source.bloodLink = target;
        source.addEffect(DarkfallenKnightEffect);
    }
};

module.exports.SkybreakerVindicator = function(target, source, context) {
    if(target) {
        if(target.owner == context.foe || target == context.foe) {
            printer.print(source.color + " " + source.name + " throws a blessed shield at " + target.color + " " + target.name + ", dealing 2 damage.");
            utilities.dealDamage(target, 2, context);
        }
        else {
            printer.print(source.color + " " + source.name + " grants " + target.color + " " + target.name + " a Divine Shield.");
            target.addEffect(effects.divineshield);
        }
    }
};

module.exports.DeathspeakerAttendant = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry purges effects from all minions without Deathrattles.");
    for(var i in context.player.minions) {
        if(!context.player.minions[i].hasEffectType("deathrattle")) {
            utilities.dispel(context.player.minions[i], context);
        }
    }
    for(i in context.foe.minions) {
        if(!context.foe.minions[i].hasEffectType("deathrattle")) {
            utilities.dispel(context.foe.minions[i], context);
        }
    }
};

var SanlaynBloodspeakerAction = function(source, context) {
    printer.print(source.color + " " + source.name + "'s bloodlink heals " + source.leechBloodLink.color + " " + source.leechBloodLink.name + " for " + context.damage + " Health.");
    utilities.healDamage(source.leechBloodLink, context.damage, context);
};

var SanlaynBloodspeakerEffect = {
    name: "San'layn Bloodspeaker",
    type: "pain",
    action: SanlaynBloodspeakerAction
};

module.exports.SanlaynBloodspeaker = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + " establishes a bloodlink between " + target.color + " " + target.name + " and " + context.player.color + " " + context.player.name + ".");
        target.leechBloodLink = context.player;
        target.addEffect(SanlaynBloodspeakerEffect);
    }
};

module.exports.YmirjarWarlord = function(target, source, context) {
    var validArray = cardLists.setCards("Icecrown Citadel");
    validArray = utilities.filterArray.hasType(validArray, "minion");
    printer.print(source.color + " " + source.name + "'s battlecry calls for reinforcements, Discovering a minion from Icecrown Citadel.");
    var options = utilities.Discover(validArray);
    var result = utilities.discoverChoose(options, context.player);
    printer.print("Card chosen: " + result.name);
    utilities.addCard(result, context.player, context);
};

module.exports.DarkfallenTactician = function(target, source, context) {
    var validArray = cardLists.setCards("Icecrown Citadel");
    validArray = utilities.filterArray.hasType(validArray, "spell");
    printer.print(source.color + " " + source.name + "'s battlecry offers a strategy, Discovering a spell from Icecrown Citadel.");
    var options = utilities.Discover(validArray);
    var result = utilities.discoverChoose(options, context.player);
    printer.print("Card chosen: " + result.name);
    utilities.addCard(result, context.player, context);
};

var Alchemy_Attack = {
    name: "Alchemy Attack Buff",
    alch: "Alchemy",
    type: "buff damage",
    num: 3
};

var Alchemy_Immune = {
    name: "Immune",
    alch: "Alchemy",
    type: "passive"
};

var Alchemy_Windfury = {
    name: "Windfury",
    alch: "Alchemy",
    type: "passive"
};

var Alchemy_Remove_Action = function(source, context) {
    source.removeEffect(Alchemy_Attack);
    source.removeEffect(Alchemy_Immune);
    source.removeEffect(Alchemy_Windfury);
    source.removeEffect(Alchemy_Remove);
};

var Alchemy_Remove = {
    name: "Alchemical Effect Removal (TM)",
    alch: "Alchemy",
    type: "end of turn",
    action: Alchemy_Remove_Action
}

module.exports.VolatileAlchemist = function(target, source, context) {
    if(target) {
        var alchemy = [
            {eff: Alchemy_Attack, str: "increases their damage"},
            {eff: Alchemy_Immune, str: "grants Immunity"},
            {eff: Alchemy_Windfury, str: "grants Windfury"}
        ];
        var effect = alchemy[Math.floor(Math.random()*alchemy.length)];
        printer.print(source.color + " " + source.name + " gives an alchemical vial to " + target.color + " " + target.name + " that " + effect.str + " until the end of the turn.");
        target.addEffect(effect.eff);
        target.addEffect(Alchemy_Remove);
    }
};

module.exports.Executioner = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + "'s battlecry executes " + target.color + " " + target.name + ".");
        utilities.kill(target, {
            player: context.foe,
            foe: context.player,
            cause: source
        });
    }
};

module.exports.DeathspeakerHighPriest = function(target, source, context) {
    var valid = [];
    for(var i = 0; i < 2; i++) {
        if(i==0) {
            var char = context.player;
        } else {
            char = context.foe;
        }
        for(var j in char.cardsPlayed) {
            valid.push(char.cardsPlayed[j]);
        }
    }
    printer.print(source.color + " " + source.name + "'s battlecry recovers three cards that were played this game and shuffles them into " + context.player.color + " " + context.player.name + "'s deck.");
    var cards = [];
    for(i = 0; i < 3; i++) {
        var notValid = true;
        while(notValid) {
            notValid = false;
            var card = valid[Math.floor(Math.random() * valid.length)];
            if(cards[0] && cards[0] == card) {
                notValid = true;
            } else if(cards[1] && cards[1] == card) {
                notValid = true;
            }
        }
        cards.push(card);
        context.player.deck.push(card);
    }
    utilities.shuffle(context.player.deck);
};

var PrinceValanarMin = function() {
    return utilities.makeMinion(false, "Legendary", "Icecrown Citadel", ["Neutral"], "Prince Valanar", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.PrinceValanar], ais.true, PrinceValanarMin);
};

var PrinceKelesethMin = function() {
    return utilities.makeMinion(false, "Legendary", "Icecrown Citadel", ["Neutral"], "Prince Keleseth", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.PrinceKeleseth], ais.true, PrinceKelesethMin);
};

var PrinceTaldaramMin = function() {
    return utilities.makeMinion(false, "Legendary", "Icecrown Citadel", ["Neutral"], "Prince Taldaram", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.PrinceTaldaram], ais.true, PrinceTaldaramMin);
};

var BloodPrinceCouncil = function() {
    return [
        [PrinceValanarMin()],
        [PrinceKelesethMin()],
        [PrinceTaldaramMin()]
    ];
};

module.exports.DarkfallenOrb = function(target, source, context) {
    printer.print(source.color + " " + source.name + " calls upon one of three Blood Princes.");
    var princes = BloodPrinceCouncil();
    var options = utilities.Discover(princes[0], princes[1], princes[2]);
    var result = utilities.discoverChoose(options, context.player);
    printer.print("Card chosen: " + result.name);
    utilities.addCard(result, context.player, context);
};

var BoneStormAbil = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Bone Storm, dealing 2 damage to all minions.");
    var hasCopied = false;
    var targets = [];
    for(var i in context.player.minions) {
        var minion = context.player.minions[i];
        if(minion.name != "Lord Marrowgar") {
            targets.push(minion);
        }
    }
    for(i in context.foe.minions) {
        minion = context.foe.minions[i];
        if(minion.name != "Lord Marrowgar") {
            targets.push(minion);
        }
    }
    
    for(i in targets) {
        utilities.dealSpellDamage(targets[i], 2, context);
        if(!targets[i].isAlive()) {
            i--;
            if(!hasCopied) {
                hasCopied = true;
                var card = BoneStorm();
                if(!context.player.boneStormCostUp) {
                    context.player.boneStormCostUp = 0;
                }
                context.player.boneStormCostUp++;
                for(var j = 0; j < context.player.boneStormCostUp; j++) {
                    card.cost++;
                }
                printer.print("A copy of Bone Storm is added to " + context.player.color + " " + context.player.name + "'s hand" + (card.cost > 3 ? " (cost increased to " + card.cost + ")." : "."));
                utilities.addCard(card, context.player, context);
            }
        }
    }
};

var BoneStormAi = function(context) {
    var value = 0;
    for(var i in context.foe.minions) {
        var hasSlain = false;
        value += 0.5;
        if(context.foe.minions[i].getHp() <= utilities.spellDamage(context.player, context.foe, 2)) {
            value += 1;
            if(!hasSlain) {
                value += 1.5;
                hasSlain = true;
            }
        }
    }
    for(var i in context.player.minions) {
        value -= 0.5;
        if(context.player.minions[i].getHp() <= utilities.spellDamage(context.player, context.foe, 2)) {
            value -= 1;
            if(!hasSlain) {
                value += 1.5;
                hasSlain = true;
            }
        }
    }
    return value >= (utilities.getCardCost(context.cause, context) / 2);
};

var BoneStorm = function() {
    return utilities.makeSpell("Legendary", "Icecrown Citadel", ["Neutral"], "Bone Storm", 3, 0, BoneStormAbil, false, false, BoneStormAi, BoneStorm);
};

module.exports.LordMarrowgar = function(target, source, context) {
    printer.print(source.color + " " + source.name + " grants " + context.player.color + " " + context.player.name + " a use of Bone Storm.");
    utilities.addCard(BoneStorm(), context.player, context);
};

var FestergutHp = {
    name: "Festergut",
    type: "buff health",
    num: 2
};

module.exports.Festergut = function(target, source, context) {
    printer.print(source.color + " " + source.name + " releases a cloud of gas, dealing 1 damage to all other minions.");
    var targets = [];
    for(var i in context.player.minions) {
        if(context.player.minions[i] != source) {
            targets.push(context.player.minions[i]);
        }
    }
    for(i in context.foe.minions) {
        targets.push(context.foe.minions[i]);
    }
    for(i in targets) {
        utilities.dealDamage(targets[i], 1, context);
        if(!targets[i].isAlive()) {
            i--;
            printer.print(source.name + " is fed by death, gaining +2 Health.");
            source.addEffect(FestergutHp);
        }
    }
};

var RotfaceHp = {
    name: "Rotface",
    type: "buff health",
    num: 1
};

var RotfaceDmg = {
    name: "Rotface",
    type: "buff damage",
    num: 1
};

module.exports.Rotface = function(target, source, context) {
    var num = 0;
    for(var i in context.player.minions) {
        if(context.player.minions[i] != source && context.player.minions[i].getHp() < context.player.minions[i].getMaxHp()) {
            num++;
        }
    }
    for(i in context.foe.minions) {
        if(context.foe.minions[i].getHp() < context.foe.minions[i].getMaxHp()) {
            num++;
        }
    }
    printer.print(source.color + " " + source.name + " is enraged by damaged minions, gaining +1/+1 for each (a total of +" + num + "/+" + num + ").");
    for(var i = 0; i < num; i++) {
        source.addEffect(RotfaceHp);
        source.addEffect(RotfaceDmg);
    }
};

module.exports.SisterSvalna = function(target, source, context) {
    if(target) {
        printer.print(source.color + " " + source.name + " hurls a dark spear at " + target.name + ", dealing 2 damage.");
        utilities.dealDamage(target, 2, context);
        if(!target.isAlive()) {
            printer.print(source.color + " " + source.name + " reanimates the corpse of " + target.name);
            utilities.summon(target.card(), context.player, context);
        }
    }
};

module.exports.Spellslinger = function(target, source, context) {
    var spellList = [];
    var cardList = cardLists.allCards();
    for (var i in cardList) {
        var card = cardList[i]();
        if (card.type == "spell") {
            spellList.push(card);
        }
    }
    printer.print(source.color + " " + source.name + "'s battlecry gives each player a random spell.");
    var spell = spellList[Math.floor(Math.random() * spellList.length)];
    if (context.player.hand.length < 10) {
        utilities.addCard(spell, context.player, context);
        printer.print(context.player.color + " " + context.player.name + " receives spell: " + spell.name);
    }
    spell = spellList[Math.floor(Math.random() * spellList.length)];
    if (context.foe.hand.length < 10) {
        utilities.addCard(spell, context.foe, {player: context.foe, foe: context.player});
        printer.print(context.foe.color + " " + context.foe.name + " receives spell: " + spell.name);
    }
};

var ArcaneBlast = function() {
    return utilities.makeSpell("Epic", "The Grand Tournament", ["Mage"], "Arcane Blast", 1, 0, abilities.ArcaneBlast, targetais.ArcaneShot, filters.minion, ais.ArcaneShot, ArcaneBlast, 68);
};

module.exports.KirinTorBattleMage = function(target, source, context) {
    var num = 0;
    for(var i in context.player.shallowGraves) {
        if(context.player.shallowGraves[i].type == "spell") {
            num++;
        }
    }
    printer.print(source.color + " " + source.name + "'s battlecry grants " + context.player.color + " " + context.player.name + " " + num + " copies of Arcane Blast.");
    for(i in num) {
        utilities.addCard(ArcaneBlast(), context.player, context);
    }
};

module.exports.ArchmageKhadgar = function(target, source, context) {
    printer.print(source.color + " " + source.name + " creates three portals for the " + context.player.color + " " + context.player.name + ".");
    var portalList = utilities.filterArray.hasName(cardLists.allCards(), "Portal", true);
    for(var i = 0; i < 3; i++) {
        var portal = portalList[Math.floor(Math.random() * portalList.length)];
        printer.print("Portal received: " + portal.name + ".");
        utilities.addCard(portal, context.player, context);
    }
};

module.exports.RavagingGhoul = function(target, source, context) {
    printer.print("The " + source.color + " " + source.name + "'s battlecry explodes, dealing 1 damage to all other minions.");
    var targets = context.player.minions.slice();
    for(var i in context.foe.minions) {
        targets.push(context.foe.minions[i]);
    }
    for(var i in targets) {
        utilities.dealDamage(targets[i], 1, {player: context.player, foe: context.foe, cause: context.player});
    }
};

module.exports.AncientShieldbearer = function(target, source, context) {
    printer.print(source.color + " Ancient Shieldbearer's battlecry draws power from C'Thun!");
    var cthun = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].name === "C'Thun") {
            printer.print(context.player.minions[i].getDamage() + "/" + context.player.minions[i].getHp() + " C'Thun located!");
            cthun = context.player.minions[i].getDamage() >= 10;
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].name === "C'Thun") {
            printer.print(context.player.hand[i].getDamage() + "/" + context.player.hand[i].getHp() + " C'Thun located!");
            cthun = context.player.hand[i].getDamage() >= 10;
        }
    }
    for (i = 0; i < context.player.deck.length; i++) {
        if (context.player.deck[i].name === "C'Thun") {
            printer.print(context.player.deck[i].getDamage() + "/" + context.player.deck[i].getHp() + " C'Thun located!");
            cthun = context.player.deck[i].getDamage() >= 10;
        }
    }
    if (cthun) {
        printer.print(source.color + " Ancient Shieldbearer is empowered, giving " + context.player.color + " " + context.player.name + " 10 Armor!");
        context.player.armor += 10;
    }
    else {
        printer.print(source.color + " Ancient Shieldbearer is not empowered, as C'Thun is not yet strong enough.");
    }
};

var AshenDefenderDmg = {
    name: "Ashen Defender",
    type: "buff damage",
    num: 1
};

module.exports.AshenDefender = function(target, source, context) {
    var taunts = 0;
    for(var i in context.player.minions) {
        if(context.player.minions[i].hasEffectName("Taunt") && context.player.minions[i] != source) {
            taunts++;
        }
    }
    for(i in context.foe.minions) {
        if(context.foe.minions[i].hasEffectName("Taunt") && context.player.minions[i] != source) {
            taunts++;
        }
    }
    printer.print(source.color + " " + source.name + "'s battlecry grants +1 Attack for each other Taunt minion (a total of +" + taunts + ").");
    for(i = 0; i < taunts;i++) {
        source.addEffect(AshenDefenderDmg);
    }
};

var Cleave = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warrior"], "Cleave", 2, 0, abilities.Cleave, false, false, ais.Cleave, Cleave, 67);
};

module.exports.HighOverlordSaurfang = function(target, source, context) {
    printer.print(source.color + " " + source.name + " grants " + context.player.color + " " + context.player.name + " three free copies of Cleave, a tiny sliver of his power.");
    for(var i = 0; i < 3; i++) {
        utilities.addCard(Cleave(), context.player, context);
    }
};

module.exports.IronJuggernaut = function(target, source, context) {
    printer.print(source.color + " Iron Juggernaut places a dangerous Mine into " + context.foe.color + " " + context.foe.name + "'s deck, ready to explode at any minute.");
    context.foe.deck.push(Mine());
    utilities.shuffle(context.foe.deck);
};

module.exports.DruidoftheFlame = function(target, source, context) {
    var druidForm = Math.round(Math.random(0, 1));
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].name === "Druid of the Flame" && context.player.minions[i].race !== "Beast") {
            context.player.minions.splice(i, 1);
        }
    }
    if (druidForm === 0) {
        printer.print(context.player.color + " Druid of the Flame transforms into a 5/2 Firecat.");
        utilities.summon(DruidoftheFlame_FireCat(context.player.color), context.player, context);
    }
    if (druidForm === 1) {
        printer.print(context.player.color + " Druid of the Flame transforms into a 2/5 Firebird.");
        utilities.summon(DruidoftheFlame_FireBird(context.player.color), context.player, context);
    }
};

var StormforgedAxe = function() {
    return utilities.makeWeapon("Common", "Classic", ["Shaman"], "Stormforged Axe", 2, 1, 2, 3, false, false, false, [], ais.true, StormforgedAxe); // add tier
};

module.exports.TuskarrWeaponsmith = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry fashions a Stormforged Axe for the " + context.player.color + " " + context.player.name + ".");
    utilities.Equip(StormforgedAxe(), context);
};

module.exports.CoreRager = function(target, source, context) {
    if (context.player.hand.length === 0) {
        printer.print(source.color + " Core Rager's battlecry empowers them, increasing their Health and Damage by 3.");
        source.addEffect(effects.CoreRagerBuffHp);
        source.addEffect(effects.CoreRagerBuffDamage);
    }
};

module.exports.KingsElekk = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry calls for a Joust!");
    var results = utilities.Joust(context.player, context.foe);
    if (results.winner) {
        var card = results.playerMinion;
        context.player.deck.splice(context.player.deck.indexOf(card), 1);
        context.player.deck.unshift(card);
        utilities.drawCard(context.player, context);
    }
};

var PreciousDebuff = {
    name: "rawr xD",
    type: "set health",
    num: 1
};

module.exports.Precious = function(target, source, context) {
    printer.print(source.color + " " + source.name + " smashes the ground, reducing all enemy minions to 1 Health.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        context.foe.minions[i].addEffect(PreciousDebuff);
    }
};

module.exports.KlaxxiAmberWeaver = function(target, source, context) {
    printer.print(source.color + " Klaxxi Amber-Weaver's battlecry draws power from C'Thun!");
    var cthun = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].name === "C'Thun") {
            printer.print(context.player.minions[i].getDamage() + "/" + context.player.minions[i].getHp() + " C'Thun located!");
            cthun = context.player.minions[i].getDamage() >= 10;
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].name === "C'Thun") {
            printer.print(context.player.hand[i].getDamage() + "/" + context.player.hand[i].getHp() + " C'Thun located!");
            cthun = context.player.hand[i].getDamage() >= 10;
        }
    }
    for (i = 0; i < context.player.deck.length; i++) {
        if (context.player.deck[i].name === "C'Thun") {
            printer.print(context.player.deck[i].getDamage() + "/" + context.player.deck[i].getHp() + " C'Thun located!");
            cthun = context.player.deck[i].getDamage() >= 10;
        }
    }
    if (cthun) {
        printer.print(source.color + " Klaxxi Amber-Weaver is empowered, gaining +5 Health!");
        source.addEffect(AmberWeaver);
    }
    else {
        printer.print(source.color + " Klaxxi Amber-Weaver is not empowered, as C'Thun is not yet strong enough.");
    }
};

var AmberWeaver = {
    name: "Amber-Weaver Buff",
    type: "buff health",
    num: 5
};

module.exports.KorkronPrimalist = function(target, source, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print(source.color + " " + source.name + "'s battlecry creates a natural ward around " + target.color + " " + target.name + ", protecting them from harm until the end of the turn.");
        target.addEffect(effects.tempImmune);
        target.addEffect(effects.removeTempEoT);
    }
    if(context.choice==1 || context.choice==2) {
        printer.print(source.color + " " + source.name + "'s battlecry grants " + target.color + " " + target.name + " swiftness until the end of the turn.");
        target.addEffect(effects.tempWindfury);
        target.addEffect(effects.removeTempEoT);
    }
};

module.exports.AncientofLore = function(target, source, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print(source.color + " Ancient of Lore's battlecry restores Health to " + target.color + " " + target.name + ".");
        utilities.healDamage(target, 5, context);
    } if(context.choice==1 || context.choice==2) {
        printer.print(source.color + " Ancient of Lore's battlecry draws a card.");
        utilities.drawCard(context.player, context);
    }
};

module.exports.AncientofWar = function(target, source, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print(source.color + " Ancient of War's battlecry uproots it, gaining +5 Attack.");
        source.addEffect(AncientofWarDmg);
    } if(context.choice==1 || context.choice==2) {
        printer.print(source.color + " Ancient of War's battlecry sinks roots deep into the earth, gaining +5 Health and Taunt.");
        source.addEffect(AncientofWarHp);
        source.addEffect(effects.taunt);
    }
};

var AncientofWarHp = {
    name: "Rooted",
    type: "buff health",
    num: 5
};

var AncientofWarDmg = {
    name: "Uprooted",
    type: "buff damage",
    num: 5
};

module.exports.Cenarius = function(target, source, context) {
    if (context.choice==0 || context.choice==2) {
        printer.print(source.color + " Cenarius's battlecry summons 2 " + source.color + " Treants with Taunt.");
        for(var i = 0; i < 2; i++) {
            utilities.summon(Treant(context.player.color), context.player, context);
        }
    }
    if (context.choice==1 || context.choice==2) {
        printer.print(source.color + " Cenarius's battlecry empowers friendly minions, improving their health and damage.");
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i]
            if (minion !== source) {
                minion.addEffect(effects.CenariusBuffHp);
                minion.addEffect(effects.CenariusBuffDamage);
            }
        }
    }
};

module.exports.HamuulRunetotem = function(target, source, context) {
    var minions = [];
    for(var i in context.player.cardsPlayed) {
        if(context.player.cardsPlayed[i].battlecry) {
            minions.push(context.player.cardsPlayed[i].card());
        }
    }
    var minion = minions[minions.length - 1];
    if(minion) {
        printer.print(source.color + " " + source.name + " communes with the spirit of " + minion.name + " and gains their Battlecry!");
        source.battlecry = minion.battlecry;
    }
};

module.exports.Succubus = function(target, source, context) {
    utilities.discardCard(context.player, {
        player: context.player,
        foe: context.foe,
        cause: source
    });
};

var IcecrownValkyrHp = {
    name: "Edge of the Abyss",
    type: "set health",
    num: 1
};

module.exports.IcecrownValkyr = function(target, source, context) {
    var minions = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i].card();
        if(card.type == "minion" && card.hasEffectType("deathrattle")) {
            minions.push(card);
        }
    }
    var minion = minions[minions.length-1];
    if(minion) {
        printer.print(source.color + " " + source.name + " reanimates the body of " + minion.name + " with 1 Health.");
        minion.addEffect(IcecrownValkyrHp);
        utilities.summon(minion, context.player, context);
    }
};

var Murghoul = function() {
    return utilities.makeMinion("Murloc", "Uncollectible", "Icecrown Citadel", ["Warlock"], "Mur'ghoul", 2, 0, 2, 3, false, false, false, [effects.sickness], ais.true, Murghoul);
};

module.exports.VilefinNecromancer = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s necrotic magic destroys all friendly minions, replacing them with Mur'ghouls.");
    var old = context.player.minions.slice();
    for(var i in old) {
        if(old[i] != source) {
            utilities.kill(old[i], {
                player: context.foe,
                foe: context.player,
                cause: source
            });
            utilities.summon(Murghoul(), context.player, context);
        }
    }
};

module.exports.LordJaraxxus = function(target, source, context) {
    printer.print(source.color + " Lord Jaraxxus's battlecry incinerates the " + context.player.color + " " + context.player.name + " instantly and takes their place.");
    context.player.hero = heroes.LordJaraxxus;
    printer.print(source.name + " replaces their Hero Power with INFERNO.");
    context.player.ability = heroes.LordJaraxxus.ability;
    context.player.name = source.name;
    printer.print(source.name + " sets their Health to " + source.getHp() + ".");
    context.player.baseHp = source.getMaxHp();
    context.player.damageTaken = source.damageTaken;
    utilities.Equip(BloodFury(), context);
    context.player.minions.splice(context.player.minions.indexOf(source), 1);
};

module.exports.GuardianofKings = function(target, source, context) {
    printer.print(source.color + " Guardian of Kings' battlecry restores 6 health to " + context.player.color + " " + context.player.name + ".");
    utilities.healDamage(context.player, 6, context);
};

module.exports.KingsHerald = function(target, source, context) {
    var mins = [];
    for(var i in context.player.hand) {
        var min = context.player.hand[i];
        if(min.type == "minion") {
            mins.push(min);
        }
    }
    target = mins[Math.floor(Math.random() * mins.length)];
    printer.print(source.color + " " + source.name + "'s battlecry heralds the arrival of " + target.name + ", gaining its card text.");
    source.battlecry = target.battlecry;
    source.targetai = target.targetai;
    source.filter = target.filter;
    source.effects = target.effects.slice();
};

module.exports.TerenasMenethil = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry restores three minions that died this game.");
    var minions = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i].card();
        if(card.type == "minion") {
            minions.push(card);
        }
    }
    for(i = 0; i < 3; i++) {
        var randomNum = Math.floor(Math.random(0, 1) * minions.length);
        var minion = minions[randomNum];
        if(minion) {
            minions.splice(minions.indexOf(minion), 1);
            printer.print("Minion resurrected: " + minion.name + ".");
            utilities.summon(minion, context.player, context);
        }
    }
};

module.exports.TwilightWhelp = function(target, source, context) {
    var hasDragon = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if (hasDragon) {
        printer.print(source.color + " Twilight Whelp's battlecry triggers and gives it +2 Health!");
        source.addEffect(TwilightWhelpBuff);
    }
    else {
        printer.print(source.color + " Twilight Whelp's battlecry does NOT trigger. There are no dragons in " + context.player.color + " " + context.player.name + "'s hand.");
    }
};

var TwilightWhelpBuff = {
    name: "Twilight Whelp",
    type: "buff health",
    num: 2
};

module.exports.WyrmrestAgent = function(target, source, context) {
    var hasDragon = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if (hasDragon) {
        printer.print(source.color + " Wyrmrest Agent's battlecry triggers and gives it +1 Attack and Taunt!");
        source.addEffect(WyrmrestAgentBuff);
        source.addEffect(effects.taunt);
    }
    else {
        printer.print(source.color + " Wyrmrest Agent's battlecry does NOT trigger. There are no dragons in " + context.player.color + " " + context.player.name + "'s hand.");
    }
};

var WyrmrestAgentBuff = {
    name: "Wyrmrest Agent",
    type: "buff damage",
    num: 1
};

module.exports.SoulbinderTuulani = function(target, source, context) {
    var minions = [];
    for(var i in context.player.cardsPlayed) {
        if(context.player.cardsPlayed[i].hasEffectType("deathrattle")) {
            minions.push(context.player.cardsPlayed[i].card());
        }
    }
    var minion = minions[minions.length - 1];
    if(minion) {
        printer.print(source.color + " " + source.name + " communes with the spirit of " + minion.name + " and gains their Deathrattle!");
        for(i in minion.effects) {
            if(minion.effects[i].type == "deathrattle") {
                source.addEffect(minion.effects[i]);
            }
        }
    }
};

var BoomBot = function() {
    return utilities.makeMinion("Mech", "Goblins vs Gnomes", "Common", ["Neutral"], "Boom Bot", 1, 0, 1, 1, false, false, false, [effects.sickness, deathrattles.BoomBot_Deathrattle], ais.BoomBot, BoomBot);
};

var MaptotheGoldenMonkey = function() {
    return utilities.makeSpell("Special", "League of Explorers", ["Neutral"], "Map to the Golden Monkey", 2, 0, abilities.MaptotheGoldenMonkey, false, false, ais.MaptotheGoldenMonkey, MaptotheGoldenMonkey);
};

var JadeGolem = function() {
    return utilities.makeMinion(false, "Uncollectible", "Mean Streets of Gadgetzan", ["Neutral"], "Jade Golem", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.true, JadeGolem);
};

var Mine = function() {
    return utilities.makeSpell("Special", "Goblins vs Gnomes", ["Warrior"], "Burrowing Mine", 0, 0, abilities.BurrowingMine, false, false, "on draw", Mine);
};

var DruidoftheFlame_FireCat = function() {
    return utilities.makeMinion("Beast", "Common", "Blackrock Mountain", ["Druid"], "Druid of the Flame", 3, 0, 2, 5, false, false, false, [effects.sickness], ais.DruidoftheFlame, DruidoftheFlame_FireCat);
};

var DruidoftheFlame_FireBird = function() {
    return utilities.makeMinion("Beast", "Common", "Blackrock Mountain", ["Druid"], "Druid of the Flame", 3, 0, 5, 2, false, false, false, [effects.sickness], ais.DruidoftheFlame, DruidoftheFlame_FireBird);
};

var Treant = function() {
    return utilities.makeMinion(false, "Common", "Classic", ["Druid"], "Treant", 2, 0, 2, 2, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Treant);
};

var BloodFury = function() {
    return utilities.makeWeapon("Legendary", "Classic", ["Warlock"], "Blood Fury", 5, 0, 3, 8, false, false, false, [], ais.MurlocRaider, BloodFury);
};

var WhirlingBlades = module.exports.WhirlingBlades = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Whirling Blades", 1, 0, abilities.WhirlingBlades,
        targetais.WhirlingBlades, filters.minion, ais.WhirlingBlades, WhirlingBlades, 50);
};

var ArmorPlating = module.exports.ArmorPlating = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Armor Plating", 1, 0, abilities.ArmorPlating,
        targetais.ArmorPlating, filters.minion, ais.ArmorPlating, ArmorPlating, 50);
};

var RustyHorn = module.exports.RustyHorn = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Rusty Horn", 1, 0, abilities.RustyHorn,
        targetais.RustyHorn, filters.minion, ais.RustyHorn, RustyHorn, 50);
};

var EmergencyCoolant = module.exports.EmergencyCoolant = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Emergency Coolant", 1, 0, abilities.EmergencyCoolant,
        targetais.EmergencyCoolant, filters.minion, ais.EmergencyCoolant, EmergencyCoolant, 50);
};

var FinickyCloakfield = module.exports.FinickyCloakfield = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Finicky Cloakfield", 1, 0, abilities.FinickyCloakfield,
        targetais.FinickyCloakfield, filters.minion, ais.FinickyCloakfield, FinickyCloakfield, 50);
};

var ReversingSwitch = module.exports.ReversingSwitch = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Reversing Switch", 1, 0, abilities.ReversingSwitch,
        targetais.ReversingSwitch, filters.minion, ais.ReversingSwitch, ReversingSwitch, 50);
};

var TimeRewinder = module.exports.TimeRewinder = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", ["Neutral"], "Time Rewinder", 1, 0, abilities.TimeRewinder,
        targetais.TimeRewinder, filters.minion, ais.TimeRewinder, TimeRewinder, 50);
};

var SpareParts = module.exports.SpareParts = [
    module.exports.WhirlingBlades,
    module.exports.ArmorPlating,
    module.exports.RustyHorn,
    module.exports.EmergencyCoolant,
    module.exports.FinickyCloakfield,
    // module.exports.ReversingSwitch,
    module.exports.TimeRewinder
];

var Arthas_ValiantFootmanBuff = {
    name: "Blocking",
    type: "buff health",
    num: 2
};

var Arthas_ValiantFootmanBlock = function(source, context) {
    printer.print(source.color + " " + source.name + " raises their shield, gaining +2 Health and Taunt.");
    source.effects.push(effects.taunt);
    source.effects.push(Arthas_ValiantFootmanBuff);
    for (var i in source.effects) {
        if (source.effects[i] && source.effects[i].name == "Prep For Block") {
            source.effects.splice(i, 1);
        }
    }
};

var Arthas_ValiantFootmanPrepForBlock = {
    name: "Prep For Block",
    type: "start of turn friend",
    action: Arthas_ValiantFootmanBlock
};

module.exports.Arthas_ValiantFootman = function(target, source, context) {
    source.effects.push(Arthas_ValiantFootmanPrepForBlock);
};

module.exports.Arthas_BladeofWrath = function(target, source, context) {
    var totalDamage = context.player.damageTaken;
    for (var i in context.player.minions) {
        totalDamage += context.player.minions[i].damageTaken;
    }
    var explosion = Math.floor(totalDamage / 3);

    printer.print("The " + context.player.color + " " + context.player.name + "'s " + source.name + " blasts " + target.color + " " + target.name + ", dealing damage based on " + context.player.name + "'s wounds.");
    utilities.dealSpellDamage(target, explosion, context);
};

module.exports.Arthas_DeathboundNerubian = function(target, source, context) {
    if (target) {
        printer.print(source.color + " " + source.name + " releases their skitterlings to attack " + target.color + " " + target.name + ".");
        for (var i = 0; i < 2; i++) {
            var skitter = Arthas_DeathboundNerubian_Skitterling();
            utilities.summon(skitter, context.player, context);
            utilities.Attack(skitter, target, context);
        }
    }
};

var Arthas_DeathboundNerubian_Skitterling = module.exports.Arthas_DeathboundNerubian_Skitterling = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", false, "Skitterling", 0, 0, 1, 1, false, false, false, [effects.sickness], ais.true, Arthas_DeathboundNerubian_Skitterling);
};
