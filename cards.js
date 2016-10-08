var battlecries = require('./battlecries.js');
var deathrattles = require('./deathrattles.js');
var enrages = require('./enrages.js');
var inspires = require('./inspires.js');
var effects = require('./effects.js');
var weapons = require('./weapons.js');
var abilities = require('./abilities.js');

    var ais = require('./AIs.js');
    var targetais = require('./targetAIs.js');
    // If you want to make your own alternate version of this simulator, you can plug in any two files here to use your own AIs. They need to have the right names, though,
    // not every AI is named the exact same thing as the card. I'm intending to set up a way to use different AIs for each player in the future, at which point I'd love
    // to receive a second set of AI and targetAI files to use :)

var filters = require('./filters.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js');

// BASICS

var TheCoin = module.exports.TheCoin = function() {
    return utilities.makeSpell("Basic", "Basic", false, "The Coin", 0, 0, abilities.TheCoin, false, false, ais.TheCoin, TheCoin, 100);
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

// NEUTRAL CARDS

// CLASSIC SET

// Basics

var BloodfenRaptor = module.exports.BloodfenRaptor = function() {
    return utilities.makeMinion("Beast", "Basic", "Basic", false, "Bloodfen Raptor", 2, 0, 2, 3, false, false, false,
    [effects.sickness], ais.true, BloodfenRaptor, 54);
};

var BoulderfistOgre = module.exports.BoulderfistOgre = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Boulderfist Ogre", 6, 0, 7, 6, false, false, false,
    [effects.sickness], ais.true, BoulderfistOgre, 66);
};

var ChillwindYeti = module.exports.ChillwindYeti = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Chillwind Yeti", 4, 0, 5, 4, false, false, false, 
    [effects.sickness], ais.true, ChillwindYeti, 67);
};

var ElvenArcher = module.exports.ElvenArcher = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Elven Archer", 1, 0, 1, 1,
    battlecries.ElvenArcher, targetais.ElvenArcher, filters.any, [effects.sickness], ais.ElvenArcher, ElvenArcher, 59);
};

var FrostwolfGrunt = module.exports.FrostwolfGrunt = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Frostwolf Grunt", 2, 0, 2, 2, false, false, false,
    [effects.sickness, effects.taunt], ais.FrostwolfGrunt, FrostwolfGrunt, 37);
};

var MagmaRager = module.exports.MagmaRager = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Magma Rager", 3, 0, 1, 5, false, false, false, [effects.sickness], ais.MagmaRager, MagmaRager, 16);
};

var MurlocRaider = module.exports.MurlocRaider = function() {
    return utilities.makeMinion("Murloc", "Basic", "Basic", false, "Murloc Raider", 1, 0, 1, 2, false, false, false, [effects.sickness], ais.MurlocRaider, MurlocRaider, 40);
};

var Nightblade = module.exports.Nightblade = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Nightblade", 5, 0, 4, 4,
    battlecries.Nightblade, false, false, [effects.sickness], ais.true, Nightblade, 41);
};

var NoviceEngineer = module.exports.NoviceEngineer = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Novice Engineer", 2, 0, 1, 1,
    battlecries.NoviceEngineer, false, false, [effects.sickness], ais.true, NoviceEngineer, 52);
};

var OgreMagi = module.exports.OgreMagi = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Ogre Magi", 4, 0, 4, 4, false, false, false,
    [effects.sickness, effects.spelldamage1], ais.true, OgreMagi, 51);
};

// Commons

var AbusiveSergeant = module.exports.AbusiveSergeant = function() {
    return utilities.makeMinion(false, "Common", "Classic", false, "Abusive Sergeant", 1, 0, 1, 2, battlecries.AbusiveSergeant, targetais.AbusiveSergeant, filters.minion, [effects.sickness], ais.true, AbusiveSergeant);
}; // add tier

var AcolyteofPain = module.exports.AcolyteofPain = function() {
    return utilities.makeMinion(false, "Classic", "Common", false, "Acolyte of Pain", 3, 0, 3, 1, false, false, false,
    [effects.sickness, effects.AcolyteofPain], ais.AcolyteofPain, AcolyteofPain, 59);
};

var HarvestGolem = module.exports.HarvestGolem = function() {
    return utilities.makeMinion("Mech", "Classic", "Common", false, "Harvest Golem", 3, 0, 3, 2, false, false, false,
    [effects.sickness, deathrattles.HarvestGolem_Deathrattle], ais.HarvestGolem, HarvestGolem, 68);
};

var LeperGnome = module.exports.LeperGnome = function() {
    return utilities.makeMinion(false, "Classic", "Common", false, "Leper Gnome", 1, 0, 1, 1, false, false, false,
    [effects.sickness, deathrattles.LeperGnome_Deathrattle], ais.LeperGnome, LeperGnome, 16);
};

var SilverHandKnight = module.exports.SilverHandKnight = function() {
    return utilities.makeMinion(false, "Classic", "Common", false, "Silver Hand Knight", 5, 0, 4, 4, battlecries.SilverHandKnight, false, false, [effects.sickness], ais.MurlocRaider, SilverHandKnight, 70);
};

var Spellbreaker = module.exports.Spellbreaker = function() {
    return utilities.makeMinion(false, "Classic", "Common", false, "Spellbreaker", 4, 0, 3, 4,
    battlecries.Spellbreaker, targetais.Spellbreaker, filters.minion, [effects.sickness], ais.Spellbreaker, Spellbreaker, 63);
};

// Rares

var Abomination = module.exports.Abomination = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Abomination", 5, 0, 4, 4, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.Abomination_Deathrattle], ais.MurlocRaider, Abomination, 42);
};

var ArgentCommander = module.exports.ArgentCommander = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Argent Commander", 6, 0, 2, 4, false, false, false, [effects.divineshield], ais.MurlocRaider, ArgentCommander, 80);
};

var AzureDrake = module.exports.AzureDrake = function() {
    return utilities.makeMinion("Dragon", "Rare", "Classic", false, "Azure Drake", 5, 0, 4, 4, battlecries.AzureDrake, false,
    false, [effects.spelldamage1, effects.sickness], ais.AzureDrake, AzureDrake, 76);
};

var CrazedAlchemist = module.exports.CrazedAlchemist = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Crazed Alchemist", 2, 0, 2, 2, battlecries.CrazedAlchemist, targetais.ReversingSwitch, filters.minion, [effects.sickness], ais.MurlocRaider, CrazedAlchemist, 53);
};

var KnifeJuggler = module.exports.KnifeJuggler = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Knife Juggler", 2, 0, 2, 2, false, false, false,
    [effects.sickness, effects.KnifeJuggler], ais.KnifeJuggler, KnifeJuggler, 58);
};

// Epics

