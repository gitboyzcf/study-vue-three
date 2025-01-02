<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from 'vue';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
// 引入lil-gui库https://lil-gui.georgealways.com/
import GUI from "lil-gui";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const scene = new THREE.Scene();

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const debugObject = {
  color: "#00ff00",
};

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/3.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("fonts/gentilis_regular.typeface.json", (font) => {
  // 创建文字几何
  const textGeometry = new TextGeometry("Hello Three.js!", {
    font, // 字体对象
    size: 0.5, // 文字大小
    height: 0.2, // 文字厚度
    curveSegments: 5, // 曲线分段数
    bevelEnabled: true, // 是否开启斜角
    bevelThickness: 0.03, // 斜角厚度
    bevelSize: 0.02, // 斜角大小
    bevelOffset: 0, //斜角偏移量
    bevelSegments: 4, // 斜角分段数
  });

  // 使用边界进行居中
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.z - 0.03) / 2
  // );
  // 使用方法居中
  textGeometry.center();

  // 创建材质
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  // 创建物体对象
  const textMesh = new THREE.Mesh(textGeometry, material);
  // 添加到场景中
  scene.add(textMesh);

  const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  // 创建100个甜甜圈🍩
  for (let i = 0; i < 100; i++) {
    const dountMesh = new THREE.Mesh(dountGeometry, material);
    dountMesh.position.x = (Math.random() - 0.5) * 10;
    dountMesh.position.y = (Math.random() - 0.5) * 10;
    dountMesh.position.z = (Math.random() - 0.5) * 10;

    dountMesh.rotation.x = Math.random() * Math.PI;
    dountMesh.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    dountMesh.scale.set(scale, scale, scale);

    scene.add(dountMesh);
  }
});

const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh);
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
})
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
