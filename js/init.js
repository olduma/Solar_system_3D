document.body.style.overflow = 'hidden';
document.body.style.background = 'black';
let cameraDistance = 8000;

const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.getElementById("canvas");

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

// Create the renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setClearColor(0x000000);
// renderer.shadowMap.enabled = true;

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000000);
camera.position.z = cameraDistance;
camera.position.y = 4;
camera.lookAt(0, 0, 0);





