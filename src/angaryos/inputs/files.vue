<template>
  <div class="d-flex">
    <div>
      <div v-if="value.length > 0 && image == null">
        <div v-for="v in value" :key="v" class="">
          <div v-if="v != null" class="d-flex align-items-center">
            <div class="px-1">
              <el-button @click="deleteImage(v)" type="danger" class="px-2" size="large" :icon="Close"></el-button>
            </div>

            <div class="px-1">
              <el-image :src="getImages(v)" style="height: 40px; width: 40px" class="rounded">
                <template #placeholder>
                  <div class="image-slot">Yükleniyor<span class="dot">...</span></div>
                </template>
              </el-image>
            </div>
          </div>
        </div>
      </div>
      <div class="pe-1 d-flex" v-if="image != null">
        <div class="px-1">
          <el-button @click="deleteImage(v)" type="danger" class="px-2" size="large" :icon="Close"></el-button>
        </div>
        <el-image :src="image" style="height: 40px; width: 40px" class="rounded">
          <template #placeholder>
            <div class="image-slot">Yükleniyor<span class="dot">...</span></div>
          </template>
        </el-image>
      </div>
    </div>
    <my-upload
      field="img"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      :name="column.name"
      :ref="column.name"
      v-model="show"
      :width="300"
      :height="300"
      :params="params"
      :headers="headers"
      img-format="png"
      :noCircle="false"
      :noRotate="false"
      :langExt="lang"
    >
      dasfşlamdfkmadk
    </my-upload>
    <el-button @click="show = true" :type="image == null ? 'primary' : 'success'" style="width: 360px" size="large" plain>
      <span v-if="image == null">Dosya Seç</span>
      <span v-else>Dosya Seçildi</span>
    </el-button>
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload";
import { Close } from "@element-plus/icons-vue";
export default {
  props: ["column", "modelValue"],
  data() {
    return {
      value: [],
      image: null,
      Close,
      show: false,
      lang: {
        hint: "Tıklayabilir ya da resminizi sürükleyip bırakabilirsiniz.",
        loading: "Yükleniyor…",
        noSupported: "Maalesef tarayıcınız desteklemiyor.",
        success: "Yükleme Başarılı",
        fail: "Bir hata ile karşılaşıldı",
        preview: "Görüntüleme",
        btn: {
          off: "Vazgeç",
          close: "Kapat",
          back: "Geri",
          save: "Kaydet",
        },
        error: {
          onlyImg: "Sadece resim",
          outOfSize: "Dosya boyut limiti: ",
          lowestPx: "Dosya boyutu çok düşük.  ",
        },
      },
    };
  },
  mounted() {
    if (this.modelValue != undefined && this.modelValue != "") {
      this.value = JSON.parse(this.modelValue);
    }
  },
  methods: {
    getImages(img) {
      if (img == undefined) {
        return [];
      } else {
        return this.imgBaseUrl + "/" + img.destination_path + "m_" + img.file_name;
      }
    },
    deleteImage(img) {
      delete this.value.splice(this.value.indexOf(img), 1);
      this.$emit("update:modelValue", this.value);
    },
    cropSuccess(e) {
      this.image = e;
      this.$emit("update:modelValue", e);
    },
  },
  watch: {
    modelValue() {
      if (this.modelValue != null && this.modelValue[0] == "[") {
        this.value = JSON.parse(this.modelValue);
      }
      if (this.modelValue == null || this.modelValue == undefined) {
        this.image = null;
      }
    },
  },
  components: { myUpload },
};
</script>

<style>
.form-control:focus {
  box-shadow: none;
  border-color: var(--el-color-primary);
}
.vicp-hint {
  word-break: break-word;
}
.vicp-wrap {
  max-width: 95vw;
  height: min-content !important;
  padding-bottom: 70px !important;
}
.vicp-crop {
  display: flex;
  flex-wrap: wrap;
}
</style>
