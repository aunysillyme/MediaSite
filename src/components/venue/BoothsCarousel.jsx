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
  const lastMouse = useRef(null)

  const resetSnap = () => {
    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      target.current = Math.round(target.current / BOOTH_ANGLE) * BOOTH_ANGLE
    }, 700)
  }

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      target.current -= delta * 0.003
      resetSnap()
    }

    const onTouchStart = (e) => {
      lastTouch.current = e.touches[0].clientX
    }
    const onTouchMove = (e) => {
      if (lastTouch.current === null) return
      const delta = lastTouch.current - e.touches[0].clientX
      lastTouch.current = e.touches[0].clientX
      target.current -= delta * 0.006
      resetSnap()
    }
    const onTouchEnd = () => { lastTouch.current = null }

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      lastMouse.current = e.clientX
      document.body.style.cursor = 'grabbing'
    }
    const onMouseMove = (e) => {
      if (lastMouse.current === null) return
      const delta = lastMouse.current - e.clientX
      lastMouse.current = e.clientX
      target.current -= delta * 0.005
      resetSnap()
    }
    const onMouseUp = () => {
      lastMouse.current = null
      document.body.style.cursor = 'default'
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
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
