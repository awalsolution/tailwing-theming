// import { themes } from '../theme/semanticColors'
import { ThemeManager } from '../theme/themeManager'

const themeManager = new ThemeManager({
  defaultTheme: 'lightTheme',
  themes: {
    lightTheme: {
      colors: {
        background: { DEFAULT: 'white' },
        foreground: { DEFAULT: 'black' },
        primary: { DEFAULT: 'blue' },
      },
    },
    'dark-theme': {
      colors: {
        background: { DEFAULT: 'black' },
        foreground: { DEFAULT: 'white' },
        primary: { DEFAULT: 'green' },
      },
    },
    purpleTheme: {
      colors: {
        background: { DEFAULT: 'purple' },
        foreground: { DEFAULT: 'white' },
        primary: { DEFAULT: 'red' },
      },
    },
  },
})

const customTheme = themeManager.getThemes()
export { themeManager, customTheme }
