/*
 * @Description  : 运营端VCC卡管理接口参考实现 /api/logistics/vccCard
 */

import apiRequest from "@/utils/request";

export default {
  findVccCardPage(data) {
    return apiRequest.request(
      "post",
      "/api-logistics/operation/vccCard/findVccCardPage",
      data
    );
  },
  getVccCardDetail(refcode) {
    return apiRequest.request(
      "get",
      `/api-logistics/operation/vccCard/getVccCardDetail/${refcode}`
    );
  },
  findVccTradePage(data) {
    return apiRequest.request(
      "post",
      "/api-logistics/operation/vccCard/findVccTradePage",
      data
    );
  },
  refreshVccCredit(refcode) {
    return apiRequest.request(
      "get",
      `/api-logistics/operation/vccCard/refreshVccCredit/${refcode}`
    );
  },
  applyVccCard(data) {
    return apiRequest.request(
      "post",
      "/api-logistics/operation/vccCard/applyVccCard",
      data
    );
  },
  updateVccCard(data) {
    return apiRequest.request(
      "post",
      "/api-logistics/operation/vccCard/updateVccCard",
      data
    );
  },
};
