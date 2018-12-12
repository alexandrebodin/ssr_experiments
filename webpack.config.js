const path = require('path');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  entry: './client.js',
  output: {
    path: path.join(__dirname, 'dist/build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }]
  }
};
