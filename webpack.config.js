const path = require('path');

module.exports = {
  entry: './client/src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist')
  },
  devtool: 'source-map',
  module:{
    rules:[
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        {
          test:/\.(s*)css$/,
          use:['style-loader','css-loader', 'sass-loader']
        }
     ]
  },
};
