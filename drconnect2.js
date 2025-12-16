// This assumes you set up a PeerServer instance somewhere
// Default uses a public PeerServer provided by the library authors for prototyping
const peer = new Peer(); 
let currentConnection = null;
const sendButton = document.getElementById('sendButton');

peer.on('open', (id) => {
    logMessage('My Peer ID is: ' + id);
});

peer.on('error', (err) => {
    console.error(err);
});

// Listener for incoming connections (when hosting)
peer.on('connection', (conn) => {
    handleConnection(conn);
});

function hostServer() {
    const roomCode = document.getElementById('roomCodeInput').value;
    const passcode = document.getElementById('passcode').value;
    if (!roomCode) {
        alert("Please enter a room code to host.");
        return;
    }
    // In a real app, you would register this room/passcode with your signaling server
    logMessage(`Hosting room "${roomCode}". Other clients connect using ID: ${peer.id}`);
    sendButton.disabled = false;
}

function joinServer() {
    const hostId = prompt("Enter the Host's Peer ID (from their screen):");
    const passcode = document.getElementById('passcode').value;
    if (!hostId) return;
    
    const conn = peer.connect(hostId); // Connect directly to the peer ID
    conn.on('open', () => {
        handleConnection(conn);
        // Here you would send the passcode for verification
        // conn.send({ type: 'auth', passcode: passcode });
    });
}

function handleConnection(conn) {
    currentConnection = conn;
    logMessage('Connection established with peer: ' + conn.peer);
    sendButton.disabled = false;

    conn.on('data', (data) => {
        logMessage('Message from peer: ' + data);
    });
    
    conn.on('close', () => {
        logMessage('Peer disconnected. Connection closed.');
        currentConnection = null;
        sendButton.disabled = true;
    });
}

function sendMessage() {
    if (currentConnection && currentConnection.open) {
        const message = "Button was pressed!";
        currentConnection.send(message);
        logMessage('Sent: ' + message);
    } else {
        logMessage('No active peer connection.');
    }
}

function logMessage(message) {
    // ... (same logging function as before)
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
