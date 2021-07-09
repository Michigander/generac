import { createObservableFromObj } from '../src/create-observed-object.js';

const { data, observe } = createObservableFromObj({
  cart: [],
});

async function cache() {
  for await (const snapshot of observe()) {
    console.log(`caching >> ${JSON.stringify(snapshot.target)}`);
  }
}
cache();

data.cart.push(1);
setTimeout(() => {
  data.cart.push(2);
}, 1000);
