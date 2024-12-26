import { ThemeManager } from "../theme";
import { ThemeConfig } from "../types";

describe("ThemeManager", () => {
  let themeManager:ThemeManager;

  const mockThemes = {
    "light-theme": {
      colors: {
        background: "white",
        foreground: "black",
      },
    },
    "dark-theme": {
      colors: {
        background: "black",
        foreground: "white",
      },
    },
  };

  beforeEach(() => {
    themeManager = new ThemeManager({
      themes: mockThemes,
      defaultTheme: "light-theme",
    });
  });

  test("should initialize with default and processed themes", () => {
    const themes = themeManager.get();
    const find = themes.themes?.some((t)=>t.name ==="light-theme")
    expect(find).toBe(false);
    expect(themes.themes).toHaveLength(1);
  });

  test("should add a new theme", () => {
    themeManager.add({
      name: "custom-theme",
      theme: {
        colors: {
          background: "gray",
          foreground: "blue",
        },
      },
    });
    const themes = themeManager.get();
    expect(themes.themes?.some((t) => t.name === "custom-theme")).toBe(true);
  });

  test("should throw error when adding a theme with duplicate name", () => {
    expect(() => {
      themeManager.add({
        name: "light-theme",
        theme: {
          colors: {
            background: "white",
          },
        },
      });
    }).toThrow("Theme \"light-theme\" already exists.");
  });

  test("should update an existing theme", () => {
    themeManager.update("dark-theme", {
      colors: {
        primary: "purple",
      },
    });
    const themes = themeManager.get();
    const updatedTheme  = themes.themes?.find((t) => t.name === "dark-theme") as ThemeConfig & {extend:{colors:{primary:string}}};
    expect(updatedTheme?.extend.colors?.primary).toBe("purple");
  });

  test("should throw error when updating a non-existent theme", () => {
    expect(() => {
      themeManager.update("non-existent-theme", {
        colors: {
          primary: "purple",
        },
      });
    }).toThrow("Theme \"non-existent-theme\" does not exist.");
  });

  test("should remove an existing theme", () => {
    themeManager.remove("dark-theme");
    const themes = themeManager.get();
    expect(themes.themes?.some((t) => t.name === "dark-theme")).toBe(false);
  });

  test("should throw error when removing a non-existent theme", () => {
    expect(() => {
      themeManager.remove("non-existent-theme");
    }).toThrow("Theme \"non-existent-theme\" does not exist.");
  });

  test("should retrieve theme selectors", () => {
    const selectors = themeManager.getThemeSelectors();
    expect(selectors["dark-theme"].selectors).toEqual(["[data-theme=\"dark-theme\"]"]);
  });
});

describe('ThemeManager edge cases', () => {
  test('should throw error if no themes are provided', () => {
    expect(() => new ThemeManager({ themes: {} })).toThrowError('No themes provided.');
  });

  test('should handle update for non-existent theme gracefully', () => {
    const manager = new ThemeManager({
      themes: { 'light-theme': { colors: { background: '#fff' } } },
      defaultTheme: 'light-theme',
    });
    expect(() => manager.update('non-existent-theme', { colors: { primary: '#000' } }))
      .toThrowError('Theme "non-existent-theme" does not exist.');
  });

  test('should remove non-existent theme gracefully', () => {
    const manager = new ThemeManager({
      themes: { 'light-theme': { colors: { background: '#fff' } } },
      defaultTheme: 'light-theme',
    });
    expect(() => manager.remove('non-existent-theme'))
      .toThrowError('Theme "non-existent-theme" does not exist.');
  });

  test('should handle empty utilities gracefully', () => {
    const manager = new ThemeManager({
      themes: { 'light-theme': { colors: { background: '#fff' } } },
      defaultTheme: 'light-theme',
      utilities: {},
    });
    expect(manager.getThemeSelectors()).toBeDefined(); // Ensure no crash
  });
});
