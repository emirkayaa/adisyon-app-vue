<template>
  <!-- Baş: Tablo body -->
  <tbody v-if="table_data" style="height: auto">
    <tr v-for="tr in table_data?.records" :key="tr.id" class="angaryos-table-tr sag-menu" :id="tr.id">
      <!-- Baş: Veriler -->
      <template v-for="td in table_data?.columns" :key="td">
        <template v-if="column_settings?.[td.name]?.['visible'] == false"></template>
        <template v-else-if="td.name == 'döviz_kuru'"></template>
        <td
          v-else
          class="angaryos-table-td"
          @click="tableRowClick(tr)"
          :style="table_data.table_info.name == 'cari_hesap' || 'personel_kartlari' ? 'cursor: pointer;' : ''"
          :class="[td.name, column_settings?.[td.name]?.['format']]"
        >
          <!--Tablo Satırları-->
          <div v-if="column_settings?.[td.name]?.['format'] == 'money'" class="text-end font-weight-bold">
            <el-tooltip
              :show-after="500"
              :content="formatter.format(tr[td.name]) == 'NaN' ? 0 : formatter.format(tr[td.name])"
              effect="tooltip-theme"
            >
              <label class="angaryos-table-label">{{
                formatter.format(tr[td.name]) == "NaN" ? "0,00" : formatter.format(tr[td.name])
              }}</label>
            </el-tooltip>
          </div>
          <div v-else-if="td.gui_type_name == 'date'" class="text-left font-weight-bold">
            <el-tooltip
              v-if="tr[td.name]"
              :show-after="500"
              :content="
                new Date(tr[td.name]).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              "
              effect="tooltip-theme"
            >
              <label class="angaryos-table-label">{{ dateFormatter.format(new Date(tr[td.name])) }}</label>
            </el-tooltip>
            <el-tooltip v-else :show-after="500" :content="tr[td.name]" effect="tooltip-theme">
              <label class="angaryos-table-label">{{ tr[td.name] }}</label>
            </el-tooltip>
          </div>
          <div v-else-if="td.name == 'para_birimi_id' || td.name == 'döviz_kuru'">
            <el-tooltip
              :show-after="500"
              :content="tr[td.name] == 'Türk Lirası ( ₺ )' ? tr[td.name] : tr[td.name] + ' ⇄ ' + tr['döviz_kuru']"
              effect="tooltip-theme"
            >
              <el-tag type="info" v-if="tr[td.name] == 'Türk Lirası ( ₺ )'">{{ tr[td.name] }}</el-tag>
              <el-tag type="warning " v-else
                >{{ tr[td.name] }} ⇄ <span class="text-danger">{{ tr["döviz_kuru"] }}₺</span>
              </el-tag>
            </el-tooltip>
          </div>
          <div v-else-if="column_settings?.[td.name]?.['format'] == 'tag'" class="text-end font-weight-bold">
            <el-tooltip
              v-if="tr[td.name] == 'Tahsil Edildi'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr[td.name]"
            >
              <label class="angaryos-table-label tagStyle"
                ><el-tag type="success">{{ tr[td.name] }}</el-tag></label
              >
            </el-tooltip>
            <el-tooltip
              v-else-if="tr[td.name] == 'Beklemede'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr[td.name]"
            >
              <label class="angaryos-table-label tagStyle"
                ><el-tag type="warning">{{ tr[td.name] }}</el-tag></label
              >
            </el-tooltip>
            <el-tooltip v-else-if="tr[td.name] == 'İcrada'" :show-after="500" effect="tooltip-theme" :content="tr[td.name]">
              <label class="angaryos-table-label tagStyle"
                ><el-tag type="danger">{{ tr[td.name] }}</el-tag></label
              >
            </el-tooltip>
            <el-tooltip
              v-else-if="tr[td.name] == 'Karşılıksız'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr[td.name]"
            >
              <label class="angaryos-table-label tagStyle"
                ><el-tag type="primary">{{ tr[td.name] }}</el-tag></label
              >
            </el-tooltip>
            <el-tooltip
              v-else-if="td.name == 'kdv_id' || td.name == 'alis_kdv_orani' || td.name == 'satis_kdv_orani'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr[td.name] ? '%' + tr[td.name] : '---'"
            >
              <label class="angaryos-table-label tagStyle"
                ><el-tag type="info">%{{ tr[td.name] }}</el-tag></label
              >
            </el-tooltip>
            <el-tooltip
              v-else-if="td.name == 'kobi_alinan_satilan'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr.kobi_alinan_satilan ? 'Satılan' : 'Alınan'"
            >
              <label class="angaryos-table-label tagStyle">
                <el-tag v-if="tr.kobi_alinan_satilan" type="success"> Satılan </el-tag>
                <el-tag v-else type="danger">Alınan</el-tag>
              </label>
            </el-tooltip>
            <el-tooltip
              v-else-if="td.name == 'tahsilat_tamamlandi'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr.tahsilat_tamamlandi ? 'Tahsilat Tamamlandı' : 'Tahsilat Yapılmadı'"
            >
              <label class="angaryos-table-label tagStyle">
                <el-tag v-if="tr.tahsilat_tamamlandi" type="success">Tahsilat Tamamlandı</el-tag>
                <el-tag v-else type="danger">Tahsilat Yapılmadı</el-tag>
              </label>
            </el-tooltip>
            <el-tooltip
              v-else-if="td.name == 'kdv_dahil_buton'"
              :show-after="500"
              effect="tooltip-theme"
              :content="tr.kdv_dahil_buton ? 'KDV Dahil' : 'KDV Hariç'"
            >
              <label class="angaryos-table-label tagStyle">
                <el-tag v-if="tr.kdv_dahil_buton" type="success">KDV Dahil</el-tag>
                <el-tag v-else type="danger">KDV Hariç</el-tag>
              </label>
            </el-tooltip>
            <el-tooltip v-else :show-after="500" effect="tooltip-theme" :content="tr[td.name] ? td[td.name] : '---'">
              <label class="angaryos-table-label tagStyle">
                <el-tag v-if="tr[td.name]" type="info">{{ tr[td.name] }}</el-tag>
                <el-tag v-else type="info">---</el-tag>
              </label>
            </el-tooltip>
          </div>
          <div v-else-if="column_settings?.[td.name]?.['format'] == 'image'" class="text-center imgHover">
            <!-- {{ JSON.parse(tr.images)[0].disk }} -->
            <el-image :src="getImages(tr.images ? tr.images : tr.image)" class="rounded" fit="cover" loading="lazy" />
          </div>
          <div v-else>
            <el-tooltip :show-after="500" :content="tr[td.name]" effect="tooltip-theme">
              <label class="angaryos-table-label">{{ tr[td.name] }}</label>
            </el-tooltip>
          </div>
        </td>
      </template>
      <!--- Son: Veriler -->
      <!--- Baş: Kalem -->

      <td
        v-if="table_settings?.right_button != false"
        class="angaryos-table-sticky-right p-auto m-0 d-flex align-items-center justify-content-end h-100"
      >
        <div class="position-relative">
          <tabletr
            :column_settings="this.column_settings"
            :table_name="this.table_data.table_info.name"
            :menuId="tr.id"
            :button_settings="this.button_settings"
          ></tabletr>
        </div>
        <div>
          <template v-for="m in modules" :key="m">
            <template
              v-if="modulesState[m.name]?.if == '>' && tr[modulesState[m.name]?.column] > modulesState[m.name]?.value"
            ></template>
            <template
              v-else-if="modulesState[m.name]?.if == '<' && tr[modulesState[m.name]?.column] < modulesState[m.name]?.value"
            ></template>
            <template
              v-else-if="
                modulesState[m.name]?.if == '==' && tr[modulesState[m.name]?.column] == tr[modulesState[m.name]?.value]
              "
            ></template>
            <template
              v-else-if="
                modulesState[m.name]?.if == '!=' && tr[modulesState[m.name]?.column] != tr[modulesState[m.name]?.value]
              "
            ></template>
            <template
              v-else-if="modulesState[m.name]?.if == '<=' && tr[modulesState[m.name]?.column] <= modulesState[m.name]?.value"
            ></template>
            <template
              v-else-if="modulesState[m.name]?.if == '>=' && tr[modulesState[m.name]?.column] >= modulesState[m.name]?.value"
            ></template>

            <template v-else>
              <el-button
                v-if="m.display_name == 'Taksit'"
                type="info"
                class="mx-1"
                plain
                v-tooltip="tr['kobi_taksit'] + '. ' + m.display_name"
                @click="triggerModules(m, tr.id)"
              >
                <!-- {{ tr["kobi_taksit"] }}.&nbsp;{{ m.display_name }} -->
                <el-icon>
                  <Coin />
                </el-icon>
              </el-button>
              <el-button v-else type="info" class="mx-1" plain v-tooltip="m.display_name" @click="triggerModules(m, tr.id)">
                <!-- {{ m.display_name }} -->
                <i v-if="m.display_name == 'Faturalaştır'" class="bi bi-receipt-cutoff"></i>
                <i v-else-if="m.display_name == 'Ödeme' || m.display_name == 'Tahsilat'" class="bi bi-wallet2"></i>
                <i v-else class="bi bi-file-earmark-text"></i>
              </el-button>
            </template>
          </template>
          <template v-if="button_settings?.['pdf']?.visible == true">
            <el-button
              @click="openFaturaPage(tr.id, tr.ettn)"
              v-tooltip="'Faturayı Görüntüle'"
              type="warning"
              plain
              class="cursor-pointer"
            >
              <i class="bi bi-file-earmark-richtext"></i>
            </el-button>
          </template>
          <template
            v-if="
              table_data.table_info.name == 'kobi_siparis' &&
              tr.kobi_kalan_tutar > 0 &&
              (tr.kobi_taksit_sayisi == 'Peşin' || tr.kobi_taksit_sayisi == 1 || tr.kobi_taksit_sayisi == 0)
            "
          >
            <el-button
              type="warningpş"
              class="mx-1"
              plain
              v-tooltip="'Ödeme'"
              @click="triggerModules({ name: 'kobiOdeme', display_name: 'Kobi Ödeme' }, tr.id)"
            >
              <!-- Ödeme -->
              <el-icon>
                <Money />
              </el-icon>
            </el-button>
          </template>
        </div>
        <div v-if="table_data.table_info.name == 'teklifler'">
          <el-button type="success" @click="teklifSayfasi(tr, 'page')" v-tooltip="'Teklif sayfanız'"
            ><i class="bi bi-file-arrow-up"></i
          ></el-button>
          <el-button type="warning" plain @click="teklifSayfasi(tr, 'copy')" class="ms-1" v-tooltip="'Kopyala'"
            ><i class="bi bi-clipboard-check"></i
          ></el-button>
        </div>
        <el-dropdown class="h-100 mx-1" @command="triggerPage">
          <el-button type="primary" plain>
            <i class="bi bi-pencil-square"></i>
          </el-button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="button_settings?.['detail']?.visible != false" :command="['detail', tr.id]">
                <i class="fi fi-rr-document"></i>Detay
              </el-dropdown-item>
              <!-- <el-dropdown-item
                v-if="table_data.table_info.name == 'kobi_siparis'"
                :command="['edit', tr.id]"
                :disabled="tr.kobi_odenmis_tutar != 0"
              >
                <i class="fi fi-rr-edit"></i>Düzenle
              </el-dropdown-item> -->
              <el-dropdown-item
                v-if="button_settings?.['edit']?.visible != false"
                :class="
                  (tr['kobi_odenmis_tutar'] > 0 && table_data.table_info.name == 'kobi_siparis') ||
                  (tr['tahsilat_tamamlandi'] == true && table_data.table_info.name == 'alis_fatura')
                    ? 'd-none'
                    : ''
                "
                :command="['edit', tr.id]"
              >
                <i class="fi fi-rr-edit"></i>Düzenle
              </el-dropdown-item>
              <el-dropdown-item v-if="button_settings?.['delete']?.visible != false" :command="['delete', tr.id]">
                <label class="text-danger m-0"><i class="fi fi-rr-trash"></i>Sil</label>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </td>

      <!--- Son: Kalem -->
    </tr>
    <!--- Son: Senet ödeme -->
  </tbody>
  <!-- Son: Tablo body -->
</template>

<script>
import { props, data, methods, components } from "../datas/table-body";
export default {
  props: props,
  data: data,
  methods: methods,
  components: components,
  mounted() {},
};
</script>

<style>
.angaryos-table-td {
  min-width: 120px;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  max-width: 200px !important;
  padding: 10px;
  vertical-align: center;
  border-color: transparent !important;
}

.angaryos-table-tr {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

.angaryos-table-label {
  font-size: 0.9rem;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  max-width: 100%;
  margin: 0 !important;
}

.tagStyle {
  display: grid;
  text-align: center;
}

.el-popper.is-tooltip-theme {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: black; /*var(--theme-color-1)*/
  color: white;
}

.el-popper.is-tooltip-theme .el-popper__arrow::before {
  background: black;
  right: 0;
  color: white;
}

.imgHover {
  width: 28px;
  position: relative;
}

.imgHover:hover {
  position: fixed;
  height: 250px;
  width: 250px;
  z-index: 1000;
}
</style>
