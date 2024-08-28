const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, "src/app.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: "index.html",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src/public"),
          to: path.join(__dirname, "dist"),
        },
      ],
    }),

    new CleanWebpackPlugin(),

    new FaviconsWebpackPlugin('./src/public/images/favicon.png')
  ],
};
