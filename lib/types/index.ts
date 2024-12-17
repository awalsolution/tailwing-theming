import { TailwindExtension } from '../config'

export type DefaultThemeConfig = Omit<ThemeConfig, 'name' | 'selectors' | 'mediaQuery'>

export interface ThemeConfig {
  name: string
  selectors?: string[]
  mediaQuery?: string
  extend: TailwindExtension
}

export interface MultiThemePluginOptions {
  defaultTheme?: DefaultThemeConfig
  themes?: ThemeConfig[]
}

export interface AddThemeType {
  name: string
  theme: TailwindExtension
}

export interface Theme extends TailwindExtension {
  selectors?: string[]
}

export interface ThemeManagerType<T extends ThemeConfig['name'] = ThemeConfig['name']> {
  themes: Record<string, Theme>
  defaultTheme?: Extract<T, string>
}

export type DefaultThemeName<T extends ThemeConfig['name'] = ThemeConfig['name']> = Extract<T, string>
