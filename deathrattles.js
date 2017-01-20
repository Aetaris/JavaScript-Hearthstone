var utilities = require('./utilities.js');
var printer = require('./printer.js')
var effects = require ('./effects.js');
var abilities = require('./abilities.js');
var weapons = require('./weapons.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');
var cardLists = require('./cardlists.js');

var LeperGnome = function(source, context) {
    printer.print(context.player.color + " Leper Gnome's deathrattle deals 2 damage to the " + context.foe.color + " " + context.foe.name + ".");
    utilities.dealDamage(context.foe, 2, context);
};

var HauntedCreeper = function(source, context) {
    printer.print(context.player.color + " Haunted Creeper's deathrattle summons two " + context.player.color + " Spectral Spiders.");
    utilities.summon(SpectralSpider(context.player.color), context.player, context);
    utilities.summon(SpectralSpider(context.player.color), context.player, context);
};

var DancingSwords = function(source, context) {
    printer.print(source.color + " " + source.name + "'s deathrattle allows the " + context.foe.color + " " + context.foe.name + " to draw a card.");
    utilities.drawCard(context.foe, {player: context.foe, foe: context.player, cause: source});
};

var UnstableGhoul = function(source, context) {
    printer.print(source.color + " " + source.name + " violently explodes, dealing 1 damage to all minions.");
    var minions = [];
    for(var i in context.player.minions) {
        var minion = context.player.minions[i];
        if(minion != source) {
            minions.push(minion);
        }
    }
    for(i in context.foe.minions) {
        var minion = context.foe.minions[i];
        if(minion != source) {
            minions.push(minion);
        }
    }
    for(i in minions) {
        utilities.dealDamage(minions[i], 1, context);
        if(!minions[i].isAlive()) {
            i--;
        }
    }
};

var NerubianEgg = function(source, context) {
    printer.print(context.player.color + " Nerubian Egg's deathrattle summons a " + context.player.color + " 4/4 Nerubian.");
    utilities.summon(EggNerubian(context.player.color), context.player, context);
};

var Deathlord = function(source, context) {
    var target = false;
    var targetList = [];
    for(var i = 0; i < context.foe.deck.length; i++) {
        if(context.foe.deck[i].type === "minion") {
            targetList.push(context.foe.deck[i]);
        }
    }
    target = targetList[Math.floor(Math.random()*targetList.length)];
    if(target) {
        printer.print(context.player.color + " Deathlord's deathrattle summons " + context.foe.color + " " + target.name + " from the " + context.foe.color + " " + context.foe.name + "'s deck.");
        utilities.summon(target, context.foe, { player: context.foe, foe: context.player, cause: false } );
        context.foe.deck.splice(context.foe.deck.indexOf(target), 1);
    } else {
        printer.print(context.player.color + " Deathlord's deathrattle found no minions in the " + context.foe.color + " " + context.foe.name + "'s deck.");
    }
};

var SludgeBelcher = function(source, context) {
    printer.print(context.player.color + " Sludge Belcher's deathrattle summons a " + context.player.color + " 1/2 Slime with Taunt.");
    utilities.summon(BelcherSlime(context.player.color), context.player, context);
};

var Abomination = function(source, context) {
    printer.print(source.color + " Abomination's deathrattle deals 2 damage to all characters.");
    utilities.dealDamage(context.foe, 2, context);
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i] !== source) {
            utilities.dealDamage(context.foe.minions[i], 2, context);
        }
    }
    utilities.dealDamage(context.player, 2, context);
    for(i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i] !== source) {
            utilities.dealDamage(context.player.minions[i], 2, context);
        }
    }
};

var Deathcharger = function(source, context) {
    printer.print(context.player.color + " Deathcharger's deathrattle deals 3 damage to the " + context.player.color + " " + context.player.name + ".");
    utilities.dealDamage(context.player, 3, context);
};

