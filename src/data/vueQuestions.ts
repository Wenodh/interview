import { SourceClassification } from './dbsQuestions';

export type { SourceClassification };

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
    id: 'vue_q1',
    category: 'JavaScript Fundamentals & Object Immutability',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['javascript', 'objects', 'object-freeze', 'immutability'],
    title: 'What does Object.freeze() do?',
    directAnswer: 'Object.freeze() prevents adding, removing, or changing the own properties of an object. It is a shallow operation.',
    detailedExplanation: `Object.freeze() freezes an object in place. A frozen object can no longer be modified:
- New properties cannot be added.
- Existing properties cannot be removed.
- Property values, descriptors, writeability, and configurability cannot be changed.
- The object's prototype cannot be reassigned.

Shallow vs. Deep Freezing:
Object.freeze() only applies to the top-level own properties of the object. If an object property value is another object (nested object), that nested object remains mutable unless it is also explicitly frozen recursively.

Strict Mode Behavior:
In non-strict mode, attempting to modify or add properties to a frozen object fails silently without throwing an error. In strict mode (which includes all ES modules and modern script setups), attempting to modify a frozen object throws a TypeError ('Cannot assign to read only property...').`,
    practicalExample: `const user = {
  name: "Anand",
  age: 30,
  address: {
    city: "Bengaluru"
  }
};

Object.freeze(user);

// In non-strict mode, silent fail. In strict mode, throws TypeError!
user.age = 31;
console.log(user.age); // 30 (mutation ignored)

// Shallow nature demonstration: nested property is STILL mutable!
user.address.city = "Hyderabad";
console.log(user.address.city); // "Hyderabad"`,
    whyCorrect: `Object.freeze() changes property descriptors so that writable and configurable are set to false, and marks the object as non-extensible using Object.preventExtensions().`,
    commonMisconceptions: `Developers often assume Object.freeze() creates a deep immutable object tree. Because it is shallow, nested objects or array items inside frozen objects can still be mutated unless a deep freeze helper function is executed recursively.`,
    followUpQuestions: [
      'How does Object.freeze() differ from Object.seal() and Object.preventExtensions()?',
      'How would you write a recursive deepFreeze() function in JavaScript?',
      'Does Object.freeze() prevent mutating items inside a nested array property?'
    ],
    interviewReadyAnswer: `Object.freeze() shallowly freezes an object, preventing property additions, deletions, or value modifications on its top-level properties. In strict mode or ES modules, modifying a frozen property throws a TypeError, while nested objects remain mutable unless explicitly deep-frozen recursively.`,
    advancedDiscussion: `In state management, Object.freeze() can be used to prevent accidental mutations in legacy architectures or optimized performance passes, as state tools can skip setting up deep reactive getter/setter proxies for frozen objects. However, modern immutable patterns prefer spread syntax or Object.assign() for state transitions rather than mutating frozen objects.`,
    hints: [
      'Focus on top-level property restrictions vs nested objects.',
      'Explain behavior in strict mode (ES Modules) vs non-strict mode.',
      'Differentiate shallow freeze vs recursive deep freeze.'
    ]
  },
  {
    id: 'vue_q2',
    category: 'JavaScript Object Creation & Prototypes',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['javascript', 'objects', 'prototypes', 'es6-classes'],
    title: 'What are the different ways to create objects in JavaScript?',
    directAnswer: 'Common approaches include object literals, constructor functions, ES6 classes, and Object.create().',
    detailedExplanation: `JavaScript offers several patterns to instantiate objects, each serving distinct structural and inheritance needs:

1. **Object Literals**: \`const obj = { key: 'value' };\` - Syntactically concise, best for simple data structures.
2. **Constructor Functions**: \`function Person(name) { this.name = name; }\` - Used with the \`new\` keyword. Methods are attached to \`Person.prototype\` to share memory across instances.
3. **ES6 Classes**: \`class Person { constructor(name) { this.name = name; } }\` - Syntactic sugar over prototype-based inheritance offering class fields, getters/setters, and static methods.
4. **Object.create(proto)**: Creates a new object with its internal \`[[Prototype]]\` set to the specified \`proto\` object.
5. **Object.create(null)**: Creates a pure dictionary object with NO prototype link (\`Object.prototype\` is null). It does not inherit default methods like \`toString()\`, \`hasOwnProperty()\`, or \`valueOf()\`, making it ideal for clean map lookup objects without prototype pollution risks.`,
    practicalExample: `// 1. Object Literal
const literal = { name: "Anand" };

// 2. ES6 Class
class User {
  constructor(name) {
    this.name = name;
  }
}
const user1 = new User("Ravi");

// 3. Object.create with explicit prototype
const proto = { greet() { return "Hello"; } };
const objWithProto = Object.create(proto);

// 4. Object.create(null) - Dictionary without prototype
const cleanMap = Object.create(null);
console.log(cleanMap.toString); // undefined (No Object.prototype inheritance!)`,
    whyCorrect: `Different creation techniques control prototype chain linkage. Literals link to Object.prototype, classes/constructors link to constructor.prototype, and Object.create() allows explicit assignment or total removal of prototype chains.`,
    commonMisconceptions: `A common misconception is thinking ES6 \`class\` introduces class-based object-oriented execution to JavaScript. Under the hood, JavaScript classes remain purely prototype-based function constructors.`,
    followUpQuestions: [
      'Why would a developer use Object.create(null) instead of a standard object literal for hash maps?',
      'What happens when you call a method on an object created via Object.create(null)?',
      'How does prototype delegation work during property lookup?'
    ],
    interviewReadyAnswer: `JavaScript objects can be created using object literals, constructor functions, ES6 classes, or Object.create(). Object.create(null) is unique because it produces a dictionary object with no prototype link, preventing property collision with built-in Object methods.`,
    advancedDiscussion: `When building performance-critical key-value caches or parsing untrusted user inputs, Object.create(null) or modern \`Map\` instances prevent Prototype Pollution security vulnerabilities, where malicious keys like \`__proto__\` or \`toString\` override base Object methods.`,
    hints: [
      'Mention Object Literals, Constructor Functions, ES6 Classes, and Object.create().',
      'Explain prototype delegation.',
      'Highlight Object.create(null) and its lack of Object.prototype.'
    ]
  },
  {
    id: 'vue_q3',
    category: 'CSS Layout, Box Model & Accessibility',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['css', 'layout', 'display', 'visibility', 'accessibility'],
    title: 'What is the difference between display: none and visibility: hidden?',
    directAnswer: 'display: none removes an element completely from the document layout flow; visibility: hidden hides the element visually while preserving its layout space.',
    detailedExplanation: `In CSS visual formatting models, \`display: none\` and \`visibility: hidden\` affect layout rendering and browser reflow differently:

1. **\`display: none\`**:
   - Removes the element entirely from the accessibility tree and document rendering tree.
   - Surrounding DOM elements shift to fill the space previously occupied by the element.
   - Triggers browser reflow (layout recalculation) and repaint.
   - Descendant elements CANNOT be made visible even if they set \`display: block\`.

2. **\`visibility: hidden\`**:
   - The element becomes invisible, but still occupies its exact width and height in the layout flow.
   - Does NOT trigger layout reflow (only triggers repaint).
   - Descendant elements CAN be made visible if a child explicitly specifies \`visibility: visible\`.
   - Hidden from sighted users and mouse pointer interactions.

3. **Comparison with \`opacity: 0\`**:
   - \`opacity: 0\` makes the element transparent while keeping layout space. Unlike \`visibility: hidden\`, an \`opacity: 0\` element still receives click events and keyboard focus unless \`pointer-events: none\` and \`tabindex="-1"\` are applied.`,
    practicalExample: `/* Removes element from layout completely */
.collapsed-panel {
  display: none;
}

/* Hides visual graphics but reserves 200px width/height layout gap */
.invisible-placeholder {
  visibility: hidden;
  width: 200px;
  height: 200px;
}

/* Child visibility exception in visibility: hidden subtree */
.invisible-placeholder .forced-visible-child {
  visibility: visible;
}`,
    whyCorrect: `\`display: none\` instructs the render tree engine to omit the node layout box calculation, whereas \`visibility: hidden\` keeps the box layout calculation intact while making pixels transparent to the paint layer.`,
    commonMisconceptions: `Developers often assume \`visibility: hidden\` prevents children from showing. Unlike \`display: none\`, child elements inside a \`visibility: hidden\` container can override their own visibility using \`visibility: visible\`.`,
    followUpQuestions: [
      'How do screen readers and assistive technologies treat display: none vs visibility: hidden vs aria-hidden="true"?',
      'Which property (display: none, visibility: hidden, or opacity: 0) supports smooth CSS transitions and animations?',
      'Why does display: none trigger a browser reflow while visibility: hidden triggers only repaint?'
    ],
    interviewReadyAnswer: `\`display: none\` removes an element entirely from document layout flow, causing surrounding elements to reflow. \`visibility: hidden\` hides the element visually while preserving its layout dimensions, triggering repaint without reflow.`,
    advancedDiscussion: `For accessible accordion and modal animations, \`display: none\` cannot be directly CSS-transitioned. Developers combine \`opacity\` and \`visibility\` transitions with \`transition-behavior: allow-discrete\` in modern CSS, or toggle \`hidden\` / \`display: none\` after transition end listeners fire.`,
    hints: [
      'Compare document layout impact (reflow vs no reflow).',
      'Mention child overrides (visibility: visible works on children, display: block does not).',
      'Compare with opacity: 0 and accessibility tree impact.'
    ]
  },
  {
    id: 'vue_q4',
    category: 'Vue 3 Architecture & Lifecycle Hooks',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['vue3', 'composition-api', 'lifecycle-hooks', 'onMounted', 'onUnmounted'],
    title: 'Explain Vue 3 lifecycle hooks.',
    directAnswer: 'Vue lifecycle hooks allow logic to execute at specific stages of a component\'s creation, mounting, updating, and unmounting.',
    detailedExplanation: `Vue 3 components go through initialization, DOM mounting, reactive updates, and unmounting. In the Vue 3 Composition API, lifecycle hooks are imported and invoked directly inside \`<script setup>\`:

1. **Mounting Phase**:
   - \`onBeforeMount()\`: Called right before the template compilation is finished and inserted into the DOM.
   - \`onMounted()\`: Called after the component has rendered and inserted its DOM nodes into the document. Ideal for DOM references, initial API fetches, and setting up timers or event listeners.

2. **Updating Phase**:
   - \`onBeforeUpdate()\`: Called before the DOM is updated due to a reactive state change.
   - \`onUpdated()\`: Called after the DOM has been re-rendered following a reactive state update.

3. **Unmounting Phase**:
   - \`onBeforeUnmount()\`: Called before the component instance is unmounted and destroyed.
   - \`onUnmounted()\`: Called after the component has unmounted. Crucial for cleaning up timers (\`clearInterval\`), global event listeners, and WebSocket subscriptions to prevent memory leaks.

4. **Error Handling & SSR**:
   - \`onErrorCaptured()\`: Captures errors propagating from child component trees.
   - Lifecycle hooks associated with DOM mounting (\`onMounted\`, \`onUpdated\`) do NOT execute during Server-Side Rendering (SSR).`,
    practicalExample: `<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const count = ref(0);
let timer;

onMounted(() => {
  console.log("Component mounted into DOM");
  timer = setInterval(() => {
    count.value++;
    console.log("Running timer tick:", count.value);
  }, 1000);
});

onUnmounted(() => {
  console.log("Cleaning up timer on component unmount");
  clearInterval(timer);
});
</script>

<template>
  <div>
    <p>Timer Count: {{ count }}</p>
  </div>
</template>`,
    whyCorrect: `Lifecycle hooks hook into Vue's internal component instance lifecycle steps (creation, VNode rendering, DOM patching, and teardown), enabling side-effect setup and teardown at predictable execution boundaries.`,
    commonMisconceptions: `Developers coming from the Options API often look for \`beforeCreate\` or \`created\` in Composition API. In \`<script setup>\`, the setup code itself runs synchronously during component instantiation, replacing \`beforeCreate\` and \`created\`.`,
    followUpQuestions: [
      'Why do DOM-dependent lifecycle hooks like onMounted not run during Server-Side Rendering (SSR)?',
      'How does onErrorCaptured differ from global app.config.errorHandler?',
      'What happens if you forget to clean up setInterval inside onUnmounted?'
    ],
    interviewReadyAnswer: `Vue 3 lifecycle hooks—such as \`onMounted\`, \`onUpdated\`, and \`onUnmounted\`—allow executing side effects during component creation, DOM insertion, updates, and teardown. Always clean up timers and event listeners inside \`onUnmounted\` to prevent memory leaks.`,
    advancedDiscussion: `In KeepAlive cached component trees, normal unmount hooks do not fire when navigating away. Instead, Vue provides \`onActivated\` and \`onDeactivated\` hooks to handle side-effect pause and resume when components are cached in memory.`,
    hints: [
      'List key hooks: onMounted, onBeforeUpdate, onUpdated, onUnmounted.',
      'Explain script setup replaces beforeCreate and created.',
      'Highlight cleanup inside onUnmounted to avoid memory leaks.'
    ]
  },
  {
    id: 'vue_q5',
    category: 'Vue 3 Components, Props & Event Emission',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['vue3', 'components', 'props', 'emits', 'one-way-data-flow'],
    title: 'What are Vue components, props, and emitted events?',
    directAnswer: 'Components encapsulate reusable interface and logic. Props pass data down from parent to child, while emitted events communicate events up from child to parent.',
    detailedExplanation: `Vue applications are structured as hierarchical trees of components. Component communication follows the strict **One-Way Data Flow** principle (props down, events up):

1. **Props (\`defineProps\`)**:
   - Allow parent components to pass data down into child components.
   - Props are read-only inside the child component. A child component must NEVER mutate a prop directly, as doing so breaks unidirectional data flow and triggers Vue runtime warnings.
   - Can specify type validation, required flags, default values, and custom validator functions.

2. **Emitted Events (\`defineEmits\`)**:
   - Allow child components to trigger custom events upwards to parent components.
   - The child invokes \`emit('eventName', payload)\`.
   - The parent listens to the event using \`@eventName="handleEvent"\` syntax and handles the updated data or side effect.`,
    practicalExample: `<!-- ChildComponent.vue -->
<script setup>
// Define incoming props with validation
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 18,
  }
});

// Define emitted events
const emit = defineEmits(["greet", "updateAge"]);

function handleButtonClick() {
  emit("greet", props.name);
}
</script>

<template>
  <div class="user-card">
    <button @click="handleButtonClick">
      Greet {{ name }} (Age: {{ age }})
    </button>
  </div>
</template>`,
    whyCorrect: `Enforcing props-down and events-up creates predictable data flow, making state mutations traceable, preventing implicit child-parent coupling, and simplifying component unit testing.`,
    commonMisconceptions: `Attempting to mutate a prop directly inside a child component (\`props.name = 'New Name'\`) is a frequent beginner mistake. If a child needs to mutate prop data, it should emit an update event to the parent or maintain an internal reactive copy.`,
    followUpQuestions: [
      'How does v-model on a custom component simplify two-way prop and emit binding in Vue 3?',
      'Why is mutating props directly inside a child component prohibited?',
      'How do you define prop type validation with TypeScript in <script setup lang="ts">?'
    ],
    interviewReadyAnswer: `Vue components encapsulate reusable UI. Props pass read-only data down from parent to child via \`defineProps()\`, while child components communicate state changes up to parents by emitting custom events using \`defineEmits()\`, ensuring one-way data flow.`,
    advancedDiscussion: `In Vue 3.4+, \`defineModel()\` simplifies component state sync by automatically binding a prop and its corresponding \`update:modelValue\` emit, eliminating manual prop and emit boilerplate for input-like custom components.`,
    hints: [
      'Emphasize One-Way Data Flow (props down, events up).',
      'Explain defineProps() validation and read-only nature.',
      'Explain defineEmits() and event payloads.'
    ]
  },
  {
    id: 'vue_q6',
    category: 'HTML5 & Web Accessibility (a11y)',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['html5', 'semantic-html', 'accessibility', 'a11y', 'aria'],
    title: 'What is semantic HTML?',
    directAnswer: 'Semantic HTML elements communicate the structural meaning and role of content to both browsers and assistive technologies.',
    detailedExplanation: `Semantic HTML uses tags that convey the nature of the enclosed content rather than generic non-semantic container elements (\`<div>\` and \`<span>\`):

1. **Structural Landmarks**:
   - \`<header>\`: Introductory content or navigational aids.
   - \`<nav>\`: Navigation link blocks.
   - \`<main>\`: The dominant, unique content of the document (only one visible \`<main>\` per page).
   - \`<section>\`: Standalone thematic grouping of content.
   - \`<article>\`: Self-contained, independently distributable composition (e.g., blog post, comment, card).
   - \`<footer>\`: Document or section footer details.

2. **Interactive & Content Elements**:
   - \`<button>\`: Built-in keyboard focusable, responds to Enter/Space key presses, and submits forms.
   - \`<a>\`: Hyperlinks navigating between documents.
   - \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th>\`: Structured tabular data with accessible header associations.

3. **Accessibility (a11y) & ARIA**:
   - Native semantic elements automatically populate the browser Accessibility Tree with correct roles, states, and keyboard event handlers.
   - ARIA attributes (\`aria-label\`, \`aria-expanded\`, \`role="alert"\`) supplement semantics when native elements cannot express custom UI widget behavior.`,
    practicalExample: `<!-- Non-semantic Bad Practice -->
<div class="header" onclick="goToHome()">
  <div class="button">Home</div>
</div>

<!-- Semantic Accessible Good Practice -->
<header>
  <nav aria-label="Main Navigation">
    <button type="button" @click="goToHome">
      Home
    </button>
  </nav>
</header>`,
    whyCorrect: `Semantic markup provides built-in accessibility tree roles, enables screen readers to navigate via landmark shortcuts, improves SEO indexing, and provides default keyboard accessibility without custom JavaScript event hacks.`,
    commonMisconceptions: `Creating interactive buttons using \`<div @click="...">\` is a serious accessibility violation. Divs are not focusable by Tab navigation and do not respond to Enter or Spacebar keys unless extensive custom \`tabindex\` and \`onkeydown\` listeners are added manually.`,
    followUpQuestions: [
      'What are the First Rules of ARIA regarding native semantic HTML elements?',
      'Why is replacing a native <button> with a <div @click="..."> problematic for accessibility?',
      'How do landmark elements like <main> and <nav> help screen reader users?'
    ],
    interviewReadyAnswer: `Semantic HTML uses tags like \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, and \`<button>\` to communicate meaning and structural roles. It provides built-in keyboard navigation and assistive technology support, improving accessibility and SEO.`,
    advancedDiscussion: `Under the "First Rule of ARIA Use", developers should always prefer native semantic HTML elements over non-semantic elements with ARIA roles. ARIA attributes modify the accessibility tree node descriptions but do NOT add native keyboard focus or browser event behavior.`,
    hints: [
      'List core tags: header, nav, main, section, article, footer, button, table.',
      'Explain Accessibility Tree and screen reader landmark navigation.',
      'Contrast native <button> vs <div onclick>.'
    ]
  },
  {
    id: 'vue_q7',
    category: 'JavaScript Asynchronous Architecture & Event Loop',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['javascript', 'event-loop', 'microtasks', 'macrotasks', 'async'],
    title: 'Explain the JavaScript event loop.',
    directAnswer: 'JavaScript executes synchronous code first. Promise reactions run as microtasks, which are processed completely before the next ordinary task (macrotask) such as a timer callback.',
    detailedExplanation: `JavaScript operates on a single-threaded event loop model. Execution order follows strict queue prioritization rules:

1. **Call Stack**:
   - Executes synchronous JavaScript code stack frames sequentially (First In, Last Out).

2. **Microtask Queue**:
   - High-priority async callbacks: \`Promise.then/catch/finally\`, \`queueMicrotask()\`, \`MutationObserver\`, and Vue\'s \`nextTick()\`.
   - The event loop flushes and empties the ENTIRE microtask queue before moving on to render or execute the next macrotask.

3. **Task Queue (Macrotask Queue)**:
   - Ordinary async callbacks: \`setTimeout\`, \`setInterval\`, \`setImmediate\`, I/O, and DOM user interaction events.
   - Only ONE macrotask is processed per event loop iteration before re-checking microtasks and browser rendering passes.`,
    practicalExample: `console.log("A"); // 1. Synchronous call stack

setTimeout(() => {
  console.log("B"); // 5. Macrotask queue
}, 0);

Promise.resolve().then(() => {
  console.log("C"); // 3. Microtask queue
});

console.log("D"); // 2. Synchronous call stack

// Output Execution Order: A, D, C, B`,
    whyCorrect: `\`setTimeout(..., 0)\` specifies a minimum delay before queuing a macrotask. Synchronous stack execution completes first, then all pending microtasks flush before the event loop picks up the timer macrotask.`,
    commonMisconceptions: `Developers often assume \`setTimeout(fn, 0)\` executes immediately after the current line of code. In reality, it yields to the task queue, executing only AFTER synchronous code AND all pending microtasks complete.`,
    followUpQuestions: [
      'Why does Promise.then() execute before setTimeout(..., 0)?',
      'How does Vue 3 use queueMicrotask / Promise microtasks in its nextTick() scheduler?',
      'What happens to browser rendering responsiveness if a microtask recursively enqueues more microtasks?'
    ],
    interviewReadyAnswer: `The JavaScript event loop executes synchronous code on the call stack first. When the call stack empties, all microtasks (Promises, queueMicrotask) are processed to completion before the browser handles rendering and picks up the next macrotask (setTimeout timers).`,
    advancedDiscussion: `Because microtask queues are emptied completely in a single tick before rendering, recursively queuing microtasks (e.g. infinite \`Promise.resolve().then(...)\` loops) starves the event loop, completely blocking browser repaints, user input handling, and macrotask execution.`,
    hints: [
      'Trace Call Stack -> Microtasks (Promises) -> Macrotasks (setTimeout).',
      'Explain why setTimeout(..., 0) is not synchronous.',
      'Explain microtask queue emptying before next macrotask execution.'
    ]
  },
  {
    id: 'vue_q8',
    category: 'Vue 3 Reactivity Model',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['vue3', 'reactivity', 'ref', 'reactive', 'proxies'],
    title: 'What is the difference between ref() and reactive() in Vue 3?',
    directAnswer: 'ref() creates a reactive reference wrapper that can hold primitive values or objects; reactive() creates a reactive proxy object directly.',
    detailedExplanation: `Vue 3 reactivity is powered by ES6 Proxies. \`ref()\` and \`reactive()\` serve complementary reactivity needs:

1. **\`ref()\`)**:
   - Can hold primitive values (\`number\`, \`string\`, \`boolean\`) as well as objects/arrays.
   - Accessing or mutating value in JavaScript requires \`.value\` property access (\`count.value++\`).
   - Automatically unwrapped in Vue templates, so you write \`{{ count }}\` without \`.value\`.
   - If passed an object, \`ref()\` delegates internally to \`reactive()\` for its \`.value\` payload.

2. **\`reactive()\`)**:
   - Takes an object/array and returns a reactive Proxy wrapper.
   - Properties are accessed directly without \`.value\` (\`user.age++\`).
   - Cannot hold primitive values directly (\`reactive(0)\` throws a warning).
   - **Destructuring Pitfall**: Destructuring properties from a \`reactive()\` object directly (\`const { name } = user\`) breaks reactive tracking connections unless wrapped with \`toRefs()\`.`,
    practicalExample: `import { ref, reactive, toRefs } from "vue";

// ref for primitives or reassigned references
const count = ref(0);
count.value++; // .value required in JS script

// reactive for structured objects
const user = reactive({
  name: "Ravi",
  age: 28,
});
user.age++; // Direct access in JS script

// Destructuring safely using toRefs()
const { name, age } = toRefs(user);
// name and age are now refs, preserving reactivity!`,
    whyCorrect: `\`ref()\` wraps primitives inside an object container with getter/setter traps on its \`.value\` property, while \`reactive()\` wraps non-primitive target objects directly inside ES6 Proxies.`,
    commonMisconceptions: `Reassigning an entire \`reactive()\` object (\`user = reactive({ ... })\`) destroys Vue's reactive proxy tracking link. To preserve reactivity when reassigning objects, either use \`ref()\` or update individual properties inside \`reactive()\`.`,
    followUpQuestions: [
      'Why does destructuring a reactive() object break reactivity, and how does toRefs() resolve it?',
      'How does ref automatic template unwrapping work, and what are its edge case exceptions in arrays or nested maps?',
      'When would you choose ref() over reactive() in enterprise composables?'
    ],
    interviewReadyAnswer: `\`ref()\` creates a reactive container for primitives or objects accessed via \`.value\` in JS and unwrapped in templates. \`reactive()\` creates a reactive Proxy object for structured data. Use \`toRefs()\` when destructuring reactive objects to preserve reactivity.`,
    advancedDiscussion: `Many Vue core team members and composable authors prefer using \`ref()\` consistently for all state variables. \`ref()\` allows total reference reassignments (\`posts.value = newArray\`) without breaking reactive tracking links, eliminating the destructuring pitfalls inherent to \`reactive()\`.`,
    hints: [
      'Compare ref (.value required in JS, works on primitives) vs reactive (objects only, direct access).',
      'Explain template unwrapping.',
      'Explain destructuring pitfall and toRefs().'
    ]
  },
  {
    id: 'vue_q9',
    category: 'Vue Template Syntax & Directives',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['vue3', 'directives', 'v-if', 'v-show', 'v-for', 'v-model'],
    title: 'Explain Vue directives.',
    directAnswer: 'Vue directives are special HTML attributes prefixed with v- that apply reactive conditional rendering, list rendering, data binding, and event handling in templates.',
    detailedExplanation: `Directives encapsulate DOM manipulation and template behavior in Vue:

1. **Conditional Rendering**:
   - \`v-if\`, \`v-else-if\`, \`v-else\`: Real conditional rendering that mounts or destroys DOM elements dynamically.
   - \`v-show\`: Toggles element visibility by switching the CSS \`display\` property (\`display: none\`). Prefers elements that toggle frequently.

2. **List Rendering**:
   - \`v-for="item in items" :key="item.id"\`: Renders list arrays/objects.
   - **Stable Keys**: Always bind a unique, stable \`:key\` (e.g. \`item.id\`) to help Vue's virtual DOM diffing algorithm reuse DOM nodes efficiently.

3. **Data & Event Binding**:
   - \`v-bind\` (shorthand \`:\`): Dynamically binds attributes (\`:src="imageUrl"\`, \`:disabled="isSubmitting"\`).
   - \`v-on\` (shorthand \`@\`): Attaches event listeners (\`@click="handleSubmit"\`).
   - \`v-model\`: Enables two-way data binding on form inputs, automatically syncing element value and component reactive state.`,
    practicalExample: `<script setup>
import { ref } from "vue";

const search = ref("");
const items = ref([
  { id: 1, text: "Vue 3 Composition API" },
  { id: 2, text: "TypeScript Integration" },
]);
</script>

<template>
  <div class="search-widget">
    <!-- Two-way binding with v-model -->
    <input v-model="search" placeholder="Type to search..." />

    <!-- Conditional rendering with v-if -->
    <p v-if="search">Searching for: {{ search }}</p>

    <!-- List rendering with v-for and stable :key -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </ul>

    <!-- Event handling shorthand @ -->
    <button @click="search = ''">Clear Search</button>
  </div>
</template>`,
    whyCorrect: `Directives instruct Vue's template compiler to generate Virtual DOM render functions that reactively patch DOM nodes when state changes.`,
    commonMisconceptions: `Never use \`v-if\` and \`v-for\` on the exact same HTML element. In Vue 3, \`v-if\` has higher priority than \`v-for\`, so the \`v-if\` condition cannot access variables defined inside the \`v-for\` scope. Wrap the list in a \`<template v-for="...">\` or filter items with computed properties instead.`,
    followUpQuestions: [
      'Why is using index as :key in v-for problematic when list items are reordered or deleted?',
      'Why should v-if and v-for never be placed on the same DOM element in Vue 3?',
      'How does v-model work under the hood on standard <input> elements vs custom components?'
    ],
    interviewReadyAnswer: `Vue directives (like \`v-if\`, \`v-show\`, \`v-for\`, \`v-model\`, \`v-bind\`, and \`v-on\`) provide reactive template behavior. Use \`v-show\` for frequent visibility toggles, always specify stable \`:key\` identifiers in \`v-for\`, and avoid placing \`v-if\` and \`v-for\` on the same element.`,
    advancedDiscussion: `Vue also supports Custom Directives (\`v-focus\`, \`v-click-outside\`) defined with lifecycle hooks like \`mounted(el, binding)\`. Custom directives provide clean imperative DOM access when encapsulating low-level browser API hooks like clicking outside dropdown menus or auto-focusing inputs.`,
    hints: [
      'Differentiate v-if (DOM mounting) vs v-show (CSS display).',
      'Highlight stable :key in v-for list rendering.',
      'Explain why v-if and v-for on the same element is an anti-pattern.'
    ]
  },
  {
    id: 'vue_q10',
    category: 'CSS Architecture & Framework Selection',
    badge: 'Reported Question',
    difficulty: 'Easy',
    topicTags: ['css', 'styling', 'tailwind', 'bootstrap', 'vuetify', 'architecture'],
    title: 'What are CSS libraries, and how do you choose one?',
    directAnswer: 'CSS frameworks and component libraries provide reusable styling systems or UI components. Choice depends on customization needs, design requirements, accessibility, bundle size, and team familiarity.',
    detailedExplanation: `CSS libraries streamline frontend UI styling. They fall into distinct architectural categories:

1. **Component UI Frameworks (e.g. Vuetify, Bootstrap)**:
   - Provide pre-styled UI components (buttons, dropdowns, modals, navbars).
   - **Vuetify**: A Vue-oriented UI component framework implementing Material Design with built-in Vue components and accessibility defaults.
   - **Bootstrap**: Traditional component framework with pre-styled classes and grid layouts.
   - Trade-off: Provides fast scaffolding, but customization can require overriding complex default opinionated CSS selectors.

2. **Utility-First CSS Frameworks (e.g. Tailwind CSS)**:
   - Provides low-level utility classes (\`flex\`, \`pt-4\`, \`bg-blue-500\`, \`hover:opacity-80\`).
   - High customization without leaving template HTML.
   - Tree-shakes unused CSS at build time via PurgeCSS/Tailwind compiler, resulting in extremely tiny production CSS bundles (~10-15kb).

3. **Plain CSS / CSS Modules / Scoped CSS**:
   - Best when full design system control is needed, or bundle size overhead must be minimized without external framework dependencies.`,
    practicalExample: `<!-- Utility-First (Tailwind CSS) -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
  Submit Action
</button>

<!-- Component Framework (Vuetify Vue Component) -->
<template>
  <v-btn color="primary" variant="elevated" @click="submit">
    Submit Action
  </v-btn>
</template>`,
    whyCorrect: `Selecting a library requires balancing development speed against design flexibility, CSS bundle size, accessibility standards, and long-term maintenance overhead.`,
    commonMisconceptions: `Vuetify and Tailwind CSS belong to different library categories: Vuetify is a Vue-specific UI component framework with pre-built components, whereas Tailwind CSS is a utility-first CSS styling system applicable across any framework.`,
    followUpQuestions: [
      'How does Tailwind CSS tree-shaking achieve small production CSS bundles compared to traditional Bootstrap bundles?',
      'What are the advantages of Vue Scoped CSS (<style scoped>) over global CSS files?',
      'When is plain CSS or CSS Modules preferable over adopting a full framework?'
    ],
    interviewReadyAnswer: `CSS libraries include utility-first frameworks like Tailwind CSS (flexible, small production bundle) and component frameworks like Vuetify (Vue-specific pre-styled Material Design components). Framework selection balances development velocity, design customization, accessibility, and production bundle footprint.`,
    advancedDiscussion: `Modern design systems often combine utility-first CSS with unstyled headless component libraries (such as Radix, Headless UI, or PrimeVue Unstyled). This provides built-in ARIA accessibility and keyboard focus management while allowing full custom styling with Tailwind CSS.`,
    hints: [
      'Distinguish Utility-First (Tailwind) vs Component Frameworks (Vuetify, Bootstrap).',
      'Clarify that Vuetify is a Vue UI component framework.',
      'Explain evaluation criteria: velocity, bundle size, accessibility, customization.'
    ]
  },
  {
    id: 'vue_q11',
    category: 'JavaScript Object Manipulation & Memory Management',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['javascript', 'objects', 'shallow-copy', 'deep-copy', 'structuredClone'],
    title: 'What is the difference between a shallow copy and a deep copy?',
    directAnswer: 'A shallow copy duplicates the top-level properties of an object while keeping references to nested objects; a deep copy recursively duplicates all nested objects and values.',
    detailedExplanation: `In JavaScript memory management, copying objects determines whether memory references are shared:

1. **Shallow Copy**:
   - Duplicates primitive values on the top level.
   - For nested objects or arrays, it copies memory pointer **references**, meaning modifying a nested property on the copy STILL mutates the original object.
   - Methods: Object spread (\`{ ...original }\`), \`Object.assign({}, original)\`, \`Array.prototype.slice()\`.

2. **Deep Copy**:
   - Recursively copies all nested objects, creating completely independent memory addresses at every level.
   - Methods:
     - **\`structuredClone(original)\`**: Native JavaScript API supported in modern browsers/Node.js. Supports nested objects, Arrays, Dates, Maps, Sets, and ArrayBuffers.
     - **\`JSON.parse(JSON.stringify(original))\`**: Legacy deep copy workaround. **Limitations**: Strips functions, \`undefined\`, \`Symbol\` keys, turns \`Date\` objects into strings, and throws on circular references.`,
    practicalExample: `const original = {
  name: "Anand",
  address: { city: "Hyderabad" }
};

// Shallow Copy
const shallow = { ...original };
shallow.address.city = "Pune";
console.log(original.address.city); // "Pune" (Original mutated due to shared nested reference!)

// Deep Copy using native structuredClone
const deep = structuredClone(original);
deep.address.city = "Delhi";
console.log(original.address.city); // "Pune" (Original protected!)`,
    whyCorrect: `Shallow copying copies object memory addresses for nested properties, while deep copying allocates new memory objects across the entire nested property graph.`,
    commonMisconceptions: `Assuming \`JSON.parse(JSON.stringify(obj))\` is a safe universal deep copy method is dangerous. It silently drops functions and \`undefined\` values, converts \`RegExp\` to empty objects, converts \`Date\` instances to ISO strings, and crashes on circular references. Use \`structuredClone()\` instead.`,
    followUpQuestions: [
      'What data types are unsupported by structuredClone() (e.g. DOM nodes, Functions, Proxies)?',
      'Why is JSON.parse(JSON.stringify()) unsafe for deep copying complex objects?',
      'How does immutable state updating work in Vue/React state management?'
    ],
    interviewReadyAnswer: `A shallow copy (via spread \`{ ...obj }\`) duplicates top-level properties but retains shared references to nested objects. A deep copy (via \`structuredClone()\`) recursively duplicates all nested structures into independent memory addresses.`,
    advancedDiscussion: `While \`structuredClone()\` is the modern standard, it cannot clone functions, DOM nodes, or ES6 getters/setters/Proxies (throwing a DataCloneError). In state management libraries, immutable updates leverage structural sharing libraries like Immer to freeze and update tree nodes efficiently without full manual clone overhead.`,
    hints: [
      'Explain nested reference sharing in shallow copy ({ ...obj }).',
      'Explain native structuredClone() API and deep duplication.',
      'List limitations of JSON.parse(JSON.stringify()).'
    ]
  },
  {
    id: 'vue_q12',
    category: 'JavaScript Asynchronous Programming & Promises',
    badge: 'Reported Question',
    difficulty: 'Medium',
    topicTags: ['javascript', 'promises', 'async-await', 'try-catch', 'error-handling'],
    title: 'What are Promises and async/await?',
    directAnswer: 'A Promise represents the eventual completion or failure of an asynchronous operation. async/await is syntactic sugar over Promises that allows writing asynchronous code sequentially.',
    detailedExplanation: `Asynchronous operations (HTTP requests, timers, file reading) rely on Promises and \`async/await\`:

1. **Promise States**:
   - **Pending**: Initial state, operation incomplete.
   - **Fulfilled**: Operation completed successfully (\`resolve(value)\`).
   - **Rejected**: Operation failed (\`reject(error)\`).
   - Promises are immutable once settled (cannot transition from fulfilled to rejected or vice versa).

2. **Async / Await Syntax**:
   - Marking a function \`async\` guarantees it automatically returns a Promise.
   - The \`await\` keyword pauses \`async\` function execution until the awaited Promise settles, returning its fulfilled value or throwing its rejected reason.
   - Errors are caught using standard synchronous \`try / catch / finally\` blocks.

3. **Error Propagation**:
   - Uncaught promise rejections inside \`async\` functions propagate up to the caller unless handled inside \`try/catch\` or appended with \`.catch()\`.`,
    practicalExample: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error status: \${response.status}\`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    // Re-throw or handle error appropriately—never swallow errors silently!
    throw error;
  } finally {
    console.log("Cleanup: fetchUserData operation concluded.");
  }
}`,
    whyCorrect: `\`async/await\` converts asynchronous callback chaining (\`.then().catch()\`) into clean sequential try/catch control flow while operating natively on top of JavaScript Promises.`,
    commonMisconceptions: `A common mistake is silently swallowing errors inside empty catch blocks (\`catch (err) {}\`). Doing so hides network and parsing failures, making application debugging difficult and leaving UI callers in indefinite loading states.`,
    followUpQuestions: [
      'Why does an async function always return a Promise, even if you explicitly return a primitive string or number?',
      'What is the difference between returning await promise vs returning promise directly inside an async function?',
      'Why should you check response.ok when using window.fetch()?'
    ],
    interviewReadyAnswer: `A Promise represents an eventual asynchronous result in pending, fulfilled, or rejected state. \`async/await\` provides sequential syntax for handling Promises using \`try/catch/finally\` blocks, improving readability over nested \`.then()\` promise chains.`,
    advancedDiscussion: `Returning \`await promise\` inside a \`try/catch\` block ensures that promise rejections are caught locally inside that function\'s catch block. Returning \`promise\` directly without \`await\` bypasses the local \`try/catch\`, causing rejections to bubble up directly to the outer caller.`,
    hints: [
      'List 3 Promise states: Pending, Fulfilled, Rejected.',
      'Explain async functions always return a Promise.',
      'Emphasize try/catch error handling and why response.ok check is required.'
    ]
  },
  {
    id: 'vue_q13',
    category: 'JavaScript Promise Combinators & HTTP Fetch',
    badge: 'Reported Question',
    difficulty: 'Hard',
    topicTags: ['javascript', 'promises', 'promise-all', 'promise-allsettled', 'promise-race', 'promise-any', 'fetch'],
    title: 'Explain Promise.all(), allSettled(), race(), and any().',
    directAnswer: 'Promise combinators process multiple concurrent Promises with different fulfillment and rejection behaviors.',
    detailedExplanation: `JavaScript provides 4 promise combinator methods to handle concurrent asynchronous tasks:

1. **\`Promise.all([p1, p2])\`**:
   - **Behavior**: Short-circuits on first rejection. Fulfills only when ALL input promises fulfill (returning an array of fulfilled values). Rejects immediately if ANY input promise rejects.
   - Use Case: Dependent parallel API calls where all data is mandatory.

2. **\`Promise.allSettled([p1, p2])\`**:
   - **Behavior**: Never short-circuits. Waits for ALL promises to settle (fulfill or reject). Returns an array of objects detailing \`status: 'fulfilled'\` or \`status: 'rejected'\`.
   - Use Case: Dashboard widgets where independent failures should not break other successful widgets.

3. **\`Promise.race([p1, p2])\`**:
   - **Behavior**: Settles according to whichever input promise settles FIRST (whether fulfilled OR rejected).
   - Use Case: Request timeouts (racing an API request against a timer promise).

4. **\`Promise.any([p1, p2])\`**:
   - **Behavior**: Short-circuits on first fulfillment. Fulfills with the value of the FIRST fulfilled promise. Rejects ONLY if ALL input promises reject (throwing an \`AggregateError\`).
   - Use Case: Fetching data from multiple redundant CDN mirrors.

5. **Fetch HTTP Handling**:
   - \`fetch()\` only rejects on network failures (offline, DNS failure). HTTP 404 or 500 error responses DO NOT reject \`fetch()\`. You must explicitly check \`if (!response.ok)\` and throw an error.`,
    practicalExample: `const fetchPosts = fetch("https://jsonplaceholder.typicode.com/posts");
const fetchUsers = fetch("https://jsonplaceholder.typicode.com/users");

// 1. Promise.allSettled for safe parallel request handling
async function loadDashboardData() {
  const results = await Promise.allSettled([fetchPosts, fetchUsers]);

  results.forEach((res, idx) => {
    if (res.status === "fulfilled") {
      console.log(\`Request \${idx} succeeded:\`, res.value.status);
    } else {
      console.error(\`Request \${idx} failed:\`, res.reason);
    }
  });
}

// 2. Checking response.ok for HTTP errors
async function fetchSafe(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP Status Error: \${response.status}\`);
  }
  return await response.json();
}`,
    whyCorrect: `Each combinator satisfies specific concurrency needs: Promise.all requires all-or-nothing success, allSettled aggregates total batch outcomes, race selects the fastest responder, and any selects the first successful result.`,
    commonMisconceptions: `Believing \`fetch()\` throws an error on 404 or 500 responses is a major bug in many applications. \`fetch()\` resolves successfully for any HTTP response received; developers must manually check \`response.ok\` (\`status\` 200-299).`,
    followUpQuestions: [
      'Why does window.fetch() resolve successfully on HTTP 404/500 status codes instead of rejecting?',
      'When should you use Promise.allSettled() instead of Promise.all() in multi-widget dashboards?',
      'What error type is thrown by Promise.any() when all input promises reject?'
    ],
    interviewReadyAnswer: `\`Promise.all\` fails fast on any rejection; \`Promise.allSettled\` waits for all inputs to settle; \`Promise.race\` resolves with the first settled item; and \`Promise.any\` resolves with the first fulfilled item. Remember that \`fetch()\` resolves on HTTP 404/500 errors, so always check \`response.ok\`.`,
    advancedDiscussion: `When making multiple concurrent requests with \`Promise.all\`, an error in one request immediately rejects the outer promise, but the browser network requests for the remaining promises continue running unless explicitly cancelled using \`AbortController\` signals.`,
    hints: [
      'Compare all (fail fast) vs allSettled (wait for all) vs race (fastest settled) vs any (fastest fulfilled).',
      'Explain fetch() HTTP 404/500 behavior vs network rejection.',
      'Emphasize response.ok check.'
    ]
  }
];

