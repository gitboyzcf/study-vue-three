import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
// Vuetify https://vuetifyjs.com/zh-Hans/
import 'font-awesome/css/font-awesome.min.css' 
import "vuetify/styles";
import { aliases, fa } from "vuetify/iconsets/fa";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount("#app");
