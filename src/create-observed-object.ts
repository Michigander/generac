/**
 * Often many modules care about a piece of data
 * stored in memory.
 */
export function createObservableFromObj<DATA>(obj: DATA) {
  let promise: Promise<DATA>;
  let resolvePromise: (d: DATA) => void;
  let renewPromise = () =>
    (promise = new Promise((resolve) => (resolvePromise = resolve)));
  renewPromise();

  async function* observe() {
    yield obj;
    while (true) {
      const post = await promise;
      yield post;
    }
  }

  let currentPath: (string | number | symbol)[] = [];
  let currentTarget: any = obj;
  const handler = {
    set: (target: any, key: string | number | symbol, value: any) => {
      if (target !== currentTarget) {
        console.log("resetting");
        currentPath = [];
        currentTarget = target;
      }

      currentPath.push(key);

      console.log("Set " + currentPath.join(">") + " to " + value);

      target[key] = value;

      resolvePromise(obj);
      //   {
      //   path: [...currentPath],
      //   value,
      //   target: obj,
      // });

      renewPromise();
      currentPath = [];
      return true;
    },
    get: (target: any, key: string | number | symbol): any => {
      if (target !== currentTarget) {
        console.log("resetting");
        currentPath = [];
        currentTarget = target;
      }

      currentPath.push(key);
      currentTarget = target[key];

      console.log("Got " + currentPath.join(">"));
      const value = target[key];

      if (typeof value === "object" && value !== null && value !== undefined) {
        console.log("KEEP GETTING " + currentPath.join(">"));
        return new Proxy(value, handler);
      }

      console.log("DONE GETTING " + currentPath.join(">"));
      currentPath = [];
      return value;
    },
  };

  return {
    data: new Proxy(obj, handler),
    observe,
  };
}
