var battlecries = require('./battlecries.js');
var deathrattles = require('./deathrattles.js');
var enrages = require('./enrages.js');
var inspires = require('./inspires.js');
var effects = require('./effects.js');
var weapons = require('./weapons.js');
var abilities = require('./abilities.js');

    var ais = require('./AIs.js');
    var targetais = require('./targetAIs.js');
    var coAis = require('./coAIs.js');
    // If you want to make your own alternate version of this simulator, you can plug in any two files here to use your own AIs. They need to have the right names, though, not every AI is named the exact same thing as the card. I'm intending to set up a way to use different AIs for each player in the future, at which point I'd love to receive a second set of AI and targetAI files to use :)

var filters = require('./filters.js');
// This one should not be changed. This is what forces things like Execute to only targt damaged enemy minions; changing this would have very significant consequences.

var utilities = require('./utilities.js');
var printer = require('./printer.js');

// BASICS

var TheCoin = module.exports.TheCoin = function() {
    return utilities.makeSpell("Basic", "Basic", ["Neutral"], "The Coin", 0, 0, abilities.TheCoin, false, false, ais.TheCoin, TheCoin, 100);
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

// NEUTRAL CARDS

// CLASSIC SET

// Basics

var BloodfenRaptor = module.exports.BloodfenRaptor = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", ["Neutral"], "Bloodfen Raptor", 2, 0, 2, 3, false, false, false,
    [effects.sickness], ais.true, BloodfenRaptor, 54);
};

var BoulderfistOgre = module.exports.BoulderfistOgre = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Boulderfist Ogre", 6, 0, 7, 6, false, false, false,
    [effects.sickness], ais.true, BoulderfistOgre, 66);
};

var ChillwindYeti = module.exports.ChillwindYeti = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Chillwind Yeti", 4, 0, 5, 4, false, false, false, 
    [effects.sickness], ais.true, ChillwindYeti, 67);
};

var ElvenArcher = module.exports.ElvenArcher = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Elven Archer", 1, 0, 1, 1,
    battlecries.ElvenArcher, targetais.ElvenArcher, filters.any, [effects.sickness], ais.ElvenArcher, ElvenArcher, 59);
};

var FrostwolfGrunt = module.exports.FrostwolfGrunt = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Frostwolf Grunt", 2, 0, 2, 2, false, false, false,
    [effects.sickness, effects.taunt], ais.FrostwolfGrunt, FrostwolfGrunt, 37);
};

var MagmaRager = module.exports.MagmaRager = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Magma Rager", 3, 0, 1, 5, false, false, false, [effects.sickness], ais.MagmaRager, MagmaRager, 16);
};

var MurlocRaider = module.exports.MurlocRaider = function() {
    return utilities.makeMinion("Murloc", "Basic", "Basic", ["Neutral"], "Murloc Raider", 1, 0, 1, 2, false, false, false, [effects.sickness], ais.MurlocRaider, MurlocRaider, 40);
};

var Nightblade = module.exports.Nightblade = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Nightblade", 5, 0, 4, 4,
    battlecries.Nightblade, false, false, [effects.sickness], ais.true, Nightblade, 41);
};

var NoviceEngineer = module.exports.NoviceEngineer = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Novice Engineer", 2, 0, 1, 1,
    battlecries.NoviceEngineer, false, false, [effects.sickness], ais.true, NoviceEngineer, 52);
};

var OgreMagi = module.exports.OgreMagi = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Neutral"], "Ogre Magi", 4, 0, 4, 4, false, false, false,
    [effects.sickness, effects.spelldamage1], ais.true, OgreMagi, 51);
};

// Commons

var AbusiveSergeant = module.exports.AbusiveSergeant = function() {
    return utilities.makeMinion(false, "Common", "Classic", ["Neutral"], "Abusive Sergeant", 1, 0, 1, 2, battlecries.AbusiveSergeant, targetais.AbusiveSergeant, filters.minion, [effects.sickness], ais.true, AbusiveSergeant);
}; // add tier

var AcolyteofPain = module.exports.AcolyteofPain = function() {
    return utilities.makeMinion(false, "Classic", "Common", ["Neutral"], "Acolyte of Pain", 3, 0, 3, 1, false, false, false,
    [effects.sickness, effects.AcolyteofPain], ais.AcolyteofPain, AcolyteofPain, 59);
};

var CultMaster = module.exports.CultMaster = function() {
    return utilities.makeMinion(false, "Classic", "Common", ["Neutral"], "Cult Master", 4, 0, 2, 4, false, false, false,
    [effects.sickness, effects.CultMaster], ais.CultMaster, CultMaster, 60);
};

var HarvestGolem = module.exports.HarvestGolem = function() {
    return utilities.makeMinion("Mech", "Classic", "Common", ["Neutral"], "Harvest Golem", 3, 0, 3, 2, false, false, false,
    [effects.sickness, deathrattles.HarvestGolem_Deathrattle], ais.HarvestGolem, HarvestGolem, 68);
};

var LeperGnome = module.exports.LeperGnome = function() {
    return utilities.makeMinion(false, "Classic", "Common", ["Neutral"], "Leper Gnome", 1, 0, 1, 1, false, false, false,
    [effects.sickness, deathrattles.LeperGnome_Deathrattle], ais.LeperGnome, LeperGnome, 16);
};

var SilverHandKnight = module.exports.SilverHandKnight = function() {
    return utilities.makeMinion(false, "Classic", "Common", ["Neutral"], "Silver Hand Knight", 5, 0, 4, 4, battlecries.SilverHandKnight, false, false, [effects.sickness], ais.MurlocRaider, SilverHandKnight, 70);
};

var Spellbreaker = module.exports.Spellbreaker = function() {
    return utilities.makeMinion(false, "Classic", "Common", ["Neutral"], "Spellbreaker", 4, 0, 3, 4,
    battlecries.Spellbreaker, targetais.Spellbreaker, filters.minion, [effects.sickness], ais.Spellbreaker, Spellbreaker, 63);
};

// Rares

var Abomination = module.exports.Abomination = function() {
    return utilities.makeMinion("Undead", "Rare", "Classic", ["Neutral"], "Abomination", 5, 0, 4, 4, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.Abomination_Deathrattle], ais.MurlocRaider, Abomination, 42);
};

var ArgentCommander = module.exports.ArgentCommander = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Neutral"], "Argent Commander", 6, 0, 2, 4, false, false, false, [effects.divineshield], ais.MurlocRaider, ArgentCommander, 80);
};

var AzureDrake = module.exports.AzureDrake = function() {
    return utilities.makeMinion("Dragon", "Rare", "Classic", ["Neutral"], "Azure Drake", 5, 0, 4, 4, battlecries.AzureDrake, false,
    false, [effects.sickness, effects.spelldamage1], ais.AzureDrake, AzureDrake, 76);
};

var CrazedAlchemist = module.exports.CrazedAlchemist = function() {
    return utilities.makeMinion("Undead", "Rare", "Classic", ["Neutral"], "Crazed Alchemist", 2, 0, 2, 2, battlecries.CrazedAlchemist, targetais.ReversingSwitch, filters.minion, [effects.sickness], ais.MurlocRaider, CrazedAlchemist, 53);
};

var GadgetzanAuctioneer = module.exports.GadgetzanAuctioneer = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Neutral"], "Gadgetzan Auctioneer", 6, 0, 4, 4, false, false, false, [effects.sickness, effects.GadgetzanAuctioneer], ais.true, GadgetzanAuctioneer, 40);
};

var KnifeJuggler = module.exports.KnifeJuggler = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Neutral"], "Knife Juggler", 2, 0, 2, 2, false, false, false,
    [effects.sickness, effects.KnifeJuggler], ais.KnifeJuggler, KnifeJuggler, 58);
};

// Epics

var BigGameHunter = module.exports.BigGameHunter = function() {
    return utilities.makeMinion(false, "Epic", "Classic", ["Neutral"], "Big Game Hunter", 3, 0, 2, 4, battlecries.BigGameHunter,
    targetais.BigGameHunter, filters.BigGameHunter, [effects.sickness], ais.BigGameHunter, BigGameHunter, 49);
};

var FacelessManipulator = module.exports.FacelessManipulator = function() {
    return utilities.makeMinion(false, "Epic", "Classic", ["Neutral"], "Faceless Manipulator", 5, 0, 3, 3, battlecries.FacelessManipulator,
    targetais.FacelessManipulator, filters.minion, [effects.sickness], ais.FacelessManipulator, FacelessManipulator, 54);
};

//Legendaries

var Alexstrasza = module.exports.Alexstrasza = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Classic", ["Neutral"], "Alexstrasza", 9, 0, 8, 8, battlecries.Alexstrasza,
    targetais.Alexstrasza, filters.player, [effects.sickness], ais.Alexstrasza, Alexstrasza, 71);
};

