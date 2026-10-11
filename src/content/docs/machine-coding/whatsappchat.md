---
title: "WhatsappChat"
description: "Interactive machine coding implementation of WhatsappChat."
---

import MachineSandbox from '../../../src/components/MachineSandbox.astro';

Interactive live demo and source code tabs for **WhatsappChat**:

<MachineSandbox appUrl="/apps/machine-coding/whatsappchat/index.html" htmlCode={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div id="chat-container">
        <h3>Whatsapp Chat</h3>
        <div id="messages"></div>
        <div id="input-container">
          <input id="message-input" type="text" placeholder="Type a message" />
          <button id="send-btn">Send</button>
        </div>
      </div>
      <script src="./index.js"></script>
</body>
</html>`} jsCode={`const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const messages = [
  "Received message 1",
  "Received message 2",
  "Received message 3",
  "Received message 4",
  "Received message 5",
  "Received message 6",
  "Received message 7",
  "Received message 8",
];

const getRandomMessage = () => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const onSendMessage = () => {
  const messageText = messageInput.value.trim();
  if (messageText === "") return;

  appendMessage(messageText, "received");

  // Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  messageInput.value = "";
};

const appendMessage = (text, type) => {
  const message = document.createElement("div");
  message.className = \`message \${type}\`;
  message.textContent = text;
  messagesContainer.appendChild(message);

  // Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const fetchMessages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: getRandomMessage(),
        createdAt: new Date().toISOString(),
      });
    }, 1000);
  });
};

const receiveMessages = () => {
  fetchMessages().then((response) => {
    appendMessage(response.message, "received");
  });
};

function init() {
  sendButton.addEventListener("click", onSendMessage);
  // receiving messages every 10 seconds
  setInterval(receiveMessages, 10000);
}
init();
`} cssCode={`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f2f5;
  }

  #chat-container {
    width: 300px;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .message {
    max-width: 70%;
    margin: 5px 0;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
  }

  .sent {
    align-self: flex-end;
    background-color: #dcf8c6;
  }

  .received {
    align-self: flex-start;
    background-color: #ece5dd;
  }

  #input-container {
    display: flex;
    padding: 10px;
    gap: 5px;
    border-top: 1px solid #ccc;
    background-color: #fff;
  }

  #message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
  }

  #send-button {
    padding: 10px 20px;
    background-color: #25d366;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  h3 {
    text-align: center;
  }
  `} />
