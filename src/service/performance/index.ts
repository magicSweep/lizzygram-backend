import { PerformanceObserver, performance } from "perf_hooks";
import { debuglog } from "util";
import { Logger } from "winston";

/* OBSERVER SETUP */
let observer: PerformanceObserver;

export const init = (logger: Logger) => {
  observer = new PerformanceObserver((items) => {
    /* RESULT LOG */
    //const [measure] = items.getEntriesByName("My special benchmark");
    //console.log(measure);

    const measurements = items.getEntriesByType("measure");

    measurements.forEach((measurement) => {
      logger.log("info", `MEASUREMENT LOG`, {
        measurement,
      });
    });

    performance.clearMarks();
  });
  observer.observe({ entryTypes: ["measure"] });
};

export const mark = (name: string) => {
  performance.mark(name);
};

export const measure = (
  measureTitle: string,
  startMarkName: string,
  endMarkName: string
) => {
  performance.measure(measureTitle, startMarkName, endMarkName);
};
