export interface Message {}

export type Indexer<T> = (d: T) => number;

export async function delay(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

export function randomInt(multiplier = 1000) {
  return Math.floor(Math.random() * multiplier);
}

export async function randomDelay(multiplier = 1000): Promise<number> {
  return await delay(randomInt(multiplier));
}

export async function* randomStream(): AsyncGenerator<number> {
  while (true) {
    yield await randomDelay();
  }
}

export interface TimeMsg {
  name: string;
  timestamp: number;
  latency: unknown;
}
export async function* randomTimedStream(
  name: string,
  latencyMs = 5,
  lapMs = 25
): AsyncGenerator<TimeMsg> {
  while (true) {
    const timestamp = Date.now();
    const latency = await delay(randomInt(latencyMs));
    console.log(`[${name}] : ${timestamp} : ${latency}`);
    yield { name, timestamp, latency };
    await delay(randomInt(lapMs));
  }
}

export async function* randomChannel(name: string) {
  for await (const value of randomStream()) {
    console.log(`[${name}] : ${value}`);
    yield { name, value };
  }
}

export async function* withIndexErrorLogging<T>(
  indexer: Indexer<T>,
  stream: AsyncGenerator<T>
): AsyncGenerator<T> {
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
      console.warn("error:younger!");
    } else {
      correct = correct + 1;
    }

    console.log(`[index-error] : ${errors} / ${errors + correct}`);
    yield msg;
  }
}
