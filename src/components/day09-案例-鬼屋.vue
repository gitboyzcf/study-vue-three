<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
// 引入lil-gui库https://lil-gui.georgealways.com/
import GUI from "lil-gui";

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const debugObject = {
  color: "#fff",
};

const gui = new GUI();
const scene = new THREE.Scene();

/**
 * Fog
 */
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
// 门贴图
const doorHeightTexture = textureLoader.load("textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg");

// 墙砖石贴图
const bricksTexture = textureLoader.load("textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "textures/bricks/roughness.jpg"
);

// 地面贴图
const grassTexture = textureLoader.load("textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "textures/grass/roughness.jpg"
);

grassTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * Lights
 * https://threejs.org/docs/index.html?q=mbi#api/zh/lights/AmbientLight
 */

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12); // 颜色，强度
scene.add(ambientLight);
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12); // 颜色，强度
moonLight.position.set(2, 2, -1); // 设置平行光发射位置
scene.add(moonLight);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

/**
 * House
 */

//  创建房子组
const house = new THREE.Group();
scene.add(house);

// 制作墙体
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

// 制作屋顶
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// 制作门
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
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
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// 添加灌木丛
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// 添加坟墓组
const graves = new THREE.Group();
scene.add(graves);

const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gtaveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

// 循环50次，添加50个坟墓 随机
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(gravesGeometry, gtaveMaterial);
  grave.castShadow = true;
  grave.position.set(x, 0.3, z);

  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// 添加门灯
const doorLight = new THREE.PointLight("#ff7d46", 2, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;

scene.add(floor);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost1, ghost2, ghost3);

/**
 * Shadows
 */
// 月光
moonLight.castShadow = true;
// 门灯
doorLight.castShadow = true;
// 鬼混
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

// 墙
walls.castShadow = true;
// 灌木丛
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

// 地面
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);
camera.position.z = 10;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

let resize = null;
const init = () => {
  const canvas = document.getElementById("canvasId");
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(info.w, info.h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 更换渲染背景色
  renderer.setClearColor("#262837");
  renderer.render(scene, camera);

  const controls = new OrbitControls(camera, canvas);
  resize = () => {
    const containerBoxW =
      document.querySelector(".container-box").offsetWidth || window.innerWidth;
    renderer.setSize(containerBoxW, window.innerHeight);
    camera.aspect = containerBoxW / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  resize();
  // 监听窗口变化
  window.addEventListener("resize", resize);

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // 鬼魂添加动画
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
  gui.destroy();
});
</script>
<style scoped lang="scss">
#canvasId {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
}
</style>
