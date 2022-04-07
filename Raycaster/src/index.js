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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object3.position.x = 2

scene.add(object1, object2, object3)


/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()


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

window.addEventListener('click', (event) =>
{
  if(currentIntersect)
  {
    switch(currentIntersect.object)
    {
      case object1:
        console.log('click on object1')
        break
      
      case object2:
        console.log('click on object2')
        break

      case object3:
        console.log('click on object3')
        break
      
      default:
        console.log('no click object')
    }
  }
})

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
  mouse.x = event.clientX /sizes.width * 2 - 1
  mouse.y = - (event.clientY /sizes.height )* 2 + 1

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

let currentIntersect = null

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()

  //Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  //Cast a ray
  raycaster.setFromCamera(mouse, camera)
 
  const objectsToTest = [object1, object2, object3]
  const intersects = raycaster.intersectObjects(objectsToTest)

  for(const object of objectsToTest)
  {
    object.material.color.set('#ff0000')
  }
  
  for(const intersect of intersects)
  {
    intersect.object.material.color.set('#0000ff')
  }

  if(intersects.length > 0)
  {
    if (currentIntersect === null)
    {
      console.log('mouse enter')
    }
    currentIntersect = intersects[0]
  }
  else
  {
    if (currentIntersect === null)
    {
      console.log('mouse leave')
    }
    currentIntersect = null
  }

  //Update controls
  controls.update()

  //Render
  renderer.render(scene, camera)

  //Call tick again on the next
  window.requestAnimationFrame(tick)
}

tick()
