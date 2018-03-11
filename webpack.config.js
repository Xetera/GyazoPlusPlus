const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        alias: path.join(__dirname, 'src/alias.ts'),
        dispatcher: path.join(__dirname, 'src/dispatcher.ts'),
        captures: path.join(__dirname, 'src/captures.ts'),
        preload: path.join(__dirname, 'src/preload.ts'),
        database : path.join(__dirname, 'src/database.ts')
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [


        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};
