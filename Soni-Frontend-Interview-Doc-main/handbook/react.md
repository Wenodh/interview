---
title: "React Concepts & State Management"
description: "React core mechanics, Virtual DOM, reconciliation, hooks, state management, and real-time updates."
sidebar:
  order: 2
---

## Core Topics & Concepts

### 1. Controlled vs. Uncontrolled Components
- **Controlled Components**: State is driven by React (`value` + `onChange`). React state is the single source of truth.
- **Uncontrolled Components**: Values are stored in the DOM directly and accessed via `ref` (`useRef`). Ideal for file inputs and non-interactive simple forms.

### 2. Reconciliation & Virtual DOM
- **Diffing Heuristics**:
  - Elements of different types rebuild the entire tree subtree.
  - Keys identify list items across renders. Never use array index as key for reorderable, insertion, or deletion lists.
- **React Fiber**: Incremental rendering architecture that makes reconciliation work interruptible and split across multiple frames to maintain UI responsiveness.

### 3. Hooks Optimization (`useMemo` & `useCallback`)
- `useMemo`: Memoizes expensive computation results.
- `useCallback`: Stabilizes function reference identity across renders, useful when passing callbacks to `React.memo` child components.
- *Caution*: Avoid premature memoization as keeping dependencies and memory overhead has its own cost.

### 4. State Architecture for Large Applications
- **Local State**: Colocate state near components that need it (`useState`).
- **Context API**: Ideal for low-frequency global updates (theme, user locale, auth session).
- **Client State Managers**: Use Redux Toolkit or Zustand for complex shared state with selector-based subscriptions.
- **Server State**: Use TanStack Query (React Query) or SWR for caching, deduplication, and polling server data.

### 5. Suspense & Concurrent Features
- **Suspense**: Displays declarative fallback UI while components or data are loading lazily.
- **Concurrent Features**: `useTransition` and `useDeferredValue` mark non-urgent state updates, keeping urgent updates (like typing in inputs) smooth and responsive.

### 6. Techniques to Avoid Unnecessary Re-renders
- Colocate state close to usage.
- Split global Contexts into smaller, focused contexts.
- Use selector functions (Zustand/Redux).
- Wrap components in `React.memo`.
- Avoid passing inline object/array literals as props.

### 7. Real-time Data Handling
- Use WebSocket or Server-Sent Events (SSE) with a central connection manager outside the component lifecycle.
- Batch updates, handle reconnection with exponential backoff, and clean up connection listeners in `useEffect`.

---

## Top Interview Questions

### Q10. Manage state in a complex app to avoid unnecessary re-renders

### Explanation
Tests whether you choose the right state tool for each kind of state and know how to prevent cascading re-renders in large component trees.

### Answer
- Keep state local and colocated as close to where it's used as possible.
- Split Context by concern, since one big context re-renders every consumer.
- Use selector-based stores (Zustand, Redux Toolkit) so components subscribe only to what they need.
- Put server state in React Query or SWR.
- Use `React.memo`, stable props, and `useMemo`/`useCallback` where profiling shows a need.

---

### Q15. Handle real-time updates in a React app efficiently

### Explanation
Tests your grasp of connection management and render cost together.

### Answer
- Pick the transport: WebSocket for two-way, SSE for one-way, polling as a fallback.
- Manage a single connection outside components (a service or hook), and clean up in `useEffect`.
- Reconnect with exponential backoff, and handle offline states.
- Batch or throttle incoming updates before setting state.
- Normalize data and update only the affected items, for example by writing into the React Query cache.
