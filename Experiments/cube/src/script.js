import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Material, TorusGeometry } from "three";
import * as dat from "dat.gui";

const parameters = {
  backgroundColor: "#050624",
  matColor: "#ff9500",
  spin: () => {
    gsap.to(mesh.rotation, { duration: 10, y: mesh.rotation.y + 10 });
  },
};

//debug
const gui = new dat.GUI();
// Canvas
const canvas = document.querySelector("canvas.webgl");
// textures
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load(`/textures/gradients/4.jpg`);
const matCapTexture = textureLoader.load(`/textures/matcaps/9.png`);

const envMapTexture = cubeTextureLoader.load([
  `/textures/environmentMaps/4/px.png`,
  `/textures/environmentMaps/4/nx.png`,
  `/textures/environmentMaps/4/py.png`,
  `/textures/environmentMaps/4/ny.png`,
  `/textures/environmentMaps/4/pz.png`,
  `/textures/environmentMaps/4/nz.png`,
]);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(parameters.backgroundColor);
// scene.background = envMapTexture;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

gradientTexture.generateMipmaps = false;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

matCapTexture.generateMipmaps = false;
matCapTexture.minFilter = THREE.NearestFilter;
matCapTexture.magFilter = THREE.NearestFilter;

const mat = new THREE.MeshMatcapMaterial();
mat.matcap = matCapTexture;
mat.color = new THREE.Color(parameters.matColor);

// FOG
const fog = new THREE.Fog(parameters.backgroundColor, 0, 10);
scene.fog = fog;

const ambientLight = new THREE.AmbientLight("#fff", 0.75);
const pointLight = new THREE.PointLight("#fff", 2.5);
pointLight.position.x = 2;
pointLight.position.z = 3;
pointLight.position.x = 4;
scene.add(ambientLight, pointLight);

const rows = 10;
const cols = 10;
const stratas = 10;
const cubeSize = 1;
const cubePadding = 1;

const generateCubeLocations = () => {
  let strata = [];
  for (let s = 0; s < stratas; s++) {
    let plane = [];
    const z = s * (cubeSize + cubePadding);
    for (let i = 0; i < rows; i++) {
      const x = i * (cubeSize + cubePadding);
      for (let j = 0; j < cols; j++) {
        const y = j * (cubeSize + cubePadding);
        const loc = { x, y, z };
        plane.push(loc);
      }
    }
    strata.push(plane);
  }
  return strata;
};

const cubeLocations = generateCubeLocations();
const cubeGroup = new THREE.Group();
// const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

for (let i = 0; i < cubeLocations.length; i++) {
  for (let j = 0; j < cubeLocations[i].length; j++) {
    const r = cubeSize / 2;
    const geometry = new THREE.SphereGeometry(r, 32, 32);
    const cube = new THREE.Mesh(geometry, mat);

    cube.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2)
    );
    cube.position.x = cubeLocations[i][j].x;
    cube.position.y = cubeLocations[i][j].y;
    cube.position.z = cubeLocations[i][j].z;
    cube.receiveShadow = true;

    cubeGroup.add(cube);
  }
}

const tx = -(rows * (cubeSize + cubePadding)) * 0.5;
const ty = -(cols * (cubeSize + cubePadding)) * 0.5;
const tz = -(stratas * (cubeSize + cubePadding)) * 0.5;

cubeGroup.position.x = tx;
cubeGroup.position.y = ty;
cubeGroup.position.z = tz;

scene.add(cubeGroup);

// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 9;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;
console.log(controls);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const yOff = Math.sin(elapsedTime * 0.03) * 10;
  camera.position.y = yOff;

  //   pointLight.position.x = camera.position.x;
  //   pointLight.position.y = camera.position.y;
  //   pointLight.position.z = camera.position.z * -1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
