var removeAllies = function(array, color) { // Takes in a targets array, returns a targets array without allies. Useful for purely negative spells.
    if(!array || !array.slice) {
        throw new Error("broken");
    }
    var originalArray = array.slice();
    for(var i = 0; i < originalArray.length; i++) {
        if(originalArray[i].color == color) {
            array.splice(array.indexOf(originalArray[i]), 1);
        }
    }
    return array;
};

var removeEnemies = function(array, color) { // Takes in a targets array, returns a targets array without enemies. Useful for purely positive spells.
    var originalArray = array.slice();
    for(var i = 0; i < originalArray.length; i++) {
        if(originalArray[i].color !== color) {
            array.splice(array.indexOf(originalArray[i]), 1);
        }
    }
    return array;
};

module.exports.MageFireblast = function(targets, context) {
    if(!context.player) {
        throw new Error("broken");
    }
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(!targets[i].getHp) {
            throw new Error("broken");
        }
        if(targets[i].getHp() === 1 || (targets[i].getHp() + targets[i].getDamage()) > 5) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.PriestLesserHeal = function(targets, context) {
    // var targets = removeEnemies(targets, context.player.color);
    var target = context.player;
    var maxHpGap = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp() - maxHpGap) {
            target = context.player.minions[i];
            maxHpGap = context.player.minions[i].getMaxHp() - context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.WhirlingBlades = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var maxHealth = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() > maxHealth) {
            target = context.player.minions[i];
            maxHealth = context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.ArmorPlating = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var maxDamage = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getDamage() > maxDamage) {
            target = context.player.minions[i];
            maxDamage = context.player.minions[i].getDamage();
        }
    }
    return target;
};

module.exports.RustyHorn = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var maxHealth = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() > maxHealth) {
            target = context.player.minions[i];
            maxHealth = context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.EmergencyCoolant = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    var maxDamage = 0;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getDamage() > maxDamage) {
            target = targets[i];
            maxDamage = targets[i].getDamage();
        }
    }
    return target;
};

module.exports.FinickyCloakfield = function(targets, context) {
    var target = false;
    var maxDamage = 0;
    var minHealth = 50;
    for(var i = 0; i < context.player.minions.length; i++) {
        if((context.player.minions[i].getDamage() >= maxDamage && context.player.minions[i].getHp() <= 3)
        || (context.player.minions[i].getHp() <= minHealth && context.player.minions[i].getDamage() >= 3)) {
            target = context.player.minions[i];
        }
        if(context.player.minions[i].getDamage() >= maxDamage) {
            maxDamage = context.player.minions[i].getDamage();
        }
        if(context.player.minions[i].getHp() <= minHealth) {
            minHealth = context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.ReversingSwitch = function(targets, context) {
    var target = context.foe;
    var targetRoll = Math.floor((targets.length) * Math.random(0, 1));
    if(targetRoll < targets.length) {
        target = targets[targetRoll];
    }
    return target;
};

module.exports.TimeRewinder = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var hpGap = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp() - hpGap || context.player.minions[i].battlecry) {
            target = context.player.minions[i];
        }
    }
    return target;
};
module.exports.AbusiveSergeant = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var maxHealth = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() > maxHealth) {
            target = context.player.minions[i];
            maxHealth = context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.BlackwingCorruptor = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    var hasDragon = false;
    for(var i = 0; i < context.player.hand.length; i++) {
        if(context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if(hasDragon) {
        var target = context.foe;
        for(var i = 0; i < targets.length; i++) {
            if((targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() > 1) {
                target = targets[i];
            }
        }
        return target;
    }
    return target;
};

module.exports.Fireball = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() > 3 && targets[i].getDamage() > 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Polymorph = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    var maxDmg = 0;
    var maxHp = 0;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() > 3 || targets[i].getHp() > maxHp) || (targets[i].getDamage() > 2 || targets[i].getDamage() > maxDmg)) {
            if(targets[i].dmg > maxDmg) {
                maxDmg = targets[i].dmg;
            }
            if(targets[i].getHp() > maxHp) {
                maxHp = targets[i].getHp();
            }
            target = targets[i];
        }
    }
    return target;
};

module.exports.Frostbolt = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() > 1) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.ConeofCold = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 5 || (targets[i].getHp() < 2 && i > 0)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Execute = function(targets, context) {
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() < targets[i].getMaxHp() && ((targets[i].getHp() + targets[i].getDamage()) >= 10 || !target)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Backstab = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() === targets[i].getMaxHp() && ((targets[i].getHp() + targets[i].getDamage()) >= 4) || !target || target.getHp() <= 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Sap = function(targets, context) {
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) > (target.getHp() + target.getDamage()) || target === context.foe) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Shiv = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() === 1 && (targets[i].getDamage() >= target.getDamage() || target === context.foe)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Crackle = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(((targets[i].getHp() + targets[i].getDamage()) > (target.getHp() + target.getDamage()) && targets[i].getHp() <= 6 ) || target === context.foe) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.LavaBurst = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 5 && targets[i].getHp() > 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.ExplosiveShot = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 5 && targets[i].getHp() > 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.ArcaneShot = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() <= 2 || ((targets[i].getHp() + targets[i].getDamage()) > 6 && targets[i].getHp() < 5)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.CobraShot = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() > 1) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.HuntersMark = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() > target.getHp() || target === context.foe) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Swipe = function(targets, context) {
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() > 2 && (targets[i].getDamage() > target.getDamage() || target.type !== "hero")) {
            target = targets[i];
        }
    }
    if(context.foe.getHp() <= 4) {
        return context.foe;
    }
    return target;
};

