export interface ObservableStreamResult<T> {
  observableStream: () => AsyncGenerator<T>;
  observedCallback: (...args: any[]) => T;
}

export default function createAsyncGenFromCallback<T>(
  callback: (...args: any[]) => T
): ObservableStreamResult<T> {
  let promise: Promise<T>;
  let resolver: (l: T) => void;

  const createDeferredPromise = () => {
    promise = new Promise(function (resolve) {
      resolver = resolve;
    });
  };

  createDeferredPromise();

  const observedCallback = new Proxy(callback, {
    apply: function (target, thisArg, argumentsList) {
      const callbackResult = target.apply(thisArg, argumentsList);
      resolver(callbackResult);
      createDeferredPromise();
    },
  });

  async function* observableStream() {
    while (true) {
      const observation = await promise;
      yield observation;
    }
  }

  return {
    observableStream,
    observedCallback,
  };
}
