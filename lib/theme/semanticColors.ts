import { readableColor } from 'color2k'
import { swapColorValues } from '../utils/theme/swapColorValues'
import { commonColors } from './commonColors'

const base: Record<string, ThemeOptions> = {
  light: {
    background: { DEFAULT: '#FFFFFF' },
    foreground: { ...commonColors.zinc, DEFAULT: '#11181C' },
    divider: { DEFAULT: 'rgba(17, 17, 17, 0.15)' },
    focus: { DEFAULT: commonColors.blue[500] },
    overlay: { DEFAULT: '#000000' },
  },
  dark: {
    background: { DEFAULT: '#000000' },
    foreground: { ...swapColorValues(commonColors.zinc), DEFAULT: '#ECEDEE' },
    focus: { DEFAULT: commonColors.blue[500] },
    overlay: { DEFAULT: '#000000' },
    divider: { DEFAULT: 'rgba(255, 255, 255, 0.15)' },
  },
}

const lightTheme: ThemeOptions = {
  ...base.light,
  primary: {
    ...commonColors.blue,
    DEFAULT: commonColors.blue[500],
    foreground: readableColor(commonColors.blue[500]),
  },
  secondary: {
    ...commonColors.purple,
    DEFAULT: commonColors.purple[500],
    foreground: readableColor(commonColors.purple[500]),
  },
  success: {
    ...commonColors.green,
    DEFAULT: commonColors.green[500],
    foreground: readableColor(commonColors.green[500]),
  },
  warning: {
    ...commonColors.yellow,
    DEFAULT: commonColors.yellow[500],
    foreground: readableColor(commonColors.yellow[500]),
  },
  danger: {
    ...commonColors.red,
    DEFAULT: commonColors.red[500],
    foreground: commonColors.white,
  },
}

const darkTheme: ThemeOptions = {
  ...base.dark,
  primary: {
    ...swapColorValues(commonColors.blue),
    DEFAULT: commonColors.blue[500],
    foreground: readableColor(commonColors.blue[500]),
  },
  secondary: {
    ...swapColorValues(commonColors.purple),
    DEFAULT: commonColors.purple[400],
    foreground: readableColor(commonColors.purple[400]),
  },
  success: {
    ...swapColorValues(commonColors.green),
    DEFAULT: commonColors.green[500],
    foreground: readableColor(commonColors.green[500]),
  },
  warning: {
    ...swapColorValues(commonColors.yellow),
    DEFAULT: commonColors.yellow[500],
    foreground: readableColor(commonColors.yellow[500]),
  },
  danger: {
    ...swapColorValues(commonColors.red),
    DEFAULT: commonColors.red[500],
    foreground: commonColors.white,
  },
}

export const themes: ThemeConfig[] = [
  {
    name: 'light',
    // selectors: [':root', '[data-theme="light"]'],
    extend: {
      colors: {
        ...lightTheme,
      },
    },
  },
  {
    name: 'dark-theme',
    selectors: ['.dark-theme', '[data-theme="dark"]'],
    extend: {
      colors: {
        ...darkTheme,
      },
    },
  },
]