var ClockworkGnome = function(source, context) {
    printer.print(context.player.color + " Clockwork Gnome's deathrattle gives " + context.player.color + " " + context.player.name + " a Spare Part card.");
    var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    var part = SpareParts[sparePartNum]();
    utilities.addCard(part, context.player, context);
    printer.print(context.player.color + " " + context.player.name + " receives: " + part.name + ".");
};

var HarvestGolem = function(source, context) {
    printer.print(context.player.color + " Harvest Golem's deathrattle summons a " + context.player.color + " Damaged Golem.");
    context.player.minions.splice(context.player.minions.indexOf(source), 1);
    utilities.summon(DamagedGolem(context.player.color), context.player, context);
};

var MechanicalYeti = function(source, context) {
    printer.print(context.player.color + " Mechanical Yeti's deathrattle gives both " + context.player.color + " " + context.player.name
    + " and " + context.foe.color + " " + context.foe.name + "a Spare Part card.");
    var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    var part = SpareParts[sparePartNum]();
    utilities.addCard(part, context.player, context);
    printer.print(context.player.color + " " + context.player.name + " receives: " + part.name + ".");
    sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    part = SpareParts[sparePartNum]();
    utilities.addCard(part, context.foe, {player: context.foe, foe: context.player});
    printer.print(context.foe.color + " " + context.foe.name + " receives: " + part.name + ".");
};

var PilotedShredder = function(source, context) {
    var minionList = [];
    var cardList = cardLists.allCards();
    for(var i in cardList) {
        var card = cardList[i]();
        if(card.type == "minion" && card.cost == 2) {
            minionList.push(card);
        }
    }
    
    var minion = minionList[Math.floor(Math.random()*minionList.length)];
    printer.print(source.color + " " + source.name + "'s deathrattle summons a random 2-cost minion.");
    if(context.player.minions.length < 7 && minion) {
        utilities.summon(minion, context.player, context);
        printer.print("Minion summoned: " + minion.name);
    }
    else if (minion) {
        printer.print("Board too full! Could not summon minion.");
    } else {
        printer.print("No valid minions! That... shouldn't happen.");
    }
};

var Toshley = function(source, context) {
    printer.print(context.player.color + " Toshley's deathrattle gives " + context.player.color + " " + context.player.name + " a Spare Part card.");
    var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    var part = SpareParts[sparePartNum]();
    utilities.addCard(part, context.player, context);
    printer.print(context.player.color + " " + context.player.name + " receives: " + part.name + ".");
};

var BoomBotBoom = function(source, context) {
    var target = context.foe;
    var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
    var randomDamage = 1 + Math.floor(4 * Math.random(0, 1));
    if(targetRoll < context.foe.minions.length) {
        target = context.foe.minions[targetRoll];
    }
    else {
        target = context.foe;
    }
    if(target.getHp() > 0) {
        printer.print(context.player.color + " Boom Bot detonates, dealing " + randomDamage + " damage to " + target.name + ".");
        utilities.dealDamage(target, randomDamage, context);
    }
};

var Sylvanas = function(source, context) {
    var target = context.foe;
    var targetRoll = Math.floor((context.foe.minions.length) * Math.random(0, 1));
    target = context.foe.minions[targetRoll];
    if(target) {
        if(target.getHp() > 0) {
            printer.print(context.player.color + " Sylvanas Windrunner's deathrattle captures the soul of " + target.color + " " + target.name + ", taking control of it.");
            target.color = source.color;
            utilities.summon(target, context.player, context);
            context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
        }
    }
};

var BloodmageThalnos = function(source, context) {
    printer.print(source.color + " Bloodmage Thalnos' deathrattle draws a card for " + context.player.color + " " + context.player.name + ".");
    utilities.drawCard(context.player, context);
};

var CorruptedHealbot = function(source, context) {
    printer.print(source.color + " Corrupted Healbot's deathrattle restores Health to the opponent, the " + context.foe.color + " " + context.foe.name + ".");
    utilities.healDamage(context.foe, 8, {player: context.foe, foe: context.player, cause: source});
};

var PollutedHoarder = function(source, context) {
    printer.print(source.color + " Polluted Hoarder's deathrattle draws a card for " + context.player.color + " " + context.player.name + ".");
    utilities.drawCard(context.player, context);
};

