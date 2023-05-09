<template>
  <el-dialog v-model="dialogVisible" title="Dosya Yükle" draggable>
    <div class="row">
      <div class="col-12">
        <p style="word-break: break-word">
          Excel'deki verilerinizi tabloya yüklemek için şablon tasarıma göre düzenlenmesi gerekir. Örnek tasarım için
          "Şablon" indirebilirsiniz.
        </p>
      </div>
    </div>
    <el-upload class="upload-demo" @change="fileUpload($event)" drag aciton="/" accept=".xlsx, .xls">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text" style="word-break: break-word">Dosyaları sürükle bırak ya da <em>tıkla yükle</em></div>
    </el-upload>
    <div v-if="file.size" class="d-flex justify-content-between">
      <span>{{ file.name }} </span>
      <label for=""> {{ Number(file.size / 1024).toFixed(2) }} KB </label>
      <div class="progress-wrapper">
        <div id="progress-bar-file1" class="progress"></div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer d-flex justify-content-between">
        <a class="el-button el-button--primary is-plain" type="button" href="./test.xlsx" download
          >Şablon <el-icon><Download /></el-icon
        ></a>
        <div>
          <el-button @click="dialogVisible = false">Vazgeç</el-button>
          <el-button type="primary" @click="gonder()">Gönder</el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import * as XLSX from "../datas/xlsx.mjs";
import { UploadFilled, Download } from "@element-plus/icons-vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      dialogVisible: false,
      convertedJSON: "",
      file: {},
    };
  },
  props: {
    modelValue: Boolean,
    table_name: String,
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val;
    },
    dialogVisible() {
      this.$emit("update:modelValue", this.dialogVisible);
    },
  },
  methods: {
    fileUpload(event) {
      this.file = event;
      let selectedFile = event.raw;
      var fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        if (event.loaded <= this.file.size) {
          let percent = Math.round((event.loaded / this.file.size) * 100);
          document.getElementById("progress-bar-file1").style.width = percent + "%";
          document.getElementById("progress-bar-file1").innerHTML = percent + "%";
        }
        if (event.loaded == event.total) {
          document.getElementById("progress-bar-file1").style.width = "100%";
          document.getElementById("progress-bar-file1").innerHTML = "100%";
        }
        let binaryData = event.target.result;
        let workbook = XLSX.read(binaryData, { type: "binary" });
        let result = {};
        workbook.SheetNames.forEach((sheet) => {
          const data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
          if (data.length > 0) {
            result[sheet] = data;
          }
        });
        this.convertedJSON = JSON.stringify(result.Worksheet);
      };
    },
    gonder() {
      axios
        .post(this.getToken + "/dataImportExcel/" + this.table_name, {
          excel: this.convertedJSON,
        })
        .then(() => {})
        .catch((err) => {
          ElNotification({
            title: "Hata",
            message: err,
            type: "error",
            position: "top-right",
          });
        });
    },
  },
  components: {
    UploadFilled,
    Download,
  },
};
</script>

<style>
.progress-wrapper {
  width: 100%;
}
.progress-wrapper .progress {
  background-color: green;
  width: 0%;
  padding: 5px 0px 5px 0px;
  color: #fff;
}
</style>
