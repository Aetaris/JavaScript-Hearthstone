var stealth = function(context) { // Prevents spells from targeting anything with Stealth
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].hasEffectName("stealth")) {
            array.push(context.player.minions[i]);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].hasEffectName("stealth")) {
            array.push(context.foe.minions[i]);
        }
    }
    return array;
};

var finalize = function(array, context) { // Removes stealthed minions from the target array; could do more in the future
    var toRemove = stealth(context);
    var originalArray = array.slice();
    for(var i = 0; i < originalArray.length; i++) {
        for(var j = 0; j < toRemove.length; j++) {
            if(originalArray[i] == toRemove[j]) {
                array.splice(array.indexOf(originalArray[i]));
            }
        }
    }
    return array;
};

module.exports.Attack = function(context) { // Used for attacking minions (except things like Icehowl)
    var targetables = [context.foe];
    var hasTaunt = false;
    var taunts = [];
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].hasEffectName("Immune")) {
            continue;
        }
        if(context.foe.minions[i].hasEffectName("Taunt")) {
            hasTaunt = true;
            taunts.push(context.foe.minions[i]);
        }
        if(!hasTaunt && !context.foe.minions[i].hasEffectName("Stealth")) {
            targetables.push(context.foe.minions[i]);
        }
    }
    if (taunts.length > 0) {
        targetables = taunts;
    }
    return targetables;
};

module.exports.any = function(context) { // Can target any player or minion
    var array = [context.player, context.foe];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        array.push(minion);
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        array.push(minion);
    }
    return finalize(array, context);
};

module.exports.minion = function(context) { // Can target any minion
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        array.push(minion);
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        array.push(minion);
    }
    return finalize(array, context);
};

module.exports.ally = function(context) { // Can target any friendly character
    var array = [context.player];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        array.push(minion);
    }
    return finalize(array, context);
}

module.exports.allyMinion = function(context) { // Can target friendly minions
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        array.push(minion);
    }
    return finalize(array, context);
};

module.exports.enemyMinion = function(context) { // Can target enemy minions
    var array = [];
    for(var i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        array.push(minion);
    }
    return finalize(array, context);
};

module.exports.player = function(context) { // Can target either player
    var array = [context.player, context.foe];
    return finalize(array, context);
};

module.exports.Execute = function(context) { // Can only target damaged enemy minions
    var array = [];
    for(var i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        if(minion.damageTaken > 0) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.Backstab = function(context) { // Can only target undamaged minions
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.damageTaken == 0) {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.damageTaken == 0) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.ShadowStrike = function(context) { // Can only target undamaged characters
    var array = [];
    if(context.player.damageTaken == 0) {
        array.push(context.player);
    }
    if(context.foe.damageTaken == 0) {
        array.push(context.foe);
    }
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.damageTaken == 0) {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.damageTaken == 0) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.ShadowWordPain = function(context) { // Can only target minions with < 4 attack
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.getDamage() < 4) {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.getDamage() < 4) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.ShadowWordDeath = function(context) { // Can only target minions with > 4 attack
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.getDamage() > 4) {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.getDamage() > 4) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.BigGameHunter = function(context) { // Can only target minions with > 6 attack
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.getDamage() > 6) {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.getDamage() > 6) {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports.Deathwhisper_DarkTransformation = function(context) { // Can only target Cult Fanatics
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.name == "Cult Fanatic") {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.name == "Cult Fanatic") {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.Deathwhisper_DarkEmpowerment = function(context) { // Can only target Cult Adherents
    var array = [];
    for(var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        if(minion.name == "Cult Adherent") {
            array.push(minion);
        }
    }
    for(i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        if(minion.name == "Cult Adherent") {
            array.push(minion);
        }
    }
    return finalize(array, context);
};

module.exports.Arthas_FlashofLight = function(context) { // Can target allies or enemy Undead
    var array = [];
    if(!context.player.race || context.player.race != "Undead") {
        array.push(context.player);
    }
    for(i in context.player.minions) {
        if(context.player.minions[i].race != "Undead") {
            array.push(context.player.minions[i]);
        }
    }
    for(var i in context.foe.minions) {
        if(context.foe.minions[i].race == "Undead") {
            array.push(context.foe.minions[i]);
        }
    }
    return finalize(array, context);
};