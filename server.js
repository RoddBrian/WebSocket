const WebSocket = require('ws');

const port = 5000;
const server = new WebSocket.Server({ port });

let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];

server.on('connection', ws => {
    console.log('Cliente conectado');

    // Enviar la lista de items cuando un cliente se conecta
    ws.send(JSON.stringify({ type: 'items', data: items }));

    // Manejar mensajes recibidos del cliente
    ws.on('message', message => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'addItem') {
            const newItem = {
                id: items.length + 1,
                name: parsedMessage.name
            };
            items.push(newItem);
            // Enviar el nuevo item a todos los clientes conectados
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'newItem', data: newItem }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log(`Servidor WebSocket corriendo en ws://localhost:${port}`);
