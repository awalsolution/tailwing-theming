import { ThemeManager } from '../theme/plugin/themeManager'

const themeManager = new ThemeManager({
  themes: [
    {
      name: 'custom',
      extend: {
        colors: {
          background: { DEFAULT: '#555' },
        },
      },
      selectors: ['custom', '[data-theme="custom"]'],
    },
  ],
})

themeManager.addTheme({
  name: 'umer',
  extend: {
    colors: {
      background: { DEFAULT: 'green' },
      primary: { DEFAULT: 'red' },
    },
  },
  selectors: ['umer', '[data-theme="umer"]'],
})

export const customTheme = themeManager.getThemes()
