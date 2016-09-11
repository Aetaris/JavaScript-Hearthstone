var printer = require('./printer.js');

module.exports.Equip = function(weapon, context) {
    context.player.weapon = weapon;
};

module.exports.BreakWeapon = function(player, context) {
    player.weapon = false;
};

module.exports.dealSpellDamage = function(target, damage, context) {
    for (var i = 0; i < context.player.minions.length; i++) {
        for(var j = 0; j < context.player.minions[i].effects.length; j++) {
            var effect = context.player.minions[i].effects[j];
            if (effect.type === "spell damage interrupt" || effect.type === "spell damage interrupt friend") {
                effect.action({
                    player: context.player,
                    foe: context.foe,
                    cause: context.cause,
                    damage: damage,
                    target: target
                })
            }
        }
    }
    for (var i = 0; i < context.foe.minions.length; i++) {
        for(var j = 0; j < context.foe.minions[i].effects.length; j++) {
            var effect = context.foe.minions[i].effects[j];
            if (effect.type === "spell damage interrupt" || effect.type === "spell damage interrupt foe") {
                effect.action({
                    player: context.foe,
                    foe: context.player,
                    cause: context.cause,
                    damage: damage,
                    target: target
                })
            }
        }
    }
    dealDamage(target, spellDamage(context.player, context.foe, damage), context);
    for (var i = 0; i < context.player.minions.length; i++) {
        for(var j = 0; j < context.player.minions[i].effects.length; j++) {
            var effect = context.player.minions[i].effects[j];
            if (effect.type === "spell damage hunger" || effect.type === "spell damage hunger friend") {
                effect.action({
                    player: context.player,
                    foe: context.foe,
                    cause: context.cause,
                    damage: damage,
                    target: target
                })
            }
        }
    }
    for (var i = 0; i < context.foe.minions.length; i++) {
        for(var j = 0; j < context.foe.minions[i].effects.length; j++) {
            var effect = context.foe.minions[i].effects[j];
            if (effect.type === "spell damage hunger" || effect.type === "spell damage hunger foe") {
                effect.action({
                    player: context.foe,
                    foe: context.player,
                    cause: context.cause,
                    damage: damage,
                    target: target
                })
            }
        }
    }
};

var spellDamage = module.exports.spellDamage = function(caster, foe, damage) {
    for (var o = 0; o < caster.effects.length; o++) {
        if (caster.effects[o].type === "spell damage") {
            damage += caster.effects[o].bonus;
        }
    }
    for (var i = 0; i < caster.minions.length; i++) {
        for (o = 0; o < caster.minions[i].effects.length; o++) {
            if (caster.minions[i].effects[o].type === "spell damage") {
                damage += caster.minions[i].effects[o].bonus;
            }
        }
    }
    for (o = 0; o < foe.effects.length; o++) {
        if (foe.effects[o].type === "spell damage foe") {
            damage += foe.effects[o].bonus;
        }
    }
    for (i = 0; i < foe.minions.length; i++) {
        for (o = 0; o < foe.minions[i].effects.length; o++) {
            if (foe.minions[i].effects[o].type === "spell damage foe") {
                damage += foe.minions[i].effects[o].bonus;
            }
        }
    }
    return damage;
}

