import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "account/book",
    endpoints: {
      crud: "",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

export const emptyRecord = {
  id: 0,
  title: "",
  language: "",
  publisher: "",
  quantity: "",
};

export const labels = {
  title: t`Title`,
  language: t`Language`,
  publisher: t`Publisher`,
  quantity: t`Quantity`,
};
