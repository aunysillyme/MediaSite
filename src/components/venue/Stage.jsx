import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import NeonText from './NeonText.jsx'

function PulsingBar({ position, color, delay = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.scale.y = 0.5 + Math.abs(Math.sin(t * 3 + delay)) * 2.5
    ref.current.position.y = ref.current.scale.y * 0.1
  })
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.15, 0.2, 0.15]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
    </mesh>
  )
}

export default function Stage() {
  const barColors = ['#FF6B00', '#7B00FF', '#FFD700', '#FF6B00', '#7B00FF',
                     '#FFD700', '#FF6B00', '#7B00FF', '#FFD700', '#FF6B00',
                     '#7B00FF', '#FFD700', '#FF6B00', '#7B00FF', '#FFD700',
                     '#FF6B00', '#7B00FF', '#FFD700', '#FF6B00', '#7B00FF']

  return (
    <group position={[0, 0, -5]}>
      {/* Stage platform */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[12, 0.5, 6]} />
        <meshStandardMaterial color="#0D0010" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stage edge neon strip */}
      <mesh position={[0, 0.52, 3]}>
        <boxGeometry args={[12.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.52, -3]}>
        <boxGeometry args={[12.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <mesh position={[-6.1, 0.52, 0]}>
        <boxGeometry args={[0.05, 0.05, 6]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <mesh position={[6.1, 0.52, 0]}>
        <boxGeometry args={[0.05, 0.05, 6]} />
        <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={6} toneMapped={false} />
      </mesh>

      {/* Artist name neon sign */}
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
        <NeonText
          color="#FF6B00"
          fontSize={1.8}
          position={[0, 5.5, -2.5]}
        >
          AunySillyMe
        </NeonText>
        <NeonText
          color="#7B00FF"
          fontSize={0.55}
          position={[0, 4.2, -2.5]}
        >
          — THE VENUE —
        </NeonText>
      </Float>

      {/* Back wall */}
      <mesh position={[0, 4, -3.1]}>
        <boxGeometry args={[12, 8, 0.15]} />
        <meshStandardMaterial color="#050005" roughness={1} />
      </mesh>

      {/* Audio visualizer bars across front of stage */}
      {barColors.map((color, i) => (
        <PulsingBar
          key={i}
          position={[-4.75 + i * 0.5, 0.6, 2.5]}
          color={color}
          delay={i * 0.25}
        />
      ))}

      {/* Pillars left and right */}
      {[-6, 6].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 4, -3]}>
            <boxGeometry args={[0.4, 8, 0.4]} />
            <meshStandardMaterial color="#0D0010" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Pillar neon strip */}
          <mesh position={[x > 0 ? -0.21 : 0.21, 4, -3]}>
            <boxGeometry args={[0.02, 8, 0.02]} />
            <meshStandardMaterial
              color={x > 0 ? '#7B00FF' : '#FF6B00'}
              emissive={x > 0 ? '#7B00FF' : '#FF6B00'}
              emissiveIntensity={5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Stage lights */}
      <pointLight position={[0, 3, 0]} color="#FF6B00" intensity={3} distance={15} />
      <pointLight position={[-4, 2, 1]} color="#7B00FF" intensity={2} distance={10} />
      <pointLight position={[4, 2, 1]} color="#FFD700" intensity={2} distance={10} />
    </group>
  )
}
