var utilities = require('./utilities.js');
var printer = require('./printer.js')
var weapons = require('./weapons.js');
var effects = require('./effects.js');
var battlecries = require('./battlecries.js');
var deathrattles = require('./deathrattles.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');
var cardLists = require('./cardlists.js');

module.exports.MageFireblast = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Fireblast on " + target.color + " " + target.name + ".");
    utilities.dealDamage(target, 1, context);
};

module.exports.WarriorArmorUp = function(target, context) {
    utilities.addArmor(context.player, 2, context);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Armor Up!, gaining 2 Armor for a total of " + context.player.armor + ".");
};

module.exports.RogueWickedKnife = function(target, context) {
    utilities.Equip(WickedKnife(), context);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Dagger Mastery and equips a Wicked Knife.");
};

module.exports.ShamanTotemicCall = function(target, context) {
    var totem = false;
    var TotemNum = Math.floor(4 * Math.random(0, 1));
    if(TotemNum === 0) {
        totem = StonetalonTotem();
    }
    if(TotemNum === 1) {
        totem = HealingTotem();
    }
    if(TotemNum === 2) {
        totem = WrathofAirTotem();
    }
    if(TotemNum === 3) {
        totem = SearingTotem();
    }
    printer.print("The " + context.player.color + " " + context.player.name + " casts Totemic Call, summoning a " + totem.name + ".");
    utilities.summon(totem, context.player, context);
};

module.exports.HunterSteadyShot = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " fires a Steady Shot at the " + context.foe.color + " " + context.foe.name + ".");
    utilities.dealDamage(context.foe, 2, context);
};

module.exports.DruidShapeshift = function(target, context) {
    utilities.addArmor(context.player, 1, context);
    context.player.addEffect(effects.DruidClaws);
    context.player.addEffect(effects.removeTempBuff);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Shapeshift, gaining 1 Armor and 1 Damage this turn.");
};

module.exports.WarlockLifeTap = function(target, context) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Life Tap, drawing a card at the cost of 2 Health and reducing them to "
        + (context.player.getHp() - 2 >= 0 ? context.player.getHp() - 2 : 0) + " remaining health" + (context.player.armor > 0 ? " and " + context.player.armor + " Armor." : "."));
        utilities.dealDamage(context.player, 2, context);
        utilities.drawCard(context.player, context);
        return context.player.hand[context.player.hand.length - 1];
};

module.exports.PaladinReinforce = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Reinforce, summoning a 1/1 Silver Hand Recruit.");
    utilities.summon(SilverHandRecruit(), context.player, context);
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Silver Hand Recruit") {
            context.player.minions[i].color = context.player.color;
        }
    }
};

module.exports.PriestLesserHeal = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Lesser Heal on " + target.name + ", restoring 2 health.");
    utilities.healDamage(target, 2, context);
};

var PriestShadowformMindSpike = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Mind Spike on " + target.name + ", dealing 2 damage.");
    utilities.dealDamage(target, 2, context);
};

var PriestShadowformMindShatter = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Mind Shatter on " + target.name + ", dealing 3 damage.");
    utilities.dealDamage(target, 3, context);
};

module.exports.WhirlingBlades = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses a Whirling Blades Spare Part on " + target.name + ", giving it +1 damage.");
        target.addEffect(effects.WhirlingBlades);
    }
};

module.exports.ArmorPlating = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses an Armor Plating Spare Part on " + target.name + ", giving it +1 health.");
        target.addEffect(effects.ArmorPlating);
    }
};

module.exports.RustyHorn = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses a Rusty Horn Spare Part on " + target.name + ", giving it Taunt.");
        target.addEffect(effects.taunt);
    }
};

module.exports.EmergencyCoolant = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses an Emergency Coolant Spare Part on " + target.name + ", Freezing it.");
        target.addEffect(effects.frozen);
    }
};

module.exports.FinickyCloakfield = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses a Finicky Cloakfield Spare Part on " + target.name + ", giving them Stealth for a turn..");
        target.addEffect(effects.tempstealth);
    }
};

module.exports.ReversingSwitch = function(target, context) {
    if(target.getHp() > 0) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses a Reversing Switch Spare Part on " + target.name + ", swapping their health and damage.");
        target.addEffect(effects.ReversingSwitchHp);
        target.addEffect(effects.ReversingSwitchDamage);
    }
};

module.exports.TimeRewinder = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " uses a Time Rewinder Spare Part on " + target.name + ", returning them to their owner's hand.");
        target.damageTaken = 0;
        target.damageLost = 0;
        utilities.addCard(target, context.player, context);
        context.player.minions.splice(context.player.minions.indexOf(target), 1);
    }
};

module.exports.TheCoin = function(target, context) {
    context.player.mana += 1;
    printer.print("The " + context.player.color + " " + context.player.name + " plays The Coin, gaining 1 mana crystal and bringing their total up to " + context.player.mana + ".");
};

module.exports.LanternofPower = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " shines the light of the Lantern of Power upon " + target.color + " " + target.name + ", granting them an incredible surge of power.");
    target.addEffect(LanternofPowerHp);
    target.addEffect(LanternofPowerDmg);
};

var LanternofPowerHp = {
    name: "Light of the Lantern",
    type: "buff health",
    num: 10
};

var LanternofPowerDmg = {
    name: "Light of the Lantern",
    type: "buff damage",
    num: 10
};

module.exports.MirrorofDoom = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " looks into the Mirror of Doom and it gazes back at them. An army of mummy zombies rise from the earth surrounding the Mirror, ready to serve the " + context.player.name + ".");
    for(var i = 0; i < 7; i++) {
        utilities.summon(MummyZombie(), context.player, context);
    }
};

var MummyZombie = function() {
    return utilities.makeMinion(false, "Uncollectible", "League of Explorers", ["Neutral"], "Mummy Zombie", 3, 0, 3, 3, false, false, false, [effects.sickness], ais.true, MummyZombie);
};

module.exports.TimepieceofHorror = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " activates the Timepiece of Horror, and it's high noon! The clock launches " + utilities.spellDamage(context.player, context.foe, 10) + " sharpened gears randomly at the " + context.player.name + "'s enemies!");
    for(var i = 0; i < utilities.spellDamage(context.player, context.foe, 10); i++) {
        target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        utilities.dealDamage(target, 1, context);
        if(target.getHp() < 0) {
            i -= 1;
        }
    }
};

module.exports.MaptotheGoldenMonkey = function(target, context) {
    var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
    printer.print("The " + context.player.color + " " + context.player.name + " plays the Map to the Golden Monkey, shuffling 'The Golden Monkey' into their deck and drawing a card.");
    context.player.deck.splice(randomNum, 0, GoldenMonkey(context.player.color));
    utilities.drawCard(context.player, context);
};

module.exports.Fireball = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Fireball on " + target.name + ".");
    utilities.dealSpellDamage(target, 6, context);
};

