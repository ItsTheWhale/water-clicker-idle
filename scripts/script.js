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
    ruinthefun: function () {
        devTools.setWater(9999999999999999);
        devTools.waterMulti(99);
        console.log("DEVTOOLS: ruinthefun");
    }
};
var gameConstants = {
    itemPriceIncrement: 1.2,
    autosaveTimer: 300000
};
var stats = {
    water: 0,
    clicks: 0,
    wpt: 0,
    totalWater: 0,
    waterMulti: 1,
    clickMulti: 1,
    unlockedShopItems: 0,
    unlockedUpgradeItems: 0,
    unlockedAchievements: 0,
    ocean: {
        unlocked: false
    },
    lab: {
        unlocked: false
    },
    shopSpoon: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 10
    },
    shopCup: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 50
    },
    shopBucket: {
        unlocked: false,
        hasBought: false,
        bought: 0,
        currentPrice: 100
    },
    shopMap: {
        unlocked: false,
        hasBought: false,
        currentPrice: 1000
    },
    shopTestTube: {
        unlocked: false,
        hasBought: false,
        currentPrice: 50000
    },
    upgradeReducedEvap1: {
        unlocked: false,
        hasBought: false,
        currentPrice: 50
    },
    upgradeReducedEvap2: {
        unlocked: false,
        hasBought: false,
        curentPrice: 100
    },
    upgradeBiggerSpoon: {
        unlocked: false,
        hasBought: false,
        currentPrice: 50
    },
    upgradeReinforcedSpoon: {
        unlocked: false,
        hasBought: false,
        currentPrice: 100
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
var shop = {
    itemIDs: ["Spoon", "Cup", "Bucket"],
    itemName: ["Spoon", "Cup", "Bucket"],
    shopRequirements: [1, 50, 100],
    specialItems: {
        Map: {
            id: "Map",
            detectRequirements: function () {
                if (stats.totalWater > 0)
                    return true;
            },
            unlock: function () {
                stats.shopMap.unlocked = true;
                console.log("A Dusty Map unlocked!");
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
        }
    },
    upgradeIDs: ["ReducedEvap1", "ReducedEvap2"],
    upgradeName: ["Reduced Evaporation I", "Reduced Evaporation II"],
    specialUpgrades: {
        BiggerSpoon: {
            detectRequirements: function () {
                if (stats.shopSpoon.bought >= 1)
                    return true;
            }
        },
        ReinforcedSpoon: {
            detectRequirements: function () {
                if (stats.shopSpoon.bought >= 5)
                    return true;
            }
        }
    },
    upgradeRequirements: [1, 50, 100],
    detectRequirements: function () {
        try {
            if (stats.water >= shop.shopRequirements[stats.unlockedShopItems]) {
                shop.unlockShopItem();
                stats.unlockedShopItems++;
                console.log("New shop item unlocked!");
            }
            if (stats.water >= shop.upgradeRequirements[stats.unlockedUpgradeItems]) {
                shop.unlockUpgradeItem();
                stats.unlockedUpgradeItems++;
                console.log("New upgrade item unlocked!");
            }
            {
                if (shop.specialItems.Map.detectRequirements() && !stats.shopMap.unlocked) {
                    shop.specialItems.Map.unlock();
                }
                if (shop.specialItems.TestTube.detectRequirements() && !stats.shopTestTube.unlocked) {
                    shop.specialItems.TestTube.unlock();
                }
            }
        }
        catch (e) { }
        ;
    },
    unlockShopItem: function () {
        eval("stats.shop".concat(shop.itemIDs[stats.unlockedShopItems], ".unlocked = true;"));
        graphics.renderShop();
    },
    unlockSpecialShopItem: function () {
    },
    unlockUpgradeItem: function () {
        eval("stats.upgrade".concat(shop.upgradeIDs[stats.unlockedUpgradeItems], ".unlocked = true;"));
        graphics.renderUpgrades();
    },
    unlockSpecialUpgradeItem: function () {
    },
    Spoon: {
        purchase: function () {
            if (stats.water < stats.shopSpoon.currentPrice)
                return;
            if (!stats.shopSpoon.hasBought)
                stats.shopSpoon.hasBought = true;
            stats.shopSpoon.bought++;
            stats.water -= stats.shopSpoon.currentPrice;
            stats.wpt += 0.1;
            stats.shopSpoon.currentPrice = Math.ceil(stats.shopSpoon.currentPrice * gameConstants.itemPriceIncrement);
            graphics.renderShop();
        }
    },
    Cup: {
        purchase: function () {
            if (stats.water < stats.shopCup.currentPrice)
                return;
            if (!stats.shopCup.hasBought)
                stats.shopCup.hasBought = true;
            stats.shopCup.bought++;
            stats.water -= stats.shopCup.currentPrice;
            stats.wpt += 0.5;
            stats.shopCup.currentPrice = Math.ceil(stats.shopCup.currentPrice * gameConstants.itemPriceIncrement);
            graphics.renderShop();
        }
    },
    Bucket: {
        purchase: function () {
            if (stats.water < stats.shopBucket.currentPrice)
                return;
            if (!stats.shopBucket.hasBought)
                stats.shopBucket.hasBought = true;
            stats.shopBucket.bought++;
            stats.water -= stats.shopBucket.currentPrice;
            stats.wpt += 2;
            stats.shopBucket.currentPrice = Math.ceil(stats.shopBucket.currentPrice * gameConstants.itemPriceIncrement);
            graphics.renderShop();
        }
    },
    Map: {},
    TestTube: {},
    ReducedEvap1: {},
    ReducedEvap2: {},
    BiggerSpoon: {},
    ReinforcedSpoon: {}
};
var achievements = {
    achievements: ["AWateryStart"],
    achievementNames: ["A watery start"],
    achievementDescriptions: ["Collect a first drop of water"],
    achievementRequirements: [1],
    detectRequirements: function () {
        if (stats.water >= achievements.achievementRequirements[stats.unlockedAchievements]) {
            stats.unlockedAchievements++;
            console.log("New achievement unlocked!");
        }
    }
};
var graphics = {
    render: function () {
        graphics.renderClicks();
        graphics.renderNavigation();
    },
    renderClicks: function () {
        $("#waterAmount").html("".concat(Math.floor(stats.water), " ml water"));
    },
    renderNavigation: function () {
        if (stats.totalWater > 0)
            $("#navHome").show();
        if (stats.unlockedShopItems > 0)
            $("#navItems").show();
        if (stats.unlockedUpgradeItems > 0)
            $("#navUpgrades").show();
        if (stats.ocean.unlocked)
            $("#navDeep").show();
        if (stats.lab.unlocked)
            $("#navLab").show();
        if (stats.unlockedAchievements > 0)
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
        if (stats.shopBucket.unlocked)
            $("#shopBucket").show();
        if (stats.shopMap.unlocked)
            $("#shopMap").show();
        if (stats.shopTestTube.unlocked)
            $("#shopTestTube").show();
        $("#shopSpoonAmount").text(String(stats.shopSpoon.bought));
        $("#shopCupAmount").text(String(stats.shopCup.bought));
        $("#shopBucketAmount").text(String(stats.shopBucket.bought));
        //Render Price
        $("#shopSpoonPrice").text(String(stats.shopSpoon.currentPrice));
        $("#shopCupPrice").text(String(stats.shopCup.currentPrice));
        $("#shopBucketPrice").text(String(stats.shopBucket.currentPrice));
    },
    renderUpgrades: function () {
        if (stats.upgradeReducedEvap1.unlocked)
            $("#upgradeReducedEvap1").show();
        if (stats.upgradeReducedEvap2.unlocked)
            $("#upgradeReducedEvap2").show();
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
        $("#notifications-container").append("<div id=\"notification".concat(notifications.notifications.length, "\"class=\"notification\" style=\"opacity:1\">").concat(notifications.notifications[notifications.notifications.length - 1], "</div>"));
        if (notifications.notifications.length > 15) {
            notifications.notifications.shift();
            notifications.notificationsLifespan.shift();
            for (var i = 0; i < notifications.notifications.length; i++) {
                $("#notification".concat(i + 2)).attr("id", "notification".concat(i + 1));
            }
            $("#notification1").hide();
        }
    }
};
var tick = {
    tickTimeout: 0,
    tick: function () {
        stats.water += stats.wpt * stats.waterMulti;
        stats.totalWater += stats.wpt * stats.waterMulti;
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
        if (stats.unlockedShopItems == 0)
            $("#navItems").hide();
        if (stats.unlockedUpgradeItems == 0)
            $("#navUpgrades").hide();
        if (!stats.ocean.unlocked)
            $("#navDeep").hide();
        if (!stats.lab.unlocked)
            $("#navLab").hide();
        if (stats.unlockedAchievements == 0)
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
        {
            $("#save").click(function () {
                cache.setCookie("stats", JSON.stringify(stats), 365, '/');
                console.log("Saved!");
            });
        }
    },
    shop: function () {
        if (!stats.shopSpoon.unlocked)
            $("#shopSpoon").hide();
        if (!stats.shopCup.unlocked)
            $("#shopCup").hide();
        if (!stats.shopBucket.unlocked)
            $("#shopBucket").hide();
        if (!stats.shopMap.unlocked || stats.shopMap.hasBought)
            $("#shopMap").hide();
        if (!stats.shopTestTube.unlocked || stats.shopTestTube.hasBought)
            $("#shopTestTube").hide();
    },
    upgrades: function () {
        if (!stats.upgradeReducedEvap1.unlocked)
            $("#upgradeReducedEvap1").hide();
        if (!stats.upgradeReducedEvap2.unlocked)
            $("#upgradeReducedEvap2").hide();
        if (!stats.upgradeBiggerSpoon.unlocked)
            $("#upgradeBiggerSpoon1").hide();
        if (!stats.upgradeReinforcedSpoon.unlocked)
            $("#upgradeReinforcedSpoon1").hide();
    },
    shopPurchase: function () {
        $("#shopSpoon").click(shop.Spoon.purchase);
        $("#shopCup").click(shop.Cup.purchase);
        $("#shopBucket").click(shop.Bucket.purchase);
    },
    upgradePurchase: function () { },
    notifications: function () {
        notifications.renderNotifications();
    }
};
init.game();
tick.tick();
// devTools.ruinthefun();
// devTools.waterMulti(5);
