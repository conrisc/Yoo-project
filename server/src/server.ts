import express from 'express';
import cors from 'cors';
import http from 'http'

import { injectWebSocket } from './websocket.ts';
import { injectAPI } from './api.ts';


const port: number = 3001;
const app: express.Application = express();
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000'
}
const server = http.createServer(app);
injectWebSocket(server)

app.use(cors(corsOptions));
app.use(express.json())
injectAPI(app);


server.listen(port, () => console.log(`Yoo-server is listening on ${port}`));
