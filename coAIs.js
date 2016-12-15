module.exports.JadeIdol = function(targets, context) {
    for(var i in context.player.deck) {
        var card = context.player.deck[i];
        if(card.name == "Jade Idol") {
            return targets[0];
        }
    }
    var extraIdol = false;
    for(var i in context.player.hand) {
        var card = context.player.hand[i];
        if(card.name == "Jade Idol") {
            if(!extraIdol) {
                extraIdol = true;
            } else {
                return targets[0];
            }
        }
    }
    return targets[1];
};

module.exports.LivingRoots = function(targets, context) {
    for (var i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 2 && (context.foe.minions[i].getDamage() > 1 || context.foe.minions[i].effects.length > 0)) {
            return targets[1];
        }
    }
    return targets[0];
};

module.exports.RavenIdol = function(targets, context) {
    if(Math.random() > 0.5) {
        return targets[0];
    }
    return targets[1];
};

module.exports.Wrath = function(targets, context) {
    for (var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].getHp() == 1 && context.foe.minions[i].getDamage >= 2) {
            return targets[0];
        }
        if (context.foe.minions[i].getHp() <= 3 && context.foe.minions[i].getDamage() >= 2) {
            return targets[1];
        }
    }
};

module.exports.Nourish = function(targets, context) {
    return targets[1];
};

module.exports.DruidoftheFlame = function(targets, context) {
    if(Math.random() > 0.5) {
        return targets[0];
    }
    return targets[1];
};

module.exports.AncientofLore = function(targets, context) {
    for(var i = 0; i < context.player.minions.length; i++) {
        if(context.player.minions[i].getHp() < context.player.minions[i].getMaxHp() - 4) {
            return targets[0];
        }
    }
    if(context.player.getHp() < context.player.getMaxHp() - 4) {
        return targets[0];
    }
    return targets[1];
};

module.exports.AncientofWar = function(targets, context) {
    return targets[1];
};

module.exports.Cenarius = function(targets, context) {
    if (context.player.minions.length > 2) {
        return targets[1];
    }
    return targets[0];
};