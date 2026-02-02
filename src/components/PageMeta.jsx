import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ROUTE_META = {
  '/': {
    title: 'cookedGG – TFT MMR & Rank Tracker',
    description:
      'Check your TFT MMR and rank difference vs your lobby. See if you’re cooked – rank tracker for Teamfight Tactics.',
  },
  '/data': {
    title: 'TFT Data & Leaderboard | cookedGG',
    description:
      'TFT leaderboard distribution, rank data, and stats. Explore MMR and rank trends for Teamfight Tactics.',
  },
}

const DEFAULT_TITLE = 'cookedGG – TFT MMR & Rank Tracker'
const DEFAULT_DESCRIPTION =
  'Check your TFT MMR and rank difference vs your lobby. cookedGG – Teamfight Tactics rank tracker.'

function getMetaForPath(pathname) {
  const exact = ROUTE_META[pathname]
  if (exact) return exact
  if (pathname.startsWith('/player/')) {
    const parts = pathname.split('/').filter(Boolean)
    const player = parts[1] ?? 'Player'
    const tag = parts[2] ?? ''
    const region = parts[3] ?? ''
    const display = tag ? `${player}#${tag}` : player
    return {
      title: `${display} – cookedGG`,
      description: `TFT rank and MMR stats for ${display} (${region || 'region'}). See lobby rank difference and if you’re cooked.`,
    }
  }
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION }
}

function setMetaTag(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content ?? '')
}

export function PageMeta() {
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    const meta = getMetaForPath(pathname)
    document.title = meta.title ?? DEFAULT_TITLE
    setMetaTag('description', meta.description)
    setMetaTag('og:title', meta.title, true)
    setMetaTag('og:description', meta.description, true)
    setMetaTag('og:url', window.location.href, true)
    setMetaTag('og:site_name', 'cookedGG', true)
  }, [pathname])

  return null
}
