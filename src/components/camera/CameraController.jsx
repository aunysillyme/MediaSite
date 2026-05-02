import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useVenueStore } from '../../store.js'
import * as THREE from 'three'

const LOOK_AT = new THREE.Vector3(0, 1.5, 0)
const Z_CLOSED = 16
const Z_OPEN = 12

export default function CameraController() {
  const { camera } = useThree()
  const portalOpen = useVenueStore((s) => s.portalOpen)
  const portalOpenRef = useRef(false)
  portalOpenRef.current = portalOpen
  const camZ = useRef(Z_CLOSED)

  useFrame((_, delta) => {
    const targetZ = portalOpenRef.current ? Z_OPEN : Z_CLOSED
    camZ.current += (targetZ - camZ.current) * (1 - Math.pow(0.04, delta))
    camera.position.z = camZ.current
    camera.lookAt(LOOK_AT)
  })

  return null
}
