<template>
  <div class="scroll-container">
    <canvas id="canvasId"></canvas>
    <section class="section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>
</template>
<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
// 引入lil-gui库https://lil-gui.georgealways.com/
import GUI from "lil-gui";

const info = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const gui = new GUI();
const scene = new THREE.Scene();

const parameters = {
  materialColor: "#ffeded",
};

/**
 * Objects
 */

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});
// Meshes
// 物体距离
const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const sectionMeshes = [mesh1, mesh2, mesh3];

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

gui.addColor(parameters, "materialColor").onChange((color) => {
  material.color.set(color);
  particlesMaterial.color.set(color);
});

/**
 * Particles 粒子效果
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.01,
  sizeAttenuation: true,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Light
 */

const direcionalLight = new THREE.DirectionalLight(parameters.materialColor, 1);
direcionalLight.position.set(1, 1, 0);
scene.add(direcionalLight);

/**
 * Group
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, info.w / info.h, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

let resize = null;
/**
 * Scroll
 */
let scroll = null;
let scrollY = window.scrollY;
let currentSection = 0;

/**
 * Cursor
 */
let cursorMove = null;
const cursor = {
  x: 0,
  y: 0,
};
const init = () => {
  const canvas = document.getElementById("canvasId");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true, // 渲染画布为透明
  });
  renderer.setSize(info.w, info.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
  resize = () => {
    info.w = window.innerWidth;
    info.h = window.innerHeight;
    renderer.setSize(info.w, info.h);
    camera.aspect = info.w / info.h;
    camera.updateProjectionMatrix();
  };
  resize();
  scroll = () => {
    scrollY = window.scrollY;
    // 缓动效果
    const newSection = Math.round(scrollY / info.h);
    if (newSection != currentSection) {
      currentSection = newSection;

      // 滚动到下一个页面
      window.scrollTo({ top: info.h * currentSection, behavior: "smooth" });

      // 添加动画
      gsap.to(sectionMeshes[currentSection].rotation, {
        duration: 1.5,
        x: "+=6",
        y: "+=3",
        z: "+=1.5",
        ease: "power2.inOut",
      });
    }
  };

  cursorMove = (e) => {
    cursor.x = e.clientX / info.w - 0.5;
    cursor.y = e.clientY / info.h - 0.5;
  };
  // 监听窗口变化
  window.addEventListener("resize", resize);
  // 监听滚动
  window.addEventListener("scroll", scroll);
  // 监听鼠标移动
  window.addEventListener("mousemove", cursorMove);

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate camera
    camera.position.y = (-scrollY / info.h) * objectsDistance;

    // 视差效果
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    cameraGroup.position.x +=
      (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // Animate meshes
    for (const mesh of sectionMeshes) {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    }
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
  window.removeEventListener("scroll", scroll); // 卸载
  window.removeEventListener("mousemove", cursorMove);
  gui.destroy();
});
</script>
<style lang="scss">
html,
body {
  overflow-y: auto;
}
#canvasId {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.scroll-container {
  background-color: #1e1a20;
  .section {
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    font-family: "Cabin", sans-serif;
    color: #ffeded;
    text-transform: uppercase;
    font-size: 7vmin;
    padding-left: 10%;
    padding-right: 10%;
  }

  section:nth-child(odd) {
    justify-content: flex-end;
  }
}
</style>
