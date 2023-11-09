import * as React from "react";
import { useState, useEffect } from "react";
import { Form, InputNumber, Select } from "antd";
import { t } from "ttag";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import FormUtil from "service/helper/form_util";
import { urls as urlUser } from "component/staff/config";
import { urls as urlBook } from "component/book/config";
import { urls, labels, emptyRecord } from "../config";
import { STATUS_CHOICES } from "../const";

const formName = "StaffForm";

export default function StaffForm({ data, onChange }) {
  const [form] = Form.useForm();
  const [listUsers, setListUsers] = useState([]);
  const [listBooks, setListBooks] = useState([]);
  const initialValues = Util.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}/` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    user: {
      name: "user",
      label: "Độc giả",
      rules: [FormUtil.ruleRequired()],
    },
    book_item: {
      name: "book",
      label: "Sách",
      rules: [FormUtil.ruleRequired()],
    },
    status: {
      name: "status",
      label: "Trạng thái mới",
    },
  };

  const getOptionStatus = () => {
    let options = [];
    let find = false;
    STATUS_CHOICES.forEach((item) => {
      if (item[0] == data.status || find) {
        find = true;
        if (item[0] == "CANCELED") {
          if (data.status == "REQUESTED" || data.status == "CANCELED") {
            options.push({
              value: item[0],
              label: "Huỷ yêu cầu",
            });
          }
        } else {
          options.push({
            value: item[0],
            label: item[1],
          });
        }
      }
    });
    return options;
  };

  const getListUser = () => {
    RequestUtil.apiCall(urlUser.crud)
      .then((res) => {
        let options = [];
        res.data.items.forEach((item) => {
          options.push({
            value: item.id,
            label: item.full_name,
          });
        });
        setListUsers(options);
      })
      .finally(() => {});
  };

  const getListBook = () => {
    RequestUtil.apiCall(urlBook.crud)
      .then((res) => {
        let options = [];
        res.data.items.forEach((item) => {
          options.push({
            value: item.id,
            label: item.title,
          });
        });
        setListBooks(options);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getListUser();
    getListBook();
  }, []);

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={(payload) =>
        FormUtil.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtil.setFormErrors(form))
      }
    >
      {id ? (
        <>
          <Form.Item {...formAttrs.status}>
            <Select
              defaultValue={initialValues.status}
              style={{
                width: 140,
              }}
              options={[...getOptionStatus()]}
            />
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item {...formAttrs.user}>
            <Select
              // defaultValue={initialValues.status}
              style={{
                width: 240,
              }}
              options={[...listUsers]}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item {...formAttrs.book_item}>
            <Select
              // defaultValue={initialValues.status}
              style={{
                width: 240,
              }}
              options={[...listBooks]}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </>
      )}
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
