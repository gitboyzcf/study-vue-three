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
  // const rgbeLoader = new RGBELoader();
  // rgbeLoader.load("textures/sky_linekotsi_01_b_HDRI.hdr", (texture) => {
  //   scene.background = texture;
  //   texture.mapping = THREE.EquirectangularReflectionMapping;
  //   scene.environment = texture;
  //   material.envMap = texture;
  // });

  const texture = new THREE.TextureLoader().load(
    "textures/Teapot_Example_preview_GREY.jpg"
  );

  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(2, 1);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    reflectivity: 0.2,
  });
  const cube = new THREE.Mesh(geometry, material);

  // 创建立方几何体
  const geometry2 = new THREE.BoxGeometry(40, 1, 1);
  const material2 = new THREE.MeshBasicMaterial({
    color: 0x1b71b4,
  });
  const cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.set(2, 1, 0);

  scene.add(cube);
  scene.add(cube2);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 创建线性场景雾
  scene.fog = new THREE.Fog(0xcccccc, 0.6, 40);
  // 创建指数场景雾  第二个参数越大 离相机越近
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.07 );
  scene.background = new THREE.Color(0xcccccc);
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
