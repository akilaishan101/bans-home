export function registerPwaAutoUpdate() {
  if (!('serviceWorker' in navigator) || window.location.protocol !== 'https:') return

  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    const workerUrl = `${base}sw.js`
    void navigator.serviceWorker.register(workerUrl, { scope: base })
      .then((registration) => {
        void registration.update()
        window.setInterval(() => void registration.update(), 60 * 60 * 1000)
      })
      .catch((error: unknown) => {
        console.warn('BANS Home could not check for an app update.', error)
      })
  })
}
