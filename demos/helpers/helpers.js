export function randomInt(multiplier = 1000) {
  return Math.floor(Math.random() * multiplier);
}

export async function delay(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

export async function randomDelay(multiplier = 1000) {
  return await delay(randomInt(multiplier));
}

export async function* randomStream() {
  while (true) {
    yield await randomDelay();
  }
}

export async function* randomTimedStream(name, latencyMs = 5, lapMs = 25) {
  while (true) {
    const timestamp = Date.now();
    const latency = await delay(randomInt(latencyMs));
    console.log(`[${name}] : ${timestamp} : ${latency}`);
    yield { name, timestamp, latency };
    await delay(randomInt(lapMs));
  }
}

export async function* randomChannel(name) {
  for await (const value of randomStream()) {
    console.log(`[${name}] : ${value}`);
    yield { name, value };
  }
}

export async function* withIndexErrorLogging(indexer, stream) {
  let errors = 0;
  let correct = 0;
  let youngest = null;
  for await (const msg of stream) {
    const index = indexer(msg);
    if (!youngest) {
      youngest = index;
      correct = correct + 1;
    } else if (index < youngest) {
      youngest = index;
      errors = errors + 1;
      console.warn('error:younger!');
    } else {
      correct = correct + 1;
    }

    console.log(`[index-error] : ${errors} / ${errors + correct}`);
    yield msg;
  }
}
