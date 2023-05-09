<template>
  <div>
    <el-timeline>
        <el-timeline-item
        v-for="duy in getDuyuru"
        :key="duy"
        :color="duy.state ? 'rgb(255, 193, 7)' : ''"
        :timestamp="
          new Date(duy.start_time).toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        "
        placement="top"
      >
      <el-badge class="badgeNew" :value="duy.state ? 'Yeni' : ''">
        <el-card class="carding" @click="goPage(duy, JSON.parse(duy.bildirim_json))">
          <h4>{{ duy.title }}</h4>
          <p>{{ duy.description }}</p>
        </el-card>
      </el-badge>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDuyuru"]),
  },
  methods: {
    goPage(value, json) {
      if(json.table == 'teklifler') this.$router.push("/alis-satis-yonetimi/teklif?tab=first")
      else if(json.table == 'musteri_cek') this.$router.push("/finans-yonetimi/cek-senet/cek/musteri-cek?tab=first")
      else if(json.table == 'firma_cek') this.$router.push("/finans-yonetimi/cek-senet/cek/musteri-cek?tab=second")
      let params = {
        state: 0,
        column_set_id: this.getUserData?.auths?.tables["kobi_siparis"]?.edits[0],
      }
      if(value.state) {
          this.$services.update("bildirimler", value.id, params).then((res) => {
            console.log(res)
            if (res.status == 200) {
                this.getDuyuru()
              }
        });
      }
    }
  }
};
</script>

<style>
.badgeNew {
  display: block;
}
.badgeNew sup {
  margin-right: 48px !important;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
}
.badgeNew .el-badge__content {
  background-color: rgb(var(--bs-warning-rgb));
  color: #000
}
.carding:hover {
  transform: scale(1.01);
  border: 1px solid var(--theme-color-4);
  cursor: pointer;
}
</style>
