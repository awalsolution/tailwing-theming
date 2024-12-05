declare type ThemeOptions = {
  [key: string]: string | { [key: string]: string }
}

declare interface ThemeConfig {
  name: string
  selectors?: string[]
  mediaQuery?: string
  extend: TailwindExtension
}
