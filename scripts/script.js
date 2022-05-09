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
        devTools.setWater(99999);
        devTools.waterMulti(99);
        console.log("DEVTOOLS: ruinthefun");
    }
};
var gameConstants = {
    autosaveTimer: 300000
};
var stats = {
    water: 0,
    clicks: 0,
    totalWater: 0,
    waterMulti: 1,
    unlockedShopItems: 0,
    unlockedUpgradeItems: 0,
    unlockedAchievements: 0,
    unlockedOcean: false,
    unlockedLab: false,
    shopSpoonUnlocked: false,
    shopCupUnlocked: false,
    shopBucketUnlocked: false,
    shopMapUnlocked: false,
    shopTestTubeUnlocked: false,
    shopSpoonBought: false,
    shopCupBought: false,
    shopBucketBought: false,
    shopMapBought: false,
    shopTestTubeBought: false,
    upgradeReducedEvap1Unlocked: false,
    upgradeReducedEvap2Unlocked: false,
    upgradeReducedEvap1Bought: false,
    upgradeReducedEvap2Bought: false
};
var tempStats = {
    currentPage: "pageHome",
    currentPageId: 0
};
var input = {
    click: function () {
        stats.water += stats.waterMulti;
        stats.totalWater += stats.waterMulti;
        stats.clicks++;
        shop.detectRequirements();
        achievements.detectRequirements();
        graphics.render();
    }
};
var shop = {
    itemIDs: ["spoon", "cup", "bucket"],
    itemName: ["Spoon", "Cup", "Bucket"],
    shopRequirements: [1, 50, 100],
    specialItemIDs: ["map", "testTube"],
    specialItemNames: ["A Dusty Map", "A Test Tube"],
    specialItemRequirements: [1000, 50000],
    upgradeIDs: ["reducedEvap1", "reducedEvap2"],
    upgradeName: ["Reduced Evaporation I", "Reduced Evaporation II"],
    upgradeRequirements: [1, 50, 100],
    detectRequirements: function () {
        if (stats.water >= shop.shopRequirements[stats.unlockedShopItems]) {
            stats.unlockedShopItems++;
            shop.unlockShopItem();
            console.log("New shop item unlocked!");
        }
        if (stats.water >= shop.upgradeRequirements[stats.unlockedUpgradeItems]) {
            stats.unlockedUpgradeItems++;
            shop.unlockUpgradeItem();
            console.log("New upgrade item unlocked!");
        }
    },
    unlockShopItem: function () {
        console.log(shop.itemIDs[stats.unlockedShopItems]);
        graphics.renderShop();
    },
    unlockUpgradeItem: function () {
        console.log(shop.itemIDs[stats.unlockedShopItems]);
        graphics.renderUpgrades();
    }
};
var achievements = {
    achievements: ["aWateryStart"],
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
        $("#waterAmount").html("".concat(stats.water, " ml water"));
    },
    renderNavigation: function () {
        if (stats.totalWater > 0)
            $("#navHome").show();
        if (stats.unlockedShopItems > 0)
            $("#navItems").show();
        if (stats.unlockedUpgradeItems > 0)
            $("#navUpgrades").show();
        if (stats.unlockedOcean)
            $("#navDeep").show();
        if (stats.unlockedLab)
            $("#navLab").show();
        if (stats.unlockedAchievements > 0)
            $("#navAchievements").show();
    },
    renderShop: function () {
        if (stats.shopSpoonUnlocked)
            $("#shopSpoon").show();
        ;
        if (stats.shopCupUnlocked)
            $("#shopCup").show();
        if (stats.shopBucketUnlocked)
            $("#shopBucket").show();
        if (stats.shopMapUnlocked)
            $("#shopMap").show();
        if (stats.shopTestTubeUnlocked)
            $("#shopTestTube").show();
    },
    renderUpgrades: function () { }
};
var save = {
    autosaveTimeout: 0,
    autosaveTimer: 0,
    autoSave: function () {
        cache.setCookie("stats", JSON.stringify(stats), 365, '/');
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
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
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        console.log("Game initialised!");
    },
    stats: function () {
        stats = JSON.parse(cache.getCookie("stats"));
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
        if (!stats.unlockedOcean)
            $("#navDeep").hide();
        if (!stats.unlockedLab)
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
    },
    shop: function () {
        if (!stats.shopSpoonUnlocked)
            $("#shopSpoon").hide();
        if (!stats.shopCupUnlocked)
            $("#shopCup").hide();
        if (!stats.shopBucketUnlocked)
            $("#shopBucket").hide();
        if (!stats.shopMapUnlocked)
            $("#shopMap").hide();
        if (!stats.shopTestTubeUnlocked)
            $("#shopTestTube").hide();
    },
    upgrades: function () {
        if (!stats.upgradeReducedEvap1Unlocked)
            $("#upgradeReducedEvap1").hide();
        if (!stats.upgradeReducedEvap2Unlocked)
            $("#upgradeReducedEvap2").hide();
    }
};
init.game();
// devTools.ruinthefun();
devTools.waterMulti(5);
