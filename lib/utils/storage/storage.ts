const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

export default class Storage {
  private storage: globalThis.Storage
  private prefixKey?: string

  constructor(prefixKey = '', storage = localStorage) {
    this.storage = storage
    this.prefixKey = prefixKey
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  getAuthorization(key: string) {
    return `Bearer ${this.get(key)}`
  }

  isAuthenticated(key: string): boolean {
    return !!localStorage.getItem(key)
  }

  set<T>(key: string, value: T, expire: number | null = DEFAULT_CACHE_TIME): void {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    })
    this.storage.setItem(this.getKey(key), stringData)
  }

  get<T>(key: string, def: T = null as T): T {
    const item = this.storage.getItem(this.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value, expire } = data
        if (expire === null || expire >= Date.now()) {
          return value as T
        }
        this.remove(key)
      } catch (e) {
        return def
      }
    }
    return def
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  clear(): void {
    this.storage.clear()
  }
}
export const storage = new Storage('')
