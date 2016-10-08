var cards = require('./cards.js');

module.exports.allCards = function() {
    var list = [];
    for(var i = 0; i < neutral.length; i++) {
        list.push(neutral[i]());
    }
    for(var i = 0; i < mage.length; i++) {
        list.push(mage[i]());
    }
    for(var i = 0; i < warrior.length; i++) {
        list.push(warrior[i]());
    }
    for(var i = 0; i < rogue.length; i++) {
        list.push(rogue[i]());
    }
    for(var i = 0; i < shaman.length; i++) {
        list.push(shaman[i]());
    }
    for(var i = 0; i < hunter.length; i++) {
        list.push(hunter[i]());
    }
    for(var i = 0; i < druid.length; i++) {
        list.push(druid[i]());
    }
    for(var i = 0; i < warlock.length; i++) {
        list.push(warlock[i]());
    }
    for(var i = 0; i < paladin.length; i++) {
        list.push(paladin[i]());
    }
    for(var i = 0; i < priest.length; i++) {
        list.push(priest[i]());
    }
    return list;
}

var neutral = module.exports.neutral = [
    cards.BloodfenRaptor,
    cards.BoulderfistOgre,
    cards.MagmaRager,
    cards.Nightblade,
    cards.NoviceEngineer,
    cards.MurlocRaider,
    cards.SpiderTank,
    cards.LeperGnome,
    cards.FrostwolfGrunt,
    cards.ChillwindYeti,
    cards.ElvenArcher,
    cards.OgreMagi,
    cards.SilverHandKnight,
    cards.Spellbreaker,
    cards.ArgentCommander,
    cards.AzureDrake,
    cards.KnifeJuggler,
    cards.CrazedAlchemist,
    cards.AcolyteofPain,
    cards.BigGameHunter,
    cards.HauntedCreeper,
    cards.NerubarWeblord,
    cards.NerubianEgg,
    cards.Deathlord,
    cards.ShadeofNaxxramas,
    cards.StoneskinGargoyle,
    cards.Abomination,
    cards.AnnoyoTron,
    cards.ClockworkGnome,
    cards.Mechwarper,
    cards.HarvestGolem,
    cards.TinkertownTechnician,
    cards.MechanicalYeti,
    cards.PilotedShredder,
    cards.BlackwingTechnician,
    cards.BlackwingCorruptor,
    cards.ArgentHorserider,
    cards.NorthSeaKraken,
    cards.TwilightGuardian,
    cards.Kodorider,
    cards.MasterJouster,
    cards.Sylvanas,
    cards.Toshley,
    cards.EmperorThaurissan,
    // cards.Nefarian,
    cards.DrBoom,
    cards.Ragnaros,
    cards.Alexstrasza,
    cards.Deathwing,
    cards.NexusChampionSaraad,
    cards.RenoJackson,
    cards.EliseStarseeker,
    cards.BloodmageThalnos,
    cards.PollutedHoarder,
    cards.CorruptedHealbot,
    cards.EaterofSecrets,
    cards.ValidatedDoomsayer,
    cards.HoggerScourgeofElwynn,
    cards.YShaarjRageUnbound,
    cards.ArcaneGiant,
    
    cards.CThun,
    cards.BeckonerofEvil,
    cards.CThunsChosen,
    cards.TwilightElder,
    
    // cards.C_CultAdherent
];

var mage = module.exports.mage = [
    cards.Fireball,
    cards.ArcaneMissiles,
    cards.Polymorph,
    cards.Frostbolt,
    cards.ManaWyrm,
    cards.UnstablePortal,
    cards.GoblinBlastmage,
    cards.Snowchugger,
    cards.MirrorEntity,
    cards.Duplicate,
    cards.ArcaneExplosion,
    cards.Flamestrike,
    cards.ConeofCold,
    cards.Flamecannon,
    cards.FrostNova,
    cards.MirrorImage,
    cards.ArchmageAntonidas
];

var warrior = module.exports.warrior = [
    cards.Execute,
    cards.Whirlwind,
    cards.ArcaniteReaper,
    cards.GrimPatron,
    cards.FrothingBerserker,
    cards.BattleRage,
    cards.Cleave,
    cards.BloodWarriors,
];

var rogue = module.exports.rogue = [
    cards.IronSensei,
    cards.Backstab,
    cards.Sap,
    cards.Shiv,
    cards.FanofKnives,
    cards.Sprint,
    cards.AnubarAmbusher,
];

var shaman = module.exports.shaman = [
    cards.Crackle,
    cards.LavaBurst,
    cards.WhirlingZapoMatic,
    cards.FeralSpirit,
    cards.ForkedLightning,
    cards.UnboundElemental,
    cards.AlAkirtheWindlord
];

var hunter = module.exports.hunter = [
    cards.AnimalCompanion,
    cards.MultiShot,
    cards.UnleashTheHounds,
    cards.ExplosiveShot,
    cards.ArcaneShot,
    cards.CobraShot,
    cards.KingsElekk,
    cards.DeadlyShot,
    cards.HuntersMark,
    cards.CoreRager,
    cards.GiantSandworm,
    cards.KingKrush,
    cards.Gahzrilla
];

var druid = module.exports.druid = [
    cards.Innervate,
    cards.DruidoftheFlame,
    cards.Swipe,
    cards.Moonfire,
    cards.KlaxxiAmberWeaver,
    cards.TreeofLife,
    cards.Cenarius,
    cards.Malorne
];

var warlock = module.exports.warlock = [
    cards.Darkbomb,
    cards.ShadowBolt,
    cards.MortalCoil,
    cards.Voidwalker,
    cards.Succubus,
    cards.Shadowflame,
    cards.LordJaraxxus,
    cards.MalGanis
];

var paladin = module.exports.paladin = [
    cards.StandAgainstDarkness,
    cards.AldorPeacekeeper,
    cards.Equality,
    cards.AvengingWrath,
    cards.BlessingofKings,
    cards.GuardianofKings,
    cards.WarhorseTrainer,
    cards.HammerofWrath,
    cards.MurlocKnight,
    cards.TirionFordring,
    // cards.BolvarFordragon
];

var priest = module.exports.priest = [
    cards.PowerWordShield,
    cards.ShadowWordDeath,
    cards.ShadowWordPain,
    cards.HolyNova,
    cards.Entomb,
    cards.VelensChosen,
    cards.HolyFire,
    cards.Resurrect,
    cards.Shadowform,
    cards.NorthshireCleric,
    cards.TwilightWhelp,
    cards.WyrmrestAgent
];