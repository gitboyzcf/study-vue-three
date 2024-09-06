<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
let cube = null;
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

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#037ac4" });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;
  // 设置相机位置
  camera.lookAt(0, 0, 0);
  // 将辅助器添加到场景中
  scene.add(axesHelper);

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  // 设置带阻尼，这将创建一种更自然的拖动体验
  controls.enableDamping = true;
  // 设置阻尼速度
  controls.dampingFactor = 0.05;
  // 设置自动旋转
  // controls.autoRotate = true;
};

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
});
</script>

<style lang="scss" scoped>
#canvasDom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100;
  height: 100%;
}
</style>
