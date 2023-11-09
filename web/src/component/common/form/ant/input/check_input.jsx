import * as React from "react";
import { Checkbox } from "antd";

/**
 * TreeCheckInput.
 *
 * @param {Object} props
 * @param {number[]} props.value
 * @param {function} props.onChange
 */
export default function CheckInput({ value, onChange }) {
    return (
        <Checkbox
            checked={value}
            onChange={(e) => {
                onChange(e.target.checked);
            }}
        />
    );
}
