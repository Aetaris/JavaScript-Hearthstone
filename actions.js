var utilities = require('./utilities.js');
var printer = require('./printer.js')
var abilities = require('./abilities.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var effects = require('./effects.js');

module.exports.frozen = function(source, context) {
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i].name === "Frozen") {
            source.effects.splice(i, 1);
            i -= 1;
        }
    }
};

module.exports.removeTempBuff = function(source, context) {
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i].name === "Temporary Damage" || source.effects[i].name === "Temporary Buff" || source.effects[i].name === "Remove Temporary Buff") {
            source.effects.splice(i, 1);
            i -= 1;
        }
    }
};

module.exports.tempstealth = function(source, context) {
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i].name === "Stealth" && source.effects[i].type === "start of turn") {
            source.effects.splice(i, 1);
            i -= 1;
        }
    }
};

module.exports.KnifeJuggler = function(source, context) {
    if(context.cause !== source) {
        var target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        if(target.getHp() > 0) {
            printer.print(source.color + " Knife Juggler throws a knife at " + target.color + " " + target.name + ".");
            utilities.dealDamage(target, 1, {player: context.player, foe: context.foe, cause: source});
        }
    }
};

module.exports.AcolyteofPain = function(source, context) {
    printer.print(source.color + " " + source.name + " embraces the pain and allows " + context.player.color + " " + context.player.name + " to draw a card.");
    utilities.drawCard(context.player, context);
};

module.exports.ShadeofNaxxramas = function(source, context) {
    printer.print(source.color + " Shade of Naxxramas is empowered.");
    source.addEffect(ShadeofNaxxramasHp);
    source.addEffect(ShadeofNaxxramasDamage);
};

var ShadeofNaxxramasHp = {
    name: "Shade of Naxxramas HP",
    type: "buff health",
    num: 1,
};

var ShadeofNaxxramasDamage = {
    name: "Shade of Naxxramas Damage",
    type: "buff damage",
    num: 1,
};

module.exports.StoneskinGargoyle = function(source, context) {
    printer.print(source.color + " Stoneskin Gargoyle is restored to full health.");
    source.damageTaken = 0;
};

module.exports.MechWarper = function(source, context) {
    if(context.cause.race === "Mech") {
        return -1;
    }
    return 0;
};

var MechWarperUndo = function(source, context) {
    source.cost += 1;
};

var MechWarperBuff = {
    name: "Warping In",
    type: "dispel",
    action: MechWarperUndo
};

module.exports.freezetarget = function(source, context) {
    if(context.cause.type === "minion") {
        context.cause.addEffect(module.exports.frozen);
        printer.print(source.color + " " + source.name + "'s attack Freezes " + context.cause.color + " " + context.cause.name);
    }
};

module.exports.EmperorThaurissan = function(source, context) {
    printer.print(source.color + " Emperor Thaurissan reduces the cost of the cards in " + context.player.color + " " + context.player.name + "'s hand.");
    for(var i = 0; i < context.player.hand.length; i++) {
        context.player.hand[i].cost -= 1;
        if(context.player.hand[i].cost <= 0) {
            context.player.hand[i].cost = 0;
        }
    }
};

module.exports.Ragnaros = function(source, context) {
    var target = context.foe;
    var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
    if(targetRoll < context.foe.minions.length) {
        target = context.foe.minions[targetRoll];
    }
    else {
        target = context.foe;
    }
    if(target.getHp() > 0) {
        printer.print("Ragnaros: DIE, INSECT!");
        printer.print("Ragnaros hurls a massive fireball at " + target.name + ".");
        utilities.dealDamage(target, 8, context);
    }
};

