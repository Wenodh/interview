---
title: "JavaScript Fundamentals"
description: "Core JavaScript concepts for frontend interviews: Closures, Event Loop, Promises, Scoping, Prototypes, and 'this'."
sidebar:
  order: 1
---

## Core Topics & Concepts

### 1. Closures
- **Definition**: A function remembers and accesses variables from its lexical scope even when executed outside that scope.
- **Use Cases**: Data privacy/encapsulation, memoization, debounce/throttle implementations, stateful helper functions.
- **Classic Loop Scenario**:
  ```javascript
  // Issue with var (function-scoped):
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Prints 3, 3, 3
  }

  // Fixed with let (block-scoped):
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Prints 0, 1, 2
  }
  ```

### 2. var, let, and const
- `var`: Function-scoped, hoisted and initialized as `undefined`. Allows redeclaration and reassignment.
- `let` & `const`: Block-scoped, hoisted but kept in the **Temporal Dead Zone (TDZ)** until declaration is evaluated.
- `const`: Prevents reassignment of the variable reference, but does not freeze object or array mutations.

### 3. Event Loop
- **Execution Hierarchy**:
  1. **Call Stack**: Executes synchronous JavaScript code.
  2. **Microtask Queue**: Promises (`.then`, `.catch`, `.finally`), `queueMicrotask`, `MutationObserver`.
  3. **Macrotask Queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O, UI rendering.
- **Rule**: All microtasks in the microtask queue are processed and drained completely before the browser picks the next macrotask from the queue.
- **Execution Order Example**:
  ```javascript
  console.log('1');
  setTimeout(() => console.log('2'), 0);
  Promise.resolve().then(() => console.log('3'));
  console.log('4');
  // Output: 1, 4, 3, 2
  ```

### 4. Debounce vs. Throttle
- **Debounce**: Delays execution until a specified delay has elapsed since the last time the event was triggered (e.g., search typeahead input).
- **Throttle**: Guarantees execution at most once in a specified time interval (e.g., window scroll or resize listeners).
- Both techniques use closures to persist timer state across event invocations.

### 5. Deep Clone
- **Native Approach**: `structuredClone(obj)` handles circular references, `Date`, `Map`, `Set`, and typed arrays natively.
- **Recursive Implementation**: Handle primitive values, arrays, plain objects, dates, maps, sets, and track visited objects using `WeakMap` to avoid infinite recursion from circular references.

### 6. Promises & Async/Await
- **States**: `pending`, `fulfilled`, `rejected`.
- **Combinators**:
  - `Promise.all`: Resolves when all resolve; rejects immediately if any reject.
  - `Promise.allSettled`: Resolves when all promises settle (fulfilled or rejected), returning status objects.
  - `Promise.race`: Settles as soon as the first promise settles (fulfills or rejects).
  - `Promise.any`: Resolves as soon as the first promise fulfills; rejects if all reject with an `AggregateError`.
- **Optimization**: Use `Promise.all` to execute independent asynchronous operations in parallel rather than sequentially awaiting them inside a loop.

### 7. The `this` Keyword
- `this` depends on the **call site** and invocation pattern:
  - Default binding: global object (or `undefined` in strict mode).
  - Implicit binding: object calling the method (`obj.fn()`).
  - Explicit binding: `call(thisArg, ...args)`, `apply(thisArg, [args])`, `bind(thisArg, ...args)`.
  - `new` binding: points to the newly constructed object.
  - **Arrow functions**: Do not have their own `this`; they inherit `this` lexically from the enclosing scope.

### 8. Prototypes & Inheritance
- Property lookup walks up the prototype chain (`__proto__` / `Object.getPrototypeOf`).
- ES6 `class` syntax is syntactical sugar over JavaScript's prototype-based prototypical inheritance.

---

## Output Prediction Practice

Be prepared to predict output and execution order for snippets involving closures and the event loop.
