import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Material, TorusGeometry } from 'three'
import * as dat from "dat.gui"


//debug
const gui = new dat.GUI();


// textures
const cubeTextureLoader = new THREE.CubeTextureLoader()


const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load(`/textures/door/color.jpg`)
const doorRoughnessMap = textureLoader.load(`/textures/door/roughness.jpg`)
const doorHeightTexture = textureLoader.load(`/textures/door/height.jpg`)
const doorMetalnessMap = textureLoader.load(`/textures/door/metalness.jpg`)
const doorAmbientOcculsionTexture = textureLoader.load(`/textures/door/ambientOcclusion.jpg`)
const doorAlphaTexture = textureLoader.load(`/textures/door/alpha.jpg`)
const doorNormalTexture = textureLoader.load(`/textures/door/normal.jpg`)

const matCapTexture = textureLoader.load(`/textures/matcaps/3.png`)
const gradientTexture = textureLoader.load(`/textures/gradients/5.jpg`)


const envMapTexture = cubeTextureLoader.load(
    [`/textures/environmentMaps/4/px.png`,
        `/textures/environmentMaps/4/nx.png`,
        `/textures/environmentMaps/4/py.png`,
        `/textures/environmentMaps/4/ny.png`,
        `/textures/environmentMaps/4/pz.png`,
        `/textures/environmentMaps/4/nz.png`,]
)

gradientTexture.generateMipmaps = false
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// const mat = new THREE.MeshStandardMaterial()
// mat.roughness = 1
// mat.metalness = 0
// mat.map = doorColorTexture
// mat.aoMap = doorAmbientOcculsionTexture
// mat.aoMapIntensity = 1
// mat.displacementMap = doorHeightTexture
// mat.displacementScale = 0.05
// mat.metalnessMap = doorMetalnessMap
// mat.roughnessMap = doorRoughnessMap
// mat.normalMap = doorNormalTexture
// // mat.normalScale.set(0.5, 0.5)
// mat.alphaMap = doorAlphaTexture
// mat.transparent = true


const mat = new THREE.MeshStandardMaterial()
mat.metalness = 0.7
mat.roughness = 0
mat.envMap = envMapTexture
mat.color = new THREE.Color("#006978")

gui.add(mat, "metalness", 0, 1, 0.0001)
gui.add(mat, "roughness", 0, 1, 0.0001)


const ambientLight = new THREE.AmbientLight("#00bfa5", 0.75)
const pointLight = new THREE.PointLight("#00bfa5", 2.5)
pointLight.position.x = 2
pointLight.position.z = 3
pointLight.position.x = 4




const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.5, 64, 64
    ), mat
)
sphere.geometry.setAttribute(
    "uv2", new THREE.BufferAttribute(
        sphere.geometry.attributes.uv.array,
        2
    )
)


scene.add(sphere, ambientLight, pointLight)

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    // update obj
    sphere.rotation.y = elapsedTime * 0.1
    sphere.rotation.x = elapsedTime * 0.1
    sphere.rotation.z = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()