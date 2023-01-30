import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import webpack from "webpack";

/**
 * @type {import('webpack').Configuration}
 */
export default {
  mode: "development",
  entry: [
    "webpack/hot/dev-server.js", 
    "./src/index.js"
  ],
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    port: 4200,
    static: "./dist",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(process.cwd(), "index.html"),
      title: "Webpack HMR example",
    }),
  ],
  output: {
    filename: `[name].bundle.js`,
    path: resolve(process.cwd(), "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
};
