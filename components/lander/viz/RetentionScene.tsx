"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Phase = "enter" | "purchase" | "exit" | "campaign" | "return" | "repurchase" | "leave" | "wait"

type Customer = {
  id: number
  phase: Phase
  progress: number
  speed: number
  returns: boolean
  route: number
}

const BLUE = "#2563EB"
const BOOST = "#FF554D"
const TOKEN_COUNT = 15

function curve(points: [number, number, number][]) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.42,
  )
}

const ENTRY_CURVES = [
  curve([[-7.2, 2.35, -0.08], [-5.25, 2.25, -0.05], [-3.55, 1.9, 0], [-2.1, 1.48, 0.02], [-1.72, 1.38, 0.04]]),
  curve([[-7.2, 1.25, 0.02], [-5.2, 1.24, 0.03], [-3.55, 1.24, 0.03], [-2.15, 1.25, 0.04], [-1.72, 1.25, 0.05]]),
  curve([[-7.2, 0.1, -0.04], [-5.3, 0.2, -0.02], [-3.7, 0.52, 0], [-2.2, 0.95, 0.02], [-1.72, 1.08, 0.04]]),
]

const EXIT_CURVES = [
  curve([[1.72, 1.38, 0.04], [2.55, 1.64, 0.02], [3.7, 2.05, 0], [5.2, 2.28, -0.03], [7.25, 2.4, -0.08]]),
  curve([[1.72, 1.25, 0.05], [2.7, 1.26, 0.04], [3.9, 1.25, 0.02], [5.3, 1.25, 0], [7.25, 1.25, -0.05]]),
  curve([[1.72, 1.08, 0.04], [2.6, 0.86, 0.02], [3.8, 0.44, 0], [5.25, 0.18, -0.03], [7.25, 0.06, -0.08]]),
]

const RETURN_CURVES = [
  curve([[5.2, 2.28, 0.02], [4.75, 3.35, 0.12], [3.1, 3.75, 0.18], [1.35, 2.85, 0.2], [0.35, 1.95, 0.18], [0, 1.3, 0.14]]),
  curve([[5.3, 1.25, 0.02], [4.65, 0.1, 0.12], [3.1, -0.42, 0.18], [1.45, -0.05, 0.2], [0.4, 0.58, 0.18], [0, 1.2, 0.14]]),
  curve([[5.25, 0.18, 0.02], [5.35, 1.65, 0.12], [4.2, 3.05, 0.18], [2.35, 3.22, 0.2], [0.72, 2.05, 0.18], [0, 1.25, 0.14]]),
]

const CAMPAIGN_CURVES = [
  curve([[0.7, 1.7, 0.28], [2.05, 2.45, 0.3], [3.6, 2.62, 0.27], [5.2, 2.28, 0.18]]),
  curve([[0.8, 1.25, 0.28], [2.1, 1.46, 0.3], [3.65, 1.42, 0.27], [5.3, 1.25, 0.18]]),
  curve([[0.7, 0.82, 0.28], [2.05, 0.08, 0.3], [3.55, -0.15, 0.27], [5.25, 0.18, 0.18]]),
]

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function FlowPath({ path, color, radius, opacity }: { path: THREE.CatmullRomCurve3; color: string; radius: number; opacity: number }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[path, 88, radius * 3.2, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[path, 88, radius, 8, false]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.26} metalness={0.08} depthWrite={false} />
      </mesh>
    </group>
  )
}

