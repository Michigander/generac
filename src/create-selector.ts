import { createMergedStream } from "./create-merged-stream.js";
import { Message } from "./utils.js";

type Selector<T> = (inputs: Array<Message>) => T;
export async function* createSelector<SELECTION>(
  selector: Selector<SELECTION>,
  ...streams: AsyncGenerator[]
) {
  const currentVector = [];
  for await (const msg of createMergedStream(...streams)) {
    currentVector[msg.meta.index] = msg;
    yield selector(currentVector);
  }
}