var dealDamage = module.exports.dealDamage = function(target, damage, context) {
    var shielded = false;
    for (var i = 0; i < target.effects.length; i++) {
        if (target.effects[i].name === "Divine Shield") {
            target.effects.splice(i, 1);
            shielded = true;
            printer.print(target.color + " " + target.name + "'s Divine Shield is destroyed.");
            break;
        }
        if (target.effects[i].name === "Immune") {
            shielded = true;
            printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
            break;
        }
    }
    if (target.type === "minion") {
        for (var k = 0; k < target.owner.minions.length; k++) {
            for (var o = 0; o < target.owner.minions[k].effects.length; o++) {
                if (target.owner.minions[k].effects[o].type === "friendly all buff effect" || target.owner.minions[k].effects[o].type === "friendly minion buff effect") {
                    if (target.owner.minions[k].effects[o].effect.name === "Immune") {
                        shielded = true;
                        printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
                        break;
                    }
                }
            }
        }
    }
    if (target.type === "hero") {
        for (var k = 0; k < target.minions.length; k++) {
            for (var o = 0; o < target.minions[k].effects.length; o++) {
                if (target.minions[k].effects[o].type === "hero buff effect") {
                    if (target.minions[k].effects[o].effect.name === "Immune") {
                        shielded = true;
                        printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
                        break;
                    }
                }
            }
        }
    }
    if (shielded === false && target.type !== "hero") {
        target.damageTaken += damage;
        if (target.getHp() < 0) {
            target.damageTaken = target.getMaxHp();
        }
        if (damage > 0) {
            printer.print(target.color + " " + target.name + " takes " + damage + " damage, reducing them to " + target.getHp() + " health.");
            for (i = 0; i < target.effects.length; i++) {
                if (target.effects[i].type === "pain") {
                    target.effects[i].action(target, { player: context.foe, foe: context.player, cause: context.source });
                }
            }
            
            for (var i = 0; i < context.player.minions.length; i++) {
                var minion = context.player.minions[i];
                minion.triggerEffectType("damage hunger", {player: context.player, foe: context.foe, cause: minion});
                minion.triggerEffectType("damage hunger friend", {player: context.player, foe: context.foe, cause: minion});
            }
            
            for (i = 0; i < context.foe.minions.length; i++) {
                var minion = context.foe.minions[i];
                minion.triggerEffectType("damage hunger", {player: context.foe, foe: context.player, cause: minion});
                minion.triggerEffectType("damage hunger foe", {player: context.foe, foe: context.player, cause: minion});
            }
            
            if(context.cause !== "Life Check" && context.cause.hasEffectType("poison")) {
                module.exports.kill(target, {
                    player: context.foe,
                    foe: context.player,
                    cause: context.cause
                });
                return true;
            }
        }
    }
    if (shielded === false && target.type === "hero" && target.armor <= 0) {
        target.damageTaken += damage;
        if (target.getHp() < 0) {
            target.damageTaken = target.getMaxHp();
        }
        if (damage > 0) {
            printer.print(target.color + " " + target.name + " takes " + damage + " damage, reducing them to " + target.getHp() + " health.");
        }
    }
    if (shielded === false && target.type === "hero" && target.armor > 0) {
        if (target.armor >= damage) {
            target.armor -= damage;
            if (damage > 0) {
                printer.print(target.color + " " + target.name + " blocks " + damage + " damage, reducing them to " + target.armor + " armor and " + target.getHp() + " health.");
            }
        }
        else {
            target.damageTaken += damage - target.armor;
            if (target.getHp() < 0) {
                target.damageTaken = target.getMaxHp();
            }
            target.armor = 0;
            if (damage > 0) {
                printer.print(target.color + " " + target.name + " partially blocks " + damage + " damage, reducing them to " + target.armor + " armor and " + target.getHp() + " health.");
            }
        }
    }
    if (target.getHp() <= 0 && target.type !== "hero") {
        if(target.owner === context.foe) {
            module.exports.kill(target, {
                player: context.foe,
                foe: context.player,
                cause: context.cause
            });
        }
        if(target.owner === context.player) {
            module.exports.kill(target, {
                player: context.player,
                foe: context.foe,
                cause: context.cause
            });
        }
        
        return true;
    }
    if (target.getHp() <= 0 && target.type === "hero" && target) {
        target.triggerEffectType("death interrupt", {player: context.player, foe: context.foe, cause: target});
    }
    return false;
};

module.exports.healDamage = function(target, healing, context) {
    target.damageTaken -= healing;
    if (target.getHp() > target.getMaxHp()) {
        target.damageTaken = 0;
    }
    if (healing > 0) {
        if(target.owner === context.player) {
            target.triggerEffectType("anti pain", {player: context.foe, foe: context.player, cause: target});
        }
        else {
            target.triggerEffectType("anti pain", {player: context.foe, foe: context.player, cause: target});
        }
        
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i];
            minion.triggerEffectType("healing hunger", {player: context.player, foe: context.foe, cause: minion});
            minion.triggerEffectType("healing hunger friend", {player: context.player, foe: context.foe, cause: minion});
        }
        
        for (i = 0; i < context.foe.minions.length; i++) {
            var minion = context.foe.minions[i];
            minion.triggerEffectType("healing hunger", {player: context.foe, foe: context.player, cause: minion});
            minion.triggerEffectType("healing hunger foe", {player: context.foe, foe: context.player, cause: minion});
        }
        if (target.damageTaken < 0) {
            target.damageTaken = 0;
        }
        printer.print(target.color + " " + target.name + " regains " + healing + " health, bringing them to " + target.getHp() + " health.");
    }
};