var AyaBlackpaw = function(source, context) {
    var golem = utilities.jadeSetup(JadeGolem(), context.player);
    printer.print(source.color + " " + source.name + "'s deathrattle summons a " + golem.baseDamage + "/" + golem.baseHp + " " + golem.name + ".");
    utilities.summon(golem, context.player, context);
};

var UnstableGhoulMinion = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", ["Neutral"], "Unstable Ghoul", 2, 0, 3, 1, false, false, false, [effects.sickness, effects.taunt, UnstableGhoul_Deathrattle], ais.true, UnstableGhoulMinion);
};

var IcecrownCombatant = function(source, context) {
    printer.print(source.color + " " + source.name + "'s deathrattle reanimates it as an Unstable Ghoul under the " + context.foe.color + " " + context.foe.name + "'s control.");
    utilities.summon(UnstableGhoulMinion(), context.foe, {player: context.foe, foe: context.player});
};

var PlagueRatBOOM = function(source, context) {
    printer.print("A plague ravages the board, dealing 3 damage to all minions.");
    for(var i in context.player.minions) {
        var minion = context.player.minions[i];
        utilities.dealDamage(minion, 3, context);
        if(!minion.isAlive()) {
            i--;
        }
    }
    for(i in context.foe.minions) {
        minion = context.foe.minions[i];
        utilities.dealDamage(minion, 3, context);
        if(!minion.isAlive()) {
            i--;
        }
    }
    for(i in context.player.effects) {
        if(context.player.effects[i].name == "The Black Death") {
            context.player.effects.splice(i, 1);
            i--;
        }
    }
};

var PlagueRatEffect = {
    name: "The Black Death",
    type: "start of turn friend",
    action: PlagueRatBOOM
};

var PlagueRat = function(source, context) {
    printer.print(source.color + " " + source.name + " leaves behind a disease that will ravage the board at the start of the " + context.player.color + " " + context.player.name + "'s next turn.");
    context.player.addEffect(PlagueRatEffect);
};

var SpiritAlarm = function(source, context) {
    printer.print(source.color + " " + source.name + "'s deathrattle silences all minions.");
    for(var i in context.player.minions) {
        utilities.dispel(context.player.minions[i], context);
    }
    for(i in context.foe.minions) {
        utilities.dispel(context.foe.minions[i], context);
    }
};

var UndyingSpectreMinion = function() {
    return utilities.makeMinion(false, "Epic", "Icecrown Citadel", ["Neutral"], "Undying Spectre", 5, 0, 1, 4, false, false, false, [effects.sickness, UndyingSpectre_Deathrattle], ais.true, UndyingSpectreMinion);
};

var UndyingSpectreAction = function(source, context) {
    var minion = UndyingSpectreMinion();
    for(var i in context.player.effects) {
        var effect = context.player.effects[i];
        if(effect.name == "Undying Spectre Reforming") {
            printer.print(source.color + " " + minion.name + " reforms.");
            context.player.effects.splice(i, 1);
            utilities.summon(minion, context.player, context);
            i--;
        }
    }
};

var UndyingSpectreEffect = {
    name: "Undying Spectre Reforming",
    type: "start of turn",
    action: UndyingSpectreAction
};

var UndyingSpectre = function(source, context) {
    printer.print(source.color + " " + source.name + " breaks apart. Its essence will gather together again shortly.");
    context.player.addEffect(UndyingSpectreEffect);
};

var Rhonin = function(source, context) {
    printer.print(source.color + " Rhonin's deathrattle grants " + context.player.color + " " + context.player.name + " 3 copies of Arcane Missiles.");
    for(var i = 0; i < 3; i++) {
        utilities.addCard(ArcaneMissiles(), context.player, context);
    }
};

