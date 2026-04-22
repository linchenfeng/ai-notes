<template>
  <vteam-container>
    <div id="qutotaEdit">
      <ul class="edit-form-group">
        <li class="edit-form-group-item">
          <div class="edit-form-group-item-title">
            <span></span>
            <label>{{ $t("账户设置") }}</label>
          </div>
          <div class="edit-form-list-item-content">
            <ty-form :model="userForm" ref="userForm" label-width="80px">
              <div>
                <el-form-item :label="$t('用户名')">
                  <el-input
                    v-model="userForm.userid"
                    :placeholder="$t('用户名')"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('手机号码')"
                  prop="mobilephone"
                  type="mobile"
                >
                  <el-input
                    v-model="userForm.mobilephone"
                    oninput="value = value.slice(0, 11)"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('旧密码')" prop="password1" required>
                  <el-input
                    v-model="userForm.password1"
                    maxlength="20"
                    :placeholder="$t('旧密码')"
                    type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('新密码')"
                  prop="newPassword1"
                  type="password"
                  required
                >
                  <el-input
                    v-model="userForm.newPassword1"
                    maxlength="20"
                    :placeholder="$t('新密码')"
                    type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('确认密码')"
                  prop="confirmPassword"
                  type="password"
                  required
                >
                  <el-input
                    v-model="userForm.confirmPassword"
                    maxlength="20"
                    :placeholder="$t('确认密码')"
                    type="password"
                  ></el-input>
                </el-form-item>
              </div>
            </ty-form>
          </div>
        </li>
      </ul>
    </div>
    <template slot="footer">
      <div class="text-center">
        <el-button type="primary" @click="submitForm('userForm')" v-debounce>{{
          $t("提交")
        }}</el-button>
      </div>
    </template>
  </vteam-container>
</template>

<script>
import operationPersonalManage from "@/api/operate/permission/api.operationPersonalManage";
import jsmd5 from "js-md5";
export default {
  name: "operate-permission-operationPersonal-changePassword",
  data() {
    return {
      // 参数
      userForm: {
        refcode: "",
        userid: "",
        mobilephone: "",
        password: "",
        password1: "",
        newPassword: "",
        newPassword1: "",
        confirmPassword: "",
      },
    };
  },
  mounted() {
    this.userForm = this.$store.getters.userInfo.loginUser;
  },
  methods: {
    // 添加运营人员信息
    submitForm() {
      this.$refs.userForm.tyValidate((valid) => {
        if (valid) {
          this.userForm.password = jsmd5(this.userForm.password1);
          this.userForm.newPassword = jsmd5(this.userForm.newPassword1);
          // 修改用户
          operationPersonalManage
            .doUpdateOperationPassword(this.userForm)
            .then((res) => {
              this.successMessage(this.$t("修改成功"));
              // 关闭当前页
              this.$store.dispatch("vteamAdmin/page/close", {
                tagName: "operate-permission-operationPersonal-changePassword",
                vm: this,
              });
            });
        }
      });
    },
  },
};
</script>