module.exports.ArcaneMissiles = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Arcane Missiles, firing " + utilities.spellDamage(context.player, context.foe, 3) + " missiles randomly at enemies.");
    for(var i = 0; i < utilities.spellDamage(context.player, context.foe, 3); i++) {
        target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        if(target.getHp() > 0) {
            printer.print("An Arcane Missile is fired at " + target.name + ".");
            utilities.dealDamage(target, 1, context);
        }
        if(target.getHp() < 0) {
            i -= 1;
        }
        utilities.checkForLife( { player: context.player, foe: context.foe, cause: "Life Check" });
    }
};

module.exports.Polymorph = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Polymorph on " + target.name + ", transforming them into a Sheep.");
        context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
        utilities.summon(Sheep(context.foe.color), context.player, context);
    }
};

module.exports.Frostbolt = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Frostbolt on " + target.name + ", dealing damage and Freezing them.");
    utilities.dealSpellDamage(target, 3, context);
    target.addEffect(effects.frozen);
};

module.exports.UnstablePortal = function(target, context) {
    var minionList = [];
    var allCards = cardLists.allCards();
    for(var i in allCards) {
        var card = allCards[i]();
        if(card.type === "minion") {
            minionList.push(card);
        }
    }
    var minion = minionList[Math.floor(Math.random()*minionList.length)];
    printer.print(context.player.color + " " + context.player.name + " casts Unstable Portal, giving them a random minion.");
    if(context.player.hand.length < 10 && minion) {
        minion.cost -= 3;
        utilities.addCard(minion, context.player, context);
        printer.print("Card received: " + minion.name);
    }
    else if (minion) {
        printer.print("Hand too full! Could not receive new card.");
    } else {
        printer.print("There are no spells in this gamemode.");
    }
};

module.exports.MirrorEntity = function(target, context) {
    context.player.addEffect(effects.MirrorEntity);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Mirror Entity, a Secret. It will trigger when an enemy minion is played.");
};

module.exports.Duplicate = function(target, context) {
    context.player.addEffect(effects.Duplicate);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Duplicate, a Secret. It will trigger when a friendly minion dies.");
};

module.exports.Vaporize = function(target, context) {
    context.player.addEffect(effects.Vaporize);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Vaporize, a Secret. It will trigger when a minion attacks them.");
};

module.exports.ArcaneBlast = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Arcane Blast, targeting " + target.color + " " + target.name + " with a concentrated pulse of arcane energy.");
    utilities.dealSpellDamage(target, utilities.spellDamage(context.player, context.foe, 2), context);
};

module.exports.ForbiddenFlame = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Forbidden Flame, dealing damage equal to their Mana to " + target.color + " " + target.name + ".");
    utilities.dealSpellDamage(target, context.player.mana, context);
    context.player.mana = 0;
};

module.exports.IceBlock = function(target, context) {
    context.player.addEffect(effects.IceBlock);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Ice Block, a Secret. It will trigger when they take fatal damage.");
};

module.exports.ArcaneIntellect = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Arcane Intellect, drawing two cards.");
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
};

module.exports.ArcaneExplosion = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Arcane Explosion, dealing 1 damage to all enemy minions.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 1, context);
    }
};

module.exports.Flamestrike = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Flamestrike, dealing 4 damage to all enemy minions.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 4, context);
    }
};

module.exports.ConeofCold = function(target, context) {
    var target2 = false;
    if(context.foe.minions[context.foe.minions.indexOf(target) - 1]) {
        target2 = context.foe.minions[context.foe.minions.indexOf(target) - 1];
    }
    var target3 = false;
    if(context.foe.minions[context.foe.minions.indexOf(target) - 1]) {
        target2 = context.foe.minions[context.foe.minions.indexOf(target) - 1];
    }
    if(target) {
        if(!target2 && !target3) {
            printer.print(context.player.color + " " + context.player.name + " casts Cone of Cold on " + target.name + ".");
            utilities.dealSpellDamage(target, 1, context);
            target.addEffect(effects.frozen);
        }
        if(target2 && !target3) {
            printer.print(context.player.color + " " + context.player.name + " casts Cone of Cold on " + target.name + ", splashing onto " + target2.name + ".");
            utilities.dealSpellDamage(target, 1, context);
            target.addEffect(effects.frozen);
            utilities.dealSpellDamage(target2, 1, context);
            target.addEffect(effects.frozen);
        }
        if(!target2 && target3) {
            printer.print(context.player.color + " " + context.player.name + " casts Cone of Cold on " + target.name + ", splashing onto " + target3.name + ".");
            utilities.dealSpellDamage(target, 1, context);
            target.addEffect(effects.frozen);
            utilities.dealSpellDamage(target3, 1, context);
            target.addEffect(effects.frozen);
        }
        if(target2 && target3) {
            printer.print(context.player.color + " " + context.player.name + " casts Cone of Cold on " + target.name + ", splashing onto " + target2.name + " and " + target3.name + ".");
            utilities.dealSpellDamage(target, 1, context);
            target.addEffect(effects.frozen);
            utilities.dealSpellDamage(target2, 1, context);
            target.addEffect(effects.frozen);
            utilities.dealSpellDamage(target3, 1, context);
            target.addEffect(effects.frozen);
        }
    }
};

module.exports.Flamecannon = function(target, context) {
    target = false;
    var targetNum = Math.floor(context.foe.minions.length * Math.random(0, 1));
    if(context.foe.minions.length > 0) {
        target = context.foe.minions[targetNum];
        printer.print("The " + context.player.color + " " + context.player.name + " casts Flamecannon on " + target.name + ", dealing 4 damage.");
        utilities.dealSpellDamage(target, 4, context);
    }
};

module.exports.FrostfireBolt = function(target, context) {
    var num = 0;
    for(var i in context.player.graveyard) {
        if(context.player.graveyard[i].type == "spell") {
            num++;
        }
    }
    printer.print("The " + context.player.color + " " + context.player.name + " casts Frostfire Bolt, dealing damage for each spell cast this game (a total of " + num + ").");
    utilities.dealSpellDamage(target, num, context);
};

module.exports.FrostNova = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Frost Nova, Freezing all enemy minions.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        context.foe.minions[i].addEffect(effects.frozen);
    }
};

module.exports.MirrorImage = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Mirror Image, summoning two Mirror Images with Taunt.");
    utilities.summon(MirrorImage(context.player.color), context.player, context);
    utilities.summon(MirrorImage(context.player.color), context.player, context);
};

module.exports.Execute = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Execute, destroying " + target.name + ".");
        utilities.kill(target, { player: context.foe, foe: context.player, cause: context.player });
    }
};

module.exports.ShieldBlock = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Shield Block, gaining 5 Armor and drawing a card.");
    utilities.addArmor(context.player, 5, context);
    utilities.drawCard(context.player, context);
};

module.exports.Whirlwind = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Whirlwind, dealing 1 damage to all minions in play.");
    var targets = context.player.minions.slice();
    for(var i in context.foe.minions) {
        targets.push(context.foe.minions[i]);
    }
    for(i in targets) {
        utilities.dealSpellDamage(targets[i], 1, context);
        if(!targets[i].isAlive()) {
            i--;
        }
    }
};

module.exports.BattleRage = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Battle Rage, drawing a card for each damaged friendly character.");
    if(context.player.getHp() < context.player.getMaxHp()) {
        utilities.drawCard(context.player, context);
    }
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp()) {
            utilities.drawCard(context.player, context);
        }
    }
};

