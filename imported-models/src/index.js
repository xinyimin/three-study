import "./style/main.css";

import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 *  Base
 */

// Debug
const gui = new dat.GUI()

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

/**
 *   Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
  '/models/Fox/glTF/Fox.gltf',
  (data) => {
    console.log(data);

    // while (data.scene.children.length) {
    //   scene.add(data.scene.children[0])
    // }

    // const children = [...data.scene.children]
    // for (const child of children) {
    //   scene.add(child)
    // }

    mixer = new THREE.AnimationMixer(data.scene)
    
    const action = mixer.clipAction(data.animations[2])
    action.play()

    data.scene.scale.set(0.02, 0.02, 0.02)

    scene.add(data.scene)
  },
)

/**
 * Texture
 */
const textureLoader =  new THREE.TextureLoader()

/**
 *  Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10,10),
  new THREE.MeshBasicMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
  })

)

floor.rotation.x = - Math.PI * 0.5

scene.add(floor)


/**
 * Light
 */
//Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
scene.add(ambientLight)

//Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
scene.add(doorLight)

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
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enableDamping = true


//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

function animate() {

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();

/**
 * Animate
 */

const clock = new THREE.Clock()

let previousTime = 0

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  
  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime)
  }

  //Update controls
  controls.update()

  //Render
  renderer.render(scene, camera)

  //Call tick again on the next
  window.requestAnimationFrame(tick)
}

tick()
