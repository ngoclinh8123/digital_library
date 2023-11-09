import * as React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Modal,
} from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import Util from "service/helper/util";
import FormUtil from "service/helper/form_util";
import RequestUtil from "service/helper/request_util";
import { urls, labels, emptyRecord, languages } from "../config";
import { urls as authorUrl } from "component/author/config";
import { urls as categoryUrl } from "component/category/config";

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

const formName = "StaffForm";
const { TextArea } = Input;
const { Dragger } = Upload;

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
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [form] = Form.useForm();

  const getDefaultAuthors = () => {
    return data.authors ? data.authors.map((author) => author.id) : [];
  };
  const getDefaultCategories = () => {
    return data.categories
      ? data.categories.map((category) => category.id)
      : [];
  };

  const initialValues = Util.isEmpty(data)
    ? emptyRecord
    : {
        ...data,
        authors: getDefaultAuthors(),
        categories: getDefaultCategories(),
      };

  const id = initialValues.id;
  const endPoint = id ? `${urls.crud}${id}/` : urls.crud;
  const method = id ? "put" : "post";

  const formAttrs = {
    title: {
      name: "title",
      label: labels.title,
      rules: [FormUtil.ruleRequired()],
    },
    language: {
      name: "language",
      label: labels.language,
    },
    publisher: {
      name: "publisher",
      label: labels.publisher,
      rules: [FormUtil.ruleRequired()],
    },
    // quantity: {
    //   name: "quantity",
    //   label: labels.quantity,
    // },
    // publication_date: {
    //   name: "publication_date",
    //   label: labels.publication_date,
    // },
    price: {
      name: "price",
      label: labels.price,
    },
    // thumbnail: {
    //   name: "thumbnail",
    //   label: labels.thumbnail,
    // },
    description: {
      name: "description",
      label: labels.description,
    },
    // file: {
    //   name: "file",
    //   label: labels.file,
    // },
    categories: {
      name: "categories",
      label: labels.categories,
      rules: [FormUtil.ruleRequired()],
    },
    authors: {
      name: "authors",
      label: labels.authors,
      rules: [FormUtil.ruleRequired()],
    },
    // racks: {
    //   name: "racks",
    //   label: labels.racks,
    // },
  };

  const getAuthors = () => {
    RequestUtil.apiCall(authorUrl.crud)
      .then((res) => {
        const options = [];
        if (res.data.length > 0) {
          res.data.forEach((item) =>
            options.push({ label: item.name, value: item.id })
          );
        }
        setAuthors(options);
      })
      .catch(() => {});
  };

  const getCategories = () => {
    RequestUtil.apiCall(categoryUrl.crud)
      .then((res) => {
        const options = [];
        if (res.data.length > 0) {
          res.data.forEach((item) =>
            options.push({ label: item.title, value: item.id })
          );
        }
        setCategories(options);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getAuthors();
    getCategories();
    if (initialValues.thumbnail) {
      setFileListThumbnail([{ url: initialValues.thumbnail }]);
    }
    if (initialValues.file) {
      setFileList([{ url: initialValues.file, name: initialValues.file }]);
    }
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChangeThumbnail = ({ fileList: newFileList }) =>
    setFileListThumbnail(newFileList);

  const handleChangeFile = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancelPreviewThumbnail = () => setPreviewOpen(false);

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ ...initialValues }}
      onFinish={(payload) => {
        const publication_date = moment(payload.publication_date).format(
          "YYYY-MM-DDTHH:mm:ss"
        );

        if (fileList[0] && fileList[0].originFileObj) {
          payload = {
            ...payload,
            file: fileList[0]?.originFileObj,
          };
        }

        if (fileListThumbnail[0] && fileListThumbnail[0].originFileObj) {
          payload = {
            ...payload,
            thumbnail: fileListThumbnail[0]?.originFileObj,
          };
        }
        payload = {
          ...payload,
          publication_date: publication_date,
          quantity: 1,
        };

        FormUtil.submit(endPoint, payload, method)
          .then((data) => onChange(data, id))
          .catch(FormUtil.setFormErrors(form));
      }}
    >
      <Row>
        <Col span={12}>
          <Form.Item {...formAttrs.title}>
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
          <Form.Item {...formAttrs.authors}>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              options={authors}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item {...formAttrs.categories}>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              options={categories}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item {...formAttrs.language}>
            <Select options={languages} />
          </Form.Item>
          <Form.Item {...formAttrs.publisher}>
            <Input />
          </Form.Item>
          <Form.Item label={labels.publication_date} valuePropName={"date"}>
            <DatePicker
              defaultValue={
                initialValues.publication_date
                  ? moment(
                      initialValues.publication_date,
                      "YYYY-MM-DDTHH:mm:ss"
                    )
                  : null
              }
              // showTime
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formAttrs.price}>
            <InputNumber addonAfter="VNĐ" />
          </Form.Item>
          {/* <Form.Item {...formAttrs.quantity}>
            <InputNumber addonAfter="Quyển" />
          </Form.Item> */}
          {/* <Form.Item {...formAttrs.racks}>
            <Input />
          </Form.Item> */}
          <Form.Item label={labels.file}>
            <Dragger
              customRequest={dummyRequest}
              maxCount={1}
              defaultFileList={
                initialValues.file
                  ? [{ url: initialValues.file, name: initialValues.file }]
                  : []
              }
              fileList={fileList}
              onChange={handleChangeFile}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item label={labels.thumbnail}>
            <Upload
              customRequest={dummyRequest}
              listType="picture-card"
              fileList={fileListThumbnail}
              onPreview={handlePreview}
              onChange={handleChangeThumbnail}
            >
              {fileListThumbnail.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancelPreviewThumbnail}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

StaffForm.displayName = formName;
StaffForm.formName = formName;
