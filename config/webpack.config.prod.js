const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpackConfig = require('./webpack.config.base');
const helpers = require('./helpers');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = require('../environment/prod.env');

const extractSass = new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
});

webpackConfig.module.rules = [...webpackConfig.module.rules,
    {
        test: /\.scss$/,
        use: [{
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
        },
            {
                // Interprets `@import` and `url()` like `import/require()` and will resolve them
                loader: 'css-loader'
            },
            {
                // Loads a SASS/SCSS file and compiles it to CSS
                loader: 'sass-loader',
                options: {
                    // Include the path to Vanilla
                    includePaths: ['./node_modules']
                }
            }
        ]
    },
    {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
            regExp: /(img\/.*)/,
            name: '[name].[ext]',
            publicPath: '../',
            outputPath: 'assets/img/'
        }
    },
    {
        test: /\.(json)$/,
        loader: 'file-loader',
        options: {
            regExp: /(sampledata\/.*)/,
            name: '[name].[ext]',
            publicPath: '../',
            outputPath: 'data/'
        }
    },
    {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
            regExp: /(fonts\/.*)/,
            name: '[name].[ext]',
            publicPath: '../',
            outputPath: 'fonts/'
        }
    }
];

webpackConfig.plugins = [...webpackConfig.plugins,
    new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
            return module.context && module.context.indexOf('node_modules') !== -1
        }
    }),
    new CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    }),
    extractSass,
    new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardUnused: false,
            discardComments: {removeAll: true}
        },
        canPrint: true
    }),
    new HtmlWebpackPlugin({
        inject: true,
        template: helpers.root('/src/index.html'),
        favicon: helpers.root('/src/favicon.ico'),
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    }),
    new UglifyJsPlugin({
        include: /\.js$/,
        minimize: true
    }),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        test: /\.js$/
    }),
    new DefinePlugin({
        'process.env': env
    }),
    new FaviconsWebpackPlugin(helpers.root('/src/icon.png'))
];

module.exports = webpackConfig;