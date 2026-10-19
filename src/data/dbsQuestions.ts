export type SourceClassification =
  | 'Reported Question'
  | 'Reported Coding Challenge'
  | 'Supplementary MCQ'
  | 'Supplementary Coding Test'
  | 'Generated Explanation';

export interface ConceptualQuestion {
  id: string;
  category: string;
  badge: SourceClassification;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTags: string[];
  title: string;
  directAnswer: string;
  detailedExplanation: string;
  practicalExample: string;
  whyCorrect: string;
  commonMisconceptions: string;
  followUpQuestions: string[];
  interviewReadyAnswer: string;
  advancedDiscussion: string;
  hints: string[];
}

export interface MCQQuestion {
  id: string;
  topicTag: string;
  badge: SourceClassification;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  optionExplanations: string[];
}

export interface ComparisonExercise {
  title: string;
  conceptA: string;
  conceptB: string;
  comparisonPoints: {
    feature: string;
    conceptAVal: string;
    conceptBVal: string;
  }[];
  verdict: string;
}

export const REPORTED_CONCEPTUAL_QUESTIONS: ConceptualQuestion[] = [
  {
    id: 'dbs_q1',
    category: 'Module Federation & Frontend Architecture',
    badge: 'Reported Question',
    difficulty: 'Hard',
    topicTags: ['module-federation', 'micro-frontends', 'frontend-architecture'],
    title: 'How do you prevent duplicate React instances in Module Federation?',
    directAnswer: 'Share React and React DOM as compatible singleton dependencies in the Module Federation configuration when participating micro-frontends require a common React runtime instance.',
    detailedExplanation: `In a Webpack Module Federation micro-frontend architecture, each independently deployed application (host or remote) can theoretically bundle its own copy of React. However, React relies on global internal state (such as the current dispatcher for hooks like useState and useEffect).

If two different instances of React execute in the same browser window, calling a hook inside a component from a remote app that imports React B while wrapped in a provider from React A will fail with runtime errors like "Invalid Hook Call".

To solve this, Module Federation provides shared dependency configuration. Marking \`react\` and \`react-dom\` with \`singleton: true\` instructs the runtime Module Federation loader to negotiate versions across host and remotes, ensuring only a single instance of React is instantiated and shared across all federated modules.`,
    practicalExample: `// Webpack Module Federation Plugin Configuration Example
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        productsRemote: "products@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: false,
        },
      },
    }),
  ],
};`,
    whyCorrect: `Setting \`singleton: true\` forces Webpack to instantiate only one copy of the library in the shared scope. If versions are semver-compatible, the highest compatible version is used. If versions conflict and \`strictVersion: true\` is omitted, Webpack logs a runtime warning while attempting fallback, preventing hook dispatcher breakage.`,
    commonMisconceptions: `A common misconception is that simply listing React in \`dependencies\` or using \`React.memo\` prevents multiple instances. Another mistake is setting \`eager: true\` on shared libraries in remotes, which forces immediate bundling of React instead of yielding to runtime negotiation.`,
    followUpQuestions: [
      'What happens if two micro-frontends require incompatible major versions of React (e.g. v17 vs v18)?',
      'How does strictVersion: true alter runtime fallback behavior?',
      'How do you manage global CSS or context providers across federated boundaries?'
    ],
    interviewReadyAnswer: `To prevent duplicate React instances in Module Federation, configure \`react\` and \`react-dom\` under the \`shared\` key of Webpack's \`ModuleFederationPlugin\` with \`singleton: true\` and specify \`requiredVersion\`. This guarantees that the host and remotes negotiate a single shared instance of React at runtime, avoiding dispatcher mismatches and 'Invalid Hook Call' runtime errors.`,
    advancedDiscussion: `In enterprise setups with multiple independently deployed squad repositories, strict version management is critical. If a remote requires React 18 (utilizing Concurrent Features) while the host runs React 17, forced singleton sharing can cause runtime errors if non-existent APIs are called. Teams mitigate this by establishing shared contract packages, automated contract testing in CI pipelines, or isolating divergent versions using iframe/shadow DOM micro-frontend containers when runtime sharing cannot be negotiated.`,
    hints: [
      'Think about hook dispatchers and why React breaks when two instances exist on window.',
      'Recall the ModuleFederationPlugin config options: singleton, requiredVersion, and strictVersion.',
      'Explain version negotiation between Host and Remote at runtime.'
    ]
  },
  {
    id: 'dbs_q2',
    category: 'Module Federation & Frontend Architecture',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['module-federation', 'micro-frontends', 'frontend-architecture'],
    title: 'Which technology supports runtime integration of separately deployed frontend applications?',
    directAnswer: 'Module Federation (introduced in Webpack 5 and available in modern bundlers like Vite via plugins) supports runtime integration of independently deployed applications.',
    detailedExplanation: `Traditional frontend integration happens at build time (e.g., publishing npm packages and reinstalling/rebuilding the host application). This causes deployment coupling and slow release cycles across enterprise teams.

Module Federation allows a JavaScript application to dynamically load code exposed by another separately deployed application over the network at runtime without rebuilding the host.

Key concepts:
- **Host**: The application that dynamically loads and renders remotes.
- **Remote**: The application that exposes modules (components, pages, state stores) via a \`remoteEntry.js\` manifest.
- **Shared Scope**: Common dependencies dynamically shared between Host and Remotes to avoid duplicate bundle bloat.`,
    practicalExample: `// Remote App exposing a header component:
new ModuleFederationPlugin({
  name: "nav_remote",
  filename: "remoteEntry.js",
  exposes: {
    "./Header": "./src/components/Header",
  },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } }
});

// Host App consuming the exposed header component dynamically:
const RemoteHeader = React.lazy(() => import("nav_remote/Header"));

function App() {
  return (
    <React.Suspense fallback={<div>Loading Header...</div>}>
      <RemoteHeader />
    </React.Suspense>
  );
}`,
    whyCorrect: `Module Federation executes runtime code resolution by fetching the remote manifest file (\`remoteEntry.js\`). The browser resolves async chunk boundaries on demand, offering true deployment independence while preserving single-page application performance.`,
    commonMisconceptions: `Module Federation is often confused with standard build-time code splitting or iframes. Unlike iframes, federated components share DOM context, CSS styles, and JavaScript state while executing natively in the same browser window context.`,
    followUpQuestions: [
      'How do you implement error boundaries and fallback UI when a remote service is offline or unreachable?',
      'How does Module Federation compare with Single-SPA or Web Components?'
    ],
    interviewReadyAnswer: `Module Federation supports runtime integration of separately deployed frontend applications. It enables a host application to fetch remote manifests (\`remoteEntry.js\`) over the network and render exposed React components on demand at runtime without requiring a host rebuild or redeployment.`,
    advancedDiscussion: `When deploying remotes independently in high-availability enterprise applications, network resilience is essential. If a remote host goes down or returns a 500 network error, host dynamic imports will reject. Teams implement resilient dynamic import wrappers with retry logic, circuit breakers, and React Error Boundaries to gracefully degrade missing micro-frontend widgets.`,
    hints: [
      'Distinguish build-time npm imports vs runtime network loading.',
      'Mention host, remote, remoteEntry.js, and dynamic import().',
      'Explain how error boundaries prevent remote network failures from crashing the host.'
    ]
  },
  {
    id: 'dbs_q3',
    category: 'JavaScript Build Optimization & Performance',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['tree-shaking', 'performance', 'build-optimization'],
    title: 'What removes unused library code from a production bundle?',
    directAnswer: 'Tree shaking (dead code elimination) removes unused JavaScript exports during the build process.',
    detailedExplanation: `Tree shaking relies on static ES Module syntax (\`import\` and \`export\`) as opposed to dynamic CommonJS (\`require()\`). Because ES Module imports and exports are static, bundlers (such as Webpack, Rollup, Esbuild, and Vite) can build an abstract syntax tree (AST) and determine statically which exported functions or variables are never imported or referenced.

Unused exports are omitted from the final bundle during minification (e.g. Terser or Esbuild).

To support tree shaking effectively:
1. Use ES module syntax (\`import { map } from 'lodash-es'\` instead of \`const lodash = require('lodash')\`).
2. Mark package \`sideEffects: false\` in \`package.json\` if modules do not execute global side effects on load.
3. Configure target tools to preserve ES modules rather than transpiling them down to CommonJS modules prematurely in Babel.`,
    practicalExample: `// package.json of a utility library
{
  "name": "math-utils",
  "version": "1.0.0",
  "sideEffects": false,
  "module": "dist/math-utils.esm.js"
}

// Application Code importing only add:
import { add } from 'math-utils';

console.log(add(2, 3));
// During bundle minification, unreferenced exports like 'multiply', 'subtract' are tree-shaken away.`,
    whyCorrect: `Static module structure allows the bundler to safely perform graph analysis without executing code. Omission of unreachable code during production build reduces bundle payload, network transfer time, and browser script parsing overhead.`,
    commonMisconceptions: `Tree shaking is often confused with code splitting or minification. Code splitting breaks code into smaller chunks loaded on demand, minification shortens variable names and strips whitespace, while tree shaking specifically removes unused exports from the AST module graph.`,
    followUpQuestions: [
      'Why does importing from lodash (CommonJS) fail to tree-shake compared to lodash-es?',
      'How does the sideEffects property in package.json prevent accidental code elimination?'
    ],
    interviewReadyAnswer: `Tree shaking is the process of dead code elimination used by modern bundlers. It analyzes static ES Module import and export syntax to build a module dependency graph and strips out any exported code that is never referenced in the application, reducing production bundle size.`,
    advancedDiscussion: `Accidental side effects (such as modifying global prototypes, configuring window event listeners at module scope, or polyfilling built-ins) prevent bundlers from removing dead code. Explicitly declaring \`"sideEffects": ["*.css", "*.scss"]\` in package.json informs the bundler which specific files have side effects, enabling aggressive tree shaking across all clean module exports.`,
    hints: [
      'Focus on static ES Module import/export analysis vs CommonJS.',
      'Explain the role of sideEffects in package.json.',
      'Differentiate tree shaking, code splitting, and minification.'
    ]
  },
  {
    id: 'dbs_q4',
    category: 'JavaScript Build Optimization & Performance',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['lazy-loading', 'performance', 'images'],
    title: 'What technique helps when a page contains many images?',
    directAnswer: 'Lazy loading images (deferring image loading until they approach or enter the visible browser viewport) optimizes page performance.',
    detailedExplanation: `Loading dozens of high-resolution images simultaneously on initial page load consumes network bandwidth, blocks critical rendering resources, and harms core web vitals (such as Largest Contentful Paint - LCP and Interaction to Next Paint - INP).

Lazy loading defers image fetching until the user scrolls near the element.

Methods:
1. **Native HTML Attribute**: Adding \`loading="lazy"\` to \`<img>\` tags allows modern browser engines to handle deferred loading natively.
2. **Intersection Observer API**: Custom JavaScript implementation using \`IntersectionObserver\` to set the \`src\` attribute dynamically when an image crosses a threshold distance from the viewport.
3. **Responsive Image Formats**: Utilizing WebP/AVIF formats with \`srcset\` and \`sizes\` for density and screen-width adaptations.`,
    practicalExample: `<!-- Native HTML Lazy Loading -->
<img
  src="hero-banner.webp"
  alt="Hero Banner"
  loading="eager"
  width="1200"
  height="600"
/> <!-- Critical above-the-fold image -->

<img
  src="product-thumbnail.webp"
  alt="Product Thumbnail"
  loading="lazy"
  width="300"
  height="300"
/> <!-- Below-the-fold image lazy loaded -->`,
    whyCorrect: `Lazy loading minimizes initial page payload, saves mobile bandwidth, and prevents network bottlenecking during critical initial DOM rendering and script hydration.`,
    commonMisconceptions: `Lazy loading should NOT be applied indiscriminately to all images. Applying \`loading="lazy"\` to above-the-fold LCP hero images delays their download, causing lower Lighthouse performance scores. Above-the-fold hero images should use \`loading="eager"\` or \`<link rel="preload">\`.`,
    followUpQuestions: [
      'How does lazy loading impact Largest Contentful Paint (LCP) if misapplied to above-the-fold hero images?',
      'How do you prevent cumulative layout shift (CLS) when lazy-loaded images complete download?'
    ],
    interviewReadyAnswer: `Lazy loading images is the technique of deferring network image requests until the images are scrolled near the visible viewport. It is implemented natively via \`loading="lazy"\` or programmatically with \`IntersectionObserver\`, significantly reducing initial network payload and improving page load speed.`,
    advancedDiscussion: `To avoid Cumulative Layout Shift (CLS) as lazy-loaded images load into the viewport, developers must explicitly set \`width\` and \`height\` attributes or aspect-ratio CSS rules to reserve layout space ahead of time. Additionally, combining lazy loading with blur-up placeholders or responsive \`srcset\` provides optimal user experience on low-bandwidth networks.`,
    hints: [
      'Explain native HTML loading="lazy" vs IntersectionObserver API.',
      'Highlight why above-the-fold hero images should NOT be lazy-loaded.',
      'Mention aspect-ratio and dimension reservation to avoid Cumulative Layout Shift (CLS).'
    ]
  },
  {
    id: 'dbs_q5',
    category: 'React State Management & Component Reuse',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['react-state', 'useState', 'state-colocation'],
    title: "Where should a counter's state live if only one component uses it?",
    directAnswer: "Inside the local state of that specific component, implemented using React's useState (or useReducer) hook.",
    detailedExplanation: `In React application architecture, state should always be colocated as close as possible to where it is consumed ("State Colocation").

If a state value (like a counter, modal toggle, or active tab index) is only read and updated inside a single component tree node, placing it in global state (like Redux, Zustand) or React Context introduces unnecessary complexity, boilerplate, and potential performance re-render overhead across unrelated subtrees.

Key guidelines:
1. **Local State**: \`useState\` for independent component-level values.
2. **Lifting State Up**: Move state to the nearest common parent only when sibling components need to read or share that state.
3. **Global / Context State**: Reserved for application-wide cross-cutting state (e.g. auth user session, active theme, locale settings).`,
    practicalExample: `import { useState } from 'react';

export default function SingleCounter() {
  const [count, setCount] = useState<number>(0);

  // Use functional updates to prevent stale closure issues
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="counter-card">
      <h4>Local Counter: {count}</h4>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}`,
    whyCorrect: `Colocating state locally ensures encapsulated scope, simplifies testing, prevents unnecessary global state store pollution, and restricts component re-renders strictly to the component that owns the state.`,
    commonMisconceptions: `A common misconception is assuming that all application data belongs in Redux or global context. Storing isolated UI state globally violates encapsulation and makes components less portable and harder to debug.`,
    followUpQuestions: [
      'When does local state need to be lifted up to a parent component?',
      'Why is passing a functional update to setState (setCount(prev => prev + 1)) safer than setCount(count + 1)?'
    ],
    interviewReadyAnswer: `If only one component uses a counter, its state should live directly within local component state using \`useState\`. This follows the principle of State Colocation, keeping components encapsulated, clean, and performant without polluting global state stores.`,
    advancedDiscussion: `Using functional updates (\`setCount(prev => prev + 1)\`) guarantees correctness during asynchronous batched updates or state updates inside event closures. If local state logic becomes complex with multiple transition actions, transitioning from \`useState\` to \`useReducer\` within the local component maintains local encapsulation while clarifying state transition rules.`,
    hints: [
      'Mention State Colocation principle.',
      'Contrast local state with lifting state up and global stores.',
      'Explain functional updates setCount(prev => prev + 1).'
    ]
  },
  {
    id: 'dbs_q6',
    category: 'React State Management & Component Reuse',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['hoc', 'react-components', 'component-patterns'],
    title: 'What is a Higher-Order Component (HOC)?',
    directAnswer: 'A Higher-Order Component (HOC) is an advanced React pattern where a function takes a component as an argument and returns an enhanced, new component.',
    detailedExplanation: `HOCs are based on JavaScript's functional composition nature (\`W(C) => C'\`). They are used to share cross-cutting logic across multiple components (e.g., authentication checks, logging, theme injection, or loading spinner overlays) without duplicating code.

HOC characteristics:
- Pure function with no side effects on the input component.
- Passes original props through using JSX spread syntax (\`{...props}\`).
- Wraps display name for clear React DevTools debugging (\`WithLoading(MyComponent)\`).

Modern React comparison: While HOCs were dominant in class component architectures, custom React Hooks have largely replaced HOCs for sharing logic. However, HOCs remain highly useful for conditional wrapper rendering and memoization (e.g. \`React.memo\`, \`connect\` in Redux, or \`withRouter\`).`,
    practicalExample: `import React, { ComponentType } from 'react';

interface WithLoadingProps {
  isLoading: boolean;
}

// HOC definition
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  const ComponentWithLoading = ({ isLoading, ...props }: WithLoadingProps & P) => {
    if (isLoading) {
      return <div className="spinner">Loading data...</div>;
    }
    return <WrappedComponent {...(props as P)} />;
  };

  ComponentWithLoading.displayName = \`WithLoading(\${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })\`;

  return ComponentWithLoading;
}`,
    whyCorrect: `HOCs enable clean composition of cross-cutting concerns by wrapping target components without altering their internal implementation or state logic.`,
    commonMisconceptions: `Never mutate the original component inside an HOC (e.g. \`InputComponent.prototype.render = ...\`). Always use composition by returning a new functional component wrapper. Also, never create or invoke an HOC inside the render method of another component, as doing so creates a new component reference on every render, destroying child subtree state.`,
    followUpQuestions: [
      'How do Custom Hooks compare with HOCs for sharing stateful logic?',
      'Why should HOCs never be instantiated inside a component\'s render function?'
    ],
    interviewReadyAnswer: `A Higher-Order Component (HOC) is a pure function that receives a component as an argument and returns a new, enhanced component. It allows cross-cutting concerns—such as authentication protection or loading states—to be composed reusable across components.`,
    advancedDiscussion: `HOCs can suffer from "wrapper hell" (excessive nested JSX wrapper trees in React DevTools) and prop collision issues when multiple HOCs pass identically named props. Custom React Hooks eliminate wrapper hell by exposing reusable logic directly into functional component bodies, though HOCs remain ideal for structural DOM wrapping and route guard wrappers.`,
    hints: [
      'Define HOC signature: Component -> Component.',
      'Explain prop forwarding ({...props}) and displayName.',
      'Compare HOCs with Custom Hooks and render props.'
    ]
  },
  {
    id: 'dbs_q7',
    category: 'Routing & Single-Page Applications',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['spa-routing', 'react-router', 'server-configuration'],
    title: 'How should a single-page application handle a deep link on refresh?',
    directAnswer: 'Configure the web hosting server to catch all non-asset client route requests and serve the root entry file (index.html), allowing the client-side router (e.g. React Router) to resolve the deep URL path.',
    detailedExplanation: `In a Single-Page Application (SPA) using client-side routing (like HTML5 \`browserHistory\` in React Router), navigating to \`/dashboard/analytics\` renders the page client-side without a full server round-trip.

However, when a user directly enters \`https://myapp.com/dashboard/analytics\` into the address bar or refreshes the page:
1. The browser sends an HTTP GET request to the hosting server for the resource at path \`/dashboard/analytics\`.
2. Since no physical HTML file or folder exists at \`/dashboard/analytics\` on the web server disk, the server returns a **404 Not Found** error by default.

To fix this:
Configure fallback rewrite rules on the server (Nginx, Apache, AWS CloudFront, Vercel, Netlify) so that all incoming route requests that do not match static physical files (JS, CSS, images) or API endpoints rewrite to serve \`index.html\` with an HTTP 200 status code. The browser then loads \`index.html\`, executes the React bundle, and React Router reads \`window.location.pathname\` to mount the correct view.`,
    practicalExample: `// Nginx Configuration Example
server {
  listen 80;
  server_name myapp.com;
  root /var/www/html;
  index index.html;

  location / {
    # Try serving static file directly, fallback to index.html for SPA client routing
    try_files $uri $uri/ /index.html;
  }

  # Ensure API requests are proxy passed and NOT rewritten to index.html
  location /api/ {
    proxy_pass http://backend-api:8080;
  }
}`,
    whyCorrect: `Server rewrite fallback ensures that deep link GET requests return the main SPA entry HTML, enabling client-side router initialization to handle dynamic URL parsing and view mounting smoothly.`,
    commonMisconceptions: `Indiscriminately rewriting all missing paths to \`index.html\` without excluding static assets or \`/api\` routes causes broken asset requests (e.g., missing JS chunks returning HTML code) and hides real API 404 errors behind 200 HTML responses.`,
    followUpQuestions: [
      'How does server rewrite fallback differ from Server-Side Rendering (SSR)?',
      'What is the difference between BrowserRouter (HTML5 pushState) and HashRouter (#/route)?'
    ],
    interviewReadyAnswer: `To handle deep link refreshes in an SPA, configure the web server to rewrite all client route GET requests to serve \`index.html\`. This allows the browser to load the SPA entry point, execute the JavaScript bundle, and let React Router parse the client path.`,
    advancedDiscussion: `While HashRouter (\`/#/dashboard\`) avoids server configuration by keeping route paths after the \`#\` hash symbol (which browsers do not send to servers), it is detrimental to SEO and URL aesthetic standards. Modern enterprise SPAs use HTML5 \`History Location\` with automated CloudFront / Nginx rewrites, or migrate to SSR / SSG frameworks like Next.js to deliver pre-rendered route HTML natively.`,
    hints: [
      'Explain why direct address bar navigation triggers an HTTP GET to the origin server.',
      'Explain server rewrite fallback (try_files $uri $uri/ /index.html).',
      'Highlight why API paths and static assets must NOT be rewritten to index.html.'
    ]
  },
  {
    id: 'dbs_q8',
    category: 'Redux-Saga & Asynchronous State Management',
    badge: 'Reported Question',
    difficulty: 'Hard',
    topicTags: ['redux-saga', 'generators', 'async-state'],
    title: 'What is the purpose of a Watcher Saga in Redux-Saga?',
    directAnswer: 'A Watcher Saga is a ES6 generator function in Redux-Saga that listens for dispatched Redux actions and forks or spawns a Worker Saga to handle the asynchronous side effect.',
    detailedExplanation: `Redux-Saga is a middleware library that handles complex asynchronous side effects in Redux applications using ES6 Generator functions (\`function*\`).

Architecture separation:
1. **Watcher Saga**: Listens for specific action types using saga effect helpers like \`takeEvery\`, \`takeLatest\`, or \`takeLeading\`. Its sole responsibility is monitoring action dispatch events.
2. **Worker Saga**: Performed when the Watcher catches an action. Performs the actual async work (API HTTP calls via \`call\`), handles errors in \`try...catch\`, and dispatches resulting actions to Redux via \`put\`.

Effect helper behavior:
- \`takeEvery\`: Spawns a new worker saga for every dispatched action concurrently.
- \`takeLatest\`: Automatically cancels any previously running worker saga if a new action of the same type is dispatched before completion (ideal for search autocomplete and button double-clicks).`,
    practicalExample: `import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUserApi } from './api';

// WORKER SAGA: Performs async API request and dispatches actions
export function* fetchUserWorker(action) {
  try {
    yield put({ type: 'USER_FETCH_REQUESTED' });
    const user = yield call(fetchUserApi, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCEEDED', payload: user });
  } catch (error) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Fetch failed',
    });
  }
}

// WATCHER SAGA: Listens for actions and triggers worker
export function* userWatcherSaga() {
  yield takeLatest('USER_FETCH_TRIGGERED', fetchUserWorker);
}`,
    whyCorrect: `Separating Watcher Sagas from Worker Sagas enforces clean architecture, simplifies unit testing (by yielding declarative effect objects without triggering real side effects), and manages concurrency cleanly.`,
    commonMisconceptions: `Redux-Saga effects like \`call\` and \`put\` do not execute async calls or dispatch actions immediately when called inside generator functions; they return plain JavaScript descriptor objects that the Redux-Saga middleware runtime interprets and executes.`,
    followUpQuestions: [
      'What is the difference between takeLatest and takeEvery in Redux-Saga?',
      'How do declarative effects (call, put, select) make unit testing Sagas easier than testing Redux Thunks?'
    ],
    interviewReadyAnswer: `In Redux-Saga, a Watcher Saga monitors dispatched Redux actions using helpers like \`takeLatest\` or \`takeEvery\` and delegates the execution of asynchronous side effects to a corresponding Worker Saga.`,
    advancedDiscussion: `Saga cancellation with \`takeLatest\` cancels the generator saga thread runtime. However, unless the underlying HTTP client is explicitly bound to an \`AbortController\` signal, the browser network request itself may still complete in the background even though Redux-Saga discards the response.`,
    hints: [
      'Explain Watcher vs Worker saga responsibilities.',
      'Compare takeLatest vs takeEvery.',
      'Mention declarative effect descriptors: call, put, select.'
    ]
  },
  {
    id: 'dbs_q9',
    category: 'Server Rendering & Hydration',
    badge: 'Reported Question',
    difficulty: 'Hard',
    topicTags: ['ssr-hydration', 'react-dom', 'server-side-rendering'],
    title: 'What is client-side hydration in server-rendered React?',
    directAnswer: "Client-side hydration is the process where React attaches event listeners and mounts client runtime state to pre-rendered HTML received from the server, making the static page fully interactive.",
    detailedExplanation: `In Server-Side Rendering (SSR frameworks like Next.js or custom \`renderToString\` setups):
1. The server executes React components, generates an HTML string, and sends pre-built static HTML to the browser.
2. The browser immediately displays this static HTML (yielding fast First Contentful Paint - FCP), but buttons and interactive inputs are not yet functional because JavaScript event listeners have not been attached.
3. The browser downloads the client JavaScript bundle and executes \`hydrateRoot(container, <App />)\` (React 18).
4. React walks the server-generated DOM nodes, verifies that the server HTML matches client output, and "hydrates" the DOM by attaching event handlers, initializing state, and linking effects.

Hydration Mismatch:
If server-rendered HTML differs from the initial client render (e.g. using \`window.innerWidth\` or \`Date.now()\` during render), React logs a "Hydration Mismatch" warning and is forced to discard or re-render node branches, causing performance penalties.`,
    practicalExample: `// React 18 Client Entry Point (src/index.js)
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

// Hydrates pre-rendered server HTML
hydrateRoot(container, <App />);`,
    whyCorrect: `Hydration bridges server pre-rendering with client interactivity, combining the fast initial paint and SEO benefits of static HTML with the interactive dynamic experience of a Single-Page Application.`,
    commonMisconceptions: `Hydration does NOT rebuild or re-render the entire DOM tree from scratch. Instead, React reuses existing DOM nodes generated by the server and binds internal fiber nodes and event listeners directly onto them.`,
    followUpQuestions: [
      'What causes Hydration Mismatches and how do you fix them in React/Next.js?',
      'How does Selective Hydration work with React 18 Suspense and Server Components?'
    ],
    interviewReadyAnswer: `Client-side hydration is the process by which React binds event listeners and component state to static HTML pre-rendered by the server. Using \`hydrateRoot\`, React transforms static markup into an interactive application without recreating the DOM nodes.`,
    advancedDiscussion: `React 18 introduced Selective Hydration using \`<Suspense>\` boundaries. Instead of waiting for the entire application JavaScript bundle to download before hydrating the page, React 18 can stream HTML and hydrate high-priority user-interacted sections first, drastically improving Interaction to Next Paint (INP) metrics.`,
    hints: [
      'Contrast static HTML rendering with attaching interactive event listeners.',
      'Explain React 18 hydrateRoot vs render.',
      'Explain causes of Hydration Mismatches (e.g., dynamic timestamps or window checks).'
    ]
  }
];

