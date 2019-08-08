import WebSocket from 'ws';
import http from 'http'

function injectWebSocket(server: http.Server) {
    const wss = new WebSocket.Server({ server });
    injectConfiguration(wss);

    return wss;
}

function injectConfiguration(wss: WebSocket.Server) {

    const sendMessage = (json: any, ws: WebSocket) => {
        wss.clients.forEach((client: WebSocket) => {
            if (client != ws) {
                client.send(json)
            }
        });
    }

    const typesDef = {
        CONTENT_CHANGE: "contentchange"
    }

    wss.on('connection', function (ws: WebSocket) {
        console.log('new connection');

        ws.on('message', function(message: any) {
            console.log(message);
            const dataFromClient = JSON.parse(message);
            const json: any = { type: dataFromClient.type };
            if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
                json.data = { message: dataFromClient.content };
            }
            sendMessage(JSON.stringify(json), ws);
        });

        wss.on('close', function(connection: any) {
          console.log('connection closed')
          const json: any = { type: typesDef.CONTENT_CHANGE };
          json.data = { message: 'User has disconnected!'};
          sendMessage(JSON.stringify(json), ws);
        });
    });
}

export {
    injectWebSocket
}