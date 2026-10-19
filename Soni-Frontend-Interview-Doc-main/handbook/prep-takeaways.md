---
title: "Prep Takeaways & Core Fundamentals"
description: "Key strategy takeaways for frontend interviews and the 20 essential core concepts to master."
sidebar:
  order: 8
---

## Strategic Preparation Takeaways

- **Adaptable Component Architecture**: Practice building UI components structured cleanly enough to survive 3–4 unexpected interviewer follow-up requirements without needing a complete refactor.
- **Do Not Skip Core JS & DSA**: Frameworks come and go, but strong JavaScript fundamentals (closures, async execution order, prototypes) and algorithmic problem-solving separate senior engineers.
- **Master Application Design**: Don't limit practice to isolated UI widgets; practice designing full end-to-end frontend system architectures (caching, offline sync, state management, security).
- **Explain Trade-offs Explicitly**: Interviewers evaluate your reasoning, architectural trade-offs, optimization choices, and decision-making process just as much as working code.

---

## The 20 Core Frontend Fundamentals

Mastering these 20 fundamental concepts will prepare you for over 90% of technical frontend interview questions:

1. **Closures & Scope**: Lexical environments, outer scope access, encapsulation.
2. **Event Loop & Async**: Call stack, microtask queue, macrotask queue, call order execution.
3. **Promises & Async/Await**: Promise states, combinators (`Promise.all`, `allSettled`, `race`, `any`), async syntax.
4. **Hoisting & `this`**: Temporal dead zone, explicit/implicit `this` binding, arrow functions.
5. **Prototypes & Inheritance**: Prototype chain, `Object.create`, class syntax vs prototype inheritance.
6. **`useState` & `useEffect`**: Primitive/object state updates, dependency arrays, cleanup callbacks.
7. **Context API**: Provider setup, consumer re-renders, Context splitting strategies.
8. **Custom Hooks**: Encapsulating reusable stateful logic and side effects.
9. **Component Lifecycle**: Mounting, updating, unmounting mechanics.
10. **State Management**: Local state, context, global state (Zustand/Redux), server state (React Query/SWR).
11. **Code Splitting & Lazy Loading**: Dynamic imports, React `lazy`/`Suspense`, route-level splitting.
12. **Memoization**: `useMemo`, `useCallback`, `React.memo`, referential equality.
13. **Virtual DOM & Reconciliation**: Diffing heuristics, key prop importance, React Fiber.
14. **Bundle Optimization**: Tree shaking, chunking, eliminating duplicate dependencies.
15. **Web Vitals**: LCP, INP, CLS metric optimization techniques.
16. **Event Delegation & Bubbling**: Event propagation, target matching, event listener optimization.
17. **Debouncing & Throttling**: Event rate limiting implementations and use cases.
18. **Error Boundaries**: Class error boundary components, graceful degradation, error logging.
19. **Browser Storage**: `localStorage`, `sessionStorage`, cookies (`HttpOnly`, `SameSite`), `IndexedDB`.
20. **REST APIs & HTTP Methods**: HTTP verbs, status codes, idempotency, caching headers.
