import "./style/main.css";

import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Group } from "three";

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()
/**
 * Texture
 */

const textureLoader =  new THREE.TextureLoader()

/**
 * Test cube
 */

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial

)

scene.add(cube)


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
camera.position.z = 5
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
