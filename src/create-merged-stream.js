async function takeLap(stream, index) {
  const value = await stream.next();
  return { value, index, stream };
}

export async function* combineStreams(...streams) {
  const runners = streams.map(takeLap);
  while (true) {
    const { value, index, stream } = await Promise.race(runners);
    runners[index] = takeLap(stream, index);
    yield { meta: { index }, value };
  }
}
