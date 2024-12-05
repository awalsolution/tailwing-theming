import { themes as defaultThemes } from "../semanticColors";

type Theme = {
  name: string;
  selectors?: string[];
  extend: {
    colors: Record<string, any>;
  };
};

interface ThemeManagerOptions {
  themes?: Theme[];
  defaultTheme?: string;
}

export class ThemeManager {
  public currentTheme: Theme;
  private themes: Map<string, Theme>;

  constructor({ themes = [], defaultTheme = "light" }: ThemeManagerOptions) {
    this.themes = new Map(
      [...defaultThemes, ...themes].map((theme) => [theme.name, theme])
    );

    const initialThemeName = defaultTheme;
    const initialTheme = this.themes.get(initialThemeName) || defaultThemes[0]; // Fallback to the first default theme
    this.currentTheme = initialTheme;
  }

  /**
   * Adds a new theme.
   * @param theme - The theme to add
   */

  public addTheme(theme: Theme): void {
    if (this.themes.has(theme.name)) {
      console.warn(`Theme "${theme.name}" already exists. It will be updated.`);
      this.updateTheme(theme.name, theme);
    } else {
      this.themes.set(theme.name, theme);
    }
  }

  /**
   * Removes an existing theme.
   * @param themeName - The name of the theme to remove
   */

  public removeTheme(themeName: string): void {
    if (!this.themes.has(themeName)) {
      console.warn(`Theme "${themeName}" does not exist.`);
      return;
    }

    this.themes.delete(themeName);
  }

  /**
   * Updates an existing theme.
   * @param themeName - The name of the theme to update
   * @param properties - The properties to update
   */

  public updateTheme(themeName: string, properties: Partial<Theme>): void {
    const theme = this.themes.get(themeName);
    if (!theme) {
      throw new Error(`Theme "${themeName}" does not exist.`);
    }

    const updatedTheme = { ...theme, ...properties };
    this.themes.set(themeName, updatedTheme);
  }

  /**
   * Gets all available themes.
   * @returns An array of themes
   */

  public getThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Gets the current theme.
   * @returns The current theme
   */

  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }
}

export default ThemeManager;