var BigGameHunter = module.exports.BigGameHunter = function() {
    return utilities.makeMinion(false, "Epic", "Classic", false, "Big Game Hunter", 3, 0, 2, 4, battlecries.BigGameHunter,
    targetais.BigGameHunter, filters.BigGameHunter, [effects.sickness], ais.BigGameHunter, BigGameHunter, 49);
};

var FacelessManipulator = module.exports.FacelessManipulator = function() {
    return utilities.makeMinion(false, "Epic", "Classic", false, "Faceless Manipulator", 5, 0, 3, 3, battlecries.FacelessManipulator,
    targetais.FacelessManipulator, filters.minion, [effects.sickness], ais.FacelessManipulator, FacelessManipulator, 54);
};

//Legendaries

var Alexstrasza = module.exports.Alexstrasza = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Classic", false, "Alexstrasza", 9, 0, 8, 8, battlecries.Alexstrasza,
    targetais.Alexstrasza, filters.player, [effects.sickness], ais.Alexstrasza, Alexstrasza, 71);
};

var BloodmageThalnos = module.exports.BloodmageThalnos = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Bloodmage Thalnos", 2, 0, 1, 1, false, false, false,
    [effects.sickness, effects.spelldamage1, deathrattles.BloodmageThalnos_Deathrattle], ais.BloodmageThalnos, BloodmageThalnos, 55);
};

var Deathwing = module.exports.Deathwing = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Classic", false, "Deathwing", 10, 0, 12, 12, battlecries.Deathwing,
    false, false, [effects.sickness], ais.Deathwing, Deathwing, 110);
};

var Ragnaros = module.exports.Ragnaros = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Ragnaros the Firelord", 8, 0, 8, 8, false, false, false,
    [effects.cantattack, effects.sickness, effects.Ragnaros], ais.Ragnaros, Ragnaros, 94);
};

var Sylvanas = module.exports.Sylvanas = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Sylvanas Windrunner", 6, 0, 5, 5, false, false, false,
    [effects.sickness, deathrattles.Sylvanas_Deathrattle], ais.Sylvanas, Sylvanas, 87);
};

// NAXXRAMAS SET

// Boss Cards

// Spells

var LocustSwarm = module.exports.LocustSwarm = function() {
    return utilities.makeSpell("Basic", false, "Uncollectible", "Locust Swarm", 7, 0, abilities.LocustSwarm, false, false, ais.LocustSwarm, LocustSwarm);
};

// Minions

var Deathcharger = module.exports.Deathcharger = function() {
    return utilities.makeMinion(false, "Common", "Uncollectible", false, "Deathcharger", 1, 0, 3, 2, false, false, false,
    [deathrattles.Deathcharger_Deathrattle], ais.MurlocRaider, Deathcharger);
};

// Commons

var HauntedCreeper = module.exports.HauntedCreeper = function() {
    return utilities.makeMinion("Beast", "Common", "Naxxramas", false, "Haunted Creeper", 2, 0, 2, 1, false, false, false,
    [effects.sickness, deathrattles.HauntedCreeper_Deathrattle], ais.MurlocRaider, HauntedCreeper, 76);
};

var NerubarWeblord = module.exports.NerubarWeblord = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", false, "Nerub'ar Weblord", 2, 0, 4, 1, false, false, false,
    [effects.sickness], ais.MurlocRaider, NerubarWeblord, 40);
};

var StoneskinGargoyle = module.exports.StoneskinGargoyle = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", false, "Stoneskin Gargoyle", 3, 0, 4, 1, false, false, false,
    [effects.sickness, effects.StoneskinGargoyle], ais.MurlocRaider, StoneskinGargoyle, 7);
};

// Rares

var Deathlord = module.exports.Deathlord = function() {
    return utilities.makeMinion(false, "Rare", "Naxxramas", false, "Deathlord", 3, 0, 8, 2, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.Deathlord_Deathrattle], ais.MurlocRaider, Deathlord, 52);
};

var NerubianEgg = module.exports.NerubianEgg = function() {
    return utilities.makeMinion(false, "Rare", "Naxxramas", false, "Nerubian Egg", 2, 0, 2, 0, false, false, false,
    [effects.sickness, deathrattles.NerubianEgg_Deathrattle], ais.MurlocRaider, NerubianEgg, 49);
};

var SludgeBelcher = module.exports.SludgeBelcher = function() {
    return utilities.makeMinion(false, "Rare", "Naxxramas", false, "Sludge Belcher", 5, 0, 5, 3, false, false, false,
    [effects.sickness, effects.taunt, deathrattles.SludgeBelcher_Deathrattle], ais.SludgeBelcher, SludgeBelcher, 82);
};

// Epics

var ShadeofNaxxramas = module.exports.ShadeofNaxxramas = function() {
    return utilities.makeMinion(false, "Epic", "Naxxramas", false, "Shade of Naxxramas", 3, 0, 2, 2, false, false, false,
    [effects.sickness, effects.stealth, effects.ShadeofNaxxramas], ais.MurlocRaider, ShadeofNaxxramas, 65);
};

// Legendaries

var Maexxna = module.exports.Maexxna = function() {
    return utilities.makeMinion("Beast", "Legendary", "Naxxramas", false, "Maexxna", 6, 0, 8, 2, false, false, false, [effects.sickness, effects.poison], ais.Maexxna, Maexxna, 64);
};

var Loatheb = module.exports.Loatheb = function() {
    return utilities.makeMinion(false, "Legendary", "Naxxramas", false, "Loatheb",5, 0, 5, 5, battlecries.Loatheb, false, false, [effects.sickness], ais.Loatheb, Loatheb, 63);
};

// GOBLINS VS GNOMES SET

// Commons

var AnnoyoTron = module.exports.AnnoyoTron = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Annoy-o-Tron", 2, 0, 2, 1, false, false, false,
    [effects.sickness, effects.divineshield, effects.taunt], ais.AnnoyoTron, AnnoyoTron, 62);
};

var SpiderTank = module.exports.SpiderTank = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Spider Tank", 3, 0, 4, 3, false, false, false, [effects.sickness], ais.SpiderTank, SpiderTank, 68);
};

var ClockworkGnome = module.exports.ClockworkGnome = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Clockwork Gnome", 1, 0, 1, 2, false, false, false,
    [effects.sickness, deathrattles.ClockworkGnome_Deathrattle], ais.ClockworkGnome, ClockworkGnome, 57);
};

var Mechwarper = module.exports.Mechwarper = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Mechwarper", 2, 0, 3, 2, false, effects.MechWarper.action,
    false, [effects.sickness, effects.MechWarper], ais.Mechwarper, Mechwarper, 63);
};

var Snowchugger = module.exports.Snowchugger = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Snowchugger", 2, 0, 3, 2, false, false, false,
    [effects.sickness, effects.freezetarget], ais.Snowchugger, Snowchugger, 69);
};

