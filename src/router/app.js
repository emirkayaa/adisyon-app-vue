const app = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/content/dashboard.vue"),
    meta: {
      title: "Grafikler",
      parent: "yonetici",
    },
  },
  {
    path: "/raporlar",
    name: "raporlar",
    component: () => import("@/views/content/raporlar.vue"),
    meta: {
      title: "Raporlar",
      parent: "yonetici",
    },
  },

  {
    path: "/odeme",
    name: "odeme",

    meta: {
      title: "Ödeme",
      parent: "odeme",
    },
    children: [
      {
        path: "",
        component: () => import("@/views/odeme/paketler.vue"),
      },
    ],
  },
  {
    path: "/control-panel",
    name: "control-panel",

    meta: {
      title: "Panel",
      parent: "yonetici",
    },
    children: [
      {
        path: "qr-menu",
        component: () => import("@/views/content/yonetici/qr-menu.vue"),
      },

      {
        path: "urunler",
        component: () => import("@/views/content/yonetici/urunler.vue"),
      },
      {
        path: "entegrator",
        component: () => import("@/views/content/yonetici/entegrator.vue"),
      },
      {
        path: "youtube",
        component: () => import("@/views/content/yonetici/youtube.vue"),
      },
    ],
  },
  {
    path: "/qr-menu/",
    name: "QRMenu",

    meta: {
      title: "Menu",
      parent: "qr-menu",
    },
    children: [
      {
        path: "",
        component: () => import("@/views/qr-menu/home.vue"),
      },
      {
        path: "kategori",
        component: () => import("@/views/qr-menu/kategori.vue"),
      },
      {
        path: "yemek-listesi",
        component: () => import("@/views/qr-menu/yemek-listesi.vue"),
      },
      {
        path: "sepet",
        component: () => import("@/views/qr-menu/sepet.vue"),
      },
      {
        path: "siparisler",
        component: () => import("@/views/qr-menu/siparisler.vue"),
      },
      {
        path: "kurye",
        component: () => import("@/views/kurye/index.vue"),
      },
    ],
  },
  {
    path: "/kurye/",
    name: "Kurye",
    component: () => import("@/views/kurye/index.vue"),
    meta: {
      title: "Kurye",
      parent: "kurye",
    },
  },
  {
    path: "/panel",
    name: "panel",
    meta: {
      title: "Panel",
      parent: "panel",
    },

    children: [
      {
        path: "",
        component: () => import("@/views/content/tablet/index.vue"),
      },
      {
        path: "garson",
        component: () => import("@/views/content/tablet/garson.vue"),
      },
      {
        path: "paket",
        component: () => import("@/views/content/tablet/paket.vue"),
      },
      {
        path: "self-servis",
        component: () => import("@/views/content/tablet/self-servis.vue"),
      },
      {
        path: "mutfak",
        component: () => import("@/views/content/tablet/mutfak.vue"),
      },
      {
        path: "ozet",
        component: () => import("@/views/content/tablet/ozet.vue"),
      },
      {
        path: "siparis/:id",
        name: "siparisEkrani",
        component: () => import("@/views/content/tablet/siparis.vue"),
      },
    ],
  },
  {
    path: "/tanimlama",
    name: "tanimlama",
    meta: {
      title: "Tanımlamalar",
      parent: "yonetici",
    },

    children: [
      {
        path: "",
        component: () => import("@/views/content/tanimlama/index.vue"),
      },
      {
        path: "masa-bolge",
        component: () => import("@/views/content/tanimlama/masa-bolge.vue"),
      },
      {
        path: "menu-urun",
        component: () => import("@/views/content/tanimlama/menu-urun.vue"),
      },
      {
        path: "musteri",
        component: () => import("@/views/content/tanimlama/musteri.vue"),
      },
      {
        path: "urun-detay",
        component: () => import("@/views/content/tanimlama/urun-detay.vue"),
      },
      {
        path: "kuver-garsoniye",
        component: () => import("@/views/content/tanimlama/kuver-garsoniye.vue"),
      },
      {
        path: "mutfak",
        component: () => import("@/views/content/tanimlama/mutfak.vue"),
      },
    ],
  },
  {
    path: "/hesap",
    name: "hesap",
    meta: {
      title: "Hesap",
      parent: "yonetici",
    },

    children: [
      {
        path: "firma",
        component: () => import("@/views/hesap/firma.vue"),
      },
      {
        path: "cihazlar",
        component: () => import("@/views/hesap/cihazlar.vue"),
      },
      {
        path: "calisanlar",
        component: () => import("@/views/hesap/calisanlar.vue"),
      },
      {
        path: "profil",
        component: () => import("@/views/hesap/profil.vue"),
      },
      {
        path: "hesap",
        component: () => import("@/views/hesap/hesap.vue"),
      },
    ],
  },
];
export default app;
