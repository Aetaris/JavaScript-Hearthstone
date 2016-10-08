var heroes = require('./heroes.js');
var abilities = require('./abilities.js');
var cards = require('./cards.js');
var printer = require('./printer.js');
var setup = require('./setup.js');
var effects = require('./effects.js');
var utilities = require('./utilities.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');

var scenarios = [];

var red;
var blue;

module.exports.setAdventureHero = function(player, hero) {
    setup.setHero(player, hero);
    if(hero === heroes.anubrekhan) {
        printer.print("KEL'THUZAD: Anub'Rekhan is one of my finest Spider Lords. Good luck, interloper.");
        player.startTaunt = "Welcome to my parlor.";
        player.defeatTaunt = "Why... oh... why?";
        player.lossMessage = "KEL'THUZAD: NOOO!!! I mean... irrelevant. You'll never defeat the Grand Widow.";
        player.nextHero = heroes.grandwidowfaerlina;
    }
    if(hero === heroes.grandwidowfaerlina) {
        printer.print("KEL'THUZAD: Faerlina is training acolytes to worship me. Her job is VERY IMPORTANT; do not disturb her!");
        player.startTaunt = "My acolytes serve me without question!";
        player.defeatTaunt = "The master will avenge me!";
        player.lossMessage = "KEL'THUZAD: Faerlina means nothing. The Spider Queen will dispatch you EASILY.";
    }
    if(hero === heroes.maexxna) {
        printer.print("KEL'THUZAD: Maexxna is a GIANT SPIDER! MUAHAHAHA!");
        player.startTaunt = "<hissing>";
        player.defeatTaunt = "<hissing>";
        player.lossMessage = "KEL'THUZAD: Impossible! This is not over, PUNY MORTAL!";
    }

    if(hero === heroes.LadyDeathwhisper_Normal || hero === heroes.LadyDeathwhisper_Heroic) {
        printer.print("ARTHAS MENETHIL: Lady Deathwhisper... Supreme Overseer of the Cult of the Damned... this is a foe you will not defeat.");
        player.taunts.start = "What is this disturbance?!";
        player.taunts.heropower = false;
        player.taunts.custom1 = "Take this blessing and show these intruders a taste of our master's power.";
        player.taunts.custom2 = "I release you from the curse of flesh!";
        player.taunts.victory = "Embrace the darkness... darkness eternal!";
        player.taunts.defeat = "All part of the master's plan! Your end is... inevitable!";
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++

module.exports.setScenario = function(scenario, red, blue) {
    // more to be added
    
    scenarios.push(scenario);
    
    red = red;
    blue = blue;
    
    return scenario;
};

module.exports.Zakazj = function() {
    return utilities.withEffects({
        name: "Zakazj the Corruptor",
        startOfMatch: {
            line: "Zakazj the Corruptor: I will feast upon your souls!",
            greeting: Zakazj_greeting,
            action: Zakazj_action
        },
        endOfMatch: {
            line: "Zakazj the Corruptor: No... after so long, only to fall again...",
            victory: "Zakazj the Corruptor: None can stand against the Black Empire!",
            action: endMatch
        },
        abilities: [SummonTentacles, VoidBurst, Forgetfulness, InduceMadness, GrowingMadness],
        
        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: false,
        coop: true,
        
        type: "hero",
        color: "Void",
        hero: {},
        baseHp: 125,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [],

        getMaxHp: function() {
            return utilities.genMaxHp(this);
        },
        getHp: function() {
            return utilities.genHp(this);
        },
        getMaxDamage: function() {
            return utilities.genMaxDamage(this);
        },
        getDamage: function() {
            return utilities.genDamage(this);
        }
    });
};

var Zakazj_action = function(red, blue, self) {
    // red.effects.push(effects.immune);
    // blue.effects.push(effects.immune);
    
    printer.print("");
    printer.print("The remnants of Tyr's light, swirling through Tirisfal Glades, fill both players, empowering them and reducing the cost of all their cards by (1).");
    for(var i = 0; i < red.deck.length; i++) {
        red.deck[i].cost -= 1;
    }
    for(var i = 0; i < blue.deck.length; i++) {
        blue.deck[i].cost -= 1;
    }
    red.baseHp += 30;
    blue.baseHp += 30;
    printer.print("");
    
    SummonTentacles(red, blue, self);
};

var Zakazj_greeting = function(player) {
    if(player.hero.name == "Mage") {
        printer.print("Zakazj the Corruptor: You possess great arcane power, mage. Use it to your own ends.");
    }
    else if(player.hero.name == "Warrior") {
        printer.print("Zakazj the Corruptor: With your raw strength you could rule this world, not serve it.");
    }
    else if(player.hero.name == "Rogue") {
        printer.print("Zakazj the Corruptor: You could serve us well, shadow-stalker.");
    }
    else if(player.hero.name == "Shaman") {
        printer.print("Zakazj the Corruptor: We have subdued the elemental lords themselves. You are an insect next to them...");
    }
    else if(player.hero.name == "Hunter") {
        printer.print("Zakazj the Corruptor: The hunter... is now the hunted.");
    }
    else if(player.hero.name == "Druid") {
        printer.print("Zakazj the Corruptor: Child of Cenarius... have you visited the Dream lately? It will soon be ours...");
    }
    else if(player.hero.name == "Paladin") {
        printer.print("Zakazj the Corruptor: Pure of heart, strong of will. We'll see about that.");
    }
    else if(player.hero.name == "Warlock") {
        printer.print("Zakazj the Corruptor: Betray your companion, wielder of fel, as I know you so long to do...");
    }
    else if(player.hero.name == "Priest") {
        printer.print("Zakazj the Corruptor: Your 'Light' cannot save you, priest.");
    }
    else {
        printer.print("Zakazj the Corruptor: You... what manner of being are you?");
    }
};

var endMatch = function(red, blue, self) {
    red.damageTaken = 10000;
    red.armor = 0;
    red.minions = [];
    red.hand = [];
    blue.damageTaken = 10000;
    red.armor = 0;
    blue.minions = [];
    blue.hand = [];
};

var SummonTentacles = function(red, blue, self) {;
    printer.print("" + self.name + " summons two powerful Tentacles with Taunt under his control.");
    for(var i = 0; i < 2; i++) {
        utilities.summon(Tentacle(self, self), self, {player: self, foe: red});
    }
    
    attackWave(red, blue, self);
};

var VoidBurst = function(red, blue, self) {
    printer.print("" + self.name + ": The void cleanses.");
    printer.print("" + self.name + " releases a blast of energy dealing 3 damage to all enemy minions.");
    
    for(var i = 0; i < red.minions.length; i++) {
        utilities.dealDamage(red.minions[i], 3, { player: red, foe: blue, cause: red });
    }
    for(i = 0; i < blue.minions.length; i++) {
        utilities.dealDamage(blue.minions[i], 3, { player: blue, foe: red, cause: red });
    }
    
    attackWave(red, blue, self);
};

var Forgetfulness = function(red, blue, self) {
    var target = Math.random() > 0.5 && red.hand.length > 0 ? red : blue.hand.length > 0 ? blue : false;
    if(target) {
        printer.print("" + self.name + ": " + target.name + ". Do you feel your concentration waver?");
        if(!target.madness) {
            target["madness"] = 0;
        }
        for(var i = 0; i < target.madness + 1; i++) {
            if(target.hand[target.hand.length - 1]) {
                var message = self.name + " drives " + target.color + " " + target.name + " towards insanity, discarding " +
                target.hand[target.hand.length - 1].name + " from their hand";
                if(target.hand[target.hand.length - 1].cost > 0) {
                    message = message + " and dealing " + target.hand[target.hand.length - 1].cost + " damage to them";
                }
                message = message + ".";
                
                printer.print(message);
                
                utilities.dealDamage(target, target.hand[target.hand.length - 1].cost, {player: self, foe: target, cause: self});
                target.hand.splice(target.hand.length - 1, 1);
            }
        }
    }
    else {
        InduceMadness(red, blue, self);
    }
    
    attackWave(red, blue, self);
};

var InduceMadness = function(red, blue, self) {
    var target = Math.random() > 0.5 && red.hand.length > 0 ? red : blue.hand.length > 0 ? blue : false;
    if(target) {
        var randomCard = target.hand[Math.floor(Math.random() * target.hand.length)];
        printer.print("" + self.name + ": " + target.name + ". You will be ours.");
        printer.print(self.name + " transforms the " + randomCard.name + " in the " + target.color + " " + target.name + "'s hand into a Shadow Armor.");
        target.hand[target.hand.indexOf(randomCard)] = ShadowArmor();
        
        attackWave(red, blue, self);
    }
    else {
        VoidBurst(red, blue, self);
    }
};

var GrowingMadness = function(red, blue, self) {
    printer.print("" + self.name + ": How long can you fight your own mind?");
    printer.print(self.name + " shuffles 5 copies of Shadow Armor into each player's deck.");
    for(var i = 0; i < 5; i++) {
        red.deck.push(ShadowArmor());
        blue.deck.push(ShadowArmor());
    }
    utilities.shuffle(red.deck);
    utilities.shuffle(blue.deck);
    
    attackWave(red, blue, self);
};

var Tentacle = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Void", "Tentacle", 2, 0, 5, 2, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Tentacle);
    minion["scenario"] = creator;
    return minion;
};

var ShadowArmor = function() {
    return utilities.makeSpell("Boss", "Custom", false, "Shadow Armor", 2, 0, ShadowArmorSpell, false, false, ais.true, ShadowArmor);
};

var ShadowArmorSpell = function(target, context) {
    printer.print(context.player.color + " " + context.player.name + " casts Shadow Armor, shielding themselves with dark energy to gain 20 Armor.");
    var hasZakazj = false;
    context.player.armor += 20;
    for(var i = 0; i < scenarios.length; i++) {
        if(scenarios[i].name == "Zakazj the Corruptor") {
            var randomNum = Math.floor(Math.random() * 4) + 1;
            if(context.player.madness && context.player.madness == 4) {
                printer.print("" + scenarios[i].name + ": You are ours now.");
            } else if(randomNum == 1) {
                printer.print("" + scenarios[i].name + ": How quickly you mortals break.");
            } else if(randomNum == 2) {
                printer.print("" + scenarios[i].name + ": It is only a matter of time.");
            } else if(randomNum == 3) {
                printer.print("" + scenarios[i].name + ": The Void flows through you.");
            } else if(randomNum == 4) {
                printer.print("" + scenarios[i].name + ": Feel our power. Embrace it.");
            }
            if(!context.player.madness) {
                context.player["madness"] = 1;
                printer.print(context.player.color + " " + context.player.name + "'s Madness level increases to " + context.player.madness + ".");
            }
            else {
                context.player.madness++;
                printer.print(context.player.color + " " + context.player.name + "'s Madness level increases to " + context.player.madness + ".");
                if(context.player.madness >= 5) {
                    printer.print(context.player.color + " " + context.player.name + " succumbs to madness and is torn apart by the Void.");
                    utilities.dealDamage(context.player, 10000, {player: context.player, foe: context.scenario, cause: context.scenario});
                }
            }
        }
    }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.Murozond = function() {
    return utilities.withEffects({
        name: "Murozond",
        startOfMatch: {
            line: "Murozond: I can see now... the Hour of Twilight is nigh, and you will not stand against it!",
            greeting: murozond_greeting,
            action: murozond_action
        },
        endOfMatch: {
            line: "Murozond: The Hour of Twilight... is only... delayed...",
            victory: "Murozond: My victory was predetermined. Your battle was suicidal from the start.",
            action: endMatch
        },
        abilities: [InfiniteFlight, RecallMemories, RunningOutofTime, SandBreath],
        
        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Infinite",
        hero: {},
        baseHp: 80,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [],

        getMaxHp: function() {
            return utilities.genMaxHp(this);
        },
        getHp: function() {
            return utilities.genHp(this);
        },
        getMaxDamage: function() {
            return utilities.genMaxDamage(this);
        },
        getDamage: function() {
            return utilities.genDamage(this);
        }
    });
};

var murozond_action = function(red, blue, self) {
    red.baseHp += 45;
    blue.baseHp += 45;
};

var murozond_greeting = function(player) {
    if(player.hero.name == "Sapphiron") {
        printer.print("Murozond: Sapphiron? Time has not treated you well.");
    }
    else if(player.hero.name == "Vaelastrasz") {
        printer.print("Murozond: Vaelastrasz... even if you defeat me, you are still doomed. Still one of Nefarian's experiments...");
    }
};

var attackWave = function(red, blue, self) {
    var target = Math.random() > 0.5 ? (red.getHp() > 0 ? red : blue) : (blue.getHp() > 0 ? blue : red);
    for(var i = 0; i < self.minions.length; i++) {
        utilities.Attack(self.minions[i], utilities.AttackAI(self.minions[i], {player: self, foe: target}), {player: self, foe: target});
    }
};

var InfiniteFlight = function(red, blue, self) {
    printer.print(self.name + ": Come to me, my flight!");
    printer.print(self.name + " summons two deadly Infinite Drakes.");
    for(var i = 0; i < 2; i++) {
        utilities.summon(InfiniteDrake(self, self), self, {player: self});
    }
    
    attackWave(red, blue, self);
};

var RecallMemories = function(red, blue, self) {
    printer.print(self.name + ": Haven't we done this before?");
    printer.print(self.name + " summons memories from the past, taking control of two minions that died this game.");
    
    var graveyards = [];
    
    for(var i = 0; i < self.graveyard.length; i++) {
        if(self.graveyard[i].type == "minion") {
            graveyards.push(self.graveyard[i]);
        }
    }
    for(var i = 0; i < red.graveyard.length; i++) {
        if(red.graveyard[i].type == "minion") {
            graveyards.push(red.graveyard[i]);
        }
    }
    for(i = 0; i < blue.graveyard.length; i++) {
        if(blue.graveyard[i].type == "minion") {
            graveyards.push(blue.graveyard[i]);
        }
    }
    for(i = 0; i < 2; i++) {
        var memory = graveyards[Math.floor(Math.random() * graveyards.length)];
        if(typeof memory == "function") {
            memory = memory.card()
        }
        if(!memory) {
            memory = false;
            printer.print("No memory found -- a Sand Illusion has been created.");
            utilities.summon(SandIllusion(self, self), self, {player: self});;
        }
        else {
            printer.print("Memory formed: " + memory.name);
            utilities.summon(memory, self, {player: self});
        }
    }
    
    attackWave(red, blue, self);
};

var RunningOutofTime = function(red, blue, self) {
    printer.print(self.name + ": Time is running out...");
    printer.print(self.name + " assaults both players, forcing them to draw a fatigue card.");
    var redDeck = red.deck.slice();
    var blueDeck = blue.deck.slice();
    
    red.deck = [];
    blue.deck = [];
    
    utilities.drawCard(red, {player: red, foe: blue});
    utilities.drawCard(blue, {player: blue, foe: red});
    
    red.deck = redDeck;
    blue.deck = blueDeck;
    
    attackWave(red, blue, self);
};

var SandBreath = function(red, blue, self) {
    var target = Math.random() > 0.5 ? (red.getHp() > 0 ? red : blue) : (blue.getHp() > 0 ? blue : red);
    printer.print(self.name + ": I will scour you from this world. You will erode.");
    printer.print("" + self.name + " releases a deadly spray of sand from his jaws, dealing 3 damage to the " + target.color + " " + target.name + " and all the minions they control.");
    
    utilities.dealDamage(target, 3, { player: target, foe: self, cause: target });
    for(var i = 0; i < target.minions.length; i++) {
        utilities.dealDamage(target.minions[i], 3, { player: target, foe: self, cause: self });
    }
    
    attackWave(red, blue, self);
};

var InfiniteDrake = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Infinite", "Infinite Drake", 3, 0, 2, 3, false, false, false, [effects.sickness], ais.MurlocRaider, InfiniteDrake);
    minion["scenario"] = creator;
    return minion;
};

var SandIllusion = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Infinite", "Sand Illusion", 1, 0, 2, 1, false, false, false, [effects.sickness], ais.MurlocRaider, SandIllusion);
    minion["scenario"] = creator;
    return minion;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.Mimiron = function() {
    return utilities.withEffects({
        name: "Mimiron",
        startOfMatch: {
            line: "Mimiron: You're just in time for testing!",
            greeting: mimiron_greeting,
            action: mimiron_action
        },
        endOfMatch: {
            line: "Mimiron: Magnificent work! That should be all the data I need.",
            victory: "Mimiron: How unfortunate. Now, where can I find some more assistants?",
            action: endMatch_mimiron
        },
        abilities: [],
        defaultAbilities: [activateLeviathan, activateCannon, activateCommandUnit],
        leviathanAbilities: [FlameVents, PlasmaBlast, SummonAssaultBots],
        cannonAbilities: [LaserBurst, LaunchRockets, SummonAssaultBots],
        commandUnitAbilities: [PlasmaBarrage],
        
        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Titan-Forged",
        hero: {},
        baseHp: 2400,
        currentUnit: "Mimiron",
        unitBaseHp: 50,
        leviathanDmg: 0,
        cannonDmg: 0,
        commandUnitDmg: 0,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [MimironPreventDeath],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.EmergencyCoolant()); } return decklist; }(),
        graveyard: [],

        getMaxHp: function() {
            return utilities.genMaxHp(this);
        },
        getHp: function() {
            return utilities.genHp(this);
        },
        getMaxDamage: function() {
            return utilities.genMaxDamage(this);
        },
        getDamage: function() {
            return utilities.genDamage(this);
        }
    });
};

