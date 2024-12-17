import { TailwindExtension } from '../config'
import {
  AddThemeType,
  DefaultThemeConfig,
  DefaultThemeName,
  MultiThemePluginOptions,
  ThemeConfig,
  ThemeManagerType,
} from './types'

class ThemeManager {
  private default: DefaultThemeName
  private themes: MultiThemePluginOptions

  constructor({ themes = {}, defaultTheme }: ThemeManagerType) {
    if (!Object.keys(themes).length) {
      throw new Error('No themes provided.')
    }

    const createThemes: { name: string; extend: TailwindExtension }[] = []

    Object.entries(themes).reduce(
      (acc, [key, value]) => {
        if (!key.match(/theme$/i)) {
          throw new Error('Object keys must contain -theme suffix')
        }

        const updatedTheme = {
          name: key,
          extend: value,
        }
        createThemes.push(updatedTheme)
        acc[key] = value
        return acc
      },
      {} as Record<string, any>,
    )

    this.default = defaultTheme ? defaultTheme : createThemes[0]?.name

    if (!this.default) {
      throw new Error('No default theme could be determined.')
    }

    const defaultThemeObject = createThemes.find((theme) => theme.name === this.default) ?? createThemes[0]

    const processedThemes = createThemes
      .filter((theme) => theme.name !== this.default)
      .map((theme) => ({
        ...theme,
        name: theme.name,
        selectors: [`${theme.name}`, `[data-theme="${theme.name}"]`],
      }))

    this.themes = {
      defaultTheme: defaultThemeObject,
      themes: processedThemes,
    }
    console.log('themes ==>', this.themes)
  }

  /**
   * Find a theme by name.
   * @param themeName - The theme name to find
   */

  private findTheme(themeName: DefaultThemeName): DefaultThemeConfig | ThemeConfig | null {
    const checkDefault = this.default === themeName && this.themes['defaultTheme']
    const checkThemes = this.themes['themes']?.find((t) => t.name === themeName)
    return checkDefault || checkThemes || null
  }

  /**
   * Get all available themes.
   * @returns MultiThemePluginOptions containing the default theme and additional themes.
   */

  public getThemes(): MultiThemePluginOptions {
    return this.themes
  }

  /**
   * Add a new theme.
   * @param theme - The theme to add
   */

  public addTheme(theme: AddThemeType): void {
    const find = this.findTheme(theme.name)
    if (find) {
      throw new Error(`Theme "${theme.name}" already exists.`)
    }
    const newTheme: ThemeConfig = {
      name: theme.name,
      selectors: theme.selectors,
      mediaQuery: theme.mediaQuery,
      extend: { ...theme.theme },
    }
    this.themes.themes?.push(newTheme)
  }

  /**
   * Remove a theme by name.
   * @param themeName - The name of the theme to remove
   */
  public removeTheme(themeName: DefaultThemeName): void {
    const index = this.themes.themes?.findIndex((t) => t.name === themeName)
    if (index === undefined || index === -1) {
      console.warn(`Theme "${themeName}" does not exist.`)
      return
    }
    this.themes.themes?.splice(index, 1)
  }

  /**
   * Update an existing theme.
   * @param themeName - The name of the theme to update
   * @param properties - The properties to update
   */
  public updateTheme(themeName: string, properties: Partial<TailwindExtension>): void {
    if (themeName === this.default) {
      this.themes.defaultTheme = {
        ...this.themes.defaultTheme,
        extend: { ...this.themes.defaultTheme?.extend, ...properties },
      }
    } else {
      const theme = this.themes.themes?.find((t) => t.name === themeName)
      if (!theme) {
        throw new Error(`Theme "${themeName}" does not exist.`)
      }
      theme.extend = { ...theme.extend, ...properties }
    }
  }

  /**
   * Get available themes with their names and selectors.
   * @returns An object of available themes
   */
  public getAvailableThemes(): Record<string, { name: string; selectors?: string[] }> {
    const availableThemes: Record<string, { name: string; selectors?: string[] }> = {}
    availableThemes['default'] = { name: this.default ?? '' }
    this.themes.themes?.forEach((theme) => {
      availableThemes[theme.name] = { name: theme.name, selectors: theme.selectors }
    })
    return availableThemes
  }
}

export { ThemeManager }
