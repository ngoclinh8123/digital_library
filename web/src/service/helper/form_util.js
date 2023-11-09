import { notification } from "antd";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";

export default class FormUtil {
    /**
     * removeEmptyKey.
     *
     * @param {Object} form - Antd hook instance
     * @param {Object} errorDict - {str: str[]}
     */

    static setFormErrors(form = null) {
        return (errorDict) => {
            if ("detail" in errorDict) {
                notification.error({
                    message: "Error",
                    description: errorDict.detail,
                    duration: 8
                });
                delete errorDict.detail;
            }
            form &&
                form.setFields(
                    Object.entries(errorDict).map(([name, errors]) => ({
                        name,
                        errors: typeof errors === "string" ? [errors] : errors
                    }))
                );
        };
    }

    /**
     * handleSubmit.
     *
     * @param {Object} payload
     */
    static submit(url, payload, method = "post") {
        Util.toggleGlobalLoading();
        return new Promise((resolve, reject) => {
            RequestUtil.apiCall(url, payload, method)
                .then((resp) => {
                    resolve(resp.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                })
                .finally(() => Util.toggleGlobalLoading(false));
        });
    }

    /**
     * getDefaultFieldName.
     *
     * @param {String} fieldName
     * @returns {String}
     */
    static getDefaultFieldName(fieldName) {
        return fieldName ? `"${fieldName}"` : "này";
    }

    /**
     * ruleRequired.
     *
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleRequired(fieldName = "") {
        fieldName = FormUtil.getDefaultFieldName(fieldName);
        return {
            required: true,
            message: `Trường ${fieldName} là bắt buộc`
        };
    }

    /**
     * ruleMin.
     *
     * @param {Number} min
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleMin(min, fieldName = "") {
        fieldName = FormUtil.getDefaultFieldName(fieldName);
        return {
            type: "number",
            min,
            message: `Trường "${fieldName}" có giá trị bé nhất là: ${min}`
        };
    }

    /**
     * ruleMax.
     *
     * @param {Number} max
     * @param {String} fieldName
     * @returns {Object} - Antd Form Rule Object
     */
    static ruleMax(max, fieldName = "") {
        fieldName = FormUtil.getDefaultFieldName(fieldName);
        return {
            type: "number",
            max,
            message: `Trường "${fieldName}" có giá trị lớn nhất là: ${max}`
        };
    }
}
