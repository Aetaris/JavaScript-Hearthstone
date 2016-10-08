var abilities = require('./abilities.js');
var decks = require('./decks.js');
var ais = require('./AIs.js');
var cardLists = require('./cardlists.js');
var effects = require('./effects.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');

var mage = module.exports.mage = function() {
    return {
        name: "Mage",
        type: "basic", tier: 1,
        ability: abilities.MageFireblast,
        targetai: targetais.MageFireblast,
        deck: decks.basicMimiron(),
        ai: ais.MageFireblast, filter: filters.any,
        cardList: cardLists.mage,
        cost: 2, hp: 30, armor: 0
    };
};

var warrior = function() {
    return {
    name: "Warrior",
    type: "basic", tier: 5,
    ability: abilities.WarriorArmorUp,
    deck: decks.basicWarrior(),
    ai: ais.WarriorArmorUp, filter: false,
    cardList: cardLists.warrior,
    cost: 2, hp: 30, armor: 0
    };
};

var rogue = function() {
    return {
    name: "Rogue",
    type: "basic", tier: 2,
    ability: abilities.RogueWickedKnife,
    deck: decks.basicRogue(),
    ai: ais.RogueWickedKnife, filter: false,
    cardList: cardLists.rogue,
    cost: 2, hp: 30, armor: 0
    };
};

var shaman = function() {
    return {
    name: "Shaman",
    type: "basic", tier: 7,
    ability: abilities.ShamanTotemicCall,
    deck: decks.basicShaman(),
    ai: ais.ShamanTotemicCall, filter: false,
    cardList: cardLists.shaman,
    cost: 2, hp: 30, armor: 0
    };
};

var hunter = function() {
    return {
    name: "Hunter",
    type: "basic", tier: 8,
    ability: abilities.HunterSteadyShot,
    deck: decks.basicHunter(),
    ai: ais.HunterSteadyShot, filter: false,
    cardList: cardLists.hunter,
    cost: 2, hp: 30, armor: 0
    };
};

var druid = module.exports.druid = function() {
    return {
    name: "Druid",
    type: "basic", tier: 4,
    ability: abilities.DruidShapeshift,
    deck: decks.basicDruid(),
    ai: ais.DruidShapeshift, filter: false,
    cardList: cardLists.druid,
    cost: 2, hp: 30, armor: 0
    };
};

var warlock = module.exports.warlock = function() {
    return {
    name: "Warlock",
    type: "basic", tier: 6,
    ability: abilities.WarlockLifeTap,
    deck: decks.basicWarlock(),
    ai: ais.WarlockSiphonSoul, filter: false,
    cardList: cardLists.warlock,
    cost: 2, hp: 30, armor: 0
    };
};

var paladin = function() {
    return {
    name: "Paladin",
    type: "basic", tier: 3,
    ability: abilities.PaladinReinforce,
    deck: decks.basicPaladin(),
    ai: ais.PaladinReinforce, filter: false,
    cardList: cardLists.paladin,
    cost: 2, hp: 30, armor: 0
    };
};

var priest = module.exports.priest = function() {
    return {
    name: "Priest",
    type: "basic", tier: 9,
    ability: abilities.PriestLesserHeal,
    targetai: targetais.PriestLesserHeal,
    deck: decks.basicPriest(),
    ai: ais.PriestLesserHeal, filter: filters.any,
    cardList: cardLists.priest,
    cost: 2, hp: 30, armor: 0
    };
};

module.exports.HeroList = [
    mage,
    warrior,
    rogue,
    shaman,
    hunter,
    druid,
    warlock,
    paladin,
    priest,
];

module.exports.LordJaraxxus = function() {
    return {
    name: "Lord Jaraxxus",
    type: "minion",
    ability: abilities.LordJaraxxusInferno,
    deck: decks.basicWarlock(),
    ai: ais.MageFireblast,
    cardList: cardLists.warlock,
    cost: 2,
    hp: 15,
    armor: 0
    };
};

module.exports.anubrekhan = function() {
    return {
    name: "Anub'Rekhan",
    type: "naxxramas",
    ability: abilities.AnubRekhanSkitter,
    deck: decks.AnubRekhan(),
    ai: ais.AnubRekhanSkitter,
    cost: 2,
    hp: 30,
    armor: 0
    };
};

module.exports.anubrekhan_heroic = function() {
    return {
    name: "Anub'Rekhan [Heroic]",
    type: "naxxramas",
    heroic: true,
    ability: abilities.AnubRekhanSkitter_Heroic,
    deck: decks.AnubRekhan(),
    ai: ais.AnubRekhanSkitter,
    cost: 2,
    hp: 45,
    armor: 0
    };
};

module.exports.grandwidowfaerlina = function() {
    return {
    name: "Grand Widow Faerlina",
    type: "naxxramas",
    ability: abilities.GrandWidowFaerlinaRainofFire,
    deck: decks.GrandWidowFaerlina(),
    ai: ais.GrandWidowFaerlinaRainofFire,
    cost: 2,
    hp: 30,
    armor: 0
    };
};

module.exports.grandwidowfaerlina_heroic = function() {
    return {
    name: "Grand Widow Faerlina [Heroic]",
    type: "naxxramas",
    ability: abilities.GrandWidowFaerlinaRainofFire,
    deck: decks.GrandWidowFaerlina_Heroic(),
    ai: ais.GrandWidowFaerlinaRainofFire,
    cost: 1,
    hp: 45,
    armor: 0
    };
};

// Custom Sets

module.exports.LadyDeathwhisper_Normal = function() {
    return {
        name: "Lady Deathwhisper",
        type: "icecrown",
        ability: {type: "passive", action: C_LadyDeathwhisper_Action},
        deck: decks.C_LadyDeathwhisper_Normal(),
        ai: false,
        cost: 0,
        hp: 12,
        armor: 0
    };
};

module.exports.LordMarrowgar_Normal = function() {
    return {
        name: "Lord Marrowgar",
        type: "icecrown",
        ability: abilities.C_LordMarrowgarBSG_Normal,
        deck: decks.C_LordMarrowgar_Normal(),
        ai: ais.LordMarrowgarBSG,
        cost: 2,
        hp: 30,
        armor: 0
    };
};

var C_LadyDeathwhisper_Action = function(player) {
    player.addEffect(effects.C_LadyDeathwhisper);
    player.maxMana = 5;
};

module.exports.C_OrgrimsHammer_Heroic = function() {
    return {
        name: "Orgrim's Hammer",
        type: "icecrown",
        ability: abilities.C_GunshipBattle,
        deck: decks.C_OrgrimsHammer_Heroic(),
        ai: ais.true,
        cost: 1,
        hp: 45,
        armor: 45
    };
};

module.exports.C_Skybreaker_Heroic = function() {
    return {
        name: "Skybreaker",
        type: "icecrown",
        ability: abilities.C_GunshipBattle,
        deck: decks.C_Skybreaker_Heroic(),
        ai: ais.true,
        cost: 1,
        hp: 45,
        armor: 45
    };
};