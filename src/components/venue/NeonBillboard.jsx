import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import NeonText from './NeonText.jsx'

const ORANGE = '#FF6B00'
const PURPLE = '#7B00FF'

const W = 8.0
const H = 2.6
const TUBE = 0.07
const INSET = 0.42

export default function NeonBillboard() {
  const oTop = useRef(), oBot = useRef(), oLeft = useRef(), oRight = useRef()
  const iTop = useRef(), iBot = useRef(), iLeft = useRef(), iRight = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    const outerBuzz = 5.5
      + Math.sin(t * 47.3) * 1.2
      + Math.sin(t * 13.1) * 0.8
      + Math.sin(t * 2.7)  * 0.3
      + (Math.random() < 0.012 ? -4.5 : 0)
    const oi = Math.max(0.3, outerBuzz)

    const innerBuzz = 5.8
      + Math.sin(t * 61.7) * 1.4
      + Math.sin(t * 19.3) * 0.9
      + Math.sin(t * 4.1)  * 0.4
      + (Math.random() < 0.018 ? -5.2 : 0)
    const ii = Math.max(0.3, innerBuzz)

    if (oTop.current)   oTop.current.emissiveIntensity   = oi
    if (oBot.current)   oBot.current.emissiveIntensity   = oi * 0.92
    if (oLeft.current)  oLeft.current.emissiveIntensity  = oi * 0.86
    if (oRight.current) oRight.current.emissiveIntensity = oi * 0.94

    if (iTop.current)   iTop.current.emissiveIntensity   = ii
    if (iBot.current)   iBot.current.emissiveIntensity   = ii * 0.88
    if (iLeft.current)  iLeft.current.emissiveIntensity  = ii * 0.82
    if (iRight.current) iRight.current.emissiveIntensity = ii * 0.96
  })

  return (
    <group position={[-11, 0, -13]} rotation={[0, -0.3, 0]}>

      {/* Left pole */}
      <mesh position={[-3.2, 4.3, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 8.6, 12]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Right pole */}
      <mesh position={[3.2, 4.3, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 8.6, 12]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Sign at top of poles */}
      <group position={[0, 8.6, 0]}>

        {/* Dark backing panel */}
        <mesh position={[0, 0, -0.09]}>
          <boxGeometry args={[W + 0.5, H + 0.5, 0.14]} />
          <meshStandardMaterial color="#040010" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Outer frame — orange */}
        <mesh position={[0, H / 2, 0.04]}>
          <boxGeometry args={[W, TUBE, TUBE]} />
          <meshStandardMaterial ref={oTop} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[0, -H / 2, 0.04]}>
          <boxGeometry args={[W, TUBE, TUBE]} />
          <meshStandardMaterial ref={oBot} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[-W / 2, 0, 0.04]}>
          <boxGeometry args={[TUBE, H, TUBE]} />
          <meshStandardMaterial ref={oLeft} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[W / 2, 0, 0.04]}>
          <boxGeometry args={[TUBE, H, TUBE]} />
          <meshStandardMaterial ref={oRight} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>

        {/* Inner frame — purple */}
        <mesh position={[0, H / 2 - INSET, 0.13]}>
          <boxGeometry args={[W - INSET * 2, TUBE, TUBE]} />
          <meshStandardMaterial ref={iTop} color={PURPLE} emissive={PURPLE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[0, -(H / 2 - INSET), 0.13]}>
          <boxGeometry args={[W - INSET * 2, TUBE, TUBE]} />
          <meshStandardMaterial ref={iBot} color={PURPLE} emissive={PURPLE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[-(W / 2 - INSET), 0, 0.13]}>
          <boxGeometry args={[TUBE, H - INSET * 2, TUBE]} />
          <meshStandardMaterial ref={iLeft} color={PURPLE} emissive={PURPLE} emissiveIntensity={5.5} />
        </mesh>
        <mesh position={[W / 2 - INSET, 0, 0.13]}>
          <boxGeometry args={[TUBE, H - INSET * 2, TUBE]} />
          <meshStandardMaterial ref={iRight} color={PURPLE} emissive={PURPLE} emissiveIntensity={5.5} />
        </mesh>

        <NeonText color={ORANGE} fontSize={0.95} position={[0, 0.28, 0.2]}>
          AunySillyMe
        </NeonText>
        <NeonText color="#FFD700" fontSize={0.3} position={[0, -0.62, 0.2]}>
          — MUSIC —
        </NeonText>

        <pointLight color={ORANGE} intensity={3} distance={14} position={[0, 0, 2]} />
        <pointLight color={PURPLE} intensity={1.5} distance={10} position={[0, 0, 3]} />
      </group>
    </group>
  )
}
