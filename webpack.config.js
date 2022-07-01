const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const srcDir = path.resolve(__dirname, 'src/app')
const outputDir = path.resolve(__dirname, 'dist')
const ffmpegPath = path.join('node_modules', 'ffmpeg-static')
const ffprobePath = path.join('node_modules', 'ffprobe-static/bin/win32/x64')

const commonConfig = {
  output: {
    path: outputDir,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.tsx?$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
}

module.exports = [
  Object.assign(
    {
      target: 'electron-main',
      entry: { main: './src/app/js/main.ts' },
      node: {
        __dirname: false,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.FLUENTFFMPEG_COV': false,
        }),
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(ffmpegPath, 'ffmpeg.exe'),
              to: outputDir,
            },
            {
              from: path.resolve(ffprobePath, 'ffprobe.exe'),
              to: outputDir,
            },
          ],
        }),
      ],
    },
    commonConfig
  ),
  Object.assign(
    {
      target: 'electron-preload',
      entry: { preload: './src/app/js/preload.ts' },
    },
    commonConfig
  ),
  Object.assign(
    {
      target: 'electron-renderer',
      entry: { gui: './src/app/js/gui.tsx' },
      plugins: [
        new RemovePlugin({
          before: {
            log: false,
            include: [outputDir],
          },
        }),
        new HtmlWebpackPlugin({
          template: path.join(srcDir, 'index.html'),
          inject: 'body',
        }),
      ],
    },
    commonConfig
  ),
]
