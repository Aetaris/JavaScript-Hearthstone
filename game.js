var heroes = require('./heroes.js');
// var cards = require('./cards.js');
var effectsModule = require('./effects.js');
var abilities = require('./abilities.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js');
var decks = require('./decks.js');
var setup = require('./setup.js');
// var adventures = require('./adventures.js');

var first;
var second;

var turnNum = 0;

printer.shred("results.txt");

var playCard = function(card, handPos, context) {
    context.player.hand.splice(handPos, 1);
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("card hunger", context);
        minion.triggerEffectType("card hunger", context);
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        var minion = context.foe.minions[i];
        minion.triggerEffectType("card hunger", {player: context.foe, foe: context.player, cause: context.cause});
        minion.triggerEffectType("card hunger foe", {player: context.foe, foe: context.player, cause: context.cause});
    }
    if (card.type === "minion") {
        printer.print("The " + context.player.color + " " + context.player.name + " summons " + card.name + "!");
        utilities.summon(card, context.player, context);
        if (card.battlecry) {
            if(card.targetai) {
                card.battlecry(card.targetai(context), card, {player: context.player, foe: context.foe, source: card});
            }
            else {
                card.battlecry(false, card, context);
            }
        }
    }
    if (card.type === "weapon") {
        printer.print(context.player.color + " " + context.player.name + " equips " + card.name + ".");
        utilities.Equip(card, context);
    }
    if (card.type === "spell") {
        if(card.targetai) {
            var target = card.targetai(context);
        }
        else {
            var target = false;
        }
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i];
            minion.triggerEffectType("spell hunger interrupt", context);
            minion.triggerEffectType("spell hunger interrupt friend", context);
        }
        for (i = 0; i < context.foe.minions.length; i++) {
            minion = context.foe.minions[i];
            minion.triggerEffectType("spell hunger interrupt", {player: context.foe, foe: context.player, cause: context.cause});
            minion.triggerEffectType("spell hunger interrupt foe", {player: context.foe, foe: context.player, cause: context.cause});
        }
        if(typeof(card.ability) !== "function") {
            console.log("");
        }
        card.ability(target, {
            player: context.player,
            foe: context.foe,
            cause: card,
            target: function() { if(card.targetai) { return card.targetai(context) } else { return false } }()
        });
        for (var i = 0; i < context.player.minions.length; i++) {
            var minion = context.player.minions[i];
            minion.triggerEffectType("spell hunger", context);
            minion.triggerEffectType("spell hunger friend", context);
        }
        for (i = 0; i < context.foe.minions.length; i++) {
            minion = context.foe.minions[i];
            minion.triggerEffectType("spell hunger", {player: context.foe, foe: context.player, cause: context.cause});
            minion.triggerEffectType("spell hunger foe", {player: context.foe, foe: context.player, cause: context.cause});
        }
    }
};

var checkCards = function(context) {
    for (var q = 0; q < 4; q++) {
        for (var i = 0; i < context.player.hand.length; i++) {
            var card = context.player.hand[i];
            var cost = card.cost;
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
                            cost += effect.action( {player: context.foe, foe: context.player, cause: card} );
                        }
                    }
                }
            }
            if (context.player.mana >= cost) {
                var shouldUse = false;
                if (!card.ai) {
                    printer.print("Warning: Card [" + card.name + "] has no AI.");
                    continue;
                }
                if (card.ai({
                        player: context.player,
                        foe: context.foe,
                        cause: card
                    })) {
                    shouldUse = true;
                    if (card.type === "minion" && context.player.minions.length >= 7) {
                        shouldUse = false;
                    }
                }
                if (cost < context.player.mana) {
                    for (var o = 0; o < context.player.hand.length; o++) {
                        var other = context.player.hand[i];
                        if (other.cost <= context.player.mana && other.cost > (context.player.mana - card.cost) && other.cost > card.cost && other.ai({
                                player: context.player,
                                foe: context.foe,
                                cause: other
                            })) {
                            shouldUse = false;
                        }
                    }
                }
            }
            if (shouldUse && context.player.mana >= cost) {
                context.player.mana -= cost;
                if (card.overload) {
                    context.player.lockedMana += card.overload;
                }
                playCard(card, i, context);
            }
            if (!shouldUse) {
                continue;
            }
        }
    }
};

