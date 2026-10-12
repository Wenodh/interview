---
title: "Top 15 Frontend Questions"
description: "The top 15 most frequently asked frontend interview questions with in-depth explanations and answers."
sidebar:
  order: 9
---

This page aggregates the top 15 most frequently asked frontend engineering interview questions across React, Performance, System Design, Security, and Production Debugging. Each question includes an **Explanation** (what the interviewer is testing) and a structured **Answer** (key points and steps).

---

### Q1. Optimize a React app rendering 100k+ list items
*Topic: [Performance & Optimization](/handbook/performance/)*

### Explanation
Rendering 100k DOM nodes freezes the browser. The interviewer wants to see that you know the DOM, not React, is the bottleneck.

### Answer
- Virtualize the list (`react-window` / `react-virtualized`) so only visible rows plus a small buffer are rendered.
- Paginate or infinite-scroll if the data comes from an API.
- Use stable keys and `React.memo` on row components.
- Keep row height fixed or measured so scrolling stays smooth.
- Filter and sort on the server or in a Web Worker, not during render.

---

### Q2. Improve page load time for a global audience
*Topic: [Performance & Optimization](/handbook/performance/)*

### Explanation
Tests whether you think beyond code: network, geography, and caching.

### Answer
- Serve static assets from a CDN with edge caching.
- Compress with Brotli, and use HTTP/2 or 3.
- Code split and lazy-load routes.
- Optimize images (WebP/AVIF, srcset, lazy loading).
- Use SSR/SSG for a fast first paint.
- Preconnect to critical origins and preload the LCP resource.
- Measure with real-user monitoring per region.

---

### Q3. Memory leak in a production SPA
*Topic: [Debugging & Production Scenarios](/handbook/debugging-and-production/)*

### Explanation
Tests your debugging method. Name the tools first, then the usual culprits.

### Answer
- **Identify**: Take heap snapshots in Chrome DevTools before and after repeated navigation and compare. Look for detached DOM nodes and growing retained size.
- **Common causes**: Uncleared timers, event listeners, subscriptions or WebSockets, and closures holding large objects.
- **Fix**: Return cleanup functions from `useEffect`, use `AbortController` for fetches, and remove listeners.
- **Prevent**: Add leak checks to QA and monitor memory in production.

---

### Q4. Component breaks after a library upgrade
*Topic: [Debugging & Production Scenarios](/handbook/debugging-and-production/)*

### Explanation
Tests your dependency discipline and risk management.

### Answer
- Read the changelog and migration guide for breaking changes.
- Reproduce the break and check whether a test covers it.
- Pin versions with a lockfile and upgrade incrementally, one major version at a time.
- Use codemods where available.
- Roll back or hold the version if it's blocking, then fix forward.
- Add regression tests, and use Renovate/Dependabot so upgrades stay small.

---

### Q5. Debug a React performance bottleneck using DevTools
*Topic: [Performance & Optimization](/handbook/performance/)*

### Explanation
They want a concrete workflow, not "I'd optimize it."

### Answer
1. Record in the React Profiler and find components that re-render often or slowly. Turn on "why did this render."
2. Record in the Chrome Performance tab to find long tasks, layout thrashing, and expensive scripting.
3. Fix the cause: memoize, colocate state, split contexts, virtualize, or defer work.
4. Re-profile to confirm the improvement.

---

### Q6. Migrate a legacy frontend to a modern framework
*Topic: [Frontend System Design](/handbook/system-design/)*

### Explanation
Tests whether you avoid risky big-bang rewrites and understand safe migration patterns.

### Answer
- Use the strangler-fig pattern: migrate page by page or route by route while old and new coexist.
- Audit the codebase and add tests (including end-to-end) around current behavior first.
- Build a shared design system or component layer.
- Roll out behind feature flags, to small user percentages first.
- Track parity, performance, and errors, and retire the legacy code gradually.

---

### Q7. Secure handling of sensitive user data on the client
*Topic: [Security & Browser Fundamentals](/handbook/security-and-browser/)*

### Explanation
Tests your security awareness. The key idea is to minimize what lives on the client at all and protect what does.

### Answer
- Store tokens in `HttpOnly`, `Secure`, `SameSite` cookies, not `localStorage`.
- Always use HTTPS.
- Don't log or cache PII, and mask sensitive fields in the UI.
- Prevent XSS: escape output, sanitize HTML, use a strict CSP.
- Avoid sensitive data in URLs, and clear it on logout.
- Do validation and authorization on the server too.

