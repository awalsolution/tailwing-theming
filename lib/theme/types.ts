export type Theme = {
  name: string
  selectors?: string[]
  extend: {
    colors: Record<string, any>
  }
}

export interface ThemeManagerOptions<T extends Theme['name'] = Theme['name']> {
  themes?: Theme[]
  defaultTheme: Extract<T, string>
}

export type CurrentTheme<T extends Theme['name'] = Theme['name']> = Extract<T, string>

export type DefaultThemeConfig = Omit<ThemeConfig, 'name' | 'selectors' | 'mediaQuery'>

export interface MultiThemePluginOptions {
  defaultTheme?: DefaultThemeConfig
  themes?: ThemeConfig[]
}
