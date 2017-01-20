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

var attackWave = function(red, blue, self) {
    var target = Math.random() > 0.5 ? (red.getHp() > 0 ? red : blue) : (blue.getHp() > 0 ? blue : red);
    for(var i = 0; i < self.minions.length; i++) {
        var canAttack = true;
        for(var j in self.minions[i].effects) {
            if(self.minions[i].effects[j]) {
                if(self.minions[i].effects[j].name == "Summoning Sickness" || self.minions[i].effects[j].name == "Can't Attack" || self.minions[i].effects[j].name == "Frozen" || self.minions[i].effects[j].name == "Permanently Frozen") {
                    canAttack = false;
                    if(self.minions[i].effects[j].name == "Summoning Sickness") {
                        self.minions[i].effects.splice(j, 1);
                        j--;
                    }
                }
            }
        }
        if(self.minions[i].getDamage() <= 0) {
            canAttack = false;
        }
        if(canAttack == true) {
            utilities.Attack(self.minions[i], utilities.AttackAI(self.minions[i], {player: self, foe: target}), {player: self, foe: target});
        }
    }
};

module.exports.Zakazj = function() {
    return utilities.withEffects({
        scenarioName: "Zakazj the Corruptor",
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
        
        turn: false,

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
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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
        scenarioName: "Madness of Murozond",
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
        abilities: [murozond_turn],
        abils: [InfiniteFlight, RecallMemories, RunningOutofTime, SandBreath],
        phase: 0,
        
        turn: false,

        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Infinite",
        hero: {},
        baseHp: 180,
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
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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
    red.baseHp += 70;
    blue.baseHp += 70;
};

var murozond_turn = function(red, blue, self) {
    self.phase++;
    self.abils[Math.floor(Math.random()*self.abils.length)](red, blue, self);
    if(self.phase % 12 == 0 && self.phase != 0) {
        AlterTime(red, blue, self);
    }
    self.previousDmg = self.damageTaken;
    self.previousRedDmg = red.damageTaken;
    self.previousBlueDmg = blue.damageTaken;
};

var murozond_greeting = function(player) {
    if(player.hero.name == "Sapphiron" || player.hero.name == "Sindragosa" || player.hero.name == "Malygos") {
        printer.print("Murozond: " + player.hero.name + "? Time has not treated you well.");
    }
    else if(player.hero.name == "Onyxia" || player.hero.name == "Nefarian" || player.hero.name == "Neltharion") {
        printer.print("Murozond: Black dragons... out of my sight! You have no place here!");
    }
    else if(player.hero.name == "Vaelastrasz") {
        printer.print("Murozond: Vaelastrasz... even if you defeat me, you are still doomed. Still one of Nefarian's experiments...");
    }
};

var AlterTime = function(red, blue, self) {
    printer.print(self.name + ": My wounds reverse...");
    printer.print(self.name + " regains Health equal to more than four times the damage he took this turn.")
    utilities.healDamage(self, Math.abs(self.damageTaken - self.previousDmg + 4)*4, {player: self, foe: red, cause: self});
};

var InfiniteFlight = function(red, blue, self) {
    printer.print(self.name + ": Come to me, my flight!");
    printer.print(self.name + " summons two deadly Infinite Drakes.");
    for(var i = 0; i < 2; i++) {
        utilities.summon(InfiniteDrake(self, self), self, {player: self, foe: red});
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
    graveyards = utilities.filterArray.notHasName(graveyards, "Sand Illusion");
    
    for(i = 0; i < 2; i++) {
        var memory = graveyards[Math.floor(Math.random() * graveyards.length)];
        if(typeof memory == "function") {
            memory = memory.card();
        }
        if(!memory) {
            memory = false;
            printer.print("A Sand Illusion has been created in place of a Memory.");
            utilities.summon(SandIllusion(self, self), self, {player: self, foe: red});
        }
        else {
            printer.print("Memory formed: " + memory.name);
            utilities.summon(memory.card(), self, {player: self});
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
    
    utilities.drawCard(red, {player: red, foe: self});
    utilities.drawCard(blue, {player: blue, foe: self});
    
    red.deck = redDeck;
    blue.deck = blueDeck;
    
    attackWave(red, blue, self);
};

var SandBreath = function(red, blue, self) {
    var target = Math.random() > 0.5 ? (red.getHp() > 0 ? red : blue) : (blue.getHp() > 0 ? blue : red);
    printer.print(self.name + ": I will scour you from this world. You will ERODE.");
    var num = Math.floor(self.phase / 12) + 1;
    printer.print("" + self.name + " releases a deadly spray of sand from his jaws, dealing " + num + " damage to the " + target.color + " " + target.name + " and all the minions they control.");
    
    utilities.dealDamage(target, num, { player: target, foe: self, cause: target });
    for(var i = 0; i < target.minions.length; i++) {
        var minion = target.minions[i];
        utilities.dealDamage(minion, num, { player: target, foe: self, cause: self });
        if(!minion.isAlive()) {
            i--;
        }
    }
    
    attackWave(red, blue, self);
};

var InfiniteDrake = function(player, creator) {
    if(creator) {
        var num = Math.floor(creator.phase / 8) + 1;
    }
    var minion = utilities.makeMinion("Dragon", "Boss", "Custom", ["Scenarios"], "Drake", 3, 0, num ? num : 2, num ? num : 3, false, false, false, [effects.sickness], ais.MurlocRaider, InfiniteDrake);
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
        scenarioName: "Mimiron",
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
        
        turn: false,

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
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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
        printer.print("The " + source.name + " has been destroyed! ", "results.md", false);
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// SAD MYSTERY BOSSES

module.exports.BlackrockBlademaster = function() {
    return utilities.withEffects({
        scenarioName: "Blackrock & Roll",
        name: "Blademaster",
        startOfMatch: {
            line:  "Uther the Lightbringer: The Blackrock orcs that destroyed Strahnbrad have a base somewhere nearby. I'm entrusting you with leading the attack.\nArthas Menethil: I won't let you down, Uther.\nArthas Menethil: Come with me. Let's slay these beasts.",
            greeting: false,
            action: BlackrockBlademaster_Action
        },
        endOfMatch: {
            line: "Uther the Lightbringer: Well done, lad. A sound victory!\n",
            victory: "Arthas Menethil: Fall back! The orcs are too much for us...",
            action: endMatch
        },
        abilities: [Blackrock_Turn],
        defaultAbils: [Blackrock_Reinforce, Blackrock_Reinforce, Blackrock_Bombard, Blackrock_Assassinate],
        
        phase: 1,
        bombardTimer: 4,
        
        turn: false,

        attackTarget: true,
        minionLifelink: false,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Blackrock",
        hero: {},
        baseHp: 15,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 15,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [Blackrock_MirrorImage],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var BlackrockBlademaster_Action = function(red, blue, self) {
    for(var i = 0; i < 3; i++) {
        utilities.summon(Blackrock_WatchTower(), self, {player: self, foe: red});
    }
};

var Blackrock_Turn = function(red, blue, self) {
    self.phase++;
    if(self.phase == 6) {
        printer.print("Feranor Steeltoe: Well met! Would you care to join in our hunt?\nArthas Menethil: What are you dwarves hunting?\nFeranor Steeltoe: We're on the trail of a black drake named Searinox! If you bring us back his heart, we can grant you a fiery enchantment.\nFeranor Steeltoe: I'll tag along. Nothing like the thrill of a dragon hunt!\n");
        utilities.summon(Blackrock_Feranor(), red, {player: red, foe: self});
    }
    if(self.phase == 14) {
        printer.print("The black dragon Searinox descends from the sky with a mighty roar. If you slay the creature, the dwarves can give you some sort of reward.\n");
        utilities.summon(Searinox(), self, {player: self, foe: red});
    }
    else {
        var num = Math.floor(Math.random() * self.defaultAbils.length);
        if(self.bombardTimer == 0) {
            Blackrock_Bombard(red, blue, self);
            self.bombardTimer = 4;
        } else {
            self.defaultAbils[num](red, blue, self);
            if(self.defaultAbils[num] != Blackrock_Bombard) {
                self.bombardTimer--;
            } else {
                self.bombardTimer = 4;
            }
        }
        
        num = 0;
        for(var i in self.minions) {
            if(self.minions[i].name == "Watch Tower") {
                num++;
            }
        }
        
        if(num < 6 && self.phase % 10 == 0) {
            if(num < 3) {
                printer.print("Blackrock Blademaster: Rebuild one of those watch towers!\nThe Blackrock orcs repair one of the damaged watch towers. It is ready to start assaulting your forces.");
            } else {
                printer.print("Blackrock Blademaster: Peons, construct a new watch tower!\nThe Blackrock orcs construct a new watch tower, ready to start assaulting your forces.");
            }
            utilities.summon(Blackrock_WatchTower(), self, {player: self, foe: red});
        }
        attackWave(red, blue, self);
    }
};

var Feranor_ByeAction = function(source, context) {
    printer.print("\nFeranor Steeltoe: Ach! It's getting a bit too intense for me... I'll just stay back with the others!\n");
    source.owner.minions.splice(source.owner.minions.indexOf(source), 1);
    return 0;
};

var Feranor_Bye = {
    name: "Ach!",
    type: "death interrupt",
    action: Feranor_ByeAction
}

var Blackrock_Feranor = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", false, "Feranor Steeltoe", 3, 0, 3, 4, false, false, false, [effects.sickness, effects.Arthas_MortarTeam, Feranor_Bye, effects.cantattack], ais.true, Blackrock_Feranor);
};

var Blackrock_Reinforce = function(red, blue, self) {
    var num = 2;
    num += Math.floor(self.phase / 10);
    printer.print(num + " Blackrock Grunts emerge from a barracks, ready for battle.");
    for(var i = 0; i < num; i++) {
        utilities.summon(Blackrock_Grunt(), self, {player: self, foe: red});
    }
};

var Blackrock_Bombard = function(red, blue, self) {
    var num = 0;
    for(var i in self.minions) {
        if(self.minions[i].name == "Watch Tower") {
            num++;
        }
    }
    if(num > 0) {
        var player = Math.random() > 0.5 ? red : blue;
        var string = "Blackrock Blademaster: Fire!\n" + num + " massive fireball";
        if(num == 1) {
            string += " is launched";
        } else {
            string += "s are launched";
        }
        string += " from Blackrock Watch Towers towards " + player.color + " " + player.name + " and their troops.";
        printer.print(string);
        for(var i = 0; i < num; i++) {
            var targetList = player.minions.slice();
            targetList.push(player);
            var target = targetList[Math.floor(targetList.length * Math.random())];
            printer.print("A fireball strikes " + target.color + " " + target.name + ".");
            if(target.getHp() > 0) {
                utilities.dealDamage(target, 2, {player: player, foe: self, cause: self});
            }
        }
    }
};

var Blackrock_Assassinate = function(red, blue, self) {
    var filter = [];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    if(target) {
        printer.print("Blackrock Blademaster emerges from darkness, slashing at " + target.color + " " + target.name + " viciously, then fades back into the shadows.");
        utilities.dealDamage(target, 6, {player: target.owner, foe: self, cause: self});
    } else {
        if(self.armor > 0) {
            Blackrock_Reinforce(red, blue, self);
        } else {
            Blackrock_Bombard(red, blue, self);
        }
    }
};

var Blackrock_MirrorImage_Action = function(source, context) {
    if(source.armor - context.damage <= 0) {
        printer.print("\nBlackrock Blademaster: Paladin fool!\nThree images of the Blackrock Blademaster appear.\n");
        for(var i = 0; i < 3; i++) {
            utilities.summon(Blackrock_MirrorImage_Unit(), source, {player: source, foe: context.foe, cause: source});
        }
        for(var i in source.effects) {
            if(source.effects[i] && source.effects[i].name == "Mirror Image") {
                source.effects.splice(i, 1);
            }
        }
        source.abilities.push(Blackrock_Assassinate);
        return context.damage;
    }
    return context.damage;
};

var Blackrock_MirrorImage = {
    name: "Mirror Image",
    type: "self defense",
    action: Blackrock_MirrorImage_Action
};

var Searinox = function() {
    return utilities.makeMinion("Dragon", "Uncollectible", "Sad Mystery", "Black", "Searinox", 6, 0, 16, 4, false, false, false, [effects.sickness, effects.taunt, Searinox_Deathrattle], ais.true, Searinox);
};

var Searinox_RattleEffect = function(source, context) {
    printer.print("\nFeranor Steeltoe: Nice job! We can use the beast's heart to forge a fiery enchantment you can unleash upon your enemies.\n" + context.foe.color + " " + context.foe.name + " has received a use of the Heart of Searinox.\n");
    if(context.foe.hand.length < 10) {
        context.foe.hand.push(HeartofSearinox());
    }
};

var Searinox_Deathrattle = {
    name: "Searinox",
    type: "deathrattle",
    action: Searinox_RattleEffect
};

var Blackrock_Grunt = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", false, "Grunt", 2, 0, 2, 2, false, false, false, [effects.sickness, effects.taunt], ais.true, Blackrock_Grunt);
};

var Blackrock_WatchTower = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", false, "Watch Tower", 4, 0, 12, 0, false, false, false, [effects.taunt, effects.cantattack], ais.true, Blackrock_WatchTower);
};

var Blackrock_MirrorImage_Unit = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", false, "Mirror Image", 3, 0, 5, 2, false, false, false, [effects.sickness, effects.taunt], ais.true, Blackrock_MirrorImage_Unit);
};

var HeartofSearinox = function() {
    return utilities.makeSpell("Uncollectible", "Sad Mystery", false, "Heart of Searinox", 4, 0, HeartofSearinox_Ability, false, false, ais.Flamestrike, HeartofSearinox);
};

var HeartofSearinox_Ability = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " unleashes the searing fury of the Heart of Searinox, dealing 20 damage to an enemy Watch Tower. and 2 damage to all other enemy minions.");
    var hasDamagedTower = false;
    for(var i in context.foe.minions) {
        if(context.foe.minions[i].name == "Watch Tower" && hasDamagedTower == false) {
            utilities.dealSpellDamage(context.foe.minions[i], 20, context);
            hasDamagedTower = true;
        }
        else {
            utilities.dealSpellDamage(context.foe.minions[i], 2, context);
        }
    }
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.PlaguedVillages = function() {
    return utilities.withEffects({
        scenarioName: "Plagued Villages",
        name: "Village",
        startOfMatch: {
            line:  "Jaina Proudmoore: Those reports of plague appear to have been right... that granary looks like it's spreading it.\nArthas Menethil: Then let's destroy it.",
            greeting: PlaguedVillages_Greeting,
            action: PlaguedVillages_Action
        },
        endOfMatch: {
            line: "Jaina Proudmoore: What was that monstrosity? And who was that mage in black robes?\nArthas Menethil: I don't know. But I suspect we'll find out in Andorhal.",
            victory: "Arthas Menethil: Blasted undead! Retreat!",
            action: endMatch
        },
        abilities: [PlaguedVillages_Turn],
        defaultAbils: [PlaguedVillages_Zombies],
        
        phase: 1,
        necroSummoned: false,
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Plagued",
        hero: {},
        baseHp: 165,
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
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var PlaguedVillages_Action = function(red, blue, self) {
    printer.print("An ominous calm hangs over the village.");
    utilities.summon(PlaguedVillages_PlaguedGranary(), self, {player: self, foe: red, cause: self});
};

var PlaguedVillages_Greeting = function(player) {
    
};

var PlaguedVillages_Turn = function(red, blue, self) {
    self.phase++;
    if(self.phase < 6) {
        
    }
    else if(self.phase == 6) {
        printer.print("Arthas Menethil: There! A group of undead! Destroy them!\nA group of shambling creatures emerge from one of the buildings and attack!");
        for(var i = 0; i < 4; i++) {
            utilities.summon(PlaguedVillages_Zombie(), self, {player: self, foe: self, cause: self});
        }
    }
    else if(self.phase == 14) {
        printer.print("Arthas Menethil: A dwarven mortar team! What are you men shooting at?\nMortar Team: Undead, sir! The village is crawling with 'em!\nThe Mortar Team has joined " + red.name + "'s forces!");
        utilities.summon(cards.Arthas_MortarTeam(), red, {player: red, foe: self, cause: red});
        for(i = 0; i < 4; i++) {
            utilities.summon(PlaguedVillages_Zombie2(), self, {player: self, foe: self, cause: self});
        }
    } else if(self.phase == 24) {
        printer.print("A massive behemoth of twisted flesh emerges from behind the granary.\nArthas Menethil: What the-- kill it!");
        utilities.summon(PlaguedVillages_Abomination(), self, {player: self, foe: red, cause: self});
    } else if(self.phase == 36) {
        printer.print("A figure clad in black robes appears. He seems to be orchestrating things from the background.");
        utilities.summon(PlaguedVillages_KelThuzad(), self, {player: self, foe: red, cause: self});
        self.necroSummoned = true;
    }
    else {
        var num = Math.floor(Math.random() * self.defaultAbils.length);
        self.defaultAbils[num](red, blue, self);
    }
    var abomAlive = false;
    var granaryAlive = false;
    for(i in self.minions) {
        if(self.minions[i].name == "Abomination") {
            abomAlive = true;
        } else if(self.minions[i].name == "Granary") {
            granaryAlive = true;
        }
    }
    if(abomAlive == false) {
        var grave = false;
        for(i in self.graveyard) {
            if(self.graveyard[i].name == "Abomination") {
                grave = true;
            }
        }
    }
    if(abomAlive == false && grave == false && self.phase > 24) {
        printer.print("\nAnother abomination lurches out of the fog.");
        utilities.summon(PlaguedVillages_Abomination(), self, {player: self, foe: red, cause: self});
    }
    var necroPresent = false;
    for(i in self.minions) {
        if(self.minions[i].name == "Kel'Thuzad") {
            necroPresent = true;
            PlaguedVillages_RaiseDead(red, blue, self);
        }
    }
    if(!abomAlive && grave == true && granaryAlive == false && necroPresent == false && self.necroSummoned == true) {
        printer.print("The plague appears to have lifted from this village.");
        self.minions = [];
        self.damageTaken = 5000;
    }
    attackWave(red, blue, self);
};

var PlaguedVillages_Zombies = function(red, blue, self) {
    var num = 2;
    num += Math.floor(self.phase / 10);
    if(self.phase > 40) {
        num += 3;
    } else if(self.phase > 20) {
        num -= 2;
    }
    printer.print("A group of " + num + " shambling creatures emerge from one of the buildings and attack!");
    for(var i = 0; i < num; i++) {
        utilities.summon(self.phase > 20 ? PlaguedVillages_Zombie2() : PlaguedVillages_Zombie(), self, {player: self, foe: self, cause: self});
    }
};

var PlaguedVillages_RaiseDead = function(red, blue, self) {
    var graveyard = [];
    for(var i in red.graveyard) {
        if(red.graveyard[i].type == "minion") {
            graveyard.push(red.graveyard[i]);
        }
    }
    for(i in blue.graveyard) {
        if(blue.graveyard[i].type == "minion") {
            graveyard.push(blue.graveyard[i]);
        }
    }
    var zombie = graveyard[Math.floor(Math.random() * graveyard.length)];
    if(zombie) {
        printer.print("Kel'Thuzad: Rise, minion!\nThe corpse of " + zombie.name + " rises at the necromancer's call.");
        zombie["race"] == "Undead";
        utilities.summon(zombie.card(), self, {player: self, foe: red, cause: self});
    }
};

var PlaguedVillages_Zombie = function() {
    return utilities.makeMinion("Undead", "Uncollectible", "Sad Mystery", false, "Zombie", 1, 0, 3, 1, false, false, false, [effects.sickness, effects.taunt], ais.true, PlaguedVillages_Zombie);
};

var PlaguedVillages_Zombie2 = function() {
    return utilities.makeMinion("Undead", "Uncollectible", "Sad Mystery", false, "Zombie", 1, 0, 5, 2, false, false, false, [effects.sickness, effects.taunt], ais.true, PlaguedVillages_Zombie);
};

var PlaguedVillages_PlaguedGranary = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", false, "Granary", 3, 0, 45, 0, false, false, false, [effects.cantattack, effects.taunt, effects.heroic], ais.true, PlaguedVillages_PlaguedGranary);
};

var PlaguedVillages_KTByeAction = function(source, context) {
    printer.print("\nKel'Thuzad: Quite impressive, young prince. We will meet again in Andorhal...\nKel'Thuzad vanishes.\n");
    source.owner.minions.splice(source.owner.minions.indexOf(source), 1);
    return 0;
};

var PlaguedVillages_KTBye = {
    name: "Kel'Thuzad Bye",
    type: "death interrupt",
    action: PlaguedVillages_KTByeAction
};

var PlaguedVillages_KelThuzad = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", "Necromancer", "Kel'Thuzad", 4, 0, 45, 5, false, false, false, [effects.sickness, effects.taunt, effects.heroic, PlaguedVillages_KTBye], ais.true, PlaguedVillages_KelThuzad);
};

var PlaguedVillages_Abomination = function() {
    return utilities.makeMinion("Undead", "Uncollectible", "Sad Mystery", false, "Abomination", 6, 0, 45, 6, false, false, false, [effects.sickness, effects.taunt, effects.heroic], ais.true, PlaguedVillages_Abomination);
};

module.exports.KelThuzad = function() {
    return utilities.withEffects({
        scenarioName: "The Necromancer Kel'Thuzad",
        name: "Kel'Thuzad",
        startOfMatch: {
            line:  "Arthas Menethil: We've reached Andorhal... there! The necromancer who was leading the undead!\nKel'Thuzad: Greetings, Prince Arthas. You were expected.",
            greeting: KelThuzad_Greeting,
            action: KelThuzad_Action
        },
        endOfMatch: {
            line: "Kel'Thuzad: My death means nothing... the scourging of this land begins...\nArthas Menethil: There's some greater force behind the plague? Quickly, we need to reach Stratholme and put an end to this!\n",
            victory: "Kel'Thuzad: It seems you were overestimated, prince Arthas.",
            action: endMatch
        },
        abilities: [KelThuzad_Turn],
        defaultAbils: [KelThuzad_ShadowBolt, KelThuzad_Frenzy],
        
        phase: 1,
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Dark",
        hero: {},
        baseHp: 65,
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
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var KelThuzad_Action = function(red, blue, self) {
    printer.print("\nKel'Thuzad: witness the power of the Scourge I bring!\nKel'Thuzad reanimates four corpses.");
    for(var i = 0; i < 4; i++) {
        utilities.summon(PlaguedVillages_Zombie(), self, {player: self, foe: red, cause: self});
    }
    red.baseHp += 20;
    blue.baseHp += 20;
};

var KelThuzad_Greeting = function(player) {
    
};

var KelThuzad_Turn = function(red, blue, self) {
    self.phase++;
    if(self.phase > 24 && (self.getHp() >= 20 || (red.getHp() <= 4 || blue.getHp() <= 4))) {
        KelThuzad_Enrage(red, blue, self);
    }
    else if(self.phase < 8 && self.phase % 2 == 0) {
        printer.print("Kel'Thuzad reanimates a weak zombie.");
        utilities.summon(PlaguedVillages_Zombie(), self, {player: self, foe: red, cause: self});
    }
    else {
        var num = Math.floor(Math.random() * self.defaultAbils.length);
        self.defaultAbils[num](red, blue, self);
    }
    printer.print("");
    if(self.phase % 3 == 0) {
        PlaguedVillages_RaiseDead(red, blue, self);
        printer.print("");
    }
    else if(self.phase % 8 == 0) {
        KelThuzad_BoneServants(red, blue, self);
        printer.print("");
    }
    attackWave(red, blue, self);
};

var KelThuzad_Enrage = function(red, blue, self) {
    if(self.phase == 25) {
        printer.print("Kel'Thuzad: The master must have been wrong about you... you are no threat to me, or to our cause... and certainly no future champion.\nKel'Thuzad releases a wave of darkness, tearing at the souls of all enemies.");
    } else {
        printer.print("Kel'Thuzad releases a wave of darkness, tearing at the souls of all enemies.");
    }
    var filter = [red, blue];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    for(var i in filter) {
        utilities.dealDamage(filter[i], 4, {player: self, foe: filter[i].owner, cause: self});
    }
};

var KelThuzad_ShadowBoltDebuff = {
    name: "Debuff",
    type: "buff damage",
    num: -2
};

var KelThuzad_ShadowBolt = function(red, blue, self) {
    var filter = [red, blue];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    printer.print("Kel'Thuzad launches a bolt of darkess at " + target.color + " " + target.name + ", damaging and weakening them.");
    utilities.dealDamage(target, 4, {player: target.owner, foe: self, cause: self});
    target.effects.push(KelThuzad_ShadowBoltDebuff);
};

var KelThuzad_FrenzyResistAction = function(source, context) {
    if(source.getHp() == 1 || context.damage <= 0) {
        return 0;
    }
    return 1;
};

var KelThuzad_FrenzyResist = {
    name: "Frenzy Resistance",
    type: "self defense",
    action: KelThuzad_FrenzyResistAction
};

var KelThuzad_Frenzy = function(red, blue, self) {
    var minion;
    for(var i in self.minions) {
        if(!minion || self.minions[i].getDamage() > minion.getDamage()) {
            minion = self.minions[i];
        }
    }
    if(minion) {
        printer.print("Kel'Thuzad: Slay them!\nKel'Thuzad drives " + minion.name + " into a frenzy, causing them to attack " + red.name + " and all of their minions.");
        minion.effects.unshift(KelThuzad_FrenzyResist);
        utilities.Attack(minion, red, {player: self, foe: red, cause: self});
        for(i in red.minions) {
            utilities.Attack(minion, red.minions[i], {player: self, foe: red, cause: self});
        }
        for(i in minion.effects) {
            if(minion.effects[i] && minion.effects[i].name == "Frenzy Resistance") {
                minion.effects.splice(i, 1);
            }
        }
    }
    else {
        KelThuzad_ShadowBolt(red, blue, self);
    }
};

var KelThuzad_BoneServants = function(red, blue, self) {
    printer.print("Kel'Thuzad: Rise, and let the living beware!\nKel'Thuzad summons two skeletal warriors.");
    for(var i = 0; i < 2; i++) {
        var stat = Math.round(self.phase / 4);
        if(self.phase > 24) {
            stat += Math.round((self.phase-24) / 3);
        }
        utilities.summon(KelThuzad_SkeletalWarrior(stat), self, {player: self, foe: red, cause: self});
    }
};

var KelThuzad_SkeletalWarrior = function(stat) {
    return utilities.makeMinion("Undead", "Uncollectible", "Sad Mystery", false, "Skeletal Warrior", 2, 0, stat, stat, false, false, false, [effects.sickness], ais.true, KelThuzad_SkeletalWarrior);
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.Stratholme = function() {
    return utilities.withEffects({
        scenarioName: "The Purging of Stratholme",
        name: "Mal'Ganis",
        startOfMatch: {
            line:  "Arthas Menethil: No... Stratholme has been infected. We have to kill these citizens before they turn to undead...",
            greeting: Stratholme_Greeting,
            action: Stratholme_Action
        },
        endOfMatch: {
            line: "Mal'Ganis: Impressively done, boy. But we have unfinished business between us. Meet me in Northrend... there shall your fate be revealed.\n",
            victory: "With the defeat of Arthas and his forces, the city of Stratholme has fallen to Mal'Ganis.",
            action: endMatch
        },
        abilities: [Stratholme_Turn],
        defaultAbils: [Stratholme_VampiricBite, Stratholme_Reinforcements, Stratholme_Sleep],
        
        phase: 1,
        
        malganisScore: 0,
        arthasScore: 0,
        enabled: true,
        enableTimer: 0,
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Unholy",
        hero: {},
        baseHp: 30,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [Stratholme_MalganisAvoidDeath],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var Stratholme_Action = function(red, blue, self) {
    
};

var Stratholme_Greeting = function(player) {
    if(player.name == "Paladin") {
        printer.print("Arthas Menethil: I'm glad to see you understand, Uther. I was worried you would refuse to help me.");
    }
    if(player.name == "Mage") {
        printer.print("Arthas Menethil: Jaina... thank you. I need your help right now.");
    }
};

var Stratholme_Turn = function(red, blue, self) {
    if(self.malganisScore >= 30 || self.arthasScore >= 30) {
        if(self.malganisScore >= 30) {
            printer.print("Mal'Ganis: Perfect. I have the army I need. Now to wipe out the kingdom of Lordaeron...");
            endMatch(red, blue, self);
        } else {
            printer.print("Arthas Menethil: These villagers will not be your minions in death, demon!");
            self.removeEffect(effects.immune);
            self.removeEffect(Stratholme_MalganisAvoidDeath);
            utilities.dealDamage(self, 10000, {player: self, foe: red, cause: self});
        }
    }
    else {
        var villagerNum = 0;
        for(var i in self.minions) {
            if(self.minions[i].name == "Villager") {
                villagerNum++;
            }
        }
        printer.print("Arthas Score: " + self.arthasScore + " | Mal'Ganis Score: " + self.malganisScore + " | Villager Count: " + villagerNum);
        if(self.enabled) {
            self.removeEffect(effects.immune);
            self.phase++;
            
            var num = Math.floor(Math.random() * self.defaultAbils.length);
            if(self.defaultAbils[num]) {
                self.defaultAbils[num](red, blue, self);
            }
            
            attackWave(red, blue, self);
            for(var i in self.minions) {
                    if(self.minions[i].name == "Villager") {
                        if(self.minions[i].timer <= 0) {
                            printer.print("Mal'Ganis claims a Villager, transforming them into a zombie!");
                            utilities.kill(self.minions[i], {player: self, foe: red, cause: self});
                            utilities.summon(PlaguedVillages_Zombie(), self, {player: self, foe: red});
                        }
                        self.minions[i].timer--;
                    }
                }
        } else {
            if(self.enableTimer <= 0) {
                var taunts = [
                    "You thought yourself rid of me?",
                    "My work is not yet complete."
                ];
                printer.print("\nMal'Ganis: " + taunts[Math.floor(Math.random() * taunts.length)] + "\n");
                for(var i in self.minions) {
                    if(self.minions[i].name == "Villager") {
                        self.minions[i].removeEffect(effects.taunt);
                    }
                }
                self.enabled = true;
                self.damageTaken = 0;
                self.removeEffect(effects.immune);
                self.removeEffect(effects.stealth);
            } else {
                self.enableTimer--;
                printer.print("Tick tock, " + self.enableTimer);
            }
        }
        Stratholme_PeopleOfStratholme(red, blue, self);
    }
};

var Stratholme_VampiricBite = function(red, blue, self) {
    var filter = [red, blue];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    printer.print(self.name + " bites " + target.color + " " + target.name + ", dealing damage and regaining health.");
    
    if(target.type == "hero") {
        utilities.dealDamage(target, 5, {player: target, foe: self, cause: self});
        utilities.healDamage(self, 10, {player: self, foe: target, cause: self});
    } else {
        var num = Math.floor(target.getMaxHp()) - 1;
        utilities.dealDamage(target, num, {player: target.owner, foe: self, cause: self});
        utilities.healDamage(self, num*2, {player: self, foe: target.owner, cause: self});
    }
};

var Stratholme_Reinforcements = function(red, blue, self) {
    printer.print("A group of undead appear to aid Mal'Ganis.");
    for(var i = 0; i < 2; i++) {
        utilities.summon(cards.Arthas_Ghoul(), self, {player: self, foe: red});
    }
    if(self.phase >= 16) {
        utilities.summon(cards.Arthas_FesteringAbomination(), self, {player: self, foe: red});
    }
};

var Stratholme_SleepWakeUp = function(source, context) {
    printer.print(source.color + " " + source.name + " wakes up.");
    context.player.minions.splice(context.player.minions.indexOf(source), 1);
    source.owner.minions.push(source);
    source.removeEffect(effects.cantattack);
    source.removeEffect(Stratholme_Sleep_Effect);
    source.removeEffect(Stratholme_Sleep_ReduceDmg);
    source.removeEffect(Stratholme_Sleep_Countdown);
    source.color = source.originalColor;
};

var Stratholme_Sleep_ReduceDmgAction = function(source, context) {
    return (context.damage * -1) + 1;
};

var Stratholme_Sleep_ReduceDmg = {
    name: "Psst, wake up",
    type: "pain interrupt",
    action: Stratholme_Sleep_ReduceDmgAction
};

var Stratholme_Sleep_Effect = {
    name: "Wha?",
    type: "pain",
    action: Stratholme_SleepWakeUp
};

var Stratholme_Sleep_BuffHp = {
    name: "Dreadlord Domination",
    type: "buff health",
    num: 4
};

var Stratholme_Sleep_BuffDmg = {
    name: "Dreadlord Domination",
    type: "buff damage",
    num: 4
};

var Stratholme_SleepTimerAction = function(source, context) {
    if(source.sleeptimer <= 1) {
        printer.print(source.color + " " + source.name + "'s mind is taken over by Mal'Ganis.");
        source.addEffect(Stratholme_Sleep_BuffHp);
        source.addEffect(Stratholme_Sleep_BuffDmg);
        source.removeEffect(effects.cantattack);
        source.removeEffect(Stratholme_Sleep_Effect);
        source.removeEffect(Stratholme_Sleep_ReduceDmg);
        source.removeEffect(Stratholme_Sleep_Countdown);
    } else {
        source.sleeptimer--;
        printer.print(source.color + " " + source.name + " is drifting deeper into Mal'Ganis' control! Timer now at " + source.sleeptimer + ".");
    }
};

var Stratholme_Sleep_Countdown = {
    name: "Tick tock",
    type: "start of turn",
    action: Stratholme_SleepTimerAction
};

var Stratholme_Sleep = function(red, blue, self) {
    var filter = [];
    for(var k = 0; k < 2; k++) {
        var player = k == 0 ? red : blue;
        for(var i = 0; i < player.minions.length; i++) {
            filter.push(player.minions[i]);
        }
    }
    
    var target = filter[Math.floor(Math.random() * filter.length)];
    if(target) {
        printer.print(self.name + " puts " + target.color + " " + target.name + " to sleep, pacifying and controlling them temporarily.");
        target.owner.minions.splice(target.owner.minions.indexOf(target), 1);
        self.minions.push(target);
        target.effects.push(Stratholme_Sleep_Effect);
        target.effects.push(Stratholme_Sleep_ReduceDmg);
        target.effects.push(Stratholme_Sleep_Countdown);
        target.effects.push(effects.cantattack);
        target["sleeptimer"] = 4;
        target["originalColor"] = target.color;
        target.color = "Entranced";
    } else {
        Stratholme_VampiricBite(red, blue, self);
    }
};

var Stratholme_PeopleOfStratholme = function(red, blue, self) {
    for(var i = 0; i < 2; i++) {
        var villager = Stratholme_Villager();
        villager["malganis"] = self;
        villager["timer"] = 6;
        utilities.summon(villager, self, {player: self, foe: red});
    }
};

var Stratholme_MalganisDisable = function(source, context) {
    var taunts = [
        "A curse upon you, Prince Arthas!",
        "I will return soon enough...",
        "Merely a setback!",
        "The soul of a demon never dies."
    ];
    printer.print("\nMal'Ganis: " + taunts[Math.floor(Math.random() * taunts.length)] + "\n");
    source.enabled = false;
    source.enableTimer = 6;
    source.addEffect(effects.immune);
    source.addEffect(effects.stealth);
    source.damageTaken = source.getMaxHp() - 1;
    for(var i in source.minions) {
        if(source.minions[i].name == "Villager") {
            source.minions[i].addEffect(effects.taunt);
        }
    }
    return 0;
};

var Stratholme_MalganisAvoidDeath = {
    name: "Avoid Death",
    type: "death interrupt",
    action: Stratholme_MalganisDisable
};

var Stratholme_VillagerRattleAction = function(source, context) {
    if(source.malganis) {
        if(context.cause.color == source.malganis.color) {
            source.malganis.malganisScore++;
        } else {
            source.malganis.arthasScore++;
        }
    }
};

var Stratholme_Villager_Deathrattle = {
    name: "You Get a Point!",
    type: "deathrattle",
    action: Stratholme_VillagerRattleAction
};

var Stratholme_Villager = function() {
    return utilities.makeMinion(false, "Uncollectible", "Sad Mystery", "Helpless", "Villager", 1, 0, 1, 0, false, false, false, [effects.sickness, Stratholme_Villager_Deathrattle], ais.true, Stratholme_Villager);
};

module.exports.Stratholme = function() {
    return utilities.withEffects({
        scenarioName: "The Purging of Stratholme",
        name: "Mal'Ganis",
        startOfMatch: {
            line:  "Arthas Menethil: No... Stratholme has been infected. We have to kill these citizens before they turn to undead...",
            greeting: Stratholme_Greeting,
            action: Stratholme_Action
        },
        endOfMatch: {
            line: "Mal'Ganis: Impressively done, boy. But we have unfinished business between us. Meet me in Northrend... there shall your fate be revealed.\n",
            victory: "With the defeat of Arthas and his forces, the city of Stratholme has fallen to Mal'Ganis.",
            action: endMatch
        },
        abilities: [Stratholme_Turn],
        defaultAbils: [Stratholme_VampiricBite, Stratholme_Reinforcements, Stratholme_Sleep],
        
        phase: 1,
        
        malganisScore: 0,
        arthasScore: 0,
        enabled: true,
        enableTimer: 0,
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Northrend",
        hero: {},
        baseHp: 100,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [effects.immune],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var Northrend_Action = function(red, blue, self) {
    
};

var Northrend_Greeting = function(player) {
    
};

var Northrend_Turn = function(red, blue, self) {
    if(self.malganisScore >= 30 || self.arthasScore >= 30) {
        if(self.malganisScore >= 30) {
            printer.print("Mal'Ganis: Perfect. I have the army I need. Now to wipe out the kingdom of Lordaeron...");
            endMatch(red, blue, self);
        } else {
            printer.print("Arthas Menethil: These villagers will not be your minions in death, demon!");
            self.removeEffect(effects.immune);
            self.removeEffect(Stratholme_MalganisAvoidDeath);
            utilities.dealDamage(self, 10000, {player: self, foe: red, cause: self});
        }
    }
    else {
        var villagerNum = 0;
        for(var i in self.minions) {
            if(self.minions[i].name == "Villager") {
                villagerNum++;
            }
        }
        printer.print("Arthas Score: " + self.arthasScore + " | Mal'Ganis Score: " + self.malganisScore + " | Villager Count: " + villagerNum);
        if(self.enabled) {
            self.removeEffect(effects.immune);
            self.phase++;
            
            var num = Math.floor(Math.random() * self.defaultAbils.length);
            if(self.defaultAbils[num]) {
                self.defaultAbils[num](red, blue, self);
            }
            
            attackWave(red, blue, self);
            for(var i in self.minions) {
                    if(self.minions[i].name == "Villager") {
                        if(self.minions[i].timer <= 0) {
                            printer.print("Mal'Ganis claims a Villager, transforming them into a zombie!");
                            utilities.kill(self.minions[i], {player: self, foe: red, cause: self});
                            utilities.summon(PlaguedVillages_Zombie(), self, {player: self, foe: red});
                        }
                        self.minions[i].timer--;
                    }
                }
        } else {
            if(self.enableTimer <= 0) {
                var taunts = [
                    "You thought yourself rid of me?",
                    "My work is not yet complete."
                ];
                printer.print("\nMal'Ganis: " + taunts[Math.floor(Math.random() * taunts.length)] + "\n");
                for(var i in self.minions) {
                    if(self.minions[i].name == "Villager") {
                        self.minions[i].removeEffect(effects.taunt);
                    }
                }
                self.enabled = true;
                self.damageTaken = 0;
                self.removeEffect(effects.immune);
                self.removeEffect(effects.stealth);
            } else {
                self.enableTimer--;
                printer.print("Tick tock, " + self.enableTimer);
            }
        }
        Stratholme_PeopleOfStratholme(red, blue, self);
    }
};

module.exports.Diablo20_Leoric = function() {
    return utilities.withEffects({
        scenarioName: "Diablo Event: Leoric",
        name: "Leoric",
        startOfMatch: {
            line:  "Leoric: Traitors, all of you!",
            greeting: Leoric_Greeting,
            action: Leoric_Action
        },
        endOfMatch: {
            line: "The Skeleton King crumbles into a pile of bones, his dark power expended.\n",
            victory: "Leoric: No mercy for those who disobey me.",
            action: endMatch
        },
        abilities: [Leoric_Turn],
        defaultAbils: [/**Leoric_SkeletalSwing,**/ Leoric_ShatteringStrike, Leoric_Entomb, Leoric_Unbury],
        
        phase: 1,
        enraged: false,
        cryptCollection: [],
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Cursed",
        hero: {},
        baseHp: 100,
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 0,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [Leoric_Resist, Leoric_Enrage],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var Leoric_Action = function(red, blue, self) {
    red.baseHp += 20;
    blue.baseHp += 20;
};

var Leoric_GetNum = function(self, num) { // if enraged Leoric deals 2x damage and has other empowered abilities
    return self.enraged ? num*2 : num;
};

var Leoric_ResistAction = function(source, context) {
    var resist = Leoric_GetNum(source, 2);
    var num = context.damage - resist;
    
    if(num <= 0 && context.damage > 0) { // if Leoric takes damage but it is fully absorbed
        var minimum = source.enraged ? 0.25 : 0.5;
        return (context.damage - minimum) * -1;
    }
    return resist * -1;
};

var Leoric_EnrageAction = function(source, context) {
    if(source.getHp() <= 30 && !source.enraged) {
        printer.print("Leoric: This treason will be rooted out!");
        printer.print("Leoric enrages.");
        source.enraged = true;
    }
};

var Leoric_Enrage = {
    name: "Skeleton King's Wrath",
    type: "pain",
    action: Leoric_EnrageAction
};

var Leoric_Resist = {
    name: "Skeleton King's Plating",
    type: "pain interrupt",
    action: Leoric_ResistAction
};

var Leoric_Greeting = function(player) {
    
};

var Leoric_Turn = function(red, blue, self) {
    self.defaultAbils[Math.floor(Math.random()*self.defaultAbils.length)](red, blue, self);
    if(self.phase % 8 == 0 && self.phase != 0) {
        var lines = [
            "Warriors of Khanduras, rise and serve your king once more!",
            "Your king is threatened! Guards, to arms!"
        ];
        printer.print("Leoric: " + lines[Math.floor(Math.random() * lines.length)]);
        printer.print("Leoric calls two Khanduran warriors to his side.");
        var num = Math.floor(self.phase / 8) + 1;
        for(var i = 0; i < num; i++) {
            utilities.summon(Leoric_KhanduranWarrior(), self, {player: self, foe: red, cause: self});
        }
    }
    if(self.phase % 17 == 0 && self.phase != 0) {
        var lines = [
            "Your audience is over!",
            "Bow before your king!"
        ];
        printer.print("Leoric: " + lines[Math.floor(Math.random() * lines.length)]);
        for(var i = 0; i < 3; i++) {
            if(red.isAlive() || blue.isAlive()) {
                Leoric_ShatteringStrike(red, blue, self, true);
            }
        }
    }
    attackWave(red, blue, self);
    self.phase++;
};

var Leoric_ShatteringStrike = function(red, blue, self, phase) {
    if(red.isAlive()) {
        var player = red;
    } else {
        player = blue;
    }
    var lines = [
        "",
    ];
    var targets = player.minions.slice();
    targets.push(player);
    var target = targets[Math.floor(Math.random() * targets.length)];
    if(!phase) {
        // printer.print("Leoric: " + lines[Math.floor(Math.random() * lines.length)]);
    }
    var num = Leoric_GetNum(self, 6);
    printer.print("Leoric strikes " + target.color + " " + target.name + " with a bone-shattering blow, dealing up to " + num + " damage based on their Health.");
    var dmg = Math.round(num * (target.getHp() / target.getMaxHp()));
    utilities.dealDamage(target, dmg, {player: self, foe: player, cause: self});
};

var Leoric_Entomb = function(red, blue, self) {
    var num = Leoric_GetNum(self, 1);
    var repeated = false;
    for(var i = 0; i < num; i++) {
        if(red.minions.length > 0) {
            var target = red;
        } else if(blue.minions.length > 0) {
            target = blue;
        }
        if(target) {
            var lines = [
                "I will bury you alive.",
                "Perhaps you will serve more loyally in death!"
            ];
            var minion = target.minions[Math.floor(Math.random() * target.minions.length)];
            if(minion) {
                if(i==0) {
                    printer.print("Leoric: " + lines[Math.floor(Math.random() * lines.length)]);
                }
                printer.print("Leoric entombs " + minion.color + " " + minion.name + ", burying them in his crypt.");
                utilities.kill(minion, {player: target, foe: self, cause: self});
                self.cryptCollection.push(minion.card());
            } else if(!repeated) {
                Leoric_ShatteringStrike(red, blue, self);
                repeated = true;
            }
        }
    }
};

var Leoric_Unbury = function(red, blue, self) {
    var lines = [
        "Soldier, rise and serve your king!",
        "King Leoric has need of you, soldier!",
    ];
    if(self.cryptCollection.length > 0) {
        var minion = self.cryptCollection[Math.floor(Math.random() * self.cryptCollection.length)];
        printer.print("Leoric: " + lines[Math.floor(Math.random() * lines.length)]);
        printer.print(minion.name + " claws its way out of its grave, reanimated to serve the Skeleton King.");
        minion.baseHp = Leoric_GetNum(self, minion.baseHp);
        minion.baseDamage = Leoric_GetNum(self, minion.baseDamage);
        utilities.summon(minion, self, {player: self, foe: red});
        self.cryptCollection.splice(self.cryptCollection.indexOf(minion));
    } else {
        Leoric_Entomb(red, blue, self);
    }
};

var Leoric_KhanduranWarriorResistAction = function(source, context) {
    if(context.damage <= 1) {
        if(context.damage <= 0) {
            return 0;
        }
        return (context.damage - 0.5) * -1;
    }
    return -1;
};

var Leoric_KhanduranWarriorResist = {
    name: "Khanduran Plating Plating",
    type: "pain interrupt",
    action: Leoric_KhanduranWarriorResistAction
};

var Leoric_KhanduranWarrior = function() {
    return utilities.makeMinion(false, "Uncollectible", "Diablo Event", ["Boss"], "Khanduran Warrior", 3, 0, 6, 3, false, false, false, [effects.sickness, effects.taunt, Leoric_KhanduranWarriorResist], ais.true, Leoric_KhanduranWarrior);
};

module.exports.Diablo20_Diablo = function() {
    return utilities.withEffects({
        scenarioName: "Diablo Event: Diablo",
        name: "Diablo",
        startOfMatch: {
            line:  "Diablo: Heaven will burn, and you with it.",
            greeting: Diablo_Greeting,
            action: Diablo_Action
        },
        endOfMatch: {
            line: "Diablo dissolves, leaving only the Black Soulstone behind...\n",
            victory: "Diablo: You have failed. Now watch in your dying moments as this world comes to an end.",
            action: endMatch
        },
        abilities: [Diablo_Turn],
        phaseAbils: {
            phase1: [Diablo_FireWave, Diablo_Swipe, Diablo_ShadowPrison],
            phase2: [Diablo_Swipe, Diablo_ShadowPrison]
        },
        currentAbils: [Diablo_FireWave, Diablo_Swipe, Diablo_ShadowPrison],
        
        mainPhase: 1,
        terrorPhase: 0,
        swipePhase: 0,
        
        turn: false,

        attackTarget: true,
        minionLifelink: true,
        mustDefeatBoth: true,
        coop: true,
        
        type: "hero",
        color: "Demonic",
        hero: {},
        baseHp: 66,
        
        damageTaken: 0,
        baseDamage: 0,
        damageLost: 0,
        armor: 66,
        maxMana: 0,
        mana: 0,
        lockedMana: 0,
        fatigue: 0,
        effects: [Diablo_PhaseChange],
        isPlayer: false,
        minions: [],
        hand: [],
        deck: function() { var decklist = []; for(var i = 0; i < 60; i++) { decklist.push(cards.AbusiveSergeant()); } return decklist; }(),
        graveyard: [], shallowGraves: [], cardsPlayed: [], discarded: [],

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

var Diablo_Action = function(red, blue, self) {
    for(var i = 0; i < 2; i++) {
        var player = (i == 0) ? red : blue;
        player.baseHp += 50;
        var originDeck = player.deck.slice();
        for(var j = 0; j < originDeck.length; j++) {
            player.deck.push(originDeck[j]);
            utilities.shuffle(player.deck);
        }
    }
};

var Diablo_PhaseChangeAction = function(source, context) {
    if(source.armor - context.damage <= 0 && source.mainPhase != 3) {
        if(source.mainPhase == 1) {
            printer.print("\nDiablo: Let us see how you fare in my Realm of Terror.");
            printer.print("The world darkens as Diablo pulls you into his realm.\n");
            source.mainPhase = 2;
            source.damageTaken = 0;
            source.armor = 66;
            source.name = "Shadow of Diablo";
            source.currentAbils = source.phaseAbils.phase2;
        } else {
            printer.print("\nYou are pulled back to the physical realm as the Shadow of Diablo is destroyed.");
            printer.print("Diablo: No! This world will BURN!\n");
            source.mainPhase = 3;
            source.damageTaken = 0;
            source.name = "Diablo";
            source.currentAbils = source.phaseAbils.phase1;
            source.currentAbils.push(Diablo_LightningBreath);
        }
    }
};

var Diablo_PhaseChange = {
    name: "Phase Change",
    type: "pain",
    action: Diablo_PhaseChangeAction
};

var Diablo_Greeting = function(player) {
    
};

var Diablo_Turn = function(red, blue, self) {
    self.currentAbils[Math.floor(Math.random()*self.currentAbils.length)](red, blue, self);
    attackWave(red, blue, self);
    if(self.getHp() <= 33 && self.swipePhase % 9 == 0) {
        var lines = [
            "Enough! This ends now!",
            "The heavens BURN around you!"
        ];
        printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
        for(var i = 0; i < 3; i++) {
            if(red.isAlive() || blue.isAlive()) {
                Diablo_Swipe(red, blue, self, true);
            }
        }
    }
    if(self.mainPhase == 2) {
        if(self.terrorPhase % 13 == 0) {
            Diablo_MakeShadowClone(red, blue, self);
        }
        self.terrorPhase++;
    }
};

var Diablo_FireWave = function(red, blue, self) {
    if(red.minions.length + blue.minions.length > 0) {
        var lines = [
            "",
        ];
        // printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
        printer.print(self.name + " launches a wave of fire outwards, damaging all minions.");
        for(var k = 0; k < 2; k++) {
            if(k == 0) {
                var target = red;
            } else {
                target = blue;
            }
            utilities.affectArray.damage(target.minions, 2, {player: target, foe: self, cause: self});
        }
    } else {
        Diablo_Swipe(red, blue, self);
    }
};

var Diablo_Swipe = function(red, blue, self) {
    var lines = [
        "",
    ];
    // printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
    printer.print(self.name + " quickly slashes at enemies twice, dealing 3 damage.");
    for(var i = 0; i < 2; i++) {
        if(red.isAlive() && blue.isAlive()) {
            if(Math.random() > 0.5) {
                var player = red;
            } else {
                player = blue;
            }
        }
        else if(red.isAlive()) {
            player = red;
        } else {
            player = blue;
        }
        if(player) {
            var targetList = player.minions.slice();
            targetList.push(player);
            var target = targetList[Math.floor(targetList.length * Math.random())];
            printer.print("Diablo strikes " + target.color + " " + target.name + ".");
            if(target.isAlive()) {
                utilities.dealDamage(target, 3, {player: player, foe: self, cause: self});
            }
        }
    }
};

var Diablo_LightningBreath = function(red, blue, self, phase) {
    var lines = [
        "",
    ];
    if(!phase) {
        // printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
    }
    var player = Math.random() > 0.5 ? (red.isAlive() ? red : blue) : (blue.isAlive() ? blue : red);
    printer.print(self.name + " breathes lightning at " + player.color + " " + player.name + "'s minions, dealing immense damage.");
    utilities.affectArray.damage(player.minions, 5, {player: self, foe: player, cause: self});
};

var Diablo_ShadowPrisonShatter = function(source, context) {
    printer.print(source.color + " " + source.name + " is freed from the Shadow Prison.");
    context.player.minions.splice(context.player.minions.indexOf(source), 1);
    source.originalOwner.minions.push(source);
    source.removeEffect(effects.cantattack);
    source.removeEffect(Diablo_ShadowPrison_Effect);
    source.removeEffect(Diablo_ShadowPrison_ReduceDmg);
    source.removeEffect(Diablo_ShadowPrison_Zap);
    source.color = source.originalColor;
    source.owner = source.originalOwner;
};

var Diablo_ShadowPrison_ReduceDmgAction = function(source, context) {
    if(context.cause != source) {
        return (context.damage * -1) + 1;
    }
    return 0;
};

var Diablo_ShadowPrison_ZapAction = function(source, context) {
    if(source.prisonTimer > 1) {
        source.prisonTimer--;
        printer.print(source.color + " " + source.name + "'s resistance weakens. Their timer is reduced to " + source.prisonTimer + ".");
    } else {
        printer.print("The shadow prison devours the soul of " + source.color + " " + source.name + ", killing them and forming a Demonic Shade.");
        utilities.kill(source, {player: context.player, foe: context.foe, cause: context.player});
        utilities.summon(Diablo_DemonicShade(), context.player, {player: context.player, foe: context.foe, cause: context.player});
    }
};

var Diablo_ShadowPrison_Zap = {
    name: "AGH IT BURNS",
    type: "end of turn",
    action: Diablo_ShadowPrison_ZapAction
};

var Diablo_ShadowPrison_ReduceDmg = {
    name: "Psst, wake up",
    type: "pain interrupt",
    action: Diablo_ShadowPrison_ReduceDmgAction
};

var Diablo_ShadowPrison_Effect = {
    name: "Wha?",
    type: "pain",
    action: Diablo_ShadowPrisonShatter
};

var Diablo_ShadowPrison = function(red, blue, self) {
    var filter = red.minions.slice();
    for(var i = 0; i < blue.minions.length; i++) {
        filter.push(blue.minions[i]);
    }
    
    if(filter.length > 0) {
        var lines = [
            "I have you now, little mortals.",
            "Ensnared within your own terror."
        ];
        printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
        var num = 1;
        for(i = 0; i < num; i++) {
            filter = red.minions.slice();
            for(var j = 0; j < blue.minions.length; j++) {
                filter.push(blue.minions[j]);
            }
            var target = filter[Math.floor(Math.random() * filter.length)];
            if(target) {
                printer.print(self.name + " ensnares " + target.color + " " + target.name + " in a shadow prison.");
                target.owner.minions.splice(target.owner.minions.indexOf(target), 1);
                self.minions.push(target);
                target.effects.push(Diablo_ShadowPrison_Effect);
                target.effects.push(Diablo_ShadowPrison_ReduceDmg);
                target.effects.push(Diablo_ShadowPrison_Zap);
                target.effects.push(effects.cantattack);
                target["originalColor"] = target.color;
                target["originalOwner"] = target.owner;
                target.owner = self;
                target["prisonTimer"] = target.getHp();
                target.color = "Ensnared";
            }
        }
    } else {
        Diablo_Swipe(red, blue, self);
    }
};

var Diablo_MakeShadowClone = function(red, blue, self) {
    if(red.isAlive()) {
        var target = red;
    } else {
        target = blue;
    }
    if(target.isAlive()) {
        var lines = [
            "You cannot defeat your own terror.",
            "How well do you know yourself?",
        ];
        printer.print(self.name + ": " + lines[Math.floor(Math.random() * lines.length)]);
        printer.print(self.name + " creates a shadow of " + target.color + " " + target.name + ".");
        var copy = Diablo_ShadowClone();
        copy.name = "Shadow of " + target.name;
        copy.baseHp = target.getMaxHp() + target.armor;
        copy.spellList = utilities.filterArray.hasType(target.hero.cardList, "spell");
        
        utilities.summon(copy, self, {player: self, foe: red, cause: self});
    }
};

var Diablo_ShadowCloneCastAction = function(source, context) {
    if(source.spellList) {
        var card = source.spellList[Math.floor(Math.random()*source.spellList.length)];
        if(typeof card == "function") {
            card = card();
        }
        if(!card) {
            throw new Error("WAT");
        }
        printer.print(source.name + " grants " + context.player.name + " the ability to cast " + card.name + ".");
        // casts the spell
        if(card.chooseAi) {
            var choice = card.chooseAi(filters.ChooseOne(context), context);
        }
        if(card.targetai) {
            if(!context.foe) {
                throw new Error("wut");
            }
            var target = card.targetai(card.filter({player: context.player, foe: context.foe, choice: choice}), {player: context.player, foe: context.foe, cause: card, choice: choice});
        }
        else {
            target = false;
        }
        if(typeof card.ability != "function") {
            throw new Error("Wat");
        }
        card.ability(target, {
            player: context.player,
            foe: context.foe,
            cause: card,
            choice: choice,
            target: /**function() { if(card.targetai) { return card.targetai(card.filter(context), context) } else { return false } }()**/ target
        });
    }
};

var Diablo_ShadowCloneCast = {
    name: "Shadow Clone Cast",
    type: "end of turn",
    action: Diablo_ShadowCloneCastAction
};

var Diablo_ShadowClone = function() {
    return utilities.makeMinion(false, "Uncollectible", "Diablo Event", ["Boss"], "Shadow Clone", 6, 0, 24, 6, false, false, false, [effects.sickness, effects.taunt, Diablo_ShadowCloneCast], ais.true, Diablo_ShadowClone);
};

var Diablo_DemonicShade = function() {
    return utilities.makeMinion(false, "Uncollectible", "Diablo Event", ["Boss"], "Demonic Shade", 3, 0, 8, 3, false, false, false, [effects.sickness, effects.taunt], ais.true, Diablo_DemonicShade);
};