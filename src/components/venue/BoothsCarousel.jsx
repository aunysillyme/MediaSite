import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import PlatformBooth from './PlatformBooth.jsx'
import { PLATFORMS } from '../../data/platforms.js'

const RADIUS = 10
const COUNT = PLATFORMS.length
const BOOTH_ANGLE = (Math.PI * 2) / COUNT

export default function BoothsCarousel() {
  const groupRef = useRef()
  const target = useRef(0)
  const current = useRef(0)
  const snapTimer = useRef(null)
  const lastTouch = useRef(null)

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      target.current += e.deltaY * 0.003
      clearTimeout(snapTimer.current)
      snapTimer.current = setTimeout(() => {
        target.current = Math.round(target.current / BOOTH_ANGLE) * BOOTH_ANGLE
      }, 700)
    }

    const onTouchStart = (e) => {
      lastTouch.current = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      if (lastTouch.current === null) return
      const delta = lastTouch.current - e.touches[0].clientY
      lastTouch.current = e.touches[0].clientY
      target.current += delta * 0.006
      clearTimeout(snapTimer.current)
      snapTimer.current = setTimeout(() => {
        target.current = Math.round(target.current / BOOTH_ANGLE) * BOOTH_ANGLE
      }, 700)
    }

    const onTouchEnd = () => { lastTouch.current = null }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      clearTimeout(snapTimer.current)
    }
  }, [])

  useFrame(() => {
    current.current += (target.current - current.current) * 0.07
    if (groupRef.current) groupRef.current.rotation.y = current.current
  })

  return (
    <group ref={groupRef}>
      {PLATFORMS.map((platform, i) => {
        const angle = (i / COUNT) * Math.PI * 2
        return (
          <PlatformBooth
            key={platform.id}
            platform={platform}
            orbitPosition={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
            orbitRotationY={angle}
          />
        )
      })}
    </group>
  )
}
