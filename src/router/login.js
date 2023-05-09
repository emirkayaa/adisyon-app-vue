const login = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/pages/Login.vue"),
    meta: {
      title: "Giriş",
    },
  },

  {
    path: "/verification",
    name: "Verification",
    component: () => import("@/views/pages/Verification.vue"),
    meta: {
      title: "Doğrulama",
    },
  },
  {
    path: "/register",
    name: "Üye ol",
    component: () => import("@/views/pages/Register.vue"),
    meta: {
      title: "Kayıt ol",
    },
  },
];
export default login;
