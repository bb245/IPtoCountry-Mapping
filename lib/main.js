"use strict";

(function () {
    var ipident = require('./ipident');
    var ipidentInst = ipident.ipidentSingleton.getInstance()

    ipidentInst.startHttpd();

}).call(this)
