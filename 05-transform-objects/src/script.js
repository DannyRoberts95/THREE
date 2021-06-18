import './style.css'
import * as THREE from 'three'
import { Camera } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const group = new THREE.Group()
scene.add(group)

const c1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
)
const c2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green" })
)
const c3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "blue" })
)
c2.position.x=-2
c3.position.x=2


group.add(c1)
group.add(c2)
group.add(c3)

group.position.x=2

/**
 * Sizes
 */
const sizes = {
    width: 800 * 0.8,
    height: 600 * 0.8
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)