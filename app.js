const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "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";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim(); // Trim the input to remove leading/trailing whitespace
  if (message === "") {
    return; // Ignore empty messages
  }

  input.value = "";

  displayMessage(message, true); // Display user message

  try {
    const chatbotResponse = await getChatbotResponse(message);
    displayMessage(chatbotResponse, false); // Display chatbot response
  } catch (error) {
    console.error("Error:", error);
    displayMessage("Oops! An error occurred.", false);
  }
});

function displayMessage(content, isUserMessage) {
    const messageClass = isUserMessage ? "user-message" : "bot-message";
    const iconSrc = isUserMessage ? "user.jpg" : "bot.png";
    const timestamp = new Date().toLocaleTimeString(); // Get the current timestamp
  
    let messageHTML = `
      <div class="message ${messageClass}">
        <img src="${iconSrc}" alt="user icon" class="me-2" style="width: 20px; height: 20px;">
        <span>${content}</span>
        <span class="timestamp">${timestamp}</span>
      </div>
    `;
  
    if (!isUserMessage) {
      // Check if it's a bot message
      const responseLines = content.split("\n").filter((line) => line.trim() !== ""); // Exclude empty lines
  
      // If the response contains multiple lines, format it as bullet points
      if (responseLines.length > 1) {
        messageHTML += `<ul>`;
        responseLines.forEach((line) => {
          messageHTML += `<li>${line}</li>`;
        });
        messageHTML += `</ul>`;
      } else {
        // If it's a single line, format it as a code block
        messageHTML += `<pre><code>${content}</code></pre>`;
      }
    }
  
    messages.innerHTML += messageHTML;
    scrollToBottom(); // Scroll to the latest message
  }
  
  

async function getChatbotResponse(message) {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
   {
  "model": "gpt-3.5-turbo-16k",
  "messages": [
    {
      "role": "user",
      "content": ""
    }
  ],
  "temperature": 1,
  "max_tokens": 256,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.choices[0].text;
}

function clearChat() {
  messages.innerHTML = ""; // Clear the chat messages
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the chat
}

// Example usage of the new methods
clearChat(); // Clear the chat messages initially

// After receiving a new message or adding new messages manually
scrollToBottom(); // Scroll to the bottom of the chat
