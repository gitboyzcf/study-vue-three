<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
let cube = null;
const init = () => {
  // 创建透视相机
  /**
   * PerspectiveCamera(fov, aspect, near, far)
   * fov: 视野角度
   * aspect: 宽高比
   * near: 近端面
   * far: 远端面
   */
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 创建渲染器并设置渲染器
  /**
   * WebGLRenderer(antialias)
   * parameters:该对象的属性定义了渲染器的行为。
   *  - canvas: 渲染到哪个画布
   */
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvasDom"),
  });
  // 设置渲染大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 创建几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建材质
  const material = new THREE.MeshBasicMaterial({ color: "#037ac4" });
  // 创建网格
  cube = new THREE.Mesh(geometry, material);
  // 将网格添加到场景中
  scene.add(cube);

  // 设置相机位置（设置z轴   z轴就是眼睛看到物体的位置）
  camera.position.z = 5;
};

// 持续渲染
function animate() {
  // Window api
  requestAnimationFrame(animate);
  // 旋转
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // 渲染
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
