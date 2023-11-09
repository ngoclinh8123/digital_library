import * as React from "react";
import { t } from "ttag";
import { Form, Input } from "antd";
import FormUtil from "service/helper/form_util";
import { urls } from "../../config";

const formName = "UpdateProfileForm";

export default function UpdateProfileForm({ data, onChange }) {
    const [form] = Form.useForm();

    const formAttrs = {
        phone_number: {
            name: "phone_number",
            label: t`Phone number`,
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...data }}
            onFinish={(payload) =>
                FormUtil.submit(urls.profile, payload, "put")
                    .then((data) => onChange(data))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.phone_number}>
                <Input autoFocus />
            </Form.Item>
        </Form>
    );
}

UpdateProfileForm.displayName = formName;
UpdateProfileForm.formName = formName;
