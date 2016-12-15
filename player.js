var utilities = require('./utilities.js');
const readline = require('readline-sync');

var help = function(player) { // Displays a list of commands
  console.log("Hi! It looks like you're having trouble with the commands.");
  console.log("Here's a nice list of the commands you can use.\n");
  console.log("> 'help': Shows you this list! The list will show all available commands for any phase.\n");

  console.log("> 'hand': Displays a list of the cards in your hand.\n");
  console.log("> 'minions': Displays a list of your minions. Type 'minions foe' to see the enemy's minions.");
  console.log("Use 'minions x' or 'minions foe x' where x is an integer between 1 and 7 to see specifics about a minion, including an overview of their Effects.\n");
  console.log("> 'status': Displays your health, your opponent's health, both of your deck sizes, armor and mana (including Overload, if any).\n");
  console.log("> 'end': Chooses to take no action, and ends the phase. Don't use this unless you're sure!");

  console.log("> 'play x': Plays the card of index x - 1 from your hand (so 'play 1' plays the first card in your hand). If applicable, this will immediately");
  console.log("bring you into the target phase.\n");

  console.log("> 'target list': Displays a list of valid targets for the current effect, displaying their name, health, and (if applicable) attack.\n");
  console.log("> 'target x': Targets the target of index x - 1 from your target list (so 'target 1' targets the first target in the list).\n");
  console.log("> 'attack list': Displays a list of minions that can attack this turn (excluding those Frozen, experiencing Summoning Sickness, etc).\n");

  console.log("");

};

var status = function(player, context) {
  console.log("");
  var manaDisplay = player.mana;
  if (player.lockedMana > 0) {
    manaDisplay = manaDisplay + " [overload " + player.lockedMana + "]"
  }
  console.log("You have " + manaDisplay + " Mana Crystals and " + player.deck.length + " cards left in your deck.");
  if (player.deck.length === 0) {
    console.log("Next draw fatigues for " + player.fatigue + ".");
  }
  var playerHealth = player.getHp();
  if (player.armor > 0) {
    playerHealth = playerHealth + " [" + player.armor + "]";
  }
  var foeHealth = context.foe.getHp();
  if (context.foe.armor > 0) {
    foeHealth = foeHealth + " [" + context.foe.armor + "]";
  }

  console.log(player.color + " " + player.name + "'s Health: " + playerHealth + " || " + context.foe.color + " " + context.foe.name + "'s Health: " + foeHealth + ".");
  if (context.scenario) {
    console.log(context.scenario.name + "'s Health: " + context.scenario.getHp() + (context.scenario.armor > 0 ? "[" + context.scenario.armor + "]" : ""));
  }
  console.log("");
};

var printHand = function(player, context) {
  console.log("");
  if (player.hand.length > 0) {
    console.log("Current cards in your hand:");
    for (var i = 0; i < player.hand.length; i++) {
      console.log("[" + (i + 1) + "]: " + player.hand[i].name + " - " + utilities.getCardCost(player.hand[i], context));
    }
  }
  else {
    console.log("There are no cards in your hand.");
  }
  console.log("");
};

var printMinions = function(player, context) {
  console.log("");
  if (player.minions.length > 0) {
    console.log("Current minions:");
    for (var i = 0; i < player.minions.length; i++) {
      console.log("[" + (i + 1) + "] " + player.minions[i].name + ": " + player.minions[i].getDamage() + "/" + player.minions[i].getHp());
    }
  }
  else {
    console.log("You do not currently have any minions.");
  }
  console.log("");
};

var printFoeMinions = function(foe, context) {
  console.log("");
  if (foe.minions.length > 0) {
    console.log("Current minions:");
    for (var i = 0; i < foe.minions.length; i++) {
      console.log("[" + (i + 1) + "] " + foe.minions[i].name + ": " + foe.minions[i].getDamage() + "/" + foe.minions[i].getHp());
    }
  }
  else {
    console.log("Your opponent does not currently have any minions.");
  }
  console.log("");
};

var printTargets = function(filter, context) {
  var results = filter(context);
  console.log("");
  if (results.length > 0) {
    console.log("Valid targets:");
    for (var i = 0; i < results.length; i++) {
      console.log("[" + (i + 1) + "] " + results[i].color + " " + results[i].name + ": " + results[i].getDamage() + "/" + results[i].getHp());
    }
  }
  else {
    console.log("You do not currently have any minions.");
  }
  console.log("");
};