var BloodmageThalnos = module.exports.BloodmageThalnos = function() {
    return utilities.makeMinion("Undead", "Legendary", "Classic", ["Neutral"], "Bloodmage Thalnos", 2, 0, 1, 1, false, false, false,
    [effects.sickness, effects.spelldamage1, deathrattles.BloodmageThalnos_Deathrattle], ais.BloodmageThalnos, BloodmageThalnos, 55);
};

var Deathwing = module.exports.Deathwing = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Classic", ["Neutral"], "Deathwing", 10, 0, 12, 12, battlecries.Deathwing,
    false, false, [effects.sickness], ais.Deathwing, Deathwing, 110);
};

var Ragnaros = module.exports.Ragnaros = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", ["Neutral"], "Ragnaros the Firelord", 8, 0, 8, 8, false, false, false,
    [effects.sickness, effects.cantattack, effects.Ragnaros], ais.Ragnaros, Ragnaros, 94);
};

var Sylvanas = module.exports.Sylvanas = function() {
    return utilities.makeMinion("Undead", "Legendary", "Classic", ["Neutral"], "Sylvanas Windrunner", 6, 0, 5, 5, false, false, false,
    [effects.sickness, deathrattles.Sylvanas_Deathrattle], ais.Sylvanas, Sylvanas, 87);
};

// NAXXRAMAS SET

    // Boss Cards
    
    // Spells
    
    var LocustSwarm = module.exports.LocustSwarm = function() {
        return utilities.makeSpell("Basic", "Uncollectible", ["Boss"], "Locust Swarm", 7, 0, abilities.LocustSwarm, false, false, ais.LocustSwarm, LocustSwarm);
    };
    
    // Minions
    
    var Deathcharger = module.exports.Deathcharger = function() {
        return utilities.makeMinion("Undead", "Common", "Uncollectible", ["Boss"], "Deathcharger", 1, 0, 3, 2, false, false, false,
        [deathrattles.Deathcharger_Deathrattle], ais.MurlocRaider, Deathcharger);
    };

// Commons

var DancingSwords = module.exports.DancingSwords = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", ["Neutral"], "Dancing Swords", 3, 0, 4, 4, false, false, false, [effects.sickness, deathrattles.DancingSwords_Deathrattle], ais.DancingSwords, DancingSwords, 40);
};

var HauntedCreeper = module.exports.HauntedCreeper = function() {
    return utilities.makeMinion("Beast", "Common", "Naxxramas", ["Neutral"], "Haunted Creeper", 2, 0, 2, 1, false, false, false,
    [effects.sickness, deathrattles.HauntedCreeper_Deathrattle], ais.MurlocRaider, HauntedCreeper, 76);
};

var NerubarWeblord = module.exports.NerubarWeblord = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", ["Neutral"], "Nerub'ar Weblord", 2, 0, 4, 1, false, false, false,
    [effects.sickness], ais.MurlocRaider, NerubarWeblord, 40);
};

var StoneskinGargoyle = module.exports.StoneskinGargoyle = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", ["Neutral"], "Stoneskin Gargoyle", 3, 0, 4, 1, false, false, false,
    [effects.sickness, effects.StoneskinGargoyle], ais.MurlocRaider, StoneskinGargoyle, 7);
};

// Rares

var Deathlord = module.exports.Deathlord = function() {
    return utilities.makeMinion("Undead", "Rare", "Naxxramas", ["Neutral"], "Deathlord", 3, 0, 8, 2, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.Deathlord_Deathrattle], ais.MurlocRaider, Deathlord, 52);
};

var NerubianEgg = module.exports.NerubianEgg = function() {
    return utilities.makeMinion(false, "Rare", "Naxxramas", ["Neutral"], "Nerubian Egg", 2, 0, 2, 0, false, false, false,
    [effects.sickness, deathrattles.NerubianEgg_Deathrattle], ais.MurlocRaider, NerubianEgg, 49);
};

var SludgeBelcher = module.exports.SludgeBelcher = function() {
    return utilities.makeMinion("Undead", "Rare", "Naxxramas", ["Neutral"], "Sludge Belcher", 5, 0, 5, 3, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.SludgeBelcher_Deathrattle], ais.SludgeBelcher, SludgeBelcher, 82);
};

// Epics

var ShadeofNaxxramas = module.exports.ShadeofNaxxramas = function() {
    return utilities.makeMinion("Undead", "Epic", "Naxxramas", ["Neutral"], "Shade of Naxxramas", 3, 0, 2, 2, false, false, false,
    [effects.sickness, effects.stealth, effects.ShadeofNaxxramas], ais.MurlocRaider, ShadeofNaxxramas, 65);
};

// Legendaries

var Maexxna = module.exports.Maexxna = function() {
    return utilities.makeMinion("Beast", "Legendary", "Naxxramas", ["Neutral"], "Maexxna", 6, 0, 8, 2, false, false, false, [effects.sickness, effects.poison], ais.Maexxna, Maexxna, 64);
};

var Loatheb = module.exports.Loatheb = function() {
    return utilities.makeMinion(false, "Legendary", "Naxxramas", ["Neutral"], "Loatheb",5, 0, 5, 5, battlecries.Loatheb, false, false, [effects.sickness], ais.Loatheb, Loatheb, 63);
};

// GOBLINS VS GNOMES SET

// Commons

var AnnoyoTron = module.exports.AnnoyoTron = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Annoy-o-Tron", 2, 0, 2, 1, false, false, false,
    [effects.sickness, effects.divineshield, effects.taunt], ais.AnnoyoTron, AnnoyoTron, 62);
};

var SpiderTank = module.exports.SpiderTank = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Spider Tank", 3, 0, 4, 3, false, false, false, [effects.sickness], ais.SpiderTank, SpiderTank, 68);
};

var ClockworkGnome = module.exports.ClockworkGnome = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Clockwork Gnome", 1, 0, 1, 2, false, false, false,
    [effects.sickness, deathrattles.ClockworkGnome_Deathrattle], ais.ClockworkGnome, ClockworkGnome, 57);
};

var Mechwarper = module.exports.Mechwarper = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Mechwarper", 2, 0, 3, 2, false, effects.MechWarper.action,
    false, [effects.sickness, effects.MechWarper], ais.Mechwarper, Mechwarper, 63);
};

var Snowchugger = module.exports.Snowchugger = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Snowchugger", 2, 0, 3, 2, false, false, false,
    [effects.sickness, effects.freezetarget], ais.Snowchugger, Snowchugger, 69);
};

var TinkertownTechnician = module.exports.TinkertownTechnician = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Tinkertown Technician", 3, 0, 3, 3, battlecries.TinkertownTechnician,
    false, false, [effects.sickness], ais.TinkertownTechnician, TinkertownTechnician, 50);
};

var MechanicalYeti = module.exports.MechanicalYeti = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Mechanical Yeti", 4, 0, 5, 4, false, false, false,
    [effects.sickness, deathrattles.MechanicalYeti_Deathrattle], ais.MechanicalYeti, MechanicalYeti, 69);
};

var PilotedShredder = module.exports.PilotedShredder = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Neutral"], "Piloted Shredder", 4, 0, 3, 4, false, false, false,
    [effects.sickness, deathrattles.PilotedShredder_Deathrattle], ais.PilotedShredder, PilotedShredder, 86);
};

// Rares

// Epics

// Legendaries

var DrBoom = module.exports.DrBoom = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", ["Neutral"], "Dr. Boom", 7, 0, 7, 7,
    battlecries.DrBoom, false, false, [effects.sickness], ais.DrBoom, DrBoom, 124);
};

var Toshley = module.exports.Toshley = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", ["Neutral"], "Toshley", 6, 0, 7, 5,
    battlecries.Toshley, false, false, [effects.sickness, deathrattles.Toshley_Deathrattle], ais.Toshley, Toshley, 74);
};

// BLACKROCK MOUNTAIN SET

// Boss Cards

// Commons

var BlackwingTechnician = module.exports.BlackwingTechnician = function() {
    return utilities.makeMinion(false, "Common", "Blackrock Mountain", ["Neutral"], "Blackwing Technician", 3, 0, 4, 2,
    battlecries.BlackwingTechnician, false, false, [effects.sickness], ais.TwilightWhelp, BlackwingTechnician, 47);
};

var BlackwingCorruptor = module.exports.BlackwingCorruptor = function() {
    return utilities.makeMinion(false, "Common", "Blackrock Mountain", ["Neutral"], "Blackwing Corruptor", 5, 0, 4, 5,
    battlecries.BlackwingCorruptor, targetais.BlackwingCorruptor, filters.any, [effects.sickness], ais.TwilightWhelp, BlackwingCorruptor, 46);
};

// Rares

var GrimPatron = module.exports.GrimPatron = function() {
    return utilities.makeMinion(false, "Rare", "Blackrock Mountain", ["Neutral"], "Grim Patron", 5, 0, 3, 3, false, false, false,
    [effects.sickness, effects.GrimPatron], ais.GrimPatron, GrimPatron, 23);
};

