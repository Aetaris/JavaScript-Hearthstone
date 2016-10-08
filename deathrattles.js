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
    var targetRoll = Math.floor(targetList.length * Math.random(0, 1));
    var target = targetList[targetRoll];
    printer.print(context.player.color + " Deathlord's deathrattle summons " + context.foe.color + " " + target.name + " from the " + context.foe.color + " " + context.foe.name + "'s deck.");
    utilities.summon(target, context.foe, { player: context.foe, foe: context.player, cause: false } );
    context.foe.deck.splice(context.foe.deck.indexOf(target), 1);
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
    context.player.hand.push(part);
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
    context.player.hand.push(part);
    printer.print(context.player.color + " " + context.player.name + " receives: " + part.name + ".");
    sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    part = SpareParts[sparePartNum]();
    context.foe.hand.push(part);
    printer.print(context.foe.color + " " + context.foe.name + " receives: " + part.name + ".");
};

var PilotedShredder = function(source, context) {
    var minionList = [];
    for(var b = 0; b < cardLists.neutral.length; b++) {
        if(cardLists.neutral[b]().type === "minion" && cardLists.neutral[b]().cost === 2) {
            minionList.push(cardLists.neutral[b]);
        }
    }
    for(var b = 0; b < cardLists.mage.length; b++) {
        if(cardLists.mage[b]().type === "minion" && cardLists.mage[b]().cost === 2) {
            minionList.push(cardLists.mage[b]);
        }
    }
    for(var b = 0; b < cardLists.shaman.length; b++) {
        if(cardLists.shaman[b]().type === "minion" && cardLists.shaman[b]().cost === 2) {
            minionList.push(cardLists.shaman[b]);
        }
    }
    for(var b = 0; b < cardLists.warrior.length; b++) {
        if(cardLists.warrior[b]().type === "minion" && cardLists.warrior[b]().cost === 2) {
            minionList.push(cardLists.warrior[b]);
        }
    }
    for(var b = 0; b < cardLists.rogue.length; b++) {
        if(cardLists.rogue[b]().type === "minion" && cardLists.rogue[b]().cost === 2) {
            minionList.push(cardLists.rogue[b]);
        }
    }
    for(var b = 0; b < cardLists.hunter.length; b++) {
        if(cardLists.hunter[b]().type === "minion" && cardLists.hunter[b]().cost === 2) {
            minionList.push(cardLists.hunter[b]);
        }
    }
    for(var b = 0; b < cardLists.druid.length; b++) {
        if(cardLists.druid[b]().type === "minion" && cardLists.druid[b]().cost === 2) {
            minionList.push(cardLists.druid[b]);
        }
    }
    for(var b = 0; b < cardLists.warlock.length; b++) {
        if(cardLists.warlock[b]().type === "minion" && cardLists.warlock[b]().cost === 2) {
            minionList.push(cardLists.warlock[b]);
        }
    }
    for(var b = 0; b < cardLists.paladin.length; b++) {
        if(cardLists.paladin[b]().type === "minion" && cardLists.paladin[b]().cost === 2) {
            minionList.push(cardLists.paladin[b]);
        }
    }
    for(var b = 0; b < cardLists.priest.length; b++) {
        if(cardLists.priest[b]().type === "minion" && cardLists.priest[b]().cost === 2) {
            minionList.push(cardLists.priest[b]);
        }
    }
    var randomNum = minionList.length;
    var minion = Math.floor(randomNum * Math.random(0, 1));
    printer.print(source.color + " " + source.name + "'s deathrattle summons a random 2-cost minion.");
    if(context.player.minions.length < 7) {
        var newMinion = minionList[minion]();
        utilities.summon(newMinion, context.player, context);
        printer.print("Minion summoned: " + newMinion.name);
    }
    else {
        printer.print("Board too full! Could not summon minion.");
    }
};

