const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://census-email-societies-responded.trycloudflare.com'

export const toAbsoluteMediaUrl = (url?: string | null) => {
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
