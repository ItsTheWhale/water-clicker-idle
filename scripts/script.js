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
    shopRequirements: [0, 50],
    upgradeRequirements: [0, 50],
    autosaveTimer: 300000
};
var stats = {
    water: 0,
    clicks: 0,
    waterMulti: 1,
    unlockedShopItems: 0,
    unlockedUpgradeItems: 0
};
var input = {
    click: function () {
        stats.water += stats.waterMulti;
        stats.clicks++;
        graphics.render();
        shop.detectRequirements();
    }
};
var shop = {
    itemItems: ["spoon", "cup"],
    upgradeItems: ["reducedEvap1", "reducedEvap2"],
    itemName: ["Spoon", "Cup"],
    upgradeName: ["Reduced Evaporation I", "Reduced Evaporation II"],
    detectRequirements: function () {
        if (stats.water >= gameConstants.shopRequirements[stats.unlockedShopItems]) {
            stats.unlockedShopItems++;
            console.log("New shop item unlocked!");
        }
        if (stats.water >= gameConstants.upgradeRequirements[stats.unlockedUpgradeItems]) {
            stats.unlockedUpgradeItems++;
            console.log("New upgrade item unlocked!");
        }
    },
    createItem: function () { }
};
var graphics = {
    render: function () {
        graphics.renderClicks();
    },
    renderClicks: function () {
        $("waterAmount").html("".concat(stats.water, " ml water"));
    }
};
var save = {
    autosaveTimer: null,
    autoSave: function () {
        cache.setCookie("water", String(stats.water), 365, "/");
        cache.setCookie("clicks", String(stats.clicks), 365, "/");
    }
};
var init = {
    game: function () {
        init.stats;
        save.autosaveTimer = window.setTimeout(save.autoSave, gameConstants.autosaveTimer);
        $("#clickMe").click(input.click);
        console.log("Game initialised!");
    },
    stats: function () {
        stats.water = Number(cache.getCookie("water"));
        stats.clicks = Number(cache.getCookie("clicks"));
    }
};
init.game();
