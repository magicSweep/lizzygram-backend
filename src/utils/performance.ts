import { PerformanceObserver, performance } from "perf_hooks";

/* OBSERVER SETUP */
let observer: PerformanceObserver;

export const init = () => {
  observer = new PerformanceObserver((items) => {
    /* RESULT LOG */
    const [measure] = items.getEntriesByName("My special benchmark");
    console.log(measure);

    performance.clearMarks();
  });
  observer.observe({ entryTypes: ["measure"] });
};

export const start = () => {
  performance.mark("start");
};

export const end = () => {
  performance.mark("end");
  performance.measure("My special benchmark", "start", "end");
};
