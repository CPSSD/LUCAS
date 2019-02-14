/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

process.noDeprecation = true;

module.exports = (options) => {
  const env = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  return {
    mode: options.mode,
    entry: options.entry,
    output: Object.assign({
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    }, options.output),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: options.babelQuery,
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                query: {
                  gifsicle: {
                    interlaced: true
                  },
                  mozjpeg: {
                    progressive: true
                  },
                  optipng: {
                    optimizationLevel: 7
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  }
                }
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.(mp4|webm)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000
            },
          },
        },
      ],
    },
    plugins: options.plugins.concat([
      new webpack.ProvidePlugin({
        fetch: 'exports-loader?self.fetch!whatwg-fetch'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        },
      }),
      new webpack.DefinePlugin(envKeys)
    ]),
    resolve: {
      modules: ['app', 'node_modules'],
      extensions: [
        '.js',
        '.jsx',
        '.scss',
        '.react.js'
      ],
      mainFields: [
        'browser',
        'jsnext:main',
        'main'
      ]
    },
    devtool: options.devtool,
    target: 'web',
    performance: options.performance || {},
    optimization: {
      namedModules: true,
      splitChunks: {
        name: 'vendor',
        minChunks: 2
      }
    }
  }
};
