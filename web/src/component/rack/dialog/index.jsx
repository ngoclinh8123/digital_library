import * as React from "react";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import Form from "./form";
// import BookView from "./book_view";
import { urls, messages } from "../config";

const StaffDialog = forwardRef(({ onChange }, ref) => {
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [action, setAction] = useState("view");

  const ModalViewProp = {
    onOk: () => setOpen(false),
    width: 1024,
    cancelButtonProps: { style: { display: "none" } },
  };

  const ModalEditProp = {
    okButtonProps: { form: Form.formName, key: "submit", htmlType: "submit" },
    okText: t`Save`,
    cancelText: t`Cancel`,
    title: Util.getDialogTitle(id, messages),
  };

  const loadData = (id, action) => {
    setId(id);
    setAction(action);
    if (id) {
      Util.toggleGlobalLoading();
      RequestUtil.apiCall(`${urls.crud}${id}`)
        .then((resp) => {
          setData(resp.data);
          setOpen(true);
        })
        .finally(() => Util.toggleGlobalLoading(false));
    } else {
      setData({});
      setOpen(true);
    }
  };

  const getModalProp = () => (action == "view" ? ModalViewProp : ModalEditProp);

  useImperativeHandle(ref, () => ({ loadData }));
  return (
    <Modal
      destroyOnClose
      open={open}
      onCancel={() => setOpen(false)}
      {...getModalProp()}
    >
      {action == "view" ? (
        <h1>view sach thuoc the loai {data.title}</h1>
      ) : (
        <Form
          data={data}
          onChange={(data, id) => {
            setOpen(false);
            onChange(data, id);
          }}
        />
      )}
    </Modal>
  );
});

StaffDialog.displayName = "StaffDialog";
export default StaffDialog;
