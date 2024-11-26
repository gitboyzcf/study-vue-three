<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, onUnmounted } from "vue";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
let axesHelper = null;
let controls = null;
const init = () => {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 创建坐标辅助器
  /**
   * 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
   */
  axesHelper = new THREE.AxesHelper(5);

  // const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

  // 创建点
  const positionArray = new Float32Array([
    0,
    0,
    0, // 第一个点
    1,
    0,
    0, // 第二个点
    0,
    1,
    0, // 第三个点
  ]);
  const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
  // 创建缓冲几何
  const geometry = new THREE.BufferGeometry();
  // 放入点数据
  geometry.setAttribute("position", positionAttribute);

  // 例子
  // const geometry = new THREE.BufferGeometry();
  // const count = 500;
  // const positionArray = new Float32Array(count * 3 * 3);
  // for (let i = 0; i < count * 3 * 3; i++) {
  //   // 随机数
  //   positionArray[i] = (Math.random() - 0.5) * 4;
  // }
  // const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
  // geometry.setAttribute("position", positionAttribute);

  const material = new THREE.MeshBasicMaterial({
    color: "#037ac4",
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
};

// 解决不同帧率下的不同渲染问题
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  requestAnimationFrame(animate);
  // cube.rotation.x = elapsedTime;
  // cube.rotation.y = elapsedTime;
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
