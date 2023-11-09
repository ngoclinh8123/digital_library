import * as React from "react";
import { Transfer } from "antd";

export class Service {
    /**
     * parseInput.
     *
     * @param {number[]} value
     * @param {string} level
     * @returns {string[]}
     */
    static parseInput(value) {
        if (!value) return [];
        return value.map((i) => `${i}`);
    }

    /**
     * parseOutput.
     *
     * @param {string[]} value
     * @param {string} level
     * @returns {number[]}
     */
    static parseOutput(value) {
        return value.map((i) => parseInt(i));
    }
}

/**
 * @typedef {{key: string, title: string, description?: string}} Option
 */

/**
 * TransferInput.
 *
 * @param {Object} props
 * @param {number[]} value
 * @param {function} onChange - (number[]) => void
 * @param {Option[]} props.options
 * @param {boolean} props.disabled
 * @returns {ReactElement}
 */
export default function TransferInput({ value, onChange, options, disabled = false }) {
    return (
        <Transfer
            showSearch
            dataSource={options}
            targetKeys={Service.parseInput(value)}
            disabled={disabled}
            onChange={(i) => onChange(Service.parseOutput(i))}
            filterOption={(input, option) => {
                return (
                    option.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            }}
            render={(item) =>
                item.description ? `${item.title} - ${item.description}` : item.title
            }
            listStyle={{
                width: 458,
                height: 512
            }}
        />
    );
}
