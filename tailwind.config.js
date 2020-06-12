module.exports = {
  purge: {
    content: ['./src/**/*.vue'],
    options: {
      whitelist: []
    }
  },
  theme: {
    extend: {},
    inset: {
      '0': 0,
      auto: 'auto',
      '1/2': '50%'
    },
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%'
    }
  },
  variants: {},
  plugins: []
}
