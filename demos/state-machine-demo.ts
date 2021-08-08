/**
 * This is a state machine for a light
 *
 */

import { createMergedStream } from "../src/create-merged-stream";
import { randomStream } from "../src/utils";

export function* stateMachine(input) {}

async function* bus() {
  for await (const msg of createMergedStream(
    randomStream(),
    randomStream(),
    randomStream()
  )) {
    console.log(msg);
  }
}

stateMachine();
