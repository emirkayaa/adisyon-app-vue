<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <span class="h4"><i class="text-primary bi bi bi-person-vcard"></i> Müşteriler / Tedarikçiler</span>
      </div>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <label for="" class="h5 mb-0 me-2">Ara:</label>
          <el-input v-model="search" @keyup="Ara()" placeholder="Ara..." size="large"></el-input>
        </div>
        <div>
          <el-button type="primary" size="large" id="musteri-ekle-dialog-button" plain @click="musteriEkleVisible = true"
            >Müşteri Ekle</el-button
          >
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
              <span class="fs-5 ellipsis-1">{{ i.customer_name }} {{ i.customer_surname }} </span>
              <i class="bi bi-pen fs-5 cursor-pointer" @click="(musteri_duzenle_visible = true), (edit_data = i)"></i>
            </div>
            <span v-if="i.phone">{{ i.phone }}</span>
            <p v-if="i.address_detail">{{ i.address_detail }}</p>
            <div>
              <el-button type="info" link @click="(dialogVisible = true), (adres = i.address_detail)"
                >Adres Detayları</el-button
              >
            </div>
            <span v-if="i.supplier == true">Tedarikçi</span>
            <p>{{ i.address_id }}</p>
            <el-tag v-if="i.opening_price">Alacak: ₺{{ i.opening_price }}</el-tag>
          </div>
        </el-card>
      </div>
    </div>
    <musteri-ekle v-model:visible="musteriEkleVisible" @update:visible="$event == false ? getData() : ''"></musteri-ekle>
    <musteri-duzenle
      v-model:visible="musteri_duzenle_visible"
      @update:visible="$event == false ? getData() : ''"
      :edit_data="edit_data"
    ></musteri-duzenle>
    <el-dialog v-model="dialogVisible" title="Adres Detayları" width="50%">
      <iframe
        style="width: 100%; border: 0"
        height="450"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        :src="
          'https://www.google.com/maps/embed/v1/place?key=AIzaSyDzwhF836Nxj1QUf_0wFNhA4NCrIwxCAyE&q=' +
          adres.replace(' ', '%20')
        "
      >
      </iframe>
    </el-dialog>
  </div>
</template>

<script>
import MusteriDuzenle from "./modals/musteri-duzenle.vue";
import musteriEkle from "./modals/musteri-ekle.vue";
export default {
  components: { musteriEkle, MusteriDuzenle },
  data() {
    return {
      musteriEkleVisible: false,
      musteri_duzenle_visible: false,
      datas: {},
      list: {},
      loading: true,
      search: "",

      dialogVisible: false,
      adres: "",
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
      this.$services.list("customer", params).then((res) => {
        this.datas = res.data.data.records;
        this.list = res.data.data.records;
        this.loading = false;
      });
    },
    Ara() {
      this.list = [];
      for (const val of Object.values(this.datas)) {
        if (val.customer_name.toLowerCase().search(this.search.toLowerCase()) > -1) this.list.push(val);
      }
      console.log(this.list);
    },
  },
};
</script>

<style></style>
