module.exports = {
  purge: {
    content: ['./src/**/*.vue'],
    options: {
      whitelist: []
    }
  },
  theme: {
    extend: {
      inset: {
        '1/2': '50%'
      },
      maxHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%'
      },
      height: {
        '1/2': '50%'
      }
    }
  },
  variants: {},
  plugins: []
}
