import { useSyncExternalStore } from 'react'
import { LinkButton } from './LinkButton'

const POPULAR_PLAYERS = [
  { name: 'K3soju', link: '/player/VIT%20K3soju/000/NA' },
  { name: 'Setsuko', link: '/player/vit%20setsuko/na2/NA' },
  { name: 'Darth Nub', link: '/player/Darth%20Nub/NA2/NA' },
  { name: 'Robinsongz', link: '/player/CTG%20robinsongz/888/NA' },
  { name: 'Souless', link: '/player/CTG%20Souless/001/NA' },
]

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', onStoreChange)
      return () => mq.removeEventListener('change', onStoreChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )
}

export function PopularPlayersCarousel() {
  const reducedMotion = usePrefersReducedMotion()
  const loop = reducedMotion ? POPULAR_PLAYERS : [...POPULAR_PLAYERS, ...POPULAR_PLAYERS]

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="text-gray-600 text-sm font-medium uppercase tracking-wide">
        Popular players
      </span>
      <div className="popular-players-carousel relative mx-auto w-full max-w-[min(27rem,calc(100vw-2rem))] overflow-hidden px-2">
        <div
          className={
            reducedMotion
              ? 'flex flex-wrap justify-center gap-3 py-1'
              : 'popular-players-marquee-track flex w-max gap-3 py-1'
          }
        >
          {loop.map((player, i) => (
            <span key={`${player.link}-${i}`} className="shrink-0">
              <LinkButton name={player.name} link={player.link} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
