var utilities = require('./utilities.js');
var printer = require('./printer.js')
var abilities = require('./abilities.js');
var ais = require('./AIs.js');
var targetais = require('./targetAIs.js');
var filters = require('./filters.js');
var effects = require('./effects.js');
var cardLists = require('./cardlists.js');

var removeTempBuff = module.exports.removeTempBuff = function(source, context) {
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i].name === "Temporary Damage" || source.effects[i].name === "Temporary Buff" || source.effects[i].name === "Remove Temporary Buff") {
            source.removeEffect(source.effects[i]);
            i--;
        }
    }
};

var removeTempEoT = module.exports.removeTempEoT = function(source, context) {
    var stillTemp = true;
    while(stillTemp) {
        stillTemp = false;
        for(var i in source.effects) {
            var eff = source.effects[i];
            if(eff.temp && eff.temp == "EoT") {
                source.removeEffect(eff);
                i--;
            }
        }
        for(var i in source.effects) {
            var eff = source.effects[i];
            if(eff.temp && eff.temp == "EoT") {
                stillTemp = true;
            }
        }
    }
};

var removeTempSoT = module.exports.removeTempSoT = function(source, context) {
    for(var i in source.effects) {
        var eff = source.effects[i];
        if(eff.temp && eff.temp == "SoT") {
            source.removeEffect(eff);
            i--;
        }
    }
};

module.exports.resist1 = function(source, context) {
    if(context.damage > 1) {
        return -1;
    }
    return 0;
};

module.exports.tempstealth = function(source, context) {
    for(var i = 0; i < source.effects.length; i++) {
        if(source.effects[i].name === "Stealth" && source.effects[i].type === "start of turn") {
            source.effects.splice(i, 1);
            i -= 1;
        }
    }
};

