import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

function ShapeGeometry({kind}) {
  return useMemo(() => {
    const s = new THREE.Shape()
    const path = (points) => { s.moveTo(points[0][0],points[0][1]); points.slice(1).forEach(p=>s.lineTo(p[0],p[1])); s.closePath() }
    if (['dress','gown','shirtDress'].includes(kind)) {
      path([[-.25,1.15],[-.48,1.27],[-.29,.72],[-.38,.15],[-.64,-1.12],[.64,-1.12],[.38,.15],[.29,.72],[.48,1.27],[.25,1.15],[.16,.72],[-.16,.72]])
    } else if (['blazer','suit','vest','blouse','shirt','top','cape'].includes(kind)) {
      path([[-.42,1.2],[-.78,.9],[-.58,.1],[-.5,-.72],[.5,-.72],[.58,.1],[.78,.9],[.42,1.2],[.16,.95],[0,.48],[-.16,.95]])
    } else if (kind==='trousers') {
      path([[-.47,.92],[.47,.92],[.43,.1],[.38,-1.22],[.05,-1.22],[0,0],[-.05,-1.22],[-.38,-1.22],[-.43,.1]])
    } else if (['pencilSkirt','skirt'].includes(kind)) {
      path([[-.34,.8],[.34,.8],[kind==='skirt'?.72:.43,-1.08],[kind==='skirt'?-.72:-.43,-1.08]])
    } else if (['coat','trench'].includes(kind)) {
      path([[-.43,1.25],[-.78,.9],[-.59,.05],[-.72,-1.25],[.72,-1.25],[.59,.05],[.78,.9],[.43,1.25],[.16,1.02],[0,.63],[-.16,1.02]])
    } else {
      path([[-.66,.48],[-.52,.64],[.52,.64],[.66,.48],[.6,-.58],[.45,-.68],[-.45,-.68],[-.6,-.58]])
    }
    const g = new THREE.ExtrudeGeometry(s,{depth:.18,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.035,bevelThickness:.035})
    g.center(); g.computeVertexNormals(); return g
  },[kind])
}
function Mannequin() {
  const skin = '#c9b9a6'
  return <group position={[0,0,-.23]}>
    <mesh position={[0,1.37,0]}><sphereGeometry args={[.17,24,24]}/><meshStandardMaterial color={skin} roughness={.9}/></mesh>
    <mesh position={[0,1.05,0]}><cylinderGeometry args={[.08,.1,.32,18]}/><meshStandardMaterial color={skin} roughness={.9}/></mesh>
    <mesh position={[0,.55,0]}><capsuleGeometry args={[.22,.6,5,16]}/><meshStandardMaterial color={skin} roughness={.92}/></mesh>
    <mesh position={[0,-.22,0]}><capsuleGeometry args={[.18,.62,5,16]}/><meshStandardMaterial color={skin} roughness={.92}/></mesh>
    <mesh position={[-.34,.52,0]} rotation={[0,0,-.12]}><capsuleGeometry args={[.075,.65,4,12]}/><meshStandardMaterial color={skin} roughness={.92}/></mesh>
    <mesh position={[.34,.52,0]} rotation={[0,0,.12]}><capsuleGeometry args={[.075,.65,4,12]}/><meshStandardMaterial color={skin} roughness={.92}/></mesh>
  </group>
}
function Garment({kind,color,roughness,metalness,texture,decoration,placement,onMannequin}) {
  const geometry=ShapeGeometry({kind})
  const material=useMemo(()=>new THREE.MeshStandardMaterial({color,roughness,metalness,side:THREE.DoubleSide}),[color,roughness,metalness])
  const gold=useMemo(()=>new THREE.MeshStandardMaterial({color:'#c0a16b',roughness:.34,metalness:.3}),[])
  const bag=['bag','clutch','tote'].includes(kind)
  const pos={chest:[0,.42,.12],waist:[0,-.02,.12],hem:[0,-.72,.12],sleeve:[-.48,.28,.12]}[placement]||[0,.42,.12]
  return <group scale={bag?.82:1} position={[0,bag?.2:0,0]}>
    {onMannequin&&!bag&&<Mannequin/>}
    <mesh geometry={geometry} material={material} castShadow receiveShadow/>
    {['blazer','suit','coat','trench','shirt','blouse'].includes(kind)&&<>
      <mesh position={[-.07,.08,.112]}><boxGeometry args={[.018,1.18,.018]}/><primitive object={gold} attach="material"/></mesh>
      {[-.43,-.16,.11,.38].map(y=><mesh key={y} position={[.08,y,.13]}><sphereGeometry args={[.033,12,12]}/><primitive object={gold} attach="material"/></mesh>)}
    </>}
    {decoration!=='none'&&<group position={pos}>
      {decoration==='monogram'?<Html transform distanceFactor={5} center><div className="deco-monogram">A</div></Html>:<><mesh><torusGeometry args={[.13,.018,8,32]}/><primitive object={gold} attach="material"/></mesh><mesh position={[0,0,.006]}><sphereGeometry args={[.065,16,16]}/><primitive object={gold} attach="material"/></mesh></>}
    </group>}
    {texture==='woven'&&<mesh position={[0,0,.1]}><planeGeometry args={[.01,.01]}/><meshBasicMaterial transparent opacity={0}/></mesh>}
  </group>
}
function Contents(props) {
  return <>
    <color attach="background" args={['#f1eee8']}/>
    <ambientLight intensity={1.3}/>
    <directionalLight position={[4,6,5]} intensity={2.1} castShadow/>
    <directionalLight position={[-4,2,-3]} intensity={.7}/>
    <Suspense fallback={<Html center>Загрузка сцены…</Html>}><Environment preset="studio"/></Suspense>
    <gridHelper args={[8,24,'#d5cfc5','#e2ddd5']} position={[0,-1.62,0]}/>
    <Garment {...props}/>
    <ContactShadows position={[0,-1.6,0]} opacity={.28} scale={5} blur={2.4} far={2.2}/>
    <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={8} minPolarAngle={.45} maxPolarAngle={2.5}/>
  </>
}
export default function Scene(props) {
  return <Canvas shadows camera={{position:[0,.25,4.6],fov:38}} dpr={[1,1.75]}><Contents {...props}/></Canvas>
}
