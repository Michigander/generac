import { bufferStream } from "../src/create-buffered-stream.js";
import {
  createMergedStream,
  MetadataWrapped,
} from "../src/create-merged-stream.js";
import {
  randomTimedStream,
  TimeMsg,
  withIndexErrorLogging,
} from "../src/utils.js";

const BUFFER_FLUSH_MS = 5;
const LATENCY_MS = 5;
const LAP_MS = 25;

const getTimeFromMsg = (msg: MetadataWrapped<TimeMsg>) => msg.value.timestamp;

async function bufferDemo() {
  const combinedStream = createMergedStream(
    randomTimedStream("a", LATENCY_MS, LAP_MS),
    randomTimedStream("b", LATENCY_MS, LAP_MS)
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
