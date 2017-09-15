const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './app/app.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loaders: ['babel-loader']
        }, {
            test: /\.ts(x)?$/,
            loaders: ['babel-loader', 'ts-loader']
        },{
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
        }, {
            test: /\.svg$/,
            loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=static/[name].[hash].[ext]'
        }, {
            test: /\.woff$/,
            loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=static/[name].[hash].[ext]'
        }, {
            test: /\.woff2$/,
            loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=static/[name].[hash].[ext]'
        }, {
            test: /\.[ot]tf$/,
            loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=static/[name].[hash].[ext]'
        }, {
            test: /\.eot$/,
            loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=static/[name].[hash].[ext]'
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            verbose: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
};
