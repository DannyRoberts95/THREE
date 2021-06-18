const scene = new THREE.Scene();

const sizes = { width: 800, height: 600 };

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// camera
const cameraPosition = { x: 0, y: 0, z: 3 }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = cameraPosition.z
scene.add(camera);

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.height, sizes.height)
renderer.render(scene, camera)