import * as React from "react";
import { useState, useEffect } from "react";
import { Form, InputNumber } from "antd";
import Util from "service/helper/util";
import FormUtil from "service/helper/form_util";
import { urls, labels, emptyRecord } from "../config";

const formName = "StaffForm";

export default function StaffForm({ data, onChange }) {
  const [form] = Form.useForm();
  const initialValues = Util.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    number: {
      name: "number",
      label: labels.number,
      rules: [FormUtil.ruleRequired()],
    },
    location: {
      name: "location",
      label: labels.location,
      rules: [FormUtil.ruleRequired()],
    },
  };

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      initialValues={{ ...data }}
      onFinish={(payload) =>
        FormUtil.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtil.setFormErrors(form))
      }
    >
      <Form.Item {...formAttrs.number}>
        <InputNumber min={1} max={100} />
      </Form.Item>
      <Form.Item {...formAttrs.location}>
        <InputNumber min={1} max={100} />
      </Form.Item>
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
