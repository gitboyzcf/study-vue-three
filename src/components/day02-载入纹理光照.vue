<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onMounted, onUnmounted } from "vue";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
let cube = null;
let axesHelper = null;
let controls = null;
const init = () => {
  camera = new THREE.PerspectiveCamera(
    60,
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

  // 场景贴图加载器
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("textures/sky_linekotsi_01_b_HDRI.hdr", (texture) => {
    // 将场景的背景设置为纹理
    scene.background = texture;
    // 将纹理设置为球形
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 将纹理设置为环境贴图
    scene.environment = texture;

    // 将材质添加镜面反射
    material.envMap = texture;
  });

  // 图片纹理加载器
  const texture = new THREE.TextureLoader().load(
    "textures/Teapot_Example_preview_GREY.jpg"
  );

  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(2, 1);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide, // 设置背面可见
    map: texture, // 设置纹理贴图
    reflectivity: 0.2, // 设置反射率
  });
  cube = new THREE.Mesh(geometry, material);

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