var mimiron_action = function(red, blue, self) {
    red.baseHp += 45;
    blue.baseHp += 45;
    
    self.abilities = self.defaultAbilities; // very briefly
    
    printer.print("Mimiron activates the Leviathan MK II!");
    self.baseHp = self.unitBaseHp;
    self.name = "Leviathan MK II";
    self.damageTaken = self.leviathanDmg;
    self.abilities = self.leviathanAbilities;
};

var mimiron_greeting = function(player) {
    
};

var endMatch_mimiron = function(red, blue, self) {
    red.damageTaken = 10000;
    red.armor = 0;
    red.minions = [];
    red.hand = [];
    blue.damageTaken = 10000;
    red.armor = 0;
    blue.minions = [];
    blue.hand = [];
    self.name = "Mimiron";
};

var MimironPreventDeath_Action = function(source, context) {
    if(source.leviathanDmg < source.unitBaseHp || source.cannonDmg < source.unitBaseHp || source.commandUnitDmg < source.unitBaseHp) {
        printer.print("The " + source.name + " has been destroyed! ", "results.txt", false);
        ActivateRandomOther(red, blue, source);
    }
};

var MimironPreventDeath = {
    name: "Mimiron Prevent Death",
    type: "death interrupt",
    action: MimironPreventDeath_Action
};

