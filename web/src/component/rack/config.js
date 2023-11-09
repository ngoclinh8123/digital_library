import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "library/rack",
    endpoints: {
      crud: "",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Rack`;
const name = headingTxt.toLowerCase();
export const messages = {
  heading: headingTxt,
  deleteOne: t`Do you want to remote this ${name}?`,
  deleteMultiple: t`Do you want to remote these ${name}?`,
};

export const emptyRecord = {
  id: 0,
  title: "",
};

export const labels = {
  title: t`Title`,
  number: "Khu vực",
  location: t`Location`,
};
