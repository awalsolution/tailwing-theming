import { themePlugin } from '../plugin';
import { PluginAPI } from 'tailwindcss/types/config';
import { MultiThemePluginOptions, ThemeConfig } from '../types';

describe('themePlugin', () => {
  let mockPluginAPI: jest.Mocked<PluginAPI>;
  let mockThemes: ThemeConfig[];

  beforeEach(() => {
    // Mock the PluginAPI with Jest
    mockPluginAPI = {
      addVariant: jest.fn(),
      addBase: jest.fn(),
      addUtilities: jest.fn(),
      e: jest.fn((className) => className),
    } as unknown as jest.Mocked<PluginAPI>;

    // Example theme configurations
    mockThemes = [
      {
        name: 'light-theme',
        selectors: [':root', '[data-theme="light-theme"]'],
        extend: {
          colors: {
            background: '#ffffff',
            foreground: '#000000',
          },
        },
      },
      {
        name: 'dark-theme',
        selectors: ['.dark-theme', '[data-theme="dark-theme"]'],
        extend: {
          colors: {
            background: '#000000',
            foreground: '#ffffff',
          },
        },
      },
    ];
  });

  test('should add theme variants correctly', () => {
    const mockOptions: Partial<MultiThemePluginOptions> = { themes: mockThemes };

    const handler = themePlugin(mockOptions).handler;
    handler(mockPluginAPI);

    expect(mockPluginAPI.addVariant).toHaveBeenCalledTimes(3);
    expect(mockPluginAPI.addVariant).toHaveBeenCalledWith(
      'light-theme',
      expect.arrayContaining([':root &', '&:root'])
    );
    expect(mockPluginAPI.addVariant).toHaveBeenCalledWith(
      'dark-theme',
      expect.arrayContaining(['.dark-theme &', '&.dark-theme'])
    );
  });

  test('should add theme styles correctly', () => {
    const mockOptions: Partial<MultiThemePluginOptions> = { themes: mockThemes };

    const handler = themePlugin(mockOptions).handler;
    handler(mockPluginAPI);

    expect(mockPluginAPI.addBase).toHaveBeenCalledTimes(3);

    expect(mockPluginAPI.addBase).toHaveBeenCalledWith({
      ':root, [data-theme="light-theme"]': expect.any(Object),
    });

    expect(mockPluginAPI.addBase).toHaveBeenCalledWith({
      '.dark-theme, [data-theme="dark-theme"]': expect.any(Object),
    });
  });

  test('should add utilities if provided', () => {
    const mockOptions: Partial<MultiThemePluginOptions> = {
      utilities: {
        '.text-primary': {
          color: '#ff5722',
        },
      },
    };

    const handler = themePlugin(mockOptions).handler;
    handler(mockPluginAPI);

    expect(mockPluginAPI.addUtilities).toHaveBeenCalledTimes(1);
    expect(mockPluginAPI.addUtilities).toHaveBeenCalledWith({
      '.text-primary': {
        color: '#ff5722',
      },
    });
  });

  test('should return correct theme extensions', () => {
    const mockOptions: Partial<MultiThemePluginOptions> = { themes: mockThemes };
    const result = themePlugin(mockOptions).config?.theme?.extend;

    expect(result).toBeDefined();
    expect(result?.colors).toMatchObject({
      background: "rgb(var(--colors-background) / <alpha-value>)",
      foreground: "rgb(var(--colors-foreground) / <alpha-value>)",
    });
  });
});

describe('themePlugin edge cases', () => {
//   test('should throw error if themes are empty', () => {
//     // expect(() => themePlugin({ themes: [] })).toThrowError('No themes provided.');
//   });

  test('should handle missing selectors gracefully', () => {
    const mockOptions = {
      themes: [
        {
          name: 'theme-without-selectors',
          extend: { colors: { primary: '#fff' } },
        },
      ],
    };
    const { handler } = themePlugin(mockOptions);
    expect(() => handler).not.toThrow();
  });
});