module.exports.dispel = function(target, context) {
    printer.print(target.color + " " + target.name + " has been Silenced.");
    var minion = target;
    // make a COPY of the effects array for safe iteration
    var effects = minion.effects.slice();
    // and start building an array of elements to DELETE
    var toDelete = {};
    for (var o = 0; o < effects.length; o++) {
        if (effects[o].type === "dispel") {
            effects[o].action(minion, {
                player: context.player,
                foe: context.foe,
                cause: minion
            });
        }
        if (effects[o].name !== "Summoning Sickness" && effects[o].name !== "Remove Temporary Buff") {
            toDelete[effects[o].name] = true;
        }
    }
    // now, we're going to delete from the REAL effects array
    o = 0;
    while (o < minion.effects.length) {
        if (toDelete[minion.effects[o].name]) {
            minion.effects.splice(o, 1);
        }
        else {
            o++;
        }
    }
    target.battlecry = false;
    target.deathrattle = false;
    target.enrage = false;
};

module.exports.kill = function(target, context) {
    if (!target.effects) {
        printer.print("Aaaaaah!");
    }
    
    for (var i = 0; i < target.effects.length; i++) {
        if(!target.effects[i].action && target.effects[i].type === "deathrattle") {
            throw new Error("why");
        }
        if (target.effects[i].type === "deathrattle") {
            target.effects[i].action(target, context);
        }
    }
    
    context.player.minions.splice(context.player.minions.indexOf(target), 1);
    
    printer.print(target.color + " " + target.name + " has been killed!");
    
    if(context.cause.owner === target.owner) {
        if(context.cause.triggerEffectType) {
            context.cause.triggerEffectType("victory", {player: context.player, foe: context.foe, cause: target});
        }
    }
    else {
        if(context.cause.triggerEffectType) {
            context.cause.triggerEffectType("victory", {player: context.foe, foe: context.player, cause: target});
        }
    }
    
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("death hunger", {player: context.player, foe: context.foe, cause: target});
        minion.triggerEffectType("death hunger friend", {player: context.player, foe: context.foe, cause: target});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("death hunger", {player: context.foe, foe: context.player, cause: target});
        minion.triggerEffectType("death hunger foe", {player: context.foe, foe: context.player, cause: target});
    }
    
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("death hunger hand", {player: context.player, foe: context.foe, cause: target});
        minion.triggerEffectType("healing hunger friend hand", {player: context.player, foe: context.foe, cause: target});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("healing hunger hand", {player: context.foe, foe: context.player, cause: target});
        minion.triggerEffectType("healing hunger foe hand", {player: context.foe, foe: context.player, cause: target});
    }
    context.player.triggerEffectType("death hunger", {player: context.player, foe: context.foe, cause: target, turn: context.player.turn})
    context.player.triggerEffectType("death hunger friend", {player: context.player, foe: context.foe, cause: target, turn: context.player.turn})
    context.foe.triggerEffectType("death hunger", {player: context.foe, foe: context.player, cause: target, turn: context.foe.turn})
    context.foe.triggerEffectType("death hunger foe", {player: context.foe, foe: context.player, cause: target, turn: context.foe.turn})
};

