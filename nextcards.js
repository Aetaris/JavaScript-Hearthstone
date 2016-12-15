// List of cards to implement next, with a function that prints out a random one. No more "choosing"!

var list = [
    // "Amani Berserker",
    // "Kel'Thuzad",
    // // "N'Zoth, the Corruptor",
    // // "Servant of Yogg-Saron",
    // "Soggoth the Slitherer",
    // "Explosive Trap",
    // "Freezing Trap",
    // "Snipe",
    "Echo of Medivh",
    "Nat, the Darkfisher",
    "Ragnaros, Lightlord",
    "Majordomo Executus",
    "Cabalist's Tome",
    "Ice Lance",
    "Astral Communion",
    "Wrath",
    "Flame Lance",
    "Bash",
    "Slam",
    "Blood to Ichor",
    "Shadowform",
    "Herald Volazj",
    "Holy Champion",
    "Guardian of Kings",
    "Abusive Sergeant",
    "Fjola Lightbane",
    "Eydis Darkbane",
    "Shadow Madness",
    "Seal of Champions",
    "Stranglethorn Tiger",
    "Captain's Parrot",
    "Mistress of Pain",
    "Tuskarr Jouster",
    "Tuskarr Totemic",
    "Fel Cannon",
    "Excavated Evil",
    "Upgraded Repair Bot",
    "Flametongue Totem",
    "Hex",
    "Lightning Storm",
    "Thing From Below",
    "Rockbiter Weapon",
    "Totem Golem",
    "Mana Wyrm",
    "Forgotten Torch",
    "Thunder Bluff Valiant",
    "Sorcerer's Apprentice",
    "Faceless Summoner",
    "Addled Grizzly",
    "Mana Tide Totem",
    "Loot Hoarder",
    "Doomhammer",
    "Effigy",
    "Twilight Flamecaller",
    "Shatter",
    "Sir Finley Mrrglton",
    "Murloc Warleader",
    "Enchanted Raven",
    "Fool's Bane",
    "Spirit Claws",
];

var finished = [
    "Blood Warriors",
    "Y'Shaarj, Rage Unbound",
    "Ice Block",
    "Yogg-Saron, Hope's End",
    
];

console.log("");

var randomOne = function() {
    var num = Math.floor(Math.random(0, 1)* list.length);
    if(list[num]) {
        console.log(list[num]);
    }
};

randomOne();