# JavaScript-Hearthstone

Thanks for taking a moment to read this! I'll try to keep this short, if you have any questions feel free to send them to me at nsaetaris@gmail.com.

This is a fully functional simulator of Hearthstone: Heroes of Warcraft running in JavaScript.

There are no graphics. Implementing them would probably make this program at least three times as long. It's purely text-based, which I'm sure is disappointing, but it's still pretty cool, I think.

Not all cards are in the simulator at this time! This is because it does take a while to put cards in, and I don't have all the time in the world. If there are any cards you really want in, email me and I'll try to add them!

I was actually learning JavaScript as I made this, so some parts of the code are a little less elegant than more recent parts. I'm looking at you, utilities.dealDamage.

Let's see, what else... oh, yes. Player interaction, scenarios, and adventures. Three things you should know about.

1) PLAYER INTERACTION. This game CAN now be played!! In game.js you will find a line of code that reads:

red.isPlayer = playerModule.requestControl(red);

If this is commented out, feel free to uncomment it; type "y" at the start of the game and you can play as the Red player. You can also play as blue, in theory, but I haven't tested playing both at once.

Type "help" to get a list of commands. Any ideas on how to further implement player control can be emailed to me :)

2) SCENARIOS. These are my own lovely creation, something NOT currently in Hearthstone. They're effectively a third player; neither player can target/attack the other and they instead target/attack the scenario.

The line just above the isPlayer line, scenario = adventures.setScenario(adventures.Murozond()), sets up a scenario. You can then play it, or just watch!

There are three scenarios currently implemented.

- Zakazj: (originally Il'gynoth, but then I actually played Emerald Nightmare and realized that this is NOTHING like Il'gynoth) Tentacles, void beams, madness.
- Murozond: Drakes, illusions, dragon breath, and fatigue as a time limit mechanic.
- Mimiron: Three separate bosses with separate health pools; defeat all three to win.

I'm sure I'll implement more in time. If you have any suggestions for scenarios I could add, email me!

3) ADVENTURES. I started implementing Naxxramas, and will resume doing so eventually, but was distracted by bugs... and then playability... and then scenarios.

Anub'Rekhan and Grand Widow Faerlina are both implemented completely, as is a boss I designed for a custom adventure -- Lady Deathwhisper.

Feel free to try them out.

... And that should be it! Anything I missed, email me. Hope you enjoy the simulator!

# TL;DR email me literally anything to do with this, I'd love to hear what people are interested in having added.

# TO BE ADDED

- Better attack AI
- Better Choose One system
- Effects like Brann and Rivendare