import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3000

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  attribute float aSize;
  attribute vec3 aVelocity;
  varying float vDist;
  varying float vSize;

  void main() {
    vec3 pos = position;
    float t = uTime * 0.3;

    // Gentle ambient drift
    pos.x += sin(t * aVelocity.x + position.z) * 0.3;
    pos.y += cos(t * aVelocity.y + position.x) * 0.3;
    pos.z += sin(t * aVelocity.z + position.y) * 0.2;

    // Mouse gravitational lens
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec2 worldXY = worldPos.xy;
    float dist = distance(worldXY, uMouse);
    float influence = smoothstep(3.0, 0.0, dist) * uMouseActive;
    vec2 dir = normalize(worldXY - uMouse + 0.001);
    worldPos.xy += dir * influence * 0.8;

    // Elastic return
    pos = (inverse(modelMatrix) * worldPos).xyz;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    vDist = dist;
    vSize = aSize;
  }
`

const fragmentShader = `
  uniform float uTime;
  varying float vDist;
  varying float vSize;

  void main() {
    vec2 uv = gl_PointCoord;
    float d = length(uv - 0.5);
    if (d > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.2, 0.5, d);
    // Cyan-gold tint
    vec3 color = mix(vec3(0.0, 0.94, 1.0), vec3(1.0, 0.75, 0.04), vSize);
    // Glow near mouse
    float glow = smoothstep(3.0, 0.0, vDist) * 0.5;
    color += vec3(0.0, 0.94, 1.0) * glow;

    gl_FragColor = vec4(color, alpha * 0.85);
  }
`

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef(new THREE.Vector2(999, 999))
  const mouseActiveRef = useRef(0)

  const { viewport } = useThree()

  const [positions, sizes, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const siz = new Float32Array(PARTICLE_COUNT)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      siz[i] = Math.random() * 2.0 + 0.5
      vel[i * 3] = Math.random() * 2 - 1
      vel[i * 3 + 1] = Math.random() * 2 - 1
      vel[i * 3 + 2] = Math.random() * 2 - 1
    }
    return [pos, siz, vel]
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseActive: { value: 0 },
  }), [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const mat = pointsRef.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uMouse.value.lerp(mouseRef.current, 0.08)
    mat.uniforms.uMouseActive.value += (mouseActiveRef.current - mat.uniforms.uMouseActive.value) * 0.05
  })

  const onPointerMove = useCallback((e: THREE.Event) => {
    const native = e as unknown as { point?: THREE.Vector3 }
    if (native.point) {
      mouseRef.current.set(native.point.x, native.point.y)
      mouseActiveRef.current = 1
    }
  }, [])

  const onPointerLeave = useCallback(() => {
    mouseActiveRef.current = 0
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
    return geo
  }, [positions, sizes, velocities])

  return (
    <>
      <mesh visible={false} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial />
      </mesh>
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

export default function ParticleShader({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 1, ...style }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
