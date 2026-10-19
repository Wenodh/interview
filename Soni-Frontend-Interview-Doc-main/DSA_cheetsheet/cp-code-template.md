---
title: "CP Code Templates"
description: "Common Competitive Programming coding templates and algorithmic patterns."
sidebar:
  order: 2
---

# Common CP Coding Templates

A collection of standard algorithmic templates for Competitive Programming and DSA interviews.

---

## Two Pointers: One Input, Opposite Ends

```javascript
let fn = arr => {
    let left = 0, ans = 0, right = arr.length - 1;
    while (left < right) {
        // do some logic here with left and right
        if (CONDITION) {
            left++;
        } else {
            right--;
        }
    }
    return ans;
}
```

### Sample Problems
* [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/?envType=study-plan-v2&envId=top-interview-150)

---

## Two Pointers: Two Inputs, Exhaust Both

```javascript
let fn = (arr1, arr2) => {
    let i = 0, j = 0, ans = 0;
    while (i < arr1.length && j < arr2.length) {
        // do some logic here
        if (CONDITION) {
            i++;
        } else {
            j++;
        }
    }
    while (i < arr1.length) {
        // do logic
        i++;
    }
    while (j < arr2.length) {
        // do logic
        j++;
    }
    return ans;
}
```

---

## Sliding Window

```javascript
let fn = arr => {
    let left = 0, ans = 0, curr = 0;
    for (let right = 0; right < arr.length; right++) {
        // do logic here to add arr[right] to curr
        while (WINDOW_CONDITION_BROKEN) {
            // remove arr[left] from curr
            left++;
        }
        // update ans
    }
    return ans;
}
```

---

## Build a Prefix Sum

```javascript
let fn = arr => {
    let prefix = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        prefix.push(prefix[prefix.length - 1] + arr[i]);
    }
    return prefix;
}
```

---

## Efficient String Building

:::note
In JavaScript, benchmarking shows that string concatenation with `+=` is faster than using `.join()`.
:::

```javascript
// arr is a list of characters
let fn = arr => {
    let ans = [];
    for (const c of arr) {
        ans.push(c);
    }
    return ans.join("");
}

let fn = arr => {
    let ans = "";
    for (const c of arr) {
        ans += c;
    }
    return ans;
}
```

---

## Linked List: Fast and Slow Pointer

```javascript
let fn = head => {
    let slow = head;
    let fast = head;
    let ans = 0;
    while (fast && fast.next) {
        // do logic
        slow = slow.next;
        fast = fast.next.next;
    }
    return ans;
}
```

---

## Reversing a Linked List