export const SUPPLEMENTARY_MCQS: MCQQuestion[] = [
  // Topic 1: Object.freeze()
  {
    id: 'vue_mcq_1a',
    topicTag: 'object-freeze',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Object.freeze() Scope',
    questionText: 'What happens when you call Object.freeze(obj) on an object with nested child objects?',
    options: [
      'Both the top-level object and all nested child objects are recursively frozen.',
      'Only the top-level properties are frozen; nested child objects remain mutable unless explicitly frozen.',
      'An exception is thrown if the object contains nested child objects.',
      'The object is converted into a ReadOnly Proxy.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Object.freeze() performs a shallow freeze. Top-level properties are immutable, but properties on nested child objects can still be mutated.',
    optionExplanations: [
      'Incorrect: Object.freeze is shallow, not deep.',
      'Correct: Nested objects remain mutable unless a recursive deep-freeze is executed.',
      'Incorrect: Object.freeze does not throw errors on nested objects.',
      'Incorrect: Object.freeze modifies property descriptors directly, it does not return a Proxy.'
    ]
  },
  {
    id: 'vue_mcq_1b',
    topicTag: 'object-freeze',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Strict Mode Behavior with Object.freeze()',
    questionText: 'What occurs in ES module JavaScript code when attempting to modify a property on an object frozen with Object.freeze()?',
    options: [
      'The modification succeeds silently.',
      'The property is deleted.',
      'A TypeError is thrown.',
      'The object is unfrozen automatically.'
    ],
    correctAnswerIndex: 2,
    explanation: 'ES modules always execute in strict mode. Attempting to assign a value to a non-writable frozen property in strict mode throws a TypeError.',
    optionExplanations: [
      'Incorrect: Silent failure occurs only in legacy non-strict mode.',
      'Incorrect: Frozen objects prevent property deletion.',
      'Correct: Strict mode throws a TypeError when mutating frozen properties.',
      'Incorrect: Objects cannot be unfrozen.'
    ]
  },

  // Topic 2: Ways to Create Objects
  {
    id: 'vue_mcq_2a',
    topicTag: 'object-creation',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Object.create(null) Prototype Chain',
    questionText: 'What is true about an object created using Object.create(null)?',
    options: [
      'It inherits methods from Object.prototype such as toString() and hasOwnProperty().',
      'It has no prototype link, so Object.prototype methods do not exist on it.',
      'It is automatically frozen and cannot be modified.',
      'It can only be instantiated inside ES classes.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Passing `null` to Object.create() creates an object with a null prototype (`[[Prototype]]` = null), preventing inheritance from `Object.prototype`.',
    optionExplanations: [
      'Incorrect: Object.create(null) explicitly removes Object.prototype inheritance.',
      'Correct: It creates a pure dictionary with no prototype properties or methods.',
      'Incorrect: The object remains extensible and mutable.',
      'Incorrect: Object.create(null) can be called anywhere in JavaScript.'
    ]
  },
  {
    id: 'vue_mcq_2b',
    topicTag: 'object-creation',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'ES6 Class Under the Hood',
    questionText: 'What underlying JavaScript mechanism powers ES6 class syntax?',
    options: [
      'Class-based classical OOP runtime inheritance',
      'Prototype-based inheritance and constructor functions',
      'WebAssembly binary descriptors',
      'Java Virtual Machine bytecode'
    ],
    correctAnswerIndex: 1,
    explanation: 'ES6 classes are syntactic sugar built over JavaScript\'s existing prototype-based inheritance model.',
    optionExplanations: [
      'Incorrect: JavaScript remains prototype-based at runtime.',
      'Correct: Classes are syntactic sugar over constructor functions and prototype objects.',
      'Incorrect: WebAssembly is unrelated to JS class syntax.',
      'Incorrect: JavaScript engines execute JS AST/bytecode, not JVM bytecode.'
    ]
  },

  // Topic 3: display: none vs visibility: hidden
  {
    id: 'vue_mcq_3a',
    topicTag: 'css-layout',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'CSS Layout Flow & Visibility',
    questionText: 'Which CSS property hides an element while preserving its layout dimensions in the document?',
    options: [
      'display: none',
      'visibility: hidden',
      'position: absolute',
      'float: left'
    ],
    correctAnswerIndex: 1,
    explanation: '`visibility: hidden` makes an element invisible while maintaining its layout space. `display: none` removes it from layout flow completely.',
    optionExplanations: [
      'Incorrect: display: none removes the element from document layout flow.',
      'Correct: visibility: hidden preserves layout dimensions while making pixels transparent.',
      'Incorrect: position: absolute removes element from normal flow, but does not hide it.',
      'Incorrect: float: left positions elements leftward in normal flow.'
    ]
  },
  {
    id: 'vue_mcq_3b',
    topicTag: 'css-layout',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Child Visibility Override',
    questionText: 'Can a child element be made visible if its parent element sets visibility: hidden?',
    options: [
      'No, children can never be visible if a parent is hidden.',
      'Yes, if the child explicitly sets visibility: visible.',
      'Yes, but only if the child sets display: none.',
      'No, unless the browser window is resized.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Unlike `display: none`, child elements inside a `visibility: hidden` parent CAN override visibility by specifying `visibility: visible`.',
    optionExplanations: [
      'Incorrect: Children CAN override visibility: hidden.',
      'Correct: Setting visibility: visible on a child causes it to render even if its parent is visibility: hidden.',
      'Incorrect: display: none hides elements.',
      'Incorrect: Window resizing does not alter CSS visibility inheritance.'
    ]
  },

  // Topic 4: Vue 3 Lifecycle Hooks
  {
    id: 'vue_mcq_4a',
    topicTag: 'vue-lifecycle',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Vue 3 Cleanup Lifecycle Hook',
    questionText: 'Which Composition API hook should be used to clear setInterval timers or global event listeners before a component is destroyed?',
    options: [
      'onMounted()',
      'onUpdated()',
      'onUnmounted()',
      'onErrorCaptured()'
    ],
    correctAnswerIndex: 2,
    explanation: '`onUnmounted()` executes after the component instance is unmounted, making it the correct place to clear timers and event listeners to prevent memory leaks.',
    optionExplanations: [
      'Incorrect: onMounted runs when inserted into DOM.',
      'Incorrect: onUpdated runs after reactive DOM patches.',
      'Correct: onUnmounted handles cleanup of side effects like timers and event listeners.',
      'Incorrect: onErrorCaptured handles component tree error boundaries.'
    ]
  },
  {
    id: 'vue_mcq_4b',
    topicTag: 'vue-lifecycle',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Options API Created Equivalent in Composition API',
    questionText: 'What replaces the Options API created() hook in Vue 3 <script setup>?',
    options: [
      'onCreated()',
      'The top-level code inside <script setup> itself',
      'onBeforeMount()',
      'onRenderTriggered()'
    ],
    correctAnswerIndex: 1,
    explanation: 'In `<script setup>`, code at the top level executes synchronously during component instantiation, replacing `beforeCreate` and `created`.',
    optionExplanations: [
      'Incorrect: onCreated hook does not exist in Vue 3 Composition API.',
      'Correct: The body of <script setup> runs during instantiation, serving as the created phase.',
      'Incorrect: onBeforeMount runs later, right before DOM insertion.',
      'Incorrect: onRenderTriggered is a dev debug hook.'
    ]
  },

  // Topic 5: Components, Props & Emits
  {
    id: 'vue_mcq_5a',
    topicTag: 'vue-components',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Vue 3 Props Mutability Rule',
    questionText: 'What happens if a child component attempts to mutate a prop directly (e.g. props.title = "New")?',
    options: [
      'The parent component automatically updates its state.',
      'Vue issues a runtime warning because props are read-only under One-Way Data Flow rules.',
      'The browser reloads the page.',
      'The prop converts into a reactive ref.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Props are read-only. Mutating props directly inside a child violates One-Way Data Flow and triggers a Vue runtime warning.',
    optionExplanations: [
      'Incorrect: Parent state does not update automatically via prop mutation.',
      'Correct: Vue logs a warning against mutating read-only props.',
      'Incorrect: Browsers do not reload on prop mutation.',
      'Incorrect: Mutating a prop does not convert it into a ref.'
    ]
  },
  {
    id: 'vue_mcq_5b',
    topicTag: 'vue-components',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Emitting Events in <script setup>',
    questionText: 'Which macro is used to define custom emitted events inside Vue 3 <script setup>?',
    options: [
      'defineProps()',
      'defineEmits()',
      'useEmits()',
      'exportEvent()'
    ],
    correctAnswerIndex: 1,
    explanation: '`defineEmits()` is a compiler macro in `<script setup>` used to declare and invoke event emissions.',
    optionExplanations: [
      'Incorrect: defineProps declares incoming props.',
      'Correct: defineEmits declares emitted event names and returns the emit function.',
      'Incorrect: useEmits is not a valid Vue 3 API.',
      'Incorrect: exportEvent is not a valid Vue 3 API.'
    ]
  },

  // Topic 6: Semantic HTML
  {
    id: 'vue_mcq_6a',
    topicTag: 'semantic-html',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Semantic Main Element Constraint',
    questionText: 'How many visible <main> landmark elements should exist on a single HTML document page?',
    options: [
      'Unlimited',
      'Exactly one visible <main> element representing the primary content',
      'At least three',
      '<main> elements are not allowed in HTML5'
    ],
    correctAnswerIndex: 1,
    explanation: 'A document must contain only one visible `<main>` element, representing the dominant content unique to that document.',
    optionExplanations: [
      'Incorrect: Multiple visible main landmarks create screen reader navigation ambiguity.',
      'Correct: Exactly one main content landmark should be visible per document.',
      'Incorrect: Three main elements violate semantic HTML guidelines.',
      'Incorrect: main is a core standard HTML5 element.'
    ]
  },
  {
    id: 'vue_mcq_6b',
    topicTag: 'semantic-html',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Native <button> vs <div @click>',
    questionText: 'Why is using a native <button> tag superior to a <div @click="..."> for interactive triggers?',
    options: [
      'Div tags automatically trigger form submissions on mobile browsers.',
      'Native <button> elements provide automatic keyboard focus, Enter/Space key triggers, and accessibility tree roles.',
      'Div tags cannot be styled with CSS.',
      'Button tags run faster on the GPU.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Native `<button>` elements include keyboard focus (Tab), Enter/Space key activation, and standard `button` accessibility roles out of the box.',
    optionExplanations: [
      'Incorrect: Divs do not trigger form submissions.',
      'Correct: Native buttons provide built-in keyboard accessibility and screen reader support.',
      'Incorrect: Div tags can easily be styled with CSS.',
      'Incorrect: GPU rendering is unrelated to element tag semantics.'
    ]
  },

  // Topic 7: Event Loop
  {
    id: 'vue_mcq_7a',
    topicTag: 'event-loop',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Microtask vs Macrotask Order',
    questionText: 'Given `setTimeout(fn, 0)` and `Promise.resolve().then(fn)`, which callback executes first when the call stack clears?',
    options: [
      'The setTimeout callback because it was declared first.',
      'The Promise callback because microtasks are processed completely before the next macrotask.',
      'They execute in random order.',
      'They execute simultaneously on multi-core threads.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Promise callbacks are microtasks. The event loop flushes the entire microtask queue before picking up macrotasks like `setTimeout`.',
    optionExplanations: [
      'Incorrect: Microtask priority overrides macrotasks regardless of declaration order.',
      'Correct: Promise reactions are microtasks and execute before macrotasks.',
      'Incorrect: Execution order is deterministic according to event loop specification.',
      'Incorrect: JavaScript execution on the main thread is single-threaded.'
    ]
  },
  {
    id: 'vue_mcq_7b',
    topicTag: 'event-loop',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Microtask Queue Starvation',
    questionText: 'What happens if a Promise microtask recursively calls `queueMicrotask()` indefinitely?',
    options: [
      'The event loop processes macrotasks normally.',
      'The browser call stack overflows immediately.',
      'The microtask queue never empties, blocking browser repaints and freezing user input.',
      'The browser automatically converts microtasks into Web Workers.'
    ],
    correctAnswerIndex: 2,
    explanation: 'Because the event loop must empty the microtask queue completely before rendering or picking up macrotasks, infinite microtasks freeze the UI thread.',
    optionExplanations: [
      'Incorrect: Macrotasks cannot execute while microtasks remain in queue.',
      'Incorrect: Call stack overflows happen with synchronous recursive call stacks, not queued microtasks.',
      'Correct: Infinite microtasks starve the event loop, freezing rendering and user input handling.',
      'Incorrect: Event loop microtasks do not spawn Web Workers.'
    ]
  },

  // Topic 8: Vue 3 Reactivity (ref vs reactive)
  {
    id: 'vue_mcq_8a',
    topicTag: 'vue-reactivity',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Accessing ref() in JavaScript vs Templates',
    questionText: 'How do you access or update the value of a ref variable named `count` inside JavaScript vs inside a Vue template?',
    options: [
      'count in JS, count.value in template',
      'count.value in JS, count in template (due to automatic unwrapping)',
      'count.value in both JS and template',
      'count() as a function call in both'
    ],
    correctAnswerIndex: 1,
    explanation: 'In JavaScript code, refs require `.value` access. In Vue templates, top-level refs are automatically unwrapped, allowing `{{ count }}` without `.value`.',
    optionExplanations: [
      'Incorrect: Reverse of actual behavior.',
      'Correct: JS requires count.value; templates auto-unwrap count.',
      'Incorrect: Templates do not require .value for top-level refs.',
      'Incorrect: Refs are containers with .value properties, not functions.'
    ]
  },
  {
    id: 'vue_mcq_8b',
    topicTag: 'vue-reactivity',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Destructuring reactive() Objects',
    questionText: 'What utility function should be wrapped around a `reactive()` object before destructuring its properties to maintain reactivity?',
    options: [
      'toRefs()',
      'unref()',
      'toRaw()',
      'readonly()'
    ],
    correctAnswerIndex: 0,
    explanation: '`toRefs()` converts each property of a reactive object into an equivalent ref, allowing destructuring while preserving reactive tracking links.',
    optionExplanations: [
      'Correct: toRefs() converts object properties to refs, preserving reactivity upon destructuring.',
      'Incorrect: unref() unwraps a ref if it is a ref, otherwise returns value.',
      'Incorrect: toRaw() returns the raw non-reactive object.',
      'Incorrect: readonly() makes an object immutable, but does not solve destructuring loss.'
    ]
  },

  // Topic 9: Vue Directives
  {
    id: 'vue_mcq_9a',
    topicTag: 'vue-directives',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'v-if vs v-show DOM Behavior',
    questionText: 'What is the key difference in DOM rendering between v-if="false" and v-show="false"?',
    options: [
      'v-if sets visibility: hidden; v-show sets display: none.',
      'v-if unmounts and removes the DOM element; v-show keeps the element in DOM and applies CSS display: none.',
      'v-if only works on text nodes; v-show only works on images.',
      'v-show deletes the element from memory.'
    ],
    correctAnswerIndex: 1,
    explanation: '`v-if` conditionally mounts or unmounts elements in the DOM tree. `v-show` toggles the element\'s inline CSS `display` property (`display: none`).',
    optionExplanations: [
      'Incorrect: v-if unmounts element, v-show sets display: none.',
      'Correct: v-if adds/removes elements from DOM; v-show toggles CSS display.',
      'Incorrect: Directives work on any valid template element.',
      'Incorrect: v-show retains the element in DOM.'
    ]
  },
  {
    id: 'vue_mcq_9b',
    topicTag: 'vue-directives',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'v-for Stable Key Purpose',
    questionText: 'Why is providing a unique :key attribute mandatory when using v-for list rendering?',
    options: [
      'It allows CSS grid to order elements alphabetically.',
      'It gives Vue\'s virtual DOM diffing algorithm a hint to track node identities and reuse elements efficiently during updates.',
      'It automatically formats list items as JSON strings.',
      'It enables multi-threading on the list array.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Stable keys allow Vue\'s virtual DOM algorithm to identify which list nodes were modified, reordered, or deleted, ensuring correct state preservation and performance.',
    optionExplanations: [
      'Incorrect: Keys are used for VDOM diffing, not CSS grid sorting.',
      'Correct: Stable keys enable virtual DOM node tracking and efficient element reuse.',
      'Incorrect: Keys do not format items to JSON.',
      'Incorrect: JavaScript remains single-threaded.'
    ]
  },

  // Topic 10: CSS Framework Selection
  {
    id: 'vue_mcq_10a',
    topicTag: 'css-frameworks',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Vuetify Framework Classification',
    questionText: 'How is Vuetify classified within the Vue ecosystem?',
    options: [
      'A utility-first CSS preprocessor like Sass',
      'A Vue UI component framework implementing Material Design',
      'A Node.js database ORM',
      'A state management library like Pinia'
    ],
    correctAnswerIndex: 1,
    explanation: 'Vuetify is a Vue UI component framework that offers pre-styled Material Design Vue components out of the box.',
    optionExplanations: [
      'Incorrect: Vuetify provides pre-built UI components, not a Sass compiler.',
      'Correct: Vuetify is a Vue-oriented Material Design component library.',
      'Incorrect: Vuetify is a frontend UI library, not a database ORM.',
      'Incorrect: Pinia handles state management.'
    ]
  },
  {
    id: 'vue_mcq_10b',
    topicTag: 'css-frameworks',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Tailwind CSS Production Bundle Efficiency',
    questionText: 'How does Tailwind CSS maintain small production bundle sizes despite providing thousands of utility classes?',
    options: [
      'It loads utility classes dynamically from an external runtime CDN.',
      'Its build process scans source files and prunes/tree-shakes unreferenced CSS utility classes.',
      'It compiles utility classes into binary WebAssembly.',
      'It restricts applications to 10 utility classes max.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Tailwind CSS scans HTML/template source files at build time and strips out all unused CSS class rules, yielding a minimal production CSS bundle.',
    optionExplanations: [
      'Incorrect: Tailwind bundles local CSS; relying on runtime CDN is an anti-pattern for production.',
      'Correct: Tailwind prunes unreferenced CSS classes during build time.',
      'Incorrect: WebAssembly is not used for CSS rules.',
      'Incorrect: Tailwind allows unlimited utility classes in source code.'
    ]
  },

  // Topic 11: Object Copying
  {
    id: 'vue_mcq_11a',
    topicTag: 'object-copying',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Shallow Copying via Spread',
    questionText: 'If `const clone = { ...original }` is executed on an object with a nested array `original.tags`, what happens when you push an item to `clone.tags`?',
    options: [
      'Only clone.tags is updated; original.tags remains unchanged.',
      'Both clone.tags and original.tags are updated because spread creates a shallow copy sharing nested memory references.',
      'A TypeError is thrown.',
      'original.tags is deleted.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Spread syntax `{ ...obj }` performs a shallow copy. Nested arrays/objects share memory references, so mutating `clone.tags` mutates `original.tags`.',
    optionExplanations: [
      'Incorrect: Spread does NOT clone nested objects/arrays.',
      'Correct: Nested references are shared, so mutating clone.tags mutates original.tags.',
      'Incorrect: Pushing to an array is valid JS syntax.',
      'Incorrect: Properties are not deleted.'
    ]
  },
  {
    id: 'vue_mcq_11b',
    topicTag: 'object-copying',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Native Deep Cloning API',
    questionText: 'Which modern standard JavaScript global function creates a deep copy of an object including Dates, Maps, Sets, and nested Arrays?',
    options: [
      'Object.assign()',
      'structuredClone()',
      'Object.freeze()',
      'Reflect.clone()'
    ],
    correctAnswerIndex: 1,
    explanation: '`structuredClone()` is the standard native JavaScript browser/Node.js function for deep cloning structured objects.',
    optionExplanations: [
      'Incorrect: Object.assign performs a shallow copy.',
      'Correct: structuredClone() recursively clones complex data structures natively.',
      'Incorrect: Object.freeze shallowly freezes an object in place.',
      'Incorrect: Reflect.clone() does not exist in standard JS.'
    ]
  },

  // Topic 12: Promises & Async/Await
  {
    id: 'vue_mcq_12a',
    topicTag: 'promises',
    badge: 'Supplementary MCQ',
    difficulty: 'Easy',
    title: 'Async Function Return Value',
    questionText: 'What type of value does an `async` function ALWAYS return when invoked?',
    options: [
      'A synchronous string',
      'A Promise',
      'An Array',
      'undefined'
    ],
    correctAnswerIndex: 1,
    explanation: 'Functions declared with `async` always return a Promise. If the function returns a non-Promise primitive value, JS automatically wraps it in a resolved Promise.',
    optionExplanations: [
      'Incorrect: Async functions wrap non-promises into Promises.',
      'Correct: Marking a function async guarantees it returns a Promise.',
      'Incorrect: Async functions do not return arrays unless explicitly returning an array inside.',
      'Incorrect: Async functions return a Promise resolving to undefined if no return statement exists.'
    ]
  },
  {
    id: 'vue_mcq_12b',
    topicTag: 'promises',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Error Handling in Async/Await',
    questionText: 'How are rejected Promises caught when consuming asynchronous code with await syntax?',
    options: [
      'Using window.onerror exclusively',
      'Using standard try / catch blocks around the await statement',
      'Rejected promises cannot be caught when using await',
      'By appending .catch() directly onto the async keyword'
    ],
    correctAnswerIndex: 1,
    explanation: 'When awaiting a rejected Promise, `await` throws the rejection reason as a JavaScript error, which is caught using standard `try / catch` blocks.',
    optionExplanations: [
      'Incorrect: window.onerror is for unhandled global errors.',
      'Correct: try / catch blocks catch rejected promises consumed with await.',
      'Incorrect: Await syntax works seamlessly with try / catch.',
      'Incorrect: .catch() cannot be attached directly to the async keyword.'
    ]
  },

  // Topic 13: Promise Combinators & Fetch
  {
    id: 'vue_mcq_13a',
    topicTag: 'promise-combinators',
    badge: 'Supplementary MCQ',
    difficulty: 'Medium',
    title: 'Promise.all vs Promise.allSettled',
    questionText: 'Which promise combinator waits for ALL input promises to conclude regardless of whether individual promises fulfill or reject?',
    options: [
      'Promise.all()',
      'Promise.allSettled()',
      'Promise.race()',
      'Promise.any()'
    ],
    correctAnswerIndex: 1,
    explanation: '`Promise.allSettled()` waits for every input promise to settle (fulfill or reject) and returns an array of status objects.',
    optionExplanations: [
      'Incorrect: Promise.all short-circuits and rejects immediately if any input rejects.',
      'Correct: Promise.allSettled waits for all inputs to conclude.',
      'Incorrect: Promise.race settles as soon as the first promise settles.',
      'Incorrect: Promise.any settles as soon as the first promise fulfills.'
    ]
  },
  {
    id: 'vue_mcq_13b',
    topicTag: 'promise-combinators',
    badge: 'Supplementary MCQ',
    difficulty: 'Hard',
    title: 'Window.fetch HTTP Error Status Handling',
    questionText: 'When calling `window.fetch(url)`, under what condition will the returned Promise reject?',
    options: [
      'When the server returns an HTTP 404 Not Found response',
      'When the server returns an HTTP 500 Internal Server Error response',
      'When a network failure occurs or the request is blocked by CORS/DNS failure',
      'When the JSON payload is empty'
    ],
    correctAnswerIndex: 2,
    explanation: '`fetch()` only rejects on network failures or blocked requests. HTTP 404 and 500 responses resolve successfully; developers must check `response.ok`.',
    optionExplanations: [
      'Incorrect: HTTP 404 resolves successfully with response.ok = false.',
      'Incorrect: HTTP 500 resolves successfully with response.ok = false.',
      'Correct: fetch() rejections occur strictly on network-level failures or CORS errors.',
      'Incorrect: Empty JSON bodies do not reject fetch.'
    ]
  }
];

export const COMPARISON_EXERCISES: ComparisonExercise[] = [
  {
    title: '1. Object.freeze() vs Recursive Deep Freezing',
    conceptA: 'Object.freeze()',
    conceptB: 'Recursive Deep Freezing',
    comparisonPoints: [
      {
        feature: 'Depth of Operation',
        conceptAVal: 'Shallow; locks top-level properties only.',
        conceptBVal: 'Deep; recursively traverses and freezes all nested object nodes.',
      },
      {
        feature: 'Nested Object Mutation',
        conceptAVal: 'Nested objects remain mutable (e.g. obj.address.city = "New").',
        conceptBVal: 'Nested objects throw TypeError on mutation attempts in strict mode.',
      },
      {
        feature: 'Performance Cost',
        conceptAVal: 'O(1) constant time top-level property descriptor updates.',
        conceptBVal: 'O(N) traversal time across entire nested object graph.',
      },
    ],
    verdict: 'Use Object.freeze() for flat config objects; implement deep freezing or immutable data libraries for complex nested structures.'
  },
  {
    title: '2. display: none vs visibility: hidden vs opacity: 0',
    conceptA: 'display: none',
    conceptB: 'visibility: hidden',
    comparisonPoints: [
      {
        feature: 'Document Layout Space',
        conceptAVal: 'Removed entirely; surrounding elements reflow to fill space.',
        conceptBVal: 'Preserved; element occupies layout width and height.',
      },
      {
        feature: 'Browser Reflow & Repaint',
        conceptAVal: 'Triggers browser layout reflow and repaint.',
        conceptBVal: 'Triggers repaint only (no layout reflow).',
      },
      {
        feature: 'Accessibility & Pointer Events',
        conceptAVal: 'Removed from accessibility tree; no mouse pointer interactions.',
        conceptBVal: 'Hidden from accessibility tree; ignores mouse pointer events.',
      },
    ],
    verdict: 'Use display: none to collapse layouts; use visibility: hidden to reserve layout space while hiding graphics.'
  },
  {
    title: '3. Vue 3 onMounted() vs onUpdated() Hooks',
    conceptA: 'onMounted()',
    conceptB: 'onUpdated()',
    comparisonPoints: [
      {
        feature: 'Execution Trigger',
        conceptAVal: 'Runs ONCE when component finishes initial DOM insertion.',
        conceptBVal: 'Runs MULTIPLE times whenever reactive state updates trigger DOM re-render.',
      },
      {
        feature: 'Primary Use Case',
        conceptAVal: 'Initial API fetches, third-party library DOM init, setting up timers.',
        conceptBVal: 'Inspecting DOM dimensions after dynamic state patches.',
      },
      {
        feature: 'Infinite Loop Risk',
        conceptAVal: 'Safe to update reactive state.',
        conceptBVal: 'Mutating reactive state inside onUpdated can trigger infinite render loops.',
      },
    ],
    verdict: 'Use onMounted() for component initialization; use onUpdated() sparingly for post-patch DOM measurements.'
  },
  {
    title: '4. Vue 3 ref() vs reactive()',
    conceptA: 'ref()',
    conceptB: 'reactive()',
    comparisonPoints: [
      {
        feature: 'Supported Data Types',
        conceptAVal: 'Primitives (string, number, boolean) and Objects/Arrays.',
        conceptBVal: 'Objects, Arrays, Maps, and Sets only (no primitives).',
      },
      {
        feature: 'JavaScript Access Syntax',
        conceptAVal: 'Requires .value access in JS script scope (count.value++).',
        conceptBVal: 'Direct property access in JS script scope (user.age++).',
      },
      {
        feature: 'Destructuring Safety',
        conceptAVal: 'Destructuring maintains reactivity intact.',
        conceptBVal: 'Destructuring loses reactivity tracking unless wrapped in toRefs().',
      },
    ],
    verdict: 'Use ref() by default for primitives and reassignable references; use reactive() for fixed multi-property state objects.'
  },
  {
    title: '5. Vue Directives: v-if vs v-show',
    conceptA: 'v-if',
    conceptB: 'v-show',
    comparisonPoints: [
      {
        feature: 'DOM Mounting Mechanism',
        conceptAVal: 'Conditionally mounts/unmounts DOM nodes dynamically.',
        conceptBVal: 'Always mounts node; toggles CSS inline display: none.',
      },
      {
        feature: 'Initial Render Overhead',
        conceptAVal: 'Lower initial cost if condition is false (node is never mounted).',
        conceptBVal: 'Higher initial render cost (node is always mounted into DOM).',
      },
      {
        feature: 'Toggle Performance',
        conceptAVal: 'Higher toggle cost (destroys and reconstructs VDOM/DOM nodes).',
        conceptBVal: 'Extremely fast toggle cost (switches CSS property).',
      },
    ],
    verdict: 'Use v-if for rare conditions or heavy unmounted subtrees; use v-show for frequent UI visibility toggles.'
  },
  {
    title: '6. Shallow Copy vs Deep Copy',
    conceptA: 'Shallow Copy ({ ...obj })',
    conceptB: 'Deep Copy (structuredClone)',
    comparisonPoints: [
      {
        feature: 'Nested Object Memory',
        conceptAVal: 'Shares memory pointer references with original object.',
        conceptBVal: 'Allocates independent memory copies for all nested nodes.',
      },
      {
        feature: 'Mutation Side Effect',
        conceptAVal: 'Mutating copy.nested.prop mutates original object.',
        conceptBVal: 'Mutating copy.nested.prop keeps original object pristine.',
      },
      {
        feature: 'Performance Cost',
        conceptAVal: 'Fast O(1) top-level property duplication.',
        conceptBVal: 'Slower O(N) recursive object graph clone.',
      },
    ],
    verdict: 'Use shallow copy for immutable top-level updates; use structuredClone() when copying deeply nested state objects.'
  },
  {
    title: '7. Promise.all() vs Promise.allSettled()',
    conceptA: 'Promise.all()',
    conceptB: 'Promise.allSettled()',
    comparisonPoints: [
      {
        feature: 'Failure Behavior',
        conceptAVal: 'Fails fast: rejects immediately if ANY single input promise rejects.',
        conceptBVal: 'Never short-circuits: waits for ALL promises to conclude.',
      },
      {
        feature: 'Return Format',
        conceptAVal: 'Array of fulfilled values: [val1, val2].',
        conceptBVal: 'Array of status objects: [{ status: "fulfilled", value }, { status: "rejected", reason }].',
      },
      {
        feature: 'Ideal Dashboard Scenario',
        conceptAVal: 'Mandatory dependent data transactions where single failure invalidates all.',
        conceptBVal: 'Independent dashboard widgets where partial failures should render error states.',
      },
    ],
    verdict: 'Use Promise.all() when all requests are mandatory; use Promise.allSettled() for resilient multi-widget dashboards.'
  }
];