// Epics

// Legendaries

var EmperorThaurissan = module.exports.EmperorThaurissan = function() {
    return utilities.makeMinion(false, "Legendary", "Blackrock Mountain", ["Neutral"], "Emperor Thaurissan", 6, 0, 5, 5, false, false, false,
    [effects.sickness, effects.EmperorThaurissan], ais.EmperorThaurissan, EmperorThaurissan, 60);
};

var Nefarian = module.exports.Nefarian = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Blackrock Mountain", ["Neutral"], "Nefarian", 9, 0, 8, 8, battlecries.Nefarian, false, false, [effects.sickness], ais.Nefarian, Nefarian, 77);
};

// GRAND TOURNAMENT SET

// Commons

var NorthSeaKraken = module.exports.NorthSeaKraken = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", ["Neutral"], "North Sea Kraken", 9, 0, 7, 9, battlecries.NorthSeaKraken, targetais.ShadowBolt, filters.any, [effects.sickness], ais.MurlocRaider, NorthSeaKraken, 86);
};

var ArgentHorserider = module.exports.ArgentHorserider = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", ["Neutral"], "Argent Horserider", 3, 0, 1, 2, false, false, false, [effects.divineshield], ais.MurlocRaider, ArgentHorserider, 71);
};

// Rares

var MasterJouster = module.exports.MasterJouster = function() {
    return utilities.makeMinion(false, "Rare", "The Grand Tournament", ["Neutral"], "Master Jouster", 6, 0, 6, 5, battlecries.MasterJouster,
    false, false, [effects.sickness], ais.MasterJouster, MasterJouster, 62);
};

// Epics

var Kodorider = module.exports.Kodorider = function() {
    return utilities.makeMinion(false, "Epic", "The Grand Tournament", ["Neutral"], "Kodorider", 6, 0, 5, 3, false, false, false,
    [effects.sickness, inspires.Kodorider_Inspire], ais.Kodorider, Kodorider, 69);
};

var TwilightGuardian = module.exports.TwilightGuardian = function() {
    return utilities.makeMinion("Dragon", "Epic", "The Grand Tournament", ["Neutral"], "Twilight Guardian", 4, 0, 6, 2,
    battlecries.TwilightGuardian, false, false, [effects.sickness], ais.TwilightWhelp, TwilightGuardian, 49);
};

// Legendaries

var NexusChampionSaraad = module.exports.NexusChampionSaraad = function() {
    return utilities.makeMinion(false, "Legendary", "The Grand Tournament", ["Neutral"], "Nexus-Champion Saraad", 5, 0, 5, 4, false, false, false,
    [effects.sickness, inspires.NexusChampionSaraad_Inspire], ais.NexusChampionSaraad, NexusChampionSaraad, 74);
};

// LEAGUE OF EXPLORERS SET

// Boss Cards

// Commons

// Rares

// Epics

// Legendaries

var EliseStarseeker = module.exports.EliseStarseeker = function() {
    return utilities.makeMinion(false, "Legendary", "League of Explorers", ["Neutral"], "Elise Starseeker", 4, 0, 5, 3, battlecries.EliseStarseeker,
    false, false, [effects.sickness], ais.EliseStarseeker, EliseStarseeker, 49);
};

var RenoJackson = module.exports.RenoJackson = function() {
    return utilities.makeMinion(false, "Legendary", "League of Explorers", ["Neutral"], "Reno Jackson", 6, 0, 6, 4, battlecries.RenoJackson,
    false, false, [effects.sickness], ais.RenoJackson, RenoJackson, 51);
};

// WHISPERS OF THE OLD GODS SET

// Commons

var PollutedHoarder = module.exports.PollutedHoarder = function() {
    return utilities.makeMinion(false, "Common", "Whispers of the Old Gods", ["Neutral"], "Polluted Hoarder", 4, 0, 2, 4, false, false, false,
    [effects.sickness, deathrattles.PollutedHoarder_Deathrattle], ais.MurlocRaider, PollutedHoarder, 59);
};

var BeckonerofEvil = module.exports.BeckonerofEvil = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", ["Neutral"], "Beckoner of Evil", 2, 0, 3, 2, battlecries.BeckonerofEvil, false, false, [effects.sickness], ais.MurlocRaider, BeckonerofEvil, 57);
    card["cult"] = "C'Thun";
    return card;
};

var CThunsChosen = module.exports.CThunsChosen = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", ["Neutral"], "C'Thun's Chosen", 4, 0, 2, 4, battlecries.CThunsMinion, false, false,
    [effects.sickness, effects.divineshield], ais.MurlocRaider, CThunsChosen, 74);
    card["cult"] = "C'Thun";
    return card;
};

var TwilightElder = module.exports.TwilightElder = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", ["Neutral"], "Twilight Elder", 3, 0, 4, 3, false, false, false,
    [effects.sickness, effects.TwilightElder], ais.MurlocRaider, TwilightElder, 65);
    card["cult"] = "C'Thun";
    return card;
};

// Rares

var CorruptedHealbot = module.exports.CorruptedHealbot = function() {
    return utilities.makeMinion("Mech", "Rare", "Whispers of the Old Gods", ["Neutral"], "Corrupted Healbot", 5, 0, 6, 6, false, false, false,
    [effects.sickness, deathrattles.CorruptedHealbot_Deathrattle], ais.MurlocRaider, CorruptedHealbot, 71);
};

var EaterofSecrets = module.exports.EaterofSecrets = function() {
    return utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", ["Neutral"], "Eater of Secrets", 4, 0, 4, 2, battlecries.EaterofSecrets, false, false,
    [effects.sickness], ais.EaterofSecrets, EaterofSecrets, 23);
};

// Epics

var ValidatedDoomsayer = module.exports.ValidatedDoomsayer = function() {
    return utilities.makeMinion(false, "Epic", "Whispers of the Old Gods", ["Neutral"], "Validated Doomsayer", 5, 0, 7, 0, false, false, false,
    [effects.sickness, effects.ValidatedDoomsayer], ais.MurlocRaider, ValidatedDoomsayer, 41);
};

// Legendaries

var CThun = module.exports.CThun = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Neutral"], "C'Thun", 10, 0, 6, 6, battlecries.CThun, false, false,
    [effects.sickness], ais.CThun, CThun, 31);
};

var NZoththeCorruptor = module.exports.NZoththeCorruptor = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Neutral"], "N'Zoth, the Corruptor", 10, 0, 7, 5, battlecries.NZoth, false, false, [effects.sickness], ais.NZoth, NZoththeCorruptor, 4);
};

var YoggSaronHopesEnd = module.exports.YoggSaronHopesEnd = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Neutral"], "Yogg-Saron, Hope's End", 10, 0, 5, 7, battlecries.YoggSaron, false, false, [effects.sickness], ais.YoggSaron, YoggSaronHopesEnd, 31);
};

var YShaarjRageUnbound = module.exports.YShaarjRageUnbound = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Neutral"], "Y'Shaarj, Rage Unbound", 10, 0, 10, 10, false, false, false,
    [effects.sickness, effects.YShaarj], ais.MurlocRaider, YShaarjRageUnbound);
};

var HoggerScourgeofElwynn = module.exports.HoggerScourgeofElwynn = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Neutral"], "Hogger, Scourge of Elwynn", 7, 0, 6, 6, false, false, false,
    [effects.sickness, effects.HoggerScourgeofElwynn], ais.MurlocRaider, HoggerScourgeofElwynn, 77);
};

// ONE NIGHT IN KARAZHAN SET

// Commons

// Rares

// Epics

var ArcaneGiant = module.exports.ArcaneGiant = function() {
    return utilities.makeMinion(false, "Epic", "One Night in Karazhan", ["Neutral"], "Arcane Giant", 12, 0, 8, 8, false, false, false,
    [effects.sickness, effects.ArcaneGiant], ais.ArcaneGiant, ArcaneGiant, 26);
};

// Legendaries

// THE MEAN STREETS OF GADGETZAN

// Commons

// Rares

// Epics

// Legendaries

var SergeantSally = module.exports.SergeantSally = function() {
    return utilities.makeMinion(false, "Legendary", "Mean Streets of Gadgetzan", ["Neutral"], "Sergeant Sally", 3, 0, 1, 1, false, false, false, [effects.sickness, deathrattles.SergeantSally_Deathrattle], ais.true, SergeantSally, 36);
};

