<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-person-up"></i> Kuver / Garsoniye</h2>
      </div>
    </el-card>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6 col-md-12 col-lg-6 mb-3">
        <el-card>
          <div class="d-flex flex-column" id="kuver-ismi-input">
            <h3>Kuver Ayarları</h3>

            <el-divider class="mt-1 mb-4"></el-divider>
            <div v-if="false" class="d-flex justify-content-between align-items-center" v-yakinda>
              <span>Kuver ücreti siparişe otomatik eklensin</span>
              <el-switch v-model="kuver.state"></el-switch>
            </div>
            <div class="d-flex flex-column my-2">
              <label for="">Kuver Adı:</label>

              <el-input size="large" class="mb-2" v-model="kuver.kuver_name" placeholder="Garsoniye Adı"></el-input>
              <label for="">Kuver tipi:</label>
              <el-select size="large" v-model="kuver.kuver_type_id" placeholder="Kuver tipi" class="mb-2">
                <el-option label="Tutar" :value="1"></el-option>
              </el-select>
              <label for="">Kuver Tutarı:</label>
              <el-input class="mb-2" size="large" v-model="kuver.kuver_total" placeholder="Kuver Tutarı"></el-input>
            </div>
            <div class="d-flex justify-content-end">
              <el-button id="kuver-save-button" type="primary" plain @click="kuverKayit()"> Kaydet</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="col-12 col-sm-6 col-md-12 col-lg-6">
        <el-card>
          <div class="d-flex flex-column">
            <h3>Garsoniye Ayarları</h3>

            <el-divider class="mt-1 mb-4"></el-divider>
            <div v-if="false" class="d-flex justify-content-between align-items-center">
              <span>Garsoniye ücreti siparişe otomatik eklensin</span>
              <el-switch v-model="garsoniye.state"></el-switch>
            </div>
          </div>
          <div class="d-flex flex-column my-2">
            <label for="">Garsoniye Adı:</label>

            <el-input size="large" class="mb-2" v-model="garsoniye.waiter_name" placeholder="Garsoniye Adı"></el-input>
            <label for="">Garsoniye tipi:</label>
            <el-select size="large" v-model="garsoniye.waiter_type_id" placeholder="Garsoniye tipi" class="mb-2">
              <el-option label="Yüzde" :value="1"></el-option>
              <el-option label="Tutar" :value="2"></el-option>
            </el-select>

            <label for="">Garsoniye Yüzdesi/Tutarı:</label>
            <el-input
              class="mb-2"
              size="large"
              v-model="garsoniye.waiter_total"
              placeholder="Garsoniye Yüzdesi/Tutarı"
            ></el-input>
          </div>
          <div class="d-flex justify-content-end">
            <el-button type="primary" plain @click="garsoniyeKayit()">Kaydet</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      kuver: {
        kuver_name: "",
        kuver_total: "",
        kuver_type_id: "",
      },
      garsoniye: {
        waiter_type_id: 1,
      },
      garsoniye_type_cache: 0,
    };
  },
  mounted() {
    this.getKuverEdit();
    this.getGarsoniyeEdit();
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  methods: {
    getKuverEdit() {
      this.$services.edit("kuver_settings", this.getUserData.companies.kuver_settings_id).then((res) => {
        this.kuver = res.data.data.record;
        this.kuver.kuver_type_id = 1; //res.data.data.record.kuver_type_id[0].source;
      });
    },
    kuverKayit() {
      const params = {
        kuver_name: this.kuver.kuver_name,
        kuver_total: this.kuver.kuver_total,
        kuver_type_id: this.kuver.kuver_type_id,
      };
      params;
      this.$services.update("kuver_settings", this.getUserData.companies.kuver_settings_id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Kayıt başarıyla güncellendi",
            type: "success",
          });
        }
      });
    },
    getGarsoniyeEdit() {
      this.$services.edit("waiter_settings", this.getUserData.companies.waiter_settings_id).then((res) => {
        this.garsoniye = res.data.data.record;
        this.garsoniye.waiter_type_id = res.data.data.record.waiter_type_id[0].source;
        this.garsoniye_type_cache = res.data.data.record.waiter_type_id[0].source;
      });
    },
    garsoniyeKayit() {
      const params = {
        waiter_name: this.garsoniye.waiter_name,
        waiter_total: this.garsoniye.waiter_total,
        waiter_type_id: this.garsoniye.waiter_type_id,
      };
      this.$services.update("waiter_settings", this.getUserData.companies.waiter_settings_id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Kayıt başarıyla güncellendi",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style></style>
