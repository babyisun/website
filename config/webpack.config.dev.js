process.env.NODE_ENV = 'development';
// 引入插件
const fs = require("fs");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const getClientEnvironment = require('./env');
const webpack = require('webpack')
// less的全局变量
// const globalLessVars = require('../src/common/global_less_vars');
const path = require('path');
const paths = require('./paths');

const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

console.log(env);

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
        filename: path.resolve(__dirname, `../build/${page}.html`),
        template: path.resolve(__dirname, `../src/pages/${page}/index.html`),
        chunks: [page], // 实现多入口的核心，决定自己加载哪个js文件，这里的 page 指的是 entry 对象的 key 所对应的入口打包出来的js文件
        // hash: true, // 为静态资源生成hash值
        minify: false, // 压缩，如果启用这个的话，需要使用html-minifier，不然会直接报错
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
        // 文件名，将打包好的导出为bundle.js
        filename: '[name].[hash:8].js'
    },
    resolve: {
        alias: {
            '@': paths.appSrc,
        },
    },
    devServer: {
        contentBase: paths.appBuild,
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
                    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
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
                    }), )
                },
                // 处理 sass
                {
                    test: /\.scss$/,
                    include: paths.appSrc,
                    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            fallback: require.resolve('style-loader'),
                            use: [{
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 2,
                                        modules: true,
                                        // localIdentName: '[name]__[local]--[hash:base64:5]',
                                        localIdentName: '[local]',
                                        camelCase: 'dashes',
                                        // sourceMap: true,
                                        alias: {
                                            '@': paths.appSrc
                                        }
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
                        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                    ),
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
                                }
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
                            attrs: ['img:src', 'img:data-src', 'audio:src']
                        }
                    }]
                },
                {
                    // Exclude `js` files to keep "css" loader working as it injects
                    // its runtime that would otherwise be processed through "file" loader.
                    // Also exclude `html` and `json` extensions so they get processed
                    // by webpacks internal loaders.
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'assest/[name].[hash:8].[ext]',
                    },
                },
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
        new ExtractTextPlugin({
            filename: 'style.[hash:8].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "foo", // 这个对应的是 entry 的 key
        //     minChunks: 2
        // }),
        // new UglifyJSPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin(env.stringified),
    ].concat(plugins))
}