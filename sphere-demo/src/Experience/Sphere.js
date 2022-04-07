import * as THREE from "three"
import Experience from "./Experience"

export default class Sphere
{
    constructor(){

        this.experience = new Experience()
        this.scene = this.experience.scene

        const geometry = null
        const material = null
        const mesh = null

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        
    }
    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry(1,1,1)
    }
    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial({color:0Xff0000})
        
    }
    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        this.mesh.position.z = 1
        this.scene.add(this.mesh)
        
    }
}