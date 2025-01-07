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
 * Galaxy
 */

//  配置
const parameters = {
  count: 100000, // 粒子数量
  size: 0.02, // 粒子大小
  radius: 5, // 半径
  branches: 3, // 分支
  spin: 1, // 旋转
  randomness: 0.2, // 随机范围
  randomnessPower: 3, // 随机强度
  insideColor: "#ff6030", // 内部颜色
  outsideColor: "#1b3984", // 外部颜色
};

let geometry = null;
let meterial = null;
let points = null;

// 生成星系
const generateGalaxy = () => {
  /**
   * 清除
   */
  if (points !== null) {
    geometry.dispose();
    meterial.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count * 3; i++) {
    const i3 = i * 3;

    /**
     * Position
     */
    //   随机半径
    const radius = Math.random() * parameters.radius;
    //   旋转角度
    const spinAngle = radius * parameters.spin;
    //   分支角度
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    //   随机位置
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() > 0.5 ? 1 : -1);

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x
    positions[i3 + 1] = randomY; // y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z

    /**
     * Color
     */
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  meterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, meterial);
  scene.add(points);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .name("粒子数量")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .name("粒子大小")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .name("半径")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .name("分支")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("旋转")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .name("随机范围")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .name("随机强度")
  .onFinishChange(generateGalaxy);

gui
  .addColor(parameters, "insideColor")
  .name("内部颜色")
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameters, "outsideColor")
  .name("外部颜色")
  .onFinishChange(generateGalaxy);

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