var activateLeviathan = function(red, blue, self) {
    printer.print("Mimiron deactivates the " + self.name + " and activates the Leviathan MK II.");
    
    if(self.name == "Leviathan MK II") {
        self.leviathanDmg = self.damageTaken;
    }
    else if(self.name == "Assault Cannon") {
        self.cannonDmg = self.damageTaken;
    }
    else if(self.name == "Aerial Command Unit") {
        self.commandUnitDmg = self.damageTaken;
    }
    
    self.name = "Leviathan MK II";
    self.damageTaken = self.leviathanDmg;
    self.abilities = self.leviathanAbilities;
};

var activateCannon = function(red, blue, self) {
    printer.print("Mimiron deactivates the " + self.name + " and activates the Assault Cannon.");
    
    if(self.name == "Leviathan MK II") {
        self.leviathanDmg = self.damageTaken;
    }
    else if(self.name == "Assault Cannon") {
        self.cannonDmg = self.damageTaken;
    }
    else if(self.name == "Aerial Command Unit") {
        self.commandUnitDmg = self.damageTaken;
    }
    
    self.name = "Assault Cannon";
    self.damageTaken = self.cannonDmg;
    self.abilities = self.cannonAbilities;
};

var activateCommandUnit = function(red, blue, self) {
    printer.print("Mimiron deactivates the " + self.name + " and activates the Aerial Command Unit.");
    
    if(self.name == "Leviathan MK II") {
        self.leviathanDmg = self.damageTaken;
    }
    else if(self.name == "Assault Cannon") {
        self.cannonDmg = self.damageTaken;
    }
    else if(self.name == "Aerial Command Unit") {
        self.commandUnitDmg = self.damageTaken;
    }
    
    self.name = "Aerial Command Unit";
    self.damageTaken = self.commandUnitDmg;
    self.abilities = self.commandUnitAbilities;
};

