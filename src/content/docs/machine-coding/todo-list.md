---
title: "Todo list"
description: "Interactive machine coding implementation of Todo list."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **Todo list**:

<MachineSandbox appUrl="/apps/machine-coding/todo-list/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo list</title>
    <link rel="stylesheet" href="style.css" />
</head>

<body>
    <div id="app" class="app">
        <input id="todo-input" class="todo-input" placeholder="Add items" />
        <ul id="todo-list" class="todo-list"></ul>
        <div id="filters" class="filters">
            <span id="item-count"></span>
            <div>
                <button id="all-btn" class="filter-btn">All</button>
                <button id="active-btn" class="filter-btn">Active</button>
                <button id="completed-btn" class="filter-btn">Completed</button>
            </div>
        </div>
    </div>

    <script src="./index.js"></script>
</body>

</html>`} jsCode={`const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const itemCount = document.getElementById("item-count");
const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");

let todos = [];
let filter = "all";

function buildTodo() {
  list.innerHTML = "";
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    // toggling
    const toggleBtn = document.createElement("span");
    toggleBtn.textContent = todo.completed ? "✓" : "○";
    toggleBtn.className = "todo-toggle";
    toggleBtn.addEventListener("click", () => {
      todo.completed = !todo.completed;
      buildTodo();
    });

    // add txt
    const text = document.createElement("span");
    text.textContent = todo.text;
    text.className = \`todo-text \${todo.completed ? "completed" : ""}\`;

    // create delete button
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "x";
    deleteBtn.className = "todo-delete";
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      buildTodo();
    });

    //event for delete button
    li.addEventListener(
      "mouseenter",
      () => (deleteBtn.style.display = "inline")
    );
    li.addEventListener("mouseleave", () => (deleteBtn.style.display = "none"));

    li.appendChild(toggleBtn);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  // Update item count
  const activeCount = todos.filter((todo) => !todo.completed).length;
  itemCount.textContent = \`\${activeCount} items left\`;
}

function onInput(e) {
  if (e.key === "Enter" && input.value.trim() !== "") {
    todos.push({ text: input.value.trim(), completed: false });
    input.value = "";
    buildTodo();
  }
}

function onfilter(filterVal) {
  filter = filterVal;
  buildTodo();
}

function init() {
  input.addEventListener("keypress", onInput);
  [
    { btn: allBtn, filter: "all" },
    { btn: activeBtn, filter: "active" },
    { btn: completedBtn, filter: "completed" },
  ].forEach(({ btn, filter }) => {
    btn.addEventListener("click", () => onfilter(filter));
  });

  buildTodo();
}

init();
`} cssCode={`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    max-width: 500px;
    margin-top: 50px;
  }

  #todo-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  #todo-list {
    width: 100%;
    padding: 0;
    margin: 20px 0;
    list-style: none;
    border-top: 1px solid #ddd;
  }

  #todo-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  #todo-list li span {
    cursor: pointer;
  }

  #filters {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  #filters button {
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: white;
  }

  #filters button:hover {
    background-color: #f0f0f0;
  }

  /* General Styles */
  .todo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .todo-toggle {
    cursor: pointer;
    margin-right: 10px;
  }

  .todo-text {
    flex: 1;
    word-wrap: break-word;
  }

  .todo-text.completed {
    text-decoration: line-through;
    color: #aaa;
  }

  .todo-delete {
    cursor: pointer;
    display: none;
  }

  .todo-item:hover .todo-delete {
    display: inline;
  }
  `} />
