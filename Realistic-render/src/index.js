import "./style/main.css";

import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { CubeTextureLoader } from "three";

/**
 *  Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 *  Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

/**
 *  Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Texture
 */

const textureLoader =  new THREE.TextureLoader()

/**
 *  Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/environmentMap/1/px.png',
  '/environmentMap/1/nx.png',
  '/environmentMap/1/py.png',
  '/environmentMap/1/ny.png',
  '/environmentMap/1/pz.png',
  '/environmentMap/1/nz.png',
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 3
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => {
  
})

/**
 *  Models
 */
gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf) => {
    gltf.scene.scale.set(7, 7, 7)
    gltf.scene.position.set(0, -2 ,0)
    gltf.scene.rotation.y = - Math.PI * 0.25
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, "y")
      .min(- Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name('rotation')
    
    updateAllMaterials()
    
  }
)

/**
 * Light
 */
// //Ambient light
// const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
// scene.add(ambientLight)

//Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 3)
moonLight.position.set(0.25, 3, -2)
moonLight.castShadow = true
moonLight.shadow.camera.far = 10
moonLight.shadow.mapSize.set(1024, 1024)
moonLight.shadow.normalBias = 0.02
scene.add(moonLight)

// const directionLightCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera)
// scene.add(directionLightCameraHelper)
// // Door light
// const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
// doorLight.position.set(0, 2.2, 2.7)
// scene.add(doorLight)

gui.add(moonLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')


//Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  //Update renderer
  renderer.setSize(sizes.width, sizes.height)
})

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enableDamping = true


//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Lineat: THREE.LinearToneMapping,
  Reinhard: THREE.CineonToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESDilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
  renderer.toneMapping = Number(renderer.toneMapping)
  updateAllMaterials()
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

function animate() {

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();

/**
 * Animate
 */

const clock = new THREE.Clock()
const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()

  //Update controls
  controls.update()

  //Render
  renderer.render(scene, camera)

  //Call tick again on the next
  window.requestAnimationFrame(tick)
}

tick()
