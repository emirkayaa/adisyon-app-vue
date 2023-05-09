<template>
  <div class="back-to-top">
    <div id="pagetop" class="p-2 py-0 rounded-circle" v-if="scY > 100" @click="toTop">
      <i class="bi bi-arrow-up-square-fill" style="font-size: 35px"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scTimer: 0,
      scY: 0,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("touchmove", this.handleScroll);
    window.onscroll = () => {
      this.handleScroll;
    };
  },
  methods: {
    handleScroll: function () {
      if (this.scTimer) return;
      this.scTimer = setTimeout(() => {
        //asd;
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    },
    toTop: function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style>
.back-to-top {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  border-radius: 100%;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: all 0.5s;
}

.back-to-top:hover {
  opacity: 1;
}
</style>
