import { themeManager } from "../theme";
import { ThemeConfig } from "../types";

describe("ThemeManager Singleton", () => {
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
    themeManager.init({
      themes: mockThemes,
      defaultTheme: "light-theme",
    });
  });

  test("should initialize with default and processed themes", () => {
    const themes = themeManager.getThemes();
    expect(themes.defaultTheme?.name).toBe("light-theme");
    expect(themes.themes?.some((t) => t.name === "light-theme")).toBe(false);
    expect(themes.themes).toHaveLength(1);
  });

  test("should add a new theme", () => {
    themeManager.addTheme({
      name: "custom-theme",
      theme: {
        colors: {
          background: "gray",
          foreground: "blue",
        },
      },
    });
    const themes = themeManager.getThemes();
    expect(themes.themes?.some((t) => t.name === "custom-theme")).toBe(true);
  });

  test("should throw error when adding a theme with duplicate name", () => {
    expect(() => {
      themeManager.addTheme({
        name: "light-theme",
        theme: {
          colors: {
            background: "white",
          },
        },
      });
    }).toThrow('Theme "light-theme" already exists.');
  });

  test("should update an existing theme", () => {
    themeManager.updateTheme("dark-theme", {
      colors: {
        primary: "purple",
      },
    });
    const themes = themeManager.getThemes();
    const updatedTheme = themes.themes?.find((t) => t.name === "dark-theme") as ThemeConfig & {
      extend: { colors: { primary: string } };
    };
    expect(updatedTheme?.extend.colors?.primary).toBe("purple");
  });

  test("should throw error when updating a non-existent theme", () => {
    expect(() => {
      themeManager.updateTheme("non-existent-theme", {
        colors: {
          primary: "purple",
        },
      });
    }).toThrow('Theme "non-existent-theme" does not exists.');
  });

  test("should remove an existing theme", () => {
    themeManager.removeTheme("dark-theme");
    const themes = themeManager.getThemes();
    expect(themes.themes?.some((t) => t.name === "dark-theme")).toBe(false);
  });

  test("should throw error when removing a non-existent theme", () => {
    expect(() => {
      themeManager.removeTheme("non-existent-theme");
    }).toThrow('Theme "non-existent-theme" does not exist.');
  });

  // test("should retrieve theme selectors", () => {
  //   const selectors = themeManager.getThemeSelectors();
  //   expect(selectors["dark-theme"].selectors).toEqual(['[data-theme="dark-theme"]']);
  // });

  test("should update the default theme to an existing theme", () => {
    themeManager.setDefaultTheme("dark-theme");
    const themes = themeManager.getThemes();
    expect(themes.defaultTheme?.name).toBe("dark-theme");
    expect(themes.themes?.some((theme) => theme.name === "light-theme")).toBe(true);
  });

  // test("should throw an error for a non-existent theme", () => {
  //   expect(() => themeManager.defaultTheme("non-existent-theme")).toThrow(
  //     'Theme "non-existent-theme" does not exists.'
  //   );
  // });

  test("should not change anything if the theme is already default", () => {
    themeManager.setDefaultTheme("light-theme");
    const themes = themeManager.getThemes();
    expect(themes.defaultTheme?.name).toBe("light-theme");
    expect(themes.themes?.length).toBe(1);
  });

  test("should deep merge nested objects correctly", () => {
    const result = themeManager["deepMerge"](
      { colors: { primary: { DEFAULT: "blue", 100: "lightblue", 200: 'purple' } } },
      { colors: { primary: { 200: "darkblue", DEFAULT: "navy", 100: "lightblue", } } }
    );
    expect(result).toEqual({
      colors: { primary: { DEFAULT: "navy", 100: "lightblue", 200: "darkblue" } },
    });
  });

  test("should handle empty utilities gracefully", () => {
    themeManager.addUtilities({});
    expect(themeManager.getThemes().utilities).toEqual({});
  });
});

describe("ThemeManager Edge Cases", () => {
  test("should throw error if no themes are provided", () => {
    expect(() => themeManager.init({ themes: {} })).toThrowError("No themes provided.");
  });

  test("should handle update for non-existent theme gracefully", () => {
    expect(() =>
      themeManager.updateTheme("non-existent-theme", { colors: { primary: "#000" } })
    ).toThrowError('Theme "non-existent-theme" does not exists.');
  });

  test("should throw an error if themes object contains invalid keys", () => {
    expect(() =>
      themeManager.init({
        themes: { invalidKey: { colors: { background: "white" } } },
      })
    ).toThrow("Object keys must contain theme suffix example: \"invalidKey-theme\" or \"invalidKeyTheme\"");
  });

  test("should set the first theme as default if defaultTheme is not provided", () => {
    themeManager.init({
      themes: {
        "custom-theme": { colors: { background: "blue" } },
      },
    });
    expect(themeManager.getThemes().defaultTheme?.name).toBe("custom-theme");
  });
});
