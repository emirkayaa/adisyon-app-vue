<template>
  <div class="card p-4">
    <el-tabs tab-position="left" class="demo-tabs">
      <el-tab-pane label="Tablo">
        <label for="">Tablo adı:</label>
        <input type="text" class="form-control" v-model="table_name" placeholder="Tablo adı" />
      </el-tab-pane>
      <el-tab-pane label="Kolonlar">
        <label for="">Kolon Ekle</label>
        <el-select @change="kolonSecildi($event)" class="m-2" placeholder="Select" size="large">
          <el-option v-for="item in table_data.columns" :key="item.name" :label="item.display_name" :value="item.name" />
        </el-select>
        <div class="overflow-auto d-flex flex-row">
          <div
            class="border p-2 mx-1 d-flex flex-column"
            style="min-width: 220px; width: 220px"
            v-for="(clm, key) in column_settings"
            :key="key"
          >
            <h5>{{ table_data.columns[key].display_name }}:</h5>
            <div class="mx-1 d-flex justify-content-between w-100">
              <label class="text-nowrap">Tabloda Göster</label>
              <el-switch v-model="clm.visible" />
            </div>
            <div class="mx-1 d-flex justify-content-between w-100">
              <label class="text-nowrap">Ekle-düzenlede Göster</label>
              <el-switch v-model="clm.input_visible" />
            </div>
            <div class="mx-1 d-flex justify-content-between w-100">
              <label class="text-nowrap">Banla</label>
              <el-switch v-model="clm.banned" />
            </div>
            <div class="mx-1">
              <label class="text-nowrap">Sıralama</label>
              <el-select v-model="clm.sort" class="m-2" placeholder="Select" size="large">
                <el-option label="Boş" value="" />
                <el-option label="True" :value="true" />
                <el-option label="False" :value="false" />
              </el-select>
            </div>
            <div class="mx-1">
              <label class="text-nowrap">Filtreleme</label>
              <el-input v-model="clm.filters.type" placeholder="Filtre tipi (1,2)"></el-input>
              <el-input v-model="clm.filters.gui_type" placeholder="İnput tipi(string,number)"></el-input>
              <el-input v-model="clm.filters.filter" placeholder="Filtre değeri"></el-input>
            </div>
            <div class="mx-1">
              <label class="text-nowrap">Select</label>
              <el-select v-model="clm.select" class="m-2 text-nowrap" multiple placeholder="Select" size="large">
                <el-option label="Ekle" value="create" />
                <el-option label="Düzenle" value="edit" />
              </el-select>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Buttonlar">
        <div class="d-flex">
          <div v-for="(btn, key) in button_settings" :key="btn" class="border p-2" style="width: 250px">
            <h5>{{ key }}</h5>
            <div class="mx-1 d-flex justify-content-between w-100">
              <label class="text-nowrap">Göster</label>
              <el-switch v-model="btn.visible" />
            </div>
            <div class="mx-1 d-flex justify-content-between w-100">
              <label class="text-nowrap">Url: </label>
              <el-input v-model="btn.url" />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="d-flex mt-2">
    <button class="btn btn-success" @click="yenile()">Yenile</button>
  </div>
  <div v-if="tableState" class="card p-4 mt-2">
    <tableVue
      :table_name="table_name"
      :column_settings="column_settings"
      :button_settings="button_settings"
      @data="table_data = $event"
    ></tableVue>
  </div>
  <div class="card p-4 mt-2">
    <h5>column_settings</h5>
    <button class="btn btn-outline-primary" @click="copyTextToClipboard(JSON.stringify(column_settings))">Kopyala</button>
    <pre class="overflow-auto" style="max-height: 500px">
        <code class="language-json">
          {{ JSON.stringify(column_settings, null, 2) }}
        </code>
      </pre>
  </div>
  <div class="card p-4 mt-2">
    <h5>button_settings</h5>
    <button class="btn btn-outline-primary" @click="copyTextToClipboard(JSON.stringify(button_settings))">Kopyala</button>
    <pre>
        <code class="language-json">
          {{ JSON.stringify(button_settings, null, 2) }}
        </code>
      </pre>
  </div>
</template>

<script>
import tableVue from "@/angaryos/table.vue";
export default {
  components: {
    tableVue,
  },
  data() {
    return {
      table_data: {},
      columns: {},
      table_name: "cari_hesap",
      tableState: true,
      column_settings_state: true,
      column_settings: {},
      button_settings: {
        create: {
          visible: true,
          url: "",
        },
        edit: {
          visible: true,
          url: "",
        },
        delete: {
          visible: true,
          url: "",
        },
        detail: {
          visible: true,
          url: "",
        },
      },
    };
  },
  methods: {
    yenile() {
      this.tableState = false;
      setTimeout(() => {
        this.tableState = true;
      }, 100);
    },
    kolonSecildi(e) {
      this.column_settings_state = false;
      this.column_settings[e] = {
        visible: true,
        input_visible: true,
        banned: false,
        sort: null,
        filters: {
          type: null,
          gui_type: null,
          filter: null,
        },
      };
      setTimeout(() => {
        this.column_settings_state = true;
      }, 100);
    },
    copyTextToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
  },
};
</script>

<style></style>