var WretchedGhoul = function(source, context) {
    printer.print(source.color + " " + source.name + "'s deathrattle damages all damaged minions.");
    for(var i in context.player.minions) {
        var min = context.player.minions[i];
        if(min.damageTaken > 0) {
            utilities.dealDamage(min, 2, context);
        }
        if(!min.isAlive()) {
            i--;
        }
    }
    for(var i in context.foe.minions) {
        var min = context.foe.minions[i];
        if(min.damageTaken > 0) {
            utilities.dealDamage(min, 2, context);
        }
        if(!min.isAlive()) {
            i--;
        }
    }
};

var ArcaneMissiles = function() {
    return utilities.makeSpell("Basic", false, "Arcane Missiles", 1, 0, abilities.ArcaneMissiles, false, ais.ArcaneMissiles, ArcaneMissiles);
};

var AnubarAmbusher = function(source, context) {
    var targets = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i] != source) {
            targets.push(context.player.minions[i]);
        }
    }
    var target = targets[Math.floor(Math.random()*targets.length)];
    if(target) {
        printer.print(source.color + " Anub'ar Ambusher's deathrattle returns " + target.name + " to " + context.player.color + " " + context.player.name + "'s hand.");
        if(!target.card || typeof target.card != "function") {
            throw new Error("lol oops");
        }
        utilities.addCard(target.card(), context.player, context);
        context.player.minions.splice(context.player.minions.indexOf(target), 1);
    }
};

var Webspinner = function(source, context) {
    var beastList = [];
    var allCards = cardLists.allCards();
    for(var i in allCards) {
        var card = allCards[i]();
        if(card.type == "minion" && card.race == "Beast") {
            beastList.push(card);
        }
    }
    
    var beast = beastList[Math.floor(Math.random() * beastList.length)];
    printer.print(source.color + " " + source.name + "'s deathrattle adds a random Beast to the " + context.player.color + " " + context.player.name + "'s hand.");
    if(context.player.hand.length < 10 && beast) {
        printer.print("Beast received: " + beast.name);
        utilities.addCard(beast, context.player, context);
    }
    else if (beast) {
        printer.print("Hand too full! Could not receive card.");
    } else {
        printer.print("There are no beasts in this gamemode! Which means Webspinner is not in this gamemode. I think you've got some problems with your code, mate.");
    }
};

var Malorne = function(source, context) {
    printer.print(source.color + " Malorne's deathrattle shuffles it back into the deck.");
    context.player.deck.push(source.card());
    utilities.shuffle(context.player.deck);
};

var TirionFordring = function(source, context) {
    printer.print(source.color + " Tirion Fordring's deathrattle equips " + context.player.color + " " + context.player.name + " with a 5/3 Ashbringer weapon.");
    utilities.Equip(Ashbringer(), context);
};

var DarkCultist = function(source, context) {
    if(context.player.minions.length > 1) {
        var randomNum = Math.floor((context.player.minions.length - 1) * Math.random(0, 1));
        var target = context.player.minions[randomNum];
        target.addEffect(DarkCultistBuff);
        printer.print(source.color + " Dark Cultist's deathrattle gives " + target.color + " " + target.name + " +3 Health, for a total of " + target.getHp() + ".");
    }
    else {
        printer.print(source.color + " Dark Cultist's deathrattle can't find any allies to buff.");
    }
};

var SergeantSally = function(source, context) {
    var dmg = source.getDamage();
    printer.print(source.color + " Sergeant Sally's deathrattle deals " + dmg + " damage to all enemy minions.");
    var enemyMinions = context.foe.minions.slice();
    for(var i = 0; i < enemyMinions.length; i++) {
        utilities.dealDamage(enemyMinions[i], dmg, context);
    }
};

var DarkCultistBuff = {
    name: "Dark Cultist",
    type: "buff health",
    num: 3
};

var SpectralSpider = function(color) {
    return utilities.makeMinion(false, "Common", "Naxxramas", color, "Spectral Spider", 0, 0, 1, 1, false, false, false, [effects.sickness], ais.MurlocRaider, SpectralSpider);
};

var EggNerubian = function(color) {
    return utilities.makeMinion(false, "Rare", "Naxxramas", color, "Nerubian", 4, 0, 4, 4, false, false, false, [effects.sickness], ais.MurlocRaider, EggNerubian);
};