var TinkertownTechnician = module.exports.TinkertownTechnician = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Tinkertown Technician", 3, 0, 3, 3, battlecries.TinkertownTechnician,
    false, false, [effects.sickness], ais.TinkertownTechnician, TinkertownTechnician, 50);
};

var MechanicalYeti = module.exports.MechanicalYeti = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Mechanical Yeti", 4, 0, 5, 4, false, false, false,
    [effects.sickness, deathrattles.MechanicalYeti_Deathrattle], ais.MechanicalYeti, MechanicalYeti, 69);
};

var PilotedShredder = module.exports.PilotedShredder = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Piloted Shredder", 4, 0, 3, 4, false, false, false,
    [effects.sickness, deathrattles.PilotedShredder_Deathrattle], ais.PilotedShredder, PilotedShredder, 86);
};

// Rares

// Epics

// Legendaries

var DrBoom = module.exports.DrBoom = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", false, "Dr. Boom", 7, 0, 7, 7,
    battlecries.DrBoom, false, false, [effects.sickness], ais.DrBoom, DrBoom, 124);
};

var Toshley = module.exports.Toshley = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", false, "Toshley", 6, 0, 7, 5,
    battlecries.Toshley, false, false, [effects.sickness, deathrattles.Toshley_Deathrattle], ais.Toshley, Toshley, 74);
};

// BLACKROCK MOUNTAIN SET

// Boss Cards

// Commons

var BlackwingTechnician = module.exports.BlackwingTechnician = function() {
    return utilities.makeMinion(false, "Common", "Blackrock Mountain", false, "Blackwing Technician", 3, 0, 4, 2,
    battlecries.BlackwingTechnician, false, false, [effects.sickness], ais.TwilightWhelp, BlackwingTechnician, 47);
};

var BlackwingCorruptor = module.exports.BlackwingCorruptor = function() {
    return utilities.makeMinion(false, "Common", "Blackrock Mountain", false, "Blackwing Corruptor", 5, 0, 4, 5,
    battlecries.BlackwingCorruptor, targetais.BlackwingCorruptor, filters.any, [effects.sickness], ais.TwilightWhelp, BlackwingCorruptor, 46);
};

// Rares

var GrimPatron = module.exports.GrimPatron = function() {
    return utilities.makeMinion(false, "Rare", "Blackrock Mountain", false, "Grim Patron", 5, 0, 3, 3, false, false, false,
    [effects.sickness, effects.GrimPatron], ais.GrimPatron, GrimPatron, 23);
};

// Epics

// Legendaries

var EmperorThaurissan = module.exports.EmperorThaurissan = function() {
    return utilities.makeMinion(false, "Legendary", "Blackrock Mountain", false, "Emperor Thaurissan", 6, 0, 5, 5, false, false, false,
    [effects.sickness, effects.EmperorThaurissan], ais.EmperorThaurissan, EmperorThaurissan, 60);
};

var Nefarian = module.exports.Nefarian = function() {
    return utilities.makeMinion("Dragon", "Legendary", "Blackrock Mountain", false, "Nefarian", 9, 0, 8, 8, battlecries.Nefarian, false, false, [effects.sickness], ais.Nefarian, Nefarian, 77);
};

// GRAND TOURNAMENT SET

// Commons

var NorthSeaKraken = module.exports.NorthSeaKraken = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", false, "North Sea Kraken", 9, 0, 7, 9, battlecries.NorthSeaKraken, targetais.ShadowBolt, filters.any, [effects.sickness], ais.MurlocRaider, NorthSeaKraken, 86);
};

var ArgentHorserider = module.exports.ArgentHorserider = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", false, "Argent Horserider", 3, 0, 1, 2, false, false, false, [effects.divineshield], ais.MurlocRaider, ArgentHorserider, 71);
};

// Rares

var MasterJouster = module.exports.MasterJouster = function() {
    return utilities.makeMinion(false, "Rare", "The Grand Tournament", false, "Master Jouster", 6, 0, 6, 5, battlecries.MasterJouster,
    false, false, [effects.sickness], ais.MasterJouster, MasterJouster, 62);
};

// Epics

var Kodorider = module.exports.Kodorider = function() {
    return utilities.makeMinion(false, "Epic", "The Grand Tournament", false, "Kodorider", 6, 0, 5, 3, false, false, false,
    [effects.sickness, inspires.Kodorider_Inspire], ais.Kodorider, Kodorider, 69);
};

var TwilightGuardian = module.exports.TwilightGuardian = function() {
    return utilities.makeMinion("Dragon", "Epic", "The Grand Tournament", false, "Twilight Guardian", 4, 0, 6, 2,
    battlecries.TwilightGuardian, false, false, [effects.sickness], ais.TwilightWhelp, TwilightGuardian, 49);
};

// Legendaries

var NexusChampionSaraad = module.exports.NexusChampionSaraad = function() {
    return utilities.makeMinion(false, "Legendary", "The Grand Tournament", false, "Nexus-Champion Saraad", 5, 0, 5, 4, false, false, false,
    [effects.sickness, inspires.NexusChampionSaraad_Inspire], ais.NexusChampionSaraad, NexusChampionSaraad, 74);
};

// LEAGUE OF EXPLORERS SET

// Boss Cards

// Commons

// Rares

// Epics

// Legendaries

var EliseStarseeker = module.exports.EliseStarseeker = function() {
    return utilities.makeMinion(false, "Legendary", "League of Explorers", false, "Elise Starseeker", 4, 0, 5, 3, battlecries.EliseStarseeker,
    false, false, [effects.sickness], ais.EliseStarseeker, EliseStarseeker, 49);
};

var RenoJackson = module.exports.RenoJackson = function() {
    return utilities.makeMinion(false, "Legendary", "League of Explorers", false, "Reno Jackson", 6, 0, 6, 4, battlecries.RenoJackson,
    false, false, [effects.sickness], ais.RenoJackson, RenoJackson, 51);
};

// WHISPERS OF THE OLD GODS SET

// Commons

var PollutedHoarder = module.exports.PollutedHoarder = function() {
    return utilities.makeMinion(false, "Common", "Whispers of the Old Gods", false, "Polluted Hoarder", 4, 0, 2, 4, false, false, false,
    [effects.sickness, deathrattles.PollutedHoarder_Deathrattle], ais.MurlocRaider, PollutedHoarder, 59);
};

var BeckonerofEvil = module.exports.BeckonerofEvil = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", false, "Beckoner of Evil", 2, 0, 3, 2, battlecries.BeckonerofEvil, false, false,
    [effects.sickness], ais.MurlocRaider, BeckonerofEvil);
    card["cult"] = "C'Thun";
    return card;
};

