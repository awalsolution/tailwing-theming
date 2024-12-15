import plugin from 'tailwindcss/plugin'
import { PluginAPI } from 'tailwindcss/types/config'
import { defaultThemeName, getThemesFromOptions } from '../../utils/options'
import { resolveThemeExtensionAsCustomProps, resolveThemeExtensionsAsTailwindExtension } from '../../utils/theme/themeUtils'
import { MultiThemePluginOptions, ThemeConfig } from '../types'

/**
 * @param themes the themes to add as variants
 * @param helpers the tailwind plugin helpers
 */

const addThemeVariants = (themes: ThemeConfig[], { addVariant, e }: PluginAPI) => {
  for (const { name, selectors: _selectors, mediaQuery } of themes) {
    const variantName = name === defaultThemeName ? 'defaultTheme' : name
    const shouldAddNameBasedVariant = !_selectors && !mediaQuery
    const selectors = _selectors ?? (shouldAddNameBasedVariant ? [`.${e(variantName)}`] : [])

    if (selectors.length > 0) {
      addVariant(
        variantName,
        selectors.flatMap((x) => [`${x} &`, `&${x}`]),
      )
    }

    if (mediaQuery) {
      addVariant(variantName, mediaQuery)
    }
  }
}

/**
 * @param themes the themes to add as variants
 * @param api the tailwind plugin helpers
 */

const addThemeStyles = (themes: ThemeConfig[], api: PluginAPI): void => {
  const { addBase, e } = api
  for (const { name, selectors: _selectors, extend, mediaQuery } of themes) {
    const selectors = _selectors ?? (name === defaultThemeName ? [':root'] : mediaQuery ? [] : [`.${e(name)}`])
    if (selectors.length > 0) {
      addBase({
        [selectors.join(', ')]: resolveThemeExtensionAsCustomProps(extend, api),
      })
    }
    if (mediaQuery) {
      addBase({
        [mediaQuery]: {
          ':root': resolveThemeExtensionAsCustomProps(extend, api),
        },
      })
    }
  }
}

const themePlugin = plugin.withOptions<Partial<MultiThemePluginOptions>>(
  (options) => (api) => {
    const themes = getThemesFromOptions(options)
    addThemeVariants(themes, api)
    addThemeStyles(themes, api)
  },
  (options) => {
    console.log('Plugin Themes ==>', options)
    const extension = resolveThemeExtensionsAsTailwindExtension(getThemesFromOptions(options))
    return {
      theme: {
        extend: extension,
      },
    }
  },
)

export { themePlugin }
