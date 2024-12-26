import { TailwindExtension } from '../config'
import {
  AddThemeType,
  DefaultThemeConfig,
  DefaultThemeName,
  MultiThemePluginOptions,
  ThemeConfig,
  ThemeManagerType,
} from '../types'

class ThemeManager {
  private default: DefaultThemeName
  private themes: MultiThemePluginOptions

  constructor({ themes = {}, defaultTheme, utilities }: ThemeManagerType) {
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
        selectors: [`[data-theme="${theme.name}"]`],
      }))

    this.themes = {
      defaultTheme: defaultThemeObject,
      themes: processedThemes,
      utilities: utilities,
    }
  }

  /**
   * Find a theme by name.
   * @param themeName - The theme name to find
   */

  private find(themeName: DefaultThemeName): DefaultThemeConfig | ThemeConfig | null {
    const checkDefault = this.default === themeName && this.themes['defaultTheme']
    const checkThemes = this.themes['themes']?.find((t) => t.name === themeName)
    return checkDefault || checkThemes || null
  }

  /**
   * Get all available themes.
   * @returns MultiThemePluginOptions containing the default theme and additional themes.
   */

  public get(): MultiThemePluginOptions {
    return this.themes
  }

  /**
   * Get available themes with their names and selectors.
   * @returns An object of available themes
   */

  public getThemeSelectors(): Record<string, { name: string; selectors?: string[] }> {
    const availableThemes: Record<string, { name: string; selectors?: string[] }> = {}
    availableThemes['default'] = { name: this.default ?? '' }
    this.themes.themes?.forEach((theme) => {
      availableThemes[theme.name] = { name: theme.name, selectors: theme.selectors }
    })
    return availableThemes
  }

  /**
   * Add a new theme.
   * @param theme - The theme to add
   */

  public add(theme: AddThemeType): void {
    if (!theme.name.match(/theme$/i)) {
      throw new Error('Object keys must contain -theme suffix')
    }
    const find = this.find(theme.name)
    if (find) {
      throw new Error(`Theme "${theme.name}" already exists.`)
    }
    const newTheme: ThemeConfig = {
      name: theme.name,
      selectors: [`[data-theme="${theme.name}"]`],
      extend: { ...theme.theme },
    }
    this.themes.themes?.push(newTheme)
  }

  /**
   * Update an existing theme.
   * @param themeName - The name of the theme to update
   * @param properties - The properties to update
   */

  public update(themeName: string, properties: Partial<TailwindExtension>): void {
    if (!themeName.match(/theme$/i)) {
      throw new Error('Object keys must contain -theme suffix')
    }
    const find = this.find(themeName)
    if (!find) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }

    if (themeName === this.default) {
      this.themes.defaultTheme = {
        ...this.themes.defaultTheme,
        extend: {
          ...this.themes.defaultTheme?.extend,
          ...properties,
        },
      }
    } else {
      this.themes.themes?.forEach((t) => {
        if (t.name === themeName) {
          t.extend = {
            ...t.extend,
            ...properties,
          }
        }
      })
    }
  }

  /**
   * Remove a theme by name.
   * @param themeName - The name of the theme to remove
   */

  public remove(themeName: DefaultThemeName): void {
    const index = this.themes.themes?.findIndex((t) => t.name === themeName)
    if (index === undefined || index === -1) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }
    this.themes.themes?.splice(index, 1)
  }
}

export { ThemeManager }