var CThunsChosen = module.exports.CThunsChosen = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", false, "C'Thun's Chosen", 4, 0, 2, 4, battlecries.CThunsMinion, false, false,
    [effects.sickness, effects.divineshield], ais.MurlocRaider, CThunsChosen);
    card["cult"] = "C'Thun";
    return card;
};

var TwilightElder = module.exports.TwilightElder = function() {
    var card = utilities.makeMinion(false, "Common", "Whispers of the Old Gods", false, "Twilight Elder", 3, 0, 4, 3, false, false, false,
    [effects.sickness, effects.TwilightElder], ais.MurlocRaider, TwilightElder);
    card["cult"] = "C'Thun";
    return card;
};

// Rares

var CorruptedHealbot = module.exports.CorruptedHealbot = function() {
    return utilities.makeMinion("Mech", "Rare", "Whispers of the Old Gods", false, "Corrupted Healbot", 5, 0, 6, 6, false, false, false,
    [effects.sickness, deathrattles.CorruptedHealbot_Deathrattle], ais.MurlocRaider, CorruptedHealbot, 71);
};

var EaterofSecrets = module.exports.EaterofSecrets = function() {
    return utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", false, "Eater of Secrets", 4, 0, 4, 2, battlecries.EaterofSecrets, false, false,
    [effects.sickness], ais.EaterofSecrets, EaterofSecrets, 23);
};

// Epics

var ValidatedDoomsayer = module.exports.ValidatedDoomsayer = function() {
    return utilities.makeMinion(false, "Epic", "Whispers of the Old Gods", false, "Validated Doomsayer", 5, 0, 7, 0, false, false, false,
    [effects.sickness, effects.ValidatedDoomsayer], ais.MurlocRaider, ValidatedDoomsayer, 41);
};

// Legendaries

var CThun = module.exports.CThun = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", false, "C'Thun", 10, 0, 6, 6, battlecries.CThun, false, false,
    [effects.sickness], ais.CThun, CThun);
};

var NZoththeCorruptor = module.exports.NZoththeCorruptor = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", false, "N'Zoth, the Corruptor", 10, 0, 7, 5, battlecries.NZoth, false, false, [effects.sickness], ais.NZoth, NZoththeCorruptor, 4);
};

var YoggSaronHopesEnd = module.exports.YoggSaronHopesEnd = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", false, "Yogg-Saron, Hope's End", 10, 0, 5, 7, battlecries.YoggSaron, false, false, [effects.sickness], ais.YoggSaron, YoggSaronHopesEnd, 31);
};

var YShaarjRageUnbound = module.exports.YShaarjRageUnbound = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", false, "Y'Shaarj, Rage Unbound", 10, 0, 10, 10, false, false, false,
    [effects.sickness, effects.YShaarj], ais.MurlocRaider, YShaarjRageUnbound);
};

var HoggerScourgeofElwynn = module.exports.HoggerScourgeofElwynn = function() {
    return utilities.makeMinion(false, "Legendary", "Whispers of the Old Gods", false, "Hogger, Scourge of Elwynn", 7, 0, 6, 6, false, false, false,
    [effects.sickness, effects.HoggerScourgeofElwynn], ais.MurlocRaider, HoggerScourgeofElwynn, 77);
};

// ONE NIGHT IN KARAZHAN SET

// Commons

// Rares

// Epics

var ArcaneGiant = module.exports.ArcaneGiant = function() {
    return utilities.makeMinion(false, "Epic", "One Night in Karazhan", false, "Arcane Giant", 12, 0, 8, 8, false, false, false,
    [effects.sickness, effects.ArcaneGiant], ais.ArcaneGiant, ArcaneGiant, 26);
};

// Legendaries

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

// MAGE CARDS

// SPELLS

// Basic

var ArcaneExplosion = module.exports.ArcaneExplosion = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Arcane Explosion", 2, 0, abilities.ArcaneExplosion, false, false, ais.ArcaneExplosion, ArcaneExplosion, 52);
};

var ArcaneIntellect = module.exports.ArcaneIntellect = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Arcane Intellect", 3, 0, abilities.ArcaneIntellect, false, false, ais.ArcaneIntellect, ArcaneIntellect, 62);
};

var ArcaneMissiles = module.exports.ArcaneMissiles = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Arcane Missiles", 1, 0, abilities.ArcaneMissiles, false, false, ais.ArcaneMissiles, ArcaneMissiles, 51);
};

var Fireball = module.exports.Fireball = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Fireball", 4, 0, abilities.Fireball, targetais.Fireball, filters.any, ais.Fireball, Fireball, 91);
};

var Flamestrike = module.exports.Flamestrike = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Flamestrike", 7, 0, abilities.Flamestrike, false, false, ais.Flamestrike, Flamestrike, 109);
};

var Frostbolt = module.exports.Frostbolt = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Frostbolt", 2, 0, abilities.Frostbolt, targetais.Frostbolt, filters.any, ais.Frostbolt, Frostbolt, 79);
};

var FrostNova = module.exports.FrostNova = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Frost Nova", 3, 0, abilities.FrostNova, false, false, ais.FrostNova, FrostNova, 33);
};

var MirrorImage = module.exports.MirrorImage = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Mirror Image", 1, 0, abilities.MirrorImage, false, false, ais.MirrorImage, MirrorImage, 45);
};

var Polymorph = module.exports.Polymorph = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Polymorph", 4, 0, abilities.Polymorph, targetais.Polymorph, filters.minion, ais.Polymorph, Polymorph, 71);
};

// Commons

var ConeofCold = module.exports.ConeofCold = function() {
    return utilities.makeSpell("Common", "Classic", false, "Cone of Cold", 4, 0, abilities.ConeofCold, targetais.ConeofCold, filters.minion, ais.ConeofCold, ConeofCold, 47);
};

var Duplicate = module.exports.Duplicate = function() {
    return utilities.makeSpell("Common", "Naxxramas", false, "Duplicate", 3, 0, abilities.Duplicate, false, false, ais.Duplicate, Duplicate, 44);
};

var Flamecannon = module.exports.Flamecannon = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", false, "Flamecannon", 2, 0, abilities.Flamecannon, false, false, ais.Flamecannon, Flamecannon, 80);
};

var MirrorEntity = module.exports.MirrorEntity = function() {
    return utilities.makeSpell("Common", "Classic", false, "Mirror Entity", 3, 0, abilities.MirrorEntity, false, false, ais.MirrorEntity, MirrorEntity, 58);
};

// Rares

var UnstablePortal = module.exports.UnstablePortal = function() {
    return utilities.makeSpell("Rare", "Goblins vs Gnomes", false, "Unstable Portal", 2, 0, abilities.UnstablePortal, false, false, ais.UnstablePortal, UnstablePortal, 42);
};

