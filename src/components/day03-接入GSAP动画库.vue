<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 导入gsap动画库 https://gsap.com/
import gsap from "gsap";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
let cube = null;
let axesHelper = null;
let controls = null;
let loader = null;
const init = () => {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  axesHelper = new THREE.AxesHelper(5);
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 10;
  camera.position.y = 2;
  // camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 创建三个球
  const color = [0xfff000, 0x00ff00, 0x0000ff];
  const spheres = [];
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color[i] });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = i * 3 - 3;
    sphere.position.y = 2;
    spheres.push(sphere);
    scene.add(sphere);
  }

  function animate(target, d = 1) {
    // 单位为秒
    gsap.to(target, {
      y: -2,
      // 延迟时间
      delay: d,
      // 持续时间
      duration: 1,
      // 运动曲线https://gsap.com/docs/v3/Eases/
      ease: "power1.inOut",
      // 设置循环次数默认为0  -1为无限循环
      repeat: -1,
      // 设置循环往复
      yoyo: true,
    });
  }

  animate(spheres[0].position, 0.1);
  animate(spheres[1].position, 0.5);
  animate(spheres[2].position, 1);
};

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
const resize = () => {
  const containerBoxW =
    document.querySelector(".container-box").offsetWidth || window.innerWidth;
  renderer.setSize(containerBoxW, window.innerHeight);
  camera.aspect = containerBoxW / window.innerHeight;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  init();
  resize();
  animate();
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss" scoped>
#canvasDom {
  // position: fixed;
  width: 100;
  height: 100%;
}
</style>
