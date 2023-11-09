import * as React from "react";
import { useState, useEffect } from "react";
import { Form, Input } from "antd";
import Util from "service/helper/util";
import FormUtil from "service/helper/form_util";
import { urls, labels, emptyRecord } from "../config";

const formName = "StaffForm";
const { TextArea } = Input;

export default function StaffForm({ data, onChange }) {
  const [form] = Form.useForm();
  const initialValues = Util.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    name: {
      name: "name",
      label: labels.name,
      rules: [FormUtil.ruleRequired()],
    },
    description: {
      name: "description",
      label: labels.description,
      rules: [FormUtil.ruleRequired()],
    },
  };

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ ...data }}
      onFinish={(payload) =>
        FormUtil.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtil.setFormErrors(form))
      }
    >
      <Form.Item {...formAttrs.name}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.description}>
        <TextArea
          autoSize={{
            minRows: 2,
            maxRows: 6,
          }}
        />
      </Form.Item>
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
