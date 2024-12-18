<div align="left">
 <h1>tailwind-theming</h1>
  <p>The <b>TailwindCSS Multi-Theming Plugin</b> is a utility for creating and managing multiple themes in your TailwindCSS-based projects. With this library, you can define, add, update, and remove themes dynamically while keeping your configuration clean and extensible.</p>
  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178c6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

<hr/>
</div>

````markdown
# TailwindCSS Multi-Theming Plugin

The **TailwindCSS Multi-Theming Plugin** is a utility for creating and managing multiple themes in your TailwindCSS-based projects. With this library, you can define, add, update, and remove themes dynamically while keeping your configuration clean and extensible.

---

## Features

- **Dynamic Theme Management**:
  - Add, update, and remove themes programmatically.
- **Flexible Theme Configuration**:
  - Define themes using `extend` to seamlessly integrate with TailwindCSS.
- **Data Attributes and Class Selectors**:
  - Apply themes via `data-theme` attributes or class selectors.
- **Default Theme Support**:
  - Specify a default theme to be applied globally.
- **Customizable Media Queries**:
  - Apply themes based on user preferences, such as dark mode.

---

## Installation

Install the package via your package manager:

```bash
yarn add tailwindcss-multi-theme
# or
npm install tailwindcss-multi-theme
```
````

---

## Getting Started

### 1. Configure TailwindCSS Plugin

Add the `themePlugin` to your TailwindCSS configuration:

```javascript
// tailwind.config.js
import { themePlugin } from 'tailwindcss-multi-theme'

export default {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [themePlugin()],
}
```

### 2. Initialize Themes in Your Application

Create a `ThemeManager` instance and define your themes:

```typescript
import { ThemeManager } from 'tailwindcss-multi-theme'

const themeManager = new ThemeManager({
  themes: {
    'light-theme': {
      colors: {
        background: { DEFAULT: '#FFFFFF' },
        foreground: { DEFAULT: '#000000' },
      },
    },
    'dark-theme': {
      colors: {
        background: { DEFAULT: '#000000' },
        foreground: { DEFAULT: '#FFFFFF' },
      },
    },
  },
  defaultTheme: 'light-theme',
})

// Log available themes
console.log(themeManager.getThemeSelectors())
```

### 3. Apply Themes

Use the generated selectors to toggle themes in your application:

```typescript
// Apply the default theme
document.documentElement.setAttribute('data-theme', 'light-theme')

// Toggle between themes
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme'
  document.documentElement.setAttribute('data-theme', newTheme)
}
```

---

## API Reference

### **ThemeManager**

#### Constructor

```typescript
constructor({ themes: Record<string, Theme>, defaultTheme?: string });
```

- `themes`: A record of theme names and their configurations.
- `defaultTheme`: (Optional) The default theme to apply initially.

#### Methods

##### **`get()`**

Returns all themes, including the default theme and additional themes.

```typescript
themeManager.get()
```

##### **`getThemeSelectors()`**

Returns an object containing theme names and their associated selectors.

```typescript
themeManager.getThemeSelectors()
```

##### **`add(theme: AddThemeType)`**

Adds a new theme to the existing themes.

```typescript
themeManager.add({
  name: 'custom-theme',
  selectors: ['[data-theme="custom-theme"]'],
  theme: {
    colors: {
      background: { DEFAULT: '#555' },
    },
  },
})
```

##### **`update(themeName: string, properties: Partial<TailwindExtension>)`**

Updates an existing theme's configuration.

```typescript
themeManager.update('custom-theme', {
  colors: {
    primary: { DEFAULT: '#FF0000' },
  },
})
```

##### **`remove(themeName: string)`**

Removes an existing theme by name.

```typescript
themeManager.remove('custom-theme')
```

---

## Plugin Options

The `themePlugin` provides the following options:

- **`defaultTheme`**: (Optional) Default theme configuration.
- **`themes`**: An array of theme configurations.

Example usage in TailwindCSS:

```javascript
import { themePlugin } from 'tailwindcss-multi-theme'

export default {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [
    themePlugin({
      defaultTheme: {
        colors: {
          background: { DEFAULT: '#FFFFFF' },
          foreground: { DEFAULT: '#000000' },
        },
      },
      themes: [
        {
          name: 'dark-theme',
          selectors: ['[data-theme="dark-theme"]'],
          extend: {
            colors: {
              background: { DEFAULT: '#000000' },
              foreground: { DEFAULT: '#FFFFFF' },
            },
          },
        },
      ],
    }),
  ],
}
```

---

## Example

An example setup for toggling themes in your app:

```typescript
import { themeManager } from './themeManager'

const initializeApp = () => {
  const root = document.documentElement
  const defaultTheme = themeManager.get().defaultTheme?.name || 'light-theme'

  root.setAttribute('data-theme', defaultTheme)
}

const toggleTheme = () => {
  const root = document.documentElement
  const currentTheme = root.getAttribute('data-theme')
  const nextTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme'
  root.setAttribute('data-theme', nextTheme)
}

initializeApp()
document.querySelector('#theme-toggle').addEventListener('click', toggleTheme)
```

---

## License

This project is licensed under the MIT License.

---

## Contributions

Contributions are welcome! If you find a bug or want to suggest a feature, please open an issue or submit a pull request.

---

Happy coding! 🎉

```

```
