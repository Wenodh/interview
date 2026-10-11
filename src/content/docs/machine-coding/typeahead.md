---
title: "TypeAhead"
description: "Interactive machine coding implementation of TypeAhead."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **TypeAhead**:

<MachineSandbox appUrl="/apps/machine-coding/typeahead/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Type Ahead</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <h3>Typeahead</h3>
    <div id="typeahead-container">
      <input type="text" id="input-box" placeholder="Search...">
      <div id="results"></div>
    </div>
    <script src="./index.js"></script>

</body>
</html>`} jsCode={`const data = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Grapes",
  "Mango",
  "Pineapple",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
  "Watermelon",
  "Cantaloupe",
  "Peach",
  "Plum",
  "Kiwi",
  "Apricot",
  "Lime",
  "Lemon",
  "Orange",
  "Pear",
  "Fig",
  "Guava",
  "Papaya",
  "Dragonfruit",
  "Lychee",
  "Pomegranate",
  "Coconut",
  "Tangerine",
  "Jackfruit",
  "Starfruit",
  "Passionfruit",
  "Persimmon",
  "Avocado",
  "Cranberry",
  "Gooseberry",
  "Honeydew",
  "Durian",
  "Mulberry",
  "Nectarine",
  "Quince",
  "Pomelo",
];

const inputEle = document.getElementById("input-box");
const resultsContainer = document.getElementById("results");
const debounceTime = 300;
const cache = new Map();

const fetchMockData = (query) => {
  console.log("Api hit:", query);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.filter((item) => item.toLowerCase().includes(query)));
    }, 500);
  });
};

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const appendResult = (results) => {
  if (results.length > 0) {
    resultsContainer.innerHTML = results
      .map((item) => \`<div class="result-item">\${item}</div>\`)
      .join("");
  } else {
    resultsContainer.innerHTML = \`<div class="no-result-found">No results found</div>\`;
  }
};

const handleInputChange = async (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (query.length === 0) {
    resultsContainer.innerHTML = "";
    return;
  }

  resultsContainer.innerHTML = "<div>Loading data...</div>";

  if (cache.has(query)) {
    console.log("Cache hit:", cache.get(query));
    appendResult(cache.get(query));
    return;
  }

  const results = await fetchMockData(query.toLowerCase());
  cache.set(query, results);
  appendResult(results);
};

const handleItemClick = (event) => {
  if (event.target.classList.contains("result-item")) {
    inputEle.value = event.target.textContent;
    resultsContainer.innerHTML = "";
  }
};

function init() {
  inputEle.addEventListener("input", debounce(handleInputChange, debounceTime));
  resultsContainer.addEventListener("click", handleItemClick);
}

init();
`} cssCode={`* {
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
#typeahead-container {
  width: 300px;
  margin: 0 auto;
  position: relative;
}
#input-box {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}
#results {
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  position: absolute;
  width: 100%;
  z-index: 1000;
}
.result-item {
  padding: 10px;
  cursor: pointer;
}
.result-item:hover {
  background-color: #f0f0f0;
}

.no-result-found {
  width: 100%;
  padding: 10px;
}
h3 {
  text-align: center;
}
`} />
