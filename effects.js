var utilities = require('./utilities.js');
var printer = require('./printer.js')
var actions = require('./actions.js');
var inspires = require('./inspires.js');

module.exports.sickness = {
    name: "Summoning Sickness",
    type: "sickness",
};

module.exports.taunt = {
    name: "Taunt",
    type: "passive",
};

module.exports.stealth = {
    name: "Stealth",
    type: "passive",
};

module.exports.tempstealth = {
    name: "Stealth",
    type: "start of turn",
    action: actions.tempstealth
};

module.exports.divineshield = {
    name: "Divine Shield",
    type: "passive",
};

var immune = module.exports.immune = {
    name: "Immune",
    type: "passive"
};

module.exports.windfury = {
    name: "Windfury",
    type: "passive",
};

module.exports.frozen = {
    name: "Frozen",
    type: "end of turn",
    action: actions.frozen
};

module.exports.spelldamage1 = {
    name: "Spell Damage +1",
    type: "spell damage",
    bonus: 1
};

module.exports.poison = {
    name: "Poison",
    type: "poison"
};

module.exports.cantattack = {
    name: "Can't Attack",
    type: "passive",
};

module.exports.removeTempBuff = {
    name: "Remove Temporary Buff",
    type: "end of turn",
    action: actions.removeTempBuff
};

module.exports.DruidClaws = {
    name: "Temporary Damage",
    type: "buff damage",
    num: 1
};

module.exports.WhirlingBlades = {
    name: "Whirling Blades",
    type: "buff damage",
    num: 1
};

module.exports.ArmorPlating = {
    name: "Armor Plating",
    type: "buff health",
    num: 1
};

module.exports.ReversingSwitchHp = {
    name: "Reversing Switch",
    type: "buff health",
    num: actions.ReversingSwitchHp
};

module.exports.ReversingSwitchDamage = {
    name: "Reversing Switch",
    type: "buff damage",
    num: actions.ReversingSwitchDamage
};

module.exports.KnifeJuggler = {
    name: "Knife Juggler",
    type: "summon hunger friend",
    action: actions.KnifeJuggler
};

module.exports.AcolyteofPain = {
    name: "Acolyte of Pain",
    type: "pain",
    action: actions.AcolyteofPain
};

module.exports.ShadeofNaxxramas = {
    name: "Shade of Naxxramas",
    type: "start of turn friend",
    action: actions.ShadeofNaxxramas
};

module.exports.StoneskinGargoyle = {
    name: "Stoneskin Gargoyle",
    type: "start of turn friend",
    action: actions.StoneskinGargoyle
};

module.exports.Loatheb = {
    name: "Temporary Buff",
    type: "hand buff cost",
    num: 5
};

module.exports.MechWarper = {
    name: "Mech Warper",
    type: "aura hand friend buff cost",
    action: actions.Mechwarper
};

module.exports.freezetarget = {
    name: "Freeze Target",
    type: "on attack",
    action: actions.freezetarget
};

module.exports.TinkertownTechnicianHp = {
    name: "Tinkertown Technician",
    type: "buff health",
    num: 1
};

module.exports.TinkertownTechnicianDamage = {
    name: "Tinkertown Technician",
    type: "buff damage",
    num: 1
};

module.exports.EmperorThaurissan = {
    name: "Emperor Thaurissan",
    type: "end of turn friend",
    action: actions.EmperorThaurissan
};

module.exports.Ragnaros = {
    name: "DIE, INSECT",
    type: "end of turn friend",
    action: actions.Ragnaros
};

module.exports.TwilightElder = {
    name: "Twilight Elder",
    type: "end of turn friend",
    action: actions.TwilightElder
};

module.exports.ValidatedDoomsayer = {
    name: "Validated Doomsayer",
    type: "start of turn friend",
    action: actions.ValidatedDoomsayer
};

module.exports.HoggerScourgeofElwynn = {
    name: "Hogger, Scourge of Elwynn",
    type: "pain",
    action: actions.HoggerScourgeofElwynn
};

module.exports.YShaarj = {
    name: "Y'Shaarj, Rage Unbound",
    type: "end of turn friend",
    action: actions.YShaarjRageUnbound
};

module.exports.ArcaneGiant = {
    name: "Arcane Giant",
    type: "buff cost",
    action: actions.ArcaneGiant
};

//

module.exports.ManaWyrm = {
    name: "Mana Wyrm Empower",
    type: "spell hunger friend",
    action: actions.ManaWyrm
};

