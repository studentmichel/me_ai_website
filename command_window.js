// Get the chat window element
let chatWindow = document.getElementById('chat-window');

// Set the initial values of chat window
let isDragging = false;
let lastX = 0;
let lastY = 0;

// Define the functions for dragging the chat window
function handleMouseDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

function handleMouseUp() {
    isDragging = false;
}

function handleMouseMove(e) {
    if (isDragging) {
        let deltaX = e.clientX - lastX;
        let deltaY = e.clientY - lastY;
        let topPos = parseInt(window.getComputedStyle(chatWindow).getPropertyValue('top'));
        let leftPos = parseInt(window.getComputedStyle(chatWindow).getPropertyValue('left'));

        chatWindow.style.top = `${topPos + deltaY}px`;
        chatWindow.style.left = `${leftPos + deltaX}px`;

        lastX = e.clientX;
        lastY = e.clientY;
    }
}
// Attach event listeners to chat window element
chatWindow.addEventListener('mousedown', handleMouseDown);
chatWindow.addEventListener('mouseup', handleMouseUp);
chatWindow.addEventListener('mousemove', handleMouseMove);