var Vaporize = module.exports.Vaporize = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Vaporize", 3, 0, abilities.Vaporize, false, false, ais.Vaporize, Vaporize, 48);
};

// Epics

var IceBlock = module.exports.IceBlock = function() {
    return utilities.makeSpell("Epic", "Classic", false, "Ice Block", 3, 0, abilities.IceBlock, false, false, ais.true, IceBlock, 18);
};

// MINIONS

// Basic

// Commons

var ManaWyrm = module.exports.ManaWyrm = function() {
    return utilities.makeMinion(false, "Common", "Classic", false, "Mana Wyrm", 1, 0, 3, 1, false, false, false, [effects.sickness, effects.ManaWyrm], ais.ManaWyrm, ManaWyrm, 76);
};

var Spellslinger = module.exports.Spellslinger = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", false, "Spellslinger", 3, 0, 4, 3, battlecries.Spellslinger,
    false, false, [effects.sickness], ais.Spellslinger, Spellslinger, 64);
};

// Rares

var GoblinBlastmage = module.exports.GoblinBlastmage = function() {
    return utilities.makeMinion(false, "Rare", "Goblins vs Gnomes", false, "Goblin Blastmage", 4, 0, 4, 5, battlecries.GoblinBlastmage,
    false, false, [effects.sickness], ais.GoblinBlastmage, GoblinBlastmage, 71);
};

// Epics

// Legendaries

var ArchmageAntonidas = module.exports.ArchmageAntonidas = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Archmage Antonidas", 7, 0, 7, 5, false, false, false,
    [effects.sickness, effects.Antonidas], ais.ArchmageAntonidas, ArchmageAntonidas, 78);
};

var Rhonin = module.exports.Rhonin = function() {
    return utilities.makeMinion(false, "Legendary", "The Grand Tournament", "Rhonin", 8, 0, 7, 7, false, false, false,
    [effects.sickness, deathrattles.Rhonin_Deathrattle], ais.MurlocRaider, Rhonin, 77);
};

// WARRIOR CARDS

// SPELLS & WEAPONS

// Basic

var ArcaniteReaper = module.exports.ArcaniteReaper = function() {
    return utilities.makeWeapon("Basic", "Basic", "Arcanite Reaper", 5, 0, 5, 2, false, false, false, [], ais.MurlocRaider, ArcaniteReaper, 78);
};

var Cleave = module.exports.Cleave = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Cleave", 2, 0, abilities.Cleave, false, false, ais.Cleave, Cleave, 67);
};

var Execute = module.exports.Execute = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Execute", 1, 0, abilities.Execute, targetais.Execute, filters.Execute, ais.Execute, Execute, 72);
};

var Whirlwind = module.exports.Whirlwind = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Whirlwind", 1, 0, abilities.Whirlwind, false, false, ais.Whirlwind, Whirlwind, 45);
};

// Commons

var BattleRage = module.exports.BattleRage = function() {
    return utilities.makeSpell("Common", "Classic", false, "Battle Rage", 2, 0, abilities.BattleRage, false, false, ais.BattleRage, BattleRage, 61);
};

// Rares

// Epics

var BloodWarriors = module.exports.BloodWarriors = function() {
    return utilities.makeSpell("Epic", "Whispers of the Old Gods", false, "Blood Warriors", 3, 0, abilities.BloodWarriors, false, false, ais.BloodWarriors, BloodWarriors, 36);
};

// MINIONS

// Basic

// Commons

// Rares

var AncientShieldbearer = module.exports.AncientShieldbearer = function() {
    var card = utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", false, "Ancient Shieldbearer", 7, 0, 6, 6, battlecries.AncientShieldbearer, false, false, [effects.sickness], ais.KlaxxiAmberWeaver, AncientShieldbearer);
    card["cult"] = "C'Thun";
    return card;
};

var FrothingBerserker = module.exports.FrothingBerserker = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Frothing Berserker", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.FrothingBerserker], ais.FrothingBerserker, FrothingBerserker, 87);
};

// Epics

// Legendaries

// ROGUE CARDS

// WEAPONS

// Basic

var WickedKnife = module.exports.WickedKnife = function() {
    return utilities.makeWeapon("Basic", "Basic", "Wicked Knife", 2, 0, 1, 2, false, false, false, [], ais.MurlocRaider, WickedKnife, 50);
};

// Commons

// Rares

// Epics

// SPELLS

// Basic

var Backstab = module.exports.Backstab = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Backstab", 0, 0, abilities.Backstab, targetais.Backstab, filters.Backstab, ais.Backstab, Backstab, 89);
};

var FanofKnives = module.exports.FanofKnives = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Fan of Knives", 3, 0, abilities.FanofKnives, false, false, ais.FanofKnives, FanofKnives, 69);
};

var Sap = module.exports.Sap = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Sap", 2, 0, abilities.Sap, targetais.Sap, filters.minion, ais.Sap, Sap, 79);
};

var Shiv = module.exports.Shiv = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Shiv", 2, 0, abilities.Shiv, targetais.Shiv, filters.any, ais.Shiv, Shiv, 56);
};

var Sprint = module.exports.Sprint = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Sprint", 7, 0, abilities.Sprint, false, false, ais.Sprint, Sprint, 57);
};

// Commons

// Rares

// Epics

// MINIONS

// Basic

// Commons

var AnubarAmbusher = module.exports.AnubarAmbusher = function() {
    return utilities.makeMinion(false, "Naxxramas", "Common", false, "Anub'ar Ambusher", 4, 0, 5, 5, false, false, false,
    [effects.sickness, deathrattles.AnubarAmbusher_Deathrattle], ais.MurlocRaider, AnubarAmbusher, 56);
};

// Rares

var IronSensei = module.exports.IronSensei = function() {
    return utilities.makeMinion("Mech", "Goblins vs Gnomes", "Rare", false, "Iron Sensei", 3, 0, 2, 2, false, false, false,
    [effects.sickness, effects.IronSensei], ais.IronSensei, IronSensei, 40);
};

// Epics

// Legendaries

// SHAMAN CARDS

// SPELLS

// Basic

// Commons

var Crackle = module.exports.Crackle = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", false, "Crackle", 2, 1, abilities.Crackle, targetais.Crackle, filters.any, ais.Crackle, Crackle, 67);
};

var ForkedLightning = module.exports.ForkedLightning = function() {
    return utilities.makeSpell("Common", "Classic", false, "Forked Lightning", 1, 1, abilities.ForkedLightning, false, false, ais.ForkedLightning, ForkedLightning, 59);
};

// Rares

var FeralSpirit = module.exports.FeralSpirit = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Feral Spirit", 3, 2, abilities.FeralSpirit, false, false, ais.FeralSpirit, FeralSpirit, 78);
};

