import * as React from "react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Form, Input, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Util from "service/helper/util";
import FormUtil from "service/helper/form_util";
import SelectInput from "component/common/form/ant/input/select_input.jsx";
import CheckInput from "component/common/form/ant/input/check_input.jsx";
import { urls, labels, emptyRecord } from "../config";
import { staffOptionsSt } from "../states";

const DEFAULT_PASSWORD = "SamplePassword123!@#";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

const formName = "StaffForm";

/**
 * StaffForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);
export default function StaffForm({ data, onChange }) {
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [form] = Form.useForm();
  const staffOptions = useRecoilValue(staffOptionsSt);

  const initialValues = Util.isEmpty(data) ? emptyRecord : { ...data };
  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}/` : urls.crud;
  const method = id ? "put" : "post";

  useEffect(() => {
    if (initialValues.avatar) {
      setFileListThumbnail([{ url: initialValues.avatar }]);
    }
  }, []);

  const formAttrs = {
    email: {
      name: "email",
      label: labels.email,
      rules: [
        FormUtil.ruleRequired(),
        {
          type: "email",
          message: "Định dạng email không chính xác",
        },
      ],
    },
    phone_number: {
      name: "phone_number",
      label: labels.phone_number,
    },
    last_name: {
      name: "last_name",
      label: labels.last_name,
      rules: [FormUtil.ruleRequired()],
    },
    first_name: {
      name: "first_name",
      label: labels.first_name,
      rules: [FormUtil.ruleRequired()],
    },
    address: {
      name: "address",
      label: labels.address,
    },
    groups: {
      name: "groups",
      label: labels.groups,
    },
    // is_active: {
    //   name: "is_active",
    //   label: labels.is_active,
    // },
    // avatar: {
    //   name: "avatar",
    //   label: labels.avatar,
    // },
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const handleChangeThumbnail = ({ fileList: newFileList }) => setFileListThumbnail(newFileList);

  const handleCancelPreviewThumbnail = () => setPreviewOpen(false);

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ ...initialValues }}
      onFinish={(payload) => {
        payload = {
          ...payload,
          password: DEFAULT_PASSWORD,
          avatar: fileListThumbnail[0]?.originFileObj,
        };
        FormUtil.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtil.setFormErrors(form));
      }}
    >
      <Form.Item {...formAttrs.email}>
        <Input />
      </Form.Item>
      {/* <Form.Item {...formAttrs.password}>
        <Input />
      </Form.Item> */}
      <Form.Item {...formAttrs.phone_number}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.last_name}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.first_name}>
        <Input />
      </Form.Item>
      <Form.Item {...formAttrs.address}>
        <Input />
      </Form.Item>
      {/* <Form.Item {...formAttrs.groups}>
                <SelectInput options={staffOptions.group} mode="multiple" block />
            </Form.Item> */}
      <Form.Item label={labels.avatar}>
        <Upload
          customRequest={dummyRequest}
          listType="picture-card"
          fileList={fileListThumbnail}
          onPreview={handlePreview}
          onChange={handleChangeThumbnail}
        >
          {fileListThumbnail.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreviewThumbnail}>
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Form.Item>
      {/* <Form.Item {...formAttrs.is_active}>
        <CheckInput />
      </Form.Item> */}
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
