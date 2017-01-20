var cards = require('./cards.js');

var allCards = module.exports.allCards = function(asObjects) {
    var list = [
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
    cards.Abomination,
    cards.ArgentCommander,
    cards.AzureDrake,
    cards.GadgetzanAuctioneer,
    cards.KnifeJuggler,
    cards.CrazedAlchemist,
    cards.AcolyteofPain,
    cards.BigGameHunter,
    cards.BloodmageThalnos,
    cards.Sylvanas,
    cards.Ragnaros,
    cards.Alexstrasza,
    cards.Deathwing,
    
    cards.DancingSwords,
    cards.HauntedCreeper,
    cards.NerubarWeblord,
    cards.StoneskinGargoyle,
    cards.UnstableGhoul,
    cards.NerubianEgg,
    cards.Deathlord,
    cards.ShadeofNaxxramas,
    
    cards.AnnoyoTron,
    cards.ClockworkGnome,
    cards.Mechwarper,
    cards.HarvestGolem,
    cards.TinkertownTechnician,
    cards.MechanicalYeti,
    cards.PilotedShredder,
    cards.DrBoom,
    cards.Toshley,
    
    cards.BlackwingTechnician,
    cards.BlackwingCorruptor,
    cards.GrimPatron,
    cards.EmperorThaurissan,
    cards.Nefarian,
    
    cards.ArgentHorserider,
    cards.NorthSeaKraken,
    cards.TwilightGuardian,
    cards.Kodorider,
    cards.MasterJouster,
    cards.NexusChampionSaraad,
    
    cards.ArchThiefRafaam,
    cards.RenoJackson,
    cards.EliseStarseeker,
    
    cards.PollutedHoarder,
    cards.CorruptedHealbot,
    cards.EaterofSecrets,
    cards.ValidatedDoomsayer,
    cards.HoggerScourgeofElwynn,
    cards.YShaarjRageUnbound,
    cards.CThun,
    cards.BeckonerofEvil,
    cards.CThunsChosen,
    cards.TwilightElder,
    
    cards.ArcaneGiant,
    
    cards.SergeantSally,
    
    cards.GrimestreetSmuggler,
    cards.DonHanCho,
    
    cards.JadeSpirit,
    cards.LotusAgents,
    cards.AyaBlackpaw,
    
    cards.KabalChemist,
    
    cards.IcecrownCombatant,
    cards.SkeletalSoldier,
    cards.DeathspeakerDisciple,
    cards.FrostWyrm,
    cards.SkeletalSuppressor,
    cards.KorkronBerserker,
    cards.PlagueScientist,
    cards.YmirjarHuntress,
    cards.RavenousGeist,
    cards.MalevolentSwords,
    cards.YmirjarWarrior,
    cards.PlagueRat,
    cards.ValkyrShadowguard,
    cards.BoneRager,
    cards.Historian,
    cards.DeathboundWard,
    cards.CultAdherent,
    cards.CryptFiend,
    cards.DarkfallenKnight,
    cards.BloodCrazedVampire,
    cards.SkybreakerVindicator,
    cards.FallenChampion,
    cards.DeathspeakerAttendant,
    cards.FrostQueensAttendant,
    cards.SanlaynBloodspeaker,
    cards.YmirjarWarlord,
    cards.DarkfallenTactician,
    cards.Suppressor,
    cards.VolatileAlchemist,
    cards.Executioner,
    cards.DeathspeakerHighPriest,
    cards.SpiritAlarm,
    cards.TormentedVision,
    cards.UndyingSpectre,
    cards.ArgentRedeemer,
    cards.BloodBeast,
    cards.DarkfallenOrb,
    cards.FleshEatingInsect,
    cards.FleshGiant,
    cards.LordMarrowgar,
    cards.LadyDeathwhisper,
    cards.OrgrimsHammer,
    cards.TheSkybreaker,
    cards.DeathbringerSaurfang,
    cards.Festergut,
    cards.Rotface,
    cards.ProfessorPutricide,
    cards.PrinceValanar,
    cards.PrinceKeleseth,
    cards.PrinceTaldaram,
    cards.BloodQueenLanathel,
    cards.SisterSvalna,
    cards.ValithriaDreamwalker,
    cards.Sindragosa,
    cards.EchoOfArthas,
    cards.EchoOfNerzhul,

    cards.Fireball,
    cards.ArcaneMissiles,
    cards.Polymorph,
    cards.Frostbolt,
    cards.ManaWyrm,
    cards.UnstablePortal,
    cards.GoblinBlastmage,
    // cards.Snowchugger,
    cards.MirrorEntity,
    cards.Duplicate,
    cards.ArcaneExplosion,
    cards.Flamestrike,
    cards.ConeofCold,
    cards.Flamecannon,
    cards.FrostfireBolt,
    cards.FrostNova,
    cards.MirrorImage,
    cards.SkybreakerSorcerer,
    cards.KirinTorBattleMage,
    cards.ArchmageAntonidas,
    cards.ArchmageKhadgar,
    
    cards.ArcaniteReaper,
    cards.Cleave,
    cards.Execute,
    cards.ShieldBlock,
    cards.FieryWarAxe,
    cards.Whirlwind,
    cards.BattleRage,
    cards.IKnowAGuy,
    cards.StolenGoods,
    cards.BloodWarriors,
    cards.Brawl,
    cards.Shadowmourne,
    cards.ShieldSlam,
    cards.BloodhoofBrave,
    cards.GrimyGadgeteer,
    cards.PublicDefender,
    cards.RavagingGhoul,
    cards.WretchedGhoul,
    cards.AlleyArmorsmith,
    cards.AncientShieldbearer,
    cards.AshenDefender,
    cards.FrothingBerserker,
    cards.HighOverlordSaurfang,
    // cards.IronJuggernaut,
    
    cards.IronSensei,
    cards.Backstab,
    cards.Sap,
    cards.Shiv,
    cards.FanofKnives,
    cards.Sprint,
    cards.Recuperate,
    cards.SliceAndDice,
    cards.AnubarAmbusher,
    cards.AccursedShade,
    cards.CrokScourgebane,
    
    cards.Crackle,
    cards.LavaBurst,
    cards.StormforgedAxe,
    cards.WhirlingZapoMatic,
    cards.ChainLightning,
    cards.FeralSpirit,
    cards.ForkedLightning,
    cards.ElementalGuidance,
    cards.TuskarrWeaponsmith,
    cards.UnboundElemental,
    cards.AlAkirtheWindlord,
    cards.Tectus,

    cards.AnimalCompanion,
    cards.ArcaneShot,
    cards.HuntersMark,
    cards.MultiShot,
    cards.CobraShot,
    cards.DeadlyShot,
    cards.SplitShot,
    cards.UnleashTheHounds,
    cards.Barrage,
    cards.ExplosiveShot,
    cards.EagleEye,
    cards.KingsElekk,
    cards.CoreRager,
    cards.GiantSandworm,
    cards.Gahzrilla,
    cards.KingKrush,
    cards.Precious,

    cards.Innervate,
    cards.Swipe,
    cards.Moonfire,
    cards.WildGrowth,
    cards.JadeBlossom,
    cards.Erode,
    cards.LivingRoots,
    cards.RavenIdol,
    cards.Wrath,
    cards.JadeIdol,
    cards.Nourish,
    cards.TreeofLife,
    cards.DruidoftheFlame,
    cards.JadeBehemoth,
    cards.KlaxxiAmberWeaver,
    cards.AncientofLore,
    cards.AncientofWar,
    cards.DruidoftheTalon,
    cards.Cenarius,
    cards.FandralStaghelm,
    cards.HamuulRunetotem,
    cards.Malorne,

    cards.Darkbomb,
    cards.ShadowBolt,
    cards.MortalCoil,
    cards.Voidwalker,
    cards.Succubus,
    cards.DarkOffering,
    cards.Shadowflame,
    cards.IcecrownValkyr,
    cards.VilefinNecromancer,
    cards.BlackheartTheInciter,
    cards.LordJaraxxus,
    cards.MalGanis,

    cards.HandofSacrifice,
    cards.StandAgainstDarkness,
    cards.AldorPeacekeeper,
    cards.Equality,
    cards.AvengingWrath,
    cards.TemplarsVerdict,
    cards.BlessingofKings,
    cards.GuardianofKings,
    cards.WarhorseTrainer,
    cards.HammerofWrath,
    cards.MurlocKnight,
    cards.KingsHerald,
    cards.TerenasMenethil,
    cards.TirionFordring,
    // cards.BolvarFordragon,

    cards.PowerWordShield,
    cards.ShadowWordDeath,
    cards.ShadowWordPain,
    cards.HolyNova,
    cards.Entomb,
    cards.ShadowWordVoid,
    cards.VelensChosen,
    cards.HolyFire,
    cards.Prayer,
    cards.Resurrect,
    cards.PowerWordFortitude,
    cards.Shadowform,
    cards.NorthshireCleric,
    cards.TwilightWhelp,
    cards.WyrmrestAgent,
    cards.SoulbinderTuulani,
    ];
    if(asObjects) {
        for(var i in list) {
            if(typeof list[i] == "function") {
                list[i] = list[i]();
            }
        }
    }
    return list;
};

