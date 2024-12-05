export type Theme = {
  name: string
  selectors?: string[]
  extend: {
    colors: Record<string, any>
  }
}

export interface ThemeManagerOptions {
  themes?: Theme[]
  defaultTheme?: string
}
