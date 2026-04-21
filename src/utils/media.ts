const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://numerator-bungee-batboy.ngrok-free.dev'

export const toAbsoluteMediaUrl = (url?: string | null) => {
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