var standardSets = module.exports.standardSets = function() {
    return [
        "Basic",
        "Classic",
        "Blackrock Mountain",
        "The Grand Tournament",
        "League of Explorers",
        "Whispers of the Old Gods",
        "One Night in Karazhan",
        "Mean Streets of Gadgetzan",
        "Icecrown Citadel"
    ];
};

var classCards = module.exports.classCards = function(className, copies) {
    if(!copies) {
        copies = 1;
    }
    var cardList = [];
    var allCardsList = allCards(true);
    for(var i in allCardsList) {
        var card = allCardsList[i];
        if(!card) {
            throw new Error("uh oh");
        }
        if(card.cardClass) {
            for(var j in card.cardClass) {
                var cardClass = card.cardClass[j];
                if(cardClass == className) {
                    for(var k = 0; k < copies; k++) {
                        cardList.push(card);
                    }
                }
            }
        }
    }
    return cardList;
};

var setCards = module.exports.setCards = function(setName, copies) {
    if(!copies) {
        copies = 1;
    }
    var cardList = [];
    var allCardsList = allCards();
    for(var i in allCardsList) {
        var card = allCardsList[i]();
        if(card.cardSet) {
            if(card.cardSet == setName) {
                for(var j = 0; j < copies; j++) {
                    cardList.push(card);
                }
            }
        }
    }
    return cardList;
};
