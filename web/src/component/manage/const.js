import { t } from "ttag";

export const STATUS_CHOICES = [
  ["REQUESTED", t`Requested`],
  ["APPROVED", t`Approved`],
  ["BORROWED", t`Borrowed`],
  ["RETURNED", t`Returned`],
  ["OVER_DUE", t`Over_due`],
  ["CANCELED", "Đã hủy"],
];

export const STATUS_COLOR = {
  REQUESTED: "#fd8d14",
  APPROVED: "#293462",
  BORROWED: "#108ee9",
  RETURNED: "#87d068",
  OVER_DUE: "#f50",
  CANCELED: "#ccc",
};

export const STATUS_ACTION = {
  REQUESTED: "Duyệt",
  APPROVED: "Đã lấy",
  BORROWED: "Đã trả",
  RETURNED: "",
  OVER_DUE: "",
  CANCELED: "",
};