module.exports.Joust = function(player, foe) {
    var playerMinions = [];
    var foeMinions = [];
    for (var a = 0; a < player.deck.length; a++) {
        if (player.deck[a].type === "minion") {
            playerMinions.push(player.deck[a]);
        }
    }
    for (var b = 0; b < foe.deck.length; b++) {
        if (foe.deck[b].type === "minion") {
            foeMinions.push(foe.deck[b]);
        }
    }
    var randomNum = Math.floor(playerMinions.length * Math.random(0, 1));
    var playerMinion = playerMinions[randomNum];
    randomNum = Math.floor(foeMinions.length * Math.random(0, 1));
    var foeMinion = foeMinions[randomNum];
    printer.print("JOUST: " + player.color + " " + player.name + " versus " + foe.color + " " + foe.name + ".");
    if (playerMinions.length > 0) {
        printer.print(player.color + " " + player.name + "'s challenger: " + playerMinion.name + " (" + playerMinion.cost + ").");
    }
    else {
        printer.print(player.color + " " + player.name + " has no minions in their deck and cannot offer a challenger.");
    }
    if (foeMinions.length > 0) {
        printer.print(foe.color + " " + foe.name + "'s challenger: " + foeMinion.name + " (" + foeMinion.cost + ").");
    }
    else {
        printer.print(foe.color + " " + foe.name + " has no minions in their deck and cannot offer a challenger.");
    }
    if (playerMinions.length > 0 && foeMinions.length > 0) {
        var winner;
        if (playerMinion.cost > foeMinion.cost) {
            winner = true;
            printer.print(player.color + " " + player.name + " wins the Joust.");
        }
        else {
            winner = false;
            printer.print(player.color + " " + player.name + " loses the Joust.");
        }
        return {
            winner: winner,
            playerMinion: playerMinion,
            foeMinion: foeMinion
        };
    }
    if (playerMinions.length > 0 && foeMinions.length <= 0) {
        winner = player;
        return {
            winner: winner,
            playerMinion: playerMinion,
            foeMinion: foeMinion
        };
    }
    if (playerMinions.length <= 0 && foeMinions.length > 0) {
        winner = player;
        return {
            winner: winner,
            playerMinion: playerMinion,
            foeMinion: foeMinion
        };
    }
    return {
        winner: foe,
        playerMinion: playerMinion,
        foeMinion: foeMinion
    };
};

module.exports.drawCard = function(player, context) {
    var card = player.deck[0];
    if (player.deck.length > 0 && player.hand.length < 10) {
        printer.print(player.color + " " + player.name + " draws a " + player.deck[0].name + ".");
        player.hand.push(player.deck[0]);
        context.player.triggerEffectType("draw hunger", {player: context.player, foe: context.foe, cause: context.player});
        context.player.triggerEffectType("draw hunger friend", {player: context.player, foe: context.foe, cause: context.player});
        context.foe.triggerEffectType("draw hunger", {player: context.foe, foe: context.player, cause: context.foe});
        context.foe.triggerEffectType("draw hunger foe", {player: context.foe, foe: context.player, cause: context.foe});
        
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i];
            minion.triggerEffectType("draw hunger", {player: context.player, foe: context.foe, cause: minion});
            minion.triggerEffectType("draw hunger friend", {player: context.player, foe: context.foe, cause: minion});
        }
        for (i = 0; i < context.foe.minions.length; i++) {
            var minion = context.foe.minions[i];
            minion.triggerEffectType("draw hunger", {player: context.foe, foe: context.player, cause: minion});
            minion.triggerEffectType("draw hunger foe", {player: context.foe, foe: context.player, cause: minion});
        }
        if (player.deck[0].ai === "on draw") {
            player.deck[0].ability(context.foe, context);
            player.hand.splice(player.hand.length - 1, 1);
        }
        player.deck.splice(0, 1);
    }
    if (player.deck.length <= 0) {
        player.fatigue += 1;
        printer.print("Deck empty, could not draw cards! The " + player.color + " " + player.name + " takes " + player.fatigue + " fatigue damage!");
        module.exports.dealDamage(player, player.fatigue, {
            player: player,
            foe: false,
            cause: "Fatigue"
        });
    }
    if (player.deck.length > 0 && player.hand.length >= 10) {
        printer.print(player.color + " " + player.name + " draws and is forced to discard " + player.deck[0].name + ", as their hand is too full.");
        player.deck.splice(0, 1);
    }
    if (card) {
        return card;
    }
};

