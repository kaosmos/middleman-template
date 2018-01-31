const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin'); // SVG icons system

const extractSass = new ExtractTextPlugin({
  filename: "stylesheets/[name].css",
  disable: process.env.NODE_ENV === "development"
});

// SVG icons system prefs - start
var svgSpriteLoaderConfig = JSON.stringify({
  extract: true,
  spriteFilename: "sprite.svg"
});
var svgoConfig = JSON.stringify({
  multipass: true,
  pretty: true,
  plugins: [
    {cleanupAttrs: true},
    {cleanupEnableBackground: true},
    {cleanupIDs: true},
    {cleanupListOfValues: true},
    {cleanupNumericValues: true},
    {collapseGroups: true},
    {convertColors: true},
    {convertPathData: true},
    {convertShapeToPath: true},
    {convertStyleToAttrs: true},
    {convertTransform: true},
    {mergePaths: true},
    {moveElemsAttrsToGroup: true},
    {moveGroupAttrsToElems: true},
    {removeAttrs: {attrs: '(fill|stroke)'}}, // if you don't want any color from the original svg
    {removeComments: true},
    {removeDesc: false}, // for usability reasons
    {removeDimensions: true},
    {removeDoctype: true},
    {removeEditorsNSData: true},
    {removeEmptyAttrs: true},
    {removeEmptyContainers: true},
    {removeEmptyText: true},
    {removeHiddenElems: true},
    {removeMetadata: true},
    {removeNonInheritableGroupAttrs: true},
    {removeRasterImages: true}, // bitmap! you shall not pass!
    {removeTitle: false}, // for usability reasons
    {removeUnknownsAndDefaults: true},
    {removeUnusedNS: true},
    {removeUselessDefs: true},
    {removeUselessStrokeAndFill: true},
    {removeViewBox: false},
    {removeXMLProcInst: true},
    {sortAttrs: true}
  ]
});
// SVG icons system prefs - end

module.exports = {
  entry: {
    application: './source/javascripts/index.js',
    svg: './source/svg/svg_icons.js',
    styles: './source/stylesheets/application.sass'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'source/javascripts'),
      "node_modules"
    ],
    alias: {
      modernizr$: path.resolve(__dirname, ".modernizrrc.js")
    }
  },
  output: {
    path: path.resolve(__dirname, '.tmp/dist'),
    filename: 'javascripts/[name].js',
  },
  module: {
    rules: [
      {
        loader: "webpack-modernizr-loader",
        test: /\.modernizrrc\.js$/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.s[ac]ss/,
        use: 'import-glob-loader'
      },
      {
        test: /\.s[ac]ss$/,
        use: extractSass.extract({
          use: [
            { loader: "css-loader" },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()]
              }
            },
            { loader: "sass-loader" }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.svg$/,
        loaders: [
          'svg-sprite-loader?' + svgSpriteLoaderConfig,
          'svgo?' + svgoConfig
        ]
      }
    ]
  },
  plugins: [
    extractSass,
    new SpriteLoaderPlugin({ plainSprite: true }) // renders a plain sprite without styles and usages in extract mode, as we want it
  ]
};
