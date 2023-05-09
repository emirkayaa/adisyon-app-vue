import { createRouter, createWebHistory } from "vue-router";
//createMemoryHistory
import login from "@/router/login";
import app from "./app";

let routes = [
  {
    path: "/bildirimler",
    name: "Bildirimler",
    component: () => import("@/views/pages/Bildirimler.vue"),
    meta: {
      title: "Bildirimler",
    },
  },

  {
    path: "/table-builder",
    name: "TabloBuilder",
    component: () => import("@/views/builder/table-builder.vue"),
    meta: {
      title: "table-builder",
    },
  },
  {
    path: "/dual-builder",
    name: "DualBuilder",
    component: () => import("@/views/builder/dual-builder.vue"),
    meta: {
      title: "dual-builder",
    },
  },
  {
    path: "/tab-builder",
    name: "TabBuilder",
    component: () => import("@/views/builder/tab-builder.vue"),
    meta: {
      title: "tab-builder",
    },
  },

  {
    path: "/ad",
    name: "Admin",
    component: () => import("@/views/admin/tables.vue"),
    meta: {
      title: "Admin Mode",
    },
  },
  {
    path: "/ad/:table_name",
    name: "Admintables",
    component: () => import("@/views/admin/list.vue"),
    meta: {
      title: "Admin Mode",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/pages/404.vue"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/building",
    name: "Yapiliyor",
    component: () => import("@/views/pages/Building.vue"),
    meta: {
      title: "Yapım Aşamasında",
    },
  },
];

routes = routes.concat(login);
routes = routes.concat(app);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//LİNK DEĞİŞTİRMEYEN ROUTE YAPISI
/*const router = createRouter({
  history: createMemoryHistory(),
  routes,
});*/
router.beforeEach((to, from, next) => {
  document.title = "Adisyon | " + to.meta.title;
  next();
});

export default router;