var LavaBurst = module.exports.LavaBurst = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Lava Burst", 3, 2, abilities.LavaBurst, targetais.LavaBurst, filters.any, ais.LavaBurst, LavaBurst, 59);
};

// Epics

// MINIONS

// Basic

// Commons

var UnboundElemental = module.exports.UnboundElemental = function() {
    return utilities.makeMinion(false, "Common", "Classic", false, "Unbound Elemental", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.UnboundElemental], ais.UnboundElemental, UnboundElemental, 57);
};

var WhirlingZapoMatic = module.exports.WhirlingZapoMatic = function() {
    return utilities.makeMinion("Mech", "Common", "Goblins vs Gnomes", false, "Whirling Zap-o-Matic", 2, 0, 2, 3, false, false, false,
    [effects.sickness, effects.sickness, effects.windfury], ais.WhirlingZapoMatic, WhirlingZapoMatic, 65);
};

// Rares

// Epics

// Legendaries

var AlAkirtheWindlord = module.exports.AlAkirtheWindlord = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Al'Akir the Windlord", 8, 0, 5, 3, false, false, false, [effects.windfury, effects.divineshield,
    effects.taunt], ais.AlAkirtheWindlord, AlAkirtheWindlord, 83);
};

// HUNTER CARDS

// SPELLS

// Basic

var ArcaneShot = module.exports.ArcaneShot = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Arcane Shot", 1, 0, abilities.ArcaneShot, targetais.ArcaneShot, filters.any, ais.ArcaneShot, ArcaneShot, 62);
};

var AnimalCompanion = module.exports.AnimalCompanion = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Animal Companion", 3, 0, abilities.AnimalCompanion, false, false, ais.AnimalCompanion, AnimalCompanion, 88);
};

var DeadlyShot = module.exports.DeadlyShot = function() {
    return utilities.makeSpell("Common", "Classic", false, "Deadly Shot", 3, 0, abilities.DeadlyShot, false, false, ais.DeadlyShot, DeadlyShot, 74);
};

var HuntersMark = module.exports.HuntersMark = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Hunter's Mark", 1, 0, abilities.HuntersMark, targetais.HuntersMark, filters.minion, ais.HuntersMark, HuntersMark, 65);
};

var MultiShot = module.exports.MultiShot = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Multi-Shot", 4, 0, abilities.MultiShot, false, false, ais.MultiShot, MultiShot, 59);
};

// Commons

var CobraShot = module.exports.CobraShot = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", false, "Cobra Shot", 5, 0, abilities.CobraShot, targetais.CobraShot, filters.minion, ais.CobraShot, CobraShot, 39);
};

var UnleashTheHounds = module.exports.UnleashTheHounds = function() {
    return utilities.makeSpell("Common", "Classic", false, "Unleash the Hounds", 2, 0, abilities.UnleashTheHounds, false, false, ais.UnleashTheHounds, UnleashTheHounds, 84);
};

// Rares

var ExplosiveShot = module.exports.ExplosiveShot = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Explosive Shot", 5, 0, abilities.ExplosiveShot, targetais.ExplosiveShot, filters.minion, ais.ExplosiveShot, ExplosiveShot, 80);
};

// Epics

// MINIONS

// Basic

// Commons

var KingsElekk = module.exports.KingsElekk = function() {
    return utilities.makeMinion("Beast", "Common", "The Grand Tournament", false, "King's Elekk", 2, 0, 2, 3, battlecries.KingsElekk,
    false, false, [effects.sickness], ais.KingsElekk, KingsElekk, 73);
};

var Webspinner = module.exports.Webspinner = function() {
    return utilities.makeMinion("Beast", "Common", "Naxxramas", false, "Webspinner", 1, 0, 1, 1, false, false, false,
    [effects.sickness, deathrattles.Webspinner_Deathrattle], ais.Webspinner, Webspinner, 76);
};

// Rares

var CoreRager = module.exports.CoreRager = function() {
    return utilities.makeMinion("Beast", "Rare", "Blackrock Mountain", false, "Core Rager", 4, 0, 4, 4, battlecries.CoreRager, false,
    false, [effects.sickness], ais.CoreRager, CoreRager, 50);
};

// Epics

var GiantSandworm = module.exports.GiantSandworm = function() {
    return utilities.makeMinion("Beast", "Epic", "Whispers of the Old Gods", false, "Giant Sandworm", 8, 0, 8, 8, false, false, false, [effects.sickness, effects.GiantSandworm], ais.MurlocRaider, GiantSandworm, 70);
};

// Legendaries

var Gahzrilla = module.exports.Gahzrilla = function() {
    return utilities.makeMinion("Beast", "Legendary", "Goblins vs Gnomes", false, "Gahz'rilla", 7, 0, 9, 6, false, false, false,
    [effects.sickness, effects.Gahzrilla], ais.Gahzrilla, Gahzrilla, 75);
};

var KingKrush = module.exports.KingKrush = function() {
    return utilities.makeMinion("Beast", "Legendary", "Classic", false, "King Krush", 9, 0, 8, 8,
    false, false, false, [], false, ais.KingKrush, KingKrush, 84);
};

// DRUID CARDS

// SPELLS

// Basic

var Innervate = module.exports.Innervate = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Innervate", 0, 0, abilities.Innervate, false, false, ais.Innervate, Innervate, 64);
};

var Moonfire = module.exports.Moonfire = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Moonfire", 0, 0, abilities.Moonfire, targetais.Moonfire, filters.any, ais.Moonfire, Moonfire, 50);
};

var Swipe = module.exports.Swipe = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Swipe", 4, 0, abilities.Swipe, targetais.Swipe, filters.any, ais.Swipe, Swipe, 96);
};

// Commons

// Rares

// Epics

var TreeofLife = module.exports.TreeofLife = function() {
    return utilities.makeSpell("Epic", "Goblins vs Gnomes", false, "Tree of Life", 9, 0, abilities.TreeofLife, false, false, ais.TreeofLife, TreeofLife, 10);
};

// MINIONS

// Basic

// Commons

var DruidoftheFlame = module.exports.DruidoftheFlame = function() {
    return utilities.makeMinion(false, "Common", "Blackrock Mountain", false, "Druid of the Flame", 3, 0, 2, 2, battlecries.DruidoftheFlame, false,
    false, [effects.sickness], ais.DruidoftheFlame, DruidoftheFlame, 67);
};

// Rares

var KlaxxiAmberWeaver = module.exports.KlaxxiAmberWeaver = function() {
    var card = utilities.makeMinion(false, "Rare", "Whispers of the Old Gods", false, "Klaxxi Amber-Weaver", 4, 0, 5, 4, battlecries.KlaxxiAmberWeaver, false, false,
    [effects.sickness], ais.KlaxxiAmberWeaver, KlaxxiAmberWeaver);
    card["cult"] = "C'Thun";
    return card;
};

