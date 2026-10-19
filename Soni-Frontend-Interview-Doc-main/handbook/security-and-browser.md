---
title: "Security & Browser Fundamentals"
description: "Web security (XSS, CSRF), browser storage, event delegation, error boundaries, and REST APIs."
sidebar:
  order: 5
---

## Core Topics & Concepts

### 1. Cross-Site Scripting (XSS)
- **Mechanics**: Attacker injects malicious JavaScript into the client application.
- **Defenses**:
  - Automatically escape output (React JSX escapes interpolated strings by default).
  - Avoid `dangerouslySetInnerHTML`; if necessary, sanitize string inputs using `DOMPurify`.
  - Set a strict **Content Security Policy (CSP)** HTTP header (e.g., restricting `script-src`).

### 2. Cross-Site Request Forgery (CSRF)
- **Mechanics**: Unauthorized commands are transmitted from a user that the web application trusts.
- **Defenses**:
  - Use `SameSite=Strict` or `SameSite=Lax` on authentication cookies.
  - Require anti-CSRF tokens for mutating HTTP requests.
  - Verify `Origin` and `Referer` headers on incoming server requests.

### 3. Sensitive Data Protection on Client
- Store sensitive authentication tokens in **HttpOnly, Secure, SameSite** cookies rather than `localStorage` (which is accessible by any XSS script).
- Enforce HTTPS across all application routes and API endpoints.
- Mask sensitive input fields in the UI and sanitize user logs to prevent logging PII.

### 4. Browser Storage Comparison
| Storage Type | Capacity | Lifetime | Scope | Access | XSS Risk |
|--------------|----------|----------|-------|--------|----------|
| `localStorage` | ~5MB | Persistent until explicitly cleared | Same-Origin | Synchronous | High (accessible via JS) |
| `sessionStorage` | ~5MB | Duration of tab/session | Tab-specific | Synchronous | High (accessible via JS) |
| Cookies | ~4KB | Expiration date dependent | Same-Origin / Domain | Sent with HTTP requests | Low if `HttpOnly` flag set |
| `IndexedDB` | >250MB | Persistent until cleared | Same-Origin | Asynchronous | High (accessible via JS) |

### 5. Event Delegation & Bubbling
- **Mechanism**: Event delegation attaches a single event listener to a parent container to manage events triggered on child elements via event bubbling (`event.target`).
- **Benefits**: Reduced memory usage and automatic handling of dynamically added/removed child nodes.

### 6. Error Boundaries
- React class components implementing `componentDidCatch` or `getDerivedStateFromError`.
- Catch JavaScript errors during rendering, lifecycle methods, and constructors in the component tree below them.
- *Note*: They do not catch errors in asynchronous code, event handlers, or SSR.

### 7. REST APIs & HTTP Methods
- **GET**: Safe and idempotent (fetches resources without side effects).
- **PUT**: Idempotent (replaces/creates resource at exact URL).
- **POST**: Non-idempotent (creates new resource or triggers processing).
- **Key HTTP Status Codes**:
  - `200 OK`, `201 Created`, `204 No Content`
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `429 Too Many Requests`
  - `500 Internal Server Error`

---

## Top Interview Questions

### Q7. Secure handling of sensitive user data on the client

### Explanation
Tests your security awareness. The key idea is to minimize what lives on the client at all and protect what does.

### Answer
- Store tokens in `HttpOnly`, `Secure`, `SameSite` cookies, not `localStorage`.
- Always use HTTPS.
- Don't log or cache PII, and mask sensitive fields in the UI.
- Prevent XSS: escape output, sanitize HTML, use a strict CSP.
- Avoid sensitive data in URLs, and clear it on logout.
- Do validation and authorization on the server too.
