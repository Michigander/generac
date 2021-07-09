import { createObservableFromObj } from '../src/create-observed-object.js';
import { randomStream } from './helpers/helpers.js';
import { combineStreams } from '../src/create-merged-stream.js';

const firstSource = createObservableFromObj({
  user: {
    name: null,
    email: null,
  },
});
const secondSource = randomStream;
setTimeout(() => (firstSource.data.user.name = 'g'), 2000);

async function* createLens(caster, ...streams) {
  const currentVector = [];
  for await (const msg of combineStreams(...streams)) {
    currentVector[msg.meta.index] = msg;
    yield caster(currentVector);
  }
}

async function demo() {
  const lens = ([first, second]) => ({ first, second });
  for await (const image of createLens(
    lens,
    firstSource.observe(),
    secondSource()
  )) {
    console.log(image);
  }
}

demo();
