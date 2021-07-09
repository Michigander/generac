async function delay(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

async function streamIntoBuffer(buffer, indexer, stream) {
  for await (const msg of stream) {
    buffer.push(msg);
    buffer.sort((a, b) => indexer(a) - indexer(b));
  }
}

function createOrderedBuffer(indexer, stream) {
  const buffer = [];
  streamIntoBuffer(buffer, indexer, stream);
  return buffer;
}

export async function* bufferStream(ms, indexer, stream) {
  const buffer = createOrderedBuffer(indexer, stream);

  while (true) {
    // allow for the buffer to grow and be sorted
    await delay(ms);

    if (buffer.length === 0) {
      // no messages accumulated
      continue;
    }

    yield buffer.shift();
  }
}