// Tri-Class

    // The Grimy Goons
    
    var DonHanCho = module.exports.DonHanCho = function() {
        return utilities.makeMinion(false, "Legendary", "Mean Streets of Gadgetzan", ["Warrior", "Hunter", "Paladin"], "Don Han'Cho", 7, 0, 6, 5, battlecries.DonHanCho, false, false, [effects.sickness], ais.GrimyGoons, DonHanCho, 84);
    };
    
    // The Jade Lotus
    
    var JadeSpirit = module.exports.JadeSpirit = function() {
        return utilities.makeMinion(false, "Common", "Mean Streets of Gadgetzan", ["Druid", "Rogue", "Shaman"], "Jade Spirit", 4, 0, 3, 2, battlecries.JadeSpirit, false, false, [effects.sickness], ais.MurlocRaider, JadeSpirit, 49);
    };
    
    var LotusAgents = module.exports.LotusAgents = function() {
        return utilities.makeMinion(false, "Rare", "Mean Streets of Gadgetzan", ["Druid", "Rogue", "Shaman"], "Lotus Agents", 5, 0, 3, 5, battlecries.LotusAgents, false, false, [effects.sickness], ais.true, LotusAgents, 80);
    };
    
    var AyaBlackpaw = module.exports.AyaBlackpaw = function() {
        return utilities.makeMinion(false, "Legendary", "Mean Streets of Gadgetzan", ["Druid", "Rogue", "Shaman"], "Aya Blackpaw", 6, 0, 3, 5, battlecries.JadeSpirit, false, false, [effects.sickness, deathrattles.AyaBlackpaw_Deathrattle], ais.true, AyaBlackpaw, 68);
    };
    
    // The Kabal
    
    var KabalChemist = module.exports.KabalChemist = function() {
        return utilities.makeMinion(false, "Common", "Mean Streets of Gadgetzan", ["Mage", "Priest", "Warlock"], "Kabal Chemist", 4, 0, 3, 3, battlecries.KabalChemist, false, false, [effects.sickness], ais.true, KabalChemist, 77);
    };

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

// MAGE CARDS

// SPELLS

// Basic

var ArcaneExplosion = module.exports.ArcaneExplosion = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Arcane Explosion", 2, 0, abilities.ArcaneExplosion, false, false, ais.ArcaneExplosion, ArcaneExplosion, 52);
};

var ArcaneIntellect = module.exports.ArcaneIntellect = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Arcane Intellect", 3, 0, abilities.ArcaneIntellect, false, false, ais.ArcaneIntellect, ArcaneIntellect, 62);
};

var ArcaneMissiles = module.exports.ArcaneMissiles = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Arcane Missiles", 1, 0, abilities.ArcaneMissiles, false, false, ais.ArcaneMissiles, ArcaneMissiles, 51);
};

var Fireball = module.exports.Fireball = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Fireball", 4, 0, abilities.Fireball, targetais.Fireball, filters.any, ais.Fireball, Fireball, 91);
};

var Flamestrike = module.exports.Flamestrike = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Flamestrike", 7, 0, abilities.Flamestrike, false, false, ais.Flamestrike, Flamestrike, 109);
};

var Frostbolt = module.exports.Frostbolt = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Frostbolt", 2, 0, abilities.Frostbolt, targetais.Frostbolt, filters.any, ais.Frostbolt, Frostbolt, 79);
};

var FrostNova = module.exports.FrostNova = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Frost Nova", 3, 0, abilities.FrostNova, false, false, ais.FrostNova, FrostNova, 33);
};

var MirrorImage = module.exports.MirrorImage = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Mirror Image", 1, 0, abilities.MirrorImage, false, false, ais.MirrorImage, MirrorImage, 45);
};

var Polymorph = module.exports.Polymorph = function() {
    return utilities.makeSpell("Basic", "Basic", ["Mage"], "Polymorph", 4, 0, abilities.Polymorph, targetais.Polymorph, filters.minion, ais.Polymorph, Polymorph, 71);
};

// Commons

var ConeofCold = module.exports.ConeofCold = function() {
    return utilities.makeSpell("Common", "Classic", ["Mage"], "Cone of Cold", 4, 0, abilities.ConeofCold, targetais.ConeofCold, filters.minion, ais.ConeofCold, ConeofCold, 47);
};

var Duplicate = module.exports.Duplicate = function() {
    return utilities.makeSpell("Common", "Naxxramas", ["Mage"], "Duplicate", 3, 0, abilities.Duplicate, false, false, ais.Duplicate, Duplicate, 44);
};

var Flamecannon = module.exports.Flamecannon = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", ["Mage"], "Flamecannon", 2, 0, abilities.Flamecannon, false, false, ais.Flamecannon, Flamecannon, 80);
};

var MirrorEntity = module.exports.MirrorEntity = function() {
    return utilities.makeSpell("Common", "Classic", ["Mage"], "Mirror Entity", 3, 0, abilities.MirrorEntity, false, false, ais.MirrorEntity, MirrorEntity, 58);
};

// Rares

var UnstablePortal = module.exports.UnstablePortal = function() {
    return utilities.makeSpell("Rare", "Goblins vs Gnomes", ["Mage"], "Unstable Portal", 2, 0, abilities.UnstablePortal, false, false, ais.UnstablePortal, UnstablePortal, 42);
};

var Vaporize = module.exports.Vaporize = function() {
    return utilities.makeSpell("Rare", "Classic", ["Mage"], "Vaporize", 3, 0, abilities.Vaporize, false, false, ais.Vaporize, Vaporize, 48);
};

// Epics

var IceBlock = module.exports.IceBlock = function() {
    return utilities.makeSpell("Epic", "Classic", ["Mage"], "Ice Block", 3, 0, abilities.IceBlock, false, false, ais.true, IceBlock, 18);
};

// MINIONS

// Basic

// Commons

var ManaWyrm = module.exports.ManaWyrm = function() {
    return utilities.makeMinion(false, "Common", "Classic", ["Mage"], "Mana Wyrm", 1, 0, 3, 1, false, false, false, [effects.sickness, effects.ManaWyrm], ais.ManaWyrm, ManaWyrm, 76);
};

var Spellslinger = module.exports.Spellslinger = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", ["Mage"], "Spellslinger", 3, 0, 4, 3, battlecries.Spellslinger,
    false, false, [effects.sickness], ais.Spellslinger, Spellslinger, 64);
};

// Rares

var GoblinBlastmage = module.exports.GoblinBlastmage = function() {
    return utilities.makeMinion(false, "Rare", "Goblins vs Gnomes", ["Mage"], "Goblin Blastmage", 4, 0, 4, 5, battlecries.GoblinBlastmage,
    false, false, [effects.sickness], ais.GoblinBlastmage, GoblinBlastmage, 71);
};

// Epics

// Legendaries

var ArchmageAntonidas = module.exports.ArchmageAntonidas = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", ["Mage"], "Archmage Antonidas", 7, 0, 7, 5, false, false, false,
    [effects.sickness, effects.Antonidas], ais.ArchmageAntonidas, ArchmageAntonidas, 78);
};

var Rhonin = module.exports.Rhonin = function() {
    return utilities.makeMinion(false, "Legendary", "The Grand Tournament", ["Mage"], "Rhonin", 8, 0, 7, 7, false, false, false,
    [effects.sickness, deathrattles.Rhonin_Deathrattle], ais.MurlocRaider, Rhonin, 77);
};

// WARRIOR CARDS

// SPELLS & WEAPONS

// Basic

var ArcaniteReaper = module.exports.ArcaniteReaper = function() {
    return utilities.makeWeapon("Basic", "Basic", ["Warrior"], "Arcanite Reaper", 5, 0, 5, 2, false, false, false, [], ais.MurlocRaider, ArcaniteReaper, 78);
};

var Cleave = module.exports.Cleave = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warrior"], "Cleave", 2, 0, abilities.Cleave, false, false, ais.Cleave, Cleave, 67);
};

var Execute = module.exports.Execute = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warrior"], "Execute", 1, 0, abilities.Execute, targetais.Execute, filters.Execute, ais.Execute, Execute, 72);
};

var Whirlwind = module.exports.Whirlwind = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warrior"], "Whirlwind", 1, 0, abilities.Whirlwind, false, false, ais.Whirlwind, Whirlwind, 45);
};

// Commons

var BattleRage = module.exports.BattleRage = function() {
    return utilities.makeSpell("Common", "Classic", ["Warrior"], "Battle Rage", 2, 0, abilities.BattleRage, false, false, ais.BattleRage, BattleRage, 61);
};

// Rares

// Epics

var BloodWarriors = module.exports.BloodWarriors = function() {
    return utilities.makeSpell("Epic", "Whispers of the Old Gods", ["Warrior"], "Blood Warriors", 3, 0, abilities.BloodWarriors, false, false, ais.BloodWarriors, BloodWarriors, 36);
};

// MINIONS

// Basic

// Commons

// Rares

var AncientShieldbearer = module.exports.AncientShieldbearer = function() {
    var card = utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", ["Warrior"], "Ancient Shieldbearer", 7, 0, 6, 6, battlecries.AncientShieldbearer, false, false, [effects.sickness], ais.KlaxxiAmberWeaver, AncientShieldbearer, 28);
    card["cult"] = "C'Thun";
    return card;
};

