import { t } from "ttag";
import RequestUtil from "service/helper/request_util";

const urlMap = {
  base: {
    prefix: "library/book",
    endpoints: {
      crud: "",
    },
  },
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Book`;
const name = headingTxt.toLowerCase();
export const messages = {
  heading: headingTxt,
  deleteOne: t`Do you want to remote this ${name}?`,
  deleteMultiple: t`Do you want to remote these ${name}?`,
};

export const emptyRecord = {
  id: 0,
  title: "",
  description: "",
  authors: [],
  categories: [],
  language: "",
  publisher: "",
  publication_date: null,
  quantity: 0,
  price: 0,
  file: "",
  thumbnail: "",
};

export const labels = {
  title: t`Title`,
  author: t`Author`,
  language: t`Language`,
  publisher: t`Publisher`,
  quantity: t`Quantity`,
  publication_date: t`Publication_date`,
  price: t`Price`,
  thumbnail: t`Thumbnail`,
  description: t`Description`,
  file: t`File`,
  category: t`Category`,
  author: t`Author`,
  categories: t`Category`,
  authors: t`Author`,
  racks: t`Rack`,
  total_available_book_items: "Số lượng",
  is_available: "Khả dụng",
};

export const languages = [
  { label: "Tiếng Việt", value: "VIETNAMESE" },
  { label: "Tiếng Anh", value: "ENGLISH" },
];
