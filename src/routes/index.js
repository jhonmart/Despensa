import Vue from "vue";
import VueRouter from "vue-router";

// import Home from "@/views/HomePage.vue";

Vue.use(VueRouter);

const Home = () =>
  import(/* webpackChunkName: "app-home" */ "@/views/HomePage/HomePage");
const NotFound = () =>
  import(
    /* webpackChunkName: "not-found" */ "@/views/NotFoundPage/NotFoundPage"
  );

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "*",
    name: "not found",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash
      };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(() => {});
};

export default router;
