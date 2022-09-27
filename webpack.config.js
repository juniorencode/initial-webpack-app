const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const optimization = {
  minimize: true,
  minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
};

const devServer = {
  static: { directory: path.join(__dirname, 'build') },
  compress: true,
  port: 3001,
  historyApiFallback: true,
  open: true
};

module.exports = (env, { mode }) => {
  const isProduction = mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js'
      // publicPath: './'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader'
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset',
          generator: {
            filename: './static/images/[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2)$/,
          type: 'asset',
          generator: {
            filename: './static/fonts/[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].css'
      }),
      new CleanWebpackPlugin()
    ],
    optimization: isProduction ? optimization : {},
    devServer: !isProduction ? devServer : {}
  };
};
