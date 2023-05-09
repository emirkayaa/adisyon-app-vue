<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <span class="h4"><i class="text-primary mdi mdi-silverware-fork-knife"></i> Mutfaklar</span>
      </div>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <label for="" class="h5 mb-0 me-2">Ara:</label>
          <el-input v-model="search" @keyup="Ara()" placeholder="Ara..." size="large"></el-input>
        </div>
        <div>
          <el-button type="primary" id="mutfak-dialog-button" size="large" plain @click="mutfak_ekle_dialog = true">Mutfak Ekle</el-button>
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
            <div class="d-flex justify-content-between">
              <span class="fs-5 ellipsis-1">{{ i.kitchen_group }} </span>
              <i class="bi bi-pen fs-5 cursor-pointer" @click="(edit_id = i.id), (mutfak_duzenle_dialog = true)"></i>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <mutfak-ekle v-model:visible="mutfak_ekle_dialog" @update:visible="$event == false ? getData() : ''"></mutfak-ekle>
    <mutfak-duzenle
      v-model:visible="mutfak_duzenle_dialog"
      @update:visible="$event == false ? getData() : ''"
      :id="edit_id"
    ></mutfak-duzenle>
  </div>
</template>

<script>
import MutfakDuzenle from "./modals/mutfak-duzenle.vue";
import MutfakEkle from "./modals/mutfak-ekle.vue";
export default {
  components: { MutfakEkle, MutfakDuzenle },
  data() {
    return {
      mutfak_ekle_dialog: false,
      mutfak_duzenle_dialog: false,
      datas: {},
      list: {},
      loading: true,
      search: "",
      edit_id: null,
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
      this.$services.list("kitchen_group", params).then((res) => {
        this.datas = res.data.data.records;
        this.list = res.data.data.records;
        this.loading = false;
      });
    },
    Ara() {
      this.list = [];
      for (const val of Object.values(this.datas)) {
        if (val.kitchen_group.toLowerCase().search(this.search.toLowerCase()) > -1) this.list.push(val);
      }
      console.log(this.list);
    },
  },
};
</script>

<style></style>