var ActivationAndAttack = function(red, blue, self) {
    var bothOthersDamaged = true;
    if(self.name == "Leviathan MK II") {
        bothOthersDamaged = self.cannonDmg >= self.unitBaseHp && self.commandUnitDmg >= self.unitBaseHp;
    }
    if(self.name == "Assault Cannon") {
        bothOthersDamaged = self.leviathanDmg >= self.unitBaseHp && self.commandUnitDmg >= self.unitBaseHp;
    }
    if(self.name == "Aerial Command Unit") {
        bothOthersDamaged = self.cannonDmg >= self.unitBaseHp && self.leviathanDmg >= self.unitBaseHp;
    }
    if(!bothOthersDamaged) {
        ActivateRandomOther(red, blue, self);
    }
    attackWave(red, blue, self);
}

var ActivateRandomOther = function(red, blue, self) {
    if(self.name == "Leviathan MK II") {
        var cannonOnline = self.cannonDmg < self.unitBaseHp;
        var commandUnitOnline = self.commandUnitDmg < self.unitBaseHp;
        if(cannonOnline && commandUnitOnline) {
            Math.random() > 0.5 ? activateCannon(red, blue, self) : activateCommandUnit(red, blue, self);
        } else if(cannonOnline) {
            activateCannon(red, blue, self)
        }
        else if(commandUnitOnline) {
            activateCommandUnit(red, blue, self);
        }
    }
    else if(self.name == "Assault Cannon") {
        var leviathanOnline = self.leviathanDmg < self.unitBaseHp;
        var commandUnitOnline = self.commandUnitDmg < self.unitBaseHp;
        if(leviathanOnline && commandUnitOnline) {
            Math.random() > 0.5 ? activateLeviathan(red, blue, self) : activateCommandUnit(red, blue, self);
        } else if(leviathanOnline) {
            activateLeviathan(red, blue, self)
        }
        else if(commandUnitOnline) {
            activateCommandUnit(red, blue, self);
        }
    }
    else if(self.name == "Aerial Command Unit") {
        var cannonOnline = self.cannonDmg < self.unitBaseHp;
        var leviathanOnline = self.leviathanDmg < self.unitBaseHp;
        if(cannonOnline && leviathanOnline) {
            Math.random() > 0.5 ? activateCannon(red, blue, self) : activateLeviathan(red, blue, self);
        } else if(cannonOnline) {
            activateCannon(red, blue, self)
        }
        else if(leviathanOnline) {
            activateLeviathan(red, blue, self);
        }
    }
};