module.exports.Cleave = function(target, context) {
    target = false;
    var target2 = false;
    if(context.foe.minions.length > 1) {
        var targetRoll = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        target = context.foe.minions[targetRoll];
        var targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        while(targetRoll === targetRoll2 && context.foe.minions.length >= 2) {
            targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        }
        target2 = context.foe.minions[targetRoll2];
        if(target.getHp() > 0 && target2.getHp() > 0 && context.foe.minions.length >= 2) {
            printer.print("The " + context.player.color + " " + context.player.name + " casts Cleave on " + target.name + " and " + target2.name + ".");
            utilities.dealSpellDamage(target, 2, context);
            utilities.dealSpellDamage(target2, 2, context);
        }
    }
};

module.exports.IKnowAGuy = function(target, context) {
    var validArray = cardLists.classCards("Warrior", 4);
    var allCards = cardLists.allCards();
    for(var i in allCards) {
        var card = allCards[i]();
        if(card.cardClass.indexOf("Neutral")>=0) {
            validArray.push(card);
        }
    }
    validArray = utilities.filterArray.hasType(validArray, "minion");
    validArray = utilities.filterArray.hasEffect(validArray, "Taunt");
    printer.print(context.player.color + " " + context.player.name + " casts I Know A Guy, discovering a minion.");
    var options = utilities.Discover(validArray);
    var result = utilities.discoverChoose(options, context.player);
    if(context.player.hand.length < 10) {
        utilities.addCard(result, context.player, context);
        printer.print("Card chosen: " + result.name);
    } else {
        printer.print("No room in your hand for that card.");
    }
};

module.exports.StolenGoods = function(target, context) {
    var targets = [];
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type == "minion" && context.player.hand[i].hasEffectName("Taunt")) {
            targets.push(context.player.hand[i]);
        }
    }
    target = targets[Math.floor(Math.random() * targets.length)];
    if (target) {
        target.addEffect(StolenGoodsHp);
        target.addEffect(StolenGoodsDmg);
        printer.print(context.player.color + " " + context.player.name + " gives Stolen Goods to " + target.name + " in their hand, giving them +3/+3 (up to " + target.getDamage() + "/" + target.getHp() + ").");
    }
    else {
        printer.print(context.player.color + " " + context.player.name + " has Stolen Goods, but no one to give them to.");
    }
};

var StolenGoodsHp = {
    name: "Stolen Goods",
    type: "buff health",
    num: 3
};

var StolenGoodsDmg = {
    name: "Stolen Goods",
    type: "buff damage",
    num: 3
};

module.exports.BloodWarriors = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Blood Warriors, adding a copy of all damaged minions to their hand!");
    var targets = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp()) {
            if(context.player.hand.length < 10) {
                utilities.addCard(context.player.minions[i].card(), context.player, context);
                targets.push(context.player.minions[i].name);
            }
        }
    }
    var string = "Minions added to hand: ";
    for(i = 0; i < targets.length; i++) {
        if(i == 0) {
            string = string + targets[i];
        }
        else {
            string = string + ", " + targets[i];
        }
    }
    if(targets.length == 0) {
        string = "No damaged minions were on the board. No cards are added to the " + context.player.color + " " + context.player.name + "'s hand.";
    }
};

module.exports.Brawl = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Brawl, inciting a massive bar fight between all the minions on the board.");
    var minions = [];
    for(var i in context.player.minions) {
        var minion = context.player.minions[i];
        minions.push(minion);
    }
    for(i in context.foe.minions) {
        minion = context.foe.minions[i];
        minions.push(minion);
    }
    var survivor = minions[Math.floor(Math.random() * minions.length)];
    printer.print("The sole survivor of the vicious battle is " + survivor.color + " " + survivor.name + ".");
    for(i in minions) {
        minion = minions[i];
        if(minion != survivor) {
            utilities.kill(minion, {player: minion.owner, foe: minion.owner == context.player ? context.foe : context.player, cause: context.player});
        }
    }
};

module.exports.ShieldSlam = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shield Slam, bashing " + target.color + " " + target.name + " and dealing " + utilities.spellDamage(context.player, context.foe, context.player.armor) + " damage.");
        utilities.dealSpellDamage(target, context.player.armor, context);
    }
};

module.exports.Backstab = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Backstab, dealing 2 damage to " + target.name + ".");
        utilities.dealSpellDamage(target, 2, context);
    }
};

module.exports.Sap = function(target, context) {
    
    if(target !== context.foe) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Sap, returning " + target.color + " " + target.name + " to the " + context.foe.color + " " + context.foe.name + "'s hand.");
        utilities.addCard(target.card(), context.player, context);
        context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
    }
};

module.exports.Shiv = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Shiv, dealing 1 damage to " + target.name + " and drawing a card.");
    utilities.dealSpellDamage(target, 1, context);
    utilities.drawCard(context.player, context);
};

module.exports.FanofKnives = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Fan of Knives, dealing 1 damage to all enemy minions and drawing a card.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 1, context);
    }
    utilities.drawCard(context.player, context);
};

module.exports.Sprint = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Sprint, drawing four cards.");
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
};

var recuperateAction = function(source, context) {
    utilities.healDamage(source, 4, context);
};

var RecuperateEffect = {
    name: "Recuperate",
    temp: "EoT",
    type: "spell hunger friend",
    action: recuperateAction
};

module.exports.Recuperate = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Recuperate, causing spells to heal their injuries.");
    context.player.addEffect(RecuperateEffect);
    context.player.addEffect(effects.removeTempEoT);
};

var SliceAndDiceAction = function(source, context) {
    if(context.cause.type === "spell") {
        return -1;
    }
    return 0;
};

var SliceAndDiceEffect = {
    name: "Slice and Dice",
    temp: "EoT",
    type: "aura hand friend buff cost",
    action: SliceAndDiceAction
};

module.exports.SliceAndDice = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Slice and Dice, reducing the cost of spells this turn..");
    context.player.addEffect(SliceAndDiceEffect);
    context.player.addEffect(effects.removeTempEoT);
};

module.exports.Crackle = function(target, context) {
    var randomDamage = 3 + Math.round(3 * Math.random(0, 1));
    printer.print("The " + context.player.color + " " + context.player.name + " casts Crackle, dealing " + utilities.spellDamage(context.player, context.foe, randomDamage) +
    " damage to " + target.name + ". Overload: 1");
    utilities.dealSpellDamage(target, utilities.spellDamage(context.player, context.foe, randomDamage), context);
};

module.exports.ChainLightning = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " launches crackling Chain Lightning at " + target.name + ". Overload: 1");
    var enemies = context.foe.minions.slice();
    enemies.push(context.foe);
    utilities.dealSpellDamage(target, 4, context);
    enemies.splice(enemies.indexOf(target),1);
    for(var i = 0; i < 2; i++) {
        var newTarg = enemies[Math.floor(Math.random() * enemies.length)];
        if(newTarg) {
            printer.print("Lightning arcs to " + newTarg.color + " " + newTarg.name + ".");
            utilities.dealSpellDamage(newTarg, 2, context);
            enemies.splice(enemies.indexOf(newTarg), 1);
        }
    }
};

