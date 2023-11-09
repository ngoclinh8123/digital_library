import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "library/item",
    endpoints: {
      crud: "",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);
