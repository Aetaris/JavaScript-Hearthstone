module.exports.MageFireblast = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() === 1 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 5) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.PriestLesserHeal = function(context) {
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

module.exports.WhirlingBlades = function(context) {
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

module.exports.ArmorPlating = function(context) {
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

module.exports.RustyHorn = function(context) {
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

module.exports.EmergencyCoolant = function(context) {
    var target = false;
    var maxDamage = 0;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() > maxDamage) {
            target = context.foe.minions[i];
            maxDamage = context.foe.minions[i].getDamage();
        }
    }
    return target;
};

module.exports.FinickyCloakfield = function(context) {
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

module.exports.ReversingSwitch = function(context) {
    var target = context.foe;
    var targetRoll = Math.floor((context.foe.minions.length) * Math.random(0, 1));
    if(targetRoll < context.foe.minions.length) {
        target = context.foe.minions[targetRoll];
    }
    return target;
};

module.exports.TimeRewinder = function(context) {
    var target = false;
    var hpGap = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp() - hpGap) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.BlackwingCorruptor = function(context) {
    var target = false;
    var hasDragon = false;
    for(var i = 0; i < context.player.hand.length; i++) {
        if(context.player.hand[i].type === "minion" && context.player.hand[i].race === "Dragon") {
            hasDragon = true;
        }
    }
    if(hasDragon) {
        var target = context.foe;
        for(var i = 0; i < context.foe.minions.length; i++) {
            if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4 && context.foe.minions[i].getHp() > 1) {
                target = context.foe.minions[i];
            }
        }
        return target;
    }
    return target;
};

module.exports.Fireball = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() > 3 && context.foe.minions[i].getDamage() > 2) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Polymorph = function(context) {
    var target = false;
    var maxDmg = 0;
    var maxHp = 0;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() > 3 || context.foe.minions[i].getHp() > maxHp) || (context.foe.minions[i].getDamage() > 2 || context.foe.minions[i].getDamage() > maxDmg)) {
            if(context.foe.minions[i].dmg > maxDmg) {
                maxDmg = context.foe.minions[i].dmg;
            }
            if(context.foe.minions[i].getHp() > maxHp) {
                maxHp = context.foe.minions[i].getHp();
            }
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Frostbolt = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4 && context.foe.minions[i].getHp() > 1) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.ConeofCold = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 || (context.foe.minions[i].getHp() < 2 && i > 0)) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Execute = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() < context.foe.minions[i].getMaxHp() && ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 10 || !target)) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Backstab = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() === context.foe.minions[i].getMaxHp() && ((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4) || !target || target.getHp() <= 2) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Sap = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > (target.getHp() + target.getDamage()) || target === context.foe) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Shiv = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() === 1 && (context.foe.minions[i].getDamage() >= target.getDamage() || target === context.foe)) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Crackle = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > (target.getHp() + target.getDamage()) && context.foe.minions[i].getHp() <= 6 ) || target === context.foe) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.LavaBurst = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 && context.foe.minions[i].getHp() > 2) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.ExplosiveShot = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 5 && context.foe.minions[i].getHp() > 2) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.ArcaneShot = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() === 2 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 4) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.CobraShot = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4 && context.foe.minions[i].getHp() > 1) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.HuntersMark = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() > target.getHp() || target === context.foe) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Swipe = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() > 2 && (context.foe.minions[i].getDamage() > target.getDamage() && target.type !== "hero")) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Moonfire = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() === 1 || (context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 5) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

var Darkbomb = module.exports.Darkbomb = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4 && context.foe.minions[i].getHp() > 1) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.ShadowBolt = function(context) {
    var target = context.foe;
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 4 && context.foe.minions[i].getDamage() >= 3) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.MortalCoil = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) > 1 && context.foe.minions[i].getHp() === 1) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Shadowflame = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getDamage() > target.getDamage() || target === context.foe) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.BlessingofKings = function(context) {
    var target = false;
    var highestValue = 0;
    for(var i = 0; i < context.player.minions.length; i++) {
        if((context.player.minions[i].getHp() + context.player.minions[i].getDamage()) > highestValue) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.HammerofWrath = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(target.getHp() === 3 || (target.getHp() < 9 && target.getDamage() > 2)) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.PowerWordShield = function(context) {
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getDamage() > 1 && context.player.minions[i].getHp() < 3) {
            target = context.player.minions[i];
        }
    }
    return target;
};

module.exports.ShadowWordPain = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() <= 3) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.ShadowWordDeath = function(context) {
    var target = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getDamage() >= 5 && context.foe.minions[i].getHp() > 3) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.Entomb = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() > 3 && context.foe.minions[i].getDamage() > 2) {
            target = context.foe.minions[i];
        }
    }
    return target;
};

module.exports.VelensChosen = function(context) {
    var target = false;
    for(var i = 0; i < context.player.minions.length; i++) {
        if(!target || (context.player.minions[i].getHp() < target.getHp() && context.player.minions[i].getDamage() >= 2)) {
            target = context.player.minions[i];
        }
    }
    return target;
};

// Custom Sets

module.exports.C_DarkEmpowerment = function(context) {
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

module.exports.C_DarkTransformation = function(context) {
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

var Darkbomb = module.exports.C_CannonBlast = function(context) {
    var target = context.foe;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if((context.foe.minions[i].getHp() + context.foe.minions[i].getDamage()) >= 4 && context.foe.minions[i].getHp() > 1) {
            target = context.foe.minions[i];
        }
    }
    return target;
};