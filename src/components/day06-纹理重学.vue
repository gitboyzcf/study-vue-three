<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

/**
 * Textures
 */
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.src = "/textures/door/color.jpg";
// image.onload = () => {
//   // 图片加载完成时更新
//   texture.needsUpdate = true;
// };

// 使用加载器加载
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(
//   "/textures/door/color.jpg",
//   () => {
//     console.log("load");
//   },
//   () => {
//     console.log("progress");
//   },
//   () => {
//     console.log("error");
//   }
// );

// 使用单独的加载管理器
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loading start");
};
loadingManager.onLoad = () => {
  console.log("loading complete");
};
loadingManager.onProgress = () => {
  console.log("loading progress");
};
loadingManager.onError = () => {
  console.log("loading error");
};
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/minecraft.png");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

colorTexture.colorSpace = THREE.SRGBColorSpace;
// 当一个纹素覆盖大于一个像素时，贴图将如何采样。
// https://threejs.org/docs/index.html?q=text#api/zh/textures/Texture.magFilter
colorTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
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
    renderer.setSize(containerBoxW, window.innerHeight);
    camera.aspect = containerBoxW / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  resize();

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
