import { atom } from "recoil";
import LocaleUtil from "service/helper/locale_util";

export const localeSt = atom({
    key: "locale",
    default: LocaleUtil.getLocale()
});
