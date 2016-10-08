var utilities = require('./utilities.js');
var printer = require('./printer.js')
var effects = require('./effects.js');

// The first two AIs here are called "true" and "false" and return those values. Useful for things you always
// or never want to play ^.^

module.exports.true = function(context) {
    return true;
};

module.exports.false = function(context) {
    return false;
};

module.exports.MageFireblast = function(context) {
    return true;
};

module.exports.WarriorArmorUp = function(context) {
    return true;
};

module.exports.RogueWickedKnife = function(context) {
    return true;
};

module.exports.ShamanTotemicCall = function(context) {
    if(context.player.minions.length < 7) {
        return true;
    }
    return false;
};

module.exports.Totem = function(context) {
    return true;
};

module.exports.HunterSteadyShot = function(context) {
    return true;
};

module.exports.DruidShapeshift = function(context) {
    return true;
};

module.exports.WarlockSiphonSoul = function(context) {
    if (context.player.getHp() > 5 && context.player.deck.length > 0) {
        return true;
    }
};

module.exports.PaladinReinforce = function(context) {
    if(context.foe.minions.length < 7) {
        return true;
    }
    return false;
};

module.exports.PriestLesserHeal = function(context) {
    return true;
};

module.exports.WhirlingBlades = function(context) {
    if (context.player.minions.length > 0) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ArmorPlating = function(context) {
    if (context.player.minions.length > 0) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.RustyHorn = function(context) {
    var isPowerful = false;
    if (context.player.minions.length > 0) {
        for (var i = 0; i < context.player.minions.length; i++) {
            if ((context.player.minions[i].getHp() + context.player.minions[i].getDamage()) >= 5 && context.player.minions[i].getHp() >= 3) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.EmergencyCoolant = function(context) {
    var isPowerful = false;
    if (context.foe.minions.length > 0) {
        for (var i = 0; i < context.foe.minions.length; i++) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 && context.foe.minions[i].getDamage() >= 3) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.FinickyCloakfield = function(context) {
    var isPowerful = false;
    if (context.player.minions.length > 0) {
        for (var i = 0; i < context.player.minions.length; i++) {
            if ((context.player.minions[i].getHp() + context.player.minions[i].getDamage()) >= 6 && context.player.minions[i].getHp() <= 2) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.TimeRewinder = function(context) {
    var isPowerful = false;
    if (context.player.minions.length > 0) {
        for (var i = 0; i < context.player.minions.length; i++) {
            if ((context.player.minions[i].getHp() + context.player.minions[i].getDamage()) >= 6 && context.player.minions[i].getHp() <= context.player.minions[i].maxHp - 2) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ReversingSwitch = function(context) {
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() === 0) {
            return true;
        }
    }
    return false;
};

module.exports.TheCoin = function(context) {
    if(context.cause.cost > 0) {
        return false;
    }
    var coinTarget = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].cost <= context.player.mana + 1) {
            if (context.player.hand[i].cost === context.player.mana + 1) {
                if(!context.player.hand[i].ai) {
                    console.log("bug");
                }
                if(context.player.hand[i].ai({ player: context.player, foe: context.foe, cause: context.player.hand[i] }) === true) {
                    coinTarget = true;
                    break;
                }
            }
        }
    }
    if (coinTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MurlocRaider = function(context) {
    return true;
};

module.exports.SpiderTank = function(context) {
    return true;
};

module.exports.LeperGnome = function(context) {
    return true;
};

module.exports.FrostwolfGrunt = function(context) {
    return true;
};

module.exports.ChillwindYeti = function(context) {
    return true;
};

module.exports.BloodfenRaptor = function(context) {
    return true;
};

module.exports.MagmaRager = function(context) {
    return true;
};

module.exports.ElvenArcher = function(context) {
    return true;
};

module.exports.AldorPeacekeeper = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getDamage() > 3) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Spellbreaker = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        var effectsLength = 0;
        for (var o = 0; o < context.foe.minions[i].effects.length; o++) {
            if (context.foe.minions[i].effects[o].name !== "Frozen" && context.foe.minions[i].effects[o].name !== "Summoning Sickness") {
                effectsLength += 1;
            }
        }
        if (effectsLength >= 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.KnifeJuggler = function(context) {
    return true;
};

module.exports.AzureDrake = function(context) {
    return true;
};

module.exports.AcolyteofPain = function(context) {
    return true;
};

module.exports.BigGameHunter = function(context) {
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() >= 7) {
            return true;
        }
    }
    return false;
};

module.exports.FacelessManipulator = function(context) {
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.getHp() + minion.getDamage() >= 12) {
            target = minion;
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.getHp() + minion.getDamage() >= 12) {
            target = minion;
        }
    }
    if(target) {
        return true;
    }
    return false;
};

module.exports.Maexxna = function(context) {
    return true;
};

module.exports.Loatheb = function(context) {
    return true;
};

module.exports.AnnoyoTron = function(context) {
    return true;
};

module.exports.ClockworkGnome = function(context) {
    return true;
};

module.exports.Mechwarper = function(context) {
    return true;
};

module.exports.Snowchugger = function(context) {
    return true;
};

module.exports.HarvestGolem = function(context) {
    return true;
};

module.exports.TinkertownTechnician = function(context) {
    var shouldPlay = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].race === "Mech") {
            shouldPlay = true;
        }
    }
    if (shouldPlay) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MechanicalYeti = function(context) {
    return true;
};

module.exports.PilotedShredder = function(context) {
    return true;
};

module.exports.Kodorider = function(context) {
    return true;
};

module.exports.WarKodo = function(context) {
    return true;
};

module.exports.MasterJouster = function(context) {
    return true;
};

module.exports.Sylvanas = function(context) {
    if(context.foe.minions.length > 0) {
        var valueChance = 0;
        for(var i = 0; i < context.foe.minions.length; i++) {
            if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 5 && context.foe.minions[i].getHp() > 1) {
                valueChance += 0.5;
            }
            if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) <= 5) {
                valueChance -= 0.25;
            }
        }
        if(valueChance >= 0) {
            return true;
        }
    }
    return false;
};

