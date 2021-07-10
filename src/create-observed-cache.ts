import createBranchGenerator from "./create-branch-generator";
import { createObservableFromObj } from "./create-observed-object";

/**
 * Creates an observable object synchronized with local storage cache
 *
 * @param key - the key in local storage
 * @param defaultState - the data to use if nothing is cached yet
 * @returns - the object to mutate, and a subscription iterable
 */
export default function createLocalStorageObj(key: string, defaultState = {}) {
  const cachedState = localStorage.getItem(key);
  const initialState = cachedState ? JSON.parse(cachedState) : defaultState;
  console.log(`INITIAL: ${JSON.stringify(initialState)}`);

  const { data, observe } = createObservableFromObj(initialState);
  console.log(`data: ${JSON.stringify(initialState)}`);

  const subscribe = createBranchGenerator(observe());

  async function cache() {
    console.log(`[cache] cache started for ${key}`);
    for await (const update of subscribe()) {
      console.log(`[cache] caching ${key} : ${update}`);
      localStorage.setItem(key, JSON.stringify(update));
    }
  }
  cache();

  return { data, subscribe };
}
