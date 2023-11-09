import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "account/user",
    endpoints: {
      crud: "",
      profile: "profile",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Staff`;
const name = headingTxt.toLowerCase();
export const messages = {
  heading: headingTxt,
  deleteOne: t`Do you want to remote this ${name}?`,
  deleteMultiple: t`Do you want to remote these ${name}?`,
};

export const emptyRecord = {
  id: 0,
  last_name: "",
  first_name: "",
  email: "",
  phone_number: "",
  groups: [],
};

export const labels = {
  full_name: "Họ và tên",
  last_name: t`Họ và tên đệm`,
  first_name: t`Tên`,
  email: t`Email`,
  phone_number: "Số điện thoại",
  is_active: t`Active`,
  groups: t`Groups`,
  password: t`Password`,
  avatar: "Ảnh đại diện",
  address: "Địa chỉ",
};
