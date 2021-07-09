import { bufferStream } from '../src/buffered-stream.js';
import { combineStreams } from '../src/combine-streams.js';
import {
  randomTimedStream,
  withIndexErrorLogging,
} from '../helpers/helpers.js';

const BUFFER_FLUSH_MS = 5;
const LATENCY_MS = 5;
const LAP_MS = 25;

const getTimeFromMsg = (msg) => msg.value.timestamp;

async function bufferDemo() {
  const combinedStream = combineStreams(
    randomTimedStream('a', LATENCY_MS, LAP_MS),
    randomTimedStream('b', LATENCY_MS, LAP_MS)
  );

  const combinedBufferedStream = bufferStream(
    BUFFER_FLUSH_MS,
    getTimeFromMsg,
    combinedStream
  );

  for await (const msg of withIndexErrorLogging(
    getTimeFromMsg,
    combinedBufferedStream
  )) {
    console.log(`[c] ${msg.value.timestamp}`);
  }
}

bufferDemo();
