import * as THREE from 'three'
import Experience from './Experience.js'
import Sphere from './Sphere.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setSphere()
            }
        })
    }

    setSphere()
    {
        
       this.sphere = new Sphere()        
    }

    setDemo()
    {
        this.demo = {}
        this.demo.model = this.resources.items.demoModel.scene

        this.demo.texture = this.resources.items.bakedTexture
        this.demo.texture.encoding = THREE.sRGBEncoding
        this.demo.texture.flipY = false

        this.demo.material = new THREE.MeshBasicMaterial({map:this.demo.texture})
        this.scene.add(this.demo.model)
       
        this.demo.model.traverse((_child) => 
        {
            if(_child instanceof THREE.Mesh)
            {
                _child.material = this.demo.material
            }
        })

        const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        directionalLight.position.set(5, 5, 5)
        this.scene.add(directionalLight)
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}