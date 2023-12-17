import { createRouter, createWebHistory, Router } from 'vue-router'
import Home from "../views/Home.vue";
import PS from "../views/PS.vue";
import { rehydrateStore } from "../helpers/store";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/ps', name: 'PS', component: PS },
]

const router: Router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from, next) => {
  await rehydrateStore();
  next();
})

export default router
