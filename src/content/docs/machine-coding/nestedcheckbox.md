---
title: "NestedCheckbox"
description: "Interactive machine coding implementation of NestedCheckbox."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **NestedCheckbox**:

<MachineSandbox appUrl="/apps/machine-coding/nestedcheckbox/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
</head>

<body>
    <div class="checkbox-container">
        <h2>Dynamic Nested Checkbox (Asked in Google)</h2>
        <div id="app"></div>
      </div>
    <script src="./index.js"></script>
</body>

</html>`} jsCode={`const checklistData = {
  label: "Root",
  value: null,
  children: [
    {
      label: "Child 1 of Root",
      value: null,
      children: [
        {
          label: "Nested Child 1-1",
          value: true,
          children: [
            {
              label: "Nested Child 1-1-1",
              value: true,
              children: [
                {
                  label: "Deeply Nested Child 1-1-1-1",
                  value: true,
                },
                {
                  label: "Deeply Nested Child 1-1-1-2",
                  value: true,
                },
              ],
            },
            {
              label: "Nested Child 1-1-2",
              value: false,
            },
          ],
        },
        {
          label: "Nested Child 1-2",
          value: true,
        },
      ],
    },
    {
      label: "Child 2 of Root",
      value: true,
      children: [
        {
          label: "Nested Child 2-1-1",
          value: false,
        },
      ],
    },
    {
      label: "Child 3 of Root",
      value: false,
    },
    {
      label: "Child 4 of Root",
      value: false,
    },
  ],
};

const container = document.getElementById("app");
const CheckboxState = {
  UNCHECKED: "UNCHECKED",
  CHECKED: "CHECKED",
  INDETERMINATE: "INDETERMINATE",
};

const { UNCHECKED, CHECKED, INDETERMINATE } = CheckboxState;

// Recursively update child checkboxes when a parent checkbox is clicked
const updateChildren = (children = [], newValue) => {
  for (let child of children) {
    child.value = newValue;
    if (child.children) {
      updateChildren(child.children, newValue);
    }
  }
};

const handleCheckboxChange = (node, event) => {
  const newValue = event.target.checked;
  node.value = newValue;
  updateChildren(node.children, newValue);
  buildCheckbox();
};

const getStateForNode = (node) => {
  if (!node.children || node.children.length === 0) {
    return node.value ? CHECKED : UNCHECKED;
  }

  let hasChecked = false;
  let hasUnchecked = false;
  let isIndeterminate = false;

  // Iterate through the children to determine the state
  for (const child of node.children) {
    const childState = getStateForNode(child);

    if (childState === INDETERMINATE) {
      isIndeterminate = true;
    } else if (childState === CHECKED) {
      hasChecked = true;
    } else if (childState === UNCHECKED) {
      hasUnchecked = true;
    }
  }

  if (isIndeterminate || (hasChecked && hasUnchecked)) {
    return INDETERMINATE;
  } else if (hasChecked) {
    return CHECKED;
  }

  return UNCHECKED;
};

const createCheckbox = (listItem, label, node) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = handleCheckboxChange.bind(null, node);
  listItem.appendChild(checkbox);
  listItem.appendChild(document.createTextNode(label));

  return checkbox;
};

// Create a checklist item for each node
const createChecklistItem = (node) => {
  const { label, children } = node;
  const listItem = document.createElement("li");
  const checkbox = createCheckbox(listItem, label, node);
  const currentState = getStateForNode(node);

  if (currentState === INDETERMINATE) {
    checkbox.indeterminate = true;
  } else if (currentState === CHECKED) {
    checkbox.checked = true;
  }

  if (children) {
    const sublist = document.createElement("ul");
    children.forEach((child) => {
      const [, item] = createChecklistItem(child);
      sublist.appendChild(item);
    });
    listItem.appendChild(sublist);
  }

  return [currentState, listItem];
};

const buildCheckbox = () => {
  container.innerHTML = "";
  const checklist = document.createElement("ul");
  const [_, rootListItem] = createChecklistItem(checklistData);
  checklist.appendChild(rootListItem);
  container.appendChild(checklist);
};

function init() {
  buildCheckbox();
}
init();
`} cssCode={`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
  color: #333;
}

#app {
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}

.checkbox-label {
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
}

li {
  margin: 5px 0;
  padding: 5px;
  border-radius: 4px;
}

li:hover {
  background: #f0f8ff;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`} />
