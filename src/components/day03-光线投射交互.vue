<template>
  <canvas id="canvasDom"></canvas>
</template>

<script setup>
import * as THREE from "three";
// 导入控制器  https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";

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
    spheres.push(sphere);
    scene.add(sphere);
  }

  // 创建光线投射Raycaster
  const raycaster = new THREE.Raycaster();
  // 创建鼠标位置向量
  const mouse = new THREE.Vector2();
  // 监听点击事件
  window.addEventListener("click", (event) => {
    // 计算鼠标位置 通过鼠标点击位置和当前相机的矩阵计算出是否碰到物体
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse.x, mouse.y);

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(spheres);

    // 判断是否点击住物体
    if (intersects.length > 0) {

      // 先判断是否被点击
      if(intersects[0].object._isSelect){
        // 如果被点击，则取消选中
        intersects[0].object.material.color.set(intersects[0].object._originalColor);
        intersects[0].object._isSelect = false;
        return;
      }

      // 添加是否被选中的标识
      intersects[0].object._isSelect = true;
      // 保存原始颜色 
      intersects[0].object._originalColor = intersects[0].object.material.color.getHex();
      // 更改点击到的物体颜色
      intersects[0].object.material.color.set(0xff0000);

    }
    console.log(intersects);
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
