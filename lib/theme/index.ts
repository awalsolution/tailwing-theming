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
  private default!: DefaultThemeName
  private themes!: MultiThemePluginOptions

  constructor() {
    this.default = 'light-theme'
    this.themes = {
      defaultTheme: {
        name: 'light-theme',
        extend: { colors: { background: '#FFFFFF' } },
      },
    }
  }

  private deepMerge<T extends Record<string, any>>(target: Partial<T>, source: Partial<T>): T {
    if (typeof target !== 'object' || target === null) {
      return source as T
    }

    if (typeof source !== 'object' || source === null) {
      return target as T
    }

    const result = (Array.isArray(target) ? [...target] : { ...target }) as Partial<T>

    for (const key of Object.keys(source) as Array<keyof T>) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        result[key] = this.deepMerge(targetValue as Partial<T[keyof T]>, sourceValue as Partial<T[keyof T]>)
      } else {
        result[key] = sourceValue
      }
    }

    return result as T
  }

  /**
   * Validate theme name.
   * @param themeName - The theme name to validate
   */

  private validateThemeName(themeName: DefaultThemeName) {
    if (!themeName.match(/theme$/i))
      throw new Error(`Object keys must contain theme suffix example: "${themeName}-theme" or "${themeName}Theme"`)
  }

  /**
   * Find a theme by name.
   * @param themeName - The theme name to find
   */

  private find(themeName: DefaultThemeName): DefaultThemeConfig | ThemeConfig | null {
    const checkDefault =
      this.default === themeName && this.themes.defaultTheme?.name === themeName ? this.themes.defaultTheme : null
    const checkThemes = this.themes['themes']?.find((t) => t.name === themeName)
    if (checkDefault) return checkDefault
    if (checkThemes) return checkThemes
    return null
  }

  /**
   * Set default theme.
   * @param themeName - The theme name to set new default theme
   */

  public init({ themes = {}, defaultTheme, utilities }: ThemeManagerType) {
    const mergedThemes: { name: string; extend: TailwindExtension }[] = []

    Object.entries(themes).reduce(
      (acc, [key, value]) => {
        this.validateThemeName(key)

        const updatedTheme = {
          name: key,
          extend: value,
        }
        mergedThemes.push(updatedTheme)
        acc[key] = value
        return acc
      },
      {} as Record<string, any>,
    )

    // Merge with existing themes
    const existingThemes = this.themes.themes ?? []
    const mergedProcessedThemes = [...existingThemes, ...mergedThemes]

    this.default = defaultTheme || this.default

    const defaultThemeObject = mergedProcessedThemes.find((theme) => theme.name === this.default) ?? mergedProcessedThemes[0]

    const processedThemes = mergedProcessedThemes
      .filter((theme) => theme.name !== this.default)
      .map((theme) => ({
        ...theme,
        selectors: [`[data-theme="${theme.name}"]`],
      }))

    this.themes = {
      defaultTheme: defaultThemeObject,
      themes: processedThemes,
      utilities: this.deepMerge(this.themes.utilities!, utilities || {}),
    }
  }

  /**
   * Set default theme.
   * @param themeName - The theme name to set new default theme
   */

  public defaultTheme(themeName: DefaultThemeName) {
    this.validateThemeName(themeName)

    const find = this.find(themeName)

    if (!find) throw new Error(`Theme "${themeName}" does not exists.`)

    if (this.default === find.name) return

    this.default = themeName

    const previousDefaultTheme = this.themes.defaultTheme

    const otherThemes = this.themes.themes?.filter((t) => t.name !== themeName) ?? []

    otherThemes.push({
      name: previousDefaultTheme?.name ?? '',
      selectors: [`[data-theme="${previousDefaultTheme?.name}"]`],
      extend: previousDefaultTheme?.extend ?? {},
    })

    const createNewThemes: MultiThemePluginOptions = {
      defaultTheme: { extend: find.extend, name: find.name },
      themes: otherThemes,
    }

    this.themes = {
      ...createNewThemes,
      utilities: this.themes.utilities,
    }
  }

  /**
   * Set default theme.
   * @param utilities - utilities classes for tailwind css it will merge previous and new classes
   */

  public addUtilities(utilities: Record<string, any>) {
    this.themes.utilities = { ...this.themes.utilities, ...utilities }
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
    this.validateThemeName(theme.name)

    const find = this.find(theme.name)

    if (find) throw new Error(`Theme "${theme.name}" already exists.`)

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
    this.validateThemeName(themeName)

    const find = this.find(themeName)

    if (!find) throw new Error(`Theme "${themeName}" does not exists.`)

    const updatedTheme = {
      ...find,
      extend: this.deepMerge(find.extend ?? {}, properties),
    }

    if (themeName === this.default) {
      this.themes.defaultTheme = updatedTheme
    } else {
      const otherThemes = this.themes.themes?.filter((t) => t.name !== themeName) ?? []
      this.themes.themes = [...otherThemes, updatedTheme]
    }
  }

  /**
   * Remove a theme by name.
   * @param themeName - The name of the theme to remove
   */

  public remove(themeName: DefaultThemeName): void {
    const index = this.themes.themes?.findIndex((t) => t.name === themeName)

    if (index === undefined || index === -1) throw new Error(`Theme "${themeName}" does not exist.`)
    this.themes.themes?.splice(index, 1)
  }

  /**
   * Get all available themes.
   * @returns MultiThemePluginOptions containing the default theme and additional themes.
   */

  public get(): MultiThemePluginOptions {
    return this.themes
  }
}

const themeManager = new ThemeManager()

export { themeManager }