var FrothingBerserker = module.exports.FrothingBerserker = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Warrior"], "Frothing Berserker", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.FrothingBerserker], ais.FrothingBerserker, FrothingBerserker, 87);
};

// Epics

// Legendaries

// ROGUE CARDS

// WEAPONS

// Basic

var WickedKnife = module.exports.WickedKnife = function() {
    return utilities.makeWeapon("Basic", "Basic", ["Rogue"], "Wicked Knife", 2, 0, 1, 2, false, false, false, [], ais.MurlocRaider, WickedKnife, 50);
};

// Commons

// Rares

// Epics

// SPELLS

// Basic

var Backstab = module.exports.Backstab = function() {
    return utilities.makeSpell("Basic", "Basic", ["Rogue"], "Backstab", 0, 0, abilities.Backstab, targetais.Backstab, filters.Backstab, ais.Backstab, Backstab, 89);
};

var FanofKnives = module.exports.FanofKnives = function() {
    return utilities.makeSpell("Basic", "Basic", ["Rogue"], "Fan of Knives", 3, 0, abilities.FanofKnives, false, false, ais.FanofKnives, FanofKnives, 69);
};

var Sap = module.exports.Sap = function() {
    return utilities.makeSpell("Basic", "Basic", ["Rogue"], "Sap", 2, 0, abilities.Sap, targetais.Sap, filters.minion, ais.Sap, Sap, 79);
};

var Shiv = module.exports.Shiv = function() {
    return utilities.makeSpell("Basic", "Basic", ["Rogue"], "Shiv", 2, 0, abilities.Shiv, targetais.Shiv, filters.any, ais.Shiv, Shiv, 56);
};

var Sprint = module.exports.Sprint = function() {
    return utilities.makeSpell("Basic", "Basic", ["Rogue"], "Sprint", 7, 0, abilities.Sprint, false, false, ais.Sprint, Sprint, 57);
};

// Commons

// Rares

// Epics

// MINIONS

// Basic

// Commons

var AnubarAmbusher = module.exports.AnubarAmbusher = function() {
    return utilities.makeMinion("Undead", "Naxxramas", "Common", ["Rogue"], "Anub'ar Ambusher", 4, 0, 5, 5, false, false, false,
    [effects.sickness, deathrattles.AnubarAmbusher_Deathrattle], ais.MurlocRaider, AnubarAmbusher, 56);
};

// Rares

var IronSensei = module.exports.IronSensei = function() {
    return utilities.makeMinion("Mech", "Goblins vs Gnomes", "Rare", ["Rogue"], "Iron Sensei", 3, 0, 2, 2, false, false, false,
    [effects.sickness, effects.IronSensei], ais.IronSensei, IronSensei, 40);
};

// Epics

// Legendaries

// SHAMAN CARDS

// SPELLS

// Basic

// Commons

var Crackle = module.exports.Crackle = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", ["Shaman"], "Crackle", 2, 1, abilities.Crackle, targetais.Crackle, filters.any, ais.Crackle, Crackle, 67);
};

var ForkedLightning = module.exports.ForkedLightning = function() {
    return utilities.makeSpell("Common", "Classic", ["Shaman"], "Forked Lightning", 1, 1, abilities.ForkedLightning, false, false, ais.ForkedLightning, ForkedLightning, 59);
};

// Rares

var FeralSpirit = module.exports.FeralSpirit = function() {
    return utilities.makeSpell("Rare", "Classic", ["Shaman"], "Feral Spirit", 3, 2, abilities.FeralSpirit, false, false, ais.FeralSpirit, FeralSpirit, 78);
};

var LavaBurst = module.exports.LavaBurst = function() {
    return utilities.makeSpell("Rare", "Classic", ["Shaman"], "Lava Burst", 3, 2, abilities.LavaBurst, targetais.LavaBurst, filters.any, ais.LavaBurst, LavaBurst, 59);
};

// Epics

// MINIONS

// Basic

// Commons

var UnboundElemental = module.exports.UnboundElemental = function() {
    return utilities.makeMinion(false, "Common", "Classic", ["Shaman"], "Unbound Elemental", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.UnboundElemental], ais.UnboundElemental, UnboundElemental, 57);
};

var WhirlingZapoMatic = module.exports.WhirlingZapoMatic = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", ["Shaman"], "Whirling Zap-o-Matic", 2, 0, 2, 3, false, false, false,
    [effects.sickness, effects.windfury], ais.WhirlingZapoMatic, WhirlingZapoMatic, 65);
};

// Rares

// Epics

// Legendaries

var AlAkirtheWindlord = module.exports.AlAkirtheWindlord = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", ["Shaman"], "Al'Akir the Windlord", 8, 0, 5, 3, false, false, false, [effects.windfury, effects.divineshield,
    effects.taunt], ais.AlAkirtheWindlord, AlAkirtheWindlord, 83);
};

// HUNTER CARDS

// SPELLS

// Basic

var ArcaneShot = module.exports.ArcaneShot = function() {
    return utilities.makeSpell("Basic", "Basic", ["Hunter"], "Arcane Shot", 1, 0, abilities.ArcaneShot, targetais.ArcaneShot, filters.any, ais.ArcaneShot, ArcaneShot, 62);
};

var AnimalCompanion = module.exports.AnimalCompanion = function() {
    return utilities.makeSpell("Basic", "Basic", ["Hunter"], "Animal Companion", 3, 0, abilities.AnimalCompanion, false, false, ais.AnimalCompanion, AnimalCompanion, 88);
};

var DeadlyShot = module.exports.DeadlyShot = function() {
    return utilities.makeSpell("Common", "Classic", ["Hunter"], "Deadly Shot", 3, 0, abilities.DeadlyShot, false, false, ais.DeadlyShot, DeadlyShot, 74);
};

var HuntersMark = module.exports.HuntersMark = function() {
    return utilities.makeSpell("Basic", "Basic", ["Hunter"], "Hunter's Mark", 1, 0, abilities.HuntersMark, targetais.HuntersMark, filters.minion, ais.HuntersMark, HuntersMark, 65);
};

var MultiShot = module.exports.MultiShot = function() {
    return utilities.makeSpell("Basic", "Basic", ["Hunter"], "Multi-Shot", 4, 0, abilities.MultiShot, false, false, ais.MultiShot, MultiShot, 59);
};

// Commons

var CobraShot = module.exports.CobraShot = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", ["Hunter"], "Cobra Shot", 5, 0, abilities.CobraShot, targetais.CobraShot, filters.minion, ais.CobraShot, CobraShot, 39);
};

var UnleashTheHounds = module.exports.UnleashTheHounds = function() {
    return utilities.makeSpell("Common", "Classic", ["Hunter"], "Unleash the Hounds", 2, 0, abilities.UnleashTheHounds, false, false, ais.UnleashTheHounds, UnleashTheHounds, 84);
};

// Rares

var ExplosiveShot = module.exports.ExplosiveShot = function() {
    return utilities.makeSpell("Rare", "Classic", ["Hunter"], "Explosive Shot", 5, 0, abilities.ExplosiveShot, targetais.ExplosiveShot, filters.minion, ais.ExplosiveShot, ExplosiveShot, 80);
};

// Epics

// MINIONS

// Basic

// Commons

var KingsElekk = module.exports.KingsElekk = function() {
    return utilities.makeMinion("Beast", "Common", "The Grand Tournament", ["Hunter"], "King's Elekk", 2, 0, 2, 3, battlecries.KingsElekk,
    false, false, [effects.sickness], ais.KingsElekk, KingsElekk, 73);
};

var Webspinner = module.exports.Webspinner = function() {
    return utilities.makeMinion("Beast", "Common", "Naxxramas", ["Hunter"], "Webspinner", 1, 0, 1, 1, false, false, false,
    [effects.sickness, deathrattles.Webspinner_Deathrattle], ais.Webspinner, Webspinner, 76);
};

// Rares

var CoreRager = module.exports.CoreRager = function() {
    return utilities.makeMinion("Beast", "Rare", "Blackrock Mountain", ["Hunter"], "Core Rager", 4, 0, 4, 4, battlecries.CoreRager, false,
    false, [effects.sickness], ais.CoreRager, CoreRager, 50);
};

// Epics

var GiantSandworm = module.exports.GiantSandworm = function() {
    return utilities.makeMinion("Beast", "Epic", "Whispers of the Old Gods", ["Hunter"], "Giant Sandworm", 8, 0, 8, 8, false, false, false, [effects.sickness, effects.GiantSandworm], ais.MurlocRaider, GiantSandworm, 70);
};

// Legendaries

var Gahzrilla = module.exports.Gahzrilla = function() {
    return utilities.makeMinion("Beast", "Legendary", "Goblins vs Gnomes", ["Hunter"], "Gahz'rilla", 7, 0, 9, 6, false, false, false,
    [effects.sickness, effects.Gahzrilla], ais.Gahzrilla, Gahzrilla, 75);
};

