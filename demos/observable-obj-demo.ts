import { createObservableFromObj } from "../src/create-observed-object.js";

const { data, observe } = createObservableFromObj({
  a: { b: { c: { d: 3 } } },
});

// consumption of changes
async function consume(name: string) {
  for await (const msg of observe()) {
    console.log(name + " : " + JSON.stringify(msg));
  }
}

consume("rick");
consume("morty");

// trigger some changes
data.a.b;
data.a.b.c.d = 5;
