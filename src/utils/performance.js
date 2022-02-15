"use strict";
exports.__esModule = true;
exports.measure = exports.mark = exports.init = void 0;
var perf_hooks_1 = require("perf_hooks");
/* OBSERVER SETUP */
var observer;
var init = function () {
    observer = new perf_hooks_1.PerformanceObserver(function (items) {
        /* RESULT LOG */
        //const [measure] = items.getEntriesByName("My special benchmark");
        //console.log(measure);
        var measurements = items.getEntriesByType("measure");
        measurements.forEach(function (measurement) {
            console.log("--------------".concat(measurement.name, "--------------"));
            console.log(measurement);
            console.log("----------------------------");
        });
        perf_hooks_1.performance.clearMarks();
    });
    observer.observe({ entryTypes: ["measure"] });
};
exports.init = init;
var mark = function (name) {
    perf_hooks_1.performance.mark(name);
};
exports.mark = mark;
var measure = function (measureTitle, startMarkName, endMarkName) {
    perf_hooks_1.performance.measure(measureTitle, startMarkName, endMarkName);
};
exports.measure = measure;
