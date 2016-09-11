var cardLists = require('./cardlists.js');

var openPack = function(set, num) {
    var collection = [];
    console.log("Opening " + num + " " + set + " card packs.");
    var validCards = [];
    var allCards = cardLists.allCards();
    
    for(var i = 0; i < allCards.length; i++) {
        if(allCards[i].cardSet === set || set === "All") {
            validCards.push(allCards[i]);
        }
    }
    
    var packsWithoutLegend = 0;
    
    var baseCommonChance = .7165;
    var commonChance = baseCommonChance;
    var baseRareChance = commonChance + .2284;
    var rareChance = baseRareChance;
    var baseEpicChance = rareChance + .0442;
    var epicChance = baseEpicChance;
    
    for(i = 0; i < packsWithoutLegend; i++) {
        commonChance *= 0.9;
        rareChance *= 0.9;
        epicChance *= 0.9;
    }
    
    for(i = 0; i < num; i++) {
        var commonsInPack = 0;
        packsWithoutLegend++;
        for(var x = 0; x < 5; x++) {
            var rarity;
            var randomNum = Math.random(0, 1);
            if(randomNum < commonChance) {
                rarity = "Common";
                commonsInPack += 1;
            }
            else if(randomNum < rareChance) {
                rarity = "Rare";
            }
            else if(randomNum < epicChance) {
                rarity = "Epic";
            }
            else {
                rarity = "Legendary";
                packsWithoutLegend = 0;
            }
            if(packsWithoutLegend >= 40) {
                rarity = "Legendary";
                packsWithoutLegend = 0;
            }
            if(commonsInPack >= 5) {
                rarity = "Rare";
            }
            var rarityCards = [];
            for(var o = 0; o < validCards.length; o++) {
                if(validCards[o].rarity === rarity) {
                    rarityCards.push(validCards[o]);
                }
            }
            randomNum = Math.floor(Math.random(0, 1) * rarityCards.length);
            var card = rarityCards[randomNum];
            var extra = "";
            if(rarity === "Legendary") {
                extra = "!!! ";
            }
            console.log(extra + rarity + " opened - " + card.name);
            collection.push(card);
        }
        console.log("");
    }
    console.log("All packs opened!");
    // var collectionRecord = [];
    // var dust = 0;
    // for(i = 0; i < collection.length; i++) {
    //     var hasCard = false;
    //     for(o = 0; o < collectionRecord.length; o++) {
    //         if(collectionRecord[o].name === collection[i].name) {
    //             hasCard = true;
    //             collectionRecord[o].num++;
    //         }
    //     }
    //     if(!hasCard) {
    //         collectionRecord.push({name: collection[i].name, num: 1, rarity: collection[i].rarity})
    //     }
    // }
    
    // for(i = 0; i < collection.length; i++) {
    //     for(o = 0; o < collectionRecord.length; o++) {
    //         if(collection[i].name === collectionRecord[o].name && (collectionRecord[o].num > 2 ||
    //         (collectionRecord[o].num > 1 && collectionRecord[o].rarity === "Legendary"))) {
    //             if(collection[o].rarity === "Common") {
    //                 console.log("Disenchanted " + collectionRecord[o].name);
    //                 dust += 5;
    //                 collection.splice(i, 1);
    //                 collectionRecord[o].num--;
    //             }
    //             if(collection[o].rarity === "Rare") {
    //                 console.log("Disenchanted " + collection[o].name);
    //                 dust += 20;
    //                 collection.splice(i, 1);
    //                 collectionRecord[o].num--;
    //             }
    //             if(collection[o].rarity === "Epic") {
    //                 console.log("Disenchanted " + collection[o].name);
    //                 dust += 100;
    //                 collection.splice(i, 1);
    //                 collectionRecord[o].num--;
    //             }
    //             if(collection[o].rarity === "Legendary") {
    //                 console.log("Disenchanted " + collection[o].name);
    //                 dust += 400;
    //                 collection.splice(i, 1);
    //                 collectionRecord[o].num--;
    //             }
    //         }
    //     }
    // }
}

openPack("Classic", 3);