var SummonAssaultBots = function(red, blue, self) {
    printer.print(self.name + " summons three Assault Bots.");
    for(var i = 0; i < 3; i++) {
        utilities.summon(AssaultBot(self, self), self, {player: self});
    }
    
    ActivationAndAttack(red, blue, self);
};

// Flame Vents

var FlameVents = function(red, blue, self) {
    printer.print(self.name + " activates its flame vents, releasing two pulses of fire to damage all enemy minions.");
    for(var j = 0; j < 2; j++) {
        for(var k = 0; k < 2; k++) {
            var target = k == 0 ? red : blue;
            for(var i = 0; i < target.minions.length; i++) {
                utilities.dealDamage(target.minions[i], 1, {player: target, foe: self, cause: self});
            }
        }
    }
    
    ActivationAndAttack(red, blue, self);
};

var PlasmaBlast = function(red, blue, self) {
    var filter = [red, blue];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    printer.print(self.name + " fires a blast of plasma at " + target.color + " " + target.name + ".");
    
    if(target.type == "hero") {
        utilities.dealDamage(target, 5, {player: target, foe: self, cause: self});
    } else {
        utilities.dealDamage(target, 8, {player: target.owner, foe: self, cause: self});
    }
    
    ActivationAndAttack(red, blue, self);
};

