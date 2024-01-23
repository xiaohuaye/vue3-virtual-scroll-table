import { createApp } from "vue";
import "./style/style.css";
import App from "./App.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);

app.mount("#app");
