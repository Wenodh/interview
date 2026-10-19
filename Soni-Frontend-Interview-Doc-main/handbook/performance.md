---
title: "Performance & Optimization"
description: "Web performance, Web Vitals, code splitting, bundle optimization, and rendering efficiency."
sidebar:
  order: 3
---

## Core Topics & Concepts

### 1. Large List Optimization (100k+ Items)
- **Virtualization**: Use `react-window` or `react-virtualized` to render only items currently visible in the viewport plus a small overscan buffer.
- **Pagination & Infinite Scroll**: Load data lazily in chunks via cursor-based API requests.
- **Row Stability**: Use stable keys and fixed/predictable row heights to prevent layout recalculation during scrolling.

### 2. Global Load Time Optimization
- **CDN & Edge Caching**: Distribute static assets close to users worldwide.
- **Compression**: Use Brotli / Gzip compression for text-based assets.
- **Code Splitting**: Dynamic imports (`import()`) and route-based code splitting.
- **Image Optimization**: WebP/AVIF formats, responsive `srcset`, lazy loading, and reserving width/height to avoid layout shifts.
- **Preconnect & Preload**: Preconnect to critical domains and preload critical LCP assets.
- **SSR / SSG**: Pre-render pages for rapid first contentful paint.

### 3. Preventing Main Thread Blocking
- **Web Workers**: Move CPU-heavy data parsing, filtering, and sorting off the main UI thread.
- **Time Slicing**: Chunk heavy operations using `requestIdleCallback` or scheduler timeouts.
- **Concurrent React**: Use `useTransition` to keep user inputs responsive during heavy renders.

### 4. DevTools Debugging Workflow
- **React Profiler**: Capture render durations, flame charts, and turn on *"Highlight updates when components render"* to spot unnecessary renders.
- **Chrome Performance Tab**: Identify long tasks (>50ms), main-thread blocking JavaScript, and layout thrashing.

### 5. Smooth & Unjanky Animations
- **Compositor Properties**: Animate only GPU-accelerated properties (`transform` and `opacity`).
- **Avoid Layout / Reflow**: Do not animate properties that trigger layout (`width`, `height`, `top`, `left`, `margin`).
- **DevTools**: Inspect with the *Rendering tab* to check Paint Flashing and FPS Meter.

### 6. Core Web Vitals (CWV)
- **LCP (Largest Contentful Paint)**: Loading performance. Optimize LCP by preloading hero images and serving critical CSS inline.
- **INP (Interaction to Next Paint)**: Interactivity & responsiveness. Reduce main thread blocking and JavaScript execution time.
- **CLS (Cumulative Layout Shift)**: Visual stability. Always set explicit `width` and `height` dimensions on images/iframes and reserve space for dynamic ads.

### 7. Bundle Optimization
- **Tree Shaking**: Ensure ES modules format (`import`/`export`) for effective dead-code elimination.
- **Bundle Analyzer**: Inspect bundle output using `webpack-bundle-analyzer` or `rollup-plugin-visualizer`.
- **Library Replacement**: Replace bloated dependencies (e.g., Moment.js -> date-fns / Day.js).

---

## Top Interview Questions

### Q1. Optimize a React app rendering 100k+ list items

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

### Q5. Debug a React performance bottleneck using DevTools

### Explanation
They want a concrete workflow, not "I'd optimize it."

### Answer
1. Record in the React Profiler and find components that re-render often or slowly. Turn on "why did this render."
2. Record in the Chrome Performance tab to find long tasks, layout thrashing, and expensive scripting.
3. Fix the cause: memoize, colocate state, split contexts, virtualize, or defer work.
4. Re-profile to confirm the improvement.

---

### Q12. Render a large dataset without blocking the main thread

### Explanation
Tests your understanding of the single-threaded browser.

### Answer
- Move heavy computation to a Web Worker.
- Break work into chunks using `requestIdleCallback` or scheduling.
- Virtualize rendering.
- Use `useTransition` / `useDeferredValue` to keep input responsive.
- Paginate or stream data from the server.

---

### Q14. Janky CSS animation on mobile

### Explanation
Tests your knowledge of the browser rendering pipeline.

### Answer
- **Identify**: Use the DevTools Performance and Rendering tabs (paint flashing, FPS meter) and test on a real low-end device.
- **Fix**: Animate only `transform` and `opacity`, which the compositor handles on the GPU. Avoid animating `width`, `height`, `top`, or `left`, which trigger layout. Use `will-change` sparingly. Reduce paint area and layer count. Respect `prefers-reduced-motion`.
