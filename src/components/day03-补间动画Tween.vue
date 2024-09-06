<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module";

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
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 10;
  camera.position.y = 2;
  // camera.position.x = 2;
  camera.lookAt(0, 0, 0);
  scene.add(axesHelper);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 创建三个球
  const color = [0xfff000, 0x00ff00, 0x0000ff];
  const spheres = [];
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color[i] });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = i * 3 - 3;
    sphere.position.y = 2;
    spheres.push(sphere);
    scene.add(sphere);
  }

  function animate(target, d = 1000) {
    // 创建补间动画 https://tweenjs.github.io/tween.js/README_zh-CN.html
    const tween = new TWEEN.Tween(target);
    // const tween2 = new TWEEN.Tween(target);

    // 行为配置
    tween.to({ y: -2 }, 1000);
    // 设置循环次数
    tween.repeat(Infinity);
    // 设置延迟时间
    tween.delay(d);
    // 设置循环往复
    tween.yoyo(true);
    // 设置运动曲线
    tween.easing(TWEEN.Easing.Quadratic.InOut);

    // tween2.to({ x: 2 }, 500);
    // // 追加补间动画
    // tween.chain(tween2);

    // 启动动画
    tween.start();
    // 暂停动画
    // tween.stop();

    // 生命周期钩子
    // tween.onStart(() => {
    //   console.log("开始");
    // });
    // tween.onUpdate(() => {
    //   console.log("更新");
    // });
    // tween.onComplete(() => {
    //   console.log("完成");
    // });
    // tween.onStop(() => {
    //   console.log("停止");
    // });
  }

  animate(spheres[0].position, 10);
  animate(spheres[1].position, 50);
  animate(spheres[2].position, 100);
};

function animate() {
  controls.update();
  // 持续更新补间动画
  TWEEN.update();
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
