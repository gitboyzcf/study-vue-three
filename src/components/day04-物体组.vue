<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

  camera.position.z = 10;
  camera.position.y = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);

  // 创建球组
  const shapesGroup = new THREE.Group();
  scene.add(shapesGroup);
  // 创建三个球
  const color = [0xfff000, 0x00ff00, 0x0000ff];
  const spheres = [];
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color[i] });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = i * 3 - 3;
    spheres.push(sphere);
    // 加入球组
    shapesGroup.add(sphere);
  }

  // 创建立方体组
  const boxGroup = new THREE.Group();
  scene.add(boxGroup);

  const boxs = [];
  for (let i = 0; i < 3; i++) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: color[i] })
    );
    box.position.x = i * 3 - 3;
    boxs.push(box);
    // 加入立方体组
    boxGroup.add(box);
  }
  // 设置一组
  boxGroup.position.y = 2;


  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
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

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

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
