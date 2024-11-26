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
const gui = new GUI({
  width: 300, // 宽度
  title: "非常不错的调试UI", // gui名称
  closeFolders: false, // 是否全部展开文件夹
});

// gui.close(); // 关闭后操作面板不可用
// gui.hide(); // 隐藏面板

// 按键关闭隐藏面板
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    gui.show(gui._hidden);
  }
});

// 创建文件夹
const geoFolder = gui.addFolder("立方体参数");
const btnFolder = gui.addFolder("操作按钮");

// geoFolder.add(geometry, "width").min(1).max(30).step(1).name("宽度");
geoFolder.add(mesh.position, "x").min(-3).max(3).step(0.01).name("X轴");
geoFolder.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Y轴");
geoFolder.add(mesh, "visible"); // 复选框 是否显示物体
geoFolder.add(material, "wireframe"); // 复选框 是否展示网格材质
// gui.addColor(material, "color")
geoFolder.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
}); // 材质颜色选择器

// 添加按钮
debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 });
};
btnFolder.add(debugObject, "spin").name("旋转");

// 添加分段数GUI（将wireframe选项✅上可看出效果）
debugObject.subdivision = 2;
geoFolder
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .name("细分网格")
  .onFinishChange(() => {
    // onFinishChange类似于js的防抖机制 多次只触发一次
    // 销毁旧的几何
    mesh.geometry.dispose();
    // 添加新的几何
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

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
});
</script>
<style scoped lang="scss">
#canvasId {
  // position: fixed;
  width: 100%;
  height: 100%;
}
</style>