module.exports.Toshley = function(context) {
    return true;
};

module.exports.EmperorThaurissan = function(context) {
    if (context.player.hand.length >= 3) {
        return true;
    }
    if(context.foe.minions.length === 0) {
        return true;
    }
    return false;
};

module.exports.DrBoom = function(context) {
    return true;
};

module.exports.BoomBot = function(context) {
    return true;
};

module.exports.Ragnaros = function(context) {
    var antiValue = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) <= 7) {
            antiValue += 1;
        }
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 9) {
            antiValue -= 1;
        }
    }
    if (antiValue <= 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Alexstrasza = function(context) {
    if (context.player.getHp() < 10 || context.foe.getHp() > 20) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Deathwing = function(context) {
    if(context.foe.minions.length > context.player.minions.length && context.player.hand.length < 5 || (context.player.getHp() || context.foe.getHp()) <= 10) {
        return true;
    }
    return false;
};

module.exports.BloodmageThalnos = function(context) {
    return true;
};

module.exports.Nefarian = function(context) {
    return true;
};

module.exports.NexusChampionSaraad = function(context) {
    return true;
};

module.exports.EliseStarseeker = function(context) {
    return true;
};

module.exports.MaptotheGoldenMonkey = function(context) {
    return true;
};

module.exports.GoldenMonkey = function(context) {
    return true;
};

module.exports.RenoJackson = function(context) {
    var deckCards = [];
    for(var i = 0; i < context.player.deck.length; i++) {
        var card = context.player.deck[i];
        for(var m = 0; m < deckCards.length; m++) {
            if(card.card === deckCards[m].card) {
                return false;
            }
        }
        deckCards.push(card);
    }
    return true;
};

module.exports.EaterofSecrets = function(context) {
    if(context.foe.hero.name !== "Mage" && context.foe.hero.name !== "Paladin" && context.foe.hero.name !== "Hunter") {
        return true;
    }
    else {
        return context.foe.getEffectsName("Secret").length > 0;
    }
};

module.exports.CThun = function(context) {
    if(context.cause.getDamage() >= 10) {
        return true;
    }
    for(var i = 0; i < context.player.hand.length; i++) {
        var card = context.player.hand[i];
        if(card.cult && card.cult === "C'Thun") {
            return false;
        }
    }
    for(i = 0; i < context.player.deck.length; i++) {
        card = context.player.deck[i];
        if(card.cult && card.cult === "C'Thun") {
            return false;
        }
    }
};

module.exports.YShaarjRageUnbound = function(context) {
    return true;
};

module.exports.YoggSaron = function(context) {
    var spells = 0;
    for(var i = 0; i < context.player.graveyard.length; i++) {
        if(context.player.graveyard[i].type == "spell") {
            spells++;
        }
    }
    return spells > 5;
};

module.exports.NZoth = function(context) {
    var deathrattles = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        if(context.player.graveyard[i].type == "minion" && context.player.graveyard[i].hasEffectType("deathrattle")) {
            deathrattles.push(context.player.graveyard[i]);
        }
    }
    return deathrattles.length >= 3 && context.player.minions.length <= 3;
};

module.exports.ArcaneGiant = function(context) {
    var spells = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i];
        if(card.type == "spell") {
            spells.push(card);
        }
    }
    return (12 - 1 * spells.length <= 8);
};

