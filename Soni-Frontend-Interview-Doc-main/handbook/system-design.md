---
title: "Frontend System Design"
description: "Architecture, system design framework, scalability, real-time notifications, A/B testing, and migration strategies."
sidebar:
  order: 4
---

## System Design Framework

When approaching any Frontend System Design interview, structure your response systematically:
1. **Requirements & Scope**: Clarify functional and non-functional requirements.
2. **Architecture**: High-level component tree and module boundaries.
3. **Data Model & API Contract**: Schema, normalization, REST vs. GraphQL vs. WebSocket.
4. **Component Design**: Hierarchy, props, reusable UI primitive design.
5. **State Architecture**: Local vs. shared vs. server state.
6. **Performance & Optimization**: Loading strategy, caching, virtualization, asset delivery.
7. **Accessibility & i18n**: ARIA roles, keyboard nav, localization.
8. **Trade-offs**: Explain decisions, alternatives considered, and failure modes.

---

## Core System Design Architecture Patterns

### 1. Scalable Dashboard (YouTube / Uber Style)
- Widget-based modular architecture where each widget is lazy-loaded independently.
- Independent loading and error boundaries per widget so one failure doesn't crash the dashboard.
- Polling or WebSocket connections managed centrally per data source.
- Virtualized grids or lists for rendering high volumes of widget data.

### 2. Large Codebase & Monorepo Structure
- **Folder Structure**: Feature-based modular folders rather than technical layers.
- **Shared UI**: Centralized component library / design system.
- **Monorepo**: Use Nx or Turborepo for dependency management and incremental build caching.
- **Micro-frontends**: Only adopt if independent teams genuinely require decoupled release cadences.

### 3. Real-time Notifications System
- WebSocket connection with fallback to Server-Sent Events (SSE) or long-polling.
- Reconnection logic with exponential backoff and jitter.
- De-duplication of events by notification ID.
- Service Worker integration for push notifications when tab is backgrounded/closed.

### 4. Monitoring & Logging Infrastructure
- Sentry-style client-side error capturing with source maps uploaded during CI build.
- Real User Monitoring (RUM) tracking Web Vitals metrics.
- Transport via `navigator.sendBeacon` or batched background HTTP POST requests.
- Automatic PII (Personally Identifiable Information) scrubbing prior to logging.

### 5. A/B Testing & Feature Flags
- Edge or server-side bucketing deterministic by hash of user ID to avoid layout flicker.
- Feature flag management systems (LaunchDarkly, Optimizely, or internal service).
- Exposure logging sent once per user exposure.
- Gradual rollout capabilities with instant rollback flags.

### 6. Legacy Migration (Strangler-Fig Pattern)
- Migrate route-by-route or module-by-module rather than doing a risky big-bang rewrite.
- Coexist old and new applications side-by-side using reverse proxy routing.
- Establish end-to-end regression tests around current behavior before migration.

### 7. News Homepage (Times of India / NYT Style)
- **Card Variants**: Standardized Card component supporting Hero, Standard, Video, and Ad variants.
- **Cursor Pagination**: Avoids missing or duplicate articles when new stories arrive dynamically.
- **Data Model**: Normalized article records (`id`, `slug`, `section`, `publishedAt`, `imageVariants`).
- **Breaking News**: SSE or WebSocket push with short-TTL cache header on the banner endpoint.

---

## Top Interview Questions

### Q6. Migrate a legacy frontend to a modern framework

### Explanation
Tests whether you avoid risky big-bang rewrites and understand safe migration patterns.

### Answer
- Use the strangler-fig pattern: migrate page by page or route by route while old and new coexist.
- Audit the codebase and add tests (including end-to-end) around current behavior first.
- Build a shared design system or component layer.
- Roll out behind feature flags, to small user percentages first.
- Track parity, performance, and errors, and retire the legacy code gradually.

---

### Q11. Implement frontend monitoring and logging

### Explanation
Tests whether you think about observability, telemetry, and client-side production safety.

### Answer
- **Errors**: Capture with Sentry-style tooling, upload source maps, and use error boundaries.
- **Performance**: Report Web Vitals (LCP, INP, CLS) from real users.
- **Context**: Attach user ID, session, release version, and browser.
- **Transport**: Batch events and send with `navigator.sendBeacon`.
- **Hygiene**: Sample high-volume logs, scrub PII, and set up alerts and dashboards.

---

### Q13. Implement A/B testing without affecting current users

### Explanation
Tests experiment design, rendering performance, and rollout safety.

### Answer
- Bucket users deterministically (hash of user ID) so they always see the same variant.
- Use feature flags or a service like LaunchDarkly or Optimizely.
- Roll out gradually (for example 5%) with a kill switch.
- Assign variants server-side or at the edge to avoid layout flicker.
- Log an exposure event once per user, and monitor error and performance metrics for each variant.