function TravellingLight({ path, delay, speed, color = BOOST }: { path: THREE.CatmullRomCurve3; delay: number; speed: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const point = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    if (!ref.current) return
    const progress = (state.clock.elapsedTime * speed + delay) % 1
    path.getPointAt(progress, point)
    ref.current.position.copy(point)
    ref.current.scale.setScalar(0.68 + Math.sin(progress * Math.PI) * 0.4)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.062, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function Customers({ onWinBack }: { onWinBack: (amount: number) => void }) {
  const customers = useRef<Customer[]>(
    Array.from({ length: TOKEN_COUNT }, (_, id) => ({
      id,
      phase: "enter" as Phase,
      progress: -id * 0.34 - (id % 3) * 0.11,
      speed: 0.36 + (id % 4) * 0.025,
      returns: id % 4 !== 1,
      route: id % 3,
    })),
  )

  const tokenMesh = useRef<THREE.InstancedMesh>(null)
  const pulseMesh = useRef<THREE.InstancedMesh>(null)
  const rippleMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => new THREE.Vector3(), [])
  const tokenColor = useMemo(() => new THREE.Color(), [])
  const rippleColor = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    if (!tokenMesh.current || !pulseMesh.current || !rippleMesh.current) return

    customers.current.forEach((customer, index) => {
      const entryPath = ENTRY_CURVES[customer.route]!
      const exitPath = EXIT_CURVES[customer.route]!
      const returnPath = RETURN_CURVES[customer.route]!
      const campaignPath = CAMPAIGN_CURVES[customer.route]!
      customer.progress += Math.min(delta, 0.05) * customer.speed
      let visible = customer.progress >= 0
      let scale = 1
      let returning = false
      let campaignProgress = -1
      let rippleProgress = -1

      if (customer.phase === "enter") {
        entryPath.getPointAt(clamp(customer.progress), point)
        if (customer.progress >= 1) {
          customer.phase = "purchase"
          customer.progress = 0
        }
      } else if (customer.phase === "purchase") {
        point.set(-0.35, 1.25, 0.24)
        scale = 0.75 + Math.sin(customer.progress * Math.PI * 5) * 0.13
        if (customer.progress >= 0.18) {
          customer.phase = "exit"
          customer.progress = 0
        }
      } else if (customer.phase === "exit") {
        exitPath.getPointAt(clamp(customer.progress), point)
        if (customer.progress >= 0.73 && customer.returns) {
          customer.phase = "campaign"
          customer.progress = 0
        } else if (customer.progress >= 1) {
          customer.phase = "leave"
          customer.progress = 0
        }
      } else if (customer.phase === "campaign") {
        exitPath.getPointAt(0.73, point)
        campaignProgress = clamp(customer.progress * 1.75)
        scale = 1 + Math.sin(customer.progress * Math.PI * 4) * 0.1
        if (customer.progress >= 0.62) {
          customer.phase = "return"
          customer.progress = 0
        }
      } else if (customer.phase === "return") {
        returnPath.getPointAt(clamp(customer.progress), point)
        returning = true
        scale = 1.08
        if (customer.progress >= 1) {
          customer.phase = "repurchase"
          customer.progress = 0
          onWinBack(46 + ((customer.id * 17) % 61))
        }
      } else if (customer.phase === "repurchase") {
        point.set(0.25, 1.25, 0.24)
        returning = true
        rippleProgress = clamp(customer.progress * 2.4)
        scale = 1.08 + Math.sin(customer.progress * Math.PI * 6) * 0.12
        if (customer.progress >= 0.5) {
          customer.phase = "wait"
          customer.progress = 0
        }
      } else if (customer.phase === "leave") {
        exitPath.getPointAt(1, point)
        point.x += customer.progress * 2.1
        scale = Math.max(0.14, 1 - customer.progress)
        if (customer.progress >= 1) {
          customer.phase = "wait"
          customer.progress = 0
        }
      } else {
        visible = false
        point.copy(entryPath.getPointAt(0))
        if (customer.progress >= 0.6 + (customer.id % 4) * 0.12) {
          customer.phase = "enter"
          customer.progress = -(customer.id % 3) * 0.1
          customer.returns = Math.random() > 0.28
          customer.speed = 0.35 + Math.random() * 0.1
          customer.route = Math.floor(Math.random() * 3)
        }
      }

      dummy.position.copy(point)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(visible ? scale : 0)
      dummy.updateMatrix()
      tokenMesh.current!.setMatrixAt(index, dummy.matrix)

      if (returning || customer.phase === "repurchase" || customer.phase === "purchase") {
        tokenColor.set(BOOST)
      } else if (customer.phase === "enter") {
        tokenColor.set(BLUE)
      } else {
        tokenColor.set("#94a3b8")
      }
      tokenMesh.current!.setColorAt(index, tokenColor)

      if (campaignProgress >= 0) {
        campaignPath.getPointAt(campaignProgress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(0.8 + Math.sin(campaignProgress * Math.PI) * 0.52)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      pulseMesh.current!.setMatrixAt(index, dummy.matrix)

      if (rippleProgress >= 0) {
        dummy.position.set(0, 1.25, 0.08)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(0.45 + rippleProgress * 3.1)
        rippleColor.set(BOOST).lerp(new THREE.Color("#ffe3e1"), rippleProgress)
        rippleMesh.current!.setColorAt(index, rippleColor)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      rippleMesh.current!.setMatrixAt(index, dummy.matrix)

    })

    tokenMesh.current.instanceMatrix.needsUpdate = true
    pulseMesh.current.instanceMatrix.needsUpdate = true
    rippleMesh.current.instanceMatrix.needsUpdate = true
    if (tokenMesh.current.instanceColor) tokenMesh.current.instanceColor.needsUpdate = true
    if (rippleMesh.current.instanceColor) rippleMesh.current.instanceColor.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={tokenMesh} args={[undefined, undefined, TOKEN_COUNT]} castShadow>
        <sphereGeometry args={[0.115, 20, 20]} />
        <meshPhysicalMaterial roughness={0.18} metalness={0.2} clearcoat={0.7} clearcoatRoughness={0.2} />
      </instancedMesh>

      <instancedMesh ref={pulseMesh} args={[undefined, undefined, TOKEN_COUNT]}>
        <sphereGeometry args={[0.082, 16, 16]} />
        <meshBasicMaterial color={BOOST} toneMapped={false} />
      </instancedMesh>

      <instancedMesh ref={rippleMesh} args={[undefined, undefined, TOKEN_COUNT]} visible={false}>
        <ringGeometry args={[0.13, 0.155, 48]} />
        <meshBasicMaterial transparent opacity={0.22} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}

function CameraMotion() {
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    target.set(
      0.5 + state.pointer.x * 0.18 + Math.sin(time * 0.12) * 0.06,
      3.65 + state.pointer.y * 0.13 + Math.cos(time * 0.1) * 0.05,
      11,
    )
    state.camera.position.lerp(target, 0.025)
    state.camera.lookAt(0.25, 1.35, 0)
  })
  return null
}

function Scene({ onWinBack }: { onWinBack: (amount: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.82} />
      <hemisphereLight intensity={0.7} color="#ffffff" groundColor="#e6ebe7" />
      <directionalLight castShadow position={[-3, 7, 8]} intensity={1.65} color="#ffffff" shadow-mapSize={[1024, 1024]} />

      <pointLight position={[-5, 3, 6]} intensity={0.48} color="#e3f7e9" distance={16} />
      <pointLight position={[5, 1, 5]} intensity={0.35} color="#fff1dc" distance={14} />

      <CameraMotion />

      {ENTRY_CURVES.map((path, index) => <FlowPath key={`entry-${index}`} path={path} color="#93c5fd" radius={0.018} opacity={0.55} />)}
      {EXIT_CURVES.map((path, index) => <FlowPath key={`exit-${index}`} path={path} color="#FF554D" radius={0.018} opacity={0.35} />)}
      {RETURN_CURVES.map((path, index) => <FlowPath key={`return-${index}`} path={path} color={BOOST} radius={0.027} opacity={index === 1 ? 0.72 : 0.52} />)}

      <TravellingLight path={ENTRY_CURVES[0]!} delay={0.12} speed={0.08} color={BLUE} />
      <TravellingLight path={ENTRY_CURVES[2]!} delay={0.62} speed={0.075} color={BLUE} />
      <TravellingLight path={RETURN_CURVES[0]!} delay={0.1} speed={0.11} />
      <TravellingLight path={RETURN_CURVES[1]!} delay={0.52} speed={0.1} />

      <Customers onWinBack={onWinBack} />
    </>
  )
}

export function RetentionCanvas({ onWinBack }: { onWinBack: (amount: number) => void }) {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0.5, 3.65, 11], zoom: 48, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene onWinBack={onWinBack} />
    </Canvas>
  )
}