module.exports.LavaBurst = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Lava Burst on " + target.name + ". Overload: 2");
    utilities.dealSpellDamage(target, 5, context);
};

module.exports.FeralSpirit = function(target, context) {
    target = false;
    printer.print("The " + context.player.color + " " + context.player.name + " casts Feral Spirit. Overload: 2");
    utilities.summon(SpiritWolf(), context.player, context);
    utilities.summon(SpiritWolf(), context.player, context);
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Spirit Wolf") {
            context.player.minions[i].color = context.player.color;
        }
    }
};

module.exports.ForkedLightning = function(target, context) {
    var spellFired = false;
    target = false;
    var target2 = false;
    if(context.foe.minions.length > 1) {
        var targetRoll = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        target = context.foe.minions[targetRoll];
        var targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        while(targetRoll === targetRoll2 && context.foe.minions.length >= 2) {
            targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        }
        target2 = context.foe.minions[targetRoll2];
        if(target.getHp() > 0 && target2.getHp() > 0 && context.foe.minions.length >= 2) {
            printer.print("The " + context.player.color + " " + context.player.name + " casts Forked Lightning on " + target.name + " and " + target2.name + ". Overload: 1");
            utilities.dealSpellDamage(target, 2, context);
            utilities.dealSpellDamage(target2, 2, context);
            spellFired = true;
        }
    }
};

module.exports.ElementalGuidance = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " calls upon Elemental Guidance, adding four Elementals to their hand.");
    var list = utilities.filterArray.hasName(utilities.filterArray.hasType(cardLists.allCards(), "minion"), "Elemental", true);
    for(var i = 0; i < 4; i++) {
        var card = list[Math.floor(Math.random() * list.length)];
        printer.print("Card received: " + card.name + ".");
        utilities.addCard(card, context.player, context);
    }
};

module.exports.AnimalCompanion = function(target, context) {
    var companion = false;
    var companionNum = Math.floor(3 * Math.random(0, 1));
    if(companionNum === 0) {
        companion = Misha;
    }
    if(companionNum === 1) {
        companion = Huffer;
    }
    if(companionNum === 2) {
        companion = Leokk;
    }
    utilities.summon(companion(), context.player, context);
    printer.print("The " + context.player.color + " " + context.player.name + " calls their Animal Companion, summoning a " + companion().name + ".");
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Misha" || context.player.minions[i].name === "Huffer" || context.player.minions[i].name === "Leokk") {
            context.player.minions[i].color = context.player.color;
        }
    }
};

module.exports.ArcaneShot = function(target, context) {
    printer.print(context.player.name + " fires an Arcane Shot at " + target.name + ".");
    utilities.dealSpellDamage(target, 2, context);
};

module.exports.HuntersMark = function(target, context) {
    if(target !== context.foe) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Hunter's Mark on " + target.name + ", reducing their Health to 1.");
        target.baseHp = 1;
        target.damageTaken = 0;
    }
};

module.exports.MultiShot = function(target, context) {
    var spellFired = false;
    target = false;
    var target2 = false;
    if(context.foe.minions.length > 1) {
        var targetRoll = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        target = context.foe.minions[targetRoll];
        var targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        while(targetRoll === targetRoll2 && context.foe.minions.length >= 2) {
            targetRoll2 = Math.floor((context.foe.minions.length) * Math.random(0, 1));
        }
        target2 = context.foe.minions[targetRoll2];
        if(target.getHp() > 0 && target2.getHp() > 0 && context.foe.minions.length >= 2) {
            printer.print("The " + context.player.color + " " + context.player.name + " fires a Multi-Shot at " + target.name + " and " + target2.name + ".");
            utilities.dealSpellDamage(target, 3, context);
            utilities.dealSpellDamage(target2, 3, context);
            spellFired = true;
        }
    }
};

module.exports.CobraShot = function(target, context) {
    if(target !== context.foe) {
        printer.print("The " + context.player.color + " " + context.player.name + " fires a Cobra Shot at " + target.name + ", damaging them and the " + context.foe.color + " " + context.foe.name + ".");
        utilities.dealSpellDamage(target, 3, context);
        utilities.dealSpellDamage(context.foe, 3, context);
    }
};

module.exports.DeadlyShot = function(target, context) {
    target = false;
    var targetNum = Math.floor(context.foe.minions.length * Math.random(0, 1));
    if(context.foe.minions.length > 0) {
        target = context.foe.minions[targetNum];
        printer.print("The " + context.player.color + " " + context.player.name + " fires a Deadly Shot at " + target.name + ", destroying them.");
        utilities.kill(target, { player: context.foe, foe: context.player, cause: context.player });
    }
};

module.exports.SplitShot = function(target, context) {
    var target2 = false;
    var targets = context.foe.minions.slice();
    targets.push(context.foe);
    if(targets.length > 1) {
        var targetRoll = target;
        while(targetRoll === target && targets.length > 1) {
            targetRoll = targets[Math.floor(Math.random() * targets.length)];
        }
        target2 = targetRoll;
        printer.print("The " + context.player.color + " " + context.player.name + " fires a Split Shot at " + target.color + " " + target.name + " and " + target2.color + " " + target2.name + ".");
        utilities.dealSpellDamage(target, 2, context);
        utilities.dealSpellDamage(target2, 1, context);
    }
};

module.exports.UnleashTheHounds = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Unleash the Hounds, summoning " + context.foe.minions.length + " 1/1 Hounds with Charge.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.summon(Hound(), context.player, context);
    }
};

module.exports.Barrage = function(target, context) {
    var num = context.player.mana;
    if(num > 6) {
        num = 6;
    }
    context.player.mana -= num;
    num = utilities.spellDamage(context.player, context.foe, num*2);
    printer.print("The " + context.player.color + " " + context.player.name + " fires a barrage of bullets at their enemies, dealing " + num + " damage split among enemies.");
    for(var i = 0; i < num; i++) {
        var enemies = context.foe.minions.slice();
        enemies.push(context.foe);
        target = enemies[Math.floor(Math.random()*enemies.length)];
        if(target) {
            utilities.dealDamage(target, 1, context);
        }
    }
};

module.exports.ExplosiveShot = function(target, context) {
    var target2 = false;
    if(context.foe.minions[context.foe.minions.indexOf(target) - 1]) {
        target2 = context.foe.minions[context.foe.minions.indexOf(target) - 1];
    }
    var target3 = false;
    if(context.foe.minions[context.foe.minions.indexOf(target) - 1]) {
        target2 = context.foe.minions[context.foe.minions.indexOf(target) - 1];
    }
    if(target) {
        if(!target2 && !target3) {
            printer.print(context.player.color + " " + context.player.name + " fires an Explosive Shot at " + target.name + ".");
            utilities.dealSpellDamage(target, 5, context);
        }
        if(target2 && !target3) {
            printer.print(context.player.color + " " + context.player.name + " fires an Explosive Shot at " + target.name + ", dealing splash damage to " + target2.name + ".");
            utilities.dealSpellDamage(target, 5, context);
            utilities.dealSpellDamage(target2, 2, context);
        }
        if(!target2 && target3) {
            printer.print(context.player.color + " " + context.player.name + " fires an Explosive Shot at " + target.name + ", dealing splash damage to " + target3.name + ".");
            utilities.dealSpellDamage(target, 5, context);
            utilities.dealSpellDamage(target3, 2, context);
        }
        if(target2 && target3) {
            printer.print(context.player.color + " " + context.player.name + " fires an Explosive Shot at " + target.name + ", dealing splash damage to " + target2.name + " and " + target3.name + ".");
            utilities.dealSpellDamage(target, 5, context);
            utilities.dealSpellDamage(target2, 2, context);
            utilities.dealSpellDamage(target3, 2, context);
        }
    }
};