module.exports.GadgetzanAuctioneer = function(source, context) {
    printer.print(source.color + " " + source.name + " offers " + context.player.color + " " + context.player.name + " a deal and draws a card.");
    utilities.drawCard(context.player, context);
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

module.exports.CultMaster = function(source, context) {
    if(context.cause != source) {
        printer.print(source.color + " " + source.name + " revels in their ally's death, allowing " + context.player.color + " " + context.player.name + " to draw a card.");
        utilities.drawCard(context.player, context);
    }
};

module.exports.ShadeofNaxxramas = function(source, context) {
    source.addEffect(ShadeofNaxxramasHp);
    source.addEffect(ShadeofNaxxramasDamage);
    printer.print(source.color + " Shade of Naxxramas is empowered up to " + source.getDamage() + "/" + source.getHp() + ".");
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
    utilities.healDamage(source, source.getMaxHp(), context);
};

module.exports.MechWarper = function(source, context) {
    if(context.cause.race === "Mech") {
        return -1;
    }
    return 0;
};

module.exports.freezetarget = function(source, context) {
    context.cause.addEffect(effects.frozen);
    printer.print(source.color + " " + source.name + " Freezes " + context.target.color + " " + context.target.name + ".");
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

module.exports.ArcaneGiant = function(source, context) {
    var spells = [];
    for(var i = 0; i < context.player.graveyard.length; i++) {
        var card = context.player.graveyard[i];
        if(card.type == "spell") {
            spells.push(card);
        }
    }
    return -1 * spells.length;
};

module.exports.SkeletalSoldier = function(source, context) {
    for(var i in context.cause.effects) {
        var effect = context.cause.effects[i];
        if(effect.type == "deathrattle") {
            printer.print(source.color + " " + source.name + " bolsters " + context.player.color + " " + context.player.name + " with 2 Armor.");
            utilities.addArmor(context.player, 2, context);
            break;
        }
    }
};

var SkeletalSuppressorHp = {
    name: "Suppression",
    type: "buff health",
    num: 1
};

var SkeletalSuppressorDmg = {
    name: "Suppression",
    type: "buff damage",
    num: 1
};

module.exports.SkeletalSuppressor = function(source, context) {
    printer.print(source.color + " " + source.name + " grows in power, gaining +1/+1 (up to " + (source.getDamage()+1) + "/" + (source.getHp()+1) + ").");
    source.addEffect(SkeletalSuppressorHp);
    source.addEffect(SkeletalSuppressorDmg);
};

module.exports.KorkronBerserker = function(source, context) {
    printer.print(source.color + " " + source.name + " gets an adrenaline rush, gaining +1/+1 (up to " + (source.getDamage()+1) + "/" + (source.getHp()+1) + ").");
    source.addEffect(SkeletalSuppressorHp);
    source.addEffect(SkeletalSuppressorDmg);
};

module.exports.PlagueScientist = function(source, context) {
    if(context.foe.minions.length > 0) {
        var target = context.foe.minions[Math.floor(Math.random()*context.foe.minions.length)];
        printer.print(source.color + " " + source.name + " throws a volatile mixture at " + target.color + " " + target.name + ", dealing damage and reversing their Attack and Health.");
        utilities.dealDamage(target, 1, context);
        utilities.reverseStats(target);
        printer.print(target.color + " " + target.name + "'s stats reversed to " + target.getDamage() + "/" + target.getHp() + ".");
    }
};

module.exports.YmirjarWarrior = function(source, context) {
    if(context.target.hasEffectName("Frozen")) {
        return context.damage;
    }
    return 0;
};

var ScourgeNecromancer_Skeleton = function() {
    return utilities.makeMinion(false, "Uncollectible", "Icecrown Citadel", ["Neutral"], "Skeleton", 1, 0, 1, 1, false, false, false, [effects.sickness], ais.true, ScourgeNecromancer_Skeleton);
};

module.exports.ScourgeNecromancer = function(source, context) {
    if(context.player.shallowGraves.length > 0) {
        printer.print(source.color + " " + source.name + " reanimates a newly fallen corpse, summoning a 1/1 Skeleton.");
        utilities.summon(ScourgeNecromancer_Skeleton(), context.player, context);
    }
};

module.exports.ValkyrShadowguard = function(source, context) {
    printer.print(source.color + " " + source.name + " siphons life from its target, restoring " + (context.damage*2) + " Health to itself.");
    utilities.healDamage(source, context.damage*2, context);
};

module.exports.CultAdherent = function(source, context) {
    if(context.cause.type === "spell") {
        return 1;
    }
    return 0;
};

module.exports.BloodCrazedVampire = function(source, context) {
    if(context.target.isAlive() && context.target.type == "minion" && context.target.name.indexOf("Blood-Crazed") < 0 && !context.target.hasEffectName("Heroic")) {
        printer.print(source.color + " " + source.name + "'s bite transforms " + context.target.color + " " + context.target.name + " into a Blood-Crazed Vampire.");
        var vamp = source.card();
        vamp.owner = context.target.owner;
        vamp.baseHp = context.target.getHp();
        vamp.baseDamage = context.target.getDamage();
        vamp.addEffect(effects.BloodCrazedVampire);
        context.foe.minions.splice(context.foe.minions.indexOf(context.target), 1);
        utilities.summon(vamp, context.target.owner, {player: context.target.owner, foe: context.target.owner ==  context.player ? context.foe : context.player, cause: context.target.owner == context.player ? context.foe : context.player});
    }
};

module.exports.FrostQueensAttendant = function(source, context) {
    printer.print(source.color + " " + source.name + " restores Health to all friendly Dragons.");
    for(var i in context.player.minions) {
        var minion = context.player.minions[i];
        if(minion.race == "Dragon") {
            utilities.healDamage(minion, 2, context);
        }
    }
};

module.exports.Suppressor = function(source, context) {
    if(context.healing > 0) {
        printer.print(source.color + " " + source.name + " suppresses healing.");
        context.healing = 0;
    }
};

var RedeemerHp = {
    name: "Redeemed!",
    type: "set health",
    num: 1
};

var RedeemerDmg = {
    name: "Redeemed!",
    type: "set damage",
    num: 1
};

module.exports.ArgentRedeemer = function(source, context) {
    var minion = context.player.graveyard[context.player.graveyard.length-1];
    if(minion) {
        printer.print(source.color + " " + source.name + " redeems the spirit of " + minion.name + ", resummoning them as a 1/1.");
        minion.addEffect(RedeemerHp);
        minion.addEffect(RedeemerDmg);
        utilities.summon(minion, context.player, context);
    }
};

var getBloodBeastEffect = function(dmg) {
    return {
        name: "Temporary Damage",
        type: "buff damage",
        num: dmg
    };
};

module.exports.BloodBeast = function(source, context) {
    printer.print(source.color + " " + source.name + " grants " + context.damage + " Attack to " + context.player.color + " " + context.player.name + ".");
    context.player.addEffect(getBloodBeastEffect(context.damage));
    context.player.addEffect(effects.removeTempBuff);
};

module.exports.FleshEatingInsect = function(source, context) {
    if(context.player.minions.length < 7 && !source.isNew) {
        printer.print(source.color + " " + source.name + " calls in another member of its swarm.");
        var insect = source.card();
        insect.isNew = true;
        utilities.summon(insect, context.player, context);
    }
    source.isNew = false;
};

module.exports.FleshGiant = function(source, context) {
    var minions = [];
    for(var i = 0; i < 2; i++) {
        if(i==0) {
            var char = context.player;
        } else {
            char = context.foe;
        }
        for(var j in char.graveyard) {
            var card = char.graveyard[j];
            if(card.type == "minion") {
                minions.push(card);
            }
        }
    }
    return -1 * minions.length;
};

module.exports.LadyDeathwhisper = function(source, context) {
    if(context.player.maxMana < 10) {
        printer.print(source.color + " " + source.name + " bestows mana upon " + context.player.color + " " + context.player.name + ", creating an empty mana crystal.");
        context.player.maxMana++;
    }
};

module.exports.OrgrimsHammer = function(source, context) {
    printer.print(source.color + " " + source.name + " fires a burst of missiles at its enemies!");
    for(var i = 0; i < 6; i++) {
        var target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        utilities.dealDamage(target, 1, {player: context.player, foe: context.foe, cause: source});
        if(target.getHp() < 0) {
            i -= 1;
        }
    }
};

module.exports.TheSkybreaker = function(source, context) {
    printer.print(source.color + " " + source.name + " fires at enemies with its cannon!");
    for(var i = 0; i < 2; i++) {
        var target = context.foe;
        var targetRoll = Math.floor((context.foe.minions.length + 1) * Math.random(0, 1));
        if(targetRoll < context.foe.minions.length) {
            target = context.foe.minions[targetRoll];
        }
        else {
            target = context.foe;
        }
        utilities.dealDamage(target, 4, {player: context.player, foe: context.foe, cause: source});
        if(target.getHp() < 0) {
            i -= 1;
        }
    }
};

module.exports.DeathbringerSaurfang = function(source, context) {
    if(context.cause.battlecry) {
        if(context.cause.filter) {
            var targets = context.cause.filter(context);
            var target = targets[Math.floor(Math.random() * targets.length)];
        }
        context.cause.battlecry(target, context.cause, context);
    }
};

module.exports.ProfessorPutricide = function(source, context) {
    if(context.cause.type == "minion" && context.cause != source) {
        if(context.cause.isAlive()) {
            printer.print(source.color + " " + source.name + " throws a mixture at " + context.cause.color + " " + context.cause.name + ".");
            utilities.reverseStats(context.cause);
            printer.print("Stats reversed to " + context.cause.getDamage() + "/" + context.cause.getHp() + ".");
        }
    }
};

module.exports.PrinceValanar = function(source, context) {
    if(context.attacker.getHp() >= context.attacker.getMaxHp() && context.attacker != source && context.attacker.type == "minion") {
        printer.print(source.color + " " + source.name + " invokes a bloodlink with " + context.attacker.color + " " + context.attacker.name + ", dealing 1 damage.");
        utilities.dealDamage(context.attacker, 1, context);
    }
};

module.exports.PrinceKeleseth = function(source, context) {
    if(context.attacker != source && context.attacker.type == "minion") {
        printer.print(source.color + " " + source.name + " invokes a bloodlink with " + context.attacker.color + " " + context.attacker.name + ", dealing 2 damage and granting Immunity for a turn.");
        utilities.dealDamage(context.attacker, 2, context);
        context.attacker.addEffect(effects.tempImmune);
        context.attacker.addEffect(effects.removeTempEoT);
    }
};

module.exports.PrinceTaldaram = function(source, context) {
    if(context.attacker.getHp() >= context.attacker.getDamage() && context.attacker != source && context.attacker.type == "minion") {
        printer.print(source.color + " " + source.name + " invokes a bloodlink with " + context.attacker.color + " " + context.attacker.name + ", dealing 1 damage.");
        utilities.dealDamage(context.attacker, 1, context);
    }
};

module.exports.BloodQueenLanathel = function(source, context) {
    if(context.target.isAlive() && context.target.type == "minion") {
        printer.print(source.color + " " + source.name + "'s bite transforms " + context.target.color + " " + context.target.name + " into a " + source.color + " Blood-Crazed Vampire.");
        var vamp = context.target.card();
        vamp.name = "Blood-Crazed " + vamp.name;
        vamp.owner = source.owner;
        vamp.baseHp = context.target.getHp();
        vamp.baseDamage = context.target.getDamage();
        vamp.addEffect(effects.BloodCrazedVampire);
        context.target.owner.minions.splice(context.target.owner.minions.indexOf(context.target), 1);
        utilities.summon(vamp, context.player, {player: context.player, foe: context.foe, cause: context.player});
    }
};

var Dream_EmeraldDrake = function() {
    return utilities.makeMinion("Dragon", "Uncollectible", "Classic", ["Dream"], "Emerald Drake", 4, 0, 6, 7, false, false, false, [effects.sickness], ais.true, Dream_EmeraldDrake);
};

var Dream_YseraAwakens_Abil = function(target, context) {
    printer.print("The " + context.player.color + " " + context.player.name + " invokes Ysera's wrath, casting Ysera Awakens and dealing 5 damage to all characters except Ysera.");
    var targets = context.player.minions.slice();
    for(var i in context.foe.minions) {
        targets.push(context.foe.minions[i]);
    }
    for(i in targets) {
        if(targets[i].name != "Ysera" && targets[i].name != "Valithria Dreamwalker") {
            utilities.dealSpellDamage(targets[i], 5, context);
        }
        if(!targets[i].isAlive()) {
            i--;
        }
    }
};

var Dream_YseraAwakens_Ai = function(context) {
    var value = 0;
    for (var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name != "Ysera" && context.player.minions[i].name != "Valithria Dreamwalker") {
            value--;
            if(context.player.minions[i].getHp() <= 5) {
                value--;
            }
        }
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].name != "Ysera" && context.foe.minions[i].name != "Valithria Dreamwalker") {
            value += 1;
            if(context.foe.minions[i].getHp() <= 5) {
                value++;
            }
        }
    }
    if (value > 2) {
        return true;
    }
    return false;
};

