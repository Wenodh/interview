---
title: "File folder"
description: "Interactive machine coding implementation of File folder."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **File folder**:

<MachineSandbox appUrl="/apps/machine-coding/file-folder/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
</head>

<body>
    <h1>File Explorer(Asked in ServiceNow)</h1>
    <div id="app"></div>

    <script src="./index.js"></script>
</body>

</html>`} jsCode={`let currentData = {
  id: 0,
  name: "Root",
  isFolder: true,
  isExpanded: true,
  children: [
    {
      id: 1,
      name: "File1.txt",
      isFolder: false,
    },
    {
      id: 2,
      name: "Folder1",
      isFolder: true,
      isExpanded: false,
      children: [
        {
          id: 3,
          name: "File2.txt",
          isFolder: false,
        },
        {
          id: 4,
          name: "SubFolder1",
          isFolder: true,
          isExpanded: false,
          children: [
            {
              id: 5,
              name: "File3.txt",
              isFolder: false,
            },
          ],
        },
      ],
    },
  ],
};

const app = document.getElementById("app");

function createTree(data) {
  const ul = document.createElement("ul");
  ul.className = "tree";

  data.children.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.isFolder ? "folder" : "file";

    if (item.isFolder && !item.isExpanded) {
      li.classList.add("collapsed");
    }

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const nameBox = document.createElement("div");
    nameBox.className = "wrapper";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;
    nameSpan.style.cursor = "pointer";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = item.name;
    input.style.display = "none";

    nameSpan.onclick = () => onNameClick(nameSpan, nameInput, item);
    input.onblur = () => onNameBlur(nameInput, nameSpan, item);

    nameBox.append(nameSpan, input);

    if (item.isFolder) {
      const icon = document.createElement("span");
      icon.textContent = item.isExpanded ? "▼" : "▶";
      icon.style.marginRight = "5px";
      icon.style.cursor = "pointer";
      icon.onclick = (e) => {
        e.stopPropagation();
        item.isExpanded = !item.isExpanded;
        renderTree();
      };
      nameBox.prepend(icon);
    }

    wrapper.appendChild(nameBox);

    const actions = document.createElement("div");
    actions.className = "actions";

    const createFolderButton = document.createElement("button");
    createFolderButton.innerHTML = "📁 ";
    createFolderButton.onclick = (e) => {
      e.stopPropagation();
      createNode(item, true);
      renderTree();
    };

    const createFileButton = document.createElement("button");
    createFileButton.innerHTML = "📄 ";
    createFileButton.onclick = (e) => {
      e.stopPropagation();
      createNode(item, false);
      renderTree();
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️ ";
    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deleteNode(currentData, item.id);
      renderTree();
    };

    if (item.isFolder) {
      actions.append(createFolderButton, createFileButton);
    }
    actions.append(deleteButton);
    wrapper.appendChild(actions);

    li.appendChild(wrapper);

    if (item.isFolder && item.children && item.children.length > 0) {
      const childUl = createTree(item);
      li.appendChild(childUl);
    }

    ul.appendChild(li);
  });

  return ul;
}

function onNameClick(nameSpan, nameInput, item) {
  nameSpan.style.display = "none";
  nameInput.style.display = "inline-block";
  nameInput.focus();
}

function onNameBlur(nameInput, nameSpan, item) {
  const newName = nameInput.value.trim();
  if (newName) {
    item.name = newName;
  }
  nameSpan.textContent = item.name;
  nameSpan.style.display = "inline";
  nameInput.style.display = "none";
  renderTree();
}

function createNode(parent, isFolder) {
  if (!parent.isFolder) return;
  if (!parent.children) parent.children = [];
  parent.children.push({
    id: Date.now(),
    name: isFolder ? "New Folder" : "New File",
    isFolder,
    isExpanded: false,
    children: isFolder ? [] : undefined,
  });
  parent.isExpanded = true;
}

function deleteNode(data, id) {
  if (!data.children) return;
  data.children = data.children.filter((child) => {
    if (child.id === id) return false;
    deleteNode(child, id);
    return true;
  });
}

function renderTree() {
  app.innerHTML = "";
  app.appendChild(createTree(currentData));
}

function init() {
  renderTree();
}
init();
`} cssCode={`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f4f7f9;
  color: #333;
}
h1 {
    text-align: center;
}

#app {
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tree {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}

.tree ul {
  padding-left: 20px;
  margin: 0;
  border-left: 1px dashed #ccc;
}

.tree li {
  margin: 8px 0;
}

.tree .folder,
.tree .file {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 5px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.tree .folder:hover,
.tree .file:hover {
  background-color: #eaf4ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tree .folder {
  font-weight: bold;
  background-color: #eef7ff;
}

.tree .folder.collapsed > ul {
  display: none;
}

.tree .wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tree .folder > span:first-child,
.tree .file > span:first-child {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tree .folder > span:first-child::before {
  content: attr(data-icon);
  font-size: 12px;
  margin-right: 6px;
}

.tree .file > span:first-child::before {
  content: "📄";
  font-size: 12px;
  margin-right: 6px;
}

input.edit-input {
  font-size: 14px;
  width: 70%;
  padding: 5px 8px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

input.edit-input:focus {
  border-color: #007bff;
}

.tree .actions {
  display: flex;
  gap: 10px;
}

.tree .actions button {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tree .actions button:hover {
  background-color: grey;
}

.tree .actions button:active {
  background-color: #003f87;
}
`} />
