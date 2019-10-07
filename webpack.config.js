'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = () => {
    let lintOptions = { fix: false, failOnError: false };
    let srcPath = [path.resolve(__dirname, 'src')];
    let modulePath = [path.resolve('.'), path.join(__dirname, 'node_modules'), path.join(__dirname, 'tools')];
    let webpackConfig = {
        performance: { hints: false },
        entry: path.resolve(__dirname, 'src/index.js'),

        resolve: {
            modules: modulePath,
            extensions: ['.js', '.json', '.css', '.scss', '.jsx'],
            alias: {
                containers: path.resolve(__dirname, 'src/containers'),
                components: path.resolve(__dirname, 'src/components'),
                scss: path.resolve(__dirname, 'src/scss')
            }
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index_bundle_[hash].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: [srcPath],
                    use: [
                        { loader: 'babel-loader' },
                        { loader: 'eslint-loader', options: lintOptions }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'source-map-loader',
                    include: [srcPath],
                    enforce: 'pre'
                },
                {
                    test: /\.(css|scss)$/,
                    exclude: [/node_modules/],
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'index.html'),
                contextPath: '/'
            })
        ],
        devServer: {
            before: function(app) {
                app.get('/sudoku', function(req, res) {
                    var promise1 = new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve('foo');
                        }, 500);
                    });
                    promise1.then(function() {
                        let mockData = null;
                        if (req.query.difficulty !== undefined) {
                            mockData = require('./tools/mocks/mockData' + req.query.difficulty + '.json');
                        } else {
                            mockData = require('./tools/mocks/mockData.json');
                        }
                        res.json(mockData);
                    });
                });
            }
        }
    };
    return webpackConfig;
};