var Dream_YseraAwakens = function() {
    return utilities.makeSpell("Uncollectible", "Classic", ["Dream"], "Ysera Awakens", 2, 0, Dream_YseraAwakens_Abil, false, false, Dream_YseraAwakens_Ai, Dream_YseraAwakens);
};

var DreamCards = [
    Dream_EmeraldDrake,
    Dream_YseraAwakens
];

module.exports.ValithriaDreamwalker = function(source, context) {
    printer.print(source.color + " " + source.name + " is renewed and grants " + context.player.color + " " + context.player.name + " a Dream card.");
    var card = DreamCards[Math.floor(Math.random()*DreamCards.length)]();
    printer.print("A portal to the Emerald Dream gives " + context.player.color + " " + context.player.name + " " + card.name + ".");
    utilities.addCard(card, context.player, context);
};

module.exports.Sindragosa = function(source, context) {
    printer.print(source.color + " " + source.name + " sends waves of frost across the board, damaging all Frozen enemies.");
    for(var i in context.foe.minions) {
        var minion = context.foe.minions[i];
        if(minion.hasEffectName("Frozen")) {
            utilities.dealDamage(minion, 2, context);
        }
    }
    if(context.foe.hasEffectName("Frozen")) {
        utilities.dealDamage(context.foe, 2, context);
    }
};

