module.exports = {
  // Other Webpack settings...
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader', // or 'babel-loader' with '@babel/preset-typescript'
        exclude: /node_modules/,
      },
    ],
  },
};
