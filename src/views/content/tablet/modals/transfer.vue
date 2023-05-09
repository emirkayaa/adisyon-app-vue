<template>
    <el-drawer v-model="dialogVisible" :direction="direction" style="min-width: 300px;">
        <template #title>
            <div class="h4">Masa Seç</div>
        </template>
        <template #default>
            <div class="d-flex flex-column justify-content-center align-items-center">
                <el-card style="width: 200px;" class="text-center modal-card my-2">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">Masa 1</div>
                            <label>Kullanıcı Test</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                <i class="bi bi-arrow-down h1 mt-4 mb-2"></i>
                <div class="">
                    <el-card style="width: 200px;" class="text-center modal-card my-2">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">Masa Seç</div>
                            <label>Kullanıcı Test</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                <el-card style="width: 200px;" class="text-center modal-card my-2">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">Masa Seç</div>
                            <label>Kullanıcı Test</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                <el-card style="width: 200px;" class="text-center modal-card my-2">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column align-items-start">
                            <div class="h6">Masa Seç</div>
                            <label>Kullanıcı Test</label>
                        </div>
                    </div>
                    <div class="h4 my-2">125,00₺</div>
                </el-card>
                </div>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="dialogVisible = false">İptal</el-button>
                <el-button type="primary" @click="dialogVisible = false">Kaydet</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script>
export default {
    props: ["adisyonAktarVisible"],
    data() {
        return {
            dialogVisible: false,
        }
    },
    watch: {
        adisyonAktarVisible() {
            this.dialogVisible = this.adisyonAktarVisible
        },
        dialogVisible() {
            this.$emit("update:adisyonAktarVisible", this.dialogVisible)
        }
    }
}
</script>