/**
 * Sharing the output of a stream across multiple iterables.
 *
 * []
 *  |---> []
 *  |-------------> []
 *  |------> []
 */
import { randomStream } from '../helpers/helpers.js';
import getBranchGen from '../src/create-branch-generator.js';

// API
const branchGenerator = getBranchGen(randomStream);

async function createBranch(branchGenerator, logPrefix = 'consumer') {
  console.log('branching...');
  for await (const msg of branchGenerator()) {
    console.log(logPrefix + ' > ' + msg);
  }
}

createBranch(branchGenerator, 'rick');
setTimeout(() => createBranch(branchGenerator, 'morty (late)'), 2000);
