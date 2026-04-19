import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import NeonText from './NeonText.jsx'

const ORANGE = '#FF6B00'
const GOLD   = '#FFD700'

const W    = 9.2   // sign width
const H    = 2.8   // sign height
const TUBE = 0.11  // neon tube cross-section

// Billboard at [-11, 0, -13]; entrance camera at [0, 3, 15]
// Rotate Y so the front face points toward the entrance
const FACE_ANGLE = Math.atan2(0 - (-11), 15 - (-13)) // ≈ 0.373 rad

export default function NeonBillboard() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), r4 = useRef()

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const ei = Math.max(0.4,
      5.5
      + Math.sin(t * 47.3) * 1.2
      + Math.sin(t * 13.1) * 0.7
      + Math.sin(t *  3.3) * 0.3
      + (Math.random() < 0.015 ? -4.8 : 0)
    )
    if (r1.current) r1.current.emissiveIntensity = ei
    if (r2.current) r2.current.emissiveIntensity = ei
    if (r3.current) r3.current.emissiveIntensity = ei
    if (r4.current) r4.current.emissiveIntensity = ei
  })

  return (
    <group position={[-11, 0, -13]} rotation={[0, FACE_ANGLE, 0]}>

      {/* ── Poles ───────────────────────────────────────────── */}
      {[-2.6, 2.6].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {/* Shaft */}
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.2, 0.24, 9, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.08} />
          </mesh>
          {/* Base plate */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.12, 16]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.95} roughness={0.12} />
          </mesh>
        </group>
      ))}

      {/* ── Sign face ───────────────────────────────────────── */}
      <group position={[0, 9.0, 0]}>

        {/* Dark backing panel */}
        <mesh position={[0, 0, -0.07]}>
          <boxGeometry args={[W + 0.45, H + 0.45, 0.13]} />
          <meshStandardMaterial color="#04000e" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Neon frame — top */}
        <mesh position={[0, H / 2, 0.05]}>
          <boxGeometry args={[W, TUBE, TUBE]} />
          <meshStandardMaterial ref={r1} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        {/* Neon frame — bottom */}
        <mesh position={[0, -H / 2, 0.05]}>
          <boxGeometry args={[W, TUBE, TUBE]} />
          <meshStandardMaterial ref={r2} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        {/* Neon frame — left */}
        <mesh position={[-W / 2, 0, 0.05]}>
          <boxGeometry args={[TUBE, H, TUBE]} />
          <meshStandardMaterial ref={r3} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>
        {/* Neon frame — right */}
        <mesh position={[W / 2, 0, 0.05]}>
          <boxGeometry args={[TUBE, H, TUBE]} />
          <meshStandardMaterial ref={r4} color={ORANGE} emissive={ORANGE} emissiveIntensity={5.5} />
        </mesh>

        {/* Text — both centered, maxWidth keeps them inside the frame */}
        <NeonText
          color={ORANGE}
          fontSize={0.92}
          position={[0, 0.32, 0.14]}
          maxWidth={W - 0.6}
        >
          AunySillyMe
        </NeonText>
        <NeonText
          color={GOLD}
          fontSize={0.32}
          position={[0, -0.62, 0.14]}
          maxWidth={W - 0.6}
        >
          — MUSIC —
        </NeonText>

        {/* Sign glow */}
        <pointLight color={ORANGE} intensity={4} distance={16} position={[0, 0, 2]} />
      </group>
    </group>
  )
}
