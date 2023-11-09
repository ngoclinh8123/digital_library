import * as React from "react";
import { Button, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

/**
 * @callback onChange
 * @param {String} url
 * @returns {void}
 */

export const defaultLinks = {
    next: "",
    previous: ""
};

/**
 * ActionBtn.
 *
 * @param {Object} props
 * @param {string} props.type
 * @param {string} props.url
 * @param {onChange} props.onChange
 */
function ActionBtn({ type, url, onChange }) {
    if (!url) return null;
    const label = {
        prev: "Trang trước",
        next: "Trang tiếp"
    };
    return (
        <Button
            type="primary"
            key={1}
            icon={type === "prev" ? <LeftOutlined /> : <RightOutlined />}
            onClick={() => onChange(url)}
        >
            {label[type]}
        </Button>
    );
}

/**
 * Pagination.
 *
 * @param {Object} props
 * @param {string} props.next
 * @param {string} props.prev
 * @param {onChange} props.onChange
 * @returns {ReactElement}
 */
export default function Pagination({ next, prev, onChange }) {
    return (
        <div className="right">
            <ActionBtn type="prev" url={prev} onChange={onChange} />
            {next && prev && <Divider type="vertical" />}
            <ActionBtn type="next" url={next} onChange={onChange} />
        </div>
    );
}
