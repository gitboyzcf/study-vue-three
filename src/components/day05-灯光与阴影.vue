<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";

// 目标:阴影的属性
// 灯光阴影
// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
// 3、设置光照投射阴影 directionalLight.castshadow= true;
// 4、设置物体投射阴影 sphere.castshadow =true;
// 5、设置物体接收阴影 plane.receiveshadow = true;

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
  axesHelper = new THREE.AxesHelper(5);
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true;

  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 注意：基础网格材质(MeshBasicMaterial)不受光照影响
  // 创建标准网格材质(MeshStandardMaterial)
  const material = new THREE.MeshStandardMaterial();
  cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true; // 开启阴影投射
  scene.add(cube);

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1;
  // 接收阴影
  plane.receiveShadow = true;
  scene.add(plane);

  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 添加环境光
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  // 开启阴影投射
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 设置阴影属性
  // 设置贴图阴影模糊度
  directionalLight.shadow.radius = 20;
  // 设置阴影贴图分辨率
  directionalLight.shadow.mapSize.set(4096, 4096);

  // 设置平行光相机投射的属性 
  // https://threejs.org/docs/index.html?q=ca#api/zh/cameras/OrthographicCamera.near
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;
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
