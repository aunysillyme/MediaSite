import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { useVenueStore } from '../../store.js'

export default function CameraController() {
  const { camera } = useThree()
  const openOverlay = useVenueStore((s) => s.openOverlay)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const isTransitioning = useVenueStore((s) => s.isTransitioning)
  const cameraPos = useVenueStore((s) => s.cameraPos)
  const cameraLook = useVenueStore((s) => s.cameraLook)
  const tweenRef = useRef(null)
  const lookTarget = useRef(new THREE.Vector3(...cameraLook))

  useEffect(() => {
    if (!isTransitioning) return

    const targetPos = { x: cameraPos[0], y: cameraPos[1], z: cameraPos[2] }
    const targetLook = new THREE.Vector3(...cameraLook)

    if (tweenRef.current) tweenRef.current.kill()

    tweenRef.current = gsap.to(camera.position, {
      ...targetPos,
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        lookTarget.current.lerp(targetLook, 0.05)
        camera.lookAt(lookTarget.current)
      },
      onComplete: () => {
        camera.lookAt(targetLook)
        lookTarget.current.copy(targetLook)
        if (activePlatform) {
          openOverlay()
        }
      },
    })

    return () => tweenRef.current?.kill()
  }, [isTransitioning, cameraPos, cameraLook])

  useFrame(() => {
    if (!isTransitioning) {
      camera.lookAt(lookTarget.current)
    }
  })

  return null
}