---

### Q8. Intermittent UI glitches across browsers
*Topic: [Debugging & Production Scenarios](/handbook/debugging-and-production/)*

### Explanation
Tests systematic troubleshooting of a hard-to-reproduce bug.

### Answer
- **Collect details**: browser, version, OS, device, steps.
- **Reproduce** with BrowserStack or real devices.
- **Check error logs** (Sentry) filtered by user agent.
- **Look for** CSS/JS feature support (`caniuse`), vendor prefixes, and race conditions.
- **Add feature detection** or polyfills, fix, then add a cross-browser test.

---

### Q9. Critical UI feature failing during peak traffic
*Topic: [Debugging & Production Scenarios](/handbook/debugging-and-production/)*

### Explanation
Tests incident response. Mitigate first, root-cause second.

### Answer
- **Triage**: Check dashboards and error rates to find whether the failure is the frontend, an API, or a CDN.
- **Mitigate**: Turn the feature off with a flag, show a graceful fallback, and roll back if a recent deploy caused it.
- **Harden**: Add retries with exponential backoff, caching, request deduplication, and timeouts.
- **Follow up**: Write a postmortem and run load tests.

---

### Q10. Manage state in a complex app to avoid unnecessary re-renders
*Topic: [React Concepts & State Management](/handbook/react/)*

### Explanation
Tests whether you choose the right state tool for each kind of state and know how to prevent cascading re-renders in large component trees.

### Answer
- Keep state local and colocated as close to where it's used as possible.
- Split Context by concern, since one big context re-renders every consumer.
- Use selector-based stores (Zustand, Redux Toolkit) so components subscribe only to what they need.
- Put server state in React Query or SWR.
- Use `React.memo`, stable props, and `useMemo`/`useCallback` where profiling shows a need.

---

### Q11. Implement frontend monitoring and logging
*Topic: [Frontend System Design](/handbook/system-design/)*

### Explanation
Tests whether you think about observability, telemetry, and client-side production safety.

### Answer
- **Errors**: Capture with Sentry-style tooling, upload source maps, and use error boundaries.
- **Performance**: Report Web Vitals (LCP, INP, CLS) from real users.
- **Context**: Attach user ID, session, release version, and browser.
- **Transport**: Batch events and send with `navigator.sendBeacon`.
- **Hygiene**: Sample high-volume logs, scrub PII, and set up alerts and dashboards.

---

### Q12. Render a large dataset without blocking the main thread
*Topic: [Performance & Optimization](/handbook/performance/)*

### Explanation
Tests your understanding of the single-threaded browser.

### Answer
- Move heavy computation to a Web Worker.
- Break work into chunks using `requestIdleCallback` or scheduling.
- Virtualize rendering.
- Use `useTransition` / `useDeferredValue` to keep input responsive.
- Paginate or stream data from the server.

---

### Q13. Implement A/B testing without affecting current users
*Topic: [Frontend System Design](/handbook/system-design/)*

### Explanation
Tests experiment design, rendering performance, and rollout safety.

### Answer
- Bucket users deterministically (hash of user ID) so they always see the same variant.
- Use feature flags or a service like LaunchDarkly or Optimizely.
- Roll out gradually (for example 5%) with a kill switch.
- Assign variants server-side or at the edge to avoid layout flicker.
- Log an exposure event once per user, and monitor error and performance metrics for each variant.

---

### Q14. Janky CSS animation on mobile
*Topic: [Performance & Optimization](/handbook/performance/)*

### Explanation
Tests your knowledge of the browser rendering pipeline.

### Answer
- **Identify**: Use the DevTools Performance and Rendering tabs (paint flashing, FPS meter) and test on a real low-end device.
- **Fix**: Animate only `transform` and `opacity`, which the compositor handles on the GPU. Avoid animating `width`, `height`, `top`, or `left`, which trigger layout. Use `will-change` sparingly. Reduce paint area and layer count. Respect `prefers-reduced-motion`.

---

### Q15. Handle real-time updates in a React app efficiently
*Topic: [React Concepts & State Management](/handbook/react/)*

### Explanation
Tests your grasp of connection management and render cost together.

### Answer
- Pick the transport: WebSocket for two-way, SSE for one-way, polling as a fallback.
- Manage a single connection outside components (a service or hook), and clean up in `useEffect`.
- Reconnect with exponential backoff, and handle offline states.
- Batch or throttle incoming updates before setting state.
- Normalize data and update only the affected items, for example by writing into the React Query cache.
