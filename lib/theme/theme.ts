import { ThemeManager } from './plugin'
import { Theme } from './types'

const themeManager = new ThemeManager({})

const themes = themeManager.getThemes()
const currentTheme = themeManager.getCurrentTheme()
const addTheme = (theme: Theme): void => themeManager.addTheme(theme)
const removeTheme = (themeName: string): void => themeManager.removeTheme(themeName)
const updateTheme = (themeName: string, properties: Partial<Theme>): void => themeManager.updateTheme(themeName, properties)
const getCurrentTheme = () => {
  return themeManager.getCurrentTheme()
}

export { themeManager, themes, currentTheme, addTheme, removeTheme, updateTheme, getCurrentTheme }
