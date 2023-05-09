<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi bi-person-vcard"></i> Çalışanlar</h2>
      </div>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <label for="" class="h5 mb-0 me-2">Ara:</label>
          <el-input v-model="search" @keyup="Ara()" placeholder="Ara..." size="large"></el-input>
        </div>
        <div>
          <el-button type="primary" size="large" plain @click="calisan_ekle_visible = true">Çalışan Ekle</el-button>
        </div>
      </div>
    </el-card>
    <div class="row" v-if="loading">
      <div class="col-12 col-sm-6 col-md-4 col-xxl-3 mb-5" v-for="i in 10" :key="i">
        <el-skeleton :rows="3" animated />
      </div>
    </div>
    <div class="row" v-else>
      <div class="mb-3 col-12 col-sm-6 col-md-4 col-xxl-3" v-for="i in list" :key="i">
        <el-card>
          <div class="d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="text-color">{{ i.name_basic }} {{ i.surname }}</h4>
              <i class="bi bi-pen fs-5 cursor-pointer" @click="(calisan_duzenle_visible = true), (this.edit_data = i)"></i>
            </div>
            <span v-if="i.phone">{{ i.phone }}</span>
            <p v-if="i.email">{{ i.email }}</p>
            <span>{{ i.user_task_id }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <calisan-ekle v-model:visible="calisan_ekle_visible" @update:visible="$event == false ? getData() : ''"></calisan-ekle>
    <calisan-duzenle
      v-model:visible="calisan_duzenle_visible"
      :edit_data="this.edit_data"
      @update:visible="$event == false ? getData() : ''"
    ></calisan-duzenle>
  </div>
</template>

<script>
import CalisanDuzenle from "./modals/calisan-duzenle.vue";
import calisanEkle from "./modals/calisan-ekle.vue";
export default {
  components: { calisanEkle, CalisanDuzenle },
  data() {
    return {
      list: {},
      datas: {},
      calisan_ekle_visible: false,
      calisan_duzenle_visible: false,
      edit_data: {},
      loading: true,
      search: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const params = {
        limit: 2000,
        page: 1,
        filters: {},
        sorts: {},
      };
      this.$services.list("users", params).then((res) => {
        this.datas = res.data.data.records;
        this.list = res.data.data.records;
        this.loading = false;
      });
    },
    Ara() {
      this.list = [];
      /*for (const val of Object.values(this.datas)) {
        if (this.search != "" && val.name_basic.toLowerCase().search(this.search.toLowerCase()) > -1) this.list.push(val);
        if (this.search != "" && val.surname.toLowerCase().search(this.search.toLowerCase()) > -1) this.list.push(val);

        if (this.search != "" && val.email.toLowerCase().search(this.search.toLowerCase()) > -1) this.list.push(val);
      }*/
      this.list = this.datas.filter((item) => {
        if (
          item.name_basic.toLowerCase().search(this.search.toLowerCase()) > -1 ||
          item.surname.toLowerCase().search(this.search.toLowerCase()) > -1 ||
          item.email.toLowerCase().search(this.search.toLowerCase()) > -1 ||
          String(item.phone).toLowerCase().search(this.search.toLowerCase()) > -1
        ) {
          return item;
        }
      });
    },
  },
};
</script>

<style></style>