var LaserBurst = function(red, blue, self) {
    var player = Math.random() > 0.5 ? red : blue;
    printer.print(self.name + " fires a burst of lasers in the direction of " + player.color + " " + player.name + ".");
    for(var i = 0; i < 8; i++) {
        var targetList = player.minions.slice();
        targetList.push(player);
        var target = targetList[Math.floor(targetList.length * Math.random())];
        if(target.getHp() > 0) {
            utilities.dealDamage(target, 1, {player: player, foe: self, cause: self});
        }
    }
    
    ActivationAndAttack(red, blue, self);
};

var LaunchRockets = function(red, blue, self) {
    var player = Math.random() > 0.5 ? red : blue;
    printer.print(self.name + " fires two rockets in the direction of " + player.color + " " + player.name + ".");
    for(var i = 0; i < 2; i++) {
        var targetList = player.minions.slice();
        targetList.push(player);
        var target = targetList[Math.floor(targetList.length * Math.random())];
        printer.print("A rocket strikes " + target.color + " " + target.name + ".");
        if(target.getHp() > 0) {
            utilities.dealDamage(target, 4, {player: player, foe: self, cause: self});
        }
    }
    
    ActivationAndAttack(red, blue, self);
}

var PlasmaBarrage = function(red, blue, self) {
    printer.print(self.name + " launches four orbs of plasma at random enemies.");
    for(var i = 0; i < 4; i++) {
        var targetList = red.minions.slice();
        for(var l = 0; l < blue.minions.length; l++) {
            targetList.push(blue.minions[l]);
        }
        targetList.push(red);
        targetList.push(blue);
        
        var target = targetList[Math.floor(Math.random() * targetList.length)];
        if(target.getHp() > 0) {
            utilities.dealDamage(target, 2, {player: target.owner, foe: self, cause: self});
        }
    }
    
    ActivationAndAttack(red, blue, self);
};

