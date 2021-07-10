/**
 * Sharing the output of a stream across multiple iterables.
 *
 * []
 *  |---> []
 *  |-------------> []
 *  |------> []
 */

/**
 * Produces a branch generator for a given source.
 *
 * @note A branch generator will produce messages from the time
 * it is consumed. This may be some time after the root generator
 * has started producing messages.
 * @note There can be only ONE branch generator per root generation
 *
 * @todo Define methods to control when the root generator is started
 * @todo Define methods of bootstrapping from root generator start
 */
export default function createBranchGenerator<T>(
  source: AsyncGenerator<T>
): () => AsyncGenerator<T> {
  let last: T;
  let promise: Promise<T>;
  let resolvePromise: (value: T) => void;
  let renewPromise = () =>
    (promise = new Promise((resolve) => (resolvePromise = resolve)));

  async function* consume() {
    if (last) {
      // @todo add ability to bootstrap from full history
      yield last;
    }

    while (true) {
      const next = await promise;
      yield next;
    }
  }

  // there can only be one of these per source
  // that is why we invoke source
  async function produce() {
    renewPromise();
    for await (const msg of source) {
      console.log("base > " + msg);
      resolvePromise(msg);
      renewPromise();
    }
  }
  produce();

  return consume;
}
