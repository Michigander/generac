# JS Generator Patterns

This is a collection of utilities for building systems based on asynchronous iterables.

## Included

- **merging** - merge multiple streams into a single iterable
- **branching** - allows multiple consumers for the same iterable
- **buffering** - combine streams with a time buffer to help ensure correct order
- **lenses** - stream data that is a transformation of data gathered from multiple sources
- **mutation observer** - stream in memory object mutations

## Todos & Ideas

- bootstrapping
- create callback stream
- separate out the recursive proxy
- state machines
- all utilities should satisfy a common message interface
- transition to typescript