module.exports.EagleEye = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Eagle Eye, Discovering two of three cards from their deck.");
    var validArray = context.player.deck.slice();
    var options = utilities.Discover(validArray);
    var result = utilities.discoverChoose(options, context.player, true);
    printer.print(context.player.color + " " + context.player.name + " chooses to discard " + result.name + " and draw the other two card options.");
    options.splice(options.indexOf(result), 1);
    for(var i = 0; i < options.length; i++) {
        context.player.deck.splice(context.player.deck.indexOf(options[i]), 1);
        context.player.deck.unshift(options[i]);
        utilities.drawCard(context.player, context);
    }
};

module.exports.Innervate = function(target, context) {
    context.player.mana += 2;
    if(context.player.mana > 10) {
        context.player.mana = 10;
    }
    printer.print("The " + context.player.color + " " + context.player.name + " casts Innervate, gaining 2 additional mana crystals (a total of " + context.player.mana + ") this turn.");
};

module.exports.Swipe = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Swipe, dealing 4 damage to " + target.name + " and 1 damage to all other enemies.");
    utilities.dealSpellDamage(target, 4, context);
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i] !== target) {
            utilities.dealSpellDamage(context.foe.minions[i], 1, context);
        }
    }
    if(context.foe !== target) {
        utilities.dealSpellDamage(context.foe, 1, context);
    }
};

module.exports.Moonfire = function(target, context) {
    printer.print(context.player.name + " casts Moonfire on " + target.name + ".");
    utilities.dealSpellDamage(target, 1, context);
};

module.exports.WildGrowth = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Wild Growth, gaining an empty mana crystal.");
    if(context.player.maxMana < 10) {
        context.player.maxMana++;
    } else {
        printer.print("Already at 10 mana: instead providing Excess Mana.");
        if(context.player.hand.length < 10) {
            utilities.addCard(ExcessMana(), context.player, context);
        } else {
            printer.print("No room to add Excess Mana.");
        }
    }
};

var ExcessMana = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Excess Mana, drawing a card.");
    utilities.drawCard(context.player, context);
};

var ErodeHp = {
    name: "Erode",
    type: "buff health",
    num: -3
};

var ErodeDmg = {
    name: "Erode",
    type: "buff damage",
    num: -3
};

module.exports.Erode = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Erode on " + target.color + " " + target.name + ", giving them -3 Attack and -3 Health (down to " + (target.getDamage() - 3 > 0 ? target.getDamage() - 3 : 0) + "/" + (target.getHp() - 3 > 0 ? target.getHp() - 3 : 0) + ").");
    target.addEffect(ErodeHp);
    target.addEffect(ErodeDmg);
    if(!target.isAlive()) {
        utilities.kill(target, {
            player: context.foe,
            foe: context.player,
            cause: context.player
        });
    }
};

module.exports.JadeBlossom = function(target, context) {
    var golem = utilities.jadeSetup(JadeGolem(), context.player);
    printer.print(context.player.color + " " + context.player.name + " casts Jade Blossom, gaining an empty mana crystal and summoning a " + golem.baseDamage + "/" + golem.baseHp + " " + golem.name + ".");
    context.player.maxMana++;
    utilities.summon(golem, context.player, context);
};

module.exports.LivingRoots = function(target, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Living Roots, summoning two 1/1 Saplings.");
        for(var i = 0; i < 2; i++) {
            utilities.summon(Sapling(), context.player, context);
        }
    } if(context.choice==1 || context.choice==2) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Living Roots on " + target.name + ".");
        utilities.dealSpellDamage(target, 2, context);
    }
};

module.exports.RavenIdol = function(target, context) {
    var allCards = cardLists.allCards();
    if(context.choice==0 || context.choice==2) {
        var validArray = cardLists.classCards("Druid", 4);
        for(var i in allCards) {
            var card = allCards[i]();
            if(card.cardClass.indexOf("Neutral")>=0) {
                validArray.push(card);
            }
        }
        validArray = utilities.filterArray.hasType(validArray, "minion");
        printer.print(context.player.color + " " + context.player.name + " casts Raven Idol, discovering a minion.");
        var options = utilities.Discover(validArray);
        var result = utilities.discoverChoose(options, context.player);
        if(context.player.hand.length < 10) {
            utilities.addCard(result, context.player, context);
            printer.print("Card chosen: " + result.name);
        } else {
            printer.print("No room in your hand for that card.");
        }
    }
    if(context.choice==1 || context.choice==2) {
        validArray = cardLists.classCards("Druid", 4);
        for(i in allCards) {
            card = allCards[i]();
            if(card.cardClass.indexOf("Neutral")>=0) {
                validArray.push(card);
            }
        }
        validArray = utilities.filterArray.hasType(validArray, "spell");
        printer.print(context.player.color + " " + context.player.name + " casts Raven Idol, discovering a spell.");
        options = utilities.Discover(validArray);
        result = utilities.discoverChoose(options, context.player);
        if(context.player.hand.length < 10) {
            utilities.addCard(result, context.player, context);
            printer.print("Card chosen: " + result.name);
        } else {
            printer.print("No room in your hand for that card.");
        }
    }
};

module.exports.Wrath = function(target, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Wrath on " + target.name + ", dealing 1 damage and drawing a card.");
        utilities.dealSpellDamage(target, 1, context);
        utilities.drawCard(context.player, context);
    } if(context.choice==1 || context.choice==2) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Wrath on " + target.name + ", dealing 3 damage.");
        utilities.dealSpellDamage(target, 3, context);
    }
};

module.exports.JadeIdol = function(target, context) {
    if(context.choice==0 || context.choice==2) {
        var golem = utilities.jadeSetup(JadeGolem(), context.player);
        printer.print(context.player.color + " " + context.player.name + " casts Jade Idol, summoning a " + golem.baseDamage + "/" + golem.baseHp + " " + golem.name + ".");
        utilities.summon(golem, context.player, context);
    } if (context.choice==1 || context.choice==2) {
        printer.print(context.player.color + " " + context.player.name + " casts Jade Idol, shuffling 3 more Jade Idols into their deck.");
        for(var i = 0; i < 3; i++) {
            var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
        context.player.deck.splice(randomNum, 0, context.cause.card());
        }
    }
};

module.exports.Nourish = function(target, context) {
    if(context.choice==0 || context.choice==2) {
        printer.print(context.player.color + " " + context.player.name + " casts Nourish, gaining 2 mana crystals.");
        for(var i = 0; i < 2; i++) {
            context.player.maxMana++;
            context.player.mana++;
        }
    } if (context.choice==1 || context.choice==2) {
        printer.print(context.player.color + " " + context.player.name + " casts Nourish, drawing 3 cards.");
        for(i = 0; i < 3; i++) {
            utilities.drawCard(context.player, context);
        }
    }
};