module.exports.Resurrect = function(context) {
    var minions = [];
    var totalCost = 0;
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i];
        if(card.type == "minion") {
            totalCost += card.cost;
            minions.push(card);
        }
    }
    return (totalCost / minions.length >= 3);
};

module.exports.Fireball = function(context) {
    var isPowerful = false;
    if (context.foe.minions.length > 0) {
        for (var i = 0; i < context.foe.minions.length; i++) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 10 && context.foe.minions[i].getHp() >= 4) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ArcaneMissiles = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 3 || context.foe.minions[i].getHp() <= 2) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Polymorph = function(context) {
    var isPowerful = false;
    if (context.foe.minions.length > 0) {
        for (var i = 0; i < context.foe.minions.length; i++) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 12) {
                isPowerful = true;
            }
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Frostbolt = function(context) {
    var isTarget = false;
    if (context.foe.minions.length > 0) {
        for (var i = 0; i < context.foe.minions.length; i++) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 9 || (context.foe.minions[i].getDamage() >= 3 && context.foe.minions[i].getHp() === 3)) {
                isTarget = true;
            }
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ManaWyrm = function(context) {
    return true;
};

module.exports.UnstablePortal = function(context) {
    return true;
};

module.exports.GoblinBlastmage = function(context) {
    var shouldPlay = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].race === "Mech") {
            shouldPlay = true;
        }
    }
    if (shouldPlay) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MirrorEntity = function(context) {
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i] === effects.MirrorEntity) {
            return false;
        }
    }
    return true;
};

module.exports.Duplicate = function(context) {
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i] === effects.Duplicate) {
            return false;
        }
    }
    return true;
};

module.exports.Vaporize = function(context) {
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i] === effects.Vaporize) {
            return false;
        }
    }
    return true;
};

module.exports.ArcaneIntellect = function(context) {
    return true;
};

