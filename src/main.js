import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

Vue.use(ElementUI);
Vue.config.productionTip = false;
// 设置请求基路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
// 请求头设置
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

Vue.prototype.$http = axios;

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else if (localStorage.getItem("token")) {
    next();
  } else {
    router.push("/login");
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
