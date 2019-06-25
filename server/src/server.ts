import * as express from 'express';
import * as cors from 'cors';
import { injectAPI } from './api';
import { Lol } from './lol.ts';

var a = new Lol();

const port = 3001;
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));
app.use(express.json())
injectAPI(app);

app.listen(port, () => console.log("Yoo-server is listening on ${port}"));