module.exports.Moonfire = function(targets, context) {
    targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() === 1 || (targets[i].getHp() + targets[i].getDamage()) > 5) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.LivingRoots = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() <= 2 || ((targets[i].getHp() + targets[i].getDamage()) > 6 && targets[i].getHp() < 5)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Wrath = function(targets, context) {
    targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(context.choice==1 || context.choice==2 && (targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() <= 3 && targets[i].getHp() > 1) {
            target = targets[i];
        } else if(context.choice==0 && targets[i].getHp() == 1 && targets[i].getDamage() >= 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.AncientofLore = function(targets, context) {
    targets = removeEnemies(targets, context.player.color);
    var target = context.player;
    var maxHpGap = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp() - maxHpGap) {
            target = context.player.minions[i];
            maxHpGap = context.player.minions[i].getMaxHp() - context.player.minions[i].getHp();
        }
    }
    return target;
};

module.exports.Darkbomb = function(targets, context) {
    targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() > 1) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.ShadowBolt = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].getHp() <= 4 && targets[i].getDamage() >= 3) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.MortalCoil = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) > 1 && targets[i].getHp() === 1) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Shadowflame = function(targets, context) {
    var target = context.foe;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getDamage() > target.getDamage() || target === context.foe) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.BlessingofKings = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    var highestValue = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if((context.player.minions[i].getHp() + context.player.minions[i].getDamage()) > highestValue) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.HammerofWrath = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() === 3 || (targets[i].getHp() < 9 && targets[i].getDamage() > 2)) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.PowerWordShield = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].getDamage() >= 6 && context.player.minions[i].getHp() <= 3) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.ShadowWordPain = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getDamage() <= 3) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.ShadowWordDeath = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getDamage() >= 5 && targets[i].getHp() > 3) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Entomb = function(targets, context) {
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() > 3 && targets[i].getDamage() > 2) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.VelensChosen = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(!target || (context.player.minions[i].getHp() < target.getHp() && context.player.minions[i].getDamage() >= 2)) {
            target = context.player.minions[i];
        }
    }
    return target;
};

// Custom Sets

module.exports.C_DarkEmpowerment = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Cult Adherent") {
            if(!target || context.player.minions[i].getHp() < target.getHp()) {
                target = context.player.minions[i];
            }
        }
    }
    return target;
};

module.exports.C_DarkTransformation = function(targets, context) {
    var targets = removeEnemies(targets, context.player.color);
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].name === "Cult Fanatic") {
            if(!target || context.player.minions[i].getHp() < target.getHp()) {
                target = context.player.minions[i];
            }
        }
    }
    return target;
};

var C_CannonBlast = module.exports.C_CannonBlast = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() + targets[i].getDamage()) >= 4 && targets[i].getHp() > 1) {
            target = targets[i];
        }
    }
    return target;
};

module.exports.Arthas_FlashofLight = function(targets, context) {
    var enemies = [];
    for(var i in targets) {
        if(context.foe.minions.indexOf(targets[i]) > 0) {
            enemies.push(targets[i]);
        }
    }
    
    if(enemies.length > 0) {
        var target = context.foe;
        for(i in enemies) {
            if(enemies[i].getHp() <= 2 || ((enemies[i].getHp() + enemies[i].getDamage()) > 6 && enemies[i].getHp() < 5)) {
                target = enemies[i];
            }
        }
        return target;
    }
    else {
        var target;
        var maxHpGap = 0;
        for(i in targets) {
            if(targets[i].getHp() < targets[i].getMaxHp() - maxHpGap) {
                target = targets[i];
                maxHpGap = targets[i].getMaxHp() - targets[i].getHp();
            }
        }
        return target;
    }
};

module.exports.Arthas_HolyLight = function(targets, context) {
    var target;
    var enemies = [];
    for(var i in targets) {
        if(context.foe.minions.indexOf(targets[i]) > 0) {
            enemies.push(targets[i]);
        }
    }
    if(enemies.length > 0) {
        for(i in enemies) {
            if(enemies[i].getHp() <= 3 || ((enemies[i].getHp() + enemies[i].getDamage()) > 6 && enemies[i].getHp() < 5)) {
                target = enemies[i];
            }
        }
        return target;
    }
    
    var mostDmg = 0;
    for(i in targets) {
        if(targets[i].damageTaken > 3) {
            target = targets[i];
        }
        else if(targets[i].damageTaken > 1 && targets[i].getDamage() >= 2 && targets[i].getDamage() > mostDmg) {
            target = targets[i];
            mostDmg = targets[i].getDamage();
        }
    }
    return target;
};

module.exports.Arthas_BladeofWrath = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    
    var totalDamage = context.player.damageTaken;
    for(var i in context.player.minions) {
        totalDamage += context.player.minions[i].damageTaken;
    }
    var explosion = Math.floor(totalDamage / 3);
    
    for(var i = 0; i < targets.length; i++) {
        if((targets[i].getHp() <= explosion && targets[i].getDamage() >= 3) || targets[i].getDamage() >= 5) {
            target = targets[i];
        }
    }
    if(context.foe.getHp() <= explosion) {
        return context.foe;
    }
    return target;
};

module.exports.Arthas_DeathboundNerubian = function(targets, context) {
    var targets = removeAllies(targets, context.player.color);
    var target = context.foe;
    for(var i = 0; i < targets.length; i++) {
        if(targets[i].getHp() <= 2 || ((targets[i].getHp() + targets[i].getDamage()) > 6 && targets[i].getHp() < 5)) {
            target = targets[i];
        }
    }
    return target;
};