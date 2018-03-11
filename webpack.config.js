const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        dispatcher: path.join(__dirname, 'src/dispatcher.ts'),
        captures: path.join(__dirname, 'src/captures.ts'),
        eventListeners: path.join(__dirname, 'src/eventListeners.ts'),
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