module.exports.EchoOfArthas = function(source, context) {
    var index = context.foe.minions.indexOf(context.cause);
    if(!source.inProgress) {
        source.inProgress = true;
        if(context.foe.minions.length > 1) {
            printer.print(source.color + " " + source.name + " blasts the minions adjacent to " + context.cause.color + " " + context.cause.name + " with the chill of the Frozen Throne, damaging and freezing them.");
            if(context.foe.minions[index-1] && context.foe.minions[index-1].isAlive()) {
                utilities.dealDamage(context.foe.minions[index-1], 2, context);
                if(context.foe.minions[index-1]) {
                    context.foe.minions[index-1].addEffect(effects.frozen);
                }
            }
            if(context.foe.minions[index+1] && context.foe.minions[index+1].isAlive()) {
                utilities.dealDamage(context.foe.minions[index+1], 2, context);
                if(context.foe.minions[index+1]) {
                    context.foe.minions[index+1].addEffect(effects.frozen);
                }
            }
        }
        source.inProgress = false;
    }
};

module.exports.EchoOfNerzhul = function(source, context) {
    if(context.cause != source) {
        var allCards = cardLists.allCards();
        var valid = [];
        for(var i in allCards) {
            var card = allCards[i]();
            if(card.cardSet == "Icecrown Citadel") {
                valid.push(card);
            }
        }
        card = valid[Math.floor(Math.random() * valid.length)];
        printer.print(source.color + " Echo of Ner'zhul draws power from " + context.cause.name + "'s death and adds " + card.name + " to " + context.player.color + " " + context.player.name + "'s hand.");
        utilities.addCard(card, context.player, context);
    }
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
    var copy = context.minion.card();
    printer.print(source.color + " Secret triggered - Mirror Entity!");
    printer.print(source.color + " " + source.name + " summons a copy of " + context.minion.name + "!");
    utilities.summon(copy, context.player, context);
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
            if(!context.cause || !context.cause.card) {
                console.log("debug");
            }
            source.hand.push(context.cause.card());
            printer.print("Card added to hand: " + context.cause.name + ".");
        }
        else {
            printer.print("Hand too full! Could not receive new card.");
        }
    }
};

