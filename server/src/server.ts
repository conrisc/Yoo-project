import express from 'express';
import cors from 'cors';
import { injectAPI } from './api.ts';

const port: number = 3001;
const app: express.Application = express();
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));
app.use(express.json())
injectAPI(app);

app.listen(port, () => console.log(`Yoo-server is listening on ${port}`));
