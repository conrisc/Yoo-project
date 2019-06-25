const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

let plugins = [
    new webpack.HotModuleReplacementPlugin()
];

module.exports = {
  mode: 'development',
  entry: './src/server.js',
  target: 'node',
  plugins: plugins,
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  }
};
