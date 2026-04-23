/*
 * @Description  : 运营端VCC卡管理路由参考实现 /router/modules/logistics/vccCard
 */

export default (pre, meta) => [
  {
    path: "logistics/vccCard",
    name: `${pre}logistics-vcc-card`,
    component: () => import("@/pages/logistics/vccCard"),
    meta: { ...meta, title: "VCC卡管理" },
  },
  {
    path: "logistics/vccCard/detail/:refcode",
    name: `${pre}logistics-vcc-card-detail`,
    component: () => import("@/pages/logistics/vccCard/Detail.vue"),
    meta: { ...meta, title: "VCC卡详情" },
  },
];
