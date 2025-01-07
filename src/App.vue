<script setup>
import { shallowRef, defineAsyncComponent, ref } from "vue";
// import Day01 from "./components/day01.vue";
// import Day01 from "./components/day01-坐标辅助器和轨道控制器.vue";
// import Day01 from "./components/day01-物体位移和旋转缩放.vue";
// import Day01 from "./components/day01-监听窗口变化全屏.vue";
// import Day02 from "./components/day02-载入3d模型.vue";
// import Day02 from "./components/day02-载入纹理光照.vue";
// import Day02 from "./components/day02-场景雾.vue";
// import Day03 from "./components/day03-光线投射交互.vue";
// import Day03 from "./components/day03-补间动画Tween.vue";
// import Day03 from "./components/day03-接入GSAP动画库.vue";
// import Day04 from "./components/day04-包围盒.vue";
// import Day04 from "./components/day04-物体组.vue";
// import Day04 from "./components/day04-几何点线面.vue";
// import Day05 from "./components/day05-边缘和线框几何体.vue";
// import Day05 from "./components/day05-灯光与阴影.vue";
// import Day05 from "./components/day05-聚光灯.vue";
// import Day06 from "./components/day06-debugUI.vue";
// import Day06 from "./components/day06-纹理重学.vue";
// import Day06 from "./components/day06-材质Material.vue";
// import Day07 from "./components/day07-3dText.vue";
// import Day07 from "./components/day07-3dText -时钟.vue";

const tabBar = [
  {
    title: "简单示例",
    component: defineAsyncComponent(() => import("./components/day01.vue")),
  },
  {
    title: "坐标辅助器和轨道控制器",
    component: defineAsyncComponent(() =>
      import("./components/day01-坐标辅助器和轨道控制器.vue")
    ),
  },
  {
    title: "物体位移和旋转缩放",
    component: defineAsyncComponent(() =>
      import("./components/day01-物体位移和旋转缩放.vue")
    ),
  },
  {
    title: "监听窗口变化全屏",
    component: defineAsyncComponent(() =>
      import("./components/day01-监听窗口变化全屏.vue")
    ),
  },
  {
    title: "载入3d模型",
    component: defineAsyncComponent(() =>
      import("./components/day02-载入3d模型.vue")
    ),
  },
  {
    title: "载入纹理光照",
    component: defineAsyncComponent(() =>
      import("./components/day02-载入纹理光照.vue")
    ),
  },
  {
    title: "场景雾",
    component: defineAsyncComponent(() =>
      import("./components/day02-场景雾.vue")
    ),
  },
  {
    title: "光线投射交互",
    component: defineAsyncComponent(() =>
      import("./components/day03-光线投射交互.vue")
    ),
  },
  {
    title: "补间动画Tween",
    component: defineAsyncComponent(() =>
      import("./components/day03-补间动画Tween.vue")
    ),
  },
  {
    title: "接入GSAP动画库",
    component: defineAsyncComponent(() =>
      import("./components/day03-接入GSAP动画库.vue")
    ),
  },
  {
    title: "包围盒",
    component: defineAsyncComponent(() =>
      import("./components/day04-包围盒.vue")
    ),
  },
  {
    title: "物体组",
    component: defineAsyncComponent(() =>
      import("./components/day04-物体组.vue")
    ),
  },
  {
    title: "几何点线面",
    component: defineAsyncComponent(() =>
      import("./components/day04-几何点线面.vue")
    ),
  },
  {
    title: "边缘和线框几何体",
    component: defineAsyncComponent(() =>
      import("./components/day05-边缘和线框几何体.vue")
    ),
  },
  {
    title: "灯光与阴影",
    component: defineAsyncComponent(() =>
      import("./components/day05-灯光与阴影.vue")
    ),
  },
  {
    title: "聚光灯",
    component: defineAsyncComponent(() =>
      import("./components/day05-聚光灯.vue")
    ),
  },
  {
    title: "debugUI",
    component: defineAsyncComponent(() =>
      import("./components/day06-debugUI.vue")
    ),
  },
  {
    title: "纹理重学",
    component: defineAsyncComponent(() =>
      import("./components/day06-纹理重学.vue")
    ),
  },
  {
    title: "材质Material",
    component: defineAsyncComponent(() =>
      import("./components/day06-材质Material.vue")
    ),
  },
  {
    title: "3dText",
    component: defineAsyncComponent(() =>
      import("./components/day07-3dText.vue")
    ),
  },
  {
    title: "灯光",
    component: defineAsyncComponent(() =>
      import("./components/day08-灯光.vue")
    ),
  },
  {
    title: "灯光辅助器",
    component: defineAsyncComponent(() =>
      import("./components/day08-灯光辅助器.vue")
    ),
  },
  {
    title: "阴影",
    component: defineAsyncComponent(() =>
      import("./components/day08-阴影.vue")
    ),
  },
  {
    title: "阴影2-烘培阴影",
    component: defineAsyncComponent(() =>
      import("./components/day08-阴影2-烘培阴影.vue")
    ),
  },
  {
    title: "案例-鬼屋",
    component: defineAsyncComponent(() =>
      import("./components/day09-案例-鬼屋.vue")
    ),
  },
  {
    title: "粒子",
    component: defineAsyncComponent(() =>
      import("./components/day10-粒子.vue")
    ),
  },
  {
    title: "案例-银河",
    component: defineAsyncComponent(() =>
      import("./components/day10-案例-银河.vue")
    ),
  },
  {
    title: "滚动动画",
    component: defineAsyncComponent(() =>
      import("./components/day11-滚动动画.vue")
    ),
  },
];

const navSelect = shallowRef(tabBar[tabBar.length - 1]);
const comName = shallowRef(tabBar[tabBar.length - 1].component);
const toCom = (item) => {
  navSelect.value = item.id;
  comName.value = item.id.component;
};

const drawer = ref(false);
</script>

<template>
  <!-- <Day01 /> -->
  <!-- <Day02 /> -->
  <!-- <Day03 /> -->
  <!-- <Day04 /> -->
  <!-- <Day05 /> -->
  <!-- <Day06 /> -->
  <v-responsive class="border rounded">
    <v-app>
      <div style="position: fixed; top: 15px; left: 15px; z-index: 999">
        <v-btn color="primary" @click="drawer = !drawer">
          <v-icon icon="fa fa-list"></v-icon>
        </v-btn>
      </div>
      <v-navigation-drawer width="250" v-model="drawer" temporary>
        <v-list-item title="Hello three.js"></v-list-item>
        <v-divider></v-divider>
        <v-list @click:select="toCom">
          <v-list-item
            v-for="(item, i) in tabBar"
            link
            rounded="shaped"
            color="primary"
            :value="item"
            :title="item.title"
            :key="i"
            :active="item === navSelect"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <div class="container-box">
            <component :is="comName"></component>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style>
.v-container {
  padding: 0 !important;
}
</style>
