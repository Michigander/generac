# JS Generator Patterns

This is a collection of utilities for building systems based on asynchronous iterables.

## Included

- **merging** - merge multiple streams into a single iterable
- **branching** - allows multiple consumers for the same iterable
- **buffering** - combine streams with a time buffer to help ensure correct order
- **accumulators** - stream data that is an accumulation function over multiple sources
- **mutation observer** - stream in memory obsject mutations

## Todos & Ideas

- bootstrapping
- create callback stream
- separate out the recursive proxy
- state machines
- all utilities should satisfy a common message interface
- transition to typescript
- build demo UI using lit-html async iterable template support
- extract the wait for promise pattern
- better define the division between generator functions and their returned objects in these utilities - for example, when should a utility take functions over objects? when should a utility call a passed function? return a function or an object?