module.exports.summon = function(minion, player, context) {
    if (context.player.minions.length < 7) {
        context.player.minions.push(minion);
        minion.color = player.color;
        minion.owner = context.player;
        for (var i = 0; i < player.minions.length; i++) {
            if (player.minions[i] !== minion) {
                for (var m = 0; m < player.minions[i].effects.length; m++) {
                    if (player.minions[i].effects[m] === undefined) {
                        printer.print("ERROR! ERROR! ERROR! An effect is undefined.");
                    }
                    if(!player.minions[i].effects[m]) {
                        throw new Error("error");
                    }
                    if (player.minions[i].effects[m].type === "summon hunger" || player.minions[i].effects[m].type === "summon hunger friend") {
                        player.minions[i].effects[m].action(player.minions[i], context);
                    }
                }
            }
        }
        for (i = 0; i < context.foe.minions.length; i++) {
            for (var m = 0; m < context.foe.minions[i].effects.length; m++) {
                if (context.foe.minions[i].effects[m].type === "summon hunger" || context.foe.minions[i].effects[m].type === "summon hunger foe") {
                    context.foe.minions[i].effects[m].action(context.foe.minions[i], context);
                }
            }
        }
        for (i = 0; i < player.effects.length; i++) {
            if (player.effects[i].type === "summon hunger" || player.effects[i].type === "summon hunger friend") {
                context['minion'] = minion;
                player.effects[i].action(player, context);
            }
        }
        for (i = 0; i < context.foe.effects.length; i++) {
            if (context.foe.effects[i].type === "summon hunger" || context.foe.effects[i].type === "summon hunger foe") {
                var newContext = context;
                newContext['minion'] = minion;
                newContext['player'] = context.foe;
                newContext['foe'] = context.player;
                if (!context.foe.effects) {
                    printer.print("AAAAAAH");
                }
                context.foe.effects[i].action(newContext.player, newContext);
            }
        }
    }
    else {
        printer.print("Could not summon " + player.color + " " + minion.name + ". Why is it trying to? There are already seven minions!");
    }
};

module.exports.shuffle = function(deck) {
    if (!deck) {
        console.log("NOOOOO");
    }
    var m = deck.length;
    var t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = deck[m];
        deck[m] = deck[i];
        deck[i] = t;
    }
    return deck;
};

module.exports.checkForLife = function(context) {
    for (var i = 0; i < context.player.minions.length; i++) {
        if (context.player.minions[i].getHp() <= 0) {
            printer.print("Minion killed by Life Check: " + context.player.minions[i].name + ". You should fix this!");
            module.exports.kill(context.player.minions[i], context);
        }
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 0) {
            printer.print("Minion killed by Life Check: " + context.foe.minions[i].name + ". You should fix this!");
            module.exports.kill(context.foe.minions[i], {player: context.foe, foe: context.player, cause: "Life Check"});
        }
    }
};

var genMaxHp = module.exports.genMaxHp = function(minion) {
    var maxHp = minion.baseHp;
    for (var i = 0; i < minion.effects.length; i++) {
        if (!minion.effects[i]) {
            console.log("Wai...");
        }
        if (minion.effects[i].type === "buff health") {
            if (typeof(minion.effects[i].num) === "function") {
                maxHp += minion.effects[i].num(minion, maxHp);
            }
            else {
                maxHp += minion.effects[i].num;
            }
        }
        if (minion.effects[i].type === "set health") {
            if (typeof(minion.effects[i].num) === "function") {
                maxHp = minion.effects[i].num(minion, maxHp);
            }
            else {
                maxHp = minion.effects[i].num;
            }
        }
    }
    if (!minion.owner && minion.type !== "hero") {
        printer.print("Eek! Minion has no owner: " + minion.name)
    }
    if (minion.type === "minion") {
        for (var i = 0; i < minion.owner.minions.length; i++) {
            for (var q = 0; q < minion.owner.minions[i].effects.length; q++) {
                var effect = minion.owner.minions[i].effects[q];
                if (effect.type === "aura buff health" && minion.owner.minions[i] !== minion) {
                    if (typeof(effect.num) === "function") {
                        maxHp += effect.num(minion, maxHp);
                    }
                    else {
                        maxHp += effect.num;
                    }
                }
                if (effect.type === "aura set health" && minion.owner.minions[i] !== minion) {
                    if (typeof(effect.num) === "function") {
                        maxHp = effect.num(minion, maxHp);
                    }
                    else {
                        maxHp = effect.num;
                    }
                }
            }
        }
    }
    if (minion.type === "hero") {
        for (var i = 0; i < minion.minions.length; i++) {
            for (var q = 0; q < minion.minions[i].effects.length; q++) {
                var effect = minion.minions[i].effects[q];
                if (effect.type === "hero buff health") {
                    if (typeof(effect.num) === "function") {
                        maxHp += effect.num(minion, maxHp);
                    }
                    else {
                        maxHp += effect.num;
                    }
                }
                if (effect.type === "hero set health") {
                    if (typeof(effect.num) === "function") {
                        maxHp = effect.num(minion, maxHp);
                    }
                    else {
                        maxHp = effect.num;
                    }
                }
            }
        }
    }
    return maxHp;
};

