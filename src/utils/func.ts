export const compose =
  <T>(...funcs: any[]) =>
  (val: T) =>
    funcs.reduce((acc, f) => {
      return f(acc);
    }, val);

export const cond = (conditions: any[][]) => (val?: any) => {
  for (let i = 0; i < conditions.length; i++) {
    if (conditions[i][0](val) === true) {
      return conditions[i][1](val);
    }
  }
};

export const elif =
  <T, U>(
    condFunc: (val: T) => boolean,
    ifFunc: (val: T) => U,
    elseFunc: (val: T) => U
  ) =>
  (val: T) => {
    if (condFunc(val) === true) {
      return ifFunc(val);
    } else {
      return elseFunc(val);
    }
  };

export const set = (prop: string, val: any) => (obj: any) => {
  if (typeof val === "function") {
    obj[prop] = val(obj);
  } else {
    obj[prop] = val;
  }

  //obj[prop] = val;

  return obj;
};

export const map =
  <T extends { map: any }>(f: any) =>
  (container: T) => {
    return container.map(f);
  };

export const tap = (f: any) => (data: any) => {
  f(data);
  return data;
};

export const chain = (f: any) => (container: any) => {
  return container.chain(f);
};

export const fold = (done: any, next: any) => (container: any) => {
  return container.fold(done, next);
};

export const flat = (f: any) => (container: any) => {
  return container.flat(f);
};

export const log = (tag: string) => (value: any) => {
  console.log(tag, value);
  return value;
};

export const mappedLog = (tag: string) => (value: any) => {
  console.log(tag, value.value);
  return value;
};

export const then = (f: any) => (thenable: any) => thenable.then(f);

export const _finally = (f: any) => (thenable: any) => thenable.finally(f);

export const _catch = (f: any) => (catchable: any) => catchable.catch(f);
