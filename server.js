const WebSocket = require('ws');

const port = 5000;
const server = new WebSocket.Server({ port });

let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];

server.on('connection', ws => {
    console.log('Client connected');

    // Send item list when conecction start
    ws.send(JSON.stringify({ type: 'items', data: items }));

    // Control messages from client
    ws.on('message', message => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'addItem') {
            const newItem = {
                id: items.length + 1,
                name: parsedMessage.name
            };
            items.push(newItem);
            // Send new item to clients
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'newItem', data: newItem }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server runs on ws://localhost:${port}`);
