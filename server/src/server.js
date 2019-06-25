import express from 'express';
import cors from 'cors';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import config from '../webpack.config';

// const compiler = webpack(config);
const port = 3001;
const app = express();

// app.use(webpackDevMiddleware(compiler, {
//   publicPath: config.output.publicPath
// }));

const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send('{ "login":  "success9" }');
});


app.listen(port, () => console.log("Yoo-server is listening on ${port}"));
