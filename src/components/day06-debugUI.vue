<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入lil-gui库https://lil-gui.georgealways.com/
import GUI from "lil-gui";

const scene = new THREE.Scene();

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const debugObject = {
  color: "#00ff00",
};
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
camera.position.z = 5;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

// 创建一个GUI
const gui = new GUI();
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("X轴");
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Y轴");
gui.add(mesh, "visible"); // 复选框 是否显示物体
gui.add(material, "wireframe"); // 复选框 是否展示网格材质
// gui.addColor(material, "color")
gui.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
}); // 材质颜色选择器

const init = () => {
  const canvas = document.getElementById("canvasId");
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(info.w, info.h);
  renderer.render(scene, camera);

  const controls = new OrbitControls(camera, canvas);

  // 监听窗口变化
  window.addEventListener("resize", () => {
    // 重置渲染器宽高比
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 更新相机投影矩阵
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新投影矩阵
    camera.updateProjectionMatrix();
  });

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
</script>
<style scoped lang="scss">
#canvasId {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
