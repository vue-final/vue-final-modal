const path = require('path')

module.exports = async ({ config }) => {
  //   config.module.rules.push({
  //     test: /\.stories\.jsx?$/,
  //     loaders: [require.resolve('@storybook/addon-storysource/loader')],
  //     enforce: 'pre'
  //   })
  //   config.module.rules.push({
  //     test: /\.pug$/,
  //     loader: 'pug-plain-loader'
  //   })

  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader']
  })

  config.resolve.alias['@'] = path.join(__dirname, '..', 'src')
  config.resolve.alias['~'] = path.join(__dirname, '..', 'src')

  return config
}
