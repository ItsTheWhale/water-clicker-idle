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
    Spoon: {},
    Cup: {},
    Bottle: {},
    Bucket: {},
    autosaveTimer: 300000
};
var stats = {
    water: 0,
    clicks: 0,
    wpt: 0,
    totalWater: 0,
    waterMulti: 1,
    clickMulti: 1,
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
        unlocked: 0
    },
    ocean: {
        unlocked: false,
        diveUnlocked: false,
        processorUnlocked: false
    },
    deep: {
        deepestDive: 0,
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
        currentPrice: 50,
        level: 1
    },
    upgradeReinforcedSpoon: {
        unlocked: false,
        hasUnlocked: false,
        hasBought: false,
        currentPrice: 100,
        level: 1
    }
};
var tempStats = {
    currentPage: "pageHome",
    currentPageId: 0
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
var convert = {
    toSuffix: function (water) {
        var waterUnit = Math.floor(water);
        var suffix;
        if (stats.water >= 0) {
            suffix = "ml";
            waterUnit = Number((waterUnit / 1).toFixed(3));
        }
        if (stats.water >= 1000) {
            suffix = "L";
            waterUnit = Number((waterUnit / 1000).toFixed(3));
        }
        if (stats.water >= 1000000) {
            suffix = "kL";
            waterUnit = Number((waterUnit / 1000000).toFixed(3));
        }
        ;
        return [waterUnit, suffix];
    }
};
var shop = {
    detectRequirements: function () {
        {
            if (shop.Spoon.detectRequirements() && !stats.shopSpoon.unlocked) {
                shop.Spoon.unlock();
            }
            if (shop.Cup.detectRequirements() && !stats.shopCup.unlocked) {
                shop.Cup.unlock();
            }
            if (shop.Bottle.detectRequirements() && !stats.shopBottle.unlocked) {
                shop.Bottle.unlock();
            }
            if (shop.Bucket.detectRequirements() && !stats.shopBucket.unlocked) {
                shop.Bucket.unlock();
            }
        }
        {
            if (shop.ReducedEvap.detectRequirements() && !stats.upgradeReducedEvap.unlocked) {
                shop.ReducedEvap.unlock();
            }
        }
        {
            if (shop.Map.detectRequirements() && !stats.shopMap.unlocked) {
                shop.Map.unlock();
            }
            if (shop.Swimsuit.detectRequirements() && !stats.shopSwimsuit.unlocked) {
                shop.Swimsuit.unlock();
            }
            if (shop.Desalinator.detectRequirements() && !stats.shopDesalinator.unlocked) {
                shop.Desalinator.unlock();
            }
            if (shop.TestTube.detectRequirements() && !stats.shopTestTube.unlocked) {
                shop.TestTube.unlock();
            }
        }
        {
            if (shop.BiggerSpoon.detectRequirements() && !stats.upgradeBiggerSpoon.unlocked) {
                shop.BiggerSpoon.unlock();
            }
            if (shop.ReinforcedSpoon.detectRequirements() && !stats.upgradeReinforcedSpoon.unlocked) {
                shop.ReinforcedSpoon.unlock();
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
    Spoon: {
        id: "Spoon",
        detectRequirements: function () {
            if (stats.water > 1)
                return true;
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
            graphics.renderShop();
        }
    },
    Swimsuit: {
        id: "Swimsuit",
        detectRequirements: function () {
            if (stats.shopMap.hasBought)
                return true;
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
            graphics.renderShop();
        }
    },
    Desalinator: {
        id: "Desalinator",
        detectRequirements: function () {
            if (stats.shopMap.hasBought)
                return true;
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
    achievements: ["AWateryStart"],
    achievementNames: ["A watery start"],
    achievementDescriptions: ["Collect a first drop of water"],
    achievementRequirements: [1],
    detectRequirements: function () {
        if (stats.water >= achievements.achievementRequirements[stats.achievements.unlocked]) {
            stats.achievements.unlocked++;
            console.log("New achievement unlocked!");
            notifications.add("New achievement unlocked");
        }
    }
};
var ocean = {};
var graphics = {
    render: function () {
        graphics.renderWater();
        graphics.renderNavigation();
        graphics.renderShop();
        graphics.renderUpgrades();
        graphics.renderOcean();
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
        if (stats.achievements.unlocked > 0)
            $("#navAchievements").show();
        if (stats.totalWater > 0)
            $("#navSettings").show();
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
        $("#upgradeReducedEvapLevel").text(shop.toRomanNumerals(stats.upgradeReducedEvap.level));
        $("#upgradeBiggerSpoonLevel").text(shop.toRomanNumerals(stats.upgradeBiggerSpoon.level));
        $("#upgradeReinforcedSpoonLevel").text(shop.toRomanNumerals(stats.upgradeReinforcedSpoon.level));
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
    }
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
                    unlocked: 0
                },
                ocean: {
                    unlocked: false,
                    diveUnlocked: false,
                    processorUnlocked: false
                },
                deep: {
                    deepestDive: 0,
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
                    currentPrice: 50,
                    level: 1
                },
                upgradeReinforcedSpoon: {
                    unlocked: false,
                    hasUnlocked: false,
                    hasBought: false,
                    currentPrice: 100,
                    level: 1
                }
            };
            init.game();
            console.log("Game resetted");
        }
    }
};
var config = {};
var init = {
    game: function () {
        init.stats();
        init.userInterface();
        init.controls();
        init.shop();
        init.upgrades();
        init.shopPurchase();
        init.upgradePurchase();
        init.notifications();
        init.ocean();
        init.save();
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        console.log("Game initialised!");
    },
    stats: function () {
        try {
            stats = JSON.parse(cache.getCookie("stats"));
        }
        catch (e) {
        }
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
        if (stats.achievements.unlocked == 0)
            $("#navAchieve").hide();
        if (stats.totalWater == 0)
            $("#navSettings").hide();
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
            });
            $("#navItems").click(function () {
                $("#pageHome").hide();
                $("#pageItems").show();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
            });
            $("#navUpgrades").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").show();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
            });
            $("#navDeep").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").show();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").hide();
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
            });
            $("#navAchieve").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").show();
                $("#pageSettings").hide();
            });
            $("#navSettings").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
                $("#pageSettings").show();
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
        $("#upgradeReducedEvapLevel").text(shop.toRomanNumerals(stats.upgradeReducedEvap.level));
        $("#upgradeBiggerSpoonLevel").text(shop.toRomanNumerals(stats.upgradeBiggerSpoon.level));
        $("#upgradeReinforcedSpoonLevel").text(shop.toRomanNumerals(stats.upgradeReinforcedSpoon.level));
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
        //Oceanic Zones
        $("#theSurface").hide();
        $("#theTwilightZone").hide();
        $("#theMidnightZone").hide();
        $("#theAbyssalZone").hide();
        $("#theHadalZone").hide();
        //Navigating
        $("#enterOcean").click(function () {
            $("#mainOcean").hide();
            $("#backpack").hide();
            $("#theDeepOcean").show();
            $("#oceanProcessor").hide();
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
    save: function () {
        {
            $("#save").click(save.save);
        }
        {
            $("#reset").click(save.reset);
        }
    }
};
init.game();
tick.tick();
// devTools.ruinthefun();
devTools.waterMulti(5);
// devTools.unlockOcean();