var KingKrush = module.exports.KingKrush = function() {
    return utilities.makeMinion("Beast", "Legendary", "Classic", ["Hunter"], "King Krush", 9, 0, 8, 8,
    false, false, false, [], false, ais.KingKrush, KingKrush, 84);
};

// DRUID CARDS

// SPELLS

// Basic

var Innervate = module.exports.Innervate = function() {
    return utilities.makeSpell("Basic", "Basic", ["Druid"], "Innervate", 0, 0, abilities.Innervate, false, false, ais.Innervate, Innervate, 64);
};

var Moonfire = module.exports.Moonfire = function() {
    return utilities.makeSpell("Basic", "Basic", ["Druid"], "Moonfire", 0, 0, abilities.Moonfire, targetais.Moonfire, filters.any, ais.Moonfire, Moonfire, 50);
};

var Swipe = module.exports.Swipe = function() {
    return utilities.makeSpell("Basic", "Basic", ["Druid"], "Swipe", 4, 0, abilities.Swipe, targetais.Swipe, filters.any, ais.Swipe, Swipe, 96);
};

var WildGrowth = module.exports.WildGrowth = function() {
    return utilities.makeSpell("Basic", "Basic", ["Druid"], "Wild Growth", 2, 0, abilities.WildGrowth, false, false, ais.true, WildGrowth, 57);
};

// Commons

var JadeBlossom = module.exports.JadeBlossom = function() {
    return utilities.makeSpell("Common", "Mean Streets of Gadgetzan", ["Druid"], "Jade Blossom", 3, 0, abilities.JadeBlossom, false, false, ais.true, JadeBlossom, 21);
};

var LivingRoots = module.exports.LivingRoots = function() {
    var card = utilities.makeSpell("Common", "The Grand Tournament", ["Druid"], "Living Roots", 1, 0, abilities.LivingRoots, targetais.LivingRoots, filters.minion, ais.ArcaneShot, LivingRoots, 85);
    card.chooseAi = coAis.LivingRoots;
    return card;
};

var RavenIdol = module.exports.RavenIdol = function() {
    var card = utilities.makeSpell("Common", "League of Explorers", ["Druid"], "Raven Idol", 1, 0, abilities.RavenIdol, false, false, ais.true, RavenIdol, 66);
    card.chooseAi = coAis.RavenIdol;
    return card;
};

var Wrath = module.exports.Wrath = function() {
    var card = utilities.makeSpell("Common", "Classic", ["Druid"], "Wrath", 2, 0, abilities.Wrath, targetais.Wrath, filters.minion, ais.Darkbomb, Wrath, 73);
    card.chooseAi = coAis.Wrath;
    return card;
};

// Rares

var JadeIdol = module.exports.JadeIdol = function() {
    var card = utilities.makeSpell("Rare", "Mean Streets of Gadgetzan", ["Druid"], "Jade Idol", 1, 0, abilities.JadeIdol, false, false, ais.true, JadeIdol, 16);
    card.chooseAi = coAis.JadeIdol;
    return card;
};

var Nourish = module.exports.Nourish = function() {
    var card = utilities.makeSpell("Rare", "Classic", ["Druid"], "Nourish", 5, 0, abilities.Nourish, false, false, ais.true, Nourish, 54);
    card.chooseAi = coAis.Nourish;
    return card;
};

// Epics

var TreeofLife = module.exports.TreeofLife = function() {
    return utilities.makeSpell("Epic", "Goblins vs Gnomes", ["Druid"], "Tree of Life", 9, 0, abilities.TreeofLife, false, false, ais.TreeofLife, TreeofLife, 10);
};

// MINIONS

// Basic

// Commons

var DruidoftheFlame = module.exports.DruidoftheFlame = function() {
    var card = utilities.makeMinion(false, "Common", "Blackrock Mountain", ["Druid"], "Druid of the Flame", 3, 0, 2, 2, battlecries.DruidoftheFlame, false,
    false, [effects.sickness], ais.DruidoftheFlame, DruidoftheFlame, 67);
    card.chooseAi = coAis.DruidoftheFlame;
    return card;
};

var JadeBehemoth = module.exports.JadeBehemoth = function() {
    return utilities.makeMinion(false, "Common", "Mean Streets of Gadgetzan", ["Druid"], "Jade Behemoth", 6, 0, 6, 3, battlecries.JadeSpirit, false, false, [effects.sickness, effects.taunt], ais.true, JadeBehemoth, 56);
};

// Rares

var KlaxxiAmberWeaver = module.exports.KlaxxiAmberWeaver = function() {
    var card = utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", ["Druid"], "Klaxxi Amber-Weaver", 4, 0, 5, 4, battlecries.KlaxxiAmberWeaver, false, false,
    [effects.sickness], ais.KlaxxiAmberWeaver, KlaxxiAmberWeaver, 68);
    card["cult"] = "C'Thun";
    return card;
};

// Epics

var AncientofLore = module.exports.AncientofLore = function() {
    var card = utilities.makeMinion(false, "Epic", "Classic", ["Druid"], "Ancient of Lore", 7, 0, 5, 5, battlecries.AncientofLore, targetais.AncientofLore, filters.ally, [effects.sickness], ais.true, AncientofLore, 60);
    card.chooseAi = coAis.AncientofLore;
    return card;
};

var AncientofWar = module.exports.AncientofWar = function() {
    var card =  utilities.makeMinion(false, "Epic", "Classic", ["Druid"], "Ancient of War", 7, 0, 5, 5, battlecries.AncientofWar, false, false, [effects.sickness], ais.true, AncientofWar, 101);
    card.chooseAi = coAis.AncientofWar;
    return card;
};

// Legendaries

var Cenarius = module.exports.Cenarius = function() {
    var card = utilities.makeMinion(false, "Legendary", "Classic", ["Druid"], "Cenarius", 9, 0, 8, 5, battlecries.Cenarius, false,
    false, [effects.sickness], ais.Cenarius, Cenarius, 91);
    card.chooseAi = coAis.Cenarius;
    return card;
};

var FandralStaghelm = module.exports.FandralStaghelm = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", ["Druid"], "Fandral Staghelm", 4, 0, 5, 3, false, false, false, [effects.sickness, effects.FandralStaghelm], ais.true, FandralStaghelm, 62);
}

var Malorne = module.exports.Malorne = function() {
    return utilities.makeMinion("Beast", "Legendary", "Goblins vs Gnomes", ["Druid"], "Malorne", 7, 0, 7, 9, false, false, false,
    [effects.sickness, deathrattles.Malorne_Deathrattle], ais.Malorne, Malorne, 64);
};

// WARLOCK CARDS

// SPELLS

// Basic

var MortalCoil = module.exports.MortalCoil = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warlock"], "Mortal Coil", 1, 0, abilities.MortalCoil, targetais.MortalCoil, filters.minion, ais.MortalCoil, MortalCoil, 82);
};

var ShadowBolt = module.exports.ShadowBolt = function() {
    return utilities.makeSpell("Basic", "Basic", ["Warlock"], "Shadow Bolt", 3, 0, abilities.ShadowBolt, targetais.ShadowBolt, filters.minion, ais.ShadowBolt, ShadowBolt, 64);
};

// Commons

var Darkbomb = module.exports.Darkbomb = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", ["Warlock"], "Darkbomb", 2, 0, abilities.Darkbomb, targetais.Darkbomb, filters.any, ais.Darkbomb, Darkbomb, 76);
};

// Rares

var Shadowflame = module.exports.Shadowflame = function() {
    return utilities.makeSpell("Rare", "Classic", ["Warlock"], "Shadowflame", 4, 0, abilities.Shadowflame, targetais.Shadowflame, filters.allyMinion, ais.Shadowflame, Shadowflame, 78);
};

// Epics

// MINIONS

// Basic

var Succubus = module.exports.Succubus = function() {
    return utilities.makeMinion("Demon", "Basic", "Basic", ["Warlock"], "Succubus", 2, 0, 3, 4, battlecries.Succubus, false, false, [effects.sickness], ais.Succubus, Succubus, 32);
};

var Voidwalker = module.exports.Voidwalker = function() {
    return utilities.makeMinion("Demon", "Basic", "Basic", ["Warlock"], "Voidwalker", 1, 0, 3, 1, false, false, false,
    [effects.sickness, effects.taunt], ais.Voidwalker, Voidwalker, 71);
};

// Commons

// Rares

// Epics

// Legendaries

var LordJaraxxus = module.exports.LordJaraxxus = function() {
    return utilities.makeMinion("Demon", "Legendary", "Classic", ["Warlock"], "Lord Jaraxxus", 9, 0, 15, 3, battlecries.LordJaraxxus, false,
    false, [effects.sickness], ais.LordJaraxxus, LordJaraxxus, 67);
};