![Reversing a linked list](https://i.giphy.com/media/d9TdpWRIDu9CXONF8P/giphy.gif)

```javascript
let fn = head => {
    let curr = head;
    let prev = null;
    while (curr) {
        let temp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = temp;
    }
    return prev;
}
```

---

## Find Number of Subarrays that Fit an Exact Criteria

```javascript
let fn = (arr, k) => {
    let counts = new Map();
    counts.set(0, 1);
    let ans = 0, curr = 0;
    for (const num of arr) {
        // do logic to change curr
        ans += counts.get(curr - k) || 0;
        counts.set(curr, (counts.get(curr) || 0) + 1);
    }
    return ans;
}
```

---

## Monotonic Increasing Stack

:::note
The same logic can be applied to maintain a monotonic queue.
:::

```javascript
let fn = arr => {
    let stack = [];
    let ans = 0;
    for (const num of arr) {
        // for monotonic decreasing, just flip the > to <
        while (stack.length && stack[stack.length - 1] > num) {
            // do logic
            stack.pop();
        }
        stack.push(num);
    }
    return ans;
}
```

---

## Binary Tree: DFS (Recursive)

![DFS Diagram](https://codeforces.com/predownloaded/8d/be/8dbe5d89e58b67f3d8e4d8e0e8eb3358ba921b28.png)

```javascript
let dfs = root => {
    if (!root) {
        return;
    }
    let ans = 0;
    // do logic
    dfs(root.left);
    dfs(root.right);
    return ans;
}
```

---

## Binary Tree: DFS (Iterative)

![DFS Traversal](https://www.bing.com/th/id/OGC.680a6ee0d310ba41ad8f2483d65bdbb3?pid=1.7&rurl=https%3a%2f%2fwww.codesdope.com%2fstaticroot%2fimages%2falgorithm%2fdfs.gif&ehk=yKw%2bMkJGnXADPcTPu1fzMMllsu%2bCvZSoSE8nVnN25Nk%3d)

```javascript
let dfs = root => {
    let stack = [root];
    let ans = 0;
    while (stack.length) {
        let node = stack.pop();
        // do logic
        if (node.left) {
            stack.push(node.left);
        }
        if (node.right) {
            stack.push(node.right);
        }
    }
    return ans;
}
```

---

## Binary Tree: BFS

![BFS Traversal](https://www.codesdope.com/staticroot/images/algorithm/bfs.gif)

```javascript
let fn = root => {
    let queue = [root];
    let ans = 0;
    while (queue.length) {
        let currentLength = queue.length;
        // do logic for current level
        let nextQueue = [];
        for (let i = 0; i < currentLength; i++) {
            let node = queue[i];
            // do logic
            if (node.left) {
                nextQueue.push(node.left);
            }
            if (node.right) {
                nextQueue.push(node.right);
            }
        }
        queue = nextQueue;
    }
    return ans;
}
```

---

## Graph: DFS (Recursive)

:::note
For graph templates, assume nodes are numbered from `0` to `n - 1` and the graph is given as an adjacency list. Depending on the problem, you may need to convert the input into an equivalent adjacency list before using these templates.
:::

```javascript
let fn = graph => {
    let dfs = node => {
        let ans = 0;
        // do some logic
        for (const neighbor of graph[node]) {
            if (!seen.has(neighbor)) {
                seen.add(neighbor);
                ans += dfs(neighbor);
            }
        }
        return ans;
    }
    let seen = new Set([START_NODE]);
    return dfs(START_NODE);
}
```

---

## Graph: DFS (Iterative)

```javascript
let fn = graph => {
    let stack = [START_NODE];
    let seen = new Set([START_NODE]);
    let ans = 0;
    while (stack.length) {
        let node = stack.pop();
        // do some logic
        for (const neighbor of graph[node]) {
            if (!seen.has(neighbor)) {
                seen.add(neighbor);
                stack.push(neighbor);
            }
        }
    }
    return ans;
}
```

---

## Graph: BFS

```javascript
let fn = graph => {
    let queue = [START_NODE];
    let seen = new Set([START_NODE]);
    let ans = 0;
    while (queue.length) {
        let currentLength = queue.length;
        let nextQueue = [];
        for (let i = 0; i < currentLength; i++) {
            let node = queue[i];
            // do some logic
            for (const neighbor of graph[node]) {
                if (!seen.has(neighbor)) {
                    seen.add(neighbor);
                    nextQueue.push(neighbor);
                }
            }
        }
        queue = nextQueue;
    }
    return ans;
}
```

---

## Find Top K Elements with Heap

:::note
JavaScript does not have built-in PriorityQueue/Heap support. It is recommended to use Java or a custom Heap implementation if required.
:::

```java
public int[] fn(int[] arr, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(CRITERIA);
    for (int num: arr) {
        heap.add(num);
        if (heap.size() > k) {
            heap.remove();
        }
    }
    int[] ans = new int[k];
    for (int i = 0; i < k; i++) {
        ans[i] = heap.remove();
    }
    return ans;
}
```

---

## Binary Search

```javascript
let fn = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] == target) {
            // do something
            return;
        }
        if (arr[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    // left is the insertion point
    return left;
}
```

---

## Binary Search: Duplicate Elements, Left-most Insertion Point

```javascript
let fn = (arr, target) => {
    let left = 0;
    let right = arr.length;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

---

## Binary Search: Duplicate Elements, Right-most Insertion Point

```javascript
let fn = (arr, target) => {
    let left = 0;
    let right = arr.length;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

---

## Binary Search: For Greedy Problems

### Looking for Minimum:
```javascript
let fn = arr => {
    let check = x => {
        // this function is implemented depending on the problem
        return BOOLEAN;
    }
    let left = MINIMUM_POSSIBLE_ANSWER;
    let right = MAXIMUM_POSSIBLE_ANSWER;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (check(mid)) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

### Looking for Maximum:
```javascript
let fn = arr => {
    let check = x => {
        // this function is implemented depending on the problem
        return BOOLEAN;
    }
    let left = MINIMUM_POSSIBLE_ANSWER;
    let right = MAXIMUM_POSSIBLE_ANSWER;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (check(mid)) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return right;
}
```

---

## Backtracking

```javascript
let backtrack = (curr, OTHER_ARGUMENTS) => {
    if (BASE_CASE) {
        // modify the answer
        return;
    }
    let ans = 0;
    for (ITERATE_OVER_INPUT) {
        // modify the current state
        ans += backtrack(curr, OTHER_ARGUMENTS);
        // undo the modification of the current state
    }
    return ans;
}
```

---

## Dynamic Programming: Top-Down Memoization

```javascript
let fn = arr => {
    let dp = STATE => {
        if (BASE_CASE) {
            return 0;
        }
        if (memo[STATE] != -1) {
            return memo[STATE];
        }
        let ans = RECURRENCE_RELATION(STATE);
        memo[STATE] = ans;
        return ans;
    }
    let memo = ARRAY_SIZED_ACCORDING_TO_STATE;
    return dp(STATE_FOR_WHOLE_INPUT);
}
```

---

## Build a Trie

:::note
Using a class is only necessary if you want to store data at each node. Otherwise, you can implement a trie using JavaScript `Map`s or plain objects.
:::

```javascript
class TrieNode {
    constructor() {
        // you can store data at nodes if you wish
        this.data = null;
        this.children = new Map();
    }
}

let fn = words => {
    let root = new TrieNode();
    for (const word of words) {
        let curr = root;
        for (const c of word) {
            if (!curr.children.has(c)) {
                curr.children.set(c, new TrieNode());
            }
            curr = curr.children.get(c);
        }
        // at this point, you have a full word at curr
        // you can perform more logic here to give curr an attribute if you want
    }
    return root;
}
```
