var printer = require('./printer.js');
var filters = require('./filters.js');
var effects = require('./effects.js');
const readline = require('readline-sync');

module.exports.Equip = function(weapon, context) {
    context.player.weapon = weapon;
};

var BreakWeapon = module.exports.BreakWeapon = function(player, context) {
    player.weapon = false;
};

var dealSpellDamage = module.exports.dealSpellDamage = function(target, damage, context) {
    for (var i = 0; i < context.player.minions.length; i++) {
        for(var j = 0; j < context.player.minions[i].effects.length; j++) {
            var effect = context.player.minions[i].effects[j];
            if (effect.type === "spell damage interrupt" || effect.type === "spell damage interrupt friend") {
                effect.action(context.player.minions[i], {
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
                effect.action(context.foe.minions[i], {
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
                effect.action(context.player.minions[i], {
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
                effect.action(context.foe.minions[i], {
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
};

var dealDamage = module.exports.dealDamage = function(target, damage, context) {
    /** Context should include
        Player: Not super relevant
        Foe: Not super relevant
        Cause: VERY relevant, the minion/player that dealt the damage
    **/
    
    if(target.type == "minion") {
        context.player = target.owner;
    } else {
        context.player = target;
    }
    if(context.player.foe) {
        context.foe = context.player.foe;
    }
    
    if(target.isAlive()) { // Shouldn't damage things at 0 Health
        var shielded = false; // If the minion has a Divine Shield or Immune effect
        if(target.hasEffectName("Immune")) {
            shielded = "immune";
        }
        if (target.type === "minion") {
            for (var k = 0; k < target.owner.minions.length; k++) {
                for (var o = 0; o < target.owner.minions[k].effects.length; o++) {
                    var eff = target.owner.minions[k].effects[o];
                    if (eff.type === "friendly all buff effect" || eff.type === "friendly minion buff effect") {
                        if (eff.effect.name === "Immune") {
                            shielded = "immune";
                            break;
                        }
                    }
                }
            }
        } else if (target.type === "hero") {
            for (var k = 0; k < target.minions.length; k++) {
                for (var o = 0; o < target.minions[k].effects.length; o++) {
                    eff = target.minions[k].effects[o];
                    if (eff.type === "hero buff effect") {
                        if (eff.effect.name === "Immune") {
                            shielded = "immune";
                            break;
                        }
                    }
                }
            }
        }
        else if(target.hasEffectName("Divine Shield")) {
            shielded = "shielded";
            target.removeEffect(effects.divineshield);
        }
    }
    for(var i in context.cause.effects) {
        var e = context.cause.effects[i];
        if(e.type == "amplify damage") {
            damage += e.action(context.cause, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
        }
    }
    for(i in target.effects) {
        e = target.effects[i];
        if(e.type == "pain interrupt") {
            damage += e.action(target, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
        }
    }
    if(damage > 0 && !shielded) {
        target.damageTaken += damage;
        if (target.damageTaken >= target.getMaxHp()) {
            target.damageTaken = target.getMaxHp();
        }
        printer.print(target.color + " " + target.name + " takes " + damage + " damage, reducing them to " + target.getHp() + " health.");
        target.triggerEffectType("pain", { player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage })
    } else if(shielded) {
        printer.print(target.color + " " + target.name + " takes no damage, as they are " + shielded + ".");
        return false;
    }
    context.cause.triggerEffectType("damage hunger self", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage, target: target});
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("damage hunger", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage});
        minion.triggerEffectType("damage hunger friend", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage});
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        minion.triggerEffectType("damage hunger", {player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage});
        minion.triggerEffectType("damage hunger foe", {player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage});
    }
    if(context.cause.hasEffectType("poison")) {
        module.exports.kill(target, {
            player: context.player,
            foe: context.foe,
            cause: context.cause
        });
        return true;
    }
    if(target.type == "minion" && target.scenario && target.scenario.minionLifelink) {
        dealDamage(target.scenario, damage, {player: target.scenario, foe: target.scenario, cause: context.cause});
        if(!target.scenario.isAlive()) {
            printer.print(target.scenario.endOfMatch.line);
            printer.print("");
            target.scenario.endOfMatch.action(context.player, context.foe);
        }
    }
    if (!target.isAlive()) {
        if(target.hasEffectType("death interrupt")) {
            damage = target.triggerEffectType("death interrupt", {player: context.player, foe: context.foe, cause: target, damage: damage});
        }
        if(target.getHp() - damage <= 0 && target.type == "minion") {
            module.exports.kill(target, {
                player: context.player,
                foe: context.foe,
                cause: context.cause ? context.cause : context.source
            });
            return true;
        }
    }
    if(!target.isAlive() && target.endOfMatch && target.endOfMatch.line) {
        printer.print("");
        printer.print(target.endOfMatch.line);
        target.endOfMatch.line = false;
    }
    return false;
};

// var dealDamage = module.exports.dealDamage = function(target, damage, context) {
//     if(typeof target.isAlive != "function") {
//         throw new Error("what the hell?");
//     }
//     if(target.isAlive()) {
//         var shielded = false;
//         for (var i = 0; i < target.effects.length; i++) {
//             if (target.effects[i].name === "Divine Shield" && damage > 0) {
//                 target.effects.splice(i, 1);
//                 i--;
//                 shielded = true;
//                 printer.print(target.color + " " + target.name + "'s Divine Shield is destroyed.");
//                 break;
//             }
//             if (target.effects[i].name === "Immune" && damage > 0) {
//                 shielded = true;
//                 printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
//                 break;
//             }
//         }
//         if (target.type === "minion") {
//             if(!target.owner) {
//                 console.log("error");
//             }
//             for (var k = 0; k < target.owner.minions.length; k++) {
//                 for (var o = 0; o < target.owner.minions[k].effects.length; o++) {
//                     if (target.owner.minions[k].effects[o].type === "friendly all buff effect" || target.owner.minions[k].effects[o].type === "friendly minion buff effect") {
//                         if (target.owner.minions[k].effects[o].effect.name === "Immune" && damage > 0) {
//                             shielded = true;
//                             printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//         if (target.type === "hero") {
//             for (var k = 0; k < target.minions.length; k++) {
//                 for (var o = 0; o < target.minions[k].effects.length; o++) {
//                     if (target.minions[k].effects[o].type === "hero buff effect") {
//                         if (target.minions[k].effects[o].effect.name === "Immune" && damage > 0) {
//                             shielded = true;
//                             printer.print("Damage to " + target.color + " " + target.name + " is negated, as the target is Immune.");
//                             break;
//                         }
//                     }
//                 }
//             }
//         }
//         if (shielded === false && target.type !== "hero") {
//             if(context.cause) {
//                 for(var i in context.cause.effects) {
//                     var e = context.cause.effects[i];
//                     if(e.type == "amplify damage") {
//                         damage += e.action(context.cause, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
//                     }
//                 }
//             }
//             if(target) {
//                 for(i in target.effects) {
//                     e = target.effects[i];
//                     if(e.type == "pain interrupt") {
//                         damage += e.action(target, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
//                     }
//                 }
//             }
            
//             target.damageTaken += damage;
//             if (target.getHp() < 0) {
//                 target.damageTaken = target.getMaxHp();
//             }
//             if (damage > 0) {
//                 printer.print(target.color + " " + target.name + " takes " + damage + " damage, reducing them to " + target.getHp() + " health.");
//                 for (i = 0; i < target.effects.length; i++) {
//                     if (target.effects[i].type === "pain") {
//                         target.effects[i].action(target, { player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage });
//                     }
//                 }
//                 if(context.cause != "Life Check") {
//                     if(!context.cause.triggerEffectType) {
//                         throw new Error("wut");
//                     }
//                     context.cause.triggerEffectType("damage hunger self", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage, target: target});
//                 }
//                 if(!context.player.minions) {
//                     throw new Error("code broken");
//                 }
//                 for (var i = 0; i < context.player.minions.length; i++) {
//                     var minion = context.player.minions[i];
//                     minion.triggerEffectType("damage hunger", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage});
//                     minion.triggerEffectType("damage hunger friend", {player: context.player, foe: context.foe, cause: target, damager: context.cause, damage: damage});
//                 }
                
//                 for (i = 0; i < context.foe.minions.length; i++) {
//                     var minion = context.foe.minions[i];
//                     minion.triggerEffectType("damage hunger", {player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage});
//                     minion.triggerEffectType("damage hunger foe", {player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage});
//                 }
                
//                 if(context.cause && context.cause !== "Life Check" && context.cause.hasEffectType("poison")) {
//                     module.exports.kill(target, {
//                         player: context.foe,
//                         foe: context.player,
//                         cause: context.cause
//                     });
//                     return true;
//                 }
//             }
//         }
//         else if (shielded === false && target.type === "hero" && target.armor <= 0) {
//             if(context.cause) {
//                 for(var i in context.cause.effects) {
//                     var e = context.cause.effects[i];
//                     if(e.type == "amplify damage") {
//                         damage += e.action(context.cause, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
//                     }
//                 }
//             }
//             if(target) {
//                 for(i in target.effects) {
//                     e = target.effects[i];
//                     if(e.type == "pain interrupt") {
//                         damage += e.action(target, {player: context.player, foe: context.foe, cause: context.cause, target: target, damage: damage});
//                     }
//                 }
//             }
            
//             target.damageTaken += damage;
//             if (target.getHp() < 0) {
//                 target.damageTaken = target.getMaxHp();
//             }
//             if (damage > 0) {
//                 printer.print(target.color + " " + target.name + " takes " + damage + " damage, reducing them to " + target.getHp() + " health.");
//                 for (i = 0; i < target.effects.length; i++) {
//                     if (target.effects[i].type === "pain") {
//                         target.effects[i].action(target, { player: context.foe, foe: context.player, cause: target, damager: context.cause, damage: damage });
//                     }
//                 }
//             }
//         }
//         if (shielded === false && target.type === "hero" && target.armor > 0) {
//             if (target.armor >= damage) {
//                 target.armor -= damage;
//                 if (damage > 0) {
//                     printer.print(target.color + " " + target.name + " blocks " + damage + " damage, reducing them to " + target.armor + " armor and " + target.getHp() + " health.");
//                 }
//             }
//             else {
//                 target.damageTaken += damage - target.armor;
//                 if (target.getHp() < 0) {
//                     target.damageTaken = target.getMaxHp();
//                 }
//                 target.armor = 0;
//                 if (damage > 0) {
//                     printer.print(target.color + " " + target.name + " partially blocks " + damage + " damage, reducing them to " + target.armor + " armor and " + target.getHp() + " health.");
//                 }
//             }
//         }
//         if(shielded == false && target.scenario && target.scenario.minionLifelink) {
//             dealDamage(target.scenario, damage, {player: target.scenario, foe: target.scenario, cause: context.cause});
//             if(target.scenario.getHp() <= 0) {
//                 printer.print(target.scenario.endOfMatch.line);
//                 printer.print("");
//                 target.scenario.endOfMatch.action(context.player, context.foe);
//             }
//         }
//         if (target.getHp() <= 0 && target.type !== "hero") {
//             if(target.hasEffectType("death interrupt")) {
//                 damage = target.triggerEffectType("death interrupt", {player: context.player, foe: context.foe, cause: target, damage: damage});
//             }
//             if(target.getHp() - damage <= 0) {
//                 if(target.owner === context.foe) {
//                     module.exports.kill(target, {
//                         player: context.foe,
//                         foe: context.player,
//                         cause: context.cause ? context.cause : context.source
//                     });
//                 }
//                 if(target.owner === context.player) {
//                     module.exports.kill(target, {
//                         player: context.player,
//                         foe: context.foe,
//                         cause: context.cause ? context.cause : context.source
//                     });
//                 }
//             }
//             return true;
//         }
//         if (target.getHp() <= 0 && target.type === "hero" && target) {
//             if(target.hasEffectType("death interrupt")) {
//                 damage = target.triggerEffectType("death interrupt", {player: context.player, foe: context.foe, cause: target, damage: damage});
//             }
//             if(target.getHp() - damage <= 0 && target.endOfMatch && target.endOfMatch.line) {
//                 printer.print("");
//                 printer.print(target.endOfMatch.line);
//                 target.endOfMatch.line = false;
//             }
//         }
//         return false;
//     }
// };

var healDamage = module.exports.healDamage = function(target, healing, context) {
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("healing interrupt", {player: context.player, foe: context.foe, cause: minion, healing: healing});
        minion.triggerEffectType("healing interrupt friend", {player: context.player, foe: context.foe, cause: minion, healing: healing});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("healing interrupt", {player: context.foe, foe: context.player, cause: minion, healing: healing});
        minion.triggerEffectType("healing interrupt foe", {player: context.foe, foe: context.player, cause: minion, healing: healing});
    }
    var shouldDisplay = healing > 0 && target.damageTaken > 0;
    target.damageTaken -= healing;
    if (target.damageTaken < 0) {
        target.damageTaken = 0;
    }
    if (shouldDisplay) {
        if(target.owner === context.player) {
            target.triggerEffectType("anti pain", {player: context.player, foe: context.foe, cause: target});
        }
        else {
            target.triggerEffectType("anti pain", {player: context.foe, foe: context.player, cause: target});
        }
        
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i];
            minion.triggerEffectType("healing hunger", {player: context.player, foe: context.foe, cause: minion, healing: healing});
            minion.triggerEffectType("healing hunger friend", {player: context.player, foe: context.foe, cause: minion, healing: healing});
        }
        
        for (i = 0; i < context.foe.minions.length; i++) {
            var minion = context.foe.minions[i];
            minion.triggerEffectType("healing hunger", {player: context.foe, foe: context.player, cause: minion, healing: healing});
            minion.triggerEffectType("healing hunger foe", {player: context.foe, foe: context.player, cause: minion, healing: healing});
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
    if(!minion.effects) {
        throw new Error("Agh");
    }
    var effects = minion.effects.slice();
    // and start building an array of elements to DELETE
    var toDelete = {};
    for (var o = 0; o < effects.length; o++) {
        if (effects[o].type == "dispel") {
            effects[o].action(minion, {
                player: context.player,
                foe: context.foe,
                cause: minion
            });
        }
        if (effects[o].name != "Summoning Sickness" && effects[o].name != "Remove Temporary Buff") {
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
    target.effects.push({name: "Silence", type: "passive"});
};

var kill = module.exports.kill = function(target, context) {

    printer.print(target.color + " " + target.name + " has been killed!");
    
    if (!target.effects) {
        printer.print("Aaaaaah!");
    }
    
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("death hunger immediate", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger immediate friend", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("death hunger immediate", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger immediate foe", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
    }
    if(!target.effects) {
        throw new Error("target="+target+", target.name="+target.name);
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
    
    if(!context.cause) {
        throw new Error("welp...");
    }
    
    if(context.cause != "Life Check") {
        var hero;
        var foe;
        if(context.cause.type == "hero") {
            hero = context.cause;
        } else {
            hero = context.cause.owner;
        }
        if(hero) {
            context.cause.triggerEffectType("victory", {player: hero, foe: foe, cause: target});
        }
    }
    
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("death hunger", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger friend", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("death hunger", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger foe", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
    }
    
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("death hunger hand", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger friend hand", {player: context.player, foe: context.foe, cause: target, killer: context.cause});
    }
    
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("death hunger hand", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
        minion.triggerEffectType("death hunger foe hand", {player: context.foe, foe: context.player, cause: target, killer: context.cause});
    }
    context.player.triggerEffectType("death hunger", {player: context.player, foe: context.foe, cause: target, turn: context.player.turn, killer: context.cause});
    context.player.triggerEffectType("death hunger friend", {player: context.player, foe: context.foe, cause: target, turn: context.player.turn, killer: context.cause});
    context.foe.triggerEffectType("death hunger", {player: context.foe, foe: context.player, cause: target, turn: context.foe.turn, killer: context.cause});
    context.foe.triggerEffectType("death hunger foe", {player: context.foe, foe: context.player, cause: target, turn: context.foe.turn, killer: context.cause});
    
    // Adding to graveyard
    
    if(!target || !target.card || typeof target.card !== "function") {
        throw new Error("This minion has no card, or its card is not a function.");
    }
    context.player.shallowGraves.push(target.card());
    context.player.graveyard.push(target.card());
};

module.exports.canPlayCard = function(player, context) {
    for(var i = 0; i < player.hand.length; i++) {
        if(player.mana >= getCardCost(player.hand[i], context)) {
            return true;
        }
    }
    return false;
};

var getCardCost = module.exports.getCardCost = function(card, context) {
    var cost = card.cost;
    if(!card.effects) {
        throw new Error("Card does not have effects");
    }
    for(var c = 0; c < card.effects.length; c++) {
        var effect = card.effects[c];
        if(!effect) {
            throw new Error("Card does not have effect");
        }
        if(effect.type == "buff cost") {
            if(effect.num) {
                cost += effect.num;
            }
            else if(effect.action) {
                cost += effect.action(card, context);
            }
        }
    }
    
    for(var b = 0; b < context.player.effects.length; b++) {
        var effect = context.player.effects[b];
        if(effect.type === "aura hand friend buff cost" || effect.type === "aura hand buff cost") {
            if(effect.num) {
                cost += effect.num;
            }
            else if(effect.action) {
                cost += effect.action(context.player, context);
            }
        }
    }
    for(var b = 0; b < context.foe.effects.length; b++) {
        var effect = context.foe.effects[b];
        if(effect.type === "aura hand foe buff cost" || effect.type === "aura hand buff cost") {
            if(effect.num) {
                cost += effect.num;
            }
            else if(effect.action) {
                cost += effect.action(context.foe, context);
            }
        }
    }
    
    for(var c = 0; c < context.player.minions.length; c++) {
        for(var b = 0; b < context.player.minions[c].effects.length; b++) {
            var effect = context.player.minions[c].effects[b];
            if(effect.type === "aura hand friend buff cost" || effect.type === "aura hand buff cost") {
                if(effect.num) {
                    cost += effect.num;
                }
                else if(effect.action) {
                    cost += effect.action(context);
                }
            }
        }
    }
    for(var c = 0; c < context.foe.minions.length; c++) {
        for(var b = 0; b < context.foe.minions[c].effects.length; b++) {
            var effect = context.foe.minions[c].effects[b];
            if(!effect) {
                console.log("bug");
            }
            if(effect.type === "aura hand foe buff cost" || effect.type === "aura hand buff cost") {
                if(effect.num) {
                    cost += effect.num;
                }
                else if(effect.action) {
                    cost += effect.action(card, {player: context.foe, foe: context.player, cause: card} );
                }
            }
        }
    }
    if(cost < 0) {
        return 0;
    }
    return cost;
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
    var playerMinion = playerMinions[Math.floor(playerMinions.length * Math.random(0, 1))];
    var foeMinion = foeMinions[Math.floor(foeMinions.length * Math.random(0, 1))];
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

module.exports.drawCard = function(player, context, isMulligan) {
    var card = player.deck[0];
    if (player.deck.length > 0 && player.hand.length < 10) {
        if(player.isPlayer || !context.foe.isPlayer) {
            if(!card) {
                throw new Error("");
            }
            printer.print(player.color + " " + player.name + " draws " + player.deck[0].name + ".");
        } else {
            printer.print(player.color + " " + player.name + " draws a card.");
        }
        player.hand.push(player.deck[0]);
        if(!isMulligan) {
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
            for(i in card.effects) {
                var effect = card.effects[i];
                if(!effect) {
                    throw new Error("wut this");
                }
                if(effect.type == "on draw") {
                    effect.action(card, context);
                }
            }
        }
        player.deck.splice(0, 1);
    }
    
    // Hey there, future self. (12/28/16)
    
    else if (player.deck.length <= 0) {
        player.fatigue++;
        printer.print("The " + player.color + " " + player.name + " takes " + player.fatigue + " fatigue damage!");
        module.exports.dealDamage(player, player.fatigue, {
            player: player,
            foe: false,
            cause: "Fatigue"
        });
    }
    else if (player.deck.length > 0 && player.hand.length >= 10) {
        printer.print(player.color + " " + player.name + " is forced to discard " + player.deck[0].name + ", as their hand is too full.");
        player.deck.splice(0, 1);
    }
    if (card) {
        return card;
    }
};

module.exports.discardCard = function(player, context) {
    if(player.hand.length > 0) {
        var discardNum = Math.floor(player.hand.length * Math.random(0, 1));
        var card = player.hand[discardNum];
        if(card) {
            printer.print(player.color + " " + player.name + " discards " + card.name + ".");
            player.hand.splice(discardNum, 1);
            player.discarded.push(card.card());
            card.triggerEffectType("discarded", {player: player, foe: context.foe, cause: context.cause, source: card});
            for(var i in player.minions) {
                player.minions[i].triggerEffectType("discard hunger", {player: player, foe: context.foe, cause: context.cause, source: player.minions[i]});
                player.minions[i].triggerEffectType("discard hunger friend", {player: player, foe: context.foe, cause: context.cause, source: player.minions[i]});
            }
            for(var i in context.foe.minions) {
                context.foe.minions[i].triggerEffectType("discard hunger", {player: context.foe, foe: player, cause: context.cause, source: context.foe.minions[i]});
                context.foe.minions[i].triggerEffectType("discard hunger foe", {player: context.foe, foe: player, cause: context.cause, source: context.foe.minions[i]});
            }
        }
    }
    else {
        printer.print(player.color + " " + player.name + "'s hand is empty, and nothing is discarded.");
    }
};

module.exports.jadeSetup = function(golem, player) {
    var buffNum = 0;
    if(player.jadeBuff && player.jadeBuff > 0) {
        buffNum = player.jadeBuff;
    }
    if(buffNum >= 30) {
        buffNum = 29;
    }
    golem.baseHp += buffNum;
    golem.baseDamage += buffNum;
    golem.cost += buffNum;
    if(golem.cost > 10) {
        golem.cost = 10;;
    }
    if(buffNum <= 2) {
        golem.name = "Crude " + golem.name;
    } else if(buffNum <= 5) {
        golem.name = "Elaborate " + golem.name;
    } else if(buffNum <= 18) {
        golem.name = "Mighty " + golem.name;
    } else {
        golem.name = "Titanic " + golem.name;
    }
    var golemCard = function() {
    return makeMinion(false, "Uncollectible", "Mean Streets of Gadgetzan", ["Neutral"], golem.name, golem.cost, 0, golem.baseHp, golem.baseDamage, false, false, false, golem.effects, golem.ai, golemCard);
    };
    golem.card = golemCard;
    
    if(!player.jadeBuff) {
        player.jadeBuff = 0;
    }
    player.jadeBuff++;
    
    return golem;
};

var filterArray = module.exports.filterArray = {
    hasEffect: function(array, effectName) {
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(array[i].hasEffectName(effectName)) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
    notHasEffect: function(array, effectName) {
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(!array[i].hasEffectName(effectName)) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
    hasName: function(array, name, contains) {
        // "contains" determines if you're looking for an exact match or just a name that includes a word; for instance, "all potions" would have contains = true, whereas "all versions of Kel'Thuzad" would more likely use contains = false and find an exact match
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(contains && array[i].name.indexOf(name) >= 0) {
                newArray.push(array[i]);
            } else if(!contains && array[i].name == name) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
    notHasName: function(array, name, contains) {
        // "contains" determines if you're looking for an exact match or just a name that includes a word; for instance, "all potions" would have contains = true, whereas "all versions of Kel'Thuzad" would more likely use contains = false and find an exact match
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(contains && array[i].name.indexOf(name) < 0) {
                newArray.push(array[i]);
            } else if(!contains && array[i].name != name) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
    hasType: function(array, type) {
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(array[i].type == type) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
    hasClass: function(array, className, excludeNeutral) {
        var newArray = [];
        for(var i in array) {
            if(typeof array[i] == "function") {
                array[i] = array[i]();
            }
            if(array[i].cardClass.indexOf(className)>=0) {
                newArray.push(array[i]);
            } else if(array[i].cardClass.indexOf("Neutral")>=0 && !excludeNeutral) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    },
};

module.exports.Discover = function(cardList, cardList2, cardList3, favorClass, allowCopies) {
    var isCopy = true;
    
    if(!cardList2) {
        cardList2 = cardList;
    }
    if(!cardList3) {
        cardList3 = cardList;
    }
    
    while(isCopy) {
        var card1 = cardList[Math.floor(Math.random()*cardList.length)];
        if(typeof card1 == "function") {
            card1 = card1();
        }
        isCopy = false;
    }
    isCopy = true;
    while(isCopy) {
        var card2 = cardList2[Math.floor(Math.random()*cardList2.length)];
        if(typeof card2 == "function") {
            card2 = card2();
        }
        if(card2 != card1 || allowCopies || cardList2.length <= 2) {
            isCopy = false;
        }
    }
    isCopy = true;
    while(isCopy) {
        var card3 = cardList3[Math.floor(Math.random()*cardList3.length)];
        if(typeof card3 == "function") {
            card3 = card3();
        }
        if((card3 != card1 && card3 != card2) || allowCopies || cardList3.length <= 1) {
            isCopy = false;
        }
    }
    printer.print("Options: " + card1.name + ", " + card2.name + ", " + card3.name + ".");
    return [card1, card2, card3];
};

module.exports.discoverChoose = function(options, player, returnLowest) {
    if(player.isPlayer) {
        console.log("Options: [1] " + options[0].name + ", [2] " + options[1].name + ", [3] " + options[2].name + ".");
        while(!response) {
            var response = readline.question(player.color + " " + player.name + ", choose an option: ");
            if(response.parseInt() > 0 && response.parseInt() <= 3) {
                return options[response.parseInt()-1];
            } else {
                console.log("Invalid input.");
                response = false;
            }
        }
    } else {
        var highestTier = 0;
        var bestCard = false;
        var lowestTier = 300;
        var lowestCard = false;
        for(var i in options) {
            if(options[i].tier && options[i].tier > highestTier) {
                highestTier = options[i].tier;
                bestCard = options[i];
            }
            if(options[i].tier && options[i].tier < lowestTier) {
                lowestTier = options[i].tier;
                lowestCard = options[i];
            }
        }
        if(options[0].tier == options[1].tier && options[1].tier == options[2].tier) {
            return options[Math.floor(Math.random()*options.length)];
        }
        if(returnLowest) {
            return lowestCard;
        }
        return bestCard;
    }
};

module.exports.addCard = function(card, player, context) {
    if (context.player.hand.length < 10) {
        context.player.hand.push(card);
        if(card.color == "Red" || card.color == "Blue" || !card.color) {
            card.color = player.color;
        }
        card.owner = context.player;
    } else {
        printer.print("No room in " + player.color + " " + player.name + "'s hand to receive " + card.name + ".");
    }
};

module.exports.addArmor = function(player, num, context) {
    player.armor += num;
    for(var i in player.minions) {
        var minion = player.minions[i];
        minion.triggerEffectType("armor gain hunger");
        minion.triggerEffectType("armor gain hunger friend");
    }
    for(i in context.foe.minions) {
        minion = context.foe.minions[i];
        minion.triggerEffectType("armor gain hunger");
        minion.triggerEffectType("armor gain hunger foe");
    }
};

module.exports.summon = function(minion, player, context) {
    if (context.player.minions.length < 7) {
        context.player.minions.push(minion);
        if(minion.color == "Red" || minion.color == "Blue" || !minion.color) {
            minion.color = player.color;
        }
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
                        player.minions[i].effects[m].action(player.minions[i], {player: context.player, foe: context.foe, cause: minion});
                    }
                }
            }
        }
        if(context.foe) {
            for (i = 0; i < context.foe.minions.length; i++) {
                if(!context.foe.minions[i].effects) {
                    throw new Error("oops");
                }
                for (var m = 0; m < context.foe.minions[i].effects.length; m++) {
                    if (context.foe.minions[i].effects[m].type === "summon hunger" || context.foe.minions[i].effects[m].type === "summon hunger foe") {
                        context.foe.minions[i].effects[m].action(context.foe.minions[i], {player: context.foe, foe: context.player, cause: minion});
                    }
                }
            }
        }
        for (i = 0; i < player.effects.length; i++) {
            if (player.effects[i].type === "summon hunger" || player.effects[i].type === "summon hunger friend") {
                context['minion'] = minion;
                player.effects[i].action(player, context);
            }
        }
        if(context.foe) {
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
    }
};

var Attack = module.exports.Attack = function(source, target, context) {
    if(!target) {
        return;
    }
    if (source.getDamage() > 0) {
        printer.print(source.color + " " + source.name + " attacks " + target.color + " " + target.name + ".");
        if(!context || !context.player) {
            console.log("debug");
        }
        for(var i = 0; i < context.player.effects.length; i++) {
            if((context.player.effects[i].type === "attack hunger" || context.player.effects[i].type === "attack hunger friend" ||
            (context.player.effects[i].type === "self defense" && target === context.player)) && !context.player.turn) {
                var newContext = context;
                newContext['player'] = context.player;
                newContext['foe'] = context.foe;
                newContext['attacker'] = source;
                newContext['target'] = target;
                newContext['damage'] = source.damage;
                var result = context.player.effects[i].action(newContext.player, newContext);
                if(result) {
                    target = result;
                }
            }
        }
        for(var i = 0; i < context.foe.effects.length; i++) {
            if((context.foe.effects[i].type === "attack hunger" || context.foe.effects[i].type === "attack hunger foe" ||
            (context.foe.effects[i].type === "self defense" && target === context.foe)) && !context.foe.turn) {
                var newContext = context;
                newContext['player'] = context.foe;
                newContext['foe'] = context.player;
                newContext['attacker'] = source;
                newContext['target'] = target;
                newContext['damage'] = source.damage;
                var result = context.foe.effects[i].action(newContext.player, newContext);
                if(result) {
                    target = result;
                }
            }
        }
        var mins = context.player.minions.slice();
        for(i in mins) {
            mins[i].triggerEffectType("attack hunger", {player: context.player, foe: context.foe, cause: mins[i], attacker: source, target: target, damage: source.damage});
            mins[i].triggerEffectType("attack hunger friend", {player: context.player, foe: context.foe, cause: mins[i], attacker: source, target: target, damage: source.damage});
        }
        mins = context.foe.minions.slice();
        for(i in mins) {
            mins[i].triggerEffectType("attack hunger", {player: context.player, foe: context.foe, cause: mins[i], attacker: source, target: target, damage: source.damage});
            mins[i].triggerEffectType("attack hunger foe", {player: context.player, foe: context.foe, cause: mins[i], attacker: source, target: target, damage: source.damage});
        }
        var damageDealt = source.getDamage();
        for(var i = 0; i < target.effects.length; i++) {
            if(target.effects[i].type === "self defense") {
                damageDealt = target.effects[i].action(target, {player: context.foe, foe: context.player, source: target, cause: source, damage: damageDealt} );
            }
        }
        dealDamage(target, damageDealt, {player: context.player, foe: context.foe, cause: source});
        if (target.type !== "hero" || target.getDamage() <= 0) {
            var damageDealt = target.getDamage();
            for(var i = 0; i < source.effects.length; i++) {
                if(source.effects[i].type === "self defense") {
                    damageDealt = source.effects[i].action(source, {player: context.player, foe: context.foe, source: source, cause: target, damage: damageDealt} );
                }
            }
            dealDamage(source, damageDealt, {
                player: context.foe,
                foe: context.player,
                cause: target
            });
        }
        if (source.type === "hero" && source.weapon) {
            var WeaponName = source.weapon.name;
            source.weapon.durability -= 1;
            printer.print("Remaining durability on the " + source.color + " " + source.name + "'s " + source.weapon.name + ": " + source.weapon.durability + ".");
            if (source.weapon.durability <= 0) {
                BreakWeapon(source, context);
                printer.print("The " + source.color + " " + source.name + "'s " + WeaponName + " shatters.");
            }
        }
        for(var i in source.effects) {
            if(source.effects[i].type == "on attack" || source.effects[i].type == "combat response") {
                source.effects[i].action(source, {player: context.player, foe: context.foe, cause: source, target: target, damage: damageDealt});
            }
        }
        for(i in target.effects) {
            if(target.effects[i].type == "on attacked" || target.effects[i].type == "combat response") {
                target.effects[i].action(target, {player: context.foe, foe: context.player, cause: target, target: source, damage: damageDealt});
            }
        }
        source.removeEffectName("Stealth");
    }
};

module.exports.shuffle = function(deck) {
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
            // printer.print("Minion killed by Life Check: " + context.player.minions[i].name + ". You should fix this!");
            module.exports.kill(context.player.minions[i], context);
        }
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        if (context.foe.minions[i].getHp() <= 0) {
            // printer.print("Minion killed by Life Check: " + context.foe.minions[i].name + ". You should fix this!");
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
    if (minion.type === "minion" && minion.owner) {
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
                // HI LOL
                // ok so let's run this thing
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
            if(!minion.minions[i].effects) {
                throw new Error("minion=" + minion.name + ",effects=" + minion.effects);
            }
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
    var hp = Math.round(genMaxHp(minion) - minion.damageTaken);
    if(minion.damageTaken < 0) {
        return maxHp;
    }
    return hp;
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
                if(!minion.weapon.effects[i]) {
                    throw new Error ("Broken, weapon=" + minion.weapon + ", weapon.name=" + minion.weapon.name + ", effects=" + minion.weapon.effects);
                }
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
                if(!minion.owner.minions[i].effects) {
                    throw("");
                }
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
    var dmg = Math.round(genMaxDamage(minion) - minion.damageLost);
    if(minion.damageLost < 0) {
        return genMaxDamage(minion);
    }
    return dmg;
};

module.exports.affectArray = {
    damage: function(array, damage, context, spell) {
        var original = array.slice();
        for(var i = 0; i < original.length; i++) {
            if(spell) {
                dealSpellDamage(original[i], damage, context);
            } else {
                dealDamage(original[i], damage, context);
            }
        }
    },
    heal: function(array, healing, context, spell) {
        var original = array.slice();
        for(var i = 0; i < original.length; i++) {
            // if(spell) {
                // healSpellDamage(original[i], healing, context);
            // } else {
                healDamage(original[i], healing, context);
            // }
        }
    },
    addEffect: function(array, effect) {
        var original = array.slice();
        for(var i = 0; i < original.length; i++) {
            try {
                original[i].addEffect(effect);
            } catch (e) {
                console.log("Error " + e + " in trying to affectArray.addEffect - minion = " + original[i] + ", minion effects = " + original[i].effects + ".");
            }
        }
    }
};

module.exports.checkForDuplicates = function(player, source) {
    printer.print(source.color + " " + source.name + " checks to see if there are any duplicates in " + player.color + " " + player.name + "'s deck.");
    var deckCards = [];
    for (var i = 0; i < player.deck.length; i++) {
        var card = player.deck[i];
        for (var m = 0; m < deckCards.length; m++) {
            if (card.card === deckCards[m].card) {
                return false;
            }
        }
        deckCards.push(card);
    }
    return true;
};

var getReversedHpEffect = function(num) {
    return {
        name: "Reversed HP",
        type: "set health",
        num: num
    }
};

var getReversedDmgEffect = function(num) {
    return {
        name: "Reversed DMG",
        type: "set damage",
        num: num
    }
};

module.exports.reverseStats = function(minion) {
    var initialHp = minion.getHp();
    var initialDmg = minion.getDamage();
    for(var i = 0; i < minion.effects.length; i++) {
        var effect = minion.effects[i];
        if(effect.type == "buff health" || effect.type == "buff damage" || effect.type == "set health" || effect.type == "set damage") {
            minion.effects.splice(i, 1);
            i--;
        }
    }
    minion.damageTaken = 0;
    minion.addEffect(getReversedHpEffect(initialDmg));
    minion.addEffect(getReversedDmgEffect(initialHp));
};

var AttackAI = module.exports.AttackAI = function(attacker, context) {
    var targetables = filters.Attack(context);
    targetables = filterArray.notHasEffect(targetables, "Immune");

    var friendShielded = attacker.getEffectsName("Divine Shield");

    var bestMinion = null;
    var bestDesirability = 0;
    
    for(var i = 0; i < targetables.length; i++) {
        var desirability = targetables[i].getDamage() + 1;
        
        var foeShielded = targetables[i].hasEffectName("Divine Shield");
        
        if(!attacker.getDamage()) {
            throw new Error("agh. attacker=" + attacker + ", attacker.name =" + attacker.name);
        }
        
        // if we can kill the minion, that's good
        if (attacker.getDamage() >= targetables[i].getHp() && !foeShielded) {
            desirability = desirability * 1.5 + 1;
        }
        
        // if we can kill it without dying that's amazing
        if (targetables[i].getDamage() <= attacker.getHp() || friendShielded) {
            desirability = desirability * 2 + 1;
        }
        
        // we want to strongly discourage suicide trades
        if (targetables[i].getDamage() >= attacker.getHp() && attacker.getDamage() <= targetables[i].getHp()) {
            desirability *= 0.4;
        }
        
        if (desirability > bestDesirability) {
            bestDesirability = desirability;
            bestMinion = targetables[i];
        }
        
        
        if(attacker.type === "hero") {
            desirability *= context.player.getHp()/(context.player.getMaxHp());
            if(targetables[i].getDamage() >= attacker.getHp()) {
                desirability = -1;
            }
        }
    };
    
    var hasTaunt = false;
    for(var i = 0; i < context.foe.minions.length; i++) {
        if(context.foe.minions[i].hasEffectName("Taunt")) {
            hasTaunt = true;
        }
    }

    if(!attacker.getDamage) {
        throw new Error("no getDamage");
    }
    var faceDesirability = attacker.getDamage();
    faceDesirability /= context.foe.getHp()/30;

    if ((bestDesirability > faceDesirability && bestMinion) || (hasTaunt && bestDesirability >= 2)) {
        return bestMinion;
    }
    return !hasTaunt ? targetables.indexOf(context.foe) >= 0 ? context.foe : false : false;
};

var withEffects = module.exports.withEffects = function (obj) {
    obj.isAlive = function() {
        return this.getHp() > 0;
    };
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
        if(ix >= 0) {
            if(effect.type == "buff health") {
                var num = effect.num;
                if(typeof num == "function") {
                    num = num();
                }
                num = Math.abs(num);
                this.damageTaken -= num;
                if(this.damageTaken < 0) {
                    this.damageTaken = 0;
                }
            }
            obj.effects.splice(ix, 1);
        }
    };
    obj.removeEffectName = function(name) {
        if(!name) {
            throw new Error("Can't remove null effect");
        }
        for(var i in this.effects) {
            if(this.effects[i].name == name) {
                var ix = i;
            }
        }
        if(ix >= 0) {
            if(this.effects[ix].type == "buff health") {
                var num = this.effects[ix].num;
                if(typeof num == "function") {
                    num = num();
                }
                num = Math.abs(num);
                this.damageTaken -= num;
                if(this.damageTaken < 0) {
                    this.damageTaken = 0;
                }
            }
            obj.effects.splice(ix, 1);
        }
    }
    obj.getEffectsName = function (name) {
        if (!name) {
            throw new Error("Unexpected null name!");
        }
        return filterArray.hasName(obj.effects, name);
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
                console.log("triggerEffectName() [effect.name=" + effect.name +
                ", effect.type=" + effect.type + ", effect action=" + effect.action +
                ", obj name=" + obj.name + ", object=" + obj + "]");
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
                ", effect.type=" + effect.type + ", effect action=" + effect.action +
                ", obj name=" + obj.name + ", object=" + obj + "]");
                throw new Error("Can't trigger action that doesn't exist");
            }
            else {
                effect.action(obj, context);
            }
        });
        if(obj.type == "hero" && obj.weapon) {
            effects = obj.weapon.getEffectsType(type);
            effects.forEach(function (effect) {
                if(!effect || !effect.action) {
                    console.log("triggerEffectType() [effect.name=" + effect.name +
                    ", effect.type=" + effect.type + ", effect action=" + effect.action +
                    ", obj name=" + obj.name + ", object=" + obj + "]");
                    throw new Error("Can't trigger action that doesn't exist");
                }
                else {
                    effect.action(obj, context);
                }
            });
        }
    };
    return obj;
};

module.exports.initialize = function(minion, owner) {
    minion.owner = owner;
    if(!minion.color && owner.color) {
        minion.color = owner.color;
    }
};

module.exports.makeSpell = function(rarity, cardSet, cardClass, name, cost, overload, ability, targetai, filter, ai, card, tier) {
    return withEffects ({
        type: "spell",
        rarity: rarity,
        cardSet: cardSet,
        color: false,
        cardClass: cardClass,
        name: name,
        cost: cost,
        ability: ability,
        targetai: targetai,
        filter: filter,
        effects: [],
        ai: ai,
        card: card,
        tier: tier
    });
};

module.exports.makeWeapon = function(rarity, cardSet, cardClass, name, cost, overload, baseDamage, durability, battlecry, targetai, filter, effects, ai, card, tier) {
    return withEffects ({
        type: "weapon",
        rarity: rarity,
        cardSet: cardSet,
        color: false,
        cardClass: cardClass,
        name: name,
        cost: cost,
        overload: overload,
        baseDamage: baseDamage,
        durability: durability,
        battlecry: battlecry,
        targetai: targetai,
        filter: filter,
        effects: effects,
        ai: ai,
        card: card,
        tier: tier
    });
};

var makeMinion = module.exports.makeMinion = function(race, rarity, cardSet, cardClass, name, cost, overload, maxHp, baseDamage, battlecry, targetai, filter, effects, ai, card, tier) {
    return withEffects({
        type: "minion",
        rarity: rarity,
        cardSet: cardSet,
        race: race,
        color: false,
        cardClass: cardClass,
        name: name,
        cost: cost,
        baseHp: maxHp,
        damageTaken: 0,
        baseDamage: baseDamage,
        damageLost: 0,
        battlecry: battlecry,
        targetai: targetai,
        filter: filter,
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