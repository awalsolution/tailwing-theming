import { ThemeManager } from '@lib/theme/plugin'

export const themeManager = new ThemeManager({
  defaultTheme: 'light',
})

export const themes = themeManager.getThemes()
export const theme = themeManager.getCurrentTheme()
export const getCurrentTheme = () => {
  return themeManager.getCurrentTheme()
}
