import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

// for typescript support
import "webpack-dev-server";

const config: webpack.Configuration = {
  entry: { main: "./src/index.ts" },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    host: "localhost",
    hot: true,
  },
  stats: "minimal",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "babel-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@shared": path.resolve(__dirname, "src", "shared"),
      "@services": path.resolve(__dirname, "src", "services"),
    },
  },
};

module.exports = () => {
  return config;
};
