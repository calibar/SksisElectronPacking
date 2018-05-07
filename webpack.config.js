var webpack = require('webpack');
var path    = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


// Webpack Config
var webpackConfig = {
    entry: {
        'polyfills': './src/polyfills.browser.ts',
        'vendor'   : './src/vendor.browser.ts',
        'main'     : './src/main.browser.ts'
    },

    output: {
        path: path.join(__dirname, '/dist')
    },

    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html',
            filename: './index.html' //relative to root of the application
        })
,
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin({
            name     : ['main', 'vendor', 'polyfills'],
            minChunks: Infinity
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.DefinePlugin({
            "require.specified": "require.resolve"
        }),
        new webpack.ContextReplacementPlugin( /angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, './src') ),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })

    ],

    module: {
        rules: [
            {
                test   : /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test: /\.scss$/,
                use: 'sass-loader'
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=100000'
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },

    resolve: {
        modules: [ "node_modules"]
    }

};

// Our Webpack Defaults
var defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache  : true,
    output : {
        filename         : '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename    : '[id].chunk.js'
    },

    resolve: {
        modules      : [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'test')
        ],
        extensions: ['.ts', '.js']
    },

    devServer: {
        historyApiFallback: true,
        watchOptions      : {aggregateTimeout: 300, poll: 1000}
    },

    node: {
        global        : true,
        crypto        : 'empty',
        module        : false,
        Buffer        : false,
        clearImmediate: false,
        setImmediate  : false
    }
};

var webpackMerge = require('webpack-merge');
module.exports   = webpackMerge(defaultConfig, webpackConfig);
