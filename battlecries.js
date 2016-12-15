var utilities = require('./utilities.js');
var printer = require('./printer.js')
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
    printer.print(context.player.color + " Spellbreaker's battlecry nullifies all magic surrounding " + target.color + " " + target.name + ", silencing them.");
    utilities.dispel(target, context);
};

module.exports.BigGameHunter = function(target, source, context) {
    printer.print(source.color + " " + source.name + "'s battlecry shoots " + target.name + " with a very large gun.");
    utilities.kill(target, {
        player: context.foe,
        foe: context.player,
        cause: source
    });
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
        var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
        context.player.hand.push(SpareParts[sparePartNum]());
        printer.print(context.player.color + " " + context.player.name + " receives : " + SpareParts[sparePartNum]().name + ".");
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
    context.player.hand.push(part);
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
        var card = cards[i]();
        if(card.type == "spell") {
            spellList.push(card);
        }
    }
    for (i = 0; i < 2; i++) {
        var spell = spellList[Math.floor(Math.random()*spellList.length)];
        if (context.player.hand.length < 10) {
            printer.print("Spell received: " + spell.name);
            context.player.hand.push(spell);
        }
        else {
            printer.print("Hand too full! Could not receive card.");
        }
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
        if (cardList[i].rarity == "Legendary" && cardList[i].type == "minion") {
            legendList.push(cardList[i]);
        }
    }
    for (i = 0; i < context.player.hand.length; i++) {
        var randomNum = Math.floor(legendList.length * Math.random(0, 1));
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
        context.player.damageTaken = 0;
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
        printer.print(source.color + " Don Han'Cho's battlecry gives smuggled equipment to " + target.name + " in " + context.player.color + " " + context.player.name + "'s hand, giving them +5/+5 (up to " + target.getDamage() + "/" + target.getHp() + ".");
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
        context.player.hand.push(result);
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
        context.player.hand.push(potion);
        printer.print(context.player.color + " " + context.player.name + " receives spell: " + potion.name);
    } else if(!spell) {
        printer.print("No potions exist in this gamemode!");
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
        context.player.hand.push(spell);
        printer.print(context.player.color + " " + context.player.name + " receives spell: " + spell.name);
    }
    spell = spellList[Math.floor(Math.random() * spellList.length)];
    if (context.foe.hand.length < 10) {
        context.foe.hand.push(spell);
        printer.print(context.foe.color + " " + context.foe.name + " receives spell: " + spell.name);
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

module.exports.IronJuggernaut = function(target, source, context) {
    printer.print(source.color + " Iron Juggernaut places a dangerous Mine into " + context.foe.color + " " + context.foe.name + "'s deck, ready to explode at any minute.");
    context.player.deck.push(Mine(context.foe.color));
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

module.exports.Succubus = function(target, source, context) {
    utilities.discardCard(context.player, {
        player: context.player,
        foe: context.foe,
        cause: source
    });
};

module.exports.LordJaraxxus = function(target, source, context) {
    printer.print(source.color + " Lord Jaraxxus's battlecry replaces the " + context.player.color + " " + context.player.name + " with the hero Lord Jaraxxus.");
    context.player.hero = heroes.LordJaraxxus;
    context.player.ability = heroes.LordJaraxxus.ability;
    context.player.name = "Lord Jaraxxus";
    context.player.baseHp = source.getMaxHp();
    context.player.damageTaken = source.damageTaken;
    utilities.Equip(BloodFury(), context);
    context.player.minions.splice(context.player.minions.indexOf(source), 1);
};

module.exports.GuardianofKings = function(target, source, context) {
    printer.print(source.color + " Guardian of Kings' battlecry restores 6 health to " + context.player.color + " " + context.player.name + ".");
    utilities.healDamage(context.player, 6, context);
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