module.exports.TreeofLife = function(target, context) {
    printer.print(context.player.name + " casts Tree of Life, restoring all characters to full health.");
    context.player.damageTaken = 0;
    context.foe.damageTaken = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        context.player.minions[i].damageTaken = 0;
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        context.foe.minions[i].damageTaken = 0;
    }
};

module.exports.Darkbomb = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Darkbomb on " + target.name + ".");
    utilities.dealSpellDamage(target, 3, context);
};

module.exports.ShadowBolt = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts a Shadow Bolt on " + target.name + ".");
    utilities.dealSpellDamage(target, 4, context);
};

module.exports.MortalCoil = function(target, context) {
    var drawCard = false;
    if(target.getHp() === 1) {
        drawCard = true;
    }
    if(drawCard) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts a Mortal Coil on " + target.name + ", and draws a card.");
    }
    if(!drawCard) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts a Mortal Coil on " + target.name + ".");
    }
    utilities.dealSpellDamage(target, 1, context);
    if(drawCard) {
        utilities.drawCard(context.player, context);
    }
};

module.exports.DarkOffering = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Dark Offering on " + target.name + ", triggering their deathrattle twice.");
    for(var i in target.effects) {
        var eff = target.effects[i];
        if(eff.type == "deathrattle") {
            for(var j = 0; j < 2; j++) {
                eff.action(target, context);
            }
        }
    }
};

module.exports.Shadowflame = function(target, context) {
    if(target !== context.foe) {
        var damage = target.getDamage();
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shadowflame on "
        + target.name + ", destroying it and dealing " + target.getDamage() + " damage to all enemy minions.");
        utilities.kill(target, context);
        for(var i = 0; i < context.foe.minions.length; i++) {
            utilities.dealDamage(context.foe.minions[i], damage, context);
        }
    }
};

module.exports.LordJaraxxusInferno = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + "casts INFERNO, summoning a 6/6 Infernal.");
    utilities.summon(Infernal(context.player.color), context.player, context);
};

var HandofSacrificeAction = function(source, context) {
    printer.print("Damage to " + source.color + " " + source.name + " is redirected to " + source.sacrificeLink.color + " " + source.sacrificeLink.name + ".");
    utilities.dealDamage(source.sacrificeLink, context.damage, context);
    return context.damage * -1;
};

var HandofSacrificeEffect = {
    name: "Hand of Sacrifice",
    temp: "SoT",
    type: "pain interrupt",
    action: HandofSacrificeAction
};

module.exports.HandofSacrifice = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " places a Hand of Sacrifice on " + target.color + " " + target.name + ", redirecting damage done to " + target.name + " to themselves.");
    target.sacrificeLink = context.player;
    target.addEffect(HandofSacrificeEffect);
    target.addEffect(effects.removeTempSoT)
};

module.exports.StandAgainstDarkness = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Stand Against Darkness, summoning 5 Silver Hand Recruits!");
    for(var i = 0; i < 5; i++) {
        if(context.player.minions.length < 7) {
            utilities.summon(SilverHandRecruit(context.player.color), context.player, context);
        }
    }
};

module.exports.Equality = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Equality, setting the health of all minions in play to 1.");
    for(var i = 0; i < context.player.minions.length; i++) {
        context.player.minions[i].addEffect(effects.Equality);
        context.player.minions[i].damageTaken = 0;
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        context.foe.minions[i].addEffect(effects.Equality);
        context.foe.minions[i].damageTaken = 0;
    }
};

module.exports.AvengingWrath = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Avenging Wrath, dealing " + utilities.spellDamage(context.player, context.foe, 8) + " damage randomly split among enemies!");
    for(var i = 0; i < utilities.spellDamage(context.player, context.foe, 8); i++) {
        target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        utilities.dealDamage(target, 1, context);
        if(target.getHp() < 0) {
            i -= 1;
        }
    }
};

var TemplarsVerdictBuff = {
    name: "Temporary Buff",
    temp: "EoT",
    type: "buff damage",
    num: 5
};

module.exports.TemplarsVerdict = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " cast Templar's Verdict, gaining Attack and immunity this turn.");
    context.player.addEffect(TemplarsVerdictBuff);
    context.player.addEffect(effects.tempImmune);
    context.player.addEffect(effects.removeTempEoT);
};

module.exports.BlessingofKings = function(target, context) {
        printer.print("The " + context.player.color + " " + context.player.name + " grants " + target.name + " the Blessing of Kings, giving them +4/+4.");
        target.addEffect(effects.BlessingofKingsHp);
        target.addEffect(effects.BlessingofKingsDamage);
};

module.exports.HammerofWrath = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Hammer of Wrath, dealing " + utilities.spellDamage(context.player, context.foe, 3) +
    " damage to " + target.name + " and drawing a card.");
    utilities.dealSpellDamage(target, 3, context);
    utilities.drawCard(context.player, context);
};

module.exports.HolySmite = function(target, context) {
    printer.print(context.player.name + " casts Holy Smite on " + target.name + ".");
    utilities.dealSpellDamage(target, 2, context);
};

module.exports.PowerWordShield = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Power Word: Shield on " + target.name + ", increasing their health by 2 and drawing a card.");
        utilities.drawCard(context.player, context);
        target.effects.push(effects.PowerWordShield);
    }
};

module.exports.ShadowWordPain = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " invokes Shadow Word: Pain on " + target.color + " " + target.name + ", destroying them.");
        utilities.kill(target, { player: context.foe, foe: context.player, cause: context.player });
    }
};

module.exports.ShadowWordDeath = function(target, context) {
        if(target) {
            printer.print("The " + context.player.color + " " + context.player.name + " invokes Shadow Word: Death on " + target.color + " " + target.name + ", destroying them.");
            utilities.kill(target, {player: context.foe, foe: context.player, cause: context.player });
        }
};

module.exports.HolyNova = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Holy Nova, dealing 2 damage to all enemy characters and restoring 2 health to all friendly characters.");
    for(var i = 0; i < context.player.minions.length; i++) {
        utilities.healDamage(context.player.minions[i], 2, context);
    }
    utilities.healDamage(context.player, 2, context);
    for(i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 2, { player: context.foe, foe: context.player, cause: context.player});
    }
    utilities.dealSpellDamage(context.foe, 2, context);
};

module.exports.Entomb = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Entomb on " + target.color + " " + target.name + ", shuffling it into their deck.");
        var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
        var card = target.card()
        card["owner"] = context.player;
        context.player.deck.splice(randomNum, 0, card);
        context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
    }
};

module.exports.ShadowWordVoid = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " invokes Shadow Word: Void on " + target.color + " " + target.name + ", dealing 4 damage.");
    utilities.dealSpellDamage(target, 4, context);
    if(!target.isAlive()) {
        printer.print(target.name + "'s death feeds the Void, giving " + context.player.color + " " + context.player.name + " 2 mana crystals this turn.");
        context.player.mana += 2;
    }
};

