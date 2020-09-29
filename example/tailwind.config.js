module.exports = {
  purge: {
    content: ['./src/**/*.vue'],
    options: {
      whitelist: []
    }
  },
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E6FAF2',
          200: '#BFF3E0',
          300: '#99EBCD',
          400: '#4DDCA7',
          500: '#00CD81',
          600: '#00B974',
          700: '#007B4D',
          800: '#005C3A',
          900: '#003E27'
        }
      },
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