module.exports.ArcaneExplosion = function(context) {
    var goodTargets = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 1) {
            goodTargets += 1;
        }
        if (context.foe.minions[i].getHp() === 2) {
            goodTargets += 0.5;
        }
        if (context.foe.minions[i].getHp() === 3) {
            goodTargets += 0.25;
        }
    }
    if (goodTargets >= 2.5) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Flamestrike = function(context) {
    var value = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() >= 4) {
            value += 1;
        }
        if (context.foe.minions[i].getHp() === 5) {
            value += 0.5;
        }
        if (context.foe.minions[i].getHp() >= 6) {
            value += 0.25;
        }
    }
    if (value >= 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ConeofCold = function(context) {
    var goodTargets = 0;
    var firstTarget = false;
    var secondTarget = false;
    var thirdTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 9) {
            goodTargets += 1;
        }
        if (context.foe.minions[i - 1]) {
            if (context.foe.minions[i - 1].getHp() <= 2 || (context.foe.minions[i - 1].getHp() + context.foe.minions[i - 1].getDamage()) > 9) {
                goodTargets += 1;
                secondTarget = true;
            }
        }
        if (context.foe.minions[i + 1]) {
            if (context.foe.minions[i].getHp() <= 2 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 9) {
                goodTargets += 1;
                thirdTarget = true;
            }
        }
        if (!(goodTargets >= 2)) {
            goodTargets = 0;
        }
        if (goodTargets >= 2) {
            firstTarget = context.foe.minions[i];
            break;
        }
    }
    if (goodTargets >= 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Spellslinger = function(context) {
    return true;
};

module.exports.Flamecannon = function(context) {
    var chanceOfValue = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 6 && context.foe.minions[i].getHp() === 4) {
            chanceOfValue += 3;
        }
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 && context.foe.minions[i].getHp() <= 3) {
            chanceOfValue += 2;
        }
        if (context.foe.minions[i].getHp() > 4) {
            chanceOfValue += 1;
        }
        else {
            chanceOfValue -= 1;
        }
    }
    if (chanceOfValue >= 0.5) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.FrostNova = function(context) {
    var totalDamage = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        totalDamage += context.foe.minions[i].getDamage();
    }
    if (totalDamage >= 8) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MirrorImage = function(context) {
    var totalDamage = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        totalDamage += context.foe.minions[i].getDamage();
    }
    if (totalDamage >= 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ArchmageAntonidas = function(context) {
    return true;
};

module.exports.Execute = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() < context.foe.minions[i].maxHp) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 12) {
                isTarget = true;
            }
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Whirlwind = function(context) {
    var value = 0;
    for (var i = 0; i < context.player.minions.length; i++) {
        var hasSpecial = false;
        if (context.player.minions[i].enrage && context.player.minions[i].getHp() > 1) {
            value += 1;
            hasSpecial = true;
        }
        for (var o = 0; o < context.player.minions[i].effects.length; o++) {
            if (context.player.minions[i].effects[o].type === "pain" || context.player.minions[i].effects[o].type === "damage hunger") {
                value += 1;
                hasSpecial = true;
            }
        }
        if (!hasSpecial) {
            value -= 1;
        }
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        var hasSpecial = false;
        if (context.foe.minions[i].enrage) {
            value -= 1;
            hasSpecial = true;
        }
        for (o = 0; o < context.foe.minions[i].effects.length; o++) {
            if (context.foe.minions[i].effects[o].type === "pain" || context.foe.minions[i].effects[o].type === "damage hunger") {
                value -= 1;
                hasSpecial = true;
            }
        }
        if (!hasSpecial) {
            value += 1;
        }
    }
    if (value > 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ArcaniteReaper = function(context) {
    return true;
};

module.exports.GrimPatron = function(context) {
    var shouldPlay = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].name === "Whirlwind" || context.player.hand[i].name === "Inner Rage" || context.player.hand[i].name === "Cruel Taskmaster") {
            shouldPlay = true;
        }
    }
    if (shouldPlay) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.FrothingBerserker = function(context) {
    return true;
};

module.exports.Cleave = function(context) {
    var targetNum = 0;
    var badTargetNum = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2 && context.foe.minions[i].getDamage() >= 2) {
            targetNum += 1;
        }
        if (context.foe.minions[i].getHp() >= 6) {
            badTargetNum += 1;
        }
    }
    if (targetNum >= 2 && badTargetNum <= 3) {
        return true;
    }
    return false;
};

module.exports.BattleRage = function(context) {
    var injuredNum = 0;
    if(context.player.getHp() < context.player.getMaxHp()) {
        injuredNum += 1;
    }
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp()) {
            injuredNum += 1;
        }
    }
    if(injuredNum >= 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.BloodWarriors = function(context) {
    var injuredMinions = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.getHp() < minion.getMaxHp()) {
            injuredMinions++;
        }
    }
    if(injuredMinions >= 2) {
        return true;
    }
    return false;
}

module.exports.IronSensei = function(context) {
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].race === "Mech") {
            return true;
        }
    }
    return false;
};

module.exports.Backstab = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 2 && context.foe.minions[i].getHp() === context.foe.minions[i].maxHp && context.foe.minions[i].getDamage() > 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Sap = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 12 && context.foe.minions[i].getHp() > 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Shiv = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 1 && context.foe.minions[i].getDamage() > 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
}