var AssaultBot = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Titan-Forged", "Assault Bot", 1, 0, 2, 1, false, false, false, [effects.sickness], ais.MurlocRaider, AssaultBot);
    minion["scenario"] = creator;
    return minion;
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.Kaelthas = function() {
    return utilities.withEffects({
        name: "Kael'thas Sunstrider",
        startOfMatch: {
            line: "Kael'thas: Greetings.",
            greeting: kael_greeting,
            action: kael_action
        },
        endOfMatch: {
            line: "Kael'thas: Merely... a setback.",
            victory: "Kael'thas: An admirable, if short-lived, display.",
            action: endMatch
        },
        abilities: [Summon_Thaladred, Flamestrike, GravityLapse, Fireball, Fireball, Fireball],
        
        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Sin'dorei",
        hero: {},
        baseHp: 80,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [],

        getMaxHp: function() {
            return utilities.genMaxHp(this);
        },
        getHp: function() {
            return utilities.genHp(this);
        },
        getMaxDamage: function() {
            return utilities.genMaxDamage(this);
        },
        getDamage: function() {
            return utilities.genDamage(this);
        }
    });
};

var kael_action = function(red, blue, self) {
    red.baseHp += 20;
    blue.baseHp += 20;
};

var kael_greeting = function(player) {
    
};

