import * as React from "react";
import { t } from "ttag";
import { Row, Col, Form, Input } from "antd";
import FormUtil from "service/helper/form_util";
import { urls } from "../config";

const formName = "ChangePwdForm";

export default function ChangePwdForm({ onChange }) {
    const [form] = Form.useForm();
    const initValues = {
        password: "",
        old_password: "",
        password_confirm: ""
    };

    const formAttrs = {
        old_password: {
            name: "old_password",
            label: t`Old password`,
            rules: [FormUtil.ruleRequired()]
        },
        password: {
            name: "password",
            label: t`New password`,
            rules: [FormUtil.ruleRequired()]
        },
        password_confirm: {
            name: "password_confirm",
            label: t`Confirm new password`,
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name={formName}
            initialValues={{ ...initValues }}
            onFinish={(payload) =>
                FormUtil.submit(urls.changePassword, payload)
                    .then((data) => onChange(data))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.old_password}>
                <Input autoFocus type="password" />
            </Form.Item>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item {...formAttrs.password}>
                        <Input type="password" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formAttrs.password_confirm}>
                        <Input type="password" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

ChangePwdForm.displayName = formName;
ChangePwdForm.formName = formName;
