var utilities = require('./utilities.js');

module.exports.WickedKnife = function() {
    return {
    name: "Wicked Knife",
    cost: 2,
    color: false,
    damage: 1,
    durability: 2
    };
};

module.exports.ArcaniteReaper = function() {
    return {
    name: "Arcanite Reaper",
    cost: 5,
    color: false,
    damage: 5,
    durability: 2
    };
};

module.exports.BloodFury = function() {
    return {
        name: "Blood Fury",
        cost: 3,
        color: false,
        damage: 3,
        durability: 8
    };
};

module.exports.Ashbringer = function() {
    return {
        name: "Ashbringer",
        cost: 5,
        color: false,
        damage: 5,
        durability: 3
    };
};