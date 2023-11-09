import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "library/author",
    endpoints: {
      crud: "",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Author`;
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
  name: t`Name`,
  description: t`Description`,
};
