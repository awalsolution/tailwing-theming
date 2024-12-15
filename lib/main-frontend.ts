import '@lib/index.css'
import { themeManager } from '@lib/theming'
import { storage } from '@lib/utils/storage'

let themeNames = themeManager.getAvailableThemes()
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
