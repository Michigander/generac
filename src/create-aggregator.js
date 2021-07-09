import { combineStreams } from './create-merged-stream.js';

export async function* createAggregator(selector, ...streams) {
  const currentVector = [];
  for await (const msg of combineStreams(...streams)) {
    currentVector[msg.meta.index] = msg;
    yield selector(currentVector);
  }
}