module.exports.TwilightElder = function(source, context) {
    printer.print(source.color + " Twilight Elder conducts a ritual to empower his master, giving C'Thun +1/+1!");
    var buffed = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "C'Thun") {
            context.player.minions[i].addEffect(ElderHp);
            context.player.minions[i].addEffect(ElderDmg);
            printer.print("C'Thun is empowered up to " + context.player.minions[i].getDamage() + "/" + context.player.minions[i].getHp() + "!");
            buffed = true;
        }
    }
    for(i = 0; i < context.player.hand.length; i++) {
        if(context.player.hand[i].name === "C'Thun") {
            context.player.hand[i].addEffect(ElderHp);
            context.player.hand[i].addEffect(ElderDmg);
            printer.print("C'Thun is empowered up to " + context.player.hand[i].getDamage() + "/" + context.player.hand[i].getHp() + "!");
            buffed = true;
        }
    }
    for(i = 0; i < context.player.deck.length; i++) {
        if(context.player.deck[i].name === "C'Thun") {
            context.player.deck[i].addEffect(ElderHp);
            context.player.deck[i].addEffect(ElderDmg);
            printer.print("C'Thun is empowered up to " + context.player.deck[i].getDamage() + "/" + context.player.deck[i].getHp() + "!");
            buffed = true;
        }
    }
    if(!buffed) {
        printer.print(source.color + " Twilight Elder's ritual could not find C'Thun.");
    }
};

var ElderHp = {
    name: "Twilight Elder HP Buff",
    type: "buff health",
    num: 1
};

var ElderDmg = {
    name: "Twilight Elder DMG Buff",
    type: "buff damage",
    num: 1
};

module.exports.ValidatedDoomsayer = function(source, context) {
    printer.print(source.color + " Validated Doomsayer's Attack is set to 7!");
    source.addEffect(ValidatedDoomsayerBuff);
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i] && source.effects[i].name === "Validated Doomsayer") {
            source.effects.splice(i, 1);
        }
    }
};

module.exports.HoggerScourgeofElwynn = function(source, context) {
    printer.print("Tentacles break off of " + source.color + " Hogger, Scourge of Elwynn, forming a 2/2 Gnoll with Taunt!");
    utilities.summon(Gnoll(source.color), context.player, context);
};

module.exports.YShaarjRageUnbound = function(source, context) {
    printer.print("The corruption of Y'Shaarj pulls an ancient evil from deep within the " + context.player.color + " " + context.player.name + "'s deck...");
    var minionList = [];
    for(var i = 0; i < context.player.deck.length; i++) {
        if(context.player.deck[i].type === "minion") {
            minionList.push(context.player.deck[i]);
        }
    }
    if(minionList.length > 0 && context.player.minions.length < 7) {
        var randomNum = Math.floor(Math.random(0, 1) * minionList.length);
        var target = minionList[randomNum];
        printer.print(target.name + ", the great champion of Y'Shaarj, has been summoned!");
        context.player.deck.splice(context.player.deck.indexOf(target), 1);
        utilities.summon(target, context.player, context);
    }
    else if(minionList.length === 0) {
        printer.print("Whoops! Seems Y'Shaarj is excavating in the wrong spot; there are no minions in this deck.");
    }
    else if(context.player.minions.length === 7) {
        printer.print("There are already seven minions on the field! Y'Shaarj can't summon anything more.");
    }
};

var ValidatedDoomsayerBuff = {
    name: "Validated Doomsayer Buff",
    type: "buff damage",
    num: 7
};

module.exports.BolvarFordragon = function(source, context) {
    printer.print(context.player.color + " Bolvar Fordragon's righteous fury gives him +1 attack, for a total of " + source.getDamage() + ".");
    source.addEffect(BolvarBuff);
};

var BolvarBuff = {
    name: "Righteous Fury",
    type: "buff damage",
    num: 1
};

module.exports.ManaWyrm = function(source, context) {
    printer.print(source.color + " Mana Wyrm draws power from magic, reaching " + (source.getDamage() + 1) + " damage.");
    source.addEffect(ManaWyrmPower);
};

var ManaWyrmPower = {
    name: "Mana Wyrm",
    type: "buff damage",
    num: 1
};

module.exports.MirrorEntity = function(source, context) {
    if(!context.player.effects) {
        printer.print("Effing erors. Player name: " + context.player.name);
    }
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i].specificName && context.player.effects[i].specificName === "Mirror Entity") {
            context.player.effects.splice(i, 1);
        }
    }
    var copy = context.minion;
    copy.color = context.player.color;
    printer.print(source.color + " Secret triggered - Mirror Entity!");
    printer.print(source.color + " " + source.name + " summons a copy of " + context.minion.name + "!");
    utilities.summon(copy, context.player, context );
};