var BelcherSlime = function(color) {
    return utilities.makeMinion(false, "Common", "Naxxramas", color, "Slime", 1, 0, 2, 1, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, BelcherSlime);
};

var DamagedGolem = function(color) {
    return utilities.makeMinion("Mech", "Common", "Classic", color, "Damaged Golem", 2, 0, 1, 2, false, false, false, [effects.sickness], ais.MurlocRaider, DamagedGolem);
};

var JadeGolem = function() {
    return utilities.makeMinion(false, "Uncollectible", "Mean Streets of Gadgetzan", ["Neutral"], "Jade Golem", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.true, JadeGolem);
};

var WhirlingBlades = module.exports.WhirlingBlades = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Whirling Blades", 1, 0, abilities.WhirlingBlades,
    targetais.WhirlingBlades, filters.minion, ais.WhirlingBlades, WhirlingBlades, 50);
};

var ArmorPlating = module.exports.ArmorPlating = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Armor Plating", 1, 0, abilities.ArmorPlating,
    targetais.ArmorPlating, filters.minion, ais.ArmorPlating, ArmorPlating, 50);
};

var RustyHorn = module.exports.RustyHorn = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Rusty Horn", 1, 0, abilities.RustyHorn,
    targetais.RustyHorn, filters.minion, ais.RustyHorn, RustyHorn, 50);
};

var EmergencyCoolant = module.exports.EmergencyCoolant = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Emergency Coolant", 1, 0, abilities.EmergencyCoolant,
    targetais.EmergencyCoolant, filters.minion, ais.EmergencyCoolant, EmergencyCoolant, 50);
};

var FinickyCloakfield = module.exports.FinickyCloakfield = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Finicky Cloakfield", 1, 0, abilities.FinickyCloakfield,
    targetais.FinickyCloakfield, filters.minion, ais.FinickyCloakfield, FinickyCloakfield, 50);
};

var ReversingSwitch = module.exports.ReversingSwitch = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Reversing Switch", 1, 0, abilities.ReversingSwitch,
    targetais.ReversingSwitch, filters.minion, ais.ReversingSwitch, ReversingSwitch, 50);
};

