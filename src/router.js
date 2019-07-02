import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login.vue";
import Home from "./views/home.vue";
import Users from "./views/users.vue";
import Roles from "./views/roles.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users",
          component: Users
        },
        {
          path: "/roles",
          component: Roles
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});