module.exports.FanofKnives = function(context) {
    var goodTargets = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 1) {
            goodTargets += 1;
        }
        if (context.foe.minions[i].getHp() === 2) {
            goodTargets += 0.5;
        }
        if (context.foe.minions[i].getHp() === 3) {
            goodTargets += 0.25;
        }
    }
    if (goodTargets >= 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Sprint = function(context) {
    var shouldUse = false;
    if (context.player.hand.length <= 3) {
        shouldUse = true;
    }
    if (shouldUse) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Crackle = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 && context.foe.minions[i].getHp() >= 3) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.LavaBurst = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 9 && context.foe.minions[i].getHp() >= 5) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.WhirlingZapoMatic = function(context) {
    return true;
};

module.exports.FeralSpirit = function(context) {
    return true;
};

module.exports.ForkedLightning = function(context) {
    var targetNum = 0;
    var badTargetNum = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2 && context.foe.minions[i].getDamage() >= 2) {
            targetNum += 1;
        }
        if (context.foe.minions[i].getHp() >= 6) {
            badTargetNum += 1;
        }
    }
    if (targetNum >= 2 && badTargetNum <= 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.UnboundElemental = function(context) {
    for(var i = 0; i < context.player.hand.length; i++) {
        if(context.cause.overload > 0) {
            return true;
        }
    }
    return false;
};

module.exports.AlAkirtheWindlord = function(context) {
    return true;
};

module.exports.AnimalCompanion = function(context) {
    return true;
};

module.exports.MultiShot = function(context) {
    var targetNum = 0;
    var badTargetNum = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 3 && context.foe.minions[i].getDamage() >= 2) {
            targetNum += 1;
        }
        if (context.foe.minions[i].getHp() >= 8) {
            badTargetNum += 1;
        }
    }
    if (targetNum >= 2 && badTargetNum <= 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.UnleashTheHounds = function(context) {
    if (context.foe.minions.length > 3) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ExplosiveShot = function(context) {
    var goodTargets = 0;
    var firstTarget = false;
    var secondTarget = false;
    var thirdTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 5 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 9) {
            goodTargets += 1;
        }
        if (context.foe.minions[i - 1]) {
            if (context.foe.minions[i - 1].getHp() <= 2 || (context.foe.minions[i - 1].getHp() + context.foe.minions[i - 1].getDamage()) > 9) {
                goodTargets += 1;
                secondTarget = true;
            }
        }
        if (context.foe.minions[i + 1]) {
            if (context.foe.minions[i].getHp() <= 2 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 9) {
                goodTargets += 1;
                thirdTarget = true;
            }
        }
        if (!(goodTargets >= 2)) {
            goodTargets = 0;
        }
        if (goodTargets >= 2) {
            firstTarget = context.foe.minions[i];
            break;
        }
    }
    if (goodTargets >= 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ArcaneShot = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2 && (context.foe.minions[i].getDamage() > 1 || context.foe.minions[i].effects.length > 0)) {
            isTarget = true;
        }
    }
};

module.exports.Webspinner = function(context) {
    return true;
};

module.exports.CobraShot = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 3 && (context.foe.minions[i].getDamage() > 2 || context.foe.minions[i].effects.length > 0)) {
            isTarget = true;
        }
    }
};

module.exports.DeadlyShot = function(context) {
    var chanceOfValue = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 14) {
            chanceOfValue += 3;
        }
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 10) {
            chanceOfValue += 2;
        }
        if (context.foe.minions[i].getHp() > 7) {
            chanceOfValue += 1;
        }
        else {
            chanceOfValue -= 1;
        }
    }
    if (chanceOfValue >= 0.5) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.HuntersMark = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 10 && context.foe.minions[i].getHp() >= 5) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.KingsElekk = function(context) {
    return true;
};