var genHp = module.exports.genHp = function(minion) {
    var maxHp = module.exports.genMaxHp(minion);
    if (isNaN(maxHp)) {
        printer.print("WARNING: genMaxHp(" + minion + ") === NaN");
    }
    if (isNaN(minion.damageTaken)) {
        printer.print("WARNING: damageTaken is NaN in: " + minion.name);
    }
    return genMaxHp(minion) - minion.damageTaken;
};


var genMaxDamage = module.exports.genMaxDamage = function(minion) {
    var maxDamage = minion.baseDamage;
    if (minion.type === "hero") {
        if (minion.weapon) {
            maxDamage += minion.weapon.baseDamage;
            if(!minion.weapon.effects) {
                console.log("debug");
            }
            if(!minion.weapon.effects) {
                throw new Error ("cannot compute yo");
            }
            for (var i = 0; i < minion.weapon.effects.length; i++) {
                if (minion.weapon.effects[i].type === "buff damage") {
                    if (typeof(minion.weapon.effects[i].num) === "function") {
                        maxDamage += minion.weapon.effects[i].num(minion.weapon, maxDamage);
                    }
                    else {
                        maxDamage += minion.weapon.effects[i].num;
                    }
                }
                if (minion.weapon.effects[i].type === "set damage") {
                    if (typeof(minion.weapon.effects[i].num) === "function") {
                        maxDamage = minion.weapon.effects[i].num(minion.weapon, maxDamage);
                    }
                    else {
                        maxDamage = minion.weapon.effects[i].num;
                    }
                }
            }
        }
    }
    for (var i = 0; i < minion.effects.length; i++) {
        if (minion.effects[i].type === "buff damage") {
            if (typeof(minion.effects[i].num) === "function") {
                maxDamage += minion.effects[i].num(minion, maxDamage);
            }
            else {
                maxDamage += minion.effects[i].num;
            }
        }
        if (minion.effects[i].type === "set damage") {
            if (typeof(minion.effects[i].num) === "function") {
                maxDamage = minion.effects[i].num(minion, maxDamage);
            }
            else {
                maxDamage = minion.effects[i].num;
            }
        }
    }
    if (minion.type === "minion") {
        if (minion.owner) {
            for (var i = 0; i < minion.owner.minions.length; i++) {
                for (var q = 0; q < minion.owner.minions[i].effects.length; q++) {
                    var effect = minion.owner.minions[i].effects[q];
                    if (effect.type === "aura buff damage" && minion.owner.minions[i] !== minion) {
                        if (typeof(effect.num) === "function") {
                            maxDamage += effect.num(minion, maxDamage);
                        }
                        else {
                            maxDamage += effect.num;
                        }
                    }
                    if (effect.type === "aura set damage" && minion.owner.minions[i] !== minion) {
                        if (typeof(effect.num) === "function") {
                            maxDamage = effect.num(minion, maxDamage);
                        }
                        else {
                            maxDamage = effect.num;
                        }
                    }
                }
            }
        }
        else {
            printer.print("Minion " + minion.name + "doesn't seem to have an owner! Uh oh! Owner: " + minion.owner + ".")
            printer.print("ERROR")
            printer.print("ERROR")
            printer.print("ERROR")
        }
    }
    if (minion.type === "hero") {
        for (i = 0; i < minion.minions.length; i++) {
            for (q = 0; q < minion.minions[i].effects.length; q++) {
                effect = minion.minions[i].effects[q];
                if (!effect) {
                    printer.print("ERROR! ERROR! ERROR! Effect does not exist.");
                }
                if (effect.type === "hero buff damage") {
                    if (typeof(effect.num) === "function") {
                        maxDamage += effect.num(minion, maxDamage);
                    }
                    else {
                        maxDamage += effect.num;
                    }
                }
                if (effect.type === "hero set damage") {
                    if (typeof(effect.num) === "function") {
                        maxDamage = effect.num(minion, maxDamage);
                    }
                    else {
                        maxDamage = effect.num;
                    }
                }
            }
        }
    }
    return maxDamage;
};

