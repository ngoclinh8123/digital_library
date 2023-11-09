import * as React from "react";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import Util from "service/helper/util";
import Form from "./form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_RESET_PASSWORD_CONFIRM_DIALOG";
    }

    static toggle(open = true) {
        Util.event.dispatch(Service.toggleEvent, { open });
    }
}

export default function ResetPwdConfirm() {
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open } }) => setOpen(open);

    useEffect(() => {
        Util.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            Util.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            destroyOnClose={true}
            visible={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText="OK"
            onCancel={() => Service.toggle(false)}
            cancelText="Thoát"
            title="Khôi phục mật khẩu"
        >
            <Form
                onChange={() => {
                    setOpen(false);
                }}
            />
        </Modal>
    );
}

ResetPwdConfirm.displayName = "ResetPwdConfirm";
ResetPwdConfirm.toggle = Service.toggle;
