import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import resource from "vue-resource";

Vue.use(ElementUI);
Vue.use(resource);
Vue.config.productionTip = false;

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
