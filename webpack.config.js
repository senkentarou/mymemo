const path = require('path');

// メインプロセスの設定
const main = {
  mode: 'development',
  target: 'electron-main',
  entry: path.join(__dirname, 'src', 'main'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [".js", ".ts", ".json"],
  },
  module: {
    rules: [
      {
        test: /.ts?$/,
        use: ["ts-loader"],
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
    ],
  },
};

// レンダラープロセスの設定
const renderer = {
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: path.join(__dirname, 'src', 'renderer', 'index'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'scripts')
  },
  resolve: {
    extensions: [".json", ".js", ".jsx", ".css", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ["ts-loader"],
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules"),
        ],
      },
    ],
  },
};

module.exports = [main, renderer];
