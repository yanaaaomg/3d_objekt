import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1. Vytvoření scény a kamery
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Kamera je posunutá na hodnotu 150, aby obsáhla všechny tři velké kostky najednou
camera.position.z = 150; 

// Globální proměnné pro ovládání
let controls;

// 2. Inicializace rendereru
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// 3. Aktivace OrbitControls (ovládání myší na kliknutí a tažení)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;

// 4. Načtení 3D modelu a jeho rozmístění
const loader = new GLTFLoader();
loader.load(
  './kostka.glb', // Kostka umístěná vedle index.html
  function (gltf) {
    const baseCube = gltf.scene;
    
    // Nastavení měřítka z Blenderu
    baseCube.scale.set(30, 30, 30); 

    // --- PROSTŘEDNÍ KOSTKA ---
    const cube1 = baseCube;
    cube1.position.set(0, 0, 0); 
    scene.add(cube1);

    // --- LEVÁ KOSTKA ---
    const cube2 = baseCube.clone(); 
    cube2.position.set(-80, 0, 0); // Výrazný posun doleva na ose X
    scene.add(cube2);

    // --- PRAVÁ KOSTKA ---
    const cube3 = baseCube.clone(); 
    cube3.position.set(80, 0, 0);  // Výrazný posun doprava na ose X
    scene.add(cube3);

    console.log("Všechny 3 kostky byly úspěšně načteny a rozmístěny!");
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Chyba při načítání modelu:", error);
  }
);

// 5. Osvětlení scény
// DirectionalLight funguje jako slunce (paralelní paprsky), pozice určuje směr, odkud svítí
const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(100, 100, 100); 
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 6. Animační smyčka (vykreslování)
function animate() {
  requestAnimationFrame(animate);

  // Aktualizace OrbitControls pro plynulý pohyb
  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// 7. Responzivita při změně velikosti okna prohlížeče
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spuštění celé aplikace
animate();