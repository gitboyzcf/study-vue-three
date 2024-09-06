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
  //例如设置x轴放大3倍、y轴方向放大2倍、z轴方向不变
  cube.scale.set(3, 2, 1);
  //单独设置某个轴的缩放
  cube.scale.x = 3;

  //直接设置旋转属性，例如围绕x轴旋转90度
  cube.rotation.x = -Math.PI / 2;
  //围绕x轴旋转45度
  cube.rotation.set(-Math.PI / 4, 0, 0, "XZY");
  
  scene.add(cube);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
};

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
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
