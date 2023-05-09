<template>
  <div class="my-5">
    <div class="row justify-content-center card-wrapper">
      <el-card
        class="col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3 text-center mx-3 my-4 p-4" >
        <div class="card-header">
            <div class="bg-light">
                <h4 class="fw-bold">Fiyat</h4>
            </div>
          <div>         
            <h5 class="h5-md fw-bold"> <i style="color:#FFC93C" class="bi bi-star-fill"></i> </h5>
            <sup class="dark-color fs-5">₺</sup>
            <span class="dark-color fs-1" v-if="kobi_para"
              >769,90<sub style="font-size:11px">/ Yıl</sub></span
            >
            <span class="dark-color fs-1" v-else>79,90 <sub style="font-size:11px">/ Ay</sub></span>

            <div class="d-flex justify-content-center my-2">
              <label>Ay</label>
              <el-switch
                class="mx-2"
                style="display: block"
                v-model="kobi_para"
                active-color="#434242"
                inactive-color="#434242"
                size="small"
              >
              </el-switch>
              <label class="">Yıl</label>
            </div>
          </div>
        </div>

    <!--  <el-divider style="margin: 0 12px 16px 12px" /> --> 

        <div class="p-3">
            <div class="bg_white paket-text mt-3">
            <ul>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
          </ul>
        </div>

        <el-button plain>Şimdi Al </el-button>
        </div>
      </el-card>

      <el-card
      
        class="col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3 mx-4 my-4 mid-card text-center"
      >
        <div class="card-header">
            <div class="bg-light">
                <h4 class="fw-bold">Performans</h4>
            </div>
          <div>
            <h5 class="h5-md fw-bold"> <i style="color:#FFC93C" class="bi bi-star-fill"></i> <i style="color:#FFC93C" class="bi bi-star-fill"></i> </h5>
            <sup class="dark-color fs-5">₺</sup>
            <span class="dark-color fs-1" v-if="on_para"
              >769,90<sub style="font-size:11px">/ Yıl</sub></span
            >
            <span class="dark-color fs-1" v-else>79,90 <sub style="font-size:11px"> /Ay</sub></span>

            <div class="d-flex justify-content-center my-2">
              <label>Ay</label>
              <el-switch
                class="mx-2"
                style="display: block"
                v-model="on_para"
                active-color="#434242"
                inactive-color="#434242"
                size="small"
              >
              </el-switch>
              <label class="">Yıl</label>
            </div>
          </div>
        </div>

        <!-- <el-divider style="margin: 0 0 16px 0" /> -->

       <div class="p-3" >
        <div class="bg_white paket-text mt-3">
            <ul>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
          </ul>
        </div>
        <el-button plain>Şimdi Al </el-button>
       </div>
      </el-card>

      <el-card
        class="col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3 mx-3 my-4 text-center p-4"
      >
        <div class="card-header">
            <div class="bg-light">
                <h4 class="fw-bold">Fiyat ve Performans</h4>
            </div>
          <div>
            <h5 class="h5-md fw-bold"> <i style="color:#FFC93C" class="bi bi-star-fill"></i> <i style="color:#FFC93C" class="bi bi-star-fill"></i> <i style="color:#FFC93C" class="bi bi-star-fill"></i> </h5>
            <sup class="dark-color fs-5">₺</sup>
            <span class="dark-color fs-1" v-if="mhsb_para"
              >769,90<sub style="font-size:11px">/ Yıl</sub></span
            >
            <span class="dark-color fs-1" v-else>79,90 <sub style="font-size:11px">/ Ay</sub></span>

            <div class="d-flex justify-content-center my-2">
              <label>Ay</label>
              <el-switch
                class="mx-2"
                style="display: block"
                v-model="mhsb_para"
                active-color="#434242"
                inactive-color="#434242"
                size="small"
              >
              </el-switch>
              <label class="">Yıl</label>
            </div>
          </div>
        </div>

      <!--   <el-divider style="margin: 0 0 16px 0" /> -->

       <div class="p-3">
        <div class="bg_white paket-text mt-3">
          <ul>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> 500 Adet E-Fatura Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Mobil Uygulama Ücretsiz</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Finans Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Cari Hesap Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Sipariş Yönetimi</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> E-Dönüşüm</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
            <li><p class="p-lg"><i class="bi bi-check-lg"></i> Tek Kullanıcı</p></li>
          </ul>
        </div>
        <el-button plain>Şimdi Al </el-button>
       </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kobi_para: true,
      on_para: true,
      mhsb_para: true,
    };
  },
};
</script>

<style>
.card-wrapper .el-card.is-always-shadow {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.card-wrapper .el-card__body {
  padding: 0;
}
.card-wrapper .el-card {
  padding: 0 !important;
}
.paket-text ul {
  padding: 0;
  font-weight: 600;
}
.paket-text li {
  list-style: none;
  margin: 12px;
  padding: 4px 4px 4px 12px;
  text-align: start;
  
}
.paket-text ul li:nth-child(2n) {
  background: #fffbeb;
}
.paket-text ul li i{
    font-size: 16px;
    color: #89C4E1;
}
.mid-card {
  transform: scale(1.07);
}
/* .card-header > div  {
  background: #fffbeb; 
} */
.card-header > div {
  padding: 20px;
}
.card-header > div h5 {
  padding: 10px;
}
</style>
