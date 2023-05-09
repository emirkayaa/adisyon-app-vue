<template>
  <div v-loading="loading">
    <el-select v-if="isAdmin && false" @click="testMode" class="m-2" placeholder="Select" size="large">
      <el-option v-for="item in front_test_list" :key="item.value" :label="item.name" @click="setTest(item)" />
    </el-select>
    <template v-if="true"></template>
    <div v-else class="d-flex justify-content-end align-items-center mb-2" style="margin-top: -10px">
      <i
        v-tooltip="'Burada yaptığınız her değişiklik otomatik olarak taslağınıza kaydedilir.'"
        class="fs-5 text-info bi bi-clipboard-data me-3"
      ></i>
      <el-button type="primary" plain circle @click="lastRecord()" v-tooltip="'Taslak kaydını yapıştır'">
        <i class="bi bi-clipboard-check"></i>
      </el-button>
      <el-button type="primary" plain circle @click="beforeRecord()" v-tooltip="'Son kaydedilen verileri getir'">
        <i class="bi bi-layer-backward"></i>
      </el-button>
      <el-button type="danger" plain circle @click="clearRecord()" v-tooltip="'Temizle'">
        <i class="bi bi bi-trash2 cursor-pointer"></i>
      </el-button>
    </div>
    <template v-if="display == 'double'">
      <div class="" v-if="this.config.group.length != 0 && this.columns">
        <div class="row">
          <template v-for="gr in this.config.group" :key="gr">
            <template v-if="this.config.hideGroup[gr.id] == true"></template>
            <template v-else-if="gr.id == 'sofor'">
              <div class="col-12 col-md-6 mt-2">
                <div class="card p-4">
                  <div class="d-flex flex-column">
                    <template v-for="(sofor, key) in irsaliyeSoforColumns" :key="key">
                      <div class="d-flex align-items-end flex-wrap border-bottom pb-1">
                        <div>
                          <label
                            class="h4 text-danger m-0"
                            style="margin-top: 0px !important"
                            @click="irsaliyeMethods('sofor', 'delete', key)"
                          >
                            <i class="bi bi-x-circle"></i>
                          </label>
                        </div>
                        <div class="mx-2" style="width: 150px">
                          <label class="p-0 m-0">Soför ismi</label>
                          <el-input
                            v-model="sofor['isim']"
                            placeholder="Şoför ismi"
                            @keyup="irsaliyeMethods('sofor', 'setData')"
                          />
                        </div>
                        <div class="mx-2" style="width: 150px">
                          <label class="p-0 m-0">Şoför Soyisim</label>
                          <el-input
                            v-model="sofor['name']"
                            placeholder="Şoför soyisim"
                            @keyup="irsaliyeMethods('sofor', 'setData')"
                          />
                        </div>
                        <div class="mx-2" style="width: 150px">
                          <label class="p-0 m-0">Şoför TC No</label>
                          <el-input
                            v-model="sofor['tc']"
                            placeholder="Şoför TC No"
                            @keyup="irsaliyeMethods('sofor', 'setData')"
                          />
                        </div>
                      </div>
                    </template>
                    <div>
                      <button class="btn btn-primary btn-sm" @click="irsaliyeMethods('sofor', 'store')">
                        <i class="fa fa-plus"></i> Şoför Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="gr.id == 'plaka'">
              <div class="col-12 col-md-6 mt-2">
                <div class="card p-4">
                  <div class="d-flex flex-column">
                    <template v-for="(plaka, key) in irsaliyePlakaColumns" :key="key">
                      <div class="d-flex align-items-end flex-wrap border-bottom pb-1">
                        <div>
                          <label
                            class="h4 text-danger m-0"
                            style="margin-top: 0px !important"
                            @click="irsaliyeMethods('plaka', 'delete', key)"
                          >
                            <i class="bi bi-x-circle"></i>
                          </label>
                        </div>
                        <div class="mx-2" style="width: 150px">
                          <label class="p-0 m-0">Plaka</label>
                          <el-input
                            v-model="irsaliyePlakaColumns[key]"
                            placeholder="Plaka"
                            @keyup="irsaliyeMethods('plaka', 'setData')"
                          />
                        </div>
                      </div>
                    </template>
                    <div>
                      <button class="btn btn-primary btn-sm" @click="irsaliyeMethods('plaka', 'store')">
                        <i class="fa fa-plus"></i> Plaka Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="col-12 col-md-6 mt-2">
              <div class="card p-4">
                <h5>{{ gr.name }}</h5>
                <div class="row">
                  <template v-for="clm in columns" :key="clm.name">
                    <template
                      v-if="column_settings[clm.name]?.input_visible == false || !gr.items.includes(clm.name)"
                    ></template>

                    <div v-else class="col-12 col-xl-6 col-xxl-4">
                      <inputs
                        :column="clm"
                        :disabled="disabled[clm.name]"
                        :errors="errors[clm.name]"
                        :label="true"
                        :params="params"
                        v-model="params[clm.name]"
                        :table_name="this.table_name"
                        @change="onChange(clm.name)"
                        :column_settings="column_settings[clm.name]"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="card p-4">
        <div class="row">
          <template v-for="clm in columns" :key="clm.name">
            <template v-if="column_settings[clm.name]?.input_visible == false"></template>

            <div v-else class="col-12 col-sm-6 col-md-4 col-xl-3">
              <inputs
                :column="clm"
                :disabled="disabled[clm.name]"
                :errors="errors[clm.name]"
                :label="true"
                v-model="params[clm.name]"
                :params="params"
                :table_name="this.table_name"
                @change="onChange(clm.name)"
                :column_settings="column_settings[clm.name]"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="overflow-auto card p-4 mt-3">
        <div class="w-100">
          <h4>Fiş-Kalem Ekleme</h4>
        </div>
        <table class="table">
          <thead>
            <tr>
              <template v-for="(clm, key) in doubleColumns" :key="key">
                <template
                  v-if="
                    dbconfig[clm.name] == false ||
                    clm.name == 'diger_vergiler' ||
                    clm.name == 'otv_istisna_muafiyet_sebebi_id' ||
                    clm.name == 'tevkifat_kodlari_listesi_id'
                  "
                ></template>
                <template v-else-if="clm.name == 'vergiler_id'">
                  <th style="width: 150px; min-width: 150px">
                    Diğer vergiler
                    <label v-if="adminMode" style="font-size: 10px; font-weight: 200">{{ clm.name }} </label>
                  </th>
                </template>
                <th v-else style="width: 150px; min-width: 150px" :style="table_head_style[clm.name]">
                  <span v-if="clm.display_name[clm.display_name.length - 1] == '*'">
                    {{ clm.display_name.replace("*", "") }}</span
                  >
                  <span v-else> {{ clm.display_name }}</span>
                  <label
                    class="text-danger ms-1"
                    v-if="
                      second_config.column_settings[clm.name]?.['required'] == true ||
                      clm.display_name[clm.display_name.length - 1] == '*'
                    "
                    >*</label
                  >
                  <label v-if="adminMode" class="ms-2" style="font-size: 10px; font-weight: 200">{{ clm.name }} </label>
                </th>
              </template>
              <th style="width: 30px; min-width: 30px; max-width: 30px" class="text-nowrap px-0">Toplam</th>
              <th style="width: 20px; min-width: 20px; max-width: 20px" class="text-nowrap px-0">Kaldır</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dp, key) in doubleParams" :key="dp.name" class="trClass">
              <template v-for="clm in doubleColumns" :key="clm.name">
                <template
                  v-if="doubleColumnSettings?.[key]?.[clm.name]?.input_visible == false && dbconfig?.[clm.name] == false"
                ></template>
                <template
                  v-else-if="
                    clm.name == 'diger_vergiler' ||
                    clm.name == 'otv_istisna_muafiyet_sebebi_id' ||
                    clm.name == 'tevkifat_kodlari_listesi_id'
                  "
                ></template>
                <template
                  v-else-if="doubleColumnSettings?.[key]?.[clm.name]?.input_visible == false && dbconfig?.[clm.name] == true"
                >
                  <td></td>
                </template>

                <template v-else-if="clm.name == 'vergiler_id'">
                  <td class="p-1">
                    <el-button
                      @click="(dialogState = true), (digerVergilerKey = key)"
                      class="me-2"
                      size="large"
                      type="warning"
                      plain
                      >Vergi Ekle
                    </el-button>
                  </td>
                </template>
                <td v-else class="p-1">
                  <div class="me-2">
                    <inputs
                      :column="clm"
                      :disabled="doubleDisabled[key]?.[clm.name]"
                      :errors="doubleErrors[key]?.[clm.name]"
                      :label="false"
                      v-model="dp[clm.name]"
                      :table_name="this.second_config.table_name"
                      @change="onChangeDP(key, clm.name)"
                      @keyup="keyUpEvent($event)"
                      @keydown="keyDownEvent($event)"
                      :params="params"
                      @selectResult="selectResult[clm.name] = $event"
                      :column_settings="doubleColumnSettings?.[key]?.[clm.name]"
                    />
                  </div>
                </td>
              </template>
              <td>
                <el-dropdown>
                  <el-tag type="success">Toplamlar</el-tag>
                  <template #dropdown>
                    <div class="p-3">
                      <div class="fs-6 fw-bold">Toplamlar</div>
                      <el-divider class="mb-1 mt-1" />
                      <table>
                        <tr>
                          <td>Mal Hizmet Tutarı:</td>
                          <td class="fw-bold">
                            {{
                              formatter.format(dp["mal_hizmet_tutari"]) == "NaN"
                                ? "0,00"
                                : formatter.format(dp["mal_hizmet_tutari"])
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>KDV Tutarı:</td>
                          <td class="fw-bold">
                            {{ formatter.format(dp["kdv_tutari"]) == "NaN" ? "0,00" : formatter.format(dp["kdv_tutari"]) }}
                          </td>
                        </tr>
                        <tr>
                          <td>Vergili Tutar:</td>
                          <td class="fw-bold">
                            {{ formatter.format(dp["vergi_tutar"]) == "NaN" ? "0,00" : formatter.format(dp["vergi_tutar"]) }}
                          </td>
                        </tr>
                        <tr>
                          <td>Ödenecek Tutar:</td>
                          <td class="fw-bold">
                            {{
                              formatter.format(dp["odenecek_tutar"]) == "NaN"
                                ? "0,00"
                                : formatter.format(dp["odenecek_tutar"])
                            }}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </template>
                </el-dropdown>
              </td>
              <td class="p-1 h-100">
                <label class="d-flex align-items-center cursor-pointer deleteBtn" @click="onRemoveDP(key)">
                  <i class="bi bi-x-square text-danger h3 mb-0 pb-0"></i>
                </label>
              </td>
            </tr>
            <tr class="trClass">
              <td colspan="4">
                <button class="btn btn-primary w-100" @click="addDoubleParam()">
                  <i class="fa fa-plus"></i> Satır Ekle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-100 d-flex justify-content-end">
        <input type="text" id="sonEleman" style="opacity: 0" />
      </div>

      <div class="row">
        <div class="col-12 col-md-6 col-lg-7 col-xl-8">
          <div class="card p-4 mt-2">
            <div class="mb-3 d-flex justify-content-end">
              <inputs
                :column="columns['kayitli_notlar_id']"
                :disabled="disabled['kayitli_notlar_id']"
                :errors="errors['kayitli_notlar_id']"
                :label="true"
                v-model="params['kayitli_notlar_id']"
                :table_name="this.table_name"
                @change="onChange('kayitli_notlar_id')"
                @selectResult="(selectResult['kayitli_notlar_id'] = $event), onChange('kayitli_notlar_id', $event)"
                :column_settings="column_settings['kayitli_notlar_id']"
                :params="params"
              />
            </div>
            <el-input
              v-model="params['description']"
              show-word-limit
              maxlength="350"
              :rows="7"
              placeholder="Notunuzu buraya girebilirsiniz."
              type="textarea"
              clearable
              size="large"
            />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-5 col-xl-4">
          <div class="card p-4 mt-2">
            <div class="d-flex flex-column">
              <div v-for="(val, key) in doubleTotal" :key="key" class="fs-7">
                <template v-if="key == 'yazi'"
                  ><span class="text-success">{{ val }} </span>
                </template>
                <div v-else class="d-flex justify-content-between">
                  <p class="robotoMono">{{ display_name?.[key] }}:</p>
                  <p v-if="key == 'dovizli_tutar'" class="robotoMono h5 text-danger">{{ formatter.format(val) }}₺</p>
                  <p v-else class="robotoMono fs-6" style="font-weight: bold">
                    {{ formatter.format(val) }}
                    <span v-if="params['para_birimi_id'] == 1" style="font-weight: lighter; font-size: 14px"> ₺ </span>
                    <span v-else-if="params['para_birimi_id'] == 2" style="font-weight: lighter; font-size: 14px"> $ </span>
                    <span v-else-if="params['para_birimi_id'] == 3" style="font-weight: lighter; font-size: 14px"> € </span>
                    <span v-else-if="params['para_birimi_id'] == 5" style="font-weight: lighter; font-size: 14px"> ¥ </span>
                    <span v-else-if="params['para_birimi_id'] == 6" style="font-weight: lighter; font-size: 14px"> £ </span>
                    <span v-else style="font-weight: lighter; font-size: 14px"> - </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="display == 'page'">
      <el-row :gutter="20">
        <template v-for="clm in columns" :key="clm.name">
          <template v-if="column_settings[clm.name]?.input_visible == false"></template>
          <div v-else-if="column_settings[clm.name]?.filters != undefined" class="d-none">
            {{ (params[clm.name] = column_settings[clm.name].filters["filter"][0]) }}
          </div>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-else>
            <inputs
              :column="clm"
              :disabled="disabled[clm.name]"
              :errors="errors[clm.name]"
              :label="true"
              v-model="params[clm.name]"
              :table_name="this.table_name"
              @change="onChange(clm.name)"
              :params="params"
              :column_settings="column_settings[clm.name]"
            />
          </el-col>
        </template>
      </el-row>
    </template>
    <template v-else v-for="clm in columns" :key="clm.name">
      <div v-if="column_settings[clm.name]?.filters != undefined">
        <template>{{ (params[clm.name] = column_settings[clm.name].filters["filter"][0]) }}</template>
      </div>
      <template v-else-if="column_settings[clm.name]?.input_visible == false"></template>
      <inputs
        v-else
        :column="clm"
        :disabled="disabled[clm.name]"
        :errors="errors[clm.name]"
        :label="true"
        v-model="params[clm.name]"
        :table_name="this.table_name"
        @change="onChange(clm.name)"
        :column_settings="column_settings[clm.name]"
        :params="params"
      />
    </template>

    <div class="w-100 d-flex justify-content-between mt-3">
      <div>
        <el-popconfirm
          v-if="this.type == 'edit'"
          confirm-button-text="Evet"
          cancel-button-text="Hayır"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="Silmek istediğinize emin misiniz?"
          @confirm="deleteEvent()"
        >
          <template #reference>
            <el-button circle type="danger"><i class="bi bi-trash"></i></el-button>
          </template>
        </el-popconfirm>
      </div>
      <div v-if="adminMode" class="d-flex me-2">
        <el-input v-model="test_name" placeholder="Test ismi"></el-input>
        <el-button type="warning" @click="saveTest()"> Testi Kaydet </el-button>
      </div>
      <el-button type="primary" plain id="save-button" :loading="saveLoading" @click="save()"> Kaydet </el-button>
    </div>
    <div
      v-if="adminMode"
      class="d-flex w-100"
      :class="display == 'double' || display == 'page' ? 'flex-row' : ' flex-column'"
    >
      <Vue3JsonEditor v-model="params" :show-btns="false" class="w-100 mt-3" :expandedOnStart="false" />
      <Vue3JsonEditor v-model="doubleParams" :show-btns="false" class="w-100 mt-3" :expandedOnStart="false" />
    </div>
  </div>

  <el-dialog v-model="dialogState" draggable title="Diğer vergiler" width="300px">
    <div style="max-height: 60vh" class="overflow-auto pe-2">
      <div>
        <span>Vergi Ekle:</span>
        <inputs
          :column="doubleColumns['vergiler_id']"
          :disabled="doubleDisabled[digerVergilerKey]?.[doubleColumns['vergiler_id'].name]"
          :errors="doubleErrors[digerVergilerKey]?.[doubleColumns['vergiler_id'].name]"
          :label="false"
          v-model="doubleParams[digerVergilerKey][doubleColumns?.['vergiler_id'].name]"
          :table_name="this.second_config.table_name"
          @change="onChangeDP(digerVergilerKey, doubleColumns['vergiler_id'].name)"
          @keyup="keyUpEvent($event)"
          @keydown="keyDownEvent($event)"
          :params="params"
          @selectResult="selectResult[doubleColumns['vergiler_id'].name] = $event"
          :column_settings="doubleColumnSettings[digerVergilerKey][doubleColumns['vergiler_id'].name]"
        />
      </div>
      <div
        class="mt-2"
        v-if="doubleColumnSettings[digerVergilerKey]?.['otv_istisna_muafiyet_sebebi_id']?.input_visible == true"
      >
        <inputs
          :column="doubleColumns['otv_istisna_muafiyet_sebebi_id']"
          :disabled="doubleDisabled[digerVergilerKey]?.[doubleColumns['otv_istisna_muafiyet_sebebi_id'].name]"
          :errors="doubleErrors[digerVergilerKey]?.[doubleColumns['otv_istisna_muafiyet_sebebi_id'].name]"
          :label="true"
          v-model="doubleParams[digerVergilerKey][doubleColumns?.['otv_istisna_muafiyet_sebebi_id'].name]"
          :table_name="this.second_config.table_name"
          @change="onChangeDP(digerVergilerKey, doubleColumns['otv_istisna_muafiyet_sebebi_id'].name)"
          @keyup="keyUpEvent($event)"
          @keydown="keyDownEvent($event)"
          :params="params"
          @selectResult="selectResult[doubleColumns['otv_istisna_muafiyet_sebebi_id'].name] = $event"
          :column_settings="doubleColumnSettings[digerVergilerKey][doubleColumns['otv_istisna_muafiyet_sebebi_id'].name]"
        />
      </div>
      <div
        class="mt-2"
        v-if="doubleColumnSettings[digerVergilerKey]?.['tevkifat_kodlari_listesi_id']?.input_visible == true"
      >
        <inputs
          :column="doubleColumns['tevkifat_kodlari_listesi_id']"
          :disabled="doubleDisabled[digerVergilerKey]?.[doubleColumns['tevkifat_kodlari_listesi_id'].name]"
          :errors="doubleErrors[digerVergilerKey]?.[doubleColumns['tevkifat_kodlari_listesi_id'].name]"
          :label="true"
          v-model="doubleParams[digerVergilerKey][doubleColumns?.['tevkifat_kodlari_listesi_id'].name]"
          :table_name="this.second_config.table_name"
          @change="onChangeDP(digerVergilerKey, doubleColumns['tevkifat_kodlari_listesi_id'].name)"
          @keyup="keyUpEvent($event)"
          @keydown="keyDownEvent($event)"
          :params="params"
          @selectResult="selectResult[doubleColumns['tevkifat_kodlari_listesi_id'].name] = $event"
          :column_settings="doubleColumnSettings[digerVergilerKey][doubleColumns['tevkifat_kodlari_listesi_id'].name]"
        />
      </div>
      <template v-if="digerVergilerColumns[digerVergilerKey]?.length > 0">
        <div
          class="d-flex flex-column mt-2"
          style="min-width: 150px"
          v-for="(dvc, dvk) in digerVergilerColumns[digerVergilerKey]"
          :key="dvc"
        >
          <label class="m-0 p-0">{{ dvc.display }}:</label>
          <div class="d-flex justify-content-between align-items-center">
            <el-tag type="info" style="width: 40px; height: 40px; font-size: 16px">%</el-tag>

            <el-input
              size="large"
              v-model="dvc.oran"
              :params="params"
              v-mask="'######'"
              @change="onChangeDP(digerVergilerKey, dvc.name)"
              @keyup="keyUpEvent($event)"
              @keydown="keyDownEvent($event)"
              @selectResult="selectResult[dvc.name] = $event"
            />
            <label class="p-1 m-0 cursor-pointer" @click="onRemoveDV(digerVergilerKey, dvk)">
              <i class="bi bi-x-square text-danger h3"></i>
            </label>
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogState = false">Kapat</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import func from "./dual/methods.js";
import { components, props, data, computed, watch } from "./dual/dual.js";
import { mask } from "vue-the-mask";

export default {
  name: "dual",
  directives: { mask },
  components: components,
  props: props,
  data: data,
  computed: computed,
  watch: watch,
  mounted() {
    this.setConfig().then(() => {
      this.loadConfig();
    });
  },

  methods: func,
};
</script>

<style>
.trClass {
  border-bottom: 0px solid transparent !important;
}

.bi-x-square:hover::before {
  background-color: rgb(220, 53, 69);
  color: #fff;
}
</style>
