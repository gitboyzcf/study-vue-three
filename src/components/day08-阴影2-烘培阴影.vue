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

const debugObject = {
  color: "#fff",
};

const gui = new GUI();
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadowTexture = textureLoader.load("textures/bakedShadow.jpg");
const simpleShadowTexture = textureLoader.load("textures/simpleShadow.jpg");

/**
 * Lights
 * https://threejs.org/docs/index.html?q=mbi#api/zh/lights/AmbientLight
 * 注意：
 *  尽量少用灯光 、灯光的数量不要过多，否则会降低性能。
 *  只有平行光（DirectionalLight）、点光源（PointLight）和聚光灯（SpotLight）才可以添加阴影
 *  自Three.js版本144以来，在渲染器上停用阴影同时在灯光上投影可能会触发错误  你可以通过停用灯光上的阴影来解决这个问题
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // 颜色，强度
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4); // 颜色，强度
directionalLight.position.set(2, 2, -1); // 设置平行光发射位置
// 关闭阴影
directionalLight.castShadow = false;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 10;
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spot light 聚光灯======================================
const spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI * 0.3);
// 开启阴影
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Point light 点光源======================================
const pointLight = new THREE.PointLight(0xffffff, 0.4);
// 关闭阴影
pointLight.castShadow = false;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// 2. 允许物体投影
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
  // new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// 3. 接收阴影
plane.receiveShadow = true;

scene.add(sphere, plane);

// 创建简单阴影贴图
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadowTexture,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphereShadow);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);
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
  // 1. 开启阴影贴图（注意要在渲染之前）
  renderer.shadowMap.enabled = true;
  // 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);

  const controls = new OrbitControls(camera, canvas);
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

    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) * 2;

    // 修改阴影位置
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

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
