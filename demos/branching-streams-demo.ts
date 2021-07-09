/**
 * Sharing the output of a stream across multiple iterables.
 *
 * []
 *  |---> []
 *  |-------------> []
 *  |------> []
 */

import createBranchGenerator from "../src/create-branch-generator.js";
import { randomStream } from "../src/utils.js";

// API
const branchGenerator = createBranchGenerator(randomStream());

async function createBranch(
  branchGenerator: () => AsyncGenerator,
  logPrefix = "consumer"
) {
  console.log("branching...");
  for await (const msg of branchGenerator()) {
    console.log(logPrefix + " > " + msg);
  }
}

createBranch(branchGenerator, "rick");
setTimeout(() => createBranch(branchGenerator, "morty (late)"), 2000);