module.exports.CoreRager = function(context) {
    if (context.player.hand.length === 1 || (context.player.minions.length === 0 && context.foe.minions.length >= 1)) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.KingKrush = function(context) {
    return true;
};

module.exports.Gahzrilla = function(context) {
    return true;
};

module.exports.Innervate = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].cost <= context.player.mana + 1) {
            if (context.player.hand[i].cost === context.player.mana + 1) {
                isTarget = true;
                break;
            }
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.DruidoftheFlame = function(context) {
    return true;
};

module.exports.KlaxxiAmberWeaver = function(context) {
    var hasCThun;
    for(var i = 0; i < context.player.deck.length; i++) {
        var card = context.player.deck[i];
        if(card.name === "C'Thun") {
            hasCThun = true;
            if(card.getDamage() >= 10) {
                return true;
            }
        }
    }
    if(!hasCThun) {
        return true;
    }
    return false;
};

module.exports.Swipe = function(context) {
    var goodTargets = 0;
    var target = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 5) {
            target = context.foe.minions[i];
        }
        if(context.foe.getHp() <= 6) {
            target = context.foe;
        }
    }
    if (target) {
        for (i = 0; i < context.foe.minions.length; i++) {
            if (context.foe.minions[i].getHp() <= 2 && context.foe.minions[i] !== target) {
                goodTargets += 1;
            }
            if (context.foe.minions[i].getHp() === 3 && context.foe.minions[i] !== target) {
                goodTargets += 0.5;
            }
            if (context.foe.minions[i].getHp() >= 4 && context.foe.minions[i] !== target) {
                goodTargets += 0.25;
            }
        }
    }
    if (goodTargets >= 1.25 && target) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Moonfire = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 1 && context.foe.minions[i].getDamage() > 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.TreeofLife = function(context) {
    var moreDamaged = 0;
    moreDamaged += (context.player.damageTaken - context.foe.damageTaken);
    for(var i = 0; i < context.player.minions.length; i++) {
        moreDamaged += context.player.minions[i].damageTaken;
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        moreDamaged -= context.foe.minions[i].damageTaken;
    }
    if(moreDamaged >= 5) {
        return true;
    }
    return false;
}

module.exports.Cenarius = function(context) {
    if (context.player.minions.length > 2 || context.foe.minions.length > 0 || context.player.health <= 10) {
        return true;
    }
};

module.exports.Malorne = function(context) {
    return true;
};

module.exports.Darkbomb = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 3 && context.foe.minions[i].getDamage() >= 2) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.ShadowBolt = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 4 && context.foe.minions[i].getDamage() >= 3) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MortalCoil = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() === 1 && context.foe.minions[i].getDamage() > 1) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Voidwalker = function(context) {
    return true;
};

module.exports.Succubus = function(context) {
    return true;
};

module.exports.Shadowflame = function(context) {
    var isTarget = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getDamage() >= 3) {
            isTarget = true;
        }
    }
    if(isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.LordJaraxxus = function(context) {
    if (context.player.getHp() <= 20) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MalGanis = function(context) {
    return true;
}

module.exports.LordJaraxxusINFERNO = function(context) {
    return true;
};

module.exports.StandAgainstDarkness = function(context) {
    if(context.player.minions.length <= 3) {
        return true;
    }
    return false;
}

module.exports.Equality = function(context) {
    var value = 0;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].getHp() > 1) {
            value -= (context.player.minions[i].getHp() + context.player.minions[i].getDamage());
        }
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() > 1) {
            value += (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage());
        }
    }
    if (value > 1) {
        return true;
    }
    return false;
};

module.exports.AvengingWrath = function(context) {
    var goodTargets = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 3 && context.foe.minions[i].getHp() <= 2) {
            goodTargets += 1;
        }
        if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 5 && context.foe.minions[i].getHp() <= 4) {
            goodTargets += 0.5;
        }
    }
    if (goodTargets >= 2) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.BlessingofKings = function(context) {
    var isPowerful = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if ((context.player.minions[i].getHp() + context.player.minions[i].getHp()) > 5) {
            isPowerful = true;
        }
    }
    if (isPowerful) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.GuardianofKings = function(context) {
    if (context.player.getHp() <= 27) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.WarhorseTrainer = function(context) {
    return true;
};

module.exports.HammerofWrath = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 3 && context.foe.minions[i].getDamage() >= 2) {
            isTarget = true;
        }
    }
    if (isTarget) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.MurlocKnight = function(context) {
    return true;
};

module.exports.TirionFordring = function(context) {
    if(!context.player.weapon) {
        return true;
    }
    return false;
};

module.exports.BolvarFordragon = function(context) {
    if(context.cause.getDamage() >= 4) {
        return true;
    }
    return false;
};

module.exports.PowerWordShield = function(context) {
    var isPowerful = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].getDamage() >= 6 && context.player.minions[i].getHp() <= 3) {
            isPowerful = true;
        }
    }
    return isPowerful;
};

