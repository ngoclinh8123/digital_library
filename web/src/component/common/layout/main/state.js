import { atom } from "recoil";

export const profileDataSt = atom({
  key: "profileData",
  default: {
    id: 0,
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    title_label: "",
    list_parent: [],
  },
});
