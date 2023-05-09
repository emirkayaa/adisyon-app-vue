<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-person"></i> Profil</h2>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Kullanıcı Bilgileri" name="first">User</el-tab-pane>
      <el-tab-pane label="Şifre İşlemleri" name="second">Config</el-tab-pane>
      <el-tab-pane label="Bildirim İşlemleri" name="third">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
