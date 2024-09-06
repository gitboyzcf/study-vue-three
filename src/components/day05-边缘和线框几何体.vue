<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onMounted } from "vue";

// 创建场景
const scene = new THREE.Scene();

let camera = null;
let renderer = null;
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

  // 加载模型
  // 注意：加载的3d模型 没有灯光是纯黑色 有光才会反射出颜色
  loader = new GLTFLoader();
  loader.load(
    "3d/tiny_city_1k.glb",
    function (gltf) {
      // scene.add(gltf.scene);
      gltf.scene.position.set(0, 1.5, 0);
      // 遍历物体
      gltf.scene.traverse((child) => {
        console.log(child);
        // 判断是否为物体
        if (child.isMesh) {
          // 获取几何体
          let geometry = child.geometry;
          // // 根据模型创建边缘集合体
          // let edgesGeometry = new THREE.EdgesGeometry(geometry);
          // 根据模型创建线框集合体
          let edgesGeometry = new THREE.WireframeGeometry(geometry);
          // 创建线段材质
          let edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
          // 创建线段物体
          let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

          // 更新建筑物世界转换矩阵
          child.updateWorldMatrix(true, true);
          // 设置线段物体的世界矩阵
          edges.matrix.copy(child.matrixWorld);
          // 将矩阵分解
          edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);

          // 将线段物体添加到场景中
          scene.add(edges);
        }
      });
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  // 加载hdr环境贴图
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("textures/sky_linekotsi_01_b_HDRI.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });
};

function animate() {
  controls.update();
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
