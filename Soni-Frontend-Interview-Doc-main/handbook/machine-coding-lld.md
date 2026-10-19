---
title: "Machine Coding & Low Level Design"
description: "React machine coding framework and architectural guides for building popular UI components."
sidebar:
  order: 7
---

## Machine Coding General Approach

In machine coding rounds (typically 45–60 minutes), follow this structured step-by-step workflow:
1. **Clarify Requirements**: Confirm features, constraints, responsive expectations, and edge cases before typing code.
2. **Define API & Props**: Design clean, extensible component interfaces.
3. **Build Minimal Working Version**: Get functional core state running first.
4. **Handle Edge Cases**: Empty states, loading spinners, error handling, rapid user interactions.
5. **Accessibility (a11y)**: Keyboard navigation, ARIA roles, focus management.
6. **Explain Trade-offs**: Discuss state placement, performance, and scalability options.

---

## Essential Machine Coding Components

### 1. Counter
- **Core Concept**: Increment, decrement, reset.
- **Key Details**: Use functional updater form `setCount(c => c + 1)` to prevent stale closure bugs. Memoize callbacks with `useCallback` only when passed to optimized memoized children.

### 2. Todo List + LocalStorage
- **Core Concept**: Persistent state management with browser storage.
- **Key Details**:
  - Lazy initialize state from `localStorage`: `useState(() => JSON.parse(localStorage.getItem('todos')) || [])`.
  - Wrap storage reads/writes in `try/catch` to gracefully handle disabled storage or quota exceeded errors.

### 3. Search Input with Debouncing
- **Core Concept**: Throttling/debouncing rapid input changes to prevent API flooding.
- **Key Details**:
  - Implement custom `useDebounce(value, delay)` hook.
  - Use `AbortController` to cancel in-flight stale requests on input changes to prevent race conditions.

### 4. Modal Component
- **Core Concept**: Reusable overlay dialog rendered outside normal DOM layout.
- **Key Details**:
  - Use `ReactDOM.createPortal` to render into `document.body`.
  - Focus trap inside the modal while open.
  - Close on `Escape` keypress and backdrop overlay clicks.
  - Set `role="dialog"`, `aria-modal="true"`, and restore focus to trigger button upon closing.

### 5. Infinite Scroll List
- **Core Concept**: Lazy data fetching triggered as user scrolls near bottom.
- **Key Details**:
  - Use `IntersectionObserver` attached to a sentinel element at the bottom of the list.
  - Maintain `isLoading` and `hasMore` flags to guard against duplicate requests.

### 6. Form with Real-time Validation
- **Core Concept**: Controlled/uncontrolled form handling with field validation.
- **Key Details**:
  - Validate fields on blur and submit initially; switch to real-time validation on change once an error has occurred.
  - Associate error messages using `aria-describedby` for accessibility.

### 7. Theme Switcher (Dark / Light Mode)
- **Core Concept**: Application-wide theme context with persistence and zero flash on load.
- **Key Details**:
  - Use Context API combined with CSS custom properties (`var(--bg-color)`).
  - Respect `prefers-color-scheme` media query.
  - Inject an inline script in the HTML `<head>` to set initial theme attribute before React hydration to prevent flash of unstyled theme (FOUT).

### 8. Auto-complete / Typeahead
- **Core Concept**: Suggestion list filtering with keyboard navigation.
- **Key Details**:
  - Debounce search inputs and cache API query results.
  - Support `ArrowUp`, `ArrowDown`, `Enter`, and `Escape` key navigation.
  - Set `role="combobox"`, `aria-expanded`, and `aria-activedescendant`.

### 9. 5-Star Rating Component (Amazon Style)
- **Core Concept**: Interactive rating control with hover preview and half-star support.
- **Key Details**:
  - Track `rating` value state and `hoverRating` interaction state.
  - Render half-stars using CSS `clip-path: inset(0 50% 0 0)` or SVG masks.
  - Support keyboard adjustment (`ArrowLeft`/`ArrowRight`).
  - Use `role="radiogroup"` or `role="slider"` with `aria-valuenow`.
