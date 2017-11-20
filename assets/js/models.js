var models = function () {
    var MODELS = require("../../config/models.json");
    (function () {
        MODELS.models.json = {};
        MODELS.models.forEach(eitem => {
            MODELS.models.json[eitem.value] = eitem
    })
    })();
    return MODELS;
};

module.exports = models;