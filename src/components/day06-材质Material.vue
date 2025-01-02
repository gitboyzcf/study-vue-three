<template>
  <canvas id="canvasId"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("textures/matcaps/1.png");
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

/**
 * Objects
 */
//  https://threejs.org/docs/index.html?q=m#api/zh/materials/MeshBasicMaterial
// 基础网格材质 不受光照的影响
// const material = new THREE.MeshBasicMaterial();
// 设置纹理
// material.map = doorColorTexture;
// 设置颜色
// material.color = new THREE.Color('red');
// material.color.set('red');
// 设置网格
// material.wireframe = true;
// 设置不透明度
// material.opacity = 0.5;
// material.transparent = true;
// 定义将要渲染哪一面 - 正面，背面或两者。 默认为THREE.FrontSide。其他选项有THREE.BackSide 和 THREE.DoubleSide。
// material.side = THREE.DoubleSide;

// 法线网格材质
// const material = new THREE.MeshNormalMaterial();
// 平面阴影
// material.flatShading = true;

// 材质捕捉网格材质 会进行反射 不受光照的影响
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// 深度网格材质  相机远近平面。白色最近，黑色最远。
// const material = new THREE.MeshDepthMaterial();

// Lambert网格材质 需要灯光  后续讲解灯光
// const material = new THREE.MeshLambertMaterial();

// Phong网格材质 镜面高光的光泽表面 需要灯光
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100; //高亮的程度
// material.specular = new THREE.Color(0xff0000); // 高光颜色

// 卡通网格材质 需要灯光
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// 标准网格材质
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.45;
material.roughness = 0.65;

// 创建球形物体
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

// 创建平面物体
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

// 创建圆环物体
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

torus.position.x = 1.5;

// 添加到场景
scene.add(sphere, plane, torus);

// Lights
const light = new THREE.PointLight(0xffffff, 6);
light.position.x = 0;
light.position.y = 2;
light.position.z = 2;
scene.add(light);

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, info.w / info.h, 1, 1000);
camera.position.z = 5;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

let resize;
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

  const clock = new THREE.Clock();
  function animate() {
    // https://threejs.org/docs/index.html?q=clock#api/zh/core/Clock.getElapsedTime
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    sphere.rotation.y = 0.5 * elapsedTime;
    torus.rotation.y = 0.5 * elapsedTime;
    plane.rotation.y = 0.5 * elapsedTime;
    sphere.rotation.x = 0.5 * elapsedTime;
    torus.rotation.x = 0.5 * elapsedTime;
    plane.rotation.x = 0.5 * elapsedTime;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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
