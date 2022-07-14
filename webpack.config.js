const path = require("path");

// webpack plugins
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ArcGISPlugin = require("@arcgis/webpack-plugin");

// handle dynamic configuration of build mode
let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
}
const target = mode === "production" ? "browserslist" : "web";

console.log("mode ::", mode);
//console.log("env ::", process.env);
console.log("node env ::", process.env.NODE_ENV);

// webpack config details
module.exports = {
  mode: mode,
  entry: path.resolve(__dirname, "./src/main.ts"),
  node: false,
  devtool: "inline-source-map",
  watch: mode === "development",
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../",
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js",
    chunkFilename: "js/chunks/[id].js",
    assetModuleFilename: "assets/resources/[name][ext]",
    publicPath: "",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/styles/[name].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/@esri/calcite-components/dist/calcite",
          to: "assets/arcgis/calcite/",
        },
        {
          from: "src/config",
          to: "config",
        },
        {
          from: "src/oauth-callback.html",
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: "src/assets/images/favicon.ico",
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new ArcGISPlugin({
      copyAssets: true,
      assetsDir: "assets/arcgis",
    }),
    new HtmlWebPackPlugin({
      chunksSortMode: "none",
      hash: false,
      inject: "body",
      title: "Mission Writer",
      calciteJs: '<script src="./assets/arcgis/calcite/calcite.esm.js" type="module"></script>',
      jsapiCss: '<link href="assets/arcgis/esri/themes/dark/main.css" rel="stylesheet">',
      filename: "index.html",
      template: "src/index.html",
      favicon: "src/assets/images/favicon.ico",
      showErrors: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", "json", "woff", "woof2"],
  },
  target: target,
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3001,
  },
};
