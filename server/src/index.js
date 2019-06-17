import express from 'express';
import cors from 'cors';

const port = 3001;
const app = express();


const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send('{ "login":  "success" }');
});


app.listen(port, () => console.log("Yoo-server is listening on ${port}"));
