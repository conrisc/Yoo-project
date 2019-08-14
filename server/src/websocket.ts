import WebSocket from 'ws';
import http from 'http'

const dataTypes = {
    NEW_MESSAGE: 'new_message',
    JOIN_CHAT: 'join_chat'
}

const tripClients: any = {};


function injectWebSocket(server: http.Server) {
    const wss = new WebSocket.Server({ server });
    injectConfiguration(wss);

    return wss;
}

function injectConfiguration(wss: WebSocket.Server) {

    const sendMessage = (json: any, ws: WebSocket, tripId: any) => {
        tripClients[tripId].forEach((client: WebSocket) => {
            if (client != ws) {
                client.send(json)
            }
        });
    }

    const addClientToChat = (dataFromClient: any, ws: WebSocket) => {
        tripClients[dataFromClient.tripId] = tripClients[dataFromClient.tripId] || [];
        tripClients[dataFromClient.tripId].push(ws);
        console.log(`Added user ${dataFromClient.username} to trip chat ${dataFromClient.tripId}`);

        // const response = {
        //     message: dataFromClient.message,
        //     username: dataFromClient.username
        // };
    }

    const handleNewMessage = (dataFromClient: any, ws: WebSocket) => {
        const response = {
            type: dataFromClient.type,
            tripId: dataFromClient.tripId,
            message: dataFromClient.message,
            username: dataFromClient.username,
            date: dataFromClient.date
        }

        sendMessage(JSON.stringify(response), ws, dataFromClient.tripId);
    }

    wss.on('connection', function (ws: WebSocket) {
        console.log('new connection');

        ws.on('message', function(message: any) {
            console.log(message);
            const dataFromClient = JSON.parse(message);
            switch(dataFromClient.type) {
                case dataTypes.JOIN_CHAT:
                    addClientToChat(dataFromClient, ws);
                    break;
                case dataTypes.NEW_MESSAGE:
                    handleNewMessage(dataFromClient, ws)
                    break;
                default:

            }
        });
    });
}

export {
    injectWebSocket
}