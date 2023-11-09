import * as React from "react";
import { Select } from "antd";
import { useRecoilState } from "recoil";
import { useLocale } from "ttag";
import LocaleUtil from "service/helper/locale_util";
import { localeSt } from "src/states";

const { Option } = Select;

export default function LocaleSelect() {
    const [locale, setLocale] = useRecoilState(localeSt);
    useLocale(locale);
    return (
        <Select
            defaultValue={LocaleUtil.getLocale()}
            onChange={(value) => {
                setLocale(LocaleUtil.setLocale(value));
                location.reload();
            }}
        >
            {LocaleUtil.getSupportedLocales().map((locale) => (
                <Option key={locale} value={locale}>
                    {locale}
                </Option>
            ))}
        </Select>
    );
}

LocaleSelect.displayName = "LocaleSelect";
