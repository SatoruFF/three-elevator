import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// === Основная сцена ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Управление камерой ===
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());

// === Освещение ===
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Мягкое освещение
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffff00, 1, 5);
pointLight.position.set(0, 1.5, 0);
scene.add(pointLight);

// === Лифт ===
const lift = new THREE.Group();
scene.add(lift);

// === Пол лифта ===
const floorGeometry = new THREE.PlaneGeometry(2, 2);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;  // Поворот, чтобы пол был горизонтальным
floor.position.set(0, -1.5, 0);
lift.add(floor);

// === Стены лифта ===
const wallGeometry = new THREE.PlaneGeometry(2, 3);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide });

// Передняя стена
const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
frontWall.position.set(0, 0, 1);
lift.add(frontWall);

// Задняя стена
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, 0, -1);
backWall.rotation.y = Math.PI;  // Поворот для задней стены
lift.add(backWall);

// Левая стена
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-1, 0, 0);
leftWall.rotation.y = Math.PI / 2;  // Поворот для левой стены
lift.add(leftWall);

// Правая стена
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(1, 0, 0);
rightWall.rotation.y = -Math.PI / 2;  // Поворот для правой стены
lift.add(rightWall);

// === Двери лифта ===
const doorGeometry = new THREE.BoxGeometry(0.2, 2, 1);  // Сделаем двери с реальной толщиной
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });

// Первая дверь
const door1 = new THREE.Mesh(doorGeometry, doorMaterial);
door1.position.set(-1, 0, 1);  // Позиция первой двери
lift.add(door1);

// Вторая дверь
const door2 = new THREE.Mesh(doorGeometry, doorMaterial);
door2.position.set(1, 0, 1);  // Позиция второй двери
lift.add(door2);

// === Псевдо зеркало (серый прямоугольник) ===
const mirrorGeometry = new THREE.PlaneGeometry(0.6, 0.8);  // Размер зеркала
const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: 0x999999,  // Серый цвет для псевдо зеркала
  side: THREE.DoubleSide,
  roughness: 0.5,  // Немного шероховатости
  metalness: 0.1,  // Малая металличность для имитации
  opacity: 1,  // Прозрачность
  transparent: true
});

const pseudoMirrorLeft = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
pseudoMirrorLeft.position.set(-0.8, 0.5, 1.1);  // Позиция псевдо зеркала на левой стене
lift.add(pseudoMirrorLeft);

const pseudoMirrorRight = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
pseudoMirrorRight.position.set(0.8, 0.5, 1.1);  // Позиция псевдо зеркала на правой стене
lift.add(pseudoMirrorRight);

// === Лампочка ===
const bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 1 });
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulb.position.set(0, 1.4, 0);
lift.add(bulb);
pointLight.position.set(0, 1.5, 0);
lift.add(pointLight);

// === Движение лифта ===
let targetFloor = 0;
const floors = [-4, -2, 0, 2, 4];

// Логика движения лифта
function animate() {
  requestAnimationFrame(animate);

  // Плавное перемещение лифта
  const speed = 0.05;
  if (lift.position.y < targetFloor) {
    lift.position.y += speed;
  } else if (lift.position.y > targetFloor) {
    lift.position.y -= speed;
  }

  // Синхронизация камеры с лифтом
  controls.update();  // Обновляем управление камерой
  renderer.render(scene, camera);
}

animate();

// === Управление ===
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    pointLight.intensity = pointLight.intensity > 0 ? 0 : 1.5;  // Переключение
