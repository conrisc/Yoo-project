const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

let plugins = [
    new webpack.HotModuleReplacementPlugin()
];

module.exports = {
  mode: 'development',
  entry: './src/server.ts',
  target: 'node',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts ', '.js']
  },
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  node: {
    console: false
  }
};
