import * as React from "react";
import { useState, useEffect } from "react";
import { Form, Input } from "antd";
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
    title: {
      name: "title",
      label: labels.title,
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
      <Form.Item {...formAttrs.title}>
        <Input />
      </Form.Item>
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
