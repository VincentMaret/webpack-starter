const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const SRC_PATH = path.resolve(__dirname, 'src');
const STATIC_PATH = path.resolve(__dirname, 'public');
const BUILD_PATH = path.resolve(__dirname, 'dist');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['babel-polyfill', path.resolve(SRC_PATH, 'index.js')],
  output: {
    path: BUILD_PATH,
    filename: './script.min.js'
  },
  resolve: {
    alias: {
      A_SRC: SRC_PATH,
      vue: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.min.css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'add title',
      template: path.resolve(STATIC_PATH, 'index.html')
    }),
    new CopyWebpackPlugin([{
      from: STATIC_PATH,
      to: BUILD_PATH,
      toType: 'dir'
    }]),
    new VueLoaderPlugin()
  ],
  devServer: {
    contentBase: BUILD_PATH,
    historyApiFallback: true,
    inline: true,
    hot: true,
    liveReload: false,
    open: false,
    port: 8080,
    stats: {
      children: false, // Hide children information
      maxModules: 0 // Set the maximum number of modules to be shown
    }
  }
}
