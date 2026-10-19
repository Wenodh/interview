---
title: "Debugging & Production Scenarios"
description: "Production issue resolution: Memory leaks, library upgrade failures, cross-browser debugging, and peak traffic outages."
sidebar:
  order: 6
---

## Core Topics & Concepts

### 1. Memory Leaks in Single Page Applications
- **Detection**: Take multiple Heap Snapshots in Chrome DevTools before and after navigating back and forth through application flows. Filter for detached DOM elements or growing constructor retained sizes.
- **Common Causes**:
  - Timers (`setInterval`, `setTimeout`) not cleared on component unmount.
  - Event listeners on global objects (`window`, `document`) not detached.
  - Active WebSocket or RxJS subscriptions remaining open.
  - Closures retaining references to large data structures.
  - Detached DOM nodes retained by closure references.
- **Remediation**: Always return cleanup functions in `useEffect` and cancel active fetches using `AbortController`.

### 2. Handling Breaking Library Upgrades
- **Process**:
  1. Review release notes, changelogs, and migration guides.
  2. Pin dependency versions using exact versions in lockfiles (`package-lock.json` / `pnpm-lock.yaml`).
  3. Upgrade incrementally—one major version at a time.
  4. Run automated test suites and utilize codemods where available.
  5. Deploy behind feature flags or canary releases to minimize exposure.

### 3. Cross-Browser Glitches
- **Diagnosis**: Collect client metadata (user agent, browser version, device, OS). Reproduce environments using BrowserStack or virtual machines.
- **Resolution**: Check [caniuse.com](https://caniuse.com) for feature support, add feature detection checks or polyfills, inspect browser-specific vendor prefixes, and attach Sentry context.

### 4. High Traffic / Peak Load Outages
- **Triage**: Inspect monitoring metrics (error rate spikes, API latency, CDN cache hit ratio).
- **Graceful Degradation**: Disable non-essential UI features via feature flags, fallback to cached data, implement client-side rate limiting and retries with jitter and exponential backoff.
- **Post-Incident**: Conduct a postmortem root-cause analysis and implement load testing.

---

## Top Interview Questions

### Q3. Memory leak in a production SPA

### Explanation
Tests your debugging method. Name the tools first, then the usual culprits.

### Answer
- **Identify**: Take heap snapshots in Chrome DevTools before and after repeated navigation and compare. Look for detached DOM nodes and growing retained size.
- **Common causes**: Uncleared timers, event listeners, subscriptions or WebSockets, and closures holding large objects.
- **Fix**: Return cleanup functions from `useEffect`, use `AbortController` for fetches, and remove listeners.
- **Prevent**: Add leak checks to QA and monitor memory in production.

---

### Q4. Component breaks after a library upgrade

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

### Q8. Intermittent UI glitches across browsers

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

### Explanation
Tests incident response. Mitigate first, root-cause second.

### Answer
- **Triage**: Check dashboards and error rates to find whether the failure is the frontend, an API, or a CDN.
- **Mitigate**: Turn the feature off with a flag, show a graceful fallback, and roll back if a recent deploy caused it.
- **Harden**: Add retries with exponential backoff, caching, request deduplication, and timeouts.
- **Follow up**: Write a postmortem and run load tests.
