"use strict";
var cache = {
    setCookie: function (name, value, expiryDays, path) {
        var d = new Date();
        d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
        var expiry = d.toUTCString();
        document.cookie = "".concat(name, "=").concat(value, "; expires=").concat(expiry, "; path=").concat(path);
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    deleteCookie: function (name) {
        document.cookie = "".concat(name, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
    }
};
var devTools = {
    setWater: function (water) {
        stats.water = water;
    },
    waterMulti: function (multi) {
        stats.waterMulti = multi;
    },
    unlockOcean: function () {
        stats.ocean.unlocked = true;
        stats.shopMap.hasBought = true;
    },
    toggleHacks: function () {
        notifications.add("As you turn on a debugging feature, you feel the developer's power rushing into you");
    },
    ruinthefun: function () {
        devTools.setWater(9999999999999999);
        devTools.waterMulti(99);
        devTools.unlockOcean();
        console.log("DEVTOOLS: ruinthefun");
    }
};
var gameConstants = {
    itemPriceIncrement: 1.2,
    upgradePriceIncrement: 2,
    deep: {
        eventChances: {
            SpawnSmallfish: {
                d1: 0.05,
                d2: 0.03,
                d3: 0,
                d4: 0,
                d5: 0
            },
            AirPocket: {
                d1: 0.05,
                d2: 0.03,
                d3: 0,
                d4: 0,
                d5: 0
            },
            SpawnWhale: {
                d1: 0.01,
                d2: 0.01,
                d3: 0.01,
                d4: 0.01,
                d5: 0.01
            },
            SpawnGiantsquid: {
                d1: 0,
                d2: 0,
                d3: 0.01,
                d4: 0.02,
                d5: 0.05
            }
        }
    },
    autosaveTimer: 300000
};
var stats = {
    water: 0,
    clicks: 0,
    wpt: 0,
    totalWater: 0,
    waterMulti: 1,
    clickMulti: 1,
    completed: false,
    items: {
        wpt: 0
    },
    shop: {
        unlockedItems: 0,
        purchasedItems: 0
    },
    upgrades: {
        unlockedItems: 0,
        purchasedItems: 0
    },
    achievements: {
        totalUnlocked: 0,
        unlocked: {
            AWateryStart: false,
            TheOceanDeeps: false
        }
    },
    ocean: {
        unlocked: false,
        diveUnlocked: false,
        processorUnlocked: false
    },
    deep: {
        deepestDive: 0,
        player: {
            maxOxygen: 10,
            maxHealth: 10
        },
        inventory: {}
    },
    desalinator: {
        money: 0
    },
    lab: {
        unlocked: false
    },
    shopSpoon: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 10,
        waterMulti: 1,
        wpt: 0
    },
    shopCup: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 50,
        waterMulti: 1,
        wpt: 0
    },
    shopBottle: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 100,
        waterMulti: 1,
        wpt: 0
    },
    shopBucket: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 500,
        waterMulti: 1,
        wpt: 0
    },
    shopMap: {
        unlocked: false,
        hasBought: false,
        currentPrice: 1000
    },
    shopSwimsuit: {
        unlocked: false,
        hasBought: false,
        currentPrice: 500
    },
    shopDesalinator: {
        unlocked: false,
        hasBought: false,
        currentPrice: 500
    },
    shopTestTube: {
        unlocked: false,
        hasBought: false,
        currentPrice: 50000
    },
    upgradeReducedEvap: {
        unlocked: false,
        hasUnlocked: false,
        hasBought: false,
        currentRequirement: 1,
        currentPrice: 50,
        level: 1
    },
    upgradeBiggerSpoon: {
        unlocked: false,
        hasUnlocked: false,
        hasBought: false,
        currentRequirement: 1,
        currentPrice: 50,
        level: 1
    },
    upgradeReinforcedSpoon: {
        unlocked: false,
        hasUnlocked: false,
        hasBought: false,
        currentRequirement: 5,
        currentPrice: 100,
        level: 1
    },
    version: 1
};
var input = {
    click: function () {
        stats.water += stats.clickMulti * stats.waterMulti;
        stats.totalWater += stats.clickMulti * stats.waterMulti;
        stats.clicks++;
        shop.detectRequirements();
        achievements.detectRequirements();
        graphics.render();
    }
};
var random = {
    integer: function (max, min) {
        return Math.floor(Math.random() * max) + min;
    },
    object: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};
