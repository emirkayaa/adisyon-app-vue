<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <h4 style="display: inline-flex">
          {{ table_data?.table_info?.display_name }}
          <label v-if="adminMode" style="font-size: 12px; font-weight: 300" class="mt-2 ml-3"
            >{{ table_data?.table_info?.name }}
          </label>
        </h4>
      </div>
      <div v-if="info[table_name]" v-tooltip="info[table_name]">
        <i class="bi bi-info-circle text-info h5"></i>
      </div>
    </div>
    <el-collapse v-if="width <= 575" class="" v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Seçenekler" name="1">
        <div class="row my-2">
          <div class="col-12 col-sm-8">
            <div class="d-flex flex-wrap flex-column flex-sm-row">
              <!-- detaylı arama -->
              <div class="m-1" v-if="button_settings?.filter?.visible != false">
                <el-popover :visible="filterPopover" placement="bottom" width="min-content" class="">
                  <div class="row">
                    <div class="col-12">
                      <label class="mt-2 mb-1">Kolon:</label>
                      <el-select v-model="filter_column" clearable filterable placeholder="Seçiniz..." class="w-100">
                        <el-option
                          v-for="item in table_data?.columns"
                          :key="item.name"
                          :label="
                            item.display_name[item.display_name.length - 1] == '*'
                              ? item.display_name.substring(0, item.display_name.length - 1)
                              : item.display_name
                          "
                          :value="item.name"
                        />
                      </el-select>
                    </div>
                    <div class="col-12">
                      <label for="exampleFormControlSelect1" class="mt-2 mb-1">{{
                        table_data?.columns?.[filter_column]?.display_name
                      }}</label>
                      <div
                        v-if="
                          table_data?.columns?.[filter_column]?.gui_type_name == 'string' ||
                          table_data?.columns?.[filter_column]?.gui_type_name == 'phone'
                        "
                      >
                        <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz..." class="w-100">
                          <el-option label="İçinde ... geçen" value="1" />
                          <el-option label="... ile başlayan" value="2" />
                          <el-option label="... ile biten" value="3" />
                          <el-option label="Eşittir" value="4" />
                          <el-option label="Eşit Değildir" value="5" />
                          <el-option label="Boş Olanlar" value="100" />
                          <el-option label="Dolu Olanlar" value="101" />
                        </el-select>
                      </div>
                      <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'numeric'">
                        <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz..." class="w-100">
                          <el-option label="Eşittir" value="1" />
                          <el-option label="Eşit Değildir" value="2" />
                          <el-option label="Küçüktür" value="3" />
                          <el-option label="Büyüktür" value="4" />

                          <el-option label="Boş Olanlar" value="100" />
                          <el-option label="Dolu Olanlar" value="101" />
                        </el-select>
                      </div>
                      <div
                        v-else-if="
                          table_data?.columns?.[filter_column]?.gui_type_name == 'select' ||
                          table_data?.columns?.[filter_column]?.gui_type_name == 'select:static'
                        "
                      >
                        <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                          <el-option label="En az biri" value="1" />
                          <el-option label="Hepsi" value="2" />

                          <el-option label="Boş Olanlar" value="100" />
                          <el-option label="Dolu Olanlar" value="101" />
                        </el-select>
                      </div>
                      <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'datetime'">
                        <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                          <el-option label="Eşittir" value="1" />
                          <el-option label="Bundan Önce" value="2" />
                          <el-option label="Bundan Sonra" value="3" />
                          <el-option label="İki Tarih Arasında" value="4" />

                          <el-option label="Boş Olanlar" value="100" />
                          <el-option label="Dolu Olanlar" value="101" />
                        </el-select>
                      </div>
                      <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'date'">
                        <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                          <el-option label="Eşittir" value="1" />
                          <el-option label="Bundan Önce" value="2" />
                          <el-option label="Bundan Sonra" value="3" />
                          <el-option label="İki Tarih Arasında" value="4" />

                          <el-option label="Boş Olanlar" value="100" />
                          <el-option label="Dolu Olanlar" value="101" />
                        </el-select>
                      </div>
                      <template v-else>
                        <label class="mt-2 mb-1">Tip:</label>
                        <el-input disabled />
                      </template>
                    </div>
                    <div class="col-12">
                      <label class="mt-2 mb-1">Değer</label>
                      <inputs
                        className="mt-0"
                        v-if="filter_column != ''"
                        :column="table_data?.columns?.[filter_column]"
                        v-model="filter_value"
                        :label="false"
                        :table_name="table_data.table_info.name"
                      />

                      <template v-else>
                        <el-input disabled />
                      </template>
                    </div>
                    <div class="col-12">
                      <div class="d-flex mt-2">
                        <el-button type="warning" @click="filtre_temizle">Filtreleri temizle</el-button>
                        <el-button type="primary" @click="filtrele">Filtrele</el-button>
                      </div>
                    </div>
                    <div class="col-12 my-2">
                      <div v-for="(v, k) in showFilters" :key="k">
                        <el-tag @close="filtreSil(k)" closable class="my-2">{{ k }} → {{ v.filter }}</el-tag>
                      </div>
                    </div>
                  </div>
                  <template #reference>
                    <el-badge
                      :value="Object.keys(showFilters).length"
                      :hidden="Object.keys(showFilters).length <= 0"
                      type="warning"
                      class="filter-badge w-100"
                      :class="Object.keys(showFilters).length <= 0 ? '' : 'me-2'"
                    >
                      <el-button
                        class="m-0 w-100"
                        v-if="filterPopover == false"
                        @click="(filterPopover = !filterPopover), (visiblePopoper = false)"
                      >
                        <i class="bi bi-search me-1"></i> Detaylı Arama
                      </el-button>
                      <el-button
                        class="w-100 m-0"
                        type="danger"
                        v-else-if="filterPopover == true"
                        @click="filterPopover = !filterPopover"
                        ><i class="bi bi-x-circle me-1"></i> Kapat
                      </el-button>
                    </el-badge>
                  </template>
                </el-popover>
              </div>
              <!-- visible arama -->
              <div class="m-1" v-if="button_settings?.shows?.visible != false">
                <el-popover :visible="visiblePopoper" placement="bottom" :width="660" class="">
                  <div class="row visibleRow">
                    <div class="col-6">
                      <h5>Gizliler</h5>
                      <draggable
                        class="list-group overflow-auto h-100"
                        style="min-height: 50px; max-height: 400px"
                        :list="gizliList"
                        group="people"
                        @change="changeVisible()"
                        itemKey="name"
                      >
                        <template #item="{ element }">
                          <el-tag type="info" class="mb-1" style="cursor: move">
                            {{
                              element.name[element.name.length - 1] == "*"
                                ? element.name.substring(0, element.name.length - 1)
                                : element.name
                            }}
                          </el-tag>
                        </template>
                      </draggable>
                    </div>
                    <div class="col-6">
                      <h5>Gösterilenler</h5>
                      <draggable
                        class="list-group overflow-auto h-100"
                        style="min-height: 50px; max-height: 400px"
                        :list="gosterList"
                        group="people"
                        @change="changeVisible()"
                        itemKey="name"
                      >
                        <template #item="{ element }">
                          <el-tag type="info" class="mb-1" style="cursor: move">
                            {{
                              element.name[element.name.length - 1] == "*"
                                ? element.name.substring(0, element.name.length - 1)
                                : element.name
                            }}
                          </el-tag>
                        </template>
                      </draggable>
                    </div>
                  </div>
                  <template #reference>
                    <el-button
                      class="w-100 m-0"
                      v-if="visiblePopoper == false && button_settings?.filter?.shows != false"
                      @click="(visiblePopoper = !visiblePopoper), (filterPopover = false), this.getShowHide()"
                    >
                      <i class="bi bi-eye-slash me-1"></i> Gizle/Göster
                    </el-button>
                    <el-button class="w-100 m-0" type="danger" v-else @click="visiblePopoper = !visiblePopoper"
                      ><i class="bi bi-x-circle me-1"></i> Kapat
                    </el-button>
                  </template>
                </el-popover>
              </div>
              <!-- Limitleme -->
              <div class="m-1">
                <el-dropdown trigger="click" class="w-100">
                  <el-button type="default" class="w-100 m-0">
                    <!-- <i class="bi bi-file-binary"></i> -->
                    {{ Params.limit }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="changeLimit(5)">5</el-dropdown-item>
                      <el-dropdown-item @click="changeLimit(10)">10</el-dropdown-item>
                      <el-dropdown-item @click="changeLimit(25)">25</el-dropdown-item>
                      <el-dropdown-item @click="changeLimit(50)">50</el-dropdown-item>
                      <el-dropdown-item @click="changeLimit(100)">100</el-dropdown-item>
                      <el-dropdown-item @click="changeLimit(200)">200</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <!-- Çıktı Al -->
              <div class="m-1" v-if="button_settings?.print?.visible != false">
                <el-dropdown trigger="click" class="w-100">
                  <el-button type="default" class="w-100 m-0">
                    <i class="bi bi-file-earmark-arrow-down me-2" style="font-size: 16px"></i>Çıktı Al<el-icon
                      class="el-icon--right"
                      ><arrow-down
                    /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <!--   -->
                      <el-dropdown-item @click="report('csv')"><i class="bi bi-filetype-csv h2"></i></el-dropdown-item>
                      <el-dropdown-item @click="report('xlsx')"><i class="bi bi-filetype-xlsx h2"></i></el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <!-- Upload  -->
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="d-flex flex-wrap flex-column flex-sm-row justify-content-end">
              <div class="m-1">
                <el-button
                  v-if="
                    button_settings?.import?.visible != false &&
                    (button_settings?.import?.url == '' ||
                      button_settings?.import?.url == null ||
                      button_settings?.import?.url == undefined)
                  "
                  class="w-100 m-0"
                  @click="importState = !importState"
                  >İçeri Aktar<i class="bi bi-file-earmark-arrow-up ms-2" style="font-size: 16px"></i
                ></el-button>
              </div>
              <div class="m-1">
                <el-button
                  v-if="
                    button_settings?.create?.visible != false &&
                    (button_settings?.create?.url == '' ||
                      button_settings?.create?.url == null ||
                      button_settings?.create?.url == undefined)
                  "
                  class="w-100 m-0"
                  type="primary"
                  @click="createTrigger()"
                >
                  Ekle<i class="bi bi-file-earmark-plus ms-2" style="font-size: 16px"></i>
                </el-button>
                <el-button
                  v-else-if="button_settings?.create?.visible != false && button_settings?.create?.url != ''"
                  type="primary"
                  class="m-0 w-100"
                  @click="createTrigger()"
                >
                  Ekle<i class="bi bi-file-earmark-plus ms-2" style="font-size: 16px"></i>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-else class="row my-2">
      <div class="col-12 col-sm-8">
        <div class="d-flex flex-wrap flex-column flex-sm-row">
          <!-- detaylı arama -->
          <div class="m-1" v-if="button_settings?.filter?.visible != false">
            <el-popover :visible="filterPopover" placement="bottom" width="min-content" class="">
              <div class="row">
                <div class="col-12">
                  <label class="mt-2 mb-1">Kolon:</label>
                  <el-select v-model="filter_column" clearable filterable placeholder="Seçiniz..." class="w-100">
                    <el-option
                      v-for="item in table_data?.columns"
                      :key="item.name"
                      :label="
                        item.display_name[item.display_name.length - 1] == '*'
                          ? item.display_name.substring(0, item.display_name.length - 1)
                          : item.display_name
                      "
                      :value="item.name"
                    />
                  </el-select>
                </div>
                <div class="col-12">
                  <label for="exampleFormControlSelect1" class="mt-2 mb-1">{{
                    table_data?.columns?.[filter_column]?.display_name
                  }}</label>
                  <div
                    v-if="
                      table_data?.columns?.[filter_column]?.gui_type_name == 'string' ||
                      table_data?.columns?.[filter_column]?.gui_type_name == 'phone'
                    "
                  >
                    <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz..." class="w-100">
                      <el-option label="İçinde ... geçen" value="1" />
                      <el-option label="... ile başlayan" value="2" />
                      <el-option label="... ile biten" value="3" />
                      <el-option label="Eşittir" value="4" />
                      <el-option label="Eşit Değildir" value="5" />
                      <el-option label="Boş Olanlar" value="100" />
                      <el-option label="Dolu Olanlar" value="101" />
                    </el-select>
                  </div>
                  <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'numeric'">
                    <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz..." class="w-100">
                      <el-option label="Eşittir" value="1" />
                      <el-option label="Eşit Değildir" value="2" />
                      <el-option label="Küçüktür" value="3" />
                      <el-option label="Büyüktür" value="4" />

                      <el-option label="Boş Olanlar" value="100" />
                      <el-option label="Dolu Olanlar" value="101" />
                    </el-select>
                  </div>
                  <div
                    v-else-if="
                      table_data?.columns?.[filter_column]?.gui_type_name == 'select' ||
                      table_data?.columns?.[filter_column]?.gui_type_name == 'select:static'
                    "
                  >
                    <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                      <el-option label="En az biri" value="1" />
                      <el-option label="Hepsi" value="2" />

                      <el-option label="Boş Olanlar" value="100" />
                      <el-option label="Dolu Olanlar" value="101" />
                    </el-select>
                  </div>
                  <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'datetime'">
                    <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                      <el-option label="Eşittir" value="1" />
                      <el-option label="Bundan Önce" value="2" />
                      <el-option label="Bundan Sonra" value="3" />
                      <el-option label="İki Tarih Arasında" value="4" />

                      <el-option label="Boş Olanlar" value="100" />
                      <el-option label="Dolu Olanlar" value="101" />
                    </el-select>
                  </div>
                  <div v-else-if="table_data?.columns?.[filter_column]?.gui_type_name == 'date'">
                    <el-select v-model="filter_type" clearable filterable placeholder="Seçiniz...">
                      <el-option label="Eşittir" value="1" />
                      <el-option label="Bundan Önce" value="2" />
                      <el-option label="Bundan Sonra" value="3" />
                      <el-option label="İki Tarih Arasında" value="4" />

                      <el-option label="Boş Olanlar" value="100" />
                      <el-option label="Dolu Olanlar" value="101" />
                    </el-select>
                  </div>
                  <template v-else>
                    <label class="mt-2 mb-1">Tip:</label>
                    <el-input disabled />
                  </template>
                </div>
                <div class="col-12">
                  <label class="mt-2 mb-1">Değer</label>
                  <inputs
                    className="mt-0"
                    v-if="filter_column != ''"
                    :column="table_data?.columns?.[filter_column]"
                    v-model="filter_value"
                    :label="false"
                    :table_name="table_data.table_info.name"
                  />

                  <template v-else>
                    <el-input disabled />
                  </template>
                </div>
                <div class="col-12">
                  <div class="d-flex mt-2">
                    <el-button type="warning" @click="filtre_temizle">Filtreleri temizle</el-button>
                    <el-button type="primary" @click="filtrele">Filtrele</el-button>
                  </div>
                </div>
                <div class="col-12 my-2">
                  <div v-for="(v, k) in showFilters" :key="k">
                    <el-tag @close="filtreSil(k)" closable class="my-2">{{ k }} → {{ v.filter }}</el-tag>
                  </div>
                </div>
              </div>
              <template #reference>
                <el-badge
                  :value="Object.keys(showFilters).length"
                  :hidden="Object.keys(showFilters).length <= 0"
                  type="warning"
                  class="filter-badge w-100"
                  :class="Object.keys(showFilters).length <= 0 ? '' : 'me-2'"
                >
                  <el-button
                    class="m-0 w-100"
                    v-if="filterPopover == false && button_settings?.filter?.visible != false"
                    @click="(filterPopover = !filterPopover), (visiblePopoper = false)"
                  >
                    <i class="bi bi-search me-1"></i> Detaylı Arama
                  </el-button>
                  <el-button
                    class="w-100 m-0"
                    type="danger"
                    v-else-if="filterPopover == true && button_settings?.filter?.visible != false"
                    @click="filterPopover = !filterPopover"
                    ><i class="bi bi-x-circle me-1"></i> Kapat
                  </el-button>
                </el-badge>
              </template>
            </el-popover>
          </div>
          <!-- visible arama -->
          <div class="m-1" v-if="button_settings?.shows?.visible != false">
            <el-popover :visible="visiblePopoper" placement="bottom" :width="660" class="">
              <div class="row visibleRow">
                <div class="col-6">
                  <h5>Gizliler</h5>
                  <draggable
                    class="list-group overflow-auto h-100"
                    style="min-height: 50px; max-height: 400px"
                    :list="gizliList"
                    group="people"
                    @change="changeVisible()"
                    itemKey="name"
                  >
                    <template #item="{ element }">
                      <el-tag type="info" class="mb-1" style="cursor: move">
                        {{
                          element.name[element.name.length - 1] == "*"
                            ? element.name.substring(0, element.name.length - 1)
                            : element.name
                        }}
                      </el-tag>
                    </template>
                  </draggable>
                </div>
                <div class="col-6">
                  <h5>Gösterilenler</h5>
                  <draggable
                    class="list-group overflow-auto h-100"
                    style="min-height: 50px; max-height: 400px"
                    :list="gosterList"
                    group="people"
                    @change="changeVisible()"
                    itemKey="name"
                  >
                    <template #item="{ element }">
                      <el-tag type="info" class="mb-1" style="cursor: move">
                        {{
                          element.name[element.name.length - 1] == "*"
                            ? element.name.substring(0, element.name.length - 1)
                            : element.name
                        }}
                      </el-tag>
                    </template>
                  </draggable>
                </div>
              </div>
              <template #reference>
                <el-button
                  class="w-100 m-0"
                  v-if="visiblePopoper == false"
                  @click="(visiblePopoper = !visiblePopoper), (filterPopover = false), this.getShowHide()"
                >
                  <i class="bi bi-eye-slash me-1"></i> Gizle/Göster
                </el-button>
                <el-button class="w-100 m-0" type="danger" v-else @click="visiblePopoper = !visiblePopoper"
                  ><i class="bi bi-x-circle me-1"></i> Kapat
                </el-button>
              </template>
            </el-popover>
          </div>
          <!-- Limitleme -->
          <div class="m-1">
            <el-dropdown trigger="click" class="w-100">
              <el-button type="default" class="w-100 m-0">
                <!-- <i class="bi bi-file-binary"></i> -->
                {{ Params.limit }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="changeLimit(5)">5</el-dropdown-item>
                  <el-dropdown-item @click="changeLimit(10)">10</el-dropdown-item>
                  <el-dropdown-item @click="changeLimit(25)">25</el-dropdown-item>
                  <el-dropdown-item @click="changeLimit(50)">50</el-dropdown-item>
                  <el-dropdown-item @click="changeLimit(100)">100</el-dropdown-item>
                  <el-dropdown-item @click="changeLimit(200)">200</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- Çıktı Al -->
          <div class="m-1" v-if="button_settings?.print?.visible != false">
            <el-dropdown trigger="click" class="w-100">
              <el-button type="default" class="w-100 m-0">
                <i class="bi bi-file-earmark-arrow-down me-2" style="font-size: 16px"></i>Çıktı Al<el-icon
                  class="el-icon--right"
                  ><arrow-down
                /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <!--   -->
                  <el-dropdown-item @click="report('csv')"><i class="bi bi-filetype-csv h2"></i></el-dropdown-item>
                  <el-dropdown-item @click="report('xlsx')"><i class="bi bi-filetype-xlsx h2"></i></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- Upload  -->
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="d-flex flex-wrap flex-column flex-sm-row justify-content-end">
          <div class="m-1">
            <el-button v-if="button_settings?.import?.visible == true" class="w-100 m-0" @click="importState = !importState"
              >İçeri Aktar<i class="bi bi-file-earmark-arrow-up ms-2" style="font-size: 16px"></i
            ></el-button>
          </div>
          <div class="m-1">
            <el-button
              v-if="
                button_settings?.create?.visible != false &&
                (button_settings?.create?.url == '' ||
                  button_settings?.create?.url == null ||
                  button_settings?.create?.url == undefined)
              "
              class="w-100 m-0"
              type="primary"
              @click="createTrigger()"
            >
              Ekle<i class="bi bi-file-earmark-plus ms-2" style="font-size: 16px"></i>
            </el-button>
            <el-button
              v-else-if="button_settings?.create?.visible != false && button_settings?.create?.url != ''"
              type="primary"
              class="m-0 w-100"
              @click="createTrigger()"
            >
              Ekle<i class="bi bi-file-earmark-plus ms-2" style="font-size: 16px"></i>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <import-model v-model="importState" :table_name="table_name" />
</template>

<script>
/**
 * @description:tablonun üst tarafı (tablo ismi, butonlar) bu konumdadır
 * @props [table_name,button_settings,column_settings,data,params],
 * @emits: params
 * @methods ,
 * @components [create]
 */

import { data, props, components, emits, methods, computed } from "./datas/header.js";
export default {
  data: data,
  props: props,
  emits: emits,
  components: components,
  methods: methods,
  computed: computed,
  mounted() {
    this.Params = this.modelValue;
    this.setShowVisible();
    this.width = window.innerWidth;
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  watch: {
    modelValue() {
      this.Params = this.modelValue;
      this.setShowVisible();
    },
  },
};
</script>

<style>
.infoIcon {
  cursor: pointer;
  font-size: 1.6rem;
  color: var(--theme-color-1);
}

.infoIcon:hover {
  color: var(--info);
  transition: all 0.3s ease-in-out;
}
.list-group-item {
  background-color: var(--foreground-color) !important;
}
@media only screen and (max-width: 600px) {
  .visibleRow {
    width: 450px;
  }
}
</style>
