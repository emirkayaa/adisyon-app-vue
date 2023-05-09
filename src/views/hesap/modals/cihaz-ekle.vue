<template>
  <el-dialog v-model="dialogVisible" title="Bölge Ekle" width="400px">
    <label for="">Bölge İsmi:</label>
    <el-input v-model="bolge" placeholder="Bölge ismi" id="bolge-ismi-input"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Vazgeç</el-button>
        <el-button type="primary" @click="dialogVisible = false" id="bolge-ekle-buton"> Ekle </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      dialogVisible: false,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  methods: {},
  components: {},
};
</script>

<style></style>
