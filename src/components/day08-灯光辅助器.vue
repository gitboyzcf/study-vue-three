<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
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
 * Lights
 * https://threejs.org/docs/index.html?q=mbi#api/zh/lights/AmbientLight
 * 注意：
 *  尽量少用灯光 、灯光的数量不要过多，否则会降低性能。
 */
// 环境光会均匀的照亮场景中的所有物体。（低能耗）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 颜色，强度
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

// 平行光（方向光）是沿着特定方向发射的光。 默认从上往下发射 （适中能耗）
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5); // 颜色，强度
directionalLight.position.set(1, 0.25, 0); // 设置平行光发射位置
scene.add(directionalLight);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);

// 半球光 颜色一从上往下发射，而颜色二则从下往上发射。 （注释环境光可看出效果）（低能耗）
const hemisphereLight = new THREE.HemisphereLight(
  0xff0000, // 天空颜色
  0x0000ff, // 地面颜色
  0.5 // 强度
);
scene.add(hemisphereLight);

// 点光源 从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。 （适中能耗）
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2); // 颜色 强度 衰减距离 衰减强度
pointLight.position.set(1, -0.5, 1); // 设置点光源发射位置
scene.add(pointLight);

// 平面光（矩形光）光源从一个矩形平面上均匀地发射光线。（高耗能）
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 2, 1); // 颜色 强度 宽度 长度
rectAreaLight.rotation.x = -Math.PI * 0.5;
rectAreaLight.position.set(0, 1.5, 0);
scene.add(rectAreaLight);

// 聚光灯 （手电筒🔦） （高耗能）
const spotLight = new THREE.SpotLight(0x78ff00, 4, 6, Math.PI * 0.1, 0.25, 0.5); // 颜色 强度 照射距离 角度 角度光衰弱 衰减强度
spotLight.position.set(0, 2, 3); // 设置聚光灯位置
scene.add(spotLight);

// 设置聚光灯照射目标（方向）
spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

/**
 * Helpers
 * https://threejs.org/docs/index.html#api/zh/helpers/HemisphereLightHelper
 */

//  创建一个虚拟的菱形网格 Mesh 的辅助对象来模拟 半球形光源
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

// 模拟平行光 辅助对象
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

// 模拟点光源 辅助对象
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// 模拟聚光灯 辅助对象
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

// 模拟矩形光 辅助对象
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const material = new THREE.MeshStandardMaterial({ color: debugObject.color });
material.roughness = 0.4;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);
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
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(info.w, info.h);
  renderer.render(scene, camera);

  const controls = new OrbitControls(camera, canvas);
  resize = () => {
    const containerBoxW =
      document.querySelector(".container-box").offsetWidth || window.innerWidth;
    // 重置渲染器宽高比
    renderer.setSize(containerBoxW, window.innerHeight);
    // 更新相机投影矩阵
    camera.aspect = containerBoxW / window.innerHeight;
    // 更新投影矩阵
    camera.updateProjectionMatrix();
  };
  resize();
  // 监听窗口变化
  window.addEventListener("resize", resize);

  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
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