module.exports.MirrorEntity = {
    name: "Secret",
    specificName: "Mirror Entity",
    type: "summon hunger foe",
    action: actions.MirrorEntity
};

module.exports.Duplicate = {
    name: "Secret",
    specificName: "Duplicate",
    type: "death hunger friend",
    action: actions.Duplicate
};

module.exports.IceBlock = {
    name: "Secret",
    specificName: "Ice Block",
    type: "self defense",
    action: actions.IceBlock
};

module.exports.Vaporize = {
    name: "Secret",
    specificName: "Vaporize",
    type: "self defense",
    action: actions.Vaporize
};

module.exports.Antonidas = {
    name: "Archmage Antonidas",
    type: "spell hunger interrupt friend",
    action: actions.Antonidas
};

module.exports.GrimPatron = {
    name: "Everyone! Get in here!",
    type: "pain",
    action: actions.GrimPatron
};

module.exports.FrothingBerserker = {
    name: "Frothing Berserker",
    type: "damage hunger",
    action: actions.FrothingBerserker
};

module.exports.IronSensei = {
    name: "Iron Sensei's Wisdom",
    type: "end of turn friend",
    action: actions.IronSensei
};

module.exports.HealingTideTotem = {
    name: "Healing Tide",
    type: "end of turn friend",
    action: actions.HealingTideTotem
};

module.exports.UnboundElemental = {
    name: "Unbound Elemental",
    type: "card hunger friend",
    action: actions.UnboundElemental
};

module.exports.Leokk = {
    name: "Leokk",
    type: "aura buff damage",
    num: 1
};

module.exports.CoreRagerBuffHp = {
    name: "Core Rager's Power",
    type: "buff health",
    num: 3
};

module.exports.CoreRagerBuffDamage = {
    name: "Core Rager's Power",
    type: "buff damage",
    num: 3
};

module.exports.GiantSandworm = {
    name: "Giant Sandworm",
    type: "victory",
    action: actions.GiantSandworm
};

module.exports.Gahzrilla = {
    name: "Gahz'rilla",
    type: "pain",
    action: actions.Gahzrilla
};

module.exports.CenariusBuffHp = {
    name: "Cenarius",
    type: "buff health",
    num: 2
};

module.exports.CenariusBuffDamage = {
    name: "Cenarius",
    type: "buff damage",
    num: 2
};

module.exports.MalGanisBuffHp = {
    name: "Mal'Ganis Buff Health",
    type: "aura buff health",
    num: actions.MalGanisBuffHp
};

module.exports.MalGanisBuffDamage = {
    name: "Mal'Ganis Buff Damage",
    type: "aura buff damage",
    num: actions.MalGanisBuffDamage
};

module.exports.MalGanisImmune = {
    name: "Mal'Ganis Immune",
    type: "hero buff effect",
    effect: immune
};

module.exports.Equality = {
    name: "Equality",
    type: "set health",
    num: 1
};

module.exports.WarhorseTrainer = {
    name: "Warhorse Trainer",
    type: "aura buff damage",
    num: actions.WarhorseTrainer
};

module.exports.BlessingofKingsHp = {
    name: "Blessing of Kings",
    type: "buff health",
    num: 4
};

module.exports.BlessingofKingsDamage = {
    name: "Blessing of Kings",
    type: "buff damage",
    num: 4
};

module.exports.BolvarFordragon = {
    name: "Bolvar Fordragon",
    type: "death hunger friend hand",
    action: actions.BolvarFordragon
};

module.exports.PowerWordShield = {
    name: "Power Word: Shield",
    type: "buff health",
    num: 2
};

module.exports.NorthshireCleric = {
    name: "Northshire Cleric",
    type: "healing hunger",
    action: actions.NorthshireCleric
};

// Custom Sets

module.exports.C_SkybreakerSorcerer = {
    name: "Skybreaker Sorcerer",
    type: "spell damage hunger",
    action: actions.C_SkybreakerSorcerer
};

module.exports.C_CultAdherent = {
    name: "Cult Adherent",
    type: "aura hand foe buff cost",
    action: actions.C_CultAdherent
};

module.exports.C_LadyDeathwhisper = {
    name: "Passive Hero Power",
    type: "death interrupt",
    action: actions.LadyDeathwhisperManaBarrier
};

module.exports.C_DeformedFanatic = {
    name: "Deformed Fanatic Block",
    type: "self defense",
    action: actions.C_DeformedFanatic
};