module.exports.requestControl = function(player) {
  var response = readline.keyInYN("Would you like to take control of " + player.color + " " + player.name + "?");
  return response;
};

var command_target = module.exports.command_target = function(player, filter, context) {
  var goodResponse = false;
  while (!goodResponse) {
    var response = readline.question(player.color + " " + player.name + ", choose a target for " + context.cause.name + ". [target x]: ");
    if (response == "help" || response == "Help") {
      help(player);
    }
    else if (response == "target list") {
      printTargets(filter, context);
    }
    else if (response.substr(0, 6) == "target" || response.substr(0, 6) == "attack") {
      var filterResult = filter(context);
      var index = Number(response.substr(7)) - 1;
      if (filterResult[index] != undefined) {
        var responseTwo = readline.keyInYN("Are you sure you want to target " + filterResult[index].name + "?");
        if (responseTwo == true) {
          return filterResult[index];
        }
      }
    }
    else if (response == "status") {
      status(player, context);
    }
    else if (response == "hand") {
      printHand(player, context);
    }
    else if (response == "minions") {
      printMinions(player, context);
    }
    else if (response == "minions foe") {
      printFoeMinions(context.foe, context);
    }
    else if (response == "end") {
      console.log("Canceling targeting.");
      return false;
    }
    else {
      console.log("I'm sorry, I don't understand that. You can type 'help' for a list of valid commands.");
    }
  }
};

var command_action = module.exports.command_action = function(player, context) {
  var goodResponse = false;
  while (!goodResponse) {
    var response = readline.question(player.color + " " + player.name + ", choose an action: ");
    if (response == "help" || response == "Help") {
      help(player);
    }
    else if (response.substr(0, 4) == "play") {
      var index = Number(response.substr(5)) - 1;
      if (player.hand[index] != undefined) {
        if (utilities.getCardCost(player.hand[index], context) > player.mana) {
          console.log("You don't have enough mana to play " + player.hand[index].name + " (" + player.mana + " out of " + utilities.getCardCost(player.hand[index], context) + ").");
        }
        else {
          var responseTwo = readline.keyInYN("Are you sure you want to play " + player.hand[Number(response.substr(5)) - 1].name + "?");
          if (responseTwo == true) {
            return {
              action: "play",
              card: player.hand[Number(response.substr(5)) - 1]
            };
          }
        }
      }
      else {
        console.log("That's not a valid index.");
      }
    }

    else if (response.substr(0, 6) == "attack" && response.length >= 8) {
      index = Number(response.substr(7)) - 1;
      if (player.minions[index] && player.minions[index].hasEffectName("Summoning Sickness") == false) {
        return {
          action: "attack",
          minion: player.minions[index]
        };
      }
      else if (player.minions[index].hasEffectName("Summoning Sickness") == true) {
        console.log("That minion can't attack right now.");
      }
    }
    else if(response == "power") {
      if(typeof player.ability == "function") {
        if(player.mana >= player.cost) {
          var responseTwo = readline.keyInYN("Are you sure you want to use your Hero Power?");
          if (responseTwo == true) {
            return {
              action: "hero power"
            };
          }
        } else {
          console.log("You don't have enough mana to use your Hero Power (" + player.mana + " out of " + player.cost + ").");
        }
      } else {
        console.log("Your Hero Power is not an ability.");
      }
    }

    else if (response == "status") {
      status(player, context);
    }
    else if (response == "hand") {
      printHand(player, context);
    }
    else if (response == "minions") {
      printMinions(player, context);
    }
    else if (response == "minions foe") {
      printFoeMinions(context.foe, context);
    }
    else if (response == "end") {
      
      var minionCanAttack = false;
      var phaseEnding = true;
      for(var i = 0; i < player.minions.length; i++) {
        if(player.minions[i].hasEffectName("Summoning Sickness") == false) {
          minionCanAttack = true;
        }
      }
      if(minionCanAttack == true) {
        phaseEnding = readline.keyInYN("Not all of your minions have attacked yet! Are you sure you want to end your turn?");
      }
      if(phaseEnding) {
        console.log("Ending phase.");
        return false;
      }
    }
    else {
      console.log("I'm sorry, I don't understand that. You can type 'help' for a list of valid commands.");
    }
  }
};