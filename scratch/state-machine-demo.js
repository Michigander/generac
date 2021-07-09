const inputMessageTypes = {
  driverSwapped: 'driverSwapped',
  driverLeft: 'driverLeft',
  driverSeated: 'driverSeated',
  missionStarted: 'missionStarted',
  missionPaused: 'missionPaused',
  missionResumed: 'missionResumed',
  missionEnded: 'missionEnded',
}

const stateTypes = {
  running: 'running',
  stopped: 'stopped',
};

const messageTypes = {
  switched: 'switched',
  ended: 'ended',
  started: 'started',
};

const data = {
  state: state.stopped,
  runType: null,
};

const transitions = {
  [messageTypes.ended]: () => ({
    state: stateTypes.stopped,
    runType: null,
  }),
  [messageTypes.started]: ({ message }) => ({
    state: stateTypes.running,
    runType: message.payload.runType,
  }),
  [messageTypes.switched]: ({ message }) => ({
    state: stateTypes.running,
    runType: message.payload.runType,
  }),
};

async function something() {
  await something()
  something()
} 

async function * machine(inputs, data = {}) {
  const reaction = await nextReaction(inputs)
  const data = transitions[reaction.type](reaction, data);
  yield data;
  yield * machine(inputs, data)
}

async function * reactions() {
  for await (const inputMsg of inputs) {
    switch (inputMsg.type) {
      case inputMessageTypes.driverLeft:
        if ()
    }
  }
}

machine(stream, )