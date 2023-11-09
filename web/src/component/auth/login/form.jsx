import * as React from "react";
import { Button, Row, Col, Form, Input } from "antd";
import { t } from "ttag";
import { CheckOutlined } from "@ant-design/icons";
import FormUtil from "service/helper/form_util";
import { urls } from "../config";

const formName = "LoginForm";

const formItemStyle = {
  margin: "16px 0 4px",
};

const formItemInput = {
  padding: "8px 12px",
};

export default function LoginForm({ onChange, children }) {
  const [form] = Form.useForm();
  const initialValues = {
    username: "root",
    password: "SamplePassword123!@#",
  };

  const formAttrs = {
    username: {
      name: "username",
      // label: t`Username`,
      rules: [FormUtil.ruleRequired()],
    },
    password: {
      name: "password",
      // label: t`Password`,
      rules: [FormUtil.ruleRequired()],
    },
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      initialValues={{ ...initialValues }}
      onFinish={(payload) =>
        FormUtil.submit(urls.login, payload)
          .then((data) => onChange(data))
          .catch(FormUtil.setFormErrors(form))
      }
    >
      <Form.Item {...formAttrs.username} style={formItemStyle}>
        <Input
          autoFocus
          placeholder="Type your username"
          style={formItemInput}
        />
      </Form.Item>

      <Form.Item {...formAttrs.password} style={formItemStyle}>
        <Input
          type="password"
          placeholder="Type your password"
          style={formItemInput}
        />
      </Form.Item>

      <p style={{ textAlign: "right" }}>{children}</p>
      <Button
        type="primary"
        htmlType="submit"
        style={{
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#64ccc5",
          height: "40px",
          border: "none",
          fontSize: "14px",
          fontWeight: "700",
        }}
      >
        {"Đăng nhập"}
      </Button>
    </Form>
  );
}
LoginForm.displayName = formName;
LoginForm.formName = formName;
