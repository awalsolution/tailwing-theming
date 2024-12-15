import { CurrentTheme, MultiThemePluginOptions, Theme, ThemeManagerOptions } from '../types'

class ThemeManager {
  private default: CurrentTheme
  private themes: Map<string, Theme>

  constructor({ themes = [], defaultTheme }: ThemeManagerOptions) {
    this.default = defaultTheme
    this.themes = new Map([...themes].map((theme) => [theme.name, theme]))
  }

  /**
   * Gets all available themes.
   * @returns An array of themes
   */

  public getThemes(): MultiThemePluginOptions {
    const themes = Array.from(this.themes.values())

    const defaultTheme = themes.find((theme) => theme.name === this.default) || themes[0]

    const filteredThemes = themes
      .filter((theme) => theme.name !== this.default)
      .map((theme) => ({
        ...theme,
        name: theme.name === 'dark' ? 'dark-theme' : theme.name,
        selectors: [`${theme.name}-theme`, `[data-theme="${theme.name}-theme"]`],
      }))

    const defaultOptions: MultiThemePluginOptions = {
      defaultTheme,
      themes: filteredThemes,
    }

    return defaultOptions
  }

  /**
   * Adds a new theme.
   * @param theme - The theme to add
   */

  public addTheme(theme: Theme): void {
    if (this.themes.has(theme.name)) {
      console.warn(`Theme "${theme.name}" already exists. It will be updated.`)
      this.updateTheme(theme.name, theme)
    } else {
      this.themes.set(theme.name, theme)
    }
  }

  /**
   * Removes an existing theme.
   * @param themeName - The name of the theme to remove
   */

  public removeTheme(themeName: string): void {
    if (!this.themes.has(themeName)) {
      console.warn(`Theme "${themeName}" does not exist.`)
      return
    }

    this.themes.delete(themeName)
  }

  /**
   * Updates an existing theme.
   * @param themeName - The name of the theme to update
   * @param properties - The properties to update
   */

  public updateTheme(themeName: string, properties: Partial<Theme>): void {
    const theme = this.themes.get(themeName)
    if (!theme) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }

    const updatedTheme = { ...theme, ...properties }
    this.themes.set(themeName, updatedTheme)
  }

  /**
   * Gets the current theme.
   * @returns The current theme
   */

  public getAvailableThemes(): Record<string, { name: string; selectors: string }> {
    const themes = Array.from(this.themes.values())
    const availableThemes: Record<string, { name: string; selectors: string }> = {}

    themes.forEach((theme) => {
      if (theme.selectors && theme.selectors.length > 0) {
        availableThemes[theme.name] = {
          name: `${theme.name}-theme`,
          selectors: theme.selectors
            .map((selector) =>
              selector.startsWith('[data-theme')
                ? `data-theme="${selector.replace('[data-theme=', '').replace(']', '')}-theme"`
                : `class="${selector}-theme"`,
            )
            .join(' '),
        }
      } else {
        availableThemes[theme.name] = {
          name: `${theme.name}-theme`,
          selectors: `class="${theme.name}-theme" data-theme="${theme.name}-theme"`,
        }
      }
    })

    return availableThemes
  }
}

export { ThemeManager }
