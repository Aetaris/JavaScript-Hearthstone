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
    context.player.armor += 2;
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
    context.player.armor += 1;
    context.player.addEffect(effects.DruidClaws);
    context.player.addEffect(effects.removeTempBuff);
    printer.print("The " + context.player.color + " " + context.player.name + " casts Shapeshift, gaining 1 Armor and 1 Damage this turn.");
};

module.exports.WarlockLifeTap = function(target, context) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Life Tap, drawing a card at the cost of 2 Health and reducing them to "
        + context.player.getHp() + " remaining health.");
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
        context.player.hand.push(target);
        context.player.minions.splice(context.player.minions.indexOf(target), 1);
    }
};

module.exports.TheCoin = function(target, context) {
    context.player.mana += 1;
    printer.print("The " + context.player.color + " " + context.player.name + " plays The Coin, gaining 1 mana crystal and bringing their total up to " + context.player.mana + ".");
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
        context.player.hand.push(minion);
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

module.exports.Whirlwind = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Whirlwind, dealing 1 damage to all minions in play.");
    for(var i = 0; i < context.player.minions.length; i++) {
        utilities.dealSpellDamage(context.player.minions[i], 1, { player: context.player, foe: context.foe, cause: context.player });
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        utilities.dealSpellDamage(context.foe.minions[i], 1, { player: context.foe, foe: context.player, cause: context.player });
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
            printer.print("The " + context.player.color + " " + context.player.name + " casts Cleave on " + target.name + " and " + target2.name + ". Overload: 1");
            utilities.dealSpellDamage(target, 2, context);
            utilities.dealSpellDamage(target2, 2, context);
        }
    }
};

module.exports.BloodWarriors = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Blood Warriors, adding a copy of all damaged minions to their hand!");
    var targets = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp()) {
            if(context.player.hand.length < 10) {
                context.player.hand.push(context.player.minions[i].card());
                targets.push(context.player.minions[i].name);
            }
        }
    }
    var string = "Minions added to hand: ";
    for(var i = 0; i < targets.length; i++) {
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
}

module.exports.Backstab = function(target, context) {
    if(target) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Backstab, dealing 2 damage to " + target.name + ".");
        utilities.dealSpellDamage(target, 2, {player: context.foe, foe: context.player, cause: context.player});
    }
};

module.exports.Sap = function(target, context) {
    
    if(target !== context.foe) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Sap, returning " + target.color + " " + target.name + " to the " + context.foe.color + " " + context.foe.name + "'s hand.");
        context.foe.hand.push(target.card());
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

module.exports.Crackle = function(target, context) {
    var randomDamage = 3 + Math.round(3 * Math.random(0, 1));
    printer.print("The " + context.player.color + " " + context.player.name + " casts Crackle, dealing " + utilities.spellDamage(context.player, context.foe, randomDamage) +
    " damage to " + target.name + ". Overload: 1");
    utilities.dealSpellDamage(target, utilities.spellDamage(context.player, context.foe, randomDamage), context);
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

module.exports.UnleashTheHounds = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " casts Unleash the Hounds, summoning " + context.foe.minions.length + " 1/1 Hounds with Charge.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        utilities.summon(Hound(context.player.color), context.player, context);
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

module.exports.ArcaneShot = function(target, context) {
    printer.print(context.player.name + " fires an Arcane Shot at " + target.name + ".");
    utilities.dealSpellDamage(target, 2, context);
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

module.exports.HuntersMark = function(target, context) {
    if(target !== context.foe) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Hunter's Mark on " + target.name + ", reducing their Health to 1.");
        target.baseHp = 1;
        target.damageTaken = 0;
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
            context.player.hand.push(ExcessMana());
        } else {
            printer.print("No room to add Excess Mana.");
        }
    }
};

var ExcessMana = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Excess Mana, drawing a card.");
    utilities.drawCard(context.player, context);
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
        var validArray = [];
        for(var i in allCards) {
            var card = allCards[i]();
            if(card.type == "minion" && (card.cardClass.indexOf("Druid")>=0 || card.cardClass.indexOf("Neutral")>=0)) {
                validArray.push(card);
            }
        }
        printer.print(context.player.color + " " + context.player.name + " casts Raven Idol, discovering a minion.");
        var options = utilities.Discover(validArray);
        var result = utilities.discoverChoose(options, context.player);
        if(context.player.hand.length < 10) {
            context.player.hand.push(result);
            printer.print("Card chosen: " + result.name);
        } else {
            printer.print("No room in your hand for that card.");
        }
    }
    if(context.choice==1 || context.choice==2) {
        validArray = [];
        for(i in allCards) {
            card = allCards[i]();
            if(card.type == "spell" && (card.cardClass.indexOf("Druid")>=0 || card.cardClass.indexOf("Neutral")>=0)) {
                validArray.push(card);
            }
        }
        printer.print(context.player.color + " " + context.player.name + " casts Raven Idol, discovering a spell.");
        options = utilities.Discover(validArray);
        result = utilities.discoverChoose(options, context.player);
        if(context.player.hand.length < 10) {
            context.player.hand.push(result);
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
        if(target.getHp() > 0) {
            utilities.dealDamage(target, 1, context);
        }
        if(target.getHp() < 0) {
            i -= 1;
        }
    }
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
        printer.print("The " + context.player.color + " " + context.player.name + " casts Power Word: Shield on " + target.name + ", increasing their health by 2 and drawing a card.");
        utilities.drawCard(context.player, context);
        if(!target) {
            throw new Error("no target");
        }
        target.effects.push(effects.PowerWordShield);
};

module.exports.ShadowWordPain = function(target, context) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shadow Word: Pain on " + target.name + ", destroying them.");
        utilities.kill(target, { player: context.foe, foe: context.player, cause: context.player });
};

module.exports.ShadowWordDeath = function(target, context) {
        printer.print("The " + context.player.color + " " + context.player.name + " casts Shadow Word: Death on " + target.name + ", destroying them.");
        utilities.kill(target, {player: context.foe, foe: context.player, cause: context.player });
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
    printer.print("The " + context.player.color + " " + context.player.name + " casts Entomb on " + target.color + " " + target.name + ", shuffling it into their deck.");
    var randomNum = Math.floor(context.player.deck.length * Math.random(0, 1));
    var card = target.card()
    card["owner"] = context.player;
    context.player.deck.splice(randomNum, 0, card);
    context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
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
    context.player.armor += 10;
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
    if(context.foe.minions.indexOf(target) != -1) {
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