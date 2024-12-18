document.getElementById('chat-button').addEventListener('click', handleUserInput);
document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});

// Handle user input and process chat
function handleUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        displayMessage(userInput, 'user'); // Display user message
        sendMessage(userInput);
        document.getElementById('user-input').value = ''; // Clear input
    }
}

// Send user input to the server and handle response
async function sendMessage(input) {
    displayTypingIndicator(); // Show typing indicator
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        removeTypingIndicator(); // Remove typing indicator
        displayMessage(data.response, 'bot'); // Display bot response
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        displayMessage('Sorry, something went wrong.', 'bot');
    }
}

// Display message in chatbox
function displayMessage(message, sender) {
    const chatbox = document.getElementById('chatbox');
    const timestamp = new Date().toLocaleTimeString();
    const messageElement = `
        <div class="message ${sender}">
            <span class="text">${message}</span>
            <span class="timestamp">${timestamp}</span>
        </div>`;
    chatbox.innerHTML += messageElement;
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to bottom
}

// Display typing indicator
function displayTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    const typingIndicator = `<div id="typing-indicator" class="message bot">
        <span class="text">Typing...</span>
    </div>`;
    chatbox.innerHTML += typingIndicator;
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

// Clear chat history
document.getElementById('clear-button').addEventListener('click', function () {
    document.getElementById('chatbox').innerHTML = '';
});
