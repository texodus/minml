
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: process.env.NODE_ENV || "production",
    entry: "./dist/tetris.js",
    output: {
        filename: "./out.js"
    },
    // externals: [/^[a-z0-9@]/],
    plugins: [
        new HtmlWebPackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                APP_ENV: JSON.stringify('browser')
            }
        }),
    ],
    target: "node",
    devtool: "source-map"
};