module.exports.IceBlock = function(source, context) {
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

module.exports.SkybreakerSorcerer = function(source, context) {
    printer.print(source.color + " " + source.name + " Freezes " + context.target.name + ".");
    context.target.addEffect(effects.frozen);
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

module.exports.Shadowmourne = function(source, context) {
    printer.print(source.color + " " + source.weapon.name + " releases a burst of darkness, damaging all enemies.");
    for(var i = 0; i < context.foe.minions.length; i++) {
        var min = context.foe.minions[i];
        utilities.dealDamage(min, 2, context);
        if(!min.isAlive()) {
            i--;
        }
    }
    utilities.dealDamage(context.foe, 2, context);
};

module.exports.BloodhoofBrave = function(source, context) {
    if(source.getHp() < source.getMaxHp()) {
        return 3;
    }
    return 0;
};

module.exports.GrimyGadgeteer = function(source, context) {
    var targets = [];
    for (var i = 0; i < context.player.hand.length; i++) {
        if (context.player.hand[i].type == "minion") {
            targets.push(context.player.hand[i]);
        }
    }
    var target = targets[Math.floor(Math.random() * targets.length)];
    if (target) {
        target.addEffect(GrimyGadgeteerHp);
        target.addEffect(GrimyGadgeteerDmg);
        printer.print(source.color + " Grimy Gadgeteer sticks gears onto " + target.name + " in " + context.player.color + " " + context.player.name + "'s hand, giving them +2/+2 (up to " + target.getDamage() + "/" + target.getHp() + ").");
    }
};

var GrimyGadgeteerHp = {
    name: "Gadgets",
    type: "buff health",
    num: 2
};

var GrimyGadgeteerDmg = {
    name: "Gadgets",
    type: "buff damage",
    num: 2
};

module.exports.AlleyArmorsmith = function(source, context) {
    if(context.cause == source) {
        printer.print(source.color + " " + source.name + " forges " + context.damage + " Armor for " + context.player.color + " " + context.player.name + ".");
        utilities.addArmor(context.player, context.damage, context);
    }
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

var AccursedShadeDmg = {
    name: "Accursed Shade",
    type: "buff damage",
    num: 2
};

var AccursedShadeHp = {
    name: "Accursed Shade",
    type: "buff health",
    num: 1
};

module.exports.AccursedShade = function(source, context) {
    if(source.hasEffectName("Stealth")) {
        printer.print(source.color + " " + source.name + " feeds off death energy, gaining +2/+1 (up to " + (source.getDamage()+2) + "/" + (source.getHp()+1) + ").");
        source.addEffect(AccursedShadeDmg);
        source.addEffect(AccursedShadeHp);
    };
};

module.exports.CrokScourgebane = function(source, context) {
    if(source.isAlive()) {
        printer.print(source.color + " " + source.name + " enters an Ice Block, gaining Immunity until the end of the turn.");
        source.addEffect(effects.tempImmune);
        source.addEffect(effects.removeTempEoT);
    }
};

module.exports.HealingTideTotem = function(source, context) {
    printer.print(source.color + " " + source.name + "'s Healing Tide restores 1 health to all friendly minions.");
    for(var i = 0; i < context.player.minions.length; i++) {
        utilities.healDamage(context.player.minions[i], 1, context);
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

var TectusHp = {
    name: "Tectus",
    type: "buff health",
    num: 1
};

var TectusDmg = {
    name: "Tectus",
    type: "buff damage",
    num: 1
};

var TectusRattleAction = function(source, context) {
    if(!source.hasShattered) {
        var num = utilities.filterArray.hasName(source.effects, "MOUNTAINS").length;
        printer.print(source.color + " " + source.name + " shatters into " + num + " shards.");
    }
    source.hasShattered = true;
    var minion = source.card();
    minion.name = "Shard of " + minion.name;
    utilities.summon(minion, context.player, context);
};

var TectusRattle = {
    name: "MOUNTAINS",
    type: "deathrattle",
    action: TectusRattleAction
};

module.exports.Tectus = function(source, context) {
    printer.print(source.color + " " + source.name + " absorbs power from the earth, growing up to " + (source.getDamage() + 1) + "/" + (source.getHp() + 1) + " and acquiring a new Shard.");
    source.addEffect(TectusHp);
    source.addEffect(TectusDmg);
    source.addEffect(TectusRattle);
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

var GahzrillaApply = function(source, damage) {
    return damage;
};

var GahzrillaBuff = {
    name: "Gahz'rilla's Fury",
    type: "buff damage",
    num: GahzrillaApply
};

module.exports.DruidoftheTalon = function(source, context) {
    printer.print(source.color + " " + source.name + " transforms into a Storm Crow with Charge and Stealth.");
    var card = source.crow();
    card.druid = source.card;
    card.damageTaken = source.damageTaken;
    if(card.damageTaken > card.getMaxHp()) {
        card.damageTaken = card.getMaxHp() - 1;
    }
    card.owner = source.owner;
    card.color = source.color;
    context.player.minions.splice(context.player.minions.indexOf(source),1,card);
};

module.exports.StormCrow = function(source, context) {
    printer.print(source.color + " " + source.name + " transforms into a Druid of the Talon with Spell Damage +1.");
    var card = source.druid();
    card.crow = source.card;
    card.damageTaken = source.damageTaken;
    if(card.damageTaken > card.getMaxHp()) {
        card.damageTaken = card.getMaxHp() - 1;
    }
    card.owner = source.owner;
    card.color = source.color;
    context.player.minions.splice(context.player.minions.indexOf(source),1,card);
};

module.exports.BlackheartTheInciter = function(source, context) {
    if(context.target.type == "minion") {
        var targets = [context.foe];
        for(var i in context.foe.minions) {
            if(context.player.minions[i] != context.target) {
                targets.push(context.foe.minions[i]);
            }
        }
        var target = targets[Math.floor(Math.random()*targets.length)];
        printer.print(source.color + " " + source.name + " incites madness in " + context.target.color + " " + context.target.name + ", forcing them to attack " + target.color + " " + target.name + ".");
        utilities.Attack(context.target, target, {
            player: context.foe,
            foe: context.player
        });
    }
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
    return utilities.makeMinion(false, "Rare", "Blackrock Mountain", color, "Grim Patron", 5, 0, 3, 3, false, false, false, [sickness, GrimPatronEffect], ais.GrimPatron, GrimPatron);
};

var Gnoll = function(color) {
    return utilities.makeMinion(false, "Basic", "Whispers of the Old Gods", color, "Gnoll", 2, 0, 2, 2, false, false, false, [effects.sickness, effects.taunt], ais.MurlocRaider, Gnoll);
};

var Fireball = function() {
    return utilities.makeSpell("Basic", "Classic", false, "Fireball", 4, 0, abilities.Fireball, targetais.Fireball, filters.any, ais.Fireball, Fireball);
};

var sickness = {
    name: "Summoning Sickness",
    type: "sickness"
};

// Custom Sets

module.exports.C_SkybreakerSorcerer = function(source, context) {
    context.target.addEffect(effects.frozen);
};

module.exports.C_CultAdherent = function(source, context) {
    if(context.cause.type === "spell") {
        return 1;
    }
    return 0;
};

module.exports.LadyDeathwhisperManaBarrier = function(source, context) {
    if(context.cause.maxMana > 0) {
        context.cause.maxMana -= 1;
        context.cause.mana -= 1;
        context.cause.damageTaken = 0;
        printer.print(context.cause.color + " Lady Deathwhisper's Mana Barrier prevents lethal damage and restores her to "
        + context.cause.baseHp + " health at the cost of a Mana Crystal! Her barrier can withstand " + context.cause.maxMana + " more assaults.");
        return 0;
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
    return context.damage;
};

module.exports.C_DeformedFanatic = function(source, context) {
    return 0;
};

module.exports.Arthas_DwarvenRifleman = function(source, context) {
    if(context.player.turn == true && context.foe.turn == false) {
        return 0;
    }
    return context.damage;
};

module.exports.Arthas_MortarTeam = function(source, context) {
    var targets = context.foe.minions;
    if(targets.length == 0) {
        var target = context.foe;
    } else {
        target = targets[Math.floor(Math.random() * targets.length)];
    }
    printer.print(source.color + " " + source.name + " fires a mortar blast at " + target.color + " " + target.name + ", dealing " + source.getDamage() + " damage.");
    utilities.dealDamage(target, source.getDamage(), context);
};

module.exports.Arthas_SteamEngine = function(source, context) {
    var dmg = context.damage - 3;
    if(dmg <= 0) {
        return 0;
    }
    return dmg;
};

module.exports.Arthas_Necromancer = function(source, context) {
    if(context.cause.race != "Undead" && context.cause.race != "Mech" && context.cause != source && context.cause.corpse == true) {
        printer.print(source.color + " " + source.name + " reanimates the fallen " + context.cause.name + " as a Skeletal Warrior under their control.");
        context.cause["corpse"] == false;
        utilities.summon(Arthas_Necromancer_SkeletalWarrior);
    }
};

var Arthas_Necromancer_SkeletalWarrior = function() {
    return utilities.makeMinion("Undead", "Uncollectible", "Arthas", false, "Skeletal Warrior", 1, 0, 2, 1, false, false, false, [effects.sickness], ais.true, Arthas_Necromancer_SkeletalWarrior);
};

module.exports.Arthas_FesteringAbomination = function(source, context) {
    if(Math.random() > 0.5) {
        return context.damage * 2;
    }
    return context.damage;
};