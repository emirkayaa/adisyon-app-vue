<template>
    <el-drawer v-model="dialogVisible" :direction="direction" style="min-width: 300px;">
        <template #title>
            <div class="h4">Masa Değiştir</div>
        </template>
        <template #default>
            <div class="d-flex flex-column justify-content-center align-items-center">
                <el-card style="width: 200px;" class="text-center my-2">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">{{ datas.table_name ? datas.table_name : masaData.table_name }}</div>
                            <label>{{ datas.user_id ? datas.user_id : masaData.user_id }}</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                <i class="bi bi-arrow-down-up h1 my-4"></i>
                <el-input v-model="tableSearch" placeholder="Ara..."></el-input>
                <template v-for="t in tableData" :key="t">
                    <el-card v-if="masaData.zone_id == t.zone_id" style="width: 200px;" class="text-center modal-card my-2" 
                    :class="datas.id == t.id ? 'active-table' : ''" @click="selectTable(t)">
                    <div class="d-flex justify-content-between" >
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">{{ t.table_name }}</div>
                            <label>{{ t.user_id }}</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                </template>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="dialogVisible = false">İptal</el-button>
                <el-button type="primary" @click="masaDegistirme()">Kaydet</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script>
export default {
    props: ["masaDegistirVisible", "masaData"],
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            datas: [],
            tableSearch: [],
            tableList: [],
        }
    },
    methods: {
        async getTable() {
            const params = {
                page: 1,
                limit: 10000,
                filters: {
                    id: {
                        type: 2,
                        guiType: "numeric",
                        filter: [this.masaData.id],
                    },
                },
                sorts: {}
            }
            await this.$services.list("masa", params)
            .then(res => {
                this.tableData = res.data.data.records
                this.tableList = res.data.data.records
                console.log(this.tableList)
            })
        },
        selectTable(t) {
            this.datas = {
                table_name: t?.table_name,
                user_id: t?.user_id,
                id: t?.id,
            }
        },
        masaDegistirme() {
            this.dialogVisible = false
        },
    },
    watch: {
        masaDegistirVisible() {
            this.dialogVisible = this.masaDegistirVisible
            if (this.dialogVisible) {
                this.getTable();
                this.selectTable();
            }
        },
        dialogVisible() {
            this.$emit("update:masaDegistirVisible", this.dialogVisible)
        },
        tableSearch() {
            this.tableData = this.tableList?.filter((i) => i.indexOf(this.tableSearch.toLowerCase()) > -1);
            console.log("table", this.tableList)
        }
    }
}
</script>

<style>
.active-table {
    border: 1px solid red;
    transform: scale(1.05);
}
</style>