// Epics

// Legendaries

var Cenarius = module.exports.Cenarius = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Cenarius", 9, 0, 8, 5, battlecries.Cenarius, false,
    false, [effects.sickness], ais.Cenarius, Cenarius, 91);
};

var Malorne = module.exports.Malorne = function() {
    return utilities.makeMinion("Beast", "Legendary", "Goblins vs Gnomes", false, "Malorne", 7, 0, 7, 9, false, false, false,
    [effects.sickness, deathrattles.Malorne_Deathrattle], ais.Malorne, Malorne, 64);
};

// WARLOCK CARDS

// SPELLS

// Basic

var MortalCoil = module.exports.MortalCoil = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Mortal Coil", 1, 0, abilities.MortalCoil, targetais.MortalCoil, filters.minion, ais.MortalCoil, MortalCoil, 82);
};

var ShadowBolt = module.exports.ShadowBolt = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Shadow Bolt", 3, 0, abilities.ShadowBolt, targetais.ShadowBolt, filters.minion, ais.ShadowBolt, ShadowBolt, 64);
};

// Commons

var Darkbomb = module.exports.Darkbomb = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", false, "Darkbomb", 2, 0, abilities.Darkbomb, targetais.Darkbomb, filters.any, ais.Darkbomb, Darkbomb, 76);
};

// Rares

var Shadowflame = module.exports.Shadowflame = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Shadowflame", 4, 0, abilities.Shadowflame, targetais.Shadowflame, filters.allyMinion, ais.Shadowflame, Shadowflame, 78);
};

// Epics

// MINIONS

// Basic

var Succubus = module.exports.Succubus = function() {
    return utilities.makeMinion("Demon", "Basic", "Basic", false, "Succubus", 2, 0, 3, 4, battlecries.Succubus, false, false, [effects.sickness], ais.Succubus, Succubus, 32);
};

var Voidwalker = module.exports.Voidwalker = function() {
    return utilities.makeMinion("Demon", "Basic", "Basic", false, "Voidwalker", 1, 0, 3, 1, false, false, false,
    [effects.sickness, effects.taunt], ais.Voidwalker, Voidwalker, 71);
};

// Commons

// Rares

// Epics

// Legendaries

var LordJaraxxus = module.exports.LordJaraxxus = function() {
    return utilities.makeMinion("Demon", "Legendary", "Classic", false, "Lord Jaraxxus", 9, 0, 15, 3, battlecries.LordJaraxxus, false,
    false, [effects.sickness], ais.LordJaraxxus, LordJaraxxus, 67);
};

var MalGanis = module.exports.MalGanis = function() {
    return utilities.makeMinion("Demon", "Legendary", "Goblins vs Gnomes", false, "Mal'Ganis", 9, 0, 7, 9, false, false, false,
    [effects.sickness, effects.MalGanisBuffHp, effects.MalGanisBuffDamage,
    effects.MalGanisImmune], ais.MalGanis, MalGanis, 91);
};

// PALADIN CARDS

// SPELLS

// Basic

var BlessingofKings = module.exports.BlessingofKings = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Blessing of Kings", 4, 0, abilities.BlessingofKings,
    targetais.BlessingofKings, filters.minion, ais.BlessingofKings, BlessingofKings, 80);
};

var HammerofWrath = module.exports.HammerofWrath = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Hammer of Wrath", 4, 0, abilities.HammerofWrath, targetais.HammerofWrath, filters.any, ais.HammerofWrath, HammerofWrath, 67);
};

// Commons

var StandAgainstDarkness = module.exports.StandAgainstDarkness = function() {
    return utilities.makeSpell("Common", "Whispers of the Old Gods", false, "Stand Against Darkness", 5, 0, abilities.StandAgainstDarkness, false, false, ais.StandAgainstDarkness, StandAgainstDarkness, 49);
};

// Rares

var Equality = module.exports.Equality = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Equality", 2, 0, abilities.Equality, false, false, ais.Equality, Equality, 63);
};

// Epics

var AvengingWrath = module.exports.AvengingWrath = function() {
    return utilities.makeSpell("Epic", "Classic", false, "Avenging Wrath", 6, 0, abilities.AvengingWrath, false, false, ais.AvengingWrath, AvengingWrath, 57);
};

// MINIONS

// Basic

var GuardianofKings = module.exports.GuardianofKings = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Guardian of Kings", 7, 0, 6, 5, battlecries.GuardianofKings, false,
    false, [effects.sickness], ais.GuardianofKings, GuardianofKings, 55);
};

// Commons

var MurlocKnight = module.exports.MurlocKnight = function() {
    return utilities.makeMinion("Murloc", "Rare", "The Grand Tournament", false, "Murloc Knight", 4, 0, 4, 3, false, false, false,
    [effects.sickness, inspires.MurlocKnight_Inspire], ais.MurlocKnight, MurlocKnight, 86);
};

var WarhorseTrainer = module.exports.WarhorseTrainer = function() {
    return utilities.makeMinion(false, "Common", "The Grand Tournament", false, "Warhorse Trainer", 3, 0, 4, 2, false, false, false,
    [effects.sickness, effects.WarhorseTrainer], ais.WarhorseTrainer, WarhorseTrainer, 52);
};

// Rares

var AldorPeacekeeper = module.exports.AldorPeacekeeper = function() {
    return utilities.makeMinion(false, "Rare", "Classic", false, "Aldor Peacekeeper", 3, 0, 3, 3, battlecries.AldorPeacekeeper,
    targetais.AldorPeacekeeper, filters.minion, [effects.sickness], ais.AldorPeacekeeper, AldorPeacekeeper, 96);
};

// Epics

// Legendaries

var BolvarFordragon = module.exports.BolvarFordragon = function() {
    return utilities.makeMinion(false, "Legendary", "Goblins vs Gnomes", false, "Bolvar Fordragon", 5, 0, 7, 1, false, false, false,
    [effects.BolvarFordragon, effects.sickness], ais.BolvarFordragon, BolvarFordragon, 55);
};

var TirionFordring = module.exports.TirionFordring = function() {
    return utilities.makeMinion(false, "Legendary", "Classic", false, "Tirion Fordring", 8, 0, 6, 6, false, false, false,
    [effects.sickness, effects.divineshield, effects.taunt, deathrattles.TirionFordring_Deathrattle], ais.TirionFordring, TirionFordring, 121);
};

// PRIEST CARDS

// SPELLS

// Basic

var HolySmite = module.exports.HolySmite = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Holy Smite", 1, 0, abilities.HolySmite, targetais.ArcaneShot, filters.any, ais.ArcaneShot, HolySmite, 63);
};

