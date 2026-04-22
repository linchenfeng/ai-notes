<!--
 * @Author       : may.ruan
 * @Date         : 2025-01-08 15:57:31
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-04-22 18:01:40
 * @Description  : ty-form公共组件
-->
<!--
 1、ty-form 支持传入【inputWidth=设置表单所有输入框宽度/hideLabel=当前表单全部隐藏label】，其他传值与el-form一致
 2、el-form-item  增加属性，支持传入【inputWidth=当前表单项输入框宽度,可传aLine表示独占一行】、【hideLabel=当前表单项是否隐藏label】、
    type=【email=邮箱/mobile=手机号码/idCard=身份证/password=密码】、
    【updateStyle=当前数据变更决定其他表单展示时传入】
 3、若type有值会做相应的正确性校验，其他自定义校验传rules
-->
<template>
  <el-form
    ref="form"
    class="ty-form"
    :inline="!['1', 1].includes(this.column)"
    :model="model"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-form>
</template>

<script>
import validate from "@/utils/util.validate.js";
export default {
  tagName: "form",
  name: "Form",
  data() {
    return {
      inlineFlag: true,
    };
  },
  props: {
    // 表单数据对象
    model: {
      type: Object,
      required: true,
    },
    // 表单内输入框宽度
    inputWidth: {
      type: String,
      default: "100%",
    },
    // 是否隐藏label
    hideLabel: {
      type: Boolean,
      default: false,
    },
    // 每行展示多少个，auto=自适应平铺
    column: {
      type: [String, Number],
      default: "1",
    },
  },
  watch: {
    model: {
      handler() {
        this.$nextTick(() => {
          this.initStyle();
        });
      },
      deep: true,
    },
  },
  mounted() {
    const entries = Object.entries(this.$refs.form);
    for (let [key, value] of entries) {
      if (!value || typeof value !== "function") {
        continue;
      }
      this[key] = value;
    }

    this.initStyle();

    if (String(this.column) === "1") {
      this.inlineFlag = false;
    }
  },
  methods: {
    // 校验方法，依次弹出错误信息
    tyValidate(callback) {
      let valid = false;
      this.$refs.form.validate(() => {
        for (let item of this.$refs.form.fields) {
          item.value = this.model[item.prop];
          item.type = item.$attrs.type;
          item.tipType = this.getTipType(item.$el);
          // 校验必填

          if (item.isRequired && this.isEmpty(item.value)) {
            if (item.validateMessage.includes("is required")) {
              // 必填且未定义rules【input=请输入/select=请选择】
              const errorMessage = item.tipType;
              this.errorMessage(errorMessage + item.label);
            } else {
              // rules中定义了必填提示
              this.errorMessage(item.validateMessage);
            }
            this.inputAutoFocus();
            return callback(valid);
          }
          // 邮箱、手机号、身份证、密码强度正确性校验
          if (this.isNotEmpty(item.value) && !this.validateCheck(item)) {
            this.errorMessage(this.$t(`请输入正确的${item.label}`));
            // 手动添加class方便聚焦
            item.$el.classList.add("is-error");
            this.inputAutoFocus();
            item.$el.classList.remove("is-error");
            return callback(valid);
          }
          if (item.validateMessage) {
            // 其他自定义校验
            this.errorMessage(item.validateMessage);
            this.inputAutoFocus();
            return callback(valid);
          }
        }
        valid = true;
        // 校验通过
        return callback(valid);
      });
    },
    inputAutoFocus() {
      this.$nextTick(() => {
        const firstError = this.$el.querySelector(".el-form-item.is-error");
        if (firstError) {
          const input = firstError.querySelector("input,textarea") || {};
          if (input.offsetParent === null) {
            input.style.display = "block";
            input.focus();
            input.style.display = "none";
            return;
          }
          input.focus();
        }
      });
    },
    // 校验正确性
    validateCheck(item) {
      if (item.type === "mobile") return validate.checkMobile(item.value);
      if (item.type === "email") return validate.checkEmail(item.value);
      if (item.type === "password") return validate.checkPassword(item.value);
      if (item.type === "idCard") return validate.checkIDCard(item.value);
      return true;
    },
    // 获取提示类型
    getTipType(el) {
      const selectList = [
        ".el-date-editor",
        ".el-select",
        ".el-radio",
        ".el-checkbox",
      ];
      const uploadList = [".el-upload"];
      const contain = selectList.some((item) => el.querySelector(item));
      if (contain) {
        return this.$t("请选择");
      }
      const upload = uploadList.some((item) => el.querySelector(item));
      if (upload) {
        return this.$t("请上传");
      }
      return this.$t("请输入");
    },
    // 设置输入组件宽度
    initStyle() {
      const width =
        this.column === "auto"
          ? "auto"
          : `calc(${100 / this.column + "%"} - 10px)`;
      // 合并表单项的class
      let formItemList = this.$el.querySelectorAll(".form-item");
      if (formItemList.length) {
        formItemList.forEach((item) => {
          item.style.width = width;
          if (width === "auto") {
            item.classList.add("reset-magin");
          }
        });
      }
      this.$refs.form.fields.forEach((field) => {
        if (this.column !== "auto") {
          field.$el.style.width = width;
        }
        if (field.$attrs.inputWidth === "aLine") {
          field.$el.style.width = "calc(100% - 10px)";
        }
        // 单项外部设置的输入框宽度
        field.$el.querySelector(".el-form-item__content").style.width =
          this.getContentWidth(field);
        // 隐藏label
        if (field.$attrs.hideLabel || this.hideLabel) {
          field.$el.querySelector(".el-form-item__label").style.display =
            "none";
        }
      });
    },
    // 获取单项外部设置的输入框宽度
    getContentWidth(field) {
      if (field.$attrs.inputWidth) {
        if (field.$attrs.inputWidth === "aLine") {
          return `calc(100% - ${this.$refs.form.labelWidth})`;
        }
        return field.$attrs.inputWidth;
      } else if (this.inputWidth === "100%") {
        return `calc(${this.inputWidth} - ${this.$refs.form.labelWidth})`;
      }
      return this.inputWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
.ty-form.el-form {
  :deep(.el-form-item),
  :deep(.form-item) {
    margin-right: 10px;
    &.reset-magin {
      margin-right: 0;
    }
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-date-editor {
        width: 100%;
      }
    }
    .el-form-item {
      width: auto !important;
    }
    .el-form-item__error {
      display: none;
    }
  }
  :deep(.form-item) {
    display: inline-block;
  }
}
</style>
