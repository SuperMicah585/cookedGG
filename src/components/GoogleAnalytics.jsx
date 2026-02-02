import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

function loadGtag() {
  if (typeof window === 'undefined' || !MEASUREMENT_ID) return
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())

  window.gtag('config', MEASUREMENT_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

function sendPageView(path, title) {
  if (typeof window === 'undefined' || !MEASUREMENT_ID || !window.gtag) return
  const fullUrl = window.location.origin + path
  window.gtag('event', 'page_view', {
    page_location: fullUrl,
    page_path: path,
    page_title: title ?? document.title,
  })
}

export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!MEASUREMENT_ID) return
    loadGtag()
  }, [])

  useEffect(() => {
    if (!MEASUREMENT_ID) return
    const path = location.pathname + location.search
    sendPageView(path, document.title)
  }, [location.pathname, location.search])

  return null
}