var ShadowWordDeath = module.exports.ShadowWordDeath = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Shadow Word: Death", 3, 0, abilities.ShadowWordDeath, 
    targetais.ShadowWordDeath, filters.ShadowWordDeath, ais.ShadowWordDeath, ShadowWordDeath, 88);
};

var ShadowWordPain = module.exports.ShadowWordPain = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Shadow Word: Pain", 2, 0, abilities.ShadowWordPain, 
    targetais.ShadowWordPain, filters.ShadowWordPain, ais.ShadowWordPain, ShadowWordPain, 71);
};

var HolyNova = module.exports.HolyNova = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Holy Nova", 5, 0, abilities.HolyNova, false, false, ais.HolyNova, HolyNova, 87);
};

var PowerWordShield = module.exports.PowerWordShield = function() {
    return utilities.makeSpell("Basic", "Basic", false, "Power Word: Shield", 1, 0, abilities.PowerWordShield,
    targetais.PowerWordShield, filters.minion, ais.PowerWordShield, PowerWordShield, 90);
};

// Commons

var Entomb = module.exports.Entomb = function() {
    return utilities.makeSpell("Common", "League of Explorers", false, "Entomb", 6, 0, abilities.Entomb, targetais.Entomb, filters.enemyMinion, ais.Entomb, Entomb, 65);
};

var VelensChosen = module.exports.VelensChosen = function() {
    return utilities.makeSpell("Common", "Goblins vs Gnomes", false, "Velen's Chosen", 3, 0, abilities.VelensChosen, 
    targetais.VelensChosen, filters.minion, ais.VelensChosen, VelensChosen, 85);
};

// Rares

var HolyFire = module.exports.HolyFire = function() {
    return utilities.makeSpell("Rare", "Classic", false, "Holy Fire", 6, 0, abilities.HolyFire, targetais.Fireball, filters.any, ais.Fireball, HolyFire, 59);
};

var Resurrect = module.exports.Resurrect = function() {
    return utilities.makeSpell("Rare", "Blackrock Mountain", false, "Resurrect", 2, 0, abilities.Resurrect, false, false, ais.Resurrect, Resurrect, 53);
};

// Epics

var Shadowform = module.exports.Shadowform = function() {
    return utilities.makeSpell("Epic", "Classic", false, "Shadowform", 3, 0, abilities.Shadowform, false, false, ais.true, Shadowform, 48);
};

// MINIONS

// Basic

var NorthshireCleric = module.exports.NorthshireCleric = function() {
    return utilities.makeMinion(false, "Basic", "Basic", false, "Northshire Cleric", 1, 0, 3, 1, false, false, false,
    [effects.sickness, effects.NorthshireCleric], ais.NorthshireCleric, NorthshireCleric, 83);
};

// Commons

var TwilightWhelp = module.exports.TwilightWhelp = function() {
    return utilities.makeMinion("Dragon", "Common", "Blackrock Mountain", false, "Twilight Whelp", 1, 0, 1, 2, battlecries.TwilightWhelp, false, false, [effects.sickness], ais.TwilightWhelp, TwilightWhelp, 39);
};

var DarkCultist = module.exports.DarkCultist = function() {
    return utilities.makeMinion(false, "Common", "Naxxramas", false, "Dark Cultist", 3, 0, 4, 3, false, false, false, [deathrattles.DarkCultist_Deathrattle], ais.DarkCultist, DarkCultist, 90);
};

// Rares

var WyrmrestAgent = module.exports.WyrmrestAgent = function() {
    return utilities.makeMinion(false, "Rare", "The Grand Tournament", false, "Wyrmrest Agent", 2, 0, 4, 1, battlecries.WyrmrestAgent, false, false, [effects.sickness], ais.TwilightWhelp, WyrmrestAgent, 42);
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
    return utilities.makeMinion(false, "Rare", "Icecrown Citadel", false, "Skybreaker Sorcerer", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.C_SkybreakerSorcerer], ais.true, C_SkybreakerSorcerer);
};

var C_CultAdherent = module.exports.C_CultAdherent = function() {
    return utilities.makeMinion(false, "Rare", "Uncollectible", false, "Cult Adherent", 3, 0, 3, 3, false, false, false, [effects.sickness, effects.C_CultAdherent], ais.C_CultAdherent, C_CultAdherent);
};

var C_ManaSear = module.exports.C_ManaSear = function() {
    return utilities.makeSpell("Rare", "Icecrown Citadel", false, "Mana Sear", 3, 0, abilities.C_ManaSear, targetais.C_ManaSear, filters.any, ais.C_ManaSear, C_ManaSear);
};

// Epics

// Legendaries

// Boss Cards

var C_DarkEmpowerment = module.exports.C_DarkEmpowerment = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Dark Empowerment", 1, 0, abilities.C_DarkEmpowerment,
    targetais.C_DarkEmpowerment, filters.Deathwhisper_DarkEmpowerment, ais.C_DarkEmpowerment, C_DarkEmpowerment);
};

var C_CultFanatic_Normal = module.exports.C_CultFanatic_Normal = function() {
    return utilities.makeMinion(false, "Boss", "Uncollectible", false, "Cult Fanatic", 3, 0, 3, 5, false, false, false, [effects.sickness], ais.C_CultFanatic, C_CultFanatic_Normal);
};

var C_DarkTransformation = module.exports.C_DarkTransformation = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Dark Transformation", 1, 0, abilities.C_DarkTransformation,
    targetais.C_DarkTransformation, filters.Deathwhisper_DarkTransformation, ais.C_DarkTransformation, C_DarkTransformation);
};

var C_CannonBlast = module.exports.C_CannonBlast = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Cannon Blast", 1, 0, abilities.C_CannonBlast, targetais.C_CannonBlast, filters.any, ais.C_CannonBlast, C_CannonBlast);
};

var C_IncineratingBlast = module.exports.C_IncineratingBlast = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Incinerating Blast", 3, 0, abilities.C_IncineratingBlast, targetais.Swipe, filters.any, ais.C_IncineratingBlast, C_IncineratingBlast);
};

var C_Fortify = module.exports.C_Fortify = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Fortify", 2, 0, abilities.C_Fortify, false, false, ais.true, C_Fortify);
};

var C_Repairs = module.exports.C_Repairs = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Repairs", 2, 0, abilities.C_Repairs, false, false, ais.C_Repairs, C_Repairs);
};

var C_Reload = module.exports.C_Reload = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Reload", 4, 0, abilities.C_Reload, false, false, ais.true, C_Reload);
};

var C_BoardingParty = module.exports.C_BoardingParty = function() {
    return utilities.makeSpell("Boss", "Uncollectible", false, "Boarding Party", 3, 0, abilities.C_BoardingParty, false, false, ais.true, C_BoardingParty);
};