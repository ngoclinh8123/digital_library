import * as React from "react";

/**
    @param {Object} props
    @param {ReactElement} props.children
*/
export default function PageHeading({ children }) {
    return (
        <div
            style={{
                backgroundColor: "#f5f5f5f5",
                lineHeight: "40px",
                fontWeight: "bold",
                paddingLeft: 5
            }}
        >
            {children}
        </div>
    );
}

PageHeading.displayName = "PageHeading";
