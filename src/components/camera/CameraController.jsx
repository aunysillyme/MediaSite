import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const LOOK_AT = new THREE.Vector3(0, 1.5, 0)

export default function CameraController() {
  const { camera } = useThree()
  useFrame(() => {
    camera.lookAt(LOOK_AT)
  })
  return null
}
