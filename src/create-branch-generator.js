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
export default function createBranchGenerator(source) {
  let promise = null;
  let resolvePromise = null;
  let renewPromise = () =>
    (promise = new Promise((resolve) => (resolvePromise = resolve)));

  async function* consume() {
    while (true) {
      const gift = await promise;
      yield gift;
    }
  }

  // there can only be one of these per source
  // that is why we invoke source
  async function produce() {
    renewPromise();
    for await (const msg of source()) {
      console.log('base > ' + msg);
      resolvePromise(msg);
      renewPromise();
    }
  }
  produce();

  return consume;
}
