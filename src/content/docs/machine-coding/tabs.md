---
title: "Tabs"
description: "Interactive machine coding implementation of Tabs."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **Tabs**:

<MachineSandbox appUrl="/apps/machine-coding/tabs/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
</head>

<body>
    <h3>Tab component</h3>

    <div id="tabs-container">
        <div id="tabs"></div>
        <div id="tab-content"></div>
    </div>
    <script src="./index.js"></script>
</body>

</html>`} jsCode={`const contents = [];
const tabsContainer = document.getElementById("tabs");
const contentContainer = document.getElementById("tab-content");
let activeTab = null;
const tabs = [
  { id: 1, title: "Tab 1", content: "Tab 1" },
  { id: 2, title: "Tab 2", content: "Tab 2" },
  { id: 3, title: "Tab 3", content: "Tab 3" },
];

const buildTabs = (activeTabNum = 1) => {
  tabs.forEach(({ id, title, content }) => {
    const tabButton = document.createElement("button");
    tabButton.textContent = title;
    tabButton.setAttribute("class", id === activeTabNum ? "tab active" : "tab");
    tabButton.setAttribute("data-tab", id);
    tabsContainer.appendChild(tabButton);

    const contentDiv = document.createElement("div");
    contentDiv.textContent = content;
    contentDiv.setAttribute(
      "class",
      id === activeTabNum ? "content active" : "content"
    );
    contentDiv.setAttribute("data-tab", id);
    contentContainer.appendChild(contentDiv);

    contents.push(contentDiv);
  });

  // Set initial active tab
  activeTab = tabsContainer.querySelector(\`[data-tab="\${activeTabNum}"]\`);
};

const onTabClick = (event) => {
  const clickedTab = event.target;

  if (clickedTab.classList.contains("tab") && clickedTab !== activeTab) {
    const tabId = clickedTab.getAttribute("data-tab");

    if (activeTab) activeTab.classList.remove("active");
    clickedTab.classList.add("active");
    activeTab = clickedTab;

    // Show tab specific content
    contents.forEach((content) => {
      const contentTabId = content.getAttribute("data-tab");
      content.classList.toggle("active", contentTabId === tabId);
    });
  }
};

function init() {
  buildTabs(1);
  tabsContainer.addEventListener("click", onTabClick);
}
init();
`} cssCode={`#tabs-container {
  border: 3px solid black;
  border-radius: 4px;
  overflow: hidden;
  width: 400px;
  margin: 20px auto;
  background: red;
}

h3 {
 text-align: center;
}

#tabs {
  display: flex;
  background-color: #f9f9f9;
}

.tab {
  flex: 1;
  padding: 10px;
  cursor: pointer;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  text-align: center;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.tab:last-child {
  border-right: none;
}

.tab:first-child {
  border-left: none;
}

.tab.active {
  background-color: pink;
  color: grey;
}

#tab-content {
  padding: 15px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
}
.content {
  display: none;
  font-size: 16px;
  color: #333;
}

.content.active {
  display: block;
}
`} />