var TimeRewinder = module.exports.TimeRewinder = function() {
    return utilities.makeSpell("Basic", "Goblins vs Gnomes", false, "Time Rewinder", 1, 0, abilities.TimeRewinder,
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

var Ashbringer = function(color) {
    return utilities.makeWeapon("Legendary", "Classic", ["Paladin"], "Ashbringer", 5, 0, 5, 3, false, false, false, [], ais.ArcaniteReaper, Ashbringer, 100);
};

module.exports.LeperGnome_Deathrattle = {
    name: "Leper Gnome",
    type: "deathrattle",
    action: LeperGnome
};

module.exports.DancingSwords_Deathrattle = {
    name: "Dancing Swords",
    type: "deathrattle",
    action: DancingSwords
};

module.exports.HauntedCreeper_Deathrattle = {
    name: "Haunted Creeper",
    type: "deathrattle",
    action: HauntedCreeper
};

var UnstableGhoul_Deathrattle = module.exports.UnstableGhoul_Deathrattle = {
    name: "Unstable Ghoul",
    type: "deathrattle",
    action: UnstableGhoul
};

module.exports.NerubianEgg_Deathrattle = {
    name: "Nerubian Egg",
    type: "deathrattle",
    action: NerubianEgg
};

module.exports.Deathlord_Deathrattle = {
    name: "Deathlord",
    type: "deathrattle",
    action: Deathlord
};

module.exports.SludgeBelcher_Deathrattle = {
    name: "Sludge Belcher",
    type: "deathrattle",
    action: SludgeBelcher
};

module.exports.Abomination_Deathrattle = {
    name: "Abomination",
    type: "deathrattle",
    action: Abomination
};

module.exports.Deathcharger_Deathrattle = {
    name: "Deathcharger",
    type: "deathrattle",
    action: Deathcharger
};

module.exports.ClockworkGnome_Deathrattle = {
    name: "Clockwork Gnome",
    type: "deathrattle",
    action: ClockworkGnome
};

module.exports.HarvestGolem_Deathrattle = {
    name: "Harvest Golem",
    type: "deathrattle",
    action: HarvestGolem
};

module.exports.MechanicalYeti_Deathrattle = {
    name: "Mechanical Yeti",
    type: "deathrattle",
    action: MechanicalYeti
};

module.exports.PilotedShredder_Deathrattle = {
    name: "Piloted Shredder",
    type: "deathrattle",
    action: PilotedShredder
};

module.exports.BoomBot_Deathrattle = {
    name: "Boom Bot",
    type: "deathrattle",
    action: BoomBotBoom
};

module.exports.Sylvanas_Deathrattle = {
    name: "Sylvanas Windrunner",
    type: "deathrattle",
    action: Sylvanas
};

module.exports.BloodmageThalnos_Deathrattle = {
    name: "Bloodmage Thalnos",
    type: "deathrattle",
    action: BloodmageThalnos
};

module.exports.Toshley_Deathrattle = {
    name: "Toshley",
    type: "deathrattle",
    action: Toshley
};

module.exports.PollutedHoarder_Deathrattle = {
    name: "Polluted Hoarder",
    type: "deathrattle",
    action: PollutedHoarder
};

module.exports.CorruptedHealbot_Deathrattle = {
    name: "Corrupted Healbot",
    type: "deathrattle",
    action: CorruptedHealbot
};

module.exports.IcecrownCombatant_Deathrattle = {
    name: "Icecrown Combatant",
    type: "deathrattle",
    action: IcecrownCombatant
};

module.exports.PlagueRat_Deathrattle = {
    name: "Plague Rat",
    type: "deathrattle",
    action: PlagueRat
};

module.exports.SpiritAlarm_Deathrattle = {
    name: "Spirit Alarm",
    type: "deathrattle",
    action: SpiritAlarm
};

var UndyingSpectre_Deathrattle = module.exports.UndyingSpectre_Deathrattle = {
    name: "Undying Spectre",
    type: "deathrattle",
    action: UndyingSpectre
};

module.exports.WretchedGhoul_Deathrattle = {
    name: "Wretched Ghoul",
    type: "deathrattle",
    action: WretchedGhoul
};

module.exports.AnubarAmbusher_Deathrattle = {
    name: "Anub'ar Ambusher",
    type: "deathrattle",
    action: AnubarAmbusher
};

module.exports.Webspinner_Deathrattle = {
    name: "Webspinner",
    type: "deathrattle",
    action: Webspinner
};

module.exports.Malorne_Deathrattle = {
    name: "Malorne",
    type: "deathrattle",
    action: Malorne
};

module.exports.TirionFordring_Deathrattle = {
    name: "Tirion Fordring",
    type: "deathrattle",
    action: TirionFordring
};

module.exports.DarkCultist_Deathrattle = {
    name: "Dark Cultist",
    type: "deathrattle",
    action: DarkCultist
};

module.exports.SergeantSally_Deathrattle = {
    name: "Sergeant Sally",
    type: "deathrattle",
    action: SergeantSally
};

module.exports.AyaBlackpaw_Deathrattle = {
    name: "Aya Blackpaw",
    type: "deathrattle",
    action: AyaBlackpaw
};

var Arthas_Banshee = function(source, context) {
    var target = context.cause;
    if(target && context.cause.type == "minion" && (context.cause.getHp() + context.cause.getDamage() < 8)) {
        if(target.getHp() > 0) {
            printer.print(source.color + " " + source.name + "'s deathrattle captures the soul of " + target.color + " " + target.name + ", taking control of it.");
            target.color = source.color;
            utilities.summon(target, context.player, context);
            context.foe.minions.splice(context.foe.minions.indexOf(target), 1);
        }
    }
};

module.exports.Arthas_Banshee_Deathrattle = {
    name: "Banshee",
    type: "deathrattle",
    action: Arthas_Banshee
};