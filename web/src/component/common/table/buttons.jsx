import * as React from "react";
import { t } from "ttag";
import { Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const btnStyle = {
  padding: "4px 2px",
  marginLeft: "4px",
};

export function ViewBtn({ onClick }) {
  return (
    <Tooltip title={t`Detail`}>
      <Button
        type="default"
        htmlType="button"
        icon={<EyeOutlined />}
        size="small"
        title="hello"
        onClick={onClick}
        style={btnStyle}
      />
    </Tooltip>
  );
}

export function AddNewBtn({ onClick }) {
  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
      {t`Add new`}
    </Button>
  );
}

export function RemoveSelectedBtn({ ids, onClick }) {
  return (
    <Button
      type="primary"
      danger
      icon={<DeleteOutlined />}
      disabled={!ids.length}
      onClick={() => onClick(ids)}
    >
      {t`Remove selected`}
    </Button>
  );
}

export function EditBtn({ onClick }) {
  return (
    <Tooltip title={t`Update`}>
      <Button
        type="primary"
        ghost
        htmlType="button"
        icon={<EditOutlined />}
        size="small"
        title="hello"
        onClick={onClick}
        style={btnStyle}
      />
    </Tooltip>
  );
}

export function RemoveBtn({ onClick }) {
  return (
    <Tooltip title={t`Remove`}>
      <Button
        danger
        type="default"
        htmlType="button"
        icon={<DeleteOutlined />}
        size="small"
        onClick={onClick}
        style={btnStyle}
      />
    </Tooltip>
  );
}