var Attack = function(source, target, context) {
    if(!target) {
        console.log("debug");
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
        var damageDealt = source.getDamage();
        for(var i = 0; i < target.effects.length; i++) {
            if(target.effects[i].type === "self defense") {
                damageDealt = target.effects[i].action( {player: context.foe, foe: context.player, source: target, cause: source, damage: damageDealt} );
            }
        }
        utilities.dealDamage(target, damageDealt, {player: context.player, foe: context.foe, cause: source});
        if (target.type !== "hero" || target.getDamage() <= 0) {
            var damageDealt = target.getDamage();
            for(var i = 0; i < source.effects.length; i++) {
                if(source.effects[i].type === "self defense") {
                    damageDealt = source.effects[i].action( {player: context.player, foe: context.foe, source: source, cause: target, damage: damageDealt} );
                }
            }
            utilities.dealDamage(source, damageDealt, {
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
                utilities.BreakWeapon(source, context);
                printer.print("The " + source.color + " " + source.name + "'s " + WeaponName + " shatters.");
            }
        }
    }
};

// var AttackAIOld = function(attacker, context) {
//     var AttackTarget = context.foe;
//     var NoTaunt = true;
//     var Targetable = context.foe.minions.slice();
//     for (var i = 0; i < context.foe.minions.length; i++) {
//         var minion = context.foe.minions[i];
//         if (!minion.effects) {
//             printer.print * ("WHAT! Minion has no effects: " + minion.name);
//             continue;
//         }
//         for (var o = 0; o < minion.effects.length; o++) {
//             if (minion.effects[o].name === "Taunt") {
//                 AttackTarget = minion;
//                 NoTaunt = false;
//             }
//             if (minion.effects[o].name === "Stealth") {
//                 // NO!! THIS CHANGES THE ARRAY!
//                 Targetable.splice(Targetable.indexOf(minion, 1));
//             }
//         }
//     }
//     if (NoTaunt) {
//         for (i = 0; i < Targetable.length; i++) {
//             if ((attacker.getDamage() >= Targetable[i].getHp() && (Targetable[i].getDamage() < attacker.getHp()) || ((attacker.getDamage() === 1))
//             && (Targetable[i].getHp() > 4 || Targetable[i].getDamage() > 4 || (attacker.getDamage() === 1 && Targetable[i].getHp() === 1))) && attacker.getDamage() <= 10) {
//                 AttackTarget = Targetable[i];
//             }
//         }
//         if (Targetable.length === 0 || context.foe.getHp() <= attacker.getDamage()) {
//             AttackTarget = context.foe;
//         }
//     }
//     return AttackTarget;
// };

var AttackAI = function(attacker, context) {
    var targetables = context.foe.minions.filter(function (m) {
        return m.effects && !m.hasEffectName("Stealth") && !m.hasEffectName("Immune");
    });
    var taunt_targetables = targetables.filter(function (m) {
        return m.hasEffectName("Taunt");
    });
    if (taunt_targetables.length > 0) {
        targetables = taunt_targetables;
    }

    var friendShielded = attacker.hasEffectName("Divine Shield");

    var bestMinion = null;
    var bestDesirability = 0;

    targetables.forEach(function (m) {
        var desirability = m.getDamage();
        
        var foeShielded = m.hasEffectName("Divine Shield");
        
        // if we can kill the minion, that's good
        if (attacker.getDamage >= m.getHp() && !foeShielded) {
            desirability *= 1.33;
        }
        
        // if we can kill it without dying that's amazing
        if (m.getDamage() <= attacker.getHp() || friendShielded) {
            desirability *= 1.5;
        }
        
        // we want to strongly discourage suicide trades
        if (m.getDamage() >= attacker.getHp() && attacker.getDamage() <= m.getHp()) {
            desirability *= 0.4;
        }
        
        if (desirability > bestDesirability) {
            bestDesirability = desirability;
            bestMinion = m;
        }
        
        desirability /= 0.5*context.player.getHp()/30;
        
        if(attacker.type === "hero" && m.getDamage() > attacker.getHp()) {
            desirability = -1;
        }
    });


    var faceDesirability = attacker.getDamage();
    faceDesirability /= context.foe.getHp()/30;

    if (bestDesirability > faceDesirability && bestMinion) {
        return bestMinion;
    }
    return context.foe;
};

var MinionsAttack = function(context) {
    var CanAttack;
    var stillAttacking = true;
    while(stillAttacking) {
        stillAttacking = false;
        for (var i = 0; i < context.player.minions.length; i++) {
            CanAttack = true;
            var minion = context.player.minions[i];
            // Effects that prevent attacking prevent attacks.
            if(minion.hasEffectName("Can't Attack") || minion.hasEffectName("Frozen") || minion.hasEffectName("Permanently Frozen")) {
                CanAttack = false;
            }
            var sicknessStacks = minion.getEffectsName("Summoning Sickness").length;
            if(sicknessStacks >= 1 && !minion.hasEffectName("Windfury")) {
                CanAttack = false;
            }
            if(sicknessStacks >= 2 && !minion.hasEffectName("Mega-Windfury")) {
                CanAttack = false;
            }
            if(sicknessStacks >= 4) {
                CanAttack = false;
            }
            if (CanAttack) {
                stillAttacking = true;
                Attack(context.player.minions[i], AttackAI(context.player.minions[i], context), {
                    player: context.player,
                    foe: context.foe,
                    cause: context.player.minions[i]
                });
                minion.addEffect(effectsModule.sickness);
            }
        }
    }
};

var runTurn = function(player, foe) {
    if (player.getHp() > 0 && foe.getHp() > 0) {
        player.turn = true;
        foe.turn = false;
        turnNum += 0.5;
        printer.print("");
        printer.print("It is now the " + player.color + " " + player.name + "'s turn.");
        printer.print("");
        for (i = 0; i < player.minions.length; i++) {
            var minion = player.minions[i];
            // make a COPY of the effects array for safe iteration
            var effects = minion.effects.slice();
            // and start building an array of elements to DELETE
            var toDelete = {};
            minion.triggerEffectType("start of turn", {player: player, foe: foe, cause: minion});
            minion.triggerEffectType("start of turn friend", {player: player, foe: foe, cause: minion});
            // for(var m = 0; m < effects.length; m++) {
            //     if(effects[m].type === "start of turn" || effects[m].type === "start of turn friend") {
            //         effects[m].action(minion, { player: player, foe: foe, cause: minion } );
            //     }
            // }
            for (var o = 0; o < player.minions[i].effects.length; o++) {
                if (player.minions[i].effects[o].name === "Summoning Sickness") {
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
        }
        for (i = 0; i < foe.minions.length; i++) {
            for(var m = 0; m < foe.minions[i].effects.length; m++) {
                if(foe.minions[i].effects[m].type === "start of turn" || foe.minions[i].effects[m].type === "start of turn foe") {
                    foe.minions[i].effects[m].action(foe.minions[i], { player: foe, foe: player, cause: foe.minions[i] });
                }
            }
        }
        for(var m = 0; m < player.effects.length; m++) {
                if(player.effects[m].type === "start of turn" || player.effects[m].type === "start of turn friend") {
                    player.effects[m].action(player, { player: player, foe: foe, cause: player });
                }
            }
        for(var m = 0; m < foe.effects.length; m++) {
                if(foe.effects[m].type === "start of turn" || foe.effects[m].type === "start of turn foe") {
                    foe.effects[m].action(foe, { player: player, foe: foe, cause: foe });
                }
            }
        for (o = 0; o < player.effects.length; o++) {
            if (player.effects[o].name === "Summoning Sickness") {
                player.effects.splice(o, 1);
                o -= 1;
            }
        }
        for(var a = 0; a < player.hand.length; a++) {
            if(player.hand[a].type === "minion") {
                for(var b = 0; b < player.hand[a].effects.length; b++) {
                    var card = player.hand[a].effects[b];
                    if(!card) {
                        throw new Error("blah");
                    }
                    if(card.type === "hand start of turn") {
                        card.action( {player: player, foe: foe, cause: false });
                    }
                }
            }
        }
        if (player.maxMana < 10 && player.hero.name !== "Lady Deathwhisper") {
            player.maxMana += 1;
        }
        player.mana = player.maxMana - player.lockedMana;
        
        var manaDisplay = player.mana;
        if(player.lockedMana > 0) {
            manaDisplay = manaDisplay + " [overload " + player.lockedMana + "]"
        }
        printer.print("The " + player.color + " " + player.name + " now has " + manaDisplay + " Mana Crystals and " + player.deck.length + " cards left in their deck.");
        if(player.deck.length === 0) {
            printer.print("Next draw fatigues for " + player.fatigue + ".");
        }
        player.lockedMana = 0;
        utilities.checkForLife({
            player: player,
            foe: foe,
            cause: "Life Check"
        });
        var playerHealth = player.getHp();
        if(player.armor > 0) {
            playerHealth = playerHealth + " [" + player.armor + "]";
        }
        var foeHealth = foe.getHp();
        if(foe.armor > 0) {
            foeHealth = foeHealth + " [" + foe.armor + "]";
        }
        
        printer.print(player.color + " " + player.name + "'s Health: " + playerHealth + " || " + foe.color + " " + foe.name + "'s Health: " + foeHealth + ".");
        if(player.minions.length > 0) {
            printer.print("The " + player.color + " " + player.name + " currently has " + player.minions.length + " minions on the board:");
            for (i = 0; i < player.minions.length; i++) {
                var description = "[" + player.minions[i].name + "] - " + player.minions[i].getDamage() + "/" + player.minions[i].getHp();
                for(var a = 0; a < player.minions[i].effects.length; a++) {
                    if(player.minions[i].effects[a].name === "Divine Shield") {
                        description = description + " [Shield]";
                    }
                }
                printer.print(description);
            }
        } else {
            printer.print("The " + player.color + " " + player.name + " does not currently have any minions on the board.")
        }
        utilities.drawCard(player, {
            player: player,
            foe: foe,
            cause: false
        });
        printer.print("The " + player.color + " " + player.name + "'s hand now contains:");
        for (var i = 0; i < player.hand.length; i++) {
            var card = player.hand[i];
            var cost = player.hand[i].cost;
            player.minions.forEach(function (minion) {
                minion.effects.forEach(function (effect) {
                    if(effect.type === "aura hand friend buff cost" || effect.type === "aura hand buff cost") {
                        if(effect.num) {
                            cost += effect.num;
                        }
                        else if(effect.action) {
                            cost += effect.action( {player: player, foe: foe, cause: card} );
                        }
                    }
                });
            });
            foe.minions.forEach(function (minion) {
                minion.effects.forEach(function (effect) {
                    if(effect.type === "aura hand foe buff cost" || effect.type === "aura hand buff cost") {
                        if(effect.num) {
                            cost += effect.num;
                        }
                        else if(effect.action) {
                            cost += effect.action( {player: foe, foe: player, cause: card} );
                        }
                    }
                });
            });
            printer.print(cost + ": " + player.hand[i].name);
        }
        checkCards({
            player: player,
            foe: foe,
            cause: false
        });
        if(player.getHp() <= 0 || foe.getHp() <= 0) {
            return;
        }
        if(player.ability) {
            if (player.mana >= player.cost && player.ai && player.ai({
                    player: player,
                    foe: foe,
                    cause: false
                })) {
                player.mana -= player.cost;
                if (typeof(player.ability) != 'function') {
                    printer.print("Eek! TYpe of ability: " + typeof(player.ability));
                    printer.print("More eek: ability: " + player.ability);
                    printer.print("In fact... is it null? : " + (player.ability === null));
                }
                var target = foe;
                if(player.hero.targetai) {
                    target = player.hero.targetai( {player: player, foe: foe, cause: false} );
                }
                player.ability(target, {
                    player: player,
                    foe: foe,
                    cause: player
                });
                for (var c = 0; c < player.minions.length; c++) {
                    for (var d = 0; d < player.minions[c].effects.length; d++) {
                        if (player.minions[c].effects[d].type === "inspire") {
                            player.minions[c].effects[d].action(player.minions[c], {
                                player: player,
                                foe: foe,
                                cause: player.minions[c]
                            });
                        }
                    }
                }
            }
        }
        if(player.getHp() <= 0 || foe.getHp() <= 0) {
            return;
        }
        checkCards({
            player: player,
            foe: foe,
            cause: false
        });
        if(player.getHp() <= 0 || foe.getHp() <= 0) {
            return;
        }
        if (player.getDamage() > 0) {
            var faceTarget = AttackAI(player, {
                player: player,
                foe: foe,
                cause: player
            });
            if (faceTarget) {
                Attack(player, faceTarget, {player: player, foe: foe});
            }
        }
        if(player.getHp() <= 0 || foe.getHp() <= 0) {
            return;
        }
        utilities.checkForLife({
            player: player,
            foe: foe,
            cause: "Life Check"
        });
        MinionsAttack({
            player: player,
            foe: foe,
            cause: false
        });
        for(var m = 0; m < player.effects.length; m++) {
            if(player.effects[m].type === "end of turn" || player.effects[m].type === "end of turn friend") {
                player.effects[m].action(player, { player: player, foe: foe, cause: player });
            }
        }
        for(var m = 0; m < foe.effects.length; m++) {
                if(foe.effects[m].type === "end of turn" || foe.effects[m].type === "end of turn foe") {
                    foe.effects[m].action(foe, { player: foe, foe: player, source: foe });
                }
            }
        for (i = 0; i < player.minions.length; i++) {
            minion = player.minions[i];
            // make a COPY of the effects array for safe iteration
            if (minion.effects) {
                effects = minion.effects.slice();
                // and start building an array of elements to DELETE
                minion.triggerEffectType("end of turn", {player: player, foe: foe, cause: minion});
                minion.triggerEffectType("end of turn friend", {player: player, foe: foe, cause: minion});
                // for(var m = 0; m < effects.length; m++) {
                //     if(effects[m].type === "end of turn" || effects[m].type === "end of turn friend") {
                //         effects[m].action(minion, { player: player, foe: foe, cause: minion });
                //     }
                // }
                toDelete = {};
                if(minion.hasEffectName("Frozen")) {
                    minion.removeEffect(effectsModule.frozen);
                }
            }
            else {
                printer.print("Minion " + minion.name + " has no Effects array.");
            }
            utilities.checkForLife({
                player: player,
                foe: foe,
                cause: "Life Check"
            });
        }
        if(player.getHp() <= 0 || foe.getHp() <= 0) {
            return;
        }
    };
};

var turnLoop = function() {
    while (red.getHp() > 0 && blue.getHp() > 0 && turnNum <= 45) {
        runTurn(first, second);
        runTurn(second, first);
    }
    // if we get here, the combat has ended
    if (red.getHp() <= 0 && blue.getHp() > 0) {
        printer.print("The Red " + red.name + " has been defeated! The Blue " + blue.name + " is victorious!");
        if(red.taunts.victory) {
            printer.print(red.color + " " + red.name + ": " + red.taunts.victory);
        }
        if(blue.taunts.victory) {
            printer.print(blue.color + " " + blue.name + ": " + blue.taunts.victory);
        }
        if(red.taunts.defeat) {
            printer.print(red.color + " " + red.name + ": " + red.taunts.defeat);
        }
        if(blue.taunts.defeat) {
            printer.print(blue.color + " " + blue.name + ": " + blue.taunts.defeat);
        }
        console.log("Winner: Blue " + blue.name);
        return "blue";
    }
    else if (blue.getHp() <= 0 && red.getHp() > 0) {
        printer.print("The Blue " + blue.name + " has been defeated! The Red " + red.name + " is victorious!");
        console.log("Winner: Red " + red.name);
        return "red";
    }
    else if ((blue.getHp() <= 0 && red.getHp() <= 0) || turnNum > 45) {
        printer.print("The Red " + red.name + " and the Blue " + blue.name + " were both defeated, resulting in a tie!");
        return false;
    }
    else {
        printer.print("Huh? No sane combat conclusion identified! Red/Blue = [" + red.getHp() + "/" + blue.getHp() + "]");
        return false;
    }
};

printer.print("");
printer.print("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
printer.print("");

var red = setup.hero('red');
var blue = setup.hero('blue');

setup.randomizeHero(red);
// setup.setHero(red, heroes.LadyDeathwhisper_Normal());
setup.randomizeHero(blue);
// setup.setHero(blue, heroes.C_Skybreaker_Heroic());

var randomNum = Math.round(Math.random(0, 1));
if (randomNum === 0) {
    first = red;
    second = blue;
}
if (randomNum === 1) {
    first = blue;
    second = red;
}

var runGame = module.exports.runGame = function(redClass, redDeck, blueClass, blueDeck) {
    red = setup.hero('red');
    blue = setup.hero('blue');
    red.hero = redClass;
    red.name = redClass.name;
    red.ability = redClass.ability;
    red.cost = redClass.cost;
    red.ai = redClass.ai;
    red.deck = redDeck.slice();
    // red.deck = decks.C_LadyDeathwhisper_Normal();
    blue.name = blueClass.name;
    blue.ability = blueClass.ability;
    blue.cost = blueClass.cost;
    blue.ai = blueClass.ai;
    blue.deck = blueDeck.slice();
    // blue.deck = decks.mulligantest();
    utilities.shuffle(red.deck);
    utilities.shuffle(blue.deck);
    // red.maxMana = 5;
    // red.baseHp = 12;
    red.armor = 120;
    blue.armor = 120;
    printer.print("Red: " + red.name);
    printer.print("Blue: " + blue.name);
    console.log("Red: " + red.name);
    console.log("Blue: " + blue.name);
    printer.print("");
    var randomNum = Math.round(Math.random(0, 1));
    if (randomNum === 0) {
        first = red;
        second = blue;
    }
    if (randomNum === 1) {
        first = blue;
        second = red;
    }
    
    if(red.taunts.start) {
        printer.print(red.color + " " + red.name + ": " + red.taunts.start);
    }
    if(blue.taunts.start) {
        printer.print(blue.color + " " + blue.name + ": " + blue.taunts.start);
    }
    
    setup.drawStartCards(first, second);
    var result = turnLoop();
    return result;
};

runGame(red.hero, red.deck, blue.hero, blue.deck);