export const SUPPLEMENTARY_MCQS: MCQQuestion[] = [
  // Topic 1: Module Federation Duplicate Instances
  {
    id: 'mcq_mf_1',
    topicTag: 'module-federation',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Module Federation Singleton Configuration',
    questionText: 'When configuring Webpack Module Federation, what property in the `shared` object ensures that the host and remotes use a single shared instance of React?',
    options: [
      'eager: true',
      'singleton: true',
      'strictVersion: false',
      'import: false'
    ],
    correctAnswerIndex: 1,
    explanation: 'Setting `singleton: true` under the shared configuration forces Module Federation to negotiate and instantiate only one shared copy of the package across host and remotes.',
    optionExplanations: [
      'Incorrect: `eager: true` forces immediate bundling into the initial entry point, bypassing async chunk negotiation.',
      'Correct: `singleton: true` prevents multiple instances of React from instantiating in the browser.',
      'Incorrect: `strictVersion` controls whether version mismatches throw errors or warnings, but does not enforce singleton behavior on its own.',
      'Incorrect: `import: false` disables module importing entirely.'
    ]
  },
  {
    id: 'mcq_mf_2',
    topicTag: 'module-federation',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Impact of Duplicate React Instances',
    questionText: 'What common error occurs when a federated remote component calls a React hook while importing a duplicate instance of React DOM from the host?',
    options: [
      'Maximum call stack size exceeded',
      'Invalid Hook Call: Hooks can only be called inside the body of a function component',
      'CORS security policy block',
      'Hydration failed because the initial UI does not match'
    ],
    correctAnswerIndex: 1,
    explanation: 'React hooks rely on a single global dispatcher object. Duplicate React instances result in an uninitialized dispatcher reference, throwing "Invalid Hook Call".',
    optionExplanations: [
      'Incorrect: Stack overflow happens during infinite loops, not React instance dispatcher mismatches.',
      'Correct: Having two copies of React runtime breaks hook dispatcher state, triggering "Invalid Hook Call".',
      'Incorrect: CORS policy errors occur when network requests fail origin checks.',
      'Incorrect: Hydration errors happen during SSR markup mismatches.'
    ]
  },

  // Topic 2: Module Federation Runtime Integration
  {
    id: 'mcq_rt_1',
    topicTag: 'micro-frontends',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Runtime vs Build-Time Micro-Frontend Integration',
    questionText: 'Which file acts as the runtime manifest for exposed modules in Webpack Module Federation?',
    options: [
      'package.json',
      'remoteEntry.js',
      'webpack.config.js',
      'index.html'
    ],
    correctAnswerIndex: 1,
    explanation: 'The `remoteEntry.js` file is generated by Webpack Module Federation to expose the list of federated modules, shared dependencies, and dynamic getters.',
    optionExplanations: [
      'Incorrect: package.json is used for build-time npm dependencies.',
      'Correct: remoteEntry.js is loaded dynamically by host applications at runtime.',
      'Incorrect: webpack.config.js is a build-time configuration file.',
      'Incorrect: index.html is the application HTML container.'
    ]
  },
  {
    id: 'mcq_rt_2',
    topicTag: 'micro-frontends',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Consuming Federated Modules in React',
    questionText: 'How are remote federated modules typically loaded inside a React host application?',
    options: [
      'Using synchronous require() statements',
      'Using React.lazy() combined with dynamic import() and React.Suspense',
      'Using HTML <iframe> tags exclusively',
      'Using Web Workers'
    ],
    correctAnswerIndex: 1,
    explanation: 'Remote federated modules are fetched asynchronously over the network, making `React.lazy(() => import("remote/Component"))` and `Suspense` the standard React loading pattern.',
    optionExplanations: [
      'Incorrect: Synchronous require() blocks and fails for network-loaded remote bundles.',
      'Correct: React.lazy() and Suspense handle asynchronous runtime network loading cleanly.',
      'Incorrect: Iframes isolate DOM and styles, whereas Module Federation integrates directly into the host React DOM.',
      'Incorrect: Web Workers run off-thread and cannot render DOM components.'
    ]
  },

  // Topic 3: Tree Shaking & Optimization
  {
    id: 'mcq_ts_1',
    topicTag: 'tree-shaking',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Prerequisite for Tree Shaking',
    questionText: 'Which JavaScript module syntax is required for build tools to perform static tree shaking?',
    options: [
      'CommonJS (module.exports / require)',
      'ES Modules (export / import)',
      'AMD (define / require)',
      'UMD wrappers'
    ],
    correctAnswerIndex: 1,
    explanation: 'ES Modules (import/export) are static and can be analyzed prior to execution, enabling tree shaking dead code removal.',
    optionExplanations: [
      'Incorrect: CommonJS modules are dynamic and cannot be statically analyzed reliably.',
      'Correct: ES Modules provide static structure needed for AST dead-code analysis.',
      'Incorrect: AMD is an older browser loader format.',
      'Incorrect: UMD wraps code for multiple environments dynamically.'
    ]
  },
  {
    id: 'mcq_ts_2',
    topicTag: 'tree-shaking',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Package.json sideEffects Flag',
    questionText: 'What is the primary benefit of adding `"sideEffects": false` to a library package.json?',
    options: [
      'It automatically compiles TypeScript files to JavaScript',
      'It informs bundlers that unused files in the package can be skipped completely during tree shaking',
      'It enables gzip compression on the server',
      'It prevents React from re-rendering components'
    ],
    correctAnswerIndex: 1,
    explanation: '`"sideEffects": false` guarantees to the bundler that importing from the package produces no global side effects, allowing entire unused files to be pruned.',
    optionExplanations: [
      'Incorrect: sideEffects does not affect TypeScript compilation.',
      'Correct: It signals that unreferenced module exports are safe to remove without breaking global runtime state.',
      'Incorrect: Server gzip compression is handled by web hosting servers.',
      'Incorrect: It operates at build time, not React runtime render time.'
    ]
  },

  // Topic 4: Lazy Loading Images
  {
    id: 'mcq_img_1',
    topicTag: 'lazy-loading',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Native Image Lazy Loading',
    questionText: 'Which native HTML attribute enables deferred image loading without writing JavaScript?',
    options: [
      'defer="true"',
      'loading="lazy"',
      'async="true"',
      'fetchpriority="low"'
    ],
    correctAnswerIndex: 1,
    explanation: '`loading="lazy"` is supported natively in modern HTML5 image elements.',
    optionExplanations: [
      'Incorrect: defer is an attribute for <script> tags.',
      'Correct: loading="lazy" instructs browser engines to defer image requests until near the viewport.',
      'Incorrect: async is used for script execution.',
      'Incorrect: fetchpriority adjusts request priority, but does not defer loading based on scroll.'
    ]
  },
  {
    id: 'mcq_img_2',
    topicTag: 'lazy-loading',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Hero Images & LCP Performance',
    questionText: 'Why should above-the-fold hero banner images NOT be lazy loaded?',
    options: [
      'Lazy loading causes images to render in black and white',
      'Lazy loading defers image request initiation, worsening Largest Contentful Paint (LCP)',
      'Browsers throw a CORS error when lazy loading above-the-fold images',
      'Hero images cannot be compressed if lazy loaded'
    ],
    correctAnswerIndex: 1,
    explanation: 'LCP measures when the main visible content renders. Deferring the main hero image request delays LCP and degrades performance scores.',
    optionExplanations: [
      'Incorrect: Lazy loading does not modify image color profile.',
      'Correct: Hero images should load eagerly to optimize Largest Contentful Paint (LCP).',
      'Incorrect: CORS policy is unrelated to lazy loading.',
      'Incorrect: Compression is independent of loading strategy.'
    ]
  },

  // Topic 5: State Colocation & Local State
  {
    id: 'mcq_st_1',
    topicTag: 'react-state',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'State Colocation Principle',
    questionText: 'Where should state be stored if it is only consumed by a single isolated child component?',
    options: [
      'Global Redux Store',
      'React Context at root App level',
      'Local state inside the child component using useState',
      'Local Storage'
    ],
    correctAnswerIndex: 2,
    explanation: 'State Colocation dictates storing state locally where it is used to keep components encapsulated and avoid global re-renders.',
    optionExplanations: [
      'Incorrect: Global Redux adds unnecessary boilerplate for local state.',
      'Incorrect: Root Context causes unnecessary re-renders across the entire app.',
      'Correct: useState inside the component encapsulates state cleanly.',
      'Incorrect: LocalStorage is for persistent storage, not component render state.'
    ]
  },
  {
    id: 'mcq_st_2',
    topicTag: 'react-state',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Functional Updates in useState',
    questionText: 'Why is `setCount(prev => prev + 1)` preferred over `setCount(count + 1)` when updates depend on prior state?',
    options: [
      'It runs faster on the GPU',
      'It avoids stale closure bugs by receiving the guaranteed current pending state',
      'It automatically saves state to localStorage',
      'It converts state updates into synchronous calls'
    ],
    correctAnswerIndex: 1,
    explanation: 'Functional state updates evaluate against the latest pending state queued in React, preventing stale closure issues during async batches.',
    optionExplanations: [
      'Incorrect: GPU rendering is unrelated to React hook update batching.',
      'Correct: Functional state updates guarantee access to the latest state value.',
      'Incorrect: useState does not persist to localStorage automatically.',
      'Incorrect: React state updates remain asynchronous.'
    ]
  },

  // Topic 6: Higher-Order Components
  {
    id: 'mcq_hoc_1',
    topicTag: 'hoc',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'HOC Definition and Contract',
    questionText: 'What is the signature of a Higher-Order Component in React?',
    options: [
      'A function that takes JSX and returns JSON',
      'A function that takes a component and returns a new component',
      'A component that renders an iframe',
      'A custom hook that returns an array'
    ],
    correctAnswerIndex: 1,
    explanation: 'An HOC is a higher-order function that accepts a React component as an argument and returns an enhanced React component.',
    optionExplanations: [
      'Incorrect: HOCs operate on React components, not JSON.',
      'Correct: W(Component) -> EnhancedComponent is the definition of an HOC.',
      'Incorrect: Iframes are DOM elements.',
      'Incorrect: Custom hooks start with `use` and return values, not wrapped components.'
    ]
  },
  {
    id: 'mcq_hoc_2',
    topicTag: 'hoc',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'HOC Anti-Pattern',
    questionText: 'Why is creating an HOC inside a parent component render function considered an anti-pattern?',
    options: [
      'It triggers a TypeScript compiler error',
      'It creates a new component reference on every render, causing full child unmounting and state loss',
      'It causes CORS errors during API calls',
      'It disables CSS flexbox layouts'
    ],
    correctAnswerIndex: 1,
    explanation: 'Instantiating an HOC inside render re-defines the component constructor on every render pass, forcing React to remount child subtrees completely.',
    optionExplanations: [
      'Incorrect: TypeScript permits function calls inside render.',
      'Correct: Component reference changes force unmounting, resetting child input and animation states.',
      'Incorrect: CORS policy is network-related.',
      'Incorrect: Layout CSS is unaffected by HOC instantiation.'
    ]
  },

  // Topic 7: SPA Deep Links
  {
    id: 'mcq_rtg_1',
    topicTag: 'spa-routing',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'SPA Direct Navigation 404 Resolution',
    questionText: 'Why does refreshing a client-side route like `/profile/settings` return a 404 error on a web server without fallback configuration?',
    options: [
      'The browser DOM is disabled on page refresh',
      'The physical file `/profile/settings` does not exist on the web server disk',
      'React Router deletes route paths on refresh',
      'The SSL certificate expires'
    ],
    correctAnswerIndex: 1,
    explanation: 'Browsers send an HTTP GET request to the origin server on refresh. Without fallback rewrite rules, servers look for physical disk files and return 404.',
    optionExplanations: [
      'Incorrect: DOM exists on browser reload.',
      'Correct: Web servers serve physical static files unless configured with rewrite fallbacks.',
      'Incorrect: React Router code executes only after index.html loads.',
      'Incorrect: SSL certificates do not expire on page refresh.'
    ]
  },
  {
    id: 'mcq_rtg_2',
    topicTag: 'spa-routing',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Correct Server Fallback Configuration',
    questionText: 'What is the correct server rewrite rule for single-page applications?',
    options: [
      'Rewrite all URLs including /api/ and static assets to index.html',
      'Rewrite non-asset, non-API GET requests to index.html',
      'Redirect all requests to Google.com',
      'Disable HTTP GET requests'
    ],
    correctAnswerIndex: 1,
    explanation: 'Servers must serve real static assets (CSS, JS, images) and API endpoints correctly, while falling back to `index.html` for client route paths.',
    optionExplanations: [
      'Incorrect: Rewriting API routes to index.html breaks backend JSON requests.',
      'Correct: Preserves asset and API routing while routing client paths to index.html.',
      'Incorrect: External redirects break the application.',
      'Incorrect: Disabling GET breaks web browsing.'
    ]
  },

  // Topic 8: Redux-Saga Watcher
  {
    id: 'mcq_saga_1',
    topicTag: 'redux-saga',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Watcher vs Worker Saga Responsibility',
    questionText: 'In Redux-Saga, what is the specific role of a Watcher Saga?',
    options: [
      'Directly execute SQL database queries',
      'Listen for dispatched Redux action types and spawn or fork worker sagas',
      'Mutate Redux store state directly',
      'Render React JSX components'
    ],
    correctAnswerIndex: 1,
    explanation: 'Watcher sagas monitor action patterns using effect helpers (`takeLatest`, `takeEvery`) and trigger worker sagas when actions dispatch.',
    optionExplanations: [
      'Incorrect: Frontends do not execute SQL queries directly.',
      'Correct: Watchers listen for action events and start workers.',
      'Incorrect: Reducers handle state updates, sagas do not mutate state directly.',
      'Incorrect: Sagas handle async side effects, not JSX UI rendering.'
    ]
  },
  {
    id: 'mcq_saga_2',
    topicTag: 'redux-saga',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'takeLatest Saga Effect',
    questionText: 'What happens when a new action is dispatched while a worker saga triggered by `takeLatest` is currently executing an async API request?',
    options: [
      'The new action is ignored',
      'The current running worker saga task is automatically cancelled and a new worker saga starts',
      'The application throws an unhandled exception',
      'Redux store resets to initial state'
    ],
    correctAnswerIndex: 1,
    explanation: '`takeLatest` automatically cancels any previously running saga task if a new matching action arrives before completion.',
    optionExplanations: [
      'Incorrect: `takeLeading` ignores subsequent actions, whereas `takeLatest` cancels the ongoing task.',
      'Correct: `takeLatest` cancels previous tasks to focus on the latest action.',
      'Incorrect: It is standard saga behavior, not an exception.',
      'Incorrect: Redux state is preserved.'
    ]
  },

  // Topic 9: SSR Hydration
  {
    id: 'mcq_hyd_1',
    topicTag: 'ssr-hydration',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Hydration Definition',
    questionText: 'What is the primary objective of client-side hydration in server-rendered React applications?',
    options: [
      'To compile TypeScript to WebAssembly',
      'To attach React event listeners and state onto static server-generated HTML markup',
      'To delete the server HTML and re-render the page from scratch',
      'To clear browser cookies'
    ],
    correctAnswerIndex: 1,
    explanation: 'Hydration turns static server HTML into an interactive application by attaching React event listeners and fiber tree state.',
    optionExplanations: [
      'Incorrect: TypeScript compilation happens build-time.',
      'Correct: Hydration binds event handlers to server-rendered HTML.',
      'Incorrect: Hydration reuses existing DOM nodes rather than wiping them.',
      'Incorrect: Browser cookies are unaffected.'
    ]
  },
  {
    id: 'mcq_hyd_2',
    topicTag: 'ssr-hydration',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Causes of Hydration Mismatches',
    questionText: 'Which coding practice causes a Hydration Mismatch error in SSR React applications?',
    options: [
      'Using pure CSS for button styling',
      'Rendering dynamic non-deterministic data like `Date.now()` or `Math.random()` directly during render without useEffect',
      'Using React.memo on child components',
      'Wrapping routes in dynamic import()'
    ],
    correctAnswerIndex: 1,
    explanation: 'If server HTML differs from initial client render output (due to timestamps, random values, or window checks), React throws a Hydration Mismatch warning.',
    optionExplanations: [
      'Incorrect: CSS styling does not affect DOM element text or attributes.',
      'Correct: Rendering non-deterministic values creates mismatches between server HTML and initial client render.',
      'Incorrect: React.memo is safe for SSR.',
      'Incorrect: Dynamic imports are handled by Suspense.'
    ]
  }
];