module.exports.Duplicate = function(source, context) {
    if(!context.player.effects) {
        printer.print("Effing erors. Player name: " + context.player.name);
    }
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i].specificName && context.player.effects[i].specificName === "Duplicate") {
            context.player.effects.splice(i, 1);
        }
    }
    printer.print(source.color + " Secret triggered - Duplicate!");
    for(var i = 0; i < 2; i++) {
        if(source.hand.length < 10) {
            if(!context.minion || !context.minion.card) {
                console.log("debug");
            }
            source.hand.push(context.minion.card());
            printer.print("Card added to hand: " + context.minion.name + ".");
        }
        else {
            printer.print("Hand too full! Could not receive new card.");
        }
    }
};

module.exports.IceBlock = function(context) {
    if(context.damage >= context.target.getHp()) {
        for(var i = 0; i < context.player.effects.length; i++) {
            if(context.player.effects[i].specificName && context.player.effects[i].specificName === "Ice Block") {
                context.player.effects.splice(i, 1);
            }
        }
        printer.print(context.target.color + " Secret triggered - Ice Block!");
        printer.print("A block of ice encases the " + context.target.color + " " + context.target.name + ", preventing this damage and all further damage this turn.");
        context.target.effects.push(effects.immune);
        return 0;
    }
    return context.damage;
};

module.exports.Vaporize = function(source, context) {
    if(!context.player.effects) {
        printer.print("Effing erors. Player name: " + context.player.name);
    }
    for(var i = 0; i < context.player.effects.length; i++) {
        if(context.player.effects[i].specificName && context.player.effects[i].specificName === "Vaporize") {
            context.player.effects.splice(i, 1);
        }
    }
    printer.print(source.color + " Secret triggered - Vaporize!");
    printer.print("Minion destroyed - " + context.attacker.name + ".");
    utilities.kill(context.attacker, context);
};

module.exports.Antonidas = function(source, context) {
    printer.print(source.color + " Archmage Antonidas gives " + context.player.color + " " + context.player.name + " a Fireball spell.");
    context.player.hand.unshift(Fireball());
};

module.exports.GrimPatron = function(source, context) {
    if(source.getHp() > 0) {
        printer.print("The damaged " + source.color + " Grim Patron summons another, identical Grim Patron!");
        utilities.summon(GrimPatron(source.color), context.player, context);
    }
};

var GrimPatronEffect = {
    name: "Everyone! Get in here!",
    type: "pain",
    action: module.exports.GrimPatron
};

module.exports.FrothingBerserker = function(source, context) {
        printer.print(source.color + " Frothing Berserker revels in the bloodshed, reaching " + (source.getDamage() + 1) + " damage.");
        source.addEffect(FrothingBerserkerPower);
};

var FrothingBerserkerPower = {
    name: "Frothing Berserker",
    type: "buff damage",
    num: 1
};

module.exports.IronSensei = function(source, context) {
    var target = false;
    var MechList = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].race === "Mech" && context.player.minions[i] !== source) {
            MechList.push(context.player.minions[i]);
        }
    }
    var targetRoll = Math.floor(MechList.length * Math.random(0, 1));
    if(MechList.length > 0) {
        target = MechList[targetRoll];
    }
    if(target) {
        printer.print("The " + context.player.color + " Iron Sensei gives " + target.name + " +2/+2.");
        target.addEffect(IronSenseiKnowledgeHp);
        target.addEffect(IronSenseiKnowledgeDamage);
    }
};

var IronSenseiKnowledgeHp = {
    name: "Iron Sensei's Wisdom",
    type: "buff health",
    num: 2
};

var IronSenseiKnowledgeDamage = {
    name: "Iron Sensei's Wisdom",
    type: "buff damage",
    num: 2
};

module.exports.HealingTideTotem = function(source, context) {
    printer.print(source.color + " " + source.name + "'s Healing Tide restores 1 health to all friendly minions.");
    for(var i = 0; i < context.player.minions.length; i++) {
        utilities.healDamage(context.player.minions[i], 1, context);
        if(context.player.minions[i].getHp() > context.player.minions[i].getMaxHp()) {
            context.player.minions[i].damageTaken = 0;
        }
    }
};

