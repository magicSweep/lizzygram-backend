import { PerformanceObserver, performance } from "perf_hooks";
import { debuglog } from "util";

/* OBSERVER SETUP */
let observer: PerformanceObserver;

export const init = () => {
  observer = new PerformanceObserver((items) => {
    /* RESULT LOG */
    //const [measure] = items.getEntriesByName("My special benchmark");
    //console.log(measure);

    const measurements = items.getEntriesByType("measure");

    measurements.forEach((measurement) => {
      console.log(`--------------${measurement.name}--------------`);
      console.log(measurement);
      console.log("----------------------------");
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