export const COMPARISON_EXERCISES: ComparisonExercise[] = [
  {
    title: '1. Tree Shaking vs Code Splitting',
    conceptA: 'Tree Shaking',
    conceptB: 'Code Splitting',
    comparisonPoints: [
      {
        feature: 'Primary Goal',
        conceptAVal: 'Removes unused/dead code exports from the AST module graph.',
        conceptBVal: 'Splits bundle into smaller chunks loaded on demand dynamically.',
      },
      {
        feature: 'Mechanism',
        conceptAVal: 'Static ES Module graph analysis (import/export) during build.',
        conceptBVal: 'Dynamic import() statements & React.lazy boundaries.',
      },
      {
        feature: 'Performance Impact',
        conceptAVal: 'Reduces overall JavaScript bundle weight.',
        conceptBVal: 'Accelerates initial page load by deferring non-critical routes/features.',
      },
    ],
    verdict: 'Tree shaking eliminates dead code from the bundle, while code splitting postpones fetching valid code until needed.'
  },
  {
    title: '2. Lazy Loading Images vs Preloading Images',
    conceptA: 'Lazy Loading Images',
    conceptB: 'Preloading Images',
    comparisonPoints: [
      {
        feature: 'Execution Time',
        conceptAVal: 'Defers request until image approaches visible viewport.',
        conceptBVal: 'Initiates immediate high-priority request during initial HTML parsing.',
      },
      {
        feature: 'Target Use Case',
        conceptAVal: 'Below-the-fold content, gallery thumbnails, deep scroll images.',
        conceptBVal: 'Above-the-fold critical hero images & key visual banners.',
      },
      {
        feature: 'Core Web Vital Impact',
        conceptAVal: 'Saves initial bandwidth, improves Interaction to Next Paint (INP).',
        conceptBVal: 'Improves Largest Contentful Paint (LCP) for critical visuals.',
      },
    ],
    verdict: 'Use preloading for critical above-the-fold visual elements; use lazy loading for all below-the-fold imagery.'
  },
  {
    title: '3. takeLatest vs takeEvery in Redux-Saga',
    conceptA: 'takeLatest',
    conceptB: 'takeEvery',
    comparisonPoints: [
      {
        feature: 'Concurrency Control',
        conceptAVal: 'Cancels previous ongoing worker task when a new action fires.',
        conceptBVal: 'Executes every triggered action concurrently in parallel worker tasks.',
      },
      {
        feature: 'Ideal Scenario',
        conceptAVal: 'Search autocomplete inputs, form submits, rapid tab clicks.',
        conceptBVal: 'Analytics event logging, independent file uploads.',
      },
      {
        feature: 'Race Condition Prevention',
        conceptAVal: 'Guarantees only the last action response updates state.',
        conceptBVal: 'Requires manual response sorting if network responses return out of order.',
      },
    ],
    verdict: 'Use takeLatest for single-result UI requests to prevent race conditions; use takeEvery for independent background logs/tasks.'
  },
  {
    title: '4. Higher-Order Components (HOCs) vs Custom React Hooks',
    conceptA: 'Higher-Order Components',
    conceptB: 'Custom React Hooks',
    comparisonPoints: [
      {
        feature: 'Syntax & Pattern',
        conceptAVal: 'Pure function wrapping a component: W(C) => C\'.',
        conceptBVal: 'Custom function starting with use: useMyLogic().',
      },
      {
        feature: 'DevTools Tree',
        conceptAVal: 'Creates nested wrapper node hierarchy ("Wrapper Hell").',
        conceptBVal: 'Flat tree structure with logic executing directly inside component scope.',
      },
      {
        feature: 'JSX Structural Rendering',
        conceptAVal: 'Can wrap elements conditionally or inject layout markup.',
        conceptBVal: 'Returns raw data/callbacks; component manages its own JSX layout.',
      },
    ],
    verdict: 'Custom hooks are preferred for sharing stateful logic; HOCs are reserved for structural DOM wrapping and route guards.'
  },
  {
    title: '5. Client Rendering vs Server Rendering & Hydration',
    conceptA: 'Client-Side Rendering (CSR)',
    conceptB: 'Server Rendering & Hydration (SSR)',
    comparisonPoints: [
      {
        feature: 'Initial Payload',
        conceptAVal: 'Empty HTML shell (<div id="root"></div>) + large JS bundle.',
        conceptBVal: 'Pre-rendered HTML markup with full content + JS bundle.',
      },
      {
        feature: 'SEO & First Paint',
        conceptAVal: 'Slower initial content paint (FCP), relies on crawler JS execution.',
        conceptBVal: 'Fast initial paint (FCP), instant search engine indexability.',
      },
      {
        feature: 'Hydration Phase',
        conceptAVal: 'No hydration needed; React builds DOM client-side from scratch.',
        conceptBVal: 'Requires hydrateRoot to attach event listeners onto pre-built server DOM.',
      },
    ],
    verdict: 'CSR is simpler for internal authenticated portals; SSR with hydration is necessary for public SEO-driven platforms.'
  },
  {
    title: '6. Local Component State vs Context vs Redux',
    conceptA: 'Local State (useState)',
    conceptB: 'Context API / Redux',
    comparisonPoints: [
      {
        feature: 'Scope',
        conceptAVal: 'Encapsulated strictly within owning component subtree.',
        conceptBVal: 'Shared globally or across distant component branches.',
      },
      {
        feature: 'Boilerplate & Overhead',
        conceptAVal: 'Zero setup overhead; lightweight and fast.',
        conceptBVal: 'Requires context providers or action/reducer boilerplate.',
      },
      {
        feature: 'Re-render Boundary',
        conceptAVal: 'Re-renders only the local component.',
        conceptBVal: 'Context re-renders all consumers unless deeply memoized.',
      },
    ],
    verdict: 'Colocate state locally by default; elevate to Context or Redux only when data must span multiple distant component trees.'
  },
  {
    title: '7. SPA Client-Side Routing vs Server Fallback Rewrite',
    conceptA: 'SPA Client Routing',
    conceptB: 'Server Fallback Rewrite',
    comparisonPoints: [
      {
        feature: 'Execution Environment',
        conceptAVal: 'Runs in the browser via HTML5 history pushState.',
        conceptBVal: 'Configured on web host server (Nginx, Apache, CloudFront).',
      },
      {
        feature: 'Role during Deep Links',
        conceptAVal: 'Parses window.location.pathname to mount target React view.',
        conceptBVal: 'Intercepts direct browser GET requests and serves index.html.',
      },
      {
        feature: '404 Prevention',
        conceptAVal: 'Renders custom <Route path="*" element={<NotFound />} /> UI.',
        conceptBVal: 'Prevents web server from returning raw 404 disk errors on refresh.',
      },
    ],
    verdict: 'Server fallback rewrites ensure page refreshes hit index.html, allowing client routing to parse and mount target views.'
  }
];
