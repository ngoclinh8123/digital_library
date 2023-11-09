import * as React from "react";
import { useState, useEffect } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import Util from "service/helper/util";
import Form from "./form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_CHANGE_PASSWORD_DIALOG";
    }

    static toggle(open = true) {
        Util.event.dispatch(Service.toggleEvent, { open });
    }
}

export default function ChangePwd() {
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open } }) => {
        setOpen(open);
    };

    useEffect(() => {
        Util.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            Util.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            keyboard={false}
            maskClosable={false}
            destroyOnClose
            visible={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText={t`Change password`}
            onCancel={() => Service.toggle(false)}
            cancelText={t`Cancel`}
            title={t`Change password`}
        >
            <Form
                onChange={() => {
                    setOpen(false);
                }}
            />
        </Modal>
    );
}

ChangePwd.displayName = "ChangePwd";
ChangePwd.toggle = Service.toggle;