var genDamage = module.exports.genDamage = function(minion) {
    return genMaxDamage(minion) - minion.damageLost;
};

var withEffects = module.exports.withEffects = function (obj) {
    obj.addEffect = function(effect) {
            if (!effect) {
                throw new Error("Can't add null effect");
            }
            obj.effects.push(effect);
        };
    obj.removeEffect = function(effect) {
            if(!effect) {
                throw new Error("Can't remove null effect");
            }
            var ix = this.effects.indexOf(effect);
            if(ix < 0) {
                throw new Error("Can't remove effect outside of effects array");
            }
            obj.effects.splice(ix, 1);
        };
    obj.getEffectsName = function (name) {
        if (!name) {
            throw new Error("Unexpected null name!");
        }
        return obj.effects.filter(function (e) {
            return e.name === name;
        });
    };
    obj.hasEffectName = function (effect) {
        return obj.getEffectsName(effect).length > 0;
    };
    obj.getEffectsType = function (type) {
        if (!type) {
            throw new Error("Unexpected null type!");
        }
        if(!obj.effects.filter) {
            throw new Error("uh oh");
        }
        return obj.effects.filter(function (e) {
            return e.type === type;
        });
    };
    obj.hasEffectType = function (effect) {
        return obj.getEffectsType(effect).length > 0;
    };
    obj.triggerEffectName = function (name, context) {
        var effects = obj.getEffectsName(name);
        effects.forEach(function (effect) {
            if(!effect || !effect.action) {
                throw new Error("Can't trigger action that doesn't exist");
            }
            else {
                effect.action(obj, context);
            }
        });
    };
    obj.triggerEffectType = function (type, context) {
        var effects = obj.getEffectsType(type);
        effects.forEach(function (effect) {
            if(!effect || !effect.action) {
                console.log("triggerEffectType() [effect.name=" + effect.name +
                ", effect.type=" + effect.type + ", " +
                "obj name=" + obj.name + ", object=" + obj + "]");
                throw new Error("Can't trigger action that doesn't exist");
            }
            else {
                effect.action(obj, context);
            }
        });
    };
    return obj;
};

module.exports.makeSpell = function(rarity, cardSet, color, name, cost, overload, ability, targetai, ai, card, tier) {
    return withEffects ({
        type: "spell",
        rarity: rarity,
        cardSet: cardSet,
        color: color,
        name: name,
        cost: cost,
        ability: ability,
        targetai: targetai,
        effects: [],
        ai: ai,
        card: card,
        tier: tier
    });
};

module.exports.makeWeapon = function(rarity, cardSet, name, cost, overload, baseDamage, durability, battlecry, targetai, effects, ai, card, tier) {
    return withEffects ({
        type: "weapon",
        rarity: rarity,
        cardSet: cardSet,
        color: false,
        name: name,
        cost: cost,
        overload: overload,
        baseDamage: baseDamage,
        durability: durability,
        battlecry: battlecry,
        targetai: targetai,
        effects: effects,
        ai: ai,
        card: card,
        tier: tier
    });
};

module.exports.makeMinion = function(race, rarity, cardSet, color, name, cost, overload, maxHp, baseDamage, battlecry, targetai, effects, ai, card, tier) {
    return withEffects({
        type: "minion",
        rarity: rarity,
        cardSet: cardSet,
        race: race,
        color: color,
        name: name,
        cost: cost,
        baseHp: maxHp,
        damageTaken: 0,
        baseDamage: baseDamage,
        damageLost: 0,
        battlecry: battlecry,
        targetai: targetai,
        effects: effects,
        ai: ai,
        card: card,
        tier: tier,
        getMaxHp: function() {
            return genMaxHp(this);
        },
        getHp: function() {
            return genHp(this);
        },
        getMaxDamage: function() {
            return genMaxDamage(this);
        },
        getDamage: function() {
            return genDamage(this);
        }
    });
};