import { delay, Indexer } from "./utils.js";

async function streamIntoBuffer<T>(
  buffer: T[],
  indexer: Indexer<T>,
  stream: AsyncGenerator<T>
) {
  for await (const msg of stream) {
    buffer.push(msg);
    buffer.sort((a, b) => indexer(a) - indexer(b));
  }
}

function createOrderedBuffer<T>(
  indexer: Indexer<T>,
  stream: AsyncGenerator<T>
) {
  const buffer: T[] = [];
  streamIntoBuffer(buffer, indexer, stream);
  return buffer;
}

export async function* bufferStream<T>(
  ms: number,
  indexer: Indexer<T>,
  stream: AsyncGenerator<T>
) {
  const buffer = createOrderedBuffer(indexer, stream);

  while (true) {
    // allow for the buffer to grow and be sorted>
    await delay(ms);

    if (buffer.length === 0) {
      // no messages accumulated
      continue;
    }

    yield buffer.shift() as T;
  }
}
