import { MeshReflectorMaterial } from '@react-three/drei'

export default function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[200, 100]}
        resolution={256}
        mixBlur={1}
        mixStrength={20}
        roughness={1}
        depthScale={1.0}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0A0005"
        metalness={0.5}
        mirror={0.4}
      />
    </mesh>
  )
}
