import * as React from "react";
import { useState, useEffect } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import Util from "service/helper/util";
import Form from "./form";
import { emptyProfile } from "..";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_UPDATE_PROFILE_DIALOG";
    }

    static toggle(open = true, data) {
        Util.event.dispatch(Service.toggleEvent, { open, data });
    }
}

export default function UpdateProfile({ onChange }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ ...emptyProfile });

    const handleToggle = ({ detail: { open, data } }) => {
        setOpen(open);
        setData(data);
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
            okText={t`Update profile`}
            onCancel={() => Service.toggle(false)}
            cancelText={t`Cancel`}
            title={t`Update profile`}
        >
            <Form
                data={data}
                onChange={(data) => {
                    setOpen(false);
                    onChange(data);
                }}
            />
        </Modal>
    );
}

UpdateProfile.displayName = "UpdateProfile";
UpdateProfile.toggle = Service.toggle;
