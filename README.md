<div align="left">
 <h1>Tailwind theming</h1>
  <p>The <b>TailwindCSS Multi-Theming Plugin</b> is a utility for creating and managing multiple themes in your TailwindCSS-based projects. With this library, you can define, add, update, and remove themes dynamically while keeping your configuration clean and extensible.</p>
  <div >
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178c6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>
<hr/>
</div>

## Features:

- **Dynamic Theme Management**:
  - Add, update, and remove themes programmatically.
- **Flexible Theme Configuration**:
  - Define themes using `extend` to seamlessly integrate with TailwindCSS.
- **Data Attributes Selectors**:
  - Apply themes via `data-theme` attributes.
- **Default Theme Support**:
  - Specify a default theme to be applied globally.
- **Customizable Media Queries**:
  - Apply themes based on user preferences, such as dark mode.

---

## Installation:

Install the package via your package manager:

```bash
yarn add @awal-solution/tailwind-theming
# or
npm install @awal-solution/tailwind-theming
```

---

## Getting Started:

### 1. Configure TailwindCSS Plugin

Add the `themePlugin` to your TailwindCSS configuration:

```javascript
// tailwind.config.js|ts
import { themePlugin } from '@awal-solution/tailwind-theming'

export default {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [themePlugin()],
}
```

### 2. Initialize Themes in Your Application

Create a `ThemeManager` instance and define your themes:

```typescript
import { ThemeManager } from '@awal-solution/tailwind-theming'

const themeManager = new ThemeManager({
  themes: {
    'light-theme': {
      colors: {
        background: { DEFAULT: '#FFFFFF' },
        foreground: { DEFAULT: '#000000' },
        primary: { DEFAULT: '#0000FF', light: '#0096FF' },
      },
    },
    'dark-theme': {
      colors: {
        background: { DEFAULT: '#000000' },
        foreground: { DEFAULT: '#FFFFFF' },
        primary: { DEFAULT: '#0000FF', light: '#0096FF' },
      },
    },
  },
  defaultTheme: 'light-theme',
})

export { themeManager }
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
import { themePlugin } from '@awal-solution/tailwind-theming'
import { themeManager } from './themeManager'

export default {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [themePlugin(themeManager.get())],
}
```

---

Example CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Example

An example setup for toggling themes in your app:

```typescript
import './index.css'
import { storage } from './storage'
import { themeManager } from './themeManager'

let themeNames = themeManager.getThemeSelectors()
let currentTheme = storage.get<string>('APP_THEME') ?? Object.keys(themeNames)[0]

const initializeApp = () => {
  const root = document.documentElement

  // Apply the saved theme or system theme as default
  root.className = currentTheme
  root.setAttribute('data-theme', currentTheme)
  storage.set('APP_THEME', currentTheme)
}

const toggleTheme = () => {
  const root = document.documentElement
  const themeKeys = Object.keys(themeNames)
  const currentIndex = themeKeys.findIndex((key) => key === currentTheme)

  // Determine the next theme
  const nextIndex = (currentIndex + 1) % themeKeys.length
  currentTheme = themeKeys[nextIndex]

  // Apply the new theme
  root.className = currentTheme
  root.setAttribute('data-theme', currentTheme)
  storage.set('APP_THEME', currentTheme)

  // Update button text to show the next theme
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle')
  if (button) {
    const nextTheme = themeNames[themeKeys[(nextIndex + 1) % themeKeys.length]].name
    button.textContent = `Switch to ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode`
  }
}

const renderApp = () => {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return

  app.innerHTML = `
    <div class="min-h-screen flex gap-4 items-center justify-center bg-background text-foreground">
      <button id="theme-toggle" class="px-4 py-2 bg-primary text-white rounded">
        Switch to ${Object.keys(themeNames)[0]} Mode
      </button>
      <h1 class="border-b border-divider">
        Hello, TailwindCSS Theme Toggling!
      </h1>
    </div>
  `

  // Attach event listener for the theme toggle button
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle')
  if (button) {
    button.addEventListener('click', toggleTheme)
  }
}

initializeApp()
renderApp()
```

---

## License

This library is open-source and licensed under the [MIT License](./LICENSE).

---

## Contributions

Contributions are welcome! If you find a bug or want to suggest a feature, please open an issue or submit a pull request.

## Commits

### Patch release

```bash

fix(theme): correct issue with theme manager

```

### Minor release

```bash

feat(utils): add utility functions for theming

```

### Major release

```bash

fix!: update API endpoints (BREAKING CHANGE: endpoint changes)

```

---

Happy coding! 🎉

---
