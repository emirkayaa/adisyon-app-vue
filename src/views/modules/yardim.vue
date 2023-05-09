<template>
  <div class="back-to-top-yardim">
    <el-button type="primary" plain circle size="large" class="p-4" @click="dialogVisible = true">
      <i class="bi bi-question-circle" style="font-size: 35px"></i
    ></el-button>
  </div>
  <VOnboardingWrapper class="wrapper" ref="wrapper" :steps="steps">
    <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
      <VOnboardingStep>
        <el-card class="mx-2">
          <div v-if="step.content" class="d-flex flex-column">
            <div class="d-flex justify-content-between">
              <span v-if="step.content.title" class="fs-5">{{ step.content.title }}</span>
              <el-button @click="exit" type="primary" circle size="small"><i class="bi bi-x"></i></el-button>
            </div>
            <el-divider class="my-2"></el-divider>
            <p v-if="step.content.description">{{ step.content.description }}</p>
            <div class="d-flex justify-content-between mt-3 align-items-center">
              <el-button v-if="!isFirst" @click="previous" type="primary" plain class="me-2">Önceki</el-button>
              {{ `${index + 1}/${steps.length}` }}
              <el-button v-if="!isLast" @click="next" type="primary" plain>Sonraki</el-button>
              <el-button v-else @click="next" type="primary" plain>Tamamlandı</el-button>
            </div>
          </div>
        </el-card>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
  <el-dialog v-model="dialogVisible" class="yardim-ekrani " title="Yardim" width="400px" :before-close="handleClose">
   <div class="positon-relative overflow-auto" style="height:75vh">
    <el-collapse v-model="activeName" class=""  accordion>
      <el-collapse-item  title="Hoş geldiniz" name="1">
        <ul>
          <li><span>Sipariş nasıl alınır?</span></li>
          <li><span>Sipariş nasıl ödenir?</span></li>
          <li><span>Masa nasıl eklenir?</span></li>
          <li><span>Ürün tanımlaması nasıl yapılır?</span></li>
          <li><span>Çalışanlar nerden tanımlanır?</span></li>
          <li><span>Cihazlarımı nasıl yetkilendirebilirim?</span></li>
          <li><span>QR menu nasıl tanımlanır/kullanılır?</span></li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="Tanımlamalar" name="2">
        <ul>
          <li @click="masaNasilEklenir()"><span>Masa nasıl eklenir?</span></li>
          <li @click="masaNasilSiralanir()"><span>Masa nasıl sıralanır?</span></li>
          <li @click="masaNasilDüzenlenir()" ><span>Masa nasıl düzenlenir?</span></li>
          <li @click="topluMasaNasilEklenir()"><span>Toplu masa nasıl eklenir?</span></li>
          <hr>
          <li @click="bolgeNasilEklenir()"><span>Bölge nasıl eklenir?</span></li>
          <li @click="bolgeNasilSiralanir()"><span>Bölge nasıl sıralanır?</span></li>
          <li @click="bolgeNasilDuzenlenir()"><span>Bölge nasıl düzenlenir?</span></li>
          <hr>
          <li @click="urunNasilEklenir()"><span>Ürün nasıl eklenir?</span></li>
          <li @click="urunNasilFavorilereEklenir()"><span>Ürün nasıl favorilere eklenir?</span></li>
          <li @click="urunRengiNasilDegisir()"><span>Ürünün rengi nasıl değiştirilir?</span></li>
          <li @click="urunNasilDuzenlenir()"><span>Ürün nasıl düzenlenir?</span></li>
          <hr>
          <li @click="kategoriNasilEklenir()"><span>Ürün kategorileri nasıl eklenir?</span></li>
          <hr>
          <li @click="müsteriNasilEklenir()"><span>Müşteri/Tedarikçi nasıl eklenir?</span></li>
          <li @click="kuverNasilEklenir()"><span>Kuver/Garsoniye nasıl eklenir?</span></li>
          <li @click="mutfakNasilEklenir()"><span>Mutfak nasıl eklenir?</span></li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
  </el-dialog>
</template>

<script>
import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from "v-onboarding";
import "v-onboarding/dist/style.css";
import yardim from "@/views/modules/yardim.js";
export default {
  data() {
    return {
      dialogVisible: false,
      steps: [],
      wrapper_name: "",
    };
  },
  mounted() {},
  methods: {
    masaNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.masaNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    masaNasilSiralanir() {
      this.dialogVisible = false;
      this.steps = yardim.masaNasilSiralanir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    masaNasilDüzenlenir() {
      this.dialogVisible = false;
      this.steps = yardim.masaNasilDüzenlenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    topluMasaNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.topluMasaNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },

    bolgeNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.bolgeNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    bolgeNasilSiralanir() {
      this.dialogVisible = false;
      this.steps = yardim.bolgeNasilSiralanir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    bolgeNasilDuzenlenir() {
      this.dialogVisible = false;
      this.steps = yardim.bolgeNasilDuzenlenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },

    urunNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.urunNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    urunNasilFavorilereEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.urunNasilFavorilereEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    urunRengiNasilDegisir() {
      this.dialogVisible = false;
      this.steps = yardim.urunRengiNasilDegisir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },
    urunNasilDuzenlenir() {
      this.dialogVisible = false;
      this.steps = yardim.urunNasilDuzenlenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start(); 
    },


    kategoriNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.kategoriNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },

    müsteriNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.musteriNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },

    kuverNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.kuverNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    },

    mutfakNasilEklenir() {
      this.dialogVisible = false;
      this.steps = yardim.mutfakNasilEklenir;
      useVOnboarding(this.$refs.wrapper);
      this.$refs.wrapper.start();
    }
  },
  watch: {
    $route() {},
  },
  components: {
    VOnboardingWrapper,
    VOnboardingStep,
  },
};
</script>

<style>
:root {
  --v-onboarding-step-arrow-background: var(--foreground-color);
}
.back-to-top-yardim {
  position: fixed;
  right: 1.5rem;
  bottom: 5rem;
  border-radius: 100%;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 2;
  opacity: 1;
  transition: all 0.5s;
}

.back-to-top:hover {
  opacity: 1;
}
.yardim-ekrani {
  margin: 20px 20px 20px auto !important;
  height: calc(100vh - 60px) !important;
}
.yardim-ekrani li {
  cursor: pointer;
}
.wrapper svg {
  z-index: 10000 !important;
  --v-onboarding-overlay-z: 10000000 !important;
}
.wrapper > div > div {
  z-index: 190000 !important;
}
</style>
