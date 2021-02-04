const helpers = require("./helpers");
const webpackConfig = require("./webpack.config.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const env = require("../environment/dev.env");

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
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2|json)$/,
        loader: "file-loader"
    }
];

webpackConfig.plugins = [...webpackConfig.plugins,
    new HtmlWebpackPlugin({
        inject: true,
        template: helpers.root("/src/index.html"),
        favicon: helpers.root("/src/favicon.ico")
    }),
    new DefinePlugin({
        "process.env": env
    })
];

webpackConfig.devServer = {
    port: 8080,
    host: "localhost",
    historyApiFallback: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    contentBase: "./src",
    open: true
};

module.exports = webpackConfig;
