var heroes = require('./heroes.js');
var printer = require('./printer.js');
var setup = require('./setup.js');

module.exports.setAdventureHero = function(player, hero) {
    setup.setHero(player, hero);
    if(hero === heroes.anubrekhan) {
        printer.print("KEL'THUZAD: Anub'Rekhan is one of my finest Spider Lords. Good luck, interloper.");
        player.startTaunt = "Welcome to my parlor.";
        player.defeatTaunt = "Why... oh... why?";
        player.lossMessage = "KEL'THUZAD: NOOO!!! I mean... irrelevant. You'll never defeat the Grand Widow.";
        player.nextHero = heroes.grandwidowfaerlina;
    }
    if(hero === heroes.grandwidowfaerlina) {
        printer.print("KEL'THUZAD: Faerlina is training acolytes to worship me. Her job is VERY IMPORTANT; do not disturb her!");
        player.startTaunt = "My acolytes serve me without question!";
        player.defeatTaunt = "The master will avenge me!";
        player.lossMessage = "KEL'THUZAD: Faerlina means nothing. The Spider Queen will dispatch you EASILY.";
    }
    if(hero === heroes.maexxna) {
        printer.print("KEL'THUZAD: Maexxna is a GIANT SPIDER! MUAHAHAHA!");
        player.startTaunt = "<hissing>";
        player.defeatTaunt = "<hissing>";
        player.lossMessage = "KEL'THUZAD: Impossible! This is not over, PUNY MORTAL!";
    }

    if(hero === heroes.LadyDeathwhisper_Normal || hero === heroes.LadyDeathwhisper_Heroic) {
        printer.print("ARTHAS MENETHIL: Lady Deathwhisper... Supreme Overseer of the Cult of the Damned... this is a foe you will not defeat.");
        player.taunts.start = "What is this disturbance?!";
        player.taunts.heropower = false;
        player.taunts.custom1 = "Take this blessing and show these intruders a taste of our master's power.";
        player.taunts.custom2 = "I release you from the curse of flesh!";
        player.taunts.victory = "Embrace the darkness... darkness eternal!";
        player.taunts.defeat = "All part of the master's plan! Your end is... inevitable!";
    }
};