var convert = {
    toRomanNumerals: function (level) {
        if (level == 1)
            return "I";
        else if (level == 2)
            return "II";
        else if (level == 3)
            return "III";
        else if (level == 4)
            return "IV";
        else if (level == 5)
            return "V";
        else if (level == 6)
            return "VI";
        else if (level == 7)
            return "VII";
        else if (level == 8)
            return "VIII";
        else if (level == 9)
            return "IX";
        else if (level == 10)
            return "X";
        else
            return "Overflow";
    },
    toSuffix: function (water) {
        var waterUnit = Math.floor(water);
        var suffix;
        if (stats.water >= 1000000) {
            suffix = "kL";
            waterUnit = Number((waterUnit / 1000000).toFixed(3));
        }
        else if (stats.water >= 1000) {
            suffix = "L";
            waterUnit = Number((waterUnit / 1000).toFixed(3));
        }
        else if (stats.water >= 0) {
            suffix = "ml";
            waterUnit = Number((waterUnit / 1).toFixed(3));
        }
        ;
        return [waterUnit, suffix];
    }
};
var shop = {
    detectRequirements: function () {
        {
            if (this.Spoon.detectRequirements() && !stats.shopSpoon.unlocked) {
                this.Spoon.unlock();
            }
            if (this.Cup.detectRequirements() && !stats.shopCup.unlocked) {
                this.Cup.unlock();
            }
            if (this.Bottle.detectRequirements() && !stats.shopBottle.unlocked) {
                this.Bottle.unlock();
            }
            if (this.Bucket.detectRequirements() && !stats.shopBucket.unlocked) {
                this.Bucket.unlock();
            }
        }
        {
            if (this.ReducedEvap.detectRequirements() && !stats.upgradeReducedEvap.unlocked) {
                this.ReducedEvap.unlock();
            }
        }
        {
            if (this.Map.detectRequirements() && !stats.shopMap.unlocked) {
                this.Map.unlock();
            }
            if (this.Swimsuit.detectRequirements() && !stats.shopSwimsuit.unlocked) {
                this.Swimsuit.unlock();
            }
            if (this.Desalinator.detectRequirements() && !stats.shopDesalinator.unlocked) {
                this.Desalinator.unlock();
            }
            if (this.TestTube.detectRequirements() && !stats.shopTestTube.unlocked) {
                this.TestTube.unlock();
            }
        }
        {
            if (this.BiggerSpoon.detectRequirements() && !stats.upgradeBiggerSpoon.unlocked) {
                this.BiggerSpoon.unlock();
            }
            if (this.ReinforcedSpoon.detectRequirements() && !stats.upgradeReinforcedSpoon.unlocked) {
                this.ReinforcedSpoon.unlock();
            }
        }
    },
    unlockShopItem: function () {
        stats.shop.unlockedItems++;
        graphics.renderShop();
    },
    purchaseShopItem: function () {
        stats.shop.purchasedItems++;
        shop.refreshWpt();
        shop.detectRequirements();
        graphics.renderShop();
    },
    unlockUpgradeItem: function () {
        stats.upgrades.unlockedItems++;
        graphics.renderUpgrades();
    },
    purchaseUpgradeItem: function () {
        stats.upgrades.purchasedItems++;
        shop.refreshWpt();
        shop.detectRequirements();
    },
    refreshWpt: function () {
        stats.shopSpoon.wpt = stats.shopSpoon.bought * 0.1 * stats.shopSpoon.waterMulti;
        stats.shopCup.wpt = stats.shopCup.bought * 0.5 * stats.shopCup.waterMulti;
        stats.shopBottle.wpt = stats.shopBottle.bought * 2 * stats.shopBottle.waterMulti;
        stats.shopBucket.wpt = stats.shopBucket.bought * 5 * stats.shopBucket.waterMulti;
        stats.items.wpt = stats.shopSpoon.wpt + stats.shopCup.wpt + stats.shopBottle.wpt + stats.shopBucket.wpt;
    },
    Spoon: {
        id: "Spoon",
        detectRequirements: function () {
            if (stats.water >= 1)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopSpoon.unlocked = true;
            shop.unlockShopItem();
            console.log("New item unlocked!");
            notifications.add("You found a spoon");
        },
        purchase: function () {
            if (stats.water < stats.shopSpoon.currentPrice)
                return;
            if (!stats.shopSpoon.hasBought)
                stats.shopSpoon.hasBought = true;
            stats.shopSpoon.bought++;
            stats.water -= stats.shopSpoon.currentPrice;
            stats.shopSpoon.currentPrice = Math.ceil(stats.shopSpoon.currentPrice * gameConstants.itemPriceIncrement);
            shop.purchaseShopItem();
        }
    },
    Cup: {
        detectRequirements: function () {
            if (stats.water > 50 && stats.shopSpoon.bought >= 1)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopCup.unlocked = true;
            shop.unlockShopItem();
            console.log("New item unlocked!");
            notifications.add("You found a cup");
        },
        purchase: function () {
            if (stats.water < stats.shopCup.currentPrice)
                return;
            if (!stats.shopCup.hasBought)
                stats.shopCup.hasBought = true;
            stats.shopCup.bought++;
            stats.water -= stats.shopCup.currentPrice;
            stats.shopCup.currentPrice = Math.ceil(stats.shopCup.currentPrice * gameConstants.itemPriceIncrement);
            shop.purchaseShopItem();
        }
    },
    Bottle: {
        detectRequirements: function () {
            if (stats.water > 200 && stats.shopCup.bought >= 1)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopBottle.unlocked = true;
            shop.unlockShopItem();
            console.log("New item unlocked!");
            notifications.add("You found a bottle");
        },
        purchase: function () {
            if (stats.water < stats.shopBottle.currentPrice)
                return;
            if (!stats.shopBottle.hasBought)
                stats.shopBottle.hasBought = true;
            stats.shopBottle.bought++;
            stats.water -= stats.shopBottle.currentPrice;
            stats.shopBottle.currentPrice = Math.ceil(stats.shopBottle.currentPrice * gameConstants.itemPriceIncrement);
            shop.purchaseShopItem();
        }
    },
    Bucket: {
        detectRequirements: function () {
            if (stats.water > 500 && stats.shopBottle.bought >= 5)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopBucket.unlocked = true;
            shop.unlockShopItem();
            console.log("New item unlocked!");
            notifications.add("You found a bucket");
        },
        purchase: function () {
            if (stats.water < stats.shopBucket.currentPrice)
                return;
            if (!stats.shopBucket.hasBought)
                stats.shopBucket.hasBought = true;
            stats.shopBucket.bought++;
            stats.water -= stats.shopBucket.currentPrice;
            stats.shopBucket.currentPrice = Math.ceil(stats.shopBucket.currentPrice * gameConstants.itemPriceIncrement);
            shop.purchaseShopItem();
        }
    },
    Map: {
        id: "Map",
        detectRequirements: function () {
            if (stats.totalWater > 0)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopMap.unlocked = true;
            graphics.renderShop();
            console.log("A Dusty Map unlocked!");
            notifications.add("You see a dusty map in the corner of the room");
        },
        purchase: function () {
            if (stats.shopMap.hasBought || stats.water < stats.shopMap.currentPrice)
                return;
            stats.shopMap.hasBought = true;
            stats.water -= stats.shopMap.currentPrice;
            stats.ocean.unlocked = true;
            notifications.add("As you pick up the faded and dusty map, you see a faint outline of a shoreline far away");
            graphics.renderShop();
        }
    },
    Swimsuit: {
        id: "Swimsuit",
        detectRequirements: function () {
            if (stats.shopMap.hasBought)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopSwimsuit.unlocked = true;
            graphics.renderShop();
            console.log("Swimsuit unlocked!");
            notifications.add("You see a swimsuit that allows you to swim in the ocean");
        },
        purchase: function () {
            if (stats.shopSwimsuit.hasBought || stats.water < stats.shopSwimsuit.currentPrice)
                return;
            stats.shopSwimsuit.hasBought = true;
            stats.water -= stats.shopSwimsuit.currentPrice;
            stats.ocean.diveUnlocked = true;
            notifications.add("You gaze down the blue depths, the roar of the ocean, the mysteries");
            graphics.renderShop();
        }
    },
    Desalinator: {
        id: "Desalinator",
        detectRequirements: function () {
            if (stats.shopMap.hasBought)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopDesalinator.unlocked = true;
            graphics.renderShop();
            console.log("Desalinator unlocked!");
            notifications.add("You see blueprints for a desalinator that turns seawater into water");
        },
        purchase: function () {
            if (stats.shopDesalinator.hasBought || stats.water < stats.shopDesalinator.currentPrice)
                return;
            stats.shopDesalinator.hasBought = true;
            stats.water -= stats.shopDesalinator.currentPrice;
            stats.ocean.processorUnlocked = true;
            graphics.renderShop();
        }
    },
    TestTube: {
        id: "TestTube",
        detectRequirements: function () {
            if (stats.water >= 10000 && stats.shopMap.hasBought)
                return true;
            return false;
        },
        unlock: function () {
            stats.shopTestTube.unlocked = true;
            console.log("A Test Tube unlocked!");
        }
    },
    ReducedEvap: {
        id: "ReducedEvap",
        detectRequirements: function () {
            if (stats.water >= stats.upgradeReducedEvap.currentRequirement)
                return true;
            return false;
        },
        unlock: function () {
            stats.upgradeReducedEvap.hasUnlocked = true;
            stats.upgradeReducedEvap.unlocked = true;
            shop.unlockUpgradeItem();
            console.log("Reduced Evaporation unlocked!");
            notifications.add("You found an upgrade that reduces water evaporation");
        },
        purchase: function () {
            if (stats.water < stats.upgradeReducedEvap.currentPrice)
                return;
            if (!stats.upgradeReducedEvap.hasBought)
                stats.upgradeReducedEvap.hasBought = true;
            stats.upgradeReducedEvap.level++;
            stats.water -= stats.upgradeReducedEvap.currentPrice;
            stats.waterMulti += 0.05;
            stats.upgradeReducedEvap.currentRequirement = Math.ceil(stats.upgradeReducedEvap.currentRequirement * gameConstants.upgradePriceIncrement);
            stats.upgradeReducedEvap.currentPrice = Math.ceil(stats.upgradeReducedEvap.currentPrice * gameConstants.upgradePriceIncrement);
            stats.upgradeReducedEvap.unlocked = false;
            shop.purchaseUpgradeItem();
        }
    },
    BiggerSpoon: {
        id: "BiggerSpoon",
        detectRequirements: function () {
            if (stats.shopSpoon.bought >= 1)
                return true;
            return false;
        },
        unlock: function () {
            stats.upgradeBiggerSpoon.hasUnlocked = true;
            stats.upgradeBiggerSpoon.unlocked = true;
            shop.unlockUpgradeItem();
            console.log("Bigger Spoon unlocked!");
            notifications.add("You found an upgrade that makes your spoons bigger");
        },
        purchase: function () {
            if (stats.water < stats.upgradeBiggerSpoon.currentPrice)
                return;
            if (!stats.upgradeBiggerSpoon.hasBought)
                stats.upgradeBiggerSpoon.hasBought = true;
            stats.upgradeBiggerSpoon.level++;
            stats.water -= stats.upgradeBiggerSpoon.currentPrice;
            stats.shopSpoon.waterMulti += 0.1;
            stats.upgradeBiggerSpoon.currentPrice = Math.ceil(stats.upgradeBiggerSpoon.currentPrice * gameConstants.upgradePriceIncrement);
            stats.upgradeBiggerSpoon.unlocked = false;
            shop.purchaseUpgradeItem();
        }
    },
    ReinforcedSpoon: {
        id: "ReinforcedSpoon",
        detectRequirements: function () {
            if (stats.shopSpoon.bought >= 5)
                return true;
            return false;
        },
        unlock: function () {
            stats.upgradeReinforcedSpoon.hasUnlocked = true;
            stats.upgradeReinforcedSpoon.unlocked = true;
            shop.unlockUpgradeItem();
            console.log("Reinforced Spoon unlocked!");
            notifications.add("You found an upgrade that plates your spoons with titanium");
        },
        purchase: function () {
            if (stats.water < stats.upgradeReinforcedSpoon.currentPrice)
                return;
            if (!stats.upgradeReinforcedSpoon.hasBought)
                stats.upgradeReinforcedSpoon.hasBought = true;
            stats.upgradeReinforcedSpoon.level++;
            stats.water -= stats.upgradeReinforcedSpoon.currentPrice;
            stats.shopSpoon.waterMulti += 0.1;
            stats.upgradeReinforcedSpoon.currentPrice = Math.ceil(stats.upgradeReinforcedSpoon.currentPrice * gameConstants.upgradePriceIncrement);
            stats.upgradeReinforcedSpoon.unlocked = false;
            shop.purchaseUpgradeItem();
        }
    }
};
var achievements = {
    detectRequirements: function () {
        {
            if (achievements.AWateryStart.detectRequirements() && !stats.achievements.unlocked.AWateryStart)
                achievements.AWateryStart.unlock();
            if (achievements.TheOceanDeeps.detectRequirements() && !stats.achievements.unlocked.TheOceanDeeps)
                achievements.TheOceanDeeps.unlock();
        }
    },
    unlockAchievement: function () {
        stats.achievements.totalUnlocked++;
        notifications.add("You reached a new milestone");
    },
    AWateryStart: {
        detectRequirements: function () {
            if (stats.totalWater >= 1)
                return true;
            return false;
        },
        unlock: function () {
            stats.achievements.unlocked.AWateryStart = true;
            achievements.unlockAchievement();
        }
    },
    TheOceanDeeps: {
        detectRequirements: function () {
            if (stats.shopMap.hasBought)
                return true;
            return false;
        },
        unlock: function () {
            stats.achievements.unlocked.TheOceanDeeps = true;
            achievements.unlockAchievement();
        }
    }
};
var ocean = {
    deep: {
        player: {
            health: 0,
            maxHealth: 0,
            oxygen: 0,
            maxOxygen: 10,
            pressure: 0,
            surfacing: false,
            inCombat: false,
            statusEffects: {},
            onTurn: function () { },
            nextTurn: function () { }
        },
        currentDepth: 0,
        currentZone: 0,
        entity: /** @class */ (function () {
            function class_1(health) {
                this.health = health;
                this.maxHealth = health;
            }
            return class_1;
        }()),
        EnemyEntity: {
            GiantSquid: /** @class */ (function () {
                function class_2() {
                    this.health = 200;
                    this.maxHealth = 200;
                    this.attack = 50;
                    this.defense = 40;
                    this.onTurn = function () { };
                    this.nextTurn = function () {
                    };
                }
                return class_2;
            }())
        },
        specialEntity: {},
        event: {
            add: function () { },
            clear: function () { }
        },
        events: {
            SpawnSmallfish: {
                effects: function () {
                }
            }
        },
        generate: function () {
            var eventID = '';
            switch (ocean.deep.currentZone) {
                case 0:
                    break;
                case 1:
                    eventID = ocean.deep.generateEvent(1);
                    break;
                case 2:
                    eventID = ocean.deep.generateEvent(2);
                    break;
                case 3:
                    eventID = ocean.deep.generateEvent(3);
                    break;
                case 4:
                    eventID = ocean.deep.generateEvent(4);
                    break;
                case 5:
                    eventID = ocean.deep.generateEvent(5);
                    break;
                default:
                    break;
            }
            ocean.deep.parseEvent(eventID);
            console.log(eventID);
            $("#oceanEvent").text(eventID);
        },
        parseEvent: function (event) {
            var eventArgs = event.split(/[A-Z]/);
        },
        generateEvent: function (depth) {
            if (ocean.deep.player.oxygen == 0)
                return "DeathSuffocation";
            var spawnDepth = String(depth);
            if (!ocean.deep.player.surfacing)
                (function (spawnDepth) {
                    if (Math.random() <= gameConstants.deep.eventChances.SpawnSmallfish["d".concat(spawnDepth)])
                        return "SpawnSmallfish";
                    else if (Math.random() <= gameConstants.deep.eventChances.AirPocket["d".concat(spawnDepth)])
                        return "AirPocket";
                    else if (Math.random() <= gameConstants.deep.eventChances.SpawnWhale["d".concat(spawnDepth)])
                        return "SpawnWhale";
                    else if (Math.random() <= gameConstants.deep.eventChances.SpawnGiantsquid["d".concat(spawnDepth)])
                        return "SpawnGiantsquid";
                });
            return 'None';
        },
        swimUp: function () {
            ocean.deep.currentDepth--;
            ocean.deep.nextTurn();
        },
        swimDown: function () {
            ocean.deep.currentDepth++;
            ocean.deep.nextTurn();
        },
        swimContinue: function () {
            if (ocean.deep.currentZone == 0) {
                ocean.deep.endDive();
            }
            ocean.deep.nextTurn();
        },
        swimSurface: function () {
            ocean.deep.player.surfacing = true;
            ocean.deep.nextTurn();
        },
        nextTurn: function () {
            if (ocean.deep.currentDepth >= 150) {
                ocean.deep.currentZone = 5;
            }
            else if (ocean.deep.currentDepth >= 90) {
                ocean.deep.currentZone = 4;
            }
            else if (ocean.deep.currentDepth >= 40) {
                ocean.deep.currentZone = 3;
            }
            else if (ocean.deep.currentDepth >= 15) {
                ocean.deep.currentZone = 2;
            }
            else if (ocean.deep.currentDepth >= 1) {
                ocean.deep.currentZone = 1;
            }
            else if (ocean.deep.currentDepth == 0) {
                ocean.deep.currentZone = 0;
            }
            ocean.deep.player.oxygen--;
            //Special status effects
            if (ocean.deep.player.surfacing) {
                ocean.deep.player.oxygen++;
                ocean.deep.currentDepth = ocean.deep.currentDepth - 5 <= 0 ? 0 : ocean.deep.currentDepth - 5;
                graphics.renderDeep();
                return;
            }
            ocean.deep.generate();
            graphics.renderDeep();
        },
        prepareDive: function () {
            ocean.deep.player.oxygen = stats.deep.player.maxOxygen;
            ocean.deep.player.health = ocean.deep.player.maxHealth;
            ocean.deep.player.surfacing = false;
        },
        endDive: function () {
            ocean.deep.prepareDive();
            $("#theDeepOcean").hide();
            $("#mainOcean").show();
        }
    },
    inventory: {},
    desalinator: {}
};
var graphics = {
    render: function () {
        graphics.renderWater();
        graphics.renderNavigation();
        graphics.renderShop();
        graphics.renderUpgrades();
        graphics.renderOcean();
        graphics.renderAchievements();
    },
    renderWater: function () {
        var converted = convert.toSuffix(stats.water);
        $("#waterAmount").html("".concat(converted[0], " ").concat(converted[1], " water"));
    },
    renderNavigation: function () {
        if (stats.totalWater > 0)
            $("#navHome").show();
        if (stats.shop.unlockedItems > 0)
            $("#navItems").show();
        if (stats.upgrades.unlockedItems > 0)
            $("#navUpgrades").show();
        if (stats.ocean.unlocked)
            $("#navDeep").show();
        if (stats.lab.unlocked)
            $("#navLab").show();
        if (stats.achievements.totalUnlocked > 0)
            $("#navAchieve").show();
        if (stats.totalWater > 0)
            $("#navSettings").show();
        if (stats.completed)
            $("#navStory").show();
    },
    renderShop: function () {
        if (stats.shopSpoon.unlocked)
            $("#shopSpoon").show();
        ;
        if (stats.shopCup.unlocked)
            $("#shopCup").show();
        if (stats.shopBottle.unlocked)
            $("#shopBottle").show();
        if (stats.shopBucket.unlocked)
            $("#shopBucket").show();
        if (stats.shopMap.unlocked)
            $("#shopMap").show();
        if (stats.shopSwimsuit.unlocked)
            $("#shopSwimsuit").show();
        if (stats.shopDesalinator.unlocked)
            $("#shopDesalinator").show();
        if (stats.shopTestTube.unlocked)
            $("#shopTestTube").show();
        $("#shopSpoonAmount").text(String(stats.shopSpoon.bought));
        $("#shopCupAmount").text(String(stats.shopCup.bought));
        $("#shopBottleAmount").text(String(stats.shopBottle.bought));
        $("#shopBucketAmount").text(String(stats.shopBucket.bought));
        //Render Special Items
        if (stats.shopMap.hasBought)
            $("#shopMap").hide();
        if (stats.shopSwimsuit.hasBought)
            $("#shopSwimsuit").hide();
        if (stats.shopDesalinator.hasBought)
            $("#shopDesalinator").hide();
        //Render Price
        $("#shopSpoonPrice").text(String(stats.shopSpoon.currentPrice));
        $("#shopCupPrice").text(String(stats.shopCup.currentPrice));
        $("#shopBottlePrice").text(String(stats.shopBottle.currentPrice));
        $("#shopBucketPrice").text(String(stats.shopBucket.currentPrice));
    },
    renderUpgrades: function () {
        if (stats.upgradeReducedEvap.unlocked)
            $("#upgradeReducedEvap").show();
        if (stats.upgradeBiggerSpoon.unlocked)
            $("#upgradeBiggerSpoon").show();
        if (stats.upgradeReinforcedSpoon.unlocked)
            $("#upgradeReinforcedSpoon").show();
        if (!stats.upgradeReducedEvap.unlocked)
            $("#upgradeReducedEvap").hide();
        if (!stats.upgradeBiggerSpoon.unlocked)
            $("#upgradeBiggerSpoon").hide();
        if (!stats.upgradeReinforcedSpoon.unlocked)
            $("#upgradeReinforcedSpoon").hide();
        $("#upgradeReducedEvapLevel").text(convert.toRomanNumerals(stats.upgradeReducedEvap.level));
        $("#upgradeBiggerSpoonLevel").text(convert.toRomanNumerals(stats.upgradeBiggerSpoon.level));
        $("#upgradeReinforcedSpoonLevel").text(convert.toRomanNumerals(stats.upgradeReinforcedSpoon.level));
        //Render Price
        $("#upgradeReducedEvapPrice").text(stats.upgradeReducedEvap.currentPrice);
        $("#upgradeBiggerSpoonPrice").text(stats.upgradeBiggerSpoon.currentPrice);
        $("#upgradeReinforcedSpoonPrice").text(stats.upgradeReinforcedSpoon.currentPrice);
    },
    renderOcean: function () {
        if (stats.ocean.diveUnlocked)
            $("#enterOcean").show();
        if (stats.ocean.diveUnlocked)
            $("#openBackpack").show();
        if (stats.ocean.processorUnlocked)
            $("#oceanProcessing").show();
    },
    renderDeep: function () {
        if (ocean.deep.currentZone == 5) {
            $("#oceanZone").text("The Hadal Zone");
        }
        else if (ocean.deep.currentZone == 4) {
            $("#oceanZone").text("The Abyssal Zone");
        }
        else if (ocean.deep.currentZone == 3) {
            $("#oceanZone").text("The Midnight Zone");
        }
        else if (ocean.deep.currentZone == 2) {
            $("#oceanZone").text("The Twilight Zone");
        }
        else if (ocean.deep.currentZone == 1) {
            $("#oceanZone").text("The Sunlight Zone");
        }
        else if (ocean.deep.currentZone == 0) {
            $("#oceanZone").text("The Ocean Surface");
        }
        ;
        $("#playerDepth").text("Depth: ".concat(ocean.deep.currentDepth));
        $("#playerOxygen").text("Oxygen: ".concat(ocean.deep.player.oxygen));
        $("#playerHealth").text("Health: ".concat(ocean.deep.player.health));
        if (ocean.deep.player.surfacing) {
            $("[data-navControls]").hide();
        }
        else {
            $("[data-navControls]").show();
        }
        ;
        if (!ocean.deep.player.inCombat) {
            $("#battleControls").hide();
        }
        else {
            $("#battleControls").show();
        }
        ;
    },
    renderAchievements: function () { }
};
var notifications = {
    notifications: [''],
    notificationsLifespan: [0],
    notificationTimeout: 0,
    renderNotifications: function () {
        for (var i = 0; i < notifications.notifications.length; i++) {
            notifications.notificationsLifespan[i]--;
            if (notifications.notificationsLifespan[i] == 0) {
                $("#notification".concat(i + 1)).fadeOut();
                notifications.notifications.shift();
                notifications.notificationsLifespan.shift();
                for (var i_1 = 0; i_1 < notifications.notifications.length; i_1++) {
                    $("#notification".concat(i_1 + 2)).attr("id", "notification".concat(i_1 + 1));
                }
            }
        }
        notifications.notificationTimeout = window.setTimeout(notifications.renderNotifications, 1000);
    },
    add: function (content) {
        notifications.notifications.push(content);
        notifications.notificationsLifespan.push(30);
        $("#notifications-container").prepend("<div id=\"notification".concat(notifications.notifications.length, "\"class=\"notification\" style=\"opacity:1\">").concat(notifications.notifications[notifications.notifications.length - 1], "</div>"));
        if (notifications.notifications.length > 15) {
            notifications.notifications.shift();
            notifications.notificationsLifespan.shift();
            for (var i = 0; i < notifications.notifications.length; i++) {
                $("#notification".concat(i + 2)).attr("id", "notification".concat(i + 1));
            }
            $("#notification1").hide();
        }
    },
    clear: function () {
        // $("#notifications-container").html('');
        for (var i = 0; i < notifications.notifications.length; i++) {
            $("#notification".concat(i + 1)).fadeOut();
        }
        notifications.notifications = [];
        notifications.notificationsLifespan = [];
        notifications.renderNotifications();
    }
};
var tick = {
    tickTimeout: 0,
    tick: function () {
        stats.wpt = stats.items.wpt;
        stats.water += stats.wpt * stats.waterMulti;
        stats.totalWater += stats.wpt * stats.waterMulti;
        shop.detectRequirements();
        graphics.render();
        tick.tickTimeout = window.setTimeout(tick.tick, 100);
    }
};
var save = {
    autosaveTimeout: 0,
    autosaveTimer: 0,
    autoSave: function () {
        cache.setCookie("stats", JSON.stringify(stats), 365, '/');
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        console.log("Saved!");
    },
    save: function () {
        cache.setCookie("stats", JSON.stringify(stats), 365, '/');
        console.log("Saved!");
    },
    reset: function () {
        var _a;
        var confirmation = (_a = window.prompt("Are you sure you want to reset?\nType \"CONTINUE\" to confirm, or any other character to dismiss")) !== null && _a !== void 0 ? _a : '';
        if (confirmation.toLowerCase() === "continue") {
            stats = {
                water: 0,
                clicks: 0,
                wpt: 0,
                totalWater: 0,
                waterMulti: 1,
                clickMulti: 1,
                completed: false,
                items: {
                    wpt: 0
                },
                shop: {
                    unlockedItems: 0,
                    purchasedItems: 0
                },
                upgrades: {
                    unlockedItems: 0,
                    purchasedItems: 0
                },
                achievements: {
                    totalUnlocked: 0,
                    unlocked: {
                        AWateryStart: false,
                        TheOceanDeeps: false
                    }
                },
                ocean: {
                    unlocked: false,
                    diveUnlocked: false,
                    processorUnlocked: false
                },
                deep: {
                    deepestDive: 0,
                    player: {
                        maxOxygen: 10,
                        maxHealth: 10
                    },
                    inventory: {}
                },
                desalinator: {
                    money: 0
                },
                lab: {
                    unlocked: false
                },
                shopSpoon: {
                    unlocked: false,
                    hasBought: false,
                    bought: 0,
                    currentPrice: 10,
                    waterMulti: 1,
                    wpt: 0
                },
                shopCup: {
                    unlocked: false,
                    hasBought: false,
                    bought: 0,
                    currentPrice: 50,
                    waterMulti: 1,
                    wpt: 0
                },
                shopBottle: {
                    unlocked: false,
                    hasBought: false,
                    bought: 0,
                    currentPrice: 100,
                    waterMulti: 1,
                    wpt: 0
                },
                shopBucket: {
                    unlocked: false,
                    hasBought: false,
                    bought: 0,
                    currentPrice: 500,
                    waterMulti: 1,
                    wpt: 0
                },
                shopMap: {
                    unlocked: false,
                    hasBought: false,
                    currentPrice: 1000
                },
                shopSwimsuit: {
                    unlocked: false,
                    hasBought: false,
                    currentPrice: 500
                },
                shopDesalinator: {
                    unlocked: false,
                    hasBought: false,
                    currentPrice: 500
                },
                shopTestTube: {
                    unlocked: false,
                    hasBought: false,
                    currentPrice: 50000
                },
                upgradeReducedEvap: {
                    unlocked: false,
                    hasUnlocked: false,
                    hasBought: false,
                    currentRequirement: 1,
                    currentPrice: 50,
                    level: 1
                },
                upgradeBiggerSpoon: {
                    unlocked: false,
                    hasUnlocked: false,
                    hasBought: false,
                    currentRequirement: 1,
                    currentPrice: 50,
                    level: 1
                },
                upgradeReinforcedSpoon: {
                    unlocked: false,
                    hasUnlocked: false,
                    hasBought: false,
                    currentRequirement: 1,
                    currentPrice: 100,
                    level: 1
                },
                version: 0
            };
            notifications.clear();
            init.game();
            console.log("Game resetted");
        }
    }
};
var init = {
    game: function () {
        init.stats();
        init.versionUpdater();
        init.userInterface();
        init.controls();
        init.shop();
        init.upgrades();
        init.shopPurchase();
        init.upgradePurchase();
        init.notifications();
        init.ocean();
        init.deep();
        init.achievements();
        init.amounts();
        init.save();
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        console.log("Game initialised!");
    },
    stats: function () {
        var _a;
        try {
            stats = (_a = JSON.parse(cache.getCookie("stats"))) !== null && _a !== void 0 ? _a : stats;
        }
        catch (e) { }
        ;
    },
    userInterface: function () {
        $("#pageHome").show();
        $("#pageItems").hide();
        $("#pageUpgrades").hide();
        $("#pageDeep").hide();
        $("#pageLab").hide();
        $("#pageAchieve").hide();
        $("#pageSettings").hide();
        $("#pageStory").hide();
        if (stats.totalWater == 0)
            $("#navHome").hide();
        if (stats.shop.unlockedItems == 0)
            $("#navItems").hide();
        if (stats.upgrades.unlockedItems == 0)
            $("#navUpgrades").hide();
        if (!stats.ocean.unlocked)
            $("#navDeep").hide();
        if (!stats.lab.unlocked)
            $("#navLab").hide();
        if (stats.achievements.totalUnlocked == 0)
            $("#navAchieve").hide();
        if (stats.totalWater == 0)
            $("#navSettings").hide();
        if (!stats.completed)
            $("#navStory").hide();
    },
    controls: function () {
        $("#clickMe").click(input.click);
        {
            $("#navHome").click(function () {
                $("#pageHome").show();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").hide();
            });
            $("#navItems").click(function () {
                $("#pageHome").hide();
                $("#pageItems").show();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").hide();
            });
            $("#navUpgrades").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").show();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").hide();
            });
            $("#navDeep").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").show();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").hide();
                //Subpages
                $("#mainOcean").show();
                $("#theDeepOcean").hide();
                $("#backpack").hide();
                $("#oceanProcessor").hide();
            });
            $("#navLab").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").show();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").hide();
            });
            $("#navAchieve").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").show();
                $("#pageSettings").hide();
                $("#pageStory").hide();
            });
            $("#navSettings").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").show();
                $("#pageStory").hide();
            });
            $("#navStory").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
                $("#pageStory").show();
            });
        }
    },
    shop: function () {
        if (!stats.shopSpoon.unlocked)
            $("#shopSpoon").hide();
        if (!stats.shopCup.unlocked)
            $("#shopCup").hide();
        if (!stats.shopBottle.unlocked)
            $("#shopBottle").hide();
        if (!stats.shopBucket.unlocked)
            $("#shopBucket").hide();
        if (!stats.shopMap.unlocked || stats.shopMap.hasBought)
            $("#shopMap").hide();
        if (!stats.shopSwimsuit.unlocked || stats.shopSwimsuit.hasBought)
            $("#shopSwimsuit").hide();
        if (!stats.shopDesalinator.unlocked || stats.shopDesalinator.hasBought)
            $("#shopDesalinator").hide();
        if (!stats.shopTestTube.unlocked || stats.shopTestTube.hasBought)
            $("#shopTestTube").hide();
    },
    upgrades: function () {
        if (!stats.upgradeReducedEvap.unlocked)
            $("#upgradeReducedEvap").hide();
        if (!stats.upgradeBiggerSpoon.unlocked)
            $("#upgradeBiggerSpoon").hide();
        if (!stats.upgradeReinforcedSpoon.unlocked)
            $("#upgradeReinforcedSpoon").hide();
        $("#upgradeReducedEvapLevel").text(convert.toRomanNumerals(stats.upgradeReducedEvap.level));
        $("#upgradeBiggerSpoonLevel").text(convert.toRomanNumerals(stats.upgradeBiggerSpoon.level));
        $("#upgradeReinforcedSpoonLevel").text(convert.toRomanNumerals(stats.upgradeReinforcedSpoon.level));
    },
    shopPurchase: function () {
        $("#shopSpoon").click(shop.Spoon.purchase);
        $("#shopCup").click(shop.Cup.purchase);
        $("#shopBottle").click(shop.Bottle.purchase);
        $("#shopBucket").click(shop.Bucket.purchase);
        $("#shopMap").click(shop.Map.purchase);
        $("#shopSwimsuit").click(shop.Swimsuit.purchase);
        $("#shopDesalinator").click(shop.Desalinator.purchase);
    },
    upgradePurchase: function () {
        $("#upgradeReducedEvap").click(shop.ReducedEvap.purchase);
        $("#upgradeBiggerSpoon").click(shop.BiggerSpoon.purchase);
        $("#upgradeReinforcedSpoon").click(shop.ReinforcedSpoon.purchase);
    },
    notifications: function () {
        notifications.renderNotifications();
    },
    ocean: function () {
        $("#theDeepOcean").hide();
        $("#backpack").hide();
        $("#oceanProcessor").hide();
        //Navigating
        $("#enterOcean").click(function () {
            $("#mainOcean").hide();
            $("#backpack").hide();
            $("#theDeepOcean").show();
            $("#oceanProcessor").hide();
            graphics.renderDeep();
        });
        $("#openBackpack").click(function () {
            $("#mainOcean").hide();
            $("#backpack").show();
            $("#theDeepOcean").hide();
            $("#oceanProcessor").hide();
        });
        $("#oceanProcessing").click(function () {
            $("#mainOcean").hide();
            $("#backpack").hide();
            $("#theDeepOcean").hide();
            $("#oceanProcessor").show();
        });
        if (!stats.ocean.diveUnlocked)
            $("#enterOcean").hide();
        if (!stats.ocean.diveUnlocked)
            $("#openBackpack").hide();
        if (!stats.ocean.processorUnlocked)
            $("#oceanProcessing").hide();
    },
    deep: function () {
        $("#swimUp").click(ocean.deep.swimUp);
        $("#swimDown").click(ocean.deep.swimDown);
        $("#swimContinue").click(ocean.deep.swimContinue);
        $("#swimSurface").click(ocean.deep.swimSurface);
        ocean.deep.player.maxHealth = stats.deep.player.maxHealth;
        ocean.deep.player.maxOxygen = stats.deep.player.maxOxygen;
        ocean.deep.prepareDive();
    },
    achievements: function () {
        {
            var milestoneIDs = ["milestoneAWateryStart", "milestoneTheOceanDeeps", "milestoneMidnightWaters", "milestoneSeaMonster"];
            var milestoneDescIDs_1 = ["milestoneDescAWateryStart", "milestoneDescTheOceanDeeps", "milestoneDescMidnightWaters", "milestoneDescSeaMonster"];
            var _loop_1 = function (milestone) {
                $("#".concat(milestoneDescIDs_1[milestone])).hide();
                $("#".concat(milestoneIDs[milestone])).mouseenter(function () { $("#".concat(milestoneDescIDs_1[milestone])).show(); });
                $("#".concat(milestoneIDs[milestone])).mouseleave(function () { $("#".concat(milestoneDescIDs_1[milestone])).hide(); });
            };
            for (var milestone in milestoneIDs) {
                _loop_1(milestone);
            }
        }
    },
    amounts: function () {
        {
            var converted = convert.toSuffix(stats.water);
            $("#waterAmount").html("".concat(converted[0], " ").concat(converted[1], " water"));
        }
    },
    save: function () {
        $("#save").click(save.save);
        $("#reset").click(save.reset);
    },
    versionUpdater: function () {
        if (stats.version <= 1) {
            for (var key in stats) {
                console.log(key);
            }
        }
    }
};
init.game();
tick.tick();
// devTools.ruinthefun();
devTools.waterMulti(5);
devTools.setWater(999999);
devTools.unlockOcean();
