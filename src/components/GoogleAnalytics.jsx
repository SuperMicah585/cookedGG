import { useEffect, useRef } from 'react'
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
  const initialized = useRef(false)

  useEffect(() => {
    if (!MEASUREMENT_ID) return
    loadGtag()
  }, [])

  useEffect(() => {
    if (!MEASUREMENT_ID || !window.gtag) return
    const path = location.pathname + location.search
    const title = document.title

    if (!initialized.current) {
      // First run: initialize GA with the actual path so the first page_view isn’t always /
      window.gtag('config', MEASUREMENT_ID, { page_path: path, page_title: title })
      initialized.current = true
    } else {
      // Route change: send explicit page_view so GA sees unique pages
      sendPageView(path, title)
    }
  }, [location.pathname, location.search])

  return null
}
