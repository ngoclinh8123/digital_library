import * as React from "react";
import { useState, useEffect } from "react";
import Util from "service/helper/util";
import Waiting from "component/common/waiting";

export default function Component() {
    const [spinning, setSpinning] = useState(false);

    const eventHandler = ({ detail: spinning }) => setSpinning(spinning);

    useEffect(() => {
        Util.event.listen("TOGGLE_SPINNER", eventHandler);
        return () => {
            Util.event.remove("TOGGLE_SPINNER", eventHandler);
        };
    }, []);

    return spinning ? <Waiting /> : null;
}
