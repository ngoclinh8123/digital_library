import * as React from "react";
import { t } from "ttag";
import { useSetRecoilState } from "recoil";
import { Form, Input } from "antd";
import FormUtil from "service/helper/form_util";
import { urls } from "../config";

const formName = "ResetPwdForm";

/**
 * ResetPwdForm.
 *
 * @param {Object} object
 * @param {FormCallback} object.onChange
 */
export default function ResetPwdForm({ onChange }) {
  const [form] = Form.useForm();
  const initialValues = { email: "" };

  const formAttrs = {
    email: {
      name: "email",
      label: t`Email`,
      rules: [FormUtil.ruleRequired()],
    },
  };
  return (
    <Form
      name={formName}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ ...initialValues }}
      onFinish={(payload) => {
        FormUtil.submit(urls.resetPassword, payload)
          .then((data) => {
            onChange(data);
          })
          .catch(FormUtil.setFormErrors(form));
      }}
    >
      <Form.Item {...formAttrs.email}>
        <Input />
      </Form.Item>
    </Form>
  );
}

ResetPwdForm.displayName = formName;
ResetPwdForm.formName = formName;
