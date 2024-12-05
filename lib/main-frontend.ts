import '@lib/index.css'
import { getCurrentTheme } from '@lib/theme/theme'
import { storage } from '@lib/utils/storage'

let currentTheme = getCurrentTheme().name

const initializeApp = () => {
  const root = document.documentElement

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light'
  const savedTheme = storage.get<string>('APP_THEME') || systemTheme
  currentTheme = savedTheme

  root.className = savedTheme
  root.setAttribute('data-theme', savedTheme)
  storage.set('APP_THEME', savedTheme)
}

const toggleTheme = () => {
  const root = document.documentElement
  currentTheme = currentTheme === 'dark-theme' ? 'light' : 'dark-theme'

  root.className = currentTheme
  root.setAttribute('data-theme', currentTheme)
  storage.set('APP_THEME', currentTheme)

  const button = document.querySelector<HTMLButtonElement>('#theme-toggle')
  if (button) {
    button.textContent = `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`
  }
}

const renderApp = () => {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return

  app.innerHTML = `
    <div class="min-h-screen flex gap-4 items-center justify-center bg-background text-foreground">
      <button id="theme-toggle" class="px-4 py-2 bg-primary text-white rounded">
        Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode
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

// Initialize the application and render it
initializeApp()
renderApp()
