import * as React from "react";
import { Form, Input } from "antd";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import FormUtil from "service/helper/form_util";
import TransferInput from "component/common/form/ant/input/transfer_input.jsx";
import { urls, labels, emptyRecord } from "../config";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

export class Service {
    /**
     * handleSubmit.
     *
     * @param {FormCallback} onChange
     * @param {number} id
     */
    static handleSubmit(onChange, id) {
        return (data, formikBag) => {
            Util.toggleGlobalLoading();
            const endPoint = id ? `${urls.crud}${id}` : urls.crud;
            const method = id ? "put" : "post";
            RequestUtil.apiCall(endPoint, data, method)
                .then((resp) => {
                    const { data } = resp;
                    onChange(data, id);
                })
                .catch((err) => {
                    const errors = err.response.data;
                    const formatedErrors = Util.setFormErrors(errors);
                    formikBag.setErrors(formatedErrors);
                })
                .finally(() => Util.toggleGlobalLoading(false));
        };
    }
}

const formName = "RoleForm";

/**
 * RoleForm.
 *
 * @param {Object} props
 * @param {Object[]} props.pems
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */
export default function RoleForm({ pems, data, onChange }) {
    const [form] = Form.useForm();
    const initValues = Util.isEmpty(data) ? emptyRecord : data;
    const id = initValues.id;
    const url = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        name: {
            name: "name",
            label: labels.name,
            rules: [FormUtil.ruleRequired()]
        },
        permissions: {
            name: "permissions",
            label: labels.permissions,
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            layout="vertical"
            initialValues={{ ...initValues }}
            onFinish={(payload) =>
                FormUtil.submit(url, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.name}>
                <Input autoFocus />
            </Form.Item>

            <Form.Item {...formAttrs.permissions}>
                <TransferInput options={pems} />
            </Form.Item>
        </Form>
    );
}

RoleForm.displayName = formName;
RoleForm.formName = formName;