var MalGanis = module.exports.MalGanis = function() {
    return utilities.makeMinion("Demon", "Legendary", "Goblins vs Gnomes", ["Warlock"], "Mal'Ganis", 9, 0, 7, 9, false, false, false,
    [effects.sickness, effects.MalGanisBuffHp, effects.MalGanisBuffDamage,
    effects.MalGanisImmune], ais.MalGanis, MalGanis, 91);
};

// PALADIN CARDS

// SPELLS

// Basic

var BlessingofKings = module.exports.BlessingofKings = function() {
    return utilities.makeSpell("Basic", "Basic", ["Paladin"], "Blessing of Kings", 4, 0, abilities.BlessingofKings,
    targetais.BlessingofKings, filters.minion, ais.BlessingofKings, BlessingofKings, 80);
};

var HammerofWrath = module.exports.HammerofWrath = function() {
    return utilities.makeSpell("Basic", "Basic", ["Paladin"], "Hammer of Wrath", 4, 0, abilities.HammerofWrath, targetais.HammerofWrath, filters.any, ais.HammerofWrath, HammerofWrath, 67);
};

// Commons

var StandAgainstDarkness = module.exports.StandAgainstDarkness = function() {
    return utilities.makeSpell("Common", "Whispers of the Old Gods", ["Paladin"], "Stand Against Darkness", 5, 0, abilities.StandAgainstDarkness, false, false, ais.StandAgainstDarkness, StandAgainstDarkness, 49);
};

// Rares

var Equality = module.exports.Equality = function() {
    return utilities.makeSpell("Rare", "Classic", ["Paladin"], "Equality", 2, 0, abilities.Equality, false, false, ais.Equality, Equality, 63);
};

// Epics

var AvengingWrath = module.exports.AvengingWrath = function() {
    return utilities.makeSpell("Epic", "Classic", ["Paladin"], "Avenging Wrath", 6, 0, abilities.AvengingWrath, false, false, ais.AvengingWrath, AvengingWrath, 57);
};

// MINIONS

// Basic

var GuardianofKings = module.exports.GuardianofKings = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Paladin"], "Guardian of Kings", 7, 0, 6, 5, battlecries.GuardianofKings, false,
    false, [effects.sickness], ais.GuardianofKings, GuardianofKings, 55);
};

// Commons

var MurlocKnight = module.exports.MurlocKnight = function() {
    return utilities.makeMinion("Murloc", "Rare", "The Grand Tournament", ["Paladin"], "Murloc Knight", 4, 0, 4, 3, false, false, false,
    [effects.sickness, inspires.MurlocKnight_Inspire], ais.MurlocKnight, MurlocKnight, 86);
};

var WarhorseTrainer = module.exports.WarhorseTrainer = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", ["Paladin"], "Warhorse Trainer", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.WarhorseTrainer], ais.WarhorseTrainer, WarhorseTrainer, 52);
};

// Rares

var AldorPeacekeeper = module.exports.AldorPeacekeeper = function() {
    return utilities.makeMinion(false, "Rare", "Classic", ["Paladin"], "Aldor Peacekeeper", 3, 0, 3, 3, battlecries.AldorPeacekeeper,
    targetais.AldorPeacekeeper, filters.minion, [effects.sickness], ais.AldorPeacekeeper, AldorPeacekeeper, 96);
};

// Epics

// Legendaries

var BolvarFordragon = module.exports.BolvarFordragon = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", ["Paladin"], "Bolvar Fordragon", 5, 0, 7, 1, false, false, false,
    [effects.sickness, effects.BolvarFordragon], ais.BolvarFordragon, BolvarFordragon, 55);
};

var TirionFordring = module.exports.TirionFordring = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", ["Paladin"], "Tirion Fordring", 8, 0, 6, 6, false, false, false,
    [effects.sickness, effects.divineshield, effects.taunt, deathrattles.TirionFordring_Deathrattle], ais.TirionFordring, TirionFordring, 121);
};

// PRIEST CARDS

// SPELLS

// Basic

var HolySmite = module.exports.HolySmite = function() {
    return utilities.makeSpell("Basic", "Basic", ["Priest"], "Holy Smite", 1, 0, abilities.HolySmite, targetais.ArcaneShot, filters.any, ais.ArcaneShot, HolySmite, 63);
};

var ShadowWordDeath = module.exports.ShadowWordDeath = function() {
    return utilities.makeSpell("Basic", "Basic", ["Priest"], "Shadow Word: Death", 3, 0, abilities.ShadowWordDeath, 
    targetais.ShadowWordDeath, filters.ShadowWordDeath, ais.ShadowWordDeath, ShadowWordDeath, 88);
};

var ShadowWordPain = module.exports.ShadowWordPain = function() {
    return utilities.makeSpell("Basic", "Basic", ["Priest"], "Shadow Word: Pain", 2, 0, abilities.ShadowWordPain, 
    targetais.ShadowWordPain, filters.ShadowWordPain, ais.ShadowWordPain, ShadowWordPain, 71);
};

var HolyNova = module.exports.HolyNova = function() {
    return utilities.makeSpell("Basic", "Basic", ["Priest"], "Holy Nova", 5, 0, abilities.HolyNova, false, false, ais.HolyNova, HolyNova, 87);
};

var PowerWordShield = module.exports.PowerWordShield = function() {
    return utilities.makeSpell("Basic", "Basic", ["Priest"], "Power Word: Shield", 1, 0, abilities.PowerWordShield,
    targetais.PowerWordShield, filters.minion, ais.PowerWordShield, PowerWordShield, 90);
};

// Commons

var Entomb = module.exports.Entomb = function() {
    return utilities.makeSpell("Common", "League of Explorers", ["Priest"], "Entomb", 6, 0, abilities.Entomb, targetais.Entomb, filters.enemyMinion, ais.Entomb, Entomb, 65);
};

var VelensChosen = module.exports.VelensChosen = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", ["Priest"], "Velen's Chosen", 3, 0, abilities.VelensChosen, 
    targetais.VelensChosen, filters.minion, ais.VelensChosen, VelensChosen, 85);
};

// Rares

var HolyFire = module.exports.HolyFire = function() {
    return utilities.makeSpell("Rare", "Classic", ["Priest"], "Holy Fire", 6, 0, abilities.HolyFire, targetais.Fireball, filters.any, ais.Fireball, HolyFire, 59);
};

var Resurrect = module.exports.Resurrect = function() {
    return utilities.makeSpell("Rare", "Blackrock Mountain", ["Priest"], "Resurrect", 2, 0, abilities.Resurrect, false, false, ais.Resurrect, Resurrect, 53);
};

// Epics

var Shadowform = module.exports.Shadowform = function() {
    return utilities.makeSpell("Epic", "Classic", ["Priest"], "Shadowform", 3, 0, abilities.Shadowform, false, false, ais.true, Shadowform, 48);
};

// MINIONS

// Basic

var NorthshireCleric = module.exports.NorthshireCleric = function() {
    return utilities.makeMinion(false, "Basic", "Basic", ["Priest"], "Northshire Cleric", 1, 0, 3, 1, false, false, false,
    [effects.sickness, effects.NorthshireCleric], ais.NorthshireCleric, NorthshireCleric, 83);
};

// Commons

var TwilightWhelp = module.exports.TwilightWhelp = function() {
    return utilities.makeMinion("Dragon", "Common", "Blackrock Mountain", ["Priest"], "Twilight Whelp", 1, 0, 1, 2, battlecries.TwilightWhelp, false, false, [effects.sickness], ais.TwilightWhelp, TwilightWhelp, 39);
};

var DarkCultist = module.exports.DarkCultist = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", ["Priest"], "Dark Cultist", 3, 0, 4, 3, false, false, false, [deathrattles.DarkCultist_Deathrattle], ais.DarkCultist, DarkCultist, 90);
};

// Rares

var WyrmrestAgent = module.exports.WyrmrestAgent = function() {
    return utilities.makeMinion(false, "Rare", "The Grand Tournament", ["Priest"], "Wyrmrest Agent", 2, 0, 4, 1, battlecries.WyrmrestAgent, false, false, [effects.sickness], ais.TwilightWhelp, WyrmrestAgent, 42);
};

// Epics

// Legendaries

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// CUSTOM SETS

// These cards are of my own design, for a variety of purposes - random cards, custom classes, solo adventures, etc.
// I will mark them with the prefix "C_" so it's clear what is Custom.
// They WILL be available through Piloted Shredders, Unstable Portals, Golden Monkey, etc. to show how they would impact gameplay.

// ICECROWN CITADEL - A SOLO ADVENTURE

// Commons

// Rares

var C_SkybreakerSorcerer = module.exports.C_SkybreakerSorcerer = function() {
    return utilities.makeMinion(false, "Rare", "Icecrown Citadel", ["Neutral"], "Skybreaker Sorcerer", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.C_SkybreakerSorcerer], ais.true, C_SkybreakerSorcerer);
};

