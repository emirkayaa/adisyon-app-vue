<template>
  <div>
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
        <profile-card :profile="profile"></profile-card>
      </div>
      <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
        <div class="row">
          <div class="col-12 col-md-6">
            <profile-device-card :Cihazlar="cihazlar"></profile-device-card>
          </div>
          <div class="col-12 col-md-6">
            <el-card style="height: 256px">*Geliştirme aşamasındadır.</el-card>
          </div>
          <div class="col-12 mt-2">
            <tabs @setProfile="setProfile"></tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

import profileCard from "./profile/card.vue";
import deviceCardVue from "./profile/device-card.vue";
import tabs from "./profile/tabs.vue";

export default {
  components: { "profile-card": profileCard, "profile-device-card": deviceCardVue, tabs },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      ayarlar: [],
      activeTab: "first",
      cihazlar: {},
      profile: {},
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    userDataApi() {
      this.getData();
    },
  },
  computed: {
    ...mapGetters({
      userDataApi: "getUserData",
      getToken: "getToken",
    }),
  },
  methods: {
    getData() {
      axios
        .post(this.getToken + "/tables/users/" + this.userDataApi?.user?.id + "/edit", {
          params: JSON.stringify({
            column_set_id: this.userDataApi.auths?.tables?.["users"]?.edits[0],
          }),
        })
        .then((res) => {
          this.cihazlar = JSON.parse(res.data.data.record.tokens);
          this.profile = res.data.data.record;
        });
    },
  },
};
</script>

<style>
[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 1em;
  width: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  text-align: center;
  border-radius: 50%;
  background: var(--theme-color-1);
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}

.profile .checkbox-effect:not(:checked),
.profile .checkbox-effect:checked {
  position: absolute;
  left: -9999px;
}

.profile label {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

/* checkbox effect #2 */
.checkbox-effect-2:not(:checked) + label:before,
.checkbox-effect-2:checked + label:before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #5a5a5a;
  box-sizing: border-box;
  border-radius: 10px;
  margin-right: 20px;
  transition-property: all;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  transition-delay: 0.2s;
}

.checkbox-effect-2:not(:checked) + label:after,
.checkbox-effect-2:checked + label:after {
  content: "";
  font-family: fontawesome;
  font-size: 18px;
  display: flex;
  height: 100%;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0px;
  color: #00711b;
}

.checkbox-effect-2:not(:checked) + label:after {
  opacity: 0;
  transition-property: all;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  transition-delay: 0s;
}

.checkbox-effect-2:checked + label:before {
  opacity: 0;
  transition-property: all;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  transition-delay: 0s;
}

.checkbox-effect-2:checked + label:after {
  opacity: 1;
  transition-property: all;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  transition-delay: 0.2s;
}

/* .loading-parent{
        width: 100%;
    height: 100%;
    background: rgb(3 19 31 / 26%);
        position: absolute;
    z-index: 99999;
    left: 0;
    top: -20px;
} */

dfn {
  background: rgba(0, 0, 0, 0.1);
  border-bottom: dashed 1px rgba(0, 0, 0, 0.8);
  padding: 0 0.4em;
  cursor: help;
  font-style: normal;
  position: relative;
}

dfn::after {
  content: attr(data-info);
  display: inline;
  position: absolute;
  top: 22px;
  left: 0;
  opacity: 0;
  width: 230px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5em;
  padding: 0.5em 0.8em;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  pointer-events: none;
  /* This prevents the box from apearing when hovered. */
  transition: opacity 250ms, top 250ms;
}

dfn::before {
  content: "";
  display: block;
  position: absolute;
  top: 12px;
  left: 20px;
  opacity: 0;
  width: 0;
  height: 0;
  border: solid transparent 5px;
  border-bottom-color: rgba(0, 0, 0, 0.8);
  transition: opacity 250ms, top 250ms;
}

dfn:hover {
  z-index: 2;
}

/* Keeps the info boxes on top of other elements */
dfn:hover::after,
dfn:hover::before {
  opacity: 1;
}

dfn:hover::after {
  top: 30px;
}

dfn:hover::before {
  top: 20px;
}
</style>