var Telonicus = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Master Engineer", "Telonicus", 3, 0, 10, 4, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Telonicus);
    minion["scenario"] = creator;
    return minion;
};

var Summon_Telonicus = function(red, blue, self) {
    printer.print(self.name + " summons one of his advisors, Master Engineer Telonicus.");
    utilities.summon(Telonicus(self, self), self, {player: self});
    self.abilities.splice(self.abilities.indexOf(Summon_Telonicus), 1);
    
    attackWave(red, blue, self);

};

var Capernian = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Grand Astromancer", "Capernian", 3, 0, 8, 3, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Capernian);
    minion["scenario"] = creator;
    return minion;
};

var Summon_Capernian = function(red, blue, self) {
    printer.print(self.name + " summons one of his advisors, Grand Astromancer Capernian.");
    utilities.summon(Capernian(self, self), self, {player: self});
    self.abilities.splice(self.abilities.indexOf(Summon_Capernian), 1);
    self.abilities.push(Summon_Telonicus);
    
    attackWave(red, blue, self);
};

var Sanguinar = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Lord", "Sanguinar", 3, 0, 6, 2, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Sanguinar);
    minion["scenario"] = creator;
    return minion;
};

var Summon_Sanguinar = function(red, blue, self) {
    printer.print(self.name + " summons one of his advisors, Lord Sanguinar.");
    utilities.summon(Sanguinar(self, self), self, {player: self});
    self.abilities.splice(self.abilities.indexOf(Summon_Sanguinar), 1);
    self.abilities.push(Summon_Capernian);
    
    attackWave(red, blue, self);
};

var Thaladred = function(player, creator) {
    var minion = utilities.makeMinion(false, "Boss", "Custom", "Thaladred", "the Darkener", 3, 0, 4, 1, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Thaladred);
    minion["scenario"] = creator;
    return minion;
};

var Summon_Thaladred = function(red, blue, self) {
    printer.print(self.name + " summons one of his advisors, Thaladred the Darkener.");
    utilities.summon(Thaladred(self, self), self, {player: self});
    self.abilities.splice(self.abilities.indexOf(Summon_Thaladred), 1);
    self.abilities.push(Summon_Sanguinar);
    
    attackWave(red, blue, self);
};

var Flamestrike = function(red, blue, self) {
    printer.print(self.name + " summons a powerful Flamestrike, dealing immense damage to all enemy minions.");
    for(var j = 0; j < 3; j++) {
        for(var k = 0; k < 2; k++) {
            var target = k == 0 ? red : blue;
            for(var i = 0; i < target.minions.length; i++) {
                utilities.dealDamage(target.minions[i], 3 - j, {player: target, foe: self, cause: self});
            }
        }
    }
    
    attackWave(red, blue, self);
};

var GravityLapse = function(red, blue, self) {
    printer.print("Kael'thas: Let us see how you fare when your world turns upside down!");
    printer.print(self.name + " inverts gravity, damaging all minions and swapping their ownership to the other player.");
    var initialRed = red.minions.slice();
    red.minions = blue.minions;
    blue.minions = initialRed;
    for(var i = 0; i < red.minions.length; i++) {
        utilities.dealDamage(red.minions[i], 1, { player: red, foe: blue, cause: red });
    }
    for(i = 0; i < blue.minions.length; i++) {
        utilities.dealDamage(blue.minions[i], 1, { player: blue, foe: red, cause: red });
    }
    
    attackWave(red, blue, self);
};

var Fireball = function(red, blue, self) {
    var filter = [red, blue];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    printer.print(self.name + " shoots a fireball at " + target.color + " " + target.name + ".");
    utilities.dealDamage(target, 6, {player: target.owner, foe: self, cause: self});
    
    attackWave(red, blue, self);
};