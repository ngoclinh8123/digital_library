import * as React from "react";
import { Form, Input } from "antd";
import Util from "service/helper/util";
import FormUtil from "service/helper/form_util";
import { urls, labels } from "../config";

const formName = "VariableForm";
const emptyRecord = {
    id: 0,
    uid: "",
    value: ""
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * VariableForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function VariableForm({ data, onChange }) {
    const [form] = Form.useForm();
    const initialValues = Util.isEmpty(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        uid: {
            name: "uid",
            label: labels.uid,
            rules: [FormUtil.ruleRequired()]
        },
        value: {
            name: "value",
            label: labels.value
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.uid}>
                <Input autoFocus />
            </Form.Item>

            <Form.Item {...formAttrs.value}>
                <Input />
            </Form.Item>
        </Form>
    );
}

VariableForm.displayName = formName;
VariableForm.formName = formName;
