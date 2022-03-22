const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')
const webpack = require('webpack')

const srcDir = path.resolve(__dirname, 'src')
const outputDir = path.resolve(__dirname, 'dist')

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
      entry: { main: './src/main.ts' },
      node: {
        __dirname: false,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.FLUENTFFMPEG_COV': false,
        }),
      ],
      externals: {
        'ffmpeg-static': 'ffmpeg-static',
      },
    },
    commonConfig
  ),
  Object.assign(
    {
      target: 'electron-preload',
      entry: { preload: './src/preload.ts' },
    },
    commonConfig
  ),
  Object.assign(
    {
      target: 'electron-renderer',
      entry: { gui: './src/gui.tsx' },
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