module.exports.ShadowWordPain = function(context) {
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() >= 2 && context.foe.minions[i].getDamage() <= 3) {
            return true;
        }
    }
    return false;
};

module.exports.ShadowWordDeath = function(context) {
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() >= 5 && context.foe.minions[i].getHp() > 3) {
            return true;
        }
    }
    return false;
};

module.exports.HolyNova = function(context) {
    var goodTargets = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2) {
            goodTargets += 1;
        }
        if (context.foe.minions[i].getHp() === 3) {
            goodTargets += 0.5;
        }
        if (context.foe.minions[i].getHp() >= 4) {
            goodTargets += 0.25;
        }
    }
    for (i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].getHp() === context.player.minions[i].getMaxHp() - 2) {
            goodTargets += 1;
        }
        if (context.player.minions[i].getHp() === context.player.minions[i].getMaxHp() - 3) {
            goodTargets += 0.5;
        }
        if (context.player.minions[i].getHp() <= context.player.minions[i].getMaxHp() - 4) {
            goodTargets += 0.25;
        }
    }
    if (goodTargets >= 3.25) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.Entomb = function(context) {
    if (context.foe.minions.length > 0) {
        for (var i = 0; i < context.foe.minions.length; i++) {
            if ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 10 && context.foe.minions[i].getHp() >= 4) {
                return true;
            }
        }
    }
    return false;
};

module.exports.VelensChosen = function(context) {
    if(context.player.minions.length > 0) {
        return true;
    }
};

module.exports.NorthshireCleric = function(context) {
    return true;
};

module.exports.DarkCultist = function(context) {
    return true;
};

module.exports.TwilightWhelp = function(context) {
    var hasDragon = false;
    for(var i = 0; i < context.player.hand.length; i++) {
        if(context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
            return true;
        }
    }
    if(!hasDragon) {
        for(var i = 0; i < context.player.hand.length; i++) {
            if(context.player.hand[i].cost <= context.player.mana) {
                return false;
            }
        }
    }
    return true;
};

module.exports.AnubRekhanSkitter = function(context) {
    return true;
};

module.exports.LocustSwarm = function(context) {
    var value = 0;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() >= 3) {
            value += 1;
        }
        if (context.foe.minions[i].getHp() === 4) {
            value += 0.5;
        }
        if (context.foe.minions[i].getHp() >= 5) {
            value += 0.25;
        }
    }
    if (value >= 2.5) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.GrandWidowFaerlinaRainofFire = function(context) {
    return true;
};

// Custom Sets

module.exports.C_CultAdherent = function(context) {
    return true;
};

module.exports.C_DarkEmpowerment = function(context) {
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Cult Adherent") {
            return true;
        }
    }
    return false;
};

module.exports.C_CultFanatic = function(context) {
    return true;
};

module.exports.C_DarkTransformation = function(context) {
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Cult Fanatic") {
            return true;
        }
    }
    return false;
};

module.exports.C_Repairs = function(context) {
    if(context.player.getHp() <= 20) { return true; }
    return false;
};

module.exports.C_CannonBlast = function(context) {
    var isTarget = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 4 && context.foe.minions[i].getDamage() >= 2) {
            isTarget = true;
        }
    }
    if (isTarget || context.player.hand.length >= 8) {
        return true;
    }
    return false;
};

module.exports.C_IncineratingBlast = function(context) {
    var goodTargets = 0;
    var target = false;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 8) {
            target = context.foe.minions[i];
        }
        if(context.foe.getHp() <= 12) {
            target = context.foe;
        }
    }
    if (target) {
        for (i = 0; i < context.foe.minions.length; i++) {
            if (context.foe.minions[i].getHp() <= 2 && context.foe.minions[i] !== target) {
                goodTargets += 1;
            }
            if (context.foe.minions[i].getHp() === 3 && context.foe.minions[i] !== target) {
                goodTargets += 0.5;
            }
            if (context.foe.minions[i].getHp() >= 4 && context.foe.minions[i] !== target) {
                goodTargets += 0.25;
            }
        }
    }
    if (goodTargets >= 1.25 && target) {
        return true;
    }
    else {
        return false;
    }
};