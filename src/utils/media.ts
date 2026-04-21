const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const toAbsoluteMediaUrl = (url?: string | null) => {
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
