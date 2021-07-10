import { delay } from "./utils";

export interface MetadataWrapped<T> {
  meta: {
    index: number;
    stream: AsyncGenerator<T>;
    done: boolean;
  };
  value: T;
}

async function takeLap<T>(
  stream: AsyncGenerator<T>,
  index: number
): Promise<MetadataWrapped<T>> {
  const { done, value } = await stream.next();
  return { value, meta: { index, stream, done: done ?? false } };
}

export async function* createMergedStream<T>(
  ...streams: AsyncGenerator<T>[]
): AsyncGenerator<MetadataWrapped<T>> {
  const runners = streams.map(takeLap);
  while (true) {
    const winner = await Promise.race(runners.filter(Boolean));
    if (winner.meta.done) {
      //@ts-ignore
      runners[winner.meta.index] = undefined;
      continue;
    }

    runners[winner.meta.index] = takeLap(winner.meta.stream, winner.meta.index);
    yield winner;
  }
}