module.exports.VelensChosen = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Velen's Chosen on " + target.color + " " + target.name + ", giving it +2 Attack and +4 Health.");
    target.addEffect(VelensChosenHp);
    target.addEffect(VelensChosenDamage);
};

var VelensChosenHp = {
    name: "Velen's Chosen",
    type: "buff health",
    num: 4
};

var VelensChosenDamage = {
    name: "Velen's Chosen",
    type: "buff damage",
    num: 2
};

module.exports.HolyFire = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Holy Fire on " + target.color + " "
    + target.name + ", dealing 5 damage and restoring 5 Health to " + context.player.color + " " + context.player.name + ".");
    utilities.dealSpellDamage(target, 5, context);
    utilities.healDamage(context.player, 5, context);
};

var PrayerAction = function(source, context) {
    printer.print("The " + context.player.color + " " + context.player.name + "'s Prayer is answered, healing " + context.player.prayTarget.name + ".");
    utilities.healDamage(context.player.prayTarget, 15, context);
};

var PrayerEffect = {
    name: "Prayer",
    temp: "SoT",
    type: "start of turn friend",
    action: PrayerAction
};

module.exports.Prayer = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Prayer on " + target.color + " " + target.name + ". At the start of their turn, " + target.name + " will be healed.");
        target.addEffect(PrayerEffect);
        target.addEffect(effects.removeTempSoT);
        context.player.prayTarget = target;
    }
};

module.exports.Resurrect = function(target, context) {
    var minions = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i].card();
        if(card.type == "minion") {
            minions.push(card);
        }
    }
    var randomNum = Math.floor(Math.random(0, 1) * minions.length);
    var minion = minions[randomNum];
    printer.print("The " + context.player.color + " " + context.player.name + " casts Resurrect, restoring the body and soul of " + minion.name + ".");
    utilities.summon(minion, context.player, context);
};

module.exports.PowerWordFortitude = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " invokes Power Word: Fortitude, granting their minions immunity until the end of the turn and drawing a card.");
    for(var i in context.player.minions) {
        context.player.minions[i].addEffect(effects.tempImmune);
        context.player.minions[i].addEffect(effects.removeTempEoT);
    }
    utilities.drawCard(context.player, context);
};

module.exports.Shadowform = function(target, context) {
    if(context.player.ability !== PriestShadowformMindSpike && context.player.ability !== PriestShadowformMindShatter) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shadowform, transforming their Hero Power into a 2-damage spike of shadow magic.");
        context.player.ability = PriestShadowformMindSpike;
        context.player.hero.targetai = targetais.ArcaneShot;
        context.player.hero.filter = filters.any;
        context.player.ai = ais.true;
    }
    else {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shadowform, transforming their Hero Power into an even stronger 3-damage blast of shadow magic.");
        context.player.hero.ability = PriestShadowformMindShatter;
        context.player.hero.targetai = targetais.Darkbomb;
        context.player.hero.filter = filters.any;
        context.player.hero.ai = ais.true;
    }
};

module.exports.AnubRekhanSkitter = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Skitter, summoning a 3/1 Nerubian.");
    utilities.summon(AnubRekhanNerubian(context.player.color), context.player, context);
};

module.exports.AnubRekhanSkitter_Heroic = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Skitter, summoning a 4/4 Nerubian.");
    utilities.summon(AnubRekhanNerubianH(context.player.color), context.player, context);
};

module.exports.LocustSwarm = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Locust Swarm, dealing 3 damage to all enemy minions and restoring 3 health to themself.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 3, context);
    }
    utilities.healDamage(context.player, 3, context);
};

module.exports.GrandWidowFaerlinaRainofFire = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Rain of Fire, shooting " + context.foe.hand.length + " missiles in the direction of " + context.foe.color + " " + context.foe.name + ".");
    for(var i = 0; i < context.foe.hand.length; i++) {
        target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        if(target.getHp() > 0) {
            utilities.dealDamage(target, 1, context);
        }
        if(target.getHp() < 0) {
            i -= 1;
        }
        utilities.checkForLife( { player: context.player, foe: context.foe, cause: "Life Check" });
    }
};

var WickedKnife = function() {
    return utilities.makeWeapon("Basic", "Basic", ["Rogue"], "Wicked Knife", 2, 0, 1, 2, false, false, false, [], ais.MurlocRaider, WickedKnife);
};

var StonetalonTotem = function() {
    return utilities.makeMinion("Totem", "Special", "Basic", ["Shaman"], "Stonetalon Totem", 2, 0, 2, 0, false, false, false, [effects.sickness, effects.taunt], ais.Totem, StonetalonTotem);
};

var HealingTotem = function() {
    return utilities.makeMinion("Totem", "Special", "Basic", ["Shaman"], "Healing Totem", 2, 0, 2, 0, false, false, false, [effects.sickness, effects.HealingTideTotem], ais.Totem, HealingTotem);
};

var WrathofAirTotem = function() {
    return utilities.makeMinion("Totem", "Special", "Basic", ["Shaman"], "Wrath of Air Totem", 2, 0, 2, 0, false, false, false, [effects.sickness], ais.Totem, WrathofAirTotem);
};

var SearingTotem = function() {
    return utilities.makeMinion("Totem", "Special", "Basic", ["Shaman"], "Searing Totem", 2, 0, 1, 1, false, false, false, [effects.sickness], ais.Totem, SearingTotem);
};

var SilverHandRecruit = function() {
    return utilities.makeMinion(false, "Special", "Basic", ["Paladin"], "Silver Hand Recruit", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.MurlocRaider, SilverHandRecruit);
};

var GoldenMonkey = function() {
    return utilities.makeMinion(false, "Special", "League of Explorers", ["Neutral"], "The Golden Monkey", 4, 0, 6, 6, battlecries.GoldenMonkey, false, false, [effects.sickness, effects.taunt], ais.GoldenMonkey, GoldenMonkey);
};

var JadeGolem = function() {
    return utilities.makeMinion(false, "Uncollectible", "Mean Streets of Gadgetzan", ["Neutral"], "Jade Golem", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.true, JadeGolem);
};

var Sheep = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", ["Neutral"], "Sheep", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.MurlocRaider, Sheep);
};

var MirrorImage = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Mage"], "Mirror Image", 0, 0, 2, 0, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, MirrorImage);
};

var SpiritWolf = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Shaman"], "Spirit Wolf", 2, 0, 3, 2, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, SpiritWolf);
};

var Misha = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", ["Hunter"], "Misha", 3, 0, 4, 4, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Misha);
};

var Huffer = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", ["Hunter"], "Huffer", 2, 0, 2, 4, false, false, false, [], ais.MurlocRaider, Huffer);
};

var Leokk = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", ["Hunter"], "Leokk", 2, 0, 4, 2, false, false, false, [effects.sickness, effects.Leokk], ais.MurlocRaider, Leokk);
};

var Hound = function() {
    return utilities.makeMinion("Beast", "Common", "Classic", ["Hunter"], "Hound", 1, 0, 1, 1, false, false, false, [], ais.MurlocRaider, Hound);
};

var ExcessMana = function() {
    return utilities.makeSpell("Uncollectible", "Basic", ["Neutral"], "Excess Mana", 0, 0, ExcessMana, false, false, ais.true, ExcessMana);
};

