export interface MetadataWrapped<T> {
  meta: {
    index: number;
    stream: AsyncGenerator<T>;
  };
  value: T;
}

async function takeLap<T>(
  stream: AsyncGenerator<T>,
  index: number
): Promise<MetadataWrapped<T>> {
  const { done: _done, value } = await stream.next();
  return { value, meta: { index, stream } };
}

export async function* createMergedStream<T>(
  ...streams: AsyncGenerator<T>[]
): AsyncGenerator<MetadataWrapped<T>> {
  const runners = streams.map(takeLap);
  while (true) {
    const winner = await Promise.race(runners);
    runners[winner.meta.index] = takeLap(winner.meta.stream, winner.meta.index);
    yield winner;
  }
}
