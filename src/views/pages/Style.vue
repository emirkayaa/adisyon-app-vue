<template>
  <div></div>
</template>

<script>
export default {
  created() {
    //import("../../assets/bootstrap.css");
    import("../../assets/js/custom.js");
    import("../../assets/css/tooltip.css");
    import("../../assets/css/style.css");
    import("../../assets/css/App.vue.css");
    import("../../assets/css/Pages/HesapMakinesi.vue.css");
    import("../../assets/css/Pages/Login.vue.css");
  },
};
</script>

<style>
.yakinda {
  position: relative;
}
.light .yakinda::before {
  background: rgba(255, 255, 255, 0.7);
}
.dark .yakinda::before {
  background: rgba(0, 0, 0, 0.7);
}
.yakinda::before {
  content: "Yakında sizlerle";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-style: oblique;
  font-weight: 600;
  white-space: pre-wrap;
}
/** MENU BOYUTUNA GÖRE İÇERİK*/
@keyframes animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/**MENU BOYUTUNA GÖRE İÇERİK**/
.dropdown-menu {
  z-index: 5 !important;
}
.page-item.active .page-link {
  z-index: 0 !important;
}

.el-tabs__header {
  border-radius: var(--bs-border-radius) !important;
}
.modal {
  background: rgb(0, 0, 0, 0.3);
}

@media (max-width: 500px) {
  .card-body {
    padding: 35px 15px !important;
  }
}

.dropdown-item {
  white-space: pre-wrap !important;
  max-width: 300px !important;
}

*[disabled] {
  cursor: not-allowed !important;
}

@media screen and (max-width: 767px) {
  .mobil-ekran {
    position: fixed;
    z-index: 100;
    width: 100vw;
    top: 0px;
    height: 100vh;
    display: block;
  }
}

@media screen and (min-width: 767px) {
  .mobil-ekran {
    display: none !important;
  }
}

.form-control {
  min-height: 2.675rem !important;
  border-radius: 5px;
}

.input-group-prepend .input-group-text {
  border-radius: 5px 0 0 5px !important;
}

.input-group-append .input-group-text {
  border-radius: 0 7px 7px 0 !important;
}

.kdv_id,
.alis_kdv_orani,
.satis_kdv_orani {
  border-radius: 0 5px 5px 0 !important;
}

.ellipsis-3 {
  overflow: hidden;
  /* Verilen genişlikten (150px) artanı gizlemesini istiyoruz */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* kaç satırla sınırlayacağımızı yazıyoruz */
  -webkit-box-orient: vertical;
}

.ellipsis-1 {
  overflow: hidden;
  /* Verilen genişlikten (150px) artanı gizlemesini istiyoruz */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* kaç satırla sınırlayacağımızı yazıyoruz */
  -webkit-box-orient: vertical;
}

#offline {
  display: none;
}
.loading-class {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.loading-class img {
  height: 40px;
}
input:placeholder-shown {
  text-overflow: ellipsis !important;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
::-webkit-input-placeholder {
  text-align: left;
}

:-moz-placeholder {
  text-align: left;
}
</style>