var Toshley = function(source, context) {
    printer.print(context.player.color + " Toshley's deathrattle gives " + context.player.color + " " + context.player.name + " a Spare Part card.");
    var sparePartNum = Math.floor((SpareParts.length) * Math.random(0, 1));
    var part = SpareParts[sparePartNum]();
    context.player.hand.push(part);
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
    printer.print(source.color + "Bloodmage Thalnos' deathrattle draws a card for " + context.player.color + " " + context.player.name + ".");
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

var Rhonin = function(source, context) {
    printer.print(source.color + " Rhonin's deathrattle grants " + context.player.color + " " + context.player.name + " 3 copies of Arcane Missiles.");
    context.player.hand.push(ArcaneMissiles);
    context.player.hand.push(ArcaneMissiles);
    context.player.hand.push(ArcaneMissiles);
};

var ArcaneMissiles = function() {
    return utilities.makeSpell("Basic", false, "Arcane Missiles", 1, 0, abilities.ArcaneMissiles, false, ais.ArcaneMissiles, ArcaneMissiles);
};

var AnubarAmbusher = function(source, context) {
    var target = false;
    var targetRoll = Math.floor(context.player.minions.length * Math.random(0, 1));
    if(targetRoll < context.player.minions.length) {
        target = context.player.minions[targetRoll];
    }
    if(target) {
        printer.print(source.color + "Anub'ar Ambusher's deathrattle returns " + target.name + " to " + context.player.color + " " + context.player.name + "'s hand.");
        target.damageTaken = 0;
        target.damageLost = 0;
        context.player.hand.push(target);
        context.player.minions.splice(context.player.minions.indexOf(target), 1);
    }
};

var Leokk = function(source, context) {
    for(var i = 0; i < context.player.minions.length; i++) {
        context.player.minions[i].damage -= 1;
    }
};

var Webspinner = function(source, context) {
    var beastList = [];
    for(var b = 0; b < cardLists.neutral.length; b++) {
        if(cardLists.neutral[b]().type === "minion") {
            if(cardLists.neutral[b]().race === "Beast") {
                beastList.push(cardLists.neutral[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.warrior.length; b++) {
        if(cardLists.warrior[b]().type === "minion") {
            if(cardLists.warrior[b]().race === "Beast") {
                beastList.push(cardLists.warrior[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.rogue.length; b++) {
        if(cardLists.rogue[b]().type === "minion") {
            if(cardLists.rogue[b]().race === "Beast") {
                beastList.push(cardLists.rogue[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.hunter.length; b++) {
        if(cardLists.hunter[b]().type === "minion") {
            if(cardLists.hunter[b]().race === "Beast") {
                beastList.push(cardLists.hunter[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.shaman.length; b++) {
        if(cardLists.shaman[b]().type === "minion") {
            if(cardLists.shaman[b]().race === "Beast") {
                beastList.push(cardLists.shaman[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.druid.length; b++) {
        if(cardLists.druid[b]().type === "minion") {
            if(cardLists.druid[b]().race === "Beast") {
                beastList.push(cardLists.druid[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.warlock.length; b++) {
        if(cardLists.warlock[b]().type === "minion") {
            if(cardLists.warlock[b]().race === "Beast") {
                beastList.push(cardLists.warlock[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.paladin.length; b++) {
        if(cardLists.paladin[b]().type === "minion") {
            if(cardLists.paladin[b]().race === "Beast") {
                beastList.push(cardLists.paladin[b]);
            }
        }
    }
    for(var b = 0; b < cardLists.priest.length; b++) {
        if(cardLists.priest[b]().type === "minion") {
            if(cardLists.priest[b]().race === "Beast") {
                beastList.push(cardLists.priest[b]);
            }
        }
    }
    var randomNum = beastList.length;
    var beastNum = Math.floor(randomNum * Math.random(0, 1));
    var beast = beastList[beastNum]();
    printer.print(source.color + " " + source.name + "'s deathrattle adds a random Beast to the " + context.player.color + " " + context.player.name + "'s hand.");
    if(context.player.hand.length < 10) {
        printer.print("Beast received: " + beast.name);
        context.player.hand.push(beast);
    }
    else {
        printer.print("Hand too full! Could not receive card.");
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
    return utilities.makeWeapon("Legendary", "Classic", "Ashbringer", 5, 0, 5, 3, false, false, false, [], ais.ArcaniteReaper, Ashbringer, 100);
};

module.exports.LeperGnome_Deathrattle = {
    name: "Leper Gnome",
    type: "deathrattle",
    action: LeperGnome
};

module.exports.HauntedCreeper_Deathrattle = {
    name: "Haunted Creeper",
    type: "deathrattle",
    action: HauntedCreeper
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