var C_CultAdherent = module.exports.C_CultAdherent = function() {
    return utilities.makeMinion(false, "Rare", "Uncollectible", ["Neutral"], "Cult Adherent", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.C_CultAdherent], ais.C_CultAdherent, C_CultAdherent);
};

var C_ManaSear = module.exports.C_ManaSear = function() {
    return utilities.makeSpell("Rare", "Icecrown Citadel", ["Neutral"], "Mana Sear", 3, 0, abilities.C_ManaSear, targetais.C_ManaSear, filters.any, ais.C_ManaSear, C_ManaSear);
};

// Epics

// Legendaries

// Boss Cards

var C_DarkEmpowerment = module.exports.C_DarkEmpowerment = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Dark Empowerment", 1, 0, abilities.C_DarkEmpowerment,
    targetais.C_DarkEmpowerment, filters.Deathwhisper_DarkEmpowerment, ais.C_DarkEmpowerment, C_DarkEmpowerment);
};

var C_CultFanatic_Normal = module.exports.C_CultFanatic_Normal = function() {
    return utilities.makeMinion(false, "Boss", "Uncollectible", ["Boss"], "Cult Fanatic", 3, 0, 3, 5, false, false, false, [effects.sickness], ais.C_CultFanatic, C_CultFanatic_Normal);
};

var C_DarkTransformation = module.exports.C_DarkTransformation = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Dark Transformation", 1, 0, abilities.C_DarkTransformation,
    targetais.C_DarkTransformation, filters.Deathwhisper_DarkTransformation, ais.C_DarkTransformation, C_DarkTransformation);
};

var C_CannonBlast = module.exports.C_CannonBlast = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Cannon Blast", 1, 0, abilities.C_CannonBlast, targetais.C_CannonBlast, filters.any, ais.C_CannonBlast, C_CannonBlast);
};

var C_IncineratingBlast = module.exports.C_IncineratingBlast = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Incinerating Blast", 3, 0, abilities.C_IncineratingBlast, targetais.Swipe, filters.any, ais.C_IncineratingBlast, C_IncineratingBlast);
};

var C_Fortify = module.exports.C_Fortify = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Fortify", 2, 0, abilities.C_Fortify, false, false, ais.true, C_Fortify);
};

var C_Repairs = module.exports.C_Repairs = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Repairs", 2, 0, abilities.C_Repairs, false, false, ais.C_Repairs, C_Repairs);
};

var C_Reload = module.exports.C_Reload = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Reload", 4, 0, abilities.C_Reload, false, false, ais.true, C_Reload);
};

var C_BoardingParty = module.exports.C_BoardingParty = function() {
    return utilities.makeSpell("Boss", "Uncollectible", ["Boss"], "Boarding Party", 3, 0, abilities.C_BoardingParty, false, false, ais.true, C_BoardingParty);
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++

var Arthas_ValiantFootman = module.exports.Arthas_ValiantFootman = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Valiant Footman", 2, 0, 3, 2, battlecries.Arthas_ValiantFootman, false, false, [effects.sickness], ais.true, Arthas_ValiantFootman);
};

var Arthas_DwarvenRifleman = module.exports.Arthas_DwarvenRifleman = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Dwarven Rifleman", 3, 0, 2, 3, false, false, false, [effects.sickness, effects.Arthas_DwarvenRifleman], ais.true, Arthas_DwarvenRifleman);
};

var Arthas_Knight = module.exports.Arthas_Knight = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Knight", 5, 0, 6, 4, false, false, false, [effects.taunt], ais.true, Arthas_Knight);
};

var Arthas_MortarTeam = module.exports.Arthas_MortarTeam = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Mortar Team", 4, 0, 3, 3, false, false, false, [effects.sickness, effects.cantattack, effects.Arthas_MortarTeam], ais.true, Arthas_MortarTeam);
};

var Arthas_ElvenPriest = module.exports.Arthas_ElvenPriest = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Elven Priest", 3, 0, 4, 2, false, false, false, [effects.sickness, inspires.Arthas_ElvenPriest_Inspire], ais.Arthas_ElvenPriest, Arthas_ElvenPriest);
};

var Arthas_Sorceress = module.exports.Arthas_Sorceress = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Sorceress", 3, 0, 4, 2, false, false, false, [effects.sickness, inspires.Arthas_Sorceress_Inspire], ais.Arthas_Sorceress, Arthas_Sorceress);
};

var Arthas_Gyrocopter = module.exports.Arthas_Gyrocopter = function() {
    return utilities.makeMinion("Mech", "Arthas", "Uncollectible", ["Arthas"], "Gyrocopter", 4, 0, 4, 3, false, false, false, [effects.windfury], ais.true, Arthas_Gyrocopter);
};

var Arthas_SteamEngine = module.exports.Arthas_SteamEngine = function() {
    return utilities.makeMinion("Mech", "Arthas", "Uncollectible", ["Arthas"], "Steam Engine", 6, 0, 8, 5, false, false, false, [effects.Arthas_SteamEngine], ais.true, Arthas_SteamEngine);
};

var Arthas_Devotion = module.exports.Arthas_Devotion = function() {
    return utilities.makeSpell("Arthas", "Uncollectible", ["Arthas"], "Devotion", 2, 0, abilities.Arthas_Devotion, false, false, ais.Arthas_Devotion, Arthas_Devotion);
};

var Arthas_HolyLight = module.exports.Arthas_HolyLight = function() {
    return utilities.makeSpell("Arthas", "Uncollectible", ["Arthas"], "Holy Light", 1, 0, abilities.Arthas_HolyLight, targetais.Arthas_HolyLight, filters.Arthas_FlashofLight, ais.Arthas_HolyLight, Arthas_HolyLight);
};

var Arthas_Retribution = module.exports.Arthas_Retribution = function() {
    return utilities.makeSpell("Arthas", "Uncollectible", ["Arthas"], "Retribution", 2, 0, abilities.Arthas_Retribution, false, false, ais.Arthas_Retribution, Arthas_Retribution);
};

var Arthas_HammerofJustice = module.exports.Arthas_HammerofJustice = function() {
    return utilities.makeWeapon("Uncollectible", "Arthas", ["Arthas"], "Hammer of Justice", 3, 0, 3, 4, false, false, false, [], ais.Arthas_HammerofJustice, Arthas_HammerofJustice);
};

var Arthas_BladeofWrath = module.exports.Arthas_BladeofWrath = function() {
    return utilities.makeWeapon("Uncollectible", "Arthas", ["Arthas"], "Blade of Wrath", 5, 0, 5, 2, battlecries.Arthas_BladeofWrath, targetais.Arthas_BladeofWrath, filters.any, [], ais.Arthas_BladeofWrath, Arthas_BladeofWrath);
};

// Undead

var Arthas_Ghoul = module.exports.Arthas_Ghoul = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Ghoul", 1, 0, 2, 3, false, false, false, [effects.sickness], ais.true, Arthas_Ghoul);
};

var Arthas_DeathboundNerubian = module.exports.Arthas_DeathboundNerubian = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Deathbound Nerubian", 3, 0, 4, 3, battlecries.Arthas_DeathboundNerubian, targetais.Arthas_DeathboundNerubian, filters.any, [effects.sickness], ais.true, Arthas_DeathboundNerubian);
};

var Arthas_Necromancer = module.exports.Arthas_Necromancer = function() {
    return utilities.makeMinion(false, "Arthas", "Uncollectible", ["Arthas"], "Necromancer", 3, 0, 2, 4, false, false, false, [effects.sickness, effects.Arthas_Necromancer], ais.true, Arthas_Necromancer);
};

var Arthas_Banshee = module.exports.Arthas_Banshee = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Banshee", 3, 0, 3, 3, false, false, false, [effects.sickness, deathrattles.Arthas_Banshee_Deathrattle], ais.true, Arthas_Banshee);
};

var Arthas_PlaguebornGargoyle = module.exports.Arthas_PlaguebornGargoyle = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Plagueborn Gargoyle", 2, 0, 4, 2, false, false, false, [effects.sickness, effects.StoneskinGargoyle], ais.true, Arthas_PlaguebornGargoyle);
};

var Arthas_FesteringAbomination = module.exports.Arthas_FesteringAbomination = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Festering Abomination", 6, 0, 8, 9, false, false, false, [effects.sickness, effects.Arthas_FesteringAbomination], ais.true, Arthas_FesteringAbomination);
};

var Arthas_ReanimatedFrostWyrm = module.exports.Arthas_ReanimatedFrostWyrm = function() {
    return utilities.makeMinion("Undead", "Arthas", "Uncollectible", ["Arthas"], "Reanimated Frost Wyrm", 7, 0, 9, 9, false, false, false, [effects.sickness, effects.freezetarget], ais.true, Arthas_ReanimatedFrostWyrm);
};