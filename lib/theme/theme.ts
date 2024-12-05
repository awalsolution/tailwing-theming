import { ThemeManager } from '@lib/theme/plugin'
import { Theme } from '@lib/theme/types'

export const themeManager = new ThemeManager({
  defaultTheme: 'light',
  themes: [
    {
      name: 'custom-theme',
      selectors: ['.custom-theme', '[data-theme="custom"'],
      extend: {
        colors: {
          primary: { DEFAULT: '#555' },
        },
      },
    },
  ],
})

export const themes = themeManager.getThemes()
export const currentTheme = themeManager.getCurrentTheme()
export const addTheme = (theme: Theme): void => themeManager.addTheme(theme)
export const removeTheme = (themeName: string): void => themeManager.removeTheme(themeName)
export const updateTheme = (themeName: string, properties: Partial<Theme>): void =>
  themeManager.updateTheme(themeName, properties)
export const getCurrentTheme = () => {
  return themeManager.getCurrentTheme()
}
