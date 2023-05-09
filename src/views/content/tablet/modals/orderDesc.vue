<template>
    <el-dialog v-model="dialogVisible" title="Sipariş Açıklaması" width="30%" align-center>
        <el-input
            v-model="adisyon.description"
            :autosize="{ minRows: 3, maxRows: 10 }"
            type="textarea"
            placeholder="Sipariş Notu"
            show-word-limit
            maxlength="100"
        />
        <template #footer>
            <div style="flex: auto">
                <el-button @click="dialogVisible = false">İptal</el-button>
                <el-button type="primary" @click="dialogVisible = false">Kaydet</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { Minus, Plus } from '@element-plus/icons-vue'
import { mapGetters } from 'vuex'
export default {
    props: ["siparisAciklamaVisible", "adisyonies"],
    data() {
        return {
            Minus,
            Plus,
            dialogVisible: false,
            adisyon: {},
        }
    },
    computed: {
        ...mapGetters(["getAdisyonData"])
    },
    methods: {
        buttonChange(val) {
            if(val==1) this.value++
            else if (val==2) this.value--
            if (this.value < 0 ) this.value = 0;
            if (this.value > 100) this.value = 100;
        },
    },
    watch: {
        siparisAciklamaVisible() {
            this.dialogVisible = this.siparisAciklamaVisible
            this.adisyon = this.adisyonies
        },
        dialogVisible() {
            this.$emit("update:siparisAciklamaVisible", this.dialogVisible)
            this.$emit("update:adisyonies", this.adisyon)
        }
    }
}
</script>

<style>

</style>