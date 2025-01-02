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

const gui = new GUI();
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("textures/particles/10.png");

/**
 * 粒子
 */
// // 圆形几何
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// // 粒子材质
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });

// // 点物体  https://threejs.org/docs/index.html?q=point#api/zh/objects/Points
// const particles = new THREE.Points(sphereGeometry, particlesMaterial);
// scene.add(particles);

const particlesGeometry = new THREE.BufferGeometry();
const count = 10000;

const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10; // 随机数
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  color: new THREE.Color("#ff88cc"),
  // map: particleTexture,
  // 解决透明背景问题
  alphaMap: particleTexture,
  transparent: true,
  // 方式一  会出现边缘遮盖后面
  // alphaTest: 0.001,
  // 方式二  场景中同一颜色可以   不同颜色不行
  // depthTest: false,
  // 方式三
  depthWrite: false,
  blending: THREE.AdditiveBlending, // 混合模式
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// 测试depthTest问题
// const mesh = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(mesh);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 0.1, 100);
camera.position.z = 5;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

let resize = null;
const init = () => {
  const canvas = document.getElementById("canvasId");
  // https://threejs.org/docs/index.html?q=WebGLRenderer#api/zh/renderers/WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(info.w, info.h);
  renderer.render(scene, camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
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
