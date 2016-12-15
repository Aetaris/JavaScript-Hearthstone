var heroes = require('./heroes.js');
// var cards = require('./cards.js');
var effectsModule = require('./effects.js');
//var abilities = require('./abilities.js');
var utilities = require('./utilities.js');
var printer = require('./printer.js');
var decks = require('./decks.js');
var setup = require('./setup.js');
var adventures = require('./adventures.js');
var filters = require('./filters.js');

var playerModule= require('./player.js');

//const readline = require('readline-sync');

var first;
var second;

var scenario = false;

var turnNum = 0.5;

printer.shred("results.txt");

var playCard = function(card, handPos, context) {
    context.player.hand.splice(handPos, 1);
    for (var i = 0; i < context.player.minions.length; i++) {
        var minion = context.player.minions[i];
        minion.triggerEffectType("card hunger", context);
        minion.triggerEffectType("card hunger", context);
    }
    for (i = 0; i < context.foe.minions.length; i++) {
        minion = context.foe.minions[i];
        minion.triggerEffectType("card hunger", {player: context.foe, foe: context.player, cause: context.cause});
        minion.triggerEffectType("card hunger foe", {player: context.foe, foe: context.player, cause: context.cause});
    }
    if (card.type === "minion") {
        printer.print("The " + context.player.color + " " + context.player.name + " summons " + card.name + "!");
        utilities.summon(card, context.player, context);
        if (card.battlecry) {
            if(card.chooseAi) {
                if(context.player.isPlayer) {
                    var choice = playerModule.command_target(context.player, filters.ChooseOne, context);
                }
                else {
                    choice = card.chooseAi(filters.ChooseOne(context), context);
                }
            }
            if(card.targetai) {
                if(typeof card.filter !== "function") {
                    throw new Error("broken");
                }
                if(context.player.isPlayer) {
                    card.battlecry(playerModule.command_target(context.player, card.filter, context), card, {player: context.player, foe: context.foe, source: card, choice: choice});
                }
                else {
                    card.battlecry(card.targetai(card.filter({player: context.player, foe: context.foe, choice: choice}), context), card, {player: context.player, foe: context.foe, source: card, choice: choice});
                }
            }
            else {
                card.battlecry(false, card, {player: context.player, foe: context.foe, source: card, choice: choice});
            }
        }
    }
    if (card.type === "weapon") {
        printer.print(context.player.color + " " + context.player.name + " equips " + card.name + ".");
        utilities.Equip(card, context);
        if (card.battlecry) {
            if(card.targetai) {
                if(typeof card.filter !== "function") {
                    throw new Error("broken");
                }
                if(context.player.isPlayer) {
                    card.battlecry(playerModule.command_target(context.player, card.filter, context), card, {player: context.player, foe: context.foe, source: card});
                }
                else {
                    card.battlecry(card.targetai(card.filter(context), context), card, {player: context.player, foe: context.foe, source: card, cause: card});
                }
            }
            else {
                card.battlecry(false, card, context);
            }
        }
    }
    if (card.type === "spell") {
        if(card.chooseAi) {
            if(context.player.isPlayer) {
                var choice = playerModule.command_target(context.player, filters.ChooseOne, context);
            }
            else {
                choice = card.chooseAi(filters.ChooseOne(context), context);
            }
        }
        if(card.targetai) {
            if(typeof card.filter != "function") {
                throw new Error("Filter not function");
            }
            if(context.player.isPlayer == true) {
                var target = playerModule.command_target(context.player, card.filter, {player: context.player, foe: context.foe, scenario: scenario, cause: card, choice: choice});
            } else {
                target = card.targetai(card.filter({player: context.player, foe: context.foe, choice: choice}), {player: context.player, foe: context.foe, scenario: scenario, cause: card, choice: choice});
            }
        }
        else {
            target = false;
        }
        for (var i = 0; i < context.player.minions.length; i++) {
            minion = context.player.minions[i];
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
            choice: choice,
            target: function() { if(card.targetai) { return card.targetai(card.filter(context), context) } else { return false } }()
        });
        for (var i = 0; i < context.player.minions.length; i++) {
            minion = context.player.minions[i];
            minion.triggerEffectType("spell hunger", context);
            minion.triggerEffectType("spell hunger friend", context);
        }
        for (i = 0; i < context.foe.minions.length; i++) {
            minion = context.foe.minions[i];
            minion.triggerEffectType("spell hunger", {player: context.foe, foe: context.player, cause: context.cause});
            minion.triggerEffectType("spell hunger foe", {player: context.foe, foe: context.player, cause: context.cause});
        }
        if(typeof card.card !== "function") {
        throw new Error("This spell's 'card' is not a function.");
    }
        context.player.graveyard.push(card.card());
    }
};

