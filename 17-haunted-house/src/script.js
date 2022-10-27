import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// fog
const fog = new THREE.Fog("#262837", 2, 16);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// wallTextures
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

// grassTextures
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    color: "#f1f1f1",
    map: bricksColorTexture,
    roughnessMap: bricksRoughnessTexture,
    normalMap: bricksNormalTexture,
    aoMap: bricksAmbientOcclusionTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

walls.position.y = 1.25;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 3;
roof.rotateY(Math.PI / 4);
house.add(roof);

//Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    color: "#aa7b7b",
    transparent: true,
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2.01;
door.position.y = 0.9;
house.add(door);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

//bush
const bushGeo = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMat = new THREE.MeshStandardMaterial({ color: "#a1c390" });

const bush1 = new THREE.Mesh(bushGeo, bushMat);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeo, bushMat);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.5, 0.2, 2.3);

const bush3 = new THREE.Mesh(bushGeo, bushMat);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1.5, 0.2, 2.3);

house.add(bush1, bush2, bush3);

//graves
const graves = new THREE.Group();
const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMat = new THREE.MeshStandardMaterial({
  color: "#b2b6b1",
  // color: "#f1f1f1",
  map: bricksColorTexture,
  roughnessMap: bricksRoughnessTexture,
  normalMap: bricksNormalTexture,
  aoMap: bricksAmbientOcclusionTexture,
});

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeo, graveMat);
  grave.position.set(x, 0.3, z);
  grave.rotateY((Math.random() - 0.5) * 0.4);
  grave.rotateZ((Math.random() - 0.5) * 0.1);
  grave.castShadow = true;
  grave.receiveShadow = true;
  graves.add(grave);
}
scene.add(graves);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
moonLight.castShadow;

gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

//Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

//Ghosts

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#ffff00", 2, 3);
const ghost3 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837", 1);

// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.mapSize.far = 7;

moonLight.castShadow = true;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.mapSize.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.mapSize.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.mapSize.far = 7;

walls.castShadow = true;
walls.receiveShadow = true;

// floor.castShadow=true;
floor.receiveShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Ang = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Ang) * 4;
  ghost1.position.z = Math.sin(ghost1Ang) * 4;
  ghost1.position.y = Math.sin(ghost1Ang * 3);

  const ghost2Ang = elapsedTime * 0.5;
  ghost2.position.x = Math.cos(ghost2Ang) * -3;
  ghost2.position.z = Math.sin(ghost2Ang) * 5;
  ghost2.position.y = Math.sin(ghost2Ang * 3) + Math.sin(elapsedTime * 1.5);

  const ghost3Ang = elapsedTime * 0.65;
  const r = 7 - Math.sin(elapsedTime) * 3;
  ghost3.position.x = Math.cos(ghost3Ang) * r;
  ghost3.position.z = Math.sin(ghost3Ang) * r;
  ghost3.position.y = Math.sin(ghost3Ang * 3) + Math.sin(elapsedTime * 1.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
