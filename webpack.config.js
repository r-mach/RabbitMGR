var webpack = require('webpack');

module.exports = {
    entry: "./src/client/js/app.js",
    output: {
        path: require("path").resolve("./src/bin/client/js"),
        library: "app",
        filename: "app.js"
    },
    module: {

        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
            },
            {test: /\.json$/, loader: "json-loader"}
        ]
    }
};