var checkCards = function(context) {
    for (var q = 0; q < 4; q++) {
        for (var i = 0; i < context.player.hand.length; i++) {
            var card = context.player.hand[i];
            var cost = utilities.getCardCost(card, context);
            if (context.player.mana >= cost) {
                var shouldUse = false;
                if (!card.ai) {
                    printer.print("Warning: Card [" + card.name + "] has no AI.");
                    continue;
                }
                if (card.ai({
                        player: context.player,
                        foe: scenario && scenario.attackTarget ? scenario : context.foe,
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
                                foe: scenario && scenario.attackTarget ? scenario : context.foe,
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
                playCard(card, i, {player: context.player, foe: scenario && scenario.attackTarget ? scenario : context.foe, cause: context.player});
            }
            if (!shouldUse) {
                continue;
            }
        }
    }
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
            if(minion.getDamage() <= 0) {
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
                utilities.Attack(context.player.minions[i], utilities.AttackAI(context.player.minions[i], {player: context.player, foe: scenario && scenario.attackTarget ? scenario : context.foe, cause: context.player.minions[i]}), {
                    player: context.player,
                    foe: scenario && scenario.attackTarget ? scenario : context.foe,
                    cause: context.player.minions[i]
                });
                minion.addEffect(effectsModule.sickness);
            }
        }
    }
};

var runTurn = function(player, foe) {
    
    /** if there's no scenario
     *      * if both are alive
     ** if there's a scenario
     *      * if scenario is alive
     *      * if the player is alive
     *          * if mustDefeatBoth is true and other player is alive
    */
    
    var takeTurn = false;
    if(!scenario && player.getHp() > 0 && foe.getHp() > 0) {
        takeTurn = true;
    } else if(scenario) {
        if(scenario.getHp() > 0) {
            if(player.getHp() > 0) {
                if(scenario.mustDefeatBoth == true || foe.getHp() > 0) {
                    takeTurn = true;
                }
            }
        }
    }
    if(turnNum >= 45) {
        utilities.dealDamage(player, 10000, {player: foe, foe: player});
        utilities.dealDamage(foe, 10000, {player: player, foe: foe});
        takeTurn = false;
    }
    
    if(takeTurn == true) {
        
        if(scenario) {
            scenario.turn = true;
        }
        if(scenario && scenario.startOfMatch.greeting && (turnNum == 0 || turnNum == 0.5)) {
            printer.print("");
            scenario.startOfMatch.greeting(player);
            // printer.print("");
        }
        
        if(scenario && scenario.abilities) {
            printer.print("");
            if(scenario.minions) {
                for (var i = 0; i < scenario.minions.length; i++) {
                    var minion = scenario.minions[i];    
                    minion.triggerEffectType("start of turn", {player: scenario, first, cause: minion});
                    minion.triggerEffectType("start of turn friend", {player: scenario, foe: first, cause: minion});
                }
            }
            var ability = scenario.abilities[Math.floor(Math.random() * scenario.abilities.length)];
            if(turnNum % 1 == 0 || turnNum == 0) {
                ability(player, foe, scenario);
            }
            else {
                if(!ability) {
                    throw new Error("Scenario has no ability");
                }
                ability(foe, player, scenario);
            }
            if(scenario.minions) {
                for (var i = 0; i < scenario.minions.length; i++) {
                    minion = scenario.minions[i];    
                    minion.triggerEffectType("end of turn", {player: scenario, first, cause: minion});
                    minion.triggerEffectType("end of turn friend", {player: scenario, foe: first, cause: minion});
                }
            }
        }
        
        if(scenario) {
            scenario.turn = false;
        }
    }
    
    takeTurn = false;
    if(!scenario && player.getHp() > 0 && foe.getHp() > 0) {
        takeTurn = true;
    } else if(scenario) {
        if(scenario.getHp() > 0) {
            if(player.getHp() > 0) {
                if(scenario.mustDefeatBoth == true || foe.getHp() > 0) {
                    takeTurn = true;
                }
            }
        }
    }
    
    if(takeTurn == true) {
        
        if(player.isPlayer || foe.isPlayer) {
            if(player.isPlayer == true) {
                console.log("It is now your turn.");
            } else {
                console.log("The " + player.color + " " + player.name + " is now taking their turn.");
            }
            console.log("");
        }
        
        player.turn = true;
        foe.turn = false;
        turnNum += 0.5;
        printer.print("");
        printer.print("It is now the " + player.color + " " + player.name + "'s turn.");
        printer.print("");
        
        for (i = 0; i < player.minions.length; i++) {
            minion = player.minions[i];
            // make a COPY of the effects array for safe iteration
            var effects = minion.effects.slice();
            // and start building an array of elements to DELETE
            var toDelete = {};
            
            minion.triggerEffectType("start of turn", {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: minion});
            minion.triggerEffectType("start of turn friend", {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: minion});
            // for(var m = 0; m < effects.length; m++) {
            //     if(effects[m].type === "start of turn" || effects[m].type === "start of turn friend") {
            //         effects[m].action(minion, { player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario, cause: minion } );
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
                    foe.minions[i].effects[m].action(foe.minions[i], { player: foe, foe: scenario && scenario.attackTarget ? scenario : player, cause: foe.minions[i] });
                }
            }
        }
        for(m = 0; m < player.effects.length; m++) {
                if(player.effects[m].type === "start of turn" || player.effects[m].type === "start of turn friend") {
                    player.effects[m].action(player, { player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: player });
                }
            }
        for(m = 0; m < foe.effects.length; m++) {
                if(foe.effects[m].type === "start of turn" || foe.effects[m].type === "start of turn foe") {
                    foe.effects[m].action(foe, { player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: foe });
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
                        card.action( {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: false });
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
            manaDisplay = manaDisplay + " [overload " + player.lockedMana + "]";
        }
        printer.print("The " + player.color + " " + player.name + " now has " + manaDisplay + " Mana Crystals and " + player.deck.length + " cards left in their deck.");
        if(player.deck.length === 0) {
            printer.print("Next draw fatigues for " + player.fatigue + ".");
        }
        player.lockedMana = 0;
        utilities.checkForLife({
            player: player,
            foe: scenario && scenario.attackTarget ? scenario : foe,
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
        
        printer.print(player.color + " " + player.name + "'s Health: " + (player.getHp() > 0 ? playerHealth : "--Defeated--") + " || " + foe.color + " " + foe.name + "'s Health: " + (foe.getHp() > 0 ? foeHealth : "--Defeated--"));
        if(scenario) {
            printer.print(scenario.name + "'s Health: " + scenario.getHp() + (scenario.armor > 0 ? "[" + scenario.armor + "]" : ""));
        }
        if(player.minions.length > 0) {
            printer.print("The " + player.color + " " + player.name + " currently has " + player.minions.length + " minions on the board:");
            for (i = 0; i < player.minions.length; i++) {
                var description = "[" + player.minions[i].name + "] - " + player.minions[i].getDamage() + "/" + player.minions[i].getHp();
                // for(var a = 0; a < player.minions[i].effects.length; a++) {
                //     if(player.minions[i].effects[a].name === "Divine Shield") {
                //         description = description + " [Shield]";
                //     }
                // }
                if(player.minions[i].hasEffectName("Divine Shield")) {
                    description = description + " [Shield]";
                }
                if(player.minions[i].hasEffectName("Immune")) {
                    description = description + " [Immune]";
                }
                if(player.minions[i].hasEffectName("Stealth")) {
                    description = description + " [Stealth]";
                }
                if(player.minions[i].hasEffectName("Silence")) {
                    description = description + " [---]";
                }
                printer.print(description);
            }
        } else {
            printer.print("The " + player.color + " " + player.name + " does not currently have any minions on the board.");
        }
        utilities.drawCard(player, {
            player: player,
            foe: scenario && scenario.attackTarget ? scenario : foe,
            cause: false
        });
        if(player.isPlayer == true || foe.isPlayer == false) {
            printer.print("The " + player.color + " " + player.name + "'s hand now contains:");
            for (var i = 0; i < player.hand.length; i++) {
                var cost = utilities.getCardCost(player.hand[i], {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
                printer.print("[" + (i + 1) + "] " + player.hand[i].name + " - " + cost);
            }
        }
        else {
            printer.print("The " + player.color + " " + player.name + "'s hand now contains " + player.hand.length + " cards.");
        }
        
        // +++++++++++++++++++++++++++++++++++++++++
        
        if(player.isPlayer == true) {
            
            var stillPlaying = true;
            while(stillPlaying) {
                var response = playerModule.command_action(player, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
                
                if(response.action && response.action == "play") {
                    card = response.card;
                    if(card) {
                        player.mana -= utilities.getCardCost(card, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
                        playCard(card, player.hand.indexOf(card), {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: player});
                    }
                    console.log("");
                }
                else if(response.action && response.action == "attack") {
                    var CanAttack = true;
                    minion = response.minion;
                    // Effects that prevent attacking prevent attacks.
                    if(minion.hasEffectName("Can't Attack") || minion.hasEffectName("Frozen") || minion.hasEffectName("Permanently Frozen")) {
                        CanAttack = false;
                    }
                    if(minion.getDamage() <= 0) {
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
                    if(CanAttack) {
                        var target = playerModule.command_target(player, filters.Attack, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario, cause: response.minion});
                        utilities.Attack(response.minion, target, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
                        response.minion.effects.push(effectsModule.sickness);
                    } else {
                        console.log("That minion can't attack right now.");
                    }
                }
                
                else if(response.action && response.action == "hero power") {
                    target = false;
                    if(player.hero.targetai) {
                        target = playerModule.command_target(player, player.hero.filter, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario, cause: player});
                    }
                    player.ability(target, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
                    for (var c = 0; c < player.minions.length; c++) {
                        for (var d = 0; d < player.minions[c].effects.length; d++) {
                            if (player.minions[c].effects[d].type === "inspire") {
                                player.minions[c].effects[d].action(player.minions[c], {
                                    player: player,
                                    foe: scenario && scenario.attackTarget ? scenario : foe,
                                    cause: player.minions[c]
                                });
                            }
                        }
                    }
                }
                
                if(!response.action) {
                    stillPlaying = false;
                }
            }
        }
        
        // +++++++++++++++++++++++++++++++++++++++++
        
        else {
            checkCards({
                player: player,
                foe: scenario && scenario.attackTarget ? scenario : foe,
                scenario: scenario,
                cause: false
            });
        }
        
        if(!player.isPlayer && player.ability) {
            if (player.mana >= player.cost && player.ai && player.ai({
                    player: player,
                    foe: scenario && scenario.attackTarget ? scenario: foe,
                    cause: false
                })) {
                player.mana -= player.cost;
                if (typeof(player.ability) != 'function') {
                    printer.print("Eek! TYpe of ability: " + typeof(player.ability));
                    printer.print("More eek: ability: " + player.ability);
                    printer.print("In fact... is it null? : " + (player.ability === null));
                }
                target = scenario && scenario.attackTarget ? scenario : foe;
                if(player.hero.targetai) {
                    if(!player.hero.filter) {
                        throw new Error("Hero with targetAI but no filter");
                    }
                    target = player.hero.targetai(player.hero.filter({player: player, foe: scenario && scenario.attackTarget ? scenario : foe}), {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: false} );
                }
                player.ability(target, {
                    player: player,
                    foe: scenario && scenario.attackTarget ? scenario : foe,
                    cause: player
                });
                for (var c = 0; c < player.minions.length; c++) {
                    for (var d = 0; d < player.minions[c].effects.length; d++) {
                        if (player.minions[c].effects[d].type === "inspire") {
                            player.minions[c].effects[d].action(player.minions[c], {
                                player: player,
                                foe: scenario && scenario.attackTarget ? scenario : foe,
                                cause: player.minions[c]
                            });
                        }
                    }
                }
            }
        }
        
        if(!player.isPlayer) {
            checkCards({
                player: player,
                foe: scenario && scenario.attackTarget ? scenario : foe,
                cause: false
            });
        }
        
        if (player.getDamage() > 0) {
            var faceTarget = utilities.AttackAI(player, {
                player: player,
                foe: scenario && scenario.attackTarget ? scenario : foe,
                scenario: scenario,
                cause: player
            });
            if (faceTarget) {
                utilities.Attack(player, faceTarget, {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario});
            }
        }
        
        utilities.checkForLife({
            player: player,
            foe: scenario && scenario.attackTarget ? scenario : foe,
            cause: "Life Check"
        });
        if(!player.isPlayer) {
            MinionsAttack({
                player: player,
                foe: scenario && scenario.attackTarget ? scenario : foe,
                scenario: scenario,
                cause: false
            });
        }
        for(var m = 0; m < player.effects.length; m++) {
            if(player.effects[m].type === "end of turn" || player.effects[m].type === "end of turn friend") {
                player.effects[m].action(player, { player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: player });
            }
        }
        for(var m = 0; m < foe.effects.length; m++) {
                if(foe.effects[m].type === "end of turn" || foe.effects[m].type === "end of turn foe") {
                    foe.effects[m].action(foe, { player: foe, foe: scenario && scenario.attackTarget ? scenario : foe, source: foe });
                }
            }
        for (i = 0; i < player.minions.length; i++) {
            minion = player.minions[i];
            // make a COPY of the effects array for safe iteration
            if (minion.effects) {
                effects = minion.effects.slice();
                // and start building an array of elements to DELETE
                // minion.triggerEffectType("end of turn", {player: player, foe: scenario && scenario.attackTarget ? scenario : foe, cause: minion});
                for(var m = 0; m < effects.length; m++) {
                    if(effects[m].type === "end of turn" || effects[m].type === "end of turn friend") {
                        effects[m].action(minion, { player: player, foe: scenario && scenario.attackTarget ? scenario : foe, scenario: scenario, cause: minion });
                    }
                }
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
                foe: scenario && scenario.attackTarget ? scenario : foe,
                cause: "Life Check"
            });
        }
        return true;
    } else {
        /**
         * if scenario
         *      * if mustDefeatBoth is true
         *          * if foe is alive
         */
         
        var endMatch = true;
        if(scenario) {
            if(scenario.mustDefeatBoth == true) {
                if(foe.getHp() > 0 || player.getHp() > 0 && scenario.getHp() > 0) {
                    endMatch = false;
                }
            }
        }
        if(endMatch == true) {
            return false;
        }
        return true;
    }
};

var turnLoop = function() {

    var stillGoing = true;
    
    while(stillGoing == true) {
        stillGoing = runTurn(first, second);
        stillGoing = runTurn(second, first);
    }
    // if we get here, the combat has ended
    
    // defeated scenario
    
    if(scenario && scenario.getHp() <= 0) {
        printer.print("");
        printer.print("The " + red.color + " " + red.name + " and the " + blue.color + " " + blue.name + " have prevailed against " + scenario.name + "!");
        console.log("Scenario completed on turn " + Math.floor(turnNum) + "!");
    }
    
    // scenario won
    
    else if(scenario && scenario.getHp() > 0) {
        printer.print("");
        printer.print(scenario.endOfMatch.victory);
        console.log("Scenario failed on turn " + Math.floor(turnNum) + ".");
    }
    
    // red victory
    
    else if(red.getHp() > 0 && blue.getHp() <= 0) {
        printer.print("The " + blue.color + " " + blue.name + " has been defeated! The " + red.color + " " + red.name + " is victorious!");
        console.log("The " + red.color + " " + red.name + " won on turn " + Math.floor(turnNum) + ".");
        return "red";
    }
    
    // blue victory
    
    else if(blue.getHp() > 0 && red.getHp() <= 0) {
        printer.print("The " + red.color + " " + red.name + " has been defeated! The " + blue.color + " " + blue.name + " is victorious!");
        console.log("The " + blue.color + " " + blue.name + " won on turn " + Math.floor(turnNum) + ".");
        return "blue";
    }
    
    // tie or other weird thing
    
    else if((!scenario || scenario.coop == false) && blue.getHp() <= 0 && red.getHp() <= 0) {
        printer.print("The " + red.color + " " + red.name + " and the " + blue.color + " " + blue.name + " were both defeated, resulting in a tie!");
        console.log("The " + red.color + " " + red.name + " and the " + blue.color + " " + blue.name + " tied on turn " + Math.floor(turnNum) + ".");
        return false;
    }
    else {
        printer.print("Huh? No sane combat conclusion identified! Red/Blue = [" + red.getHp() + "/" + blue.getHp() + "]");
        return false;
    }
};

printer.print("");
printer.print("-----------------------------------------------------------------------------------------------------------------------------------------------");
printer.print("");

var red = setup.hero('Red');
var blue = setup.hero('Blue');

setup.randomizeHero(red);
setup.setHero(red, heroes.druid());
setup.randomizeHero(blue);
setup.setHero(blue, heroes.druid());

// scenario = adventures.setScenario(adventures.Mimiron());

// red.isPlayer = playerModule.requestControl(red);

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
    red.hero = redClass;
    red.name = redClass.name;
    red.ability = redClass.ability;
    red.cost = redClass.cost;
    red.ai = redClass.ai;
    red.deck = redDeck.slice();
    // red.deck = decks.WhooshingSounds();
    blue.name = blueClass.name;
    blue.ability = blueClass.ability;
    blue.cost = blueClass.cost;
    blue.ai = blueClass.ai;
    blue.deck = blueDeck.slice();
    // blue.deck = decks.WhooshingSounds();
    utilities.shuffle(red.deck);
    utilities.shuffle(blue.deck);
    for(var i in red.deck) {
        utilities.initialize(red.deck[i], red);
    }
    for(i in blue.deck) {
        utilities.initialize(blue.deck[i], blue);
    }
    // red.maxMana = 5;
    // red.baseHp = 12;
    // red.armor = 1800;
    // blue.armor = 1800;
    printer.print(red.color + ": " + red.name);
    printer.print(blue.color + ": " + blue.name);
    console.log(red.color + ": " + red.name);
    console.log(blue.color + ": " + blue.name);
    printer.print("");
    
    if (Math.random() > 0.5) {
        first = red;
        second = blue;
    } else {
        first = blue;
        second = red;
    }
    
    if(red.taunts.start) {
        printer.print(red.color + " " + red.name + ": " + red.taunts.start, "2");
    }
    if(blue.taunts.start) {
        printer.print(blue.color + " " + blue.name + ": " + blue.taunts.start, "2");
    }
    
    if(scenario) {
        console.log("Scenario: " + scenario.scenarioName);
        printer.print(scenario.startOfMatch.line);
        scenario.startOfMatch.action(red, blue, scenario);
        printer.print("");
    }
    console.log("");
    
    setup.drawStartCards(first, second);
    
    turnLoop();
};

runGame(red.hero, red.deck, blue.hero, blue.deck);
process.exit();