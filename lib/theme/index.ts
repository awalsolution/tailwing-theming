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
  private defaultThemeName?: DefaultThemeName
  private themesConfig: MultiThemePluginOptions

  constructor() {
    this.themesConfig = { themes: [] }
  }

  /**
   * Deeply merges two objects.
   */
  private deepMerge<T extends Record<string, any>>(target: Partial<T>, source: Partial<T>): T {
    if (typeof target !== 'object' || target === null) {
      return source as T
    }

    if (typeof source !== 'object' || source === null) {
      return target as T
    }

    const result = { ...target } as Partial<T>

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
   * Validates if a theme name has the required suffix.
   */
  private validateThemeName(themeName: DefaultThemeName): void {
    if (!themeName.match(/theme$/i)) {
      throw new Error(`Theme names must end with "theme" (e.g., "light-theme", "dark-theme"). Invalid name: "${themeName}".`)
    }
  }

  /**
   * Finds a theme by name.
   */
  private findTheme(themeName: DefaultThemeName): DefaultThemeConfig | ThemeConfig | null {
    if (this.defaultThemeName === themeName) {
      return this.themesConfig?.defaultTheme ?? null
    }
    return this.themesConfig?.themes?.find((t) => t.name === themeName) ?? null
  }

  /**
   * Initializes the ThemeManager with themes and utilities.
   */
  public init({ themes = {}, defaultTheme, utilities }: ThemeManagerType): void {
    if (!Object.keys(themes).length) {
      throw new Error('No themes provided.')
    }

    const processedThemes: ThemeConfig[] = []

    for (const [key, value] of Object.entries(themes)) {
      this.validateThemeName(key)
      processedThemes.push({ name: key, selectors: [`[data-theme="${key}"]`], extend: value })
    }

    this.defaultThemeName = defaultTheme || processedThemes[0]?.name

    if (!this.defaultThemeName) {
      throw new Error('No default theme could be determined.')
    }

    const defaultThemeConfig = processedThemes.find((t) => t.name === this.defaultThemeName) ?? processedThemes[0]

    this.themesConfig = {
      defaultTheme: defaultThemeConfig,
      themes: processedThemes.filter((t) => t.name !== this.defaultThemeName),
      utilities: utilities || {},
    }
  }

  /**
   * Sets the default theme.
   */
  public setDefaultTheme(themeName: DefaultThemeName): void {
    this.validateThemeName(themeName)

    const theme = this.findTheme(themeName)
    if (!theme) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }

    if (this.defaultThemeName === themeName) return

    const previousDefault = this.themesConfig?.defaultTheme

    this.defaultThemeName = themeName

    const newThemes = this.themesConfig?.themes?.filter((t) => t.name !== themeName) ?? []
    if (previousDefault) {
      newThemes.push({
        name: previousDefault.name,
        selectors: [`[data-theme="${previousDefault.name}"]`],
        extend: previousDefault.extend,
      })
    }

    this.themesConfig = {
      defaultTheme: theme,
      themes: newThemes,
      utilities: this.themesConfig?.utilities,
    }
  }

  /**
   * Adds a new theme.
   */

  public addTheme(theme: AddThemeType): void {
    this.validateThemeName(theme.name)

    if (this.findTheme(theme.name)) {
      throw new Error(`Theme "${theme.name}" already exists.`)
    }

    const newTheme: ThemeConfig = {
      name: theme.name,
      selectors: [`[data-theme="${theme.name}"]`],
      extend: theme.theme,
    }

    this.themesConfig?.themes?.push(newTheme)
  }

  /**
   * Updates an existing theme.
   */
  public updateTheme(themeName: string, properties: Partial<TailwindExtension>): void {
    this.validateThemeName(themeName)

    const theme = this.findTheme(themeName)
    if (!theme) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }

    const updatedTheme = { ...theme, extend: this.deepMerge(theme.extend ?? {}, properties) }

    if (themeName === this.defaultThemeName) {
      this.themesConfig!.defaultTheme = updatedTheme
    } else {
      const updatedThemes = this.themesConfig?.themes?.filter((t) => t.name !== themeName) ?? []
      updatedThemes.push(updatedTheme)
      this.themesConfig!.themes = updatedThemes
    }
  }

  /**
   * Removes a theme by name.
   */

  public removeTheme(themeName: DefaultThemeName): void {
    const themeIndex = this.themesConfig?.themes?.findIndex((t) => t.name === themeName)

    if (themeIndex === undefined || themeIndex < 0) {
      throw new Error(`Theme "${themeName}" does not exist.`)
    }

    this.themesConfig?.themes?.splice(themeIndex, 1)
  }

  /**
   * Adds utility classes for Tailwind CSS.
   */
  public addUtilities(utilities: Record<string, any>): void {
    this.themesConfig!.utilities = { ...this.themesConfig?.utilities, ...utilities }
  }

  /**
   * Retrieves all themes.
   */

  public getThemes(): MultiThemePluginOptions {
    return this.themesConfig
  }
}

const themeManager = new ThemeManager()
export { themeManager }
