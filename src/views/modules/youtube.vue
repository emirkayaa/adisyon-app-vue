<template>
  <div class="youtube-dialog" v-if="false" v-show="yvisible">
    <div class="youtube-dialog-header">
      <el-button type="" @click="yvisible = false">Kapat</el-button>
    </div>
    <div class="youtube-dialog-content">
      <iframe
        class="col-11 col-sm-9 col-md-7 col-xl-5 youtube-iframe"
        src="https://www.youtube.com/embed/videoseries?list=PL3M5nvmU6xfdS1Q49Jd54iRM6qh8W9fck"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      yvisible: false,
    };
  },
  watch: {
    visible(val) {
      this.yvisible = val;
    },
    yvisible(val) {
      this.$emit("update:visible", val);
    },
  },
};
</script>

<style>
.youtube-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
.youtube-dialog-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.youtube-dialog-content {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.youtube-iframe {
  height: 350px;
  max-height: 90vh;
}
</style>