var Sapling = function() {
    return utilities.makeMinion(false, "Basic", "The Grand Tournament", ["Druid"], "Sapling", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.MurlocRaider, Sapling);
};

var Infernal = function() {
    return utilities.makeMinion("Demon", "Special", "Classic", ["Warlock"], "Infernal", 6, 0, 6, 6, false, false, false, [effects.sickness], ais.MurlocRaider, Infernal);
};

var AnubRekhanNerubian = function() {
    return utilities.makeMinion(false, "Special", "Uncollectible", ["Boss"], "Nerubian", 2, 0, 1, 3, false, false, false, [effects.sickness], ais.MurlocRaider, AnubRekhanNerubian);
};

var AnubRekhanNerubianH = function() {
    return utilities.makeMinion(false, "Special", "Uncollectible", ["Boss"], "Nerubian", 2, 0, 4, 4, false, false, false, [effects.sickness], ais.MurlocRaider, AnubRekhanNerubianH);
};

// Custom Sets

module.exports.C_DarkEmpowerment = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Dark Empowerment, killing a Cult Adherent and creating an Empowered Adherent!");
    utilities.kill(target, context);
    utilities.summon(C_EmpoweredAdherent(context.player.color), context.player, context);
};

module.exports.C_DarkTransformation = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Dark Transformation, killing a Cult Fanatic and creating a Deformed Fanatic!");
    utilities.kill(target, context);
    utilities.summon(C_DeformedFanatic_Normal(context.player.color), context.player, context);
};

var C_EmpoweredAdherent = function(color) {
    return utilities.makeMinion(false, "Special", "Icecrown Citadel", color, "Empowered Adherent", 3, 0, 5, 4, false, false, false,
    [effects.sickness, effects.C_CultAdherent, effects.C_CultAdherent], ais.C_CultAdherent, C_EmpoweredAdherent);
};

var C_DeformedFanatic_Normal = function(color) {
    return utilities.makeMinion(false, "Special", "Icecrown Citadel", color, "Deformed Fanatic", 3, 0, 4, 5, false, false, false,
    [effects.sickness, effects.C_DeformedFanatic], ais.C_CultFanatic, C_DeformedFanatic_Normal);
};

module.exports.C_GunshipBattle = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " opens fire on the " + context.foe.color + " " + context.foe.name + "!");
    utilities.dealDamage(context.foe, 4, context);
};

var C_CannonBlast = module.exports.C_CannonBlast = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " fires a Cannon Blast at " + target.name + ".");
    utilities.dealSpellDamage(target, 4, context);
};

module.exports.C_IncineratingBlast = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " fires an Incinerating Blast at " + target.color + " " + target.name + ", dealing 8 damage to them and 2 damage to all other enemies.");
    utilities.dealSpellDamage(target, 8, context);
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i] !== target) {
            utilities.dealSpellDamage(context.foe.minions[i], 2, context);
        }
    }
    if(context.foe !== target) {
        utilities.dealSpellDamage(context.foe, 2, context);
    }
};

module.exports.C_Fortify = function(target, context) {
    utilities.addArmor(context.player, 10, context);
    printer.print("The " + context.player.color + " " + context.player.name + " Fortifies, gaining 10 Armor! [" + context.player.armor + " Total]");
};

module.exports.C_Repairs = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " Repairs itself, restoring 10 Health!");
    utilities.healDamage(context.player, 10, context);
};

module.exports.C_Reload = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " Reloads its cannons, shuffling five copies of Cannon Blast into its deck and then drawing three cards!");
    for(var i = 0; i <= 5; i++) {
        var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
        context.player.deck.splice(randomNum, 0, C_CannonBlast(context.player.color));
    }
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
    utilities.drawCard(context.player, context);
};

var C_CannonBlast =  function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Cannon Blast", 1, 0, C_CannonBlast, targetais.C_CannonBlast, filters.any, ais.C_CannonBlast, C_CannonBlast);
};

module.exports.Arthas_FlashofLight = function(target, context) {
    if(context.foe.minions.indexOf(target) != -1 || (context.scenario && context.scenario.minions.indexOf(target) != -1)) {
        printer.print(context.player.color + " " + context.player.name + " smites " + target.color + " " + target.name + " with a flash of light, dealing 2 damage.");
        utilities.dealDamage(target, 2, context);
    }
    else if(context.player.minions.indexOf(target) != -1) {
        printer.print(context.player.color + " " + context.player.name + " blesses " + target.color + " " + target.name + " with the Light, restoring 2 Health.");
        utilities.healDamage(target, 2, context);
    }
};

var Arthas_DevotionAction = function(source, context) {
    return context.damage -= 2;
};

var Arthas_DevotionBuff = {
    name: "Devotion",
    type: "self defense",
    action: Arthas_DevotionAction
};

var Arthas_DevotionToggle = function(source, context) {
    for(var i in source.effects) {
        if(source.effects[i] && (source.effects[i].name == "Devotion Toggle" || source.effects[i].name == "Devotion")) {
            source.effects.splice(i, 1);
        }
    }
};

var Arthas_DevotionTurnOff = {
    name: "Devotion Toggle",
    type: "start of turn friend",
    action: Arthas_DevotionToggle
};

module.exports.Arthas_Devotion = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " inspires his soldiers with Devotion, granting them resistance to damage until his next turn.");
    for(var i in context.player.minions) {
        context.player.minions[i].effects.push(Arthas_DevotionBuff);
        context.player.minions[i].effects.push(Arthas_DevotionTurnOff);
    }
};

var Arthas_HolyLightBuff = {
    name: "Holy Light",
    type: "buff damage",
    num: 2
};

var Arthas_HolyLight = module.exports.Arthas_HolyLight = function(target, context) {
    if(context.foe.minions.indexOf(target) != -1) {
        printer.print(context.player.color + " " + context.player.name + " smites " + target.color + " " + target.name + " with the Holy Light, dealing 3 damage.");
        utilities.dealDamage(target, 3, context);
    }
    else if(context.player.minions.indexOf(target) != -1) {
        printer.print(context.player.color + " " + context.player.name + " blesses " + target.color + " " + target.name + " with Holy Light, restoring 3 Health and granting +2 Attack.");
        utilities.healDamage(target, 3, context);
        target.effects.push(Arthas_HolyLightBuff);
    }
};

module.exports.Arthas_Retribution = function(target, context) {
    var totalDamage = context.player.damageTaken;
    for(var i in context.player.minions) {
        totalDamage += context.player.minions[i].damageTaken;
    }
    var explosion = Math.floor(totalDamage / 4);
    
    printer.print("The " + context.player.color + " " + context.player.name + " invokes Retribution, searing all of his enemies with the damage he and his minions have been dealt.");
    utilities.dealSpellDamage(context.foe, explosion, context);
    for(i in context.foe.minions) {
        utilities.dealSpellDamage(context.foe.minions[i], explosion, context);
    }
};

var Arthas_HolyLightCard = function() {
    return utilities.makeSpell("Arthas", "Uncollectible", false, "Holy Light", 1, 0, Arthas_HolyLight, targetais.Arthas_HolyLight, filters.allyMinion, ais.Arthas_HolyLight, Arthas_HolyLightCard);
};