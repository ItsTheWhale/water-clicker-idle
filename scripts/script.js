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
    unlockedLab: false
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
    itemItems: ["spoon", "cup"],
    itemName: ["Spoon", "Cup"],
    shopRequirements: [1, 50],
    upgradeItems: ["reducedEvap1", "reducedEvap2"],
    upgradeName: ["Reduced Evaporation I", "Reduced Evaporation II"],
    upgradeRequirements: [1, 50],
    detectRequirements: function () {
        if (stats.water >= shop.shopRequirements[stats.unlockedShopItems]) {
            stats.unlockedShopItems++;
            console.log("New shop item unlocked!");
        }
        if (stats.water >= shop.upgradeRequirements[stats.unlockedUpgradeItems]) {
            stats.unlockedUpgradeItems++;
            console.log("New upgrade item unlocked!");
        }
    },
    createItem: function () { }
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
    }
};
var save = {
    autosaveTimeout: 0,
    autosaveTimer: 0,
    autoSave: function () {
        cache.setCookie("water", String(stats.water), 365, "/");
        cache.setCookie("clicks", String(stats.clicks), 365, "/");
    }
};
var init = {
    game: function () {
        init.stats();
        init.userInterface();
        init.controls();
        save.autosaveTimeout = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        console.log("Game initialised!");
    },
    stats: function () {
        stats.water = Number(cache.getCookie("water"));
        stats.clicks = Number(cache.getCookie("clicks"));
    },
    userInterface: function () {
        $("#pageHome").show();
        $("#pageItems").hide();
        $("#pageUpgrades").hide();
        $("#pageDeep").hide();
        $("#pageLab").hide();
        $("#pageAchieve").hide();
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
            });
            $("#navItems").click(function () {
                $("#pageHome").hide();
                $("#pageItems").show();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
            });
            $("#navUpgrades").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").show();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
            });
            $("#navDeep").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").show();
                $("#pageLab").hide();
                $("#pageAchieve").hide();
            });
            $("#navLab").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").show();
                $("#pageAchieve").hide();
            });
            $("#navAchieve").click(function () {
                $("#pageHome").hide();
                $("#pageItems").hide();
                $("#pageUpgrades").hide();
                $("#pageDeep").hide();
                $("#pageLab").hide();
                $("#pageAchieve").show();
            });
        }
    }
};
init.game();
