/**
 * Shows an antipattern where two generators
 * compete for the production of a single source.
 */
import { randomChannel, randomDelay } from '../helpers/helpers.js';

const COMMAND_MS = 2000;

async function performCommand() {
  await randomDelay(COMMAND_MS);
  console.log('[my-command]');
}

const channel = randomChannel('my-channel');

async function competitor(name) {
  for await (const m of channel) {
    console.log(`[${name}] ${m.value}`);
    await performCommand();
  }
}

competitor(1);
competitor(2);
