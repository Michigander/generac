import { createObservableFromObj } from "../src/create-observed-object.js";
import { createSelector } from "../src/create-selector.js";
import { Message, randomStream } from "../src/utils.js";

const firstSource = createObservableFromObj({
  user: {
    name: null,
    email: null,
  },
});

const secondSource = randomStream;

setTimeout(() => (firstSource.data.user.name = "g"), 2000);

async function demo() {
  const selector = (messages: Message[]) => ({
    first: messages[0],
    second: messages[1],
  });

  for await (const image of createSelector(
    selector,
    firstSource.observe(),
    secondSource()
  )) {
    console.log(image);
  }
}

demo();