module.exports.UnboundElemental = function(source, context) {
    if(context.cause.overload > 0) {
        source.addEffect(UnboundElementalHp);
        source.addEffect(UnboundElementalDamage);
        printer.print(source.color + " Unbound Elemental is empowered by overloaded mana, reaching "
        + (source.getHp()) + " health and " + (source.getDamage()) + " damage.");
    }
};

var UnboundElementalHp = {
    name: "Unbound Elemental",
    type: "buff health",
    num: 1
};

var UnboundElementalDamage = {
    name: "Unbound Elemental",
    type: "buff damage",
    num: 1
};

var sickness = {
    name: "Summoning Sickness",
    type: "sickness"
};

module.exports.GiantSandworm = function(source, context) {
    if(context.cause.type === "minion" && context.player.turn) {
        printer.print(source.color + " Giant Sandworm rushes on to the next target!");
        if(source.hasEffectName("Summoning Sickness")) {
            source.removeEffect(sickness);
        }
    }
};

module.exports.Gahzrilla = function(source, context) {
    source.addEffect(GahzrillaBuff);
    printer.print(source.color + " Gahz'rilla is infuriated, and its attack is DOUBLED up to " + (source.getDamage()) + ".");
};

var GahzrillaBuff = {
    name: "Gahz'rilla's Fury",
    type: "buff damage",
    num: GahzrillaApply
};

var GahzrillaApply = function(source, damage) {
    return damage;
};

module.exports.MalGanisBuffHp = function(source, health) {
    if(source.race === "Demon") {
        return 2;
    }
    else {
        return 0;
    }
};

module.exports.MalGanisBuffDamage = function(source, damage) {
    if(source.race === "Demon") {
        return 2;
    }
    else {
        return 0;
    }
};

module.exports.WarhorseTrainer = function(source, damage) {
    if(source.name === "Silver Hand Recruit") {
        return 1;
    }
    else {
        return 0;
    }
};

module.exports.NorthshireCleric = function(source, context) {
    if(context.cause.type === "minion") {
        printer.print(source.color + " Northshire Cleric calls upon the Light, letting " + context.player.color + " " + context.player.name + " draw a card.");
        utilities.drawCard(context.player, context);
    }
};

var GrimPatron = function(color) {
    return utilities.makeMinion(false, "Rare", "Blackrock Mountain", color, "Grim Patron", 5, 0, 3, 3, false, false, [sickness, GrimPatronEffect], ais.GrimPatron, GrimPatron);
};

var Gnoll = function(color) {
    return utilities.makeMinion(false, "Basic", "Whispers of the Old Gods", color, "Gnoll", 2, 0, 2, 2, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Gnoll);
};

var Fireball = function() {
    return utilities.makeSpell("Basic", "Classic", false, "Fireball", 4, 0, abilities.Fireball, targetais.Fireball, ais.Fireball, Fireball);
};

var sickness = {
    name: "Summoning Sickness",
    type: "sickness"
};

// Custom Sets

module.exports.C_SkybreakerSorcerer = function(context) {
    context.target.addEffect(effects.frozen);
};

module.exports.C_CultAdherent = function(context) {
    if(context.cause.type === "spell") {
        return 1;
    }
    return 0;
};

module.exports.LadyDeathwhisperManaBarrier = function(context) {
    if(context.cause.maxMana > 0) {
        printer.print(context.cause.color + " Lady Deathwhisper's Mana Barrier prevents lethal damage and restores her to "
        + context.cause.baseHp + " health at the cost of a Mana Crystal! (" + context.cause.maxMana + " remaining");
        context.cause.maxMana -= 1;
        context.cause.mana -= 1;
        context.cause.damageTaken = 0;
    }
    else {
        printer.print(context.cause.color + " Lady Deathwhisper's Mana Barrier is depleted! The lethal damage is not prevented.");
        for(var i = 0; i < context.cause.effects.length; i++) {
            if(context.cause.effects[i]) {
                if(context.cause.effects[i] === effects.C_LadyDeathwhisper) {
                    context.cause.effects.splice(i, 1);
                }
            }
        }
    }
};

module.exports.C_DeformedFanatic = function(context) {
    return 0;
}