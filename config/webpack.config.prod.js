process.env.__DEV__ = 'production';
// 引入插件
const fs = require("fs");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const getClientEnvironment = require('./env');
const webpack = require('webpack')
// less的全局变量
// const globalLessVars = require('../src/common/global_less_vars');
const path = require('path');
const paths = require('./paths');


const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';

const cssFilename = 'css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths ? {
    publicPath: Array(cssFilename.split('/').length).join('../')
} : {};


const getEntry = function () {
    const jsPath = path.resolve("src/pages");
    const dirs = fs.readdirSync(jsPath);
    const r = [];
    dirs.forEach(v => {
        if (v[0] != '.') {
            r.push(v);
        }
    });
    return r;
}
// 扫描入口目录
const entryArr = getEntry();

// 多入口注入
let plugins = entryArr.map(page => {
    return new HtmlWebpackPlugin({
        inject: true,
        filename: path.resolve(__dirname, `../build/${page}.html`),
        template: path.resolve(__dirname, `../src/pages/${page}/index.html`),
        chunks: [page], // 实现多入口的核心，决定自己加载哪个js文件，这里的 page 指的是 entry 对象的 key 所对应的入口打包出来的js文件
        // hash: true, // 为静态资源生成hash值
        minify: true, // 压缩，如果启用这个的话，需要使用html-minifier，不然会直接报错
        xhtml: true, // 自闭标签
    })
})

// 入口管理
let entry = {};

entryArr.map(page => {
    entry[page] = path.resolve(__dirname, `../src/pages/${page}/index.js`)
})

module.exports = {
    // 入口文件
    entry: entry,
    // 出口文件
    output: {
        path: paths.appBuild,
        publicPath: publicPath,
        // filename: '[name].[hash:8].js'
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        devtoolModuleFilenameTemplate: info =>
            path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/'),
    },
    resolve: {
        alias: {
            '@': paths.appSrc,
        },
    },
    devServer: {
        contentBase: __dirname + '/../dist',
        hot: true,
        port: '9090'
    },
    module: {
        // loader放在rules这个数组里面
        rules: [{
            oneOf: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: require.resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract(
                        Object.assign({
                                fallback: {
                                    loader: require.resolve('style-loader'),
                                    options: {
                                        hmr: false,
                                    },
                                },
                                use: [{
                                        loader: require.resolve('css-loader'),
                                        options: {
                                            importLoaders: 1,
                                            minimize: true,
                                            sourceMap: false,
                                        },
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {
                                            // Necessary for external CSS imports to work
                                            // https://github.com/facebookincubator/create-react-app/issues/2677
                                            ident: 'postcss',
                                            plugins: () => [
                                                require('postcss-flexbugs-fixes'),
                                                autoprefixer({
                                                    browsers: [
                                                        '>1%',
                                                        'last 4 versions',
                                                        'Firefox ESR',
                                                        'not ie < 9', // React doesn't support IE8 anyway
                                                    ],
                                                    flexbox: 'no-2009',
                                                }),
                                            ],
                                        },
                                    },
                                ],
                            },
                            extractTextPluginOptions
                        )
                    ),
                },
                // 处理 sass
                {
                    test: /\.scss$/,
                    // include: paths.appSrc,
                    use: ExtractTextPlugin.extract({
                            fallback: require.resolve('style-loader'),
                            use: [{
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 2,
                                        modules: true,
                                        minimize: true,
                                        // localIdentName: '[name]__[local]--[hash:base64:5]',
                                        localIdentName: '[local]',
                                        camelCase: 'dashes',
                                        sourceMap: true,
                                        alias: {
                                            '@': paths.appSrc
                                        },
                                    },
                                },
                                {
                                    loader: require.resolve('postcss-loader'),
                                    options: {
                                        // Necessary for external CSS imports to work
                                        // https://github.com/facebookincubator/create-react-app/issues/2677
                                        ident: 'postcss',
                                        plugins: () => [
                                            require('postcss-flexbugs-fixes'),
                                            autoprefixer({
                                                browsers: [
                                                    '>1%',
                                                    'last 4 versions',
                                                    'Firefox ESR',
                                                    'not ie < 9', // React doesn't support IE8 anyway
                                                ],
                                                flexbox: 'no-2009',
                                            }),
                                        ],
                                    },
                                },
                                {
                                    loader: require.resolve('sass-loader'),
                                },
                            ],
                        }),
                },
                {
                    test: /\.less$/,
                    use: [
                        require.resolve('style-loader'),
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 2,
                                alias: {
                                    '@': paths.appSrc
                                },
                                minimize: true,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                // Necessary for external CSS imports to work
                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                        {
                            loader: 'less-loader', // compiles Less to CSS
                            options: {
                                // globalVars: globalLessVars
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|jpe?g|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'img/[name].[hash:8].[ext]',
                            // name: '[hash:8].[ext]',
                            // outputPath: function (fileName) {
                            //     return '@/img/' + fileName // 后面要拼上这个 fileName 才行
                            // }
                        }
                    }]
                },
                {
                    test: /\.(htm|html)$/,
                    use: [{
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'img:data-src', 'audio:src'],
                            // name: '[name].[ext]',
                        }
                    }]
                }
            ]
        }, ]
    },
    // 将插件添加到webpack中
    // 如果还有其他插件，将两个数组合到一起就行了
    plugins: ([
        new CleanWebpackPlugin(paths.appBuild, {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "foo", // 这个对应的是 entry 的 key
        //     minChunks: 2
        // }),
        // new UglifyJSPlugin(),
        new ExtractTextPlugin({
            filename: cssFilename,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin(env.stringified),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                comparisons: false,
                drop_debugger: true,
                drop_console: true,
            },
            mangle: {
                safari10: true,
            },
            output: {
                comments: false,
                ascii_only: true,
            },
            sourceMap: false,
        }),
    ].concat(plugins))
}