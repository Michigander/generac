import { createObservableFromObj } from '../src/create-observed-object.js';
import { randomStream } from './helpers/helpers.js';
import { createLens } from '../src/create-lens.js';

const firstSource = createObservableFromObj({
  user: {
    name: null,
    email: null,
  },
});
const secondSource = randomStream;
setTimeout(() => (firstSource.data.user.name = 'g'